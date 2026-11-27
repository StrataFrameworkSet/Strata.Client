[CmdletBinding(DefaultParameterSetName = 'Run')]
param(
    [Parameter(Mandatory = $true, ParameterSetName = 'Run')][string]$Version,
    [string[]]$NpmSnapshot,
    [string]$ReleaseStamp,
    [switch]$DryRun,
    [switch]$Force,
    [switch]$SkipMaven,
    [switch]$SkipNpm,
    [Parameter(Mandatory = $true, ParameterSetName = 'Help')][switch]$Help
)

$ErrorActionPreference = 'Stop'

$Owner      = 'StrataFrameworkSet'
$MavenRepo  = "https://maven.pkg.github.com/$Owner/repository"
$GroupId    = 'strata.client'
$GroupPath  = $GroupId.Replace('.', '/')
$Artifacts  = @(
    'strata-client-core',
    'strata-client-resteasy',
    'strata-client-spring'
)
$NpmPackages = @(
    'strata.client.core',
    'strata.client.react',
    'strata.client.mui',
    'strata.client.blueprint'
)
$NpmSnapshotFor = @{}
$NpmReleased    = @{}
$NpmPending     = New-Object System.Collections.Generic.List[string]
$NpmRegistry = 'https://registry.npmjs.org/'
$NpmVisibleTimeoutSeconds = 600
$Snapshot    = "$Version-SNAPSHOT"
$Checksums  = @{ sha1 = 'SHA1'; md5 = 'MD5'; sha256 = 'SHA256'; sha512 = 'SHA512' }
$Utf8NoBom  = New-Object System.Text.UTF8Encoding $false

function Write-Step([string]$Message) { Write-Host "==> $Message" -ForegroundColor Cyan }
function Write-Info([string]$Message) { Write-Host "    $Message" }
function Write-Plan([string]$Message) { Write-Host "    [dry-run] $Message" -ForegroundColor Yellow }
function Stop-Promote([string]$Message) { throw "strata-client-promote: $Message" }

function Confirm-Action([string]$Message) {
    if ($Force) { return $true }
    $answer = Read-Host "    $Message [y/N]"
    return ($answer -match '^(y|yes)$')
}

function Get-HttpStatus([string]$Url, [string]$AuthConfig) {
    $arguments = @('-s', '-o', 'NUL', '-w', '%{http_code}')
    if ($AuthConfig) { $arguments += @('-K', $AuthConfig) }
    $code = & curl.exe @arguments $Url
    return [int]$code
}

function Get-Url([string]$Url, [string]$AuthConfig) {
    $output = & curl.exe -sS -f -L -K $AuthConfig $Url
    if ($LASTEXITCODE -ne 0) { Stop-Promote "GET failed: $Url" }
    return ($output -join "`n")
}

function Save-Url([string]$Url, [string]$Destination, [string]$AuthConfig) {
    & curl.exe -sS -f -L -K $AuthConfig -o $Destination $Url
    if ($LASTEXITCODE -ne 0) { Stop-Promote "download failed: $Url" }
}

function Test-Download([string]$Path, [string]$Extension) {
    $bytes = [System.IO.File]::ReadAllBytes($Path)
    $text  = [System.Text.Encoding]::UTF8.GetString($bytes)
    $ok = switch ($Extension) {
        'jar'    { $bytes.Length -ge 2 -and $bytes[0] -eq 0x50 -and $bytes[1] -eq 0x4B }
        'pom'    { $text.Contains('<project') }
        'module' { $text.TrimStart().StartsWith('{') }
        default  { $true }
    }
    if (-not $ok) {
        $start = $text.Substring(0, [Math]::Min(60, $text.Length)) -replace '[\r\n]', ''
        Stop-Promote "$(Split-Path -Leaf $Path) is not a valid .$Extension file (starts with: $start)"
    }
}

function Send-File([string]$Path, [string]$Url, [string]$AuthConfig) {
    & curl.exe -sS -f -K $AuthConfig -T $Path $Url | Out-Null
    if ($LASTEXITCODE -ne 0) { Stop-Promote "upload failed: $Url" }
}

function New-AuthConfigs([string]$WorkDir) {
    if (-not $env:REPOSITORY_USER -or -not $env:REPOSITORY_PASSWORD) {
        Stop-Promote 'REPOSITORY_USER and REPOSITORY_PASSWORD must be set'
    }
    $maven = Join-Path $WorkDir 'maven.curlrc'
    $api   = Join-Path $WorkDir 'api.curlrc'
    [System.IO.File]::WriteAllText($maven, "user = `"$($env:REPOSITORY_USER):$($env:REPOSITORY_PASSWORD)`"`n", $Utf8NoBom)
    [System.IO.File]::WriteAllText($api, (@(
        "header = `"Authorization: Bearer $($env:REPOSITORY_PASSWORD)`"",
        'header = "Accept: application/vnd.github+json"',
        'header = "X-GitHub-Api-Version: 2022-11-28"'
    ) -join "`n") + "`n", $Utf8NoBom)
    return @{ Maven = $maven; Api = $api }
}

function Get-PackageVersion([string]$ArtifactId, [string]$ApiAuth) {
    $name = "$GroupId.$ArtifactId"
    foreach ($scope in @("orgs/$Owner", "users/$Owner")) {
        $page = 1
        while ($true) {
            $url  = "https://api.github.com/$scope/packages/maven/$name/versions?per_page=100&page=$page"
            $json = & curl.exe -sS -f -K $ApiAuth $url 2>$null
            if ($LASTEXITCODE -ne 0) { break }
            $parsed   = ($json -join "`n") | ConvertFrom-Json
            $versions = @($parsed | ForEach-Object { $_ })
            if ($versions.Count -eq 0) { break }
            $match = @($versions | Where-Object { $_.name -eq $Version })
            if ($match.Count -gt 1) { Stop-Promote "multiple GitHub package versions named $Version for $name" }
            $match = $match | Select-Object -First 1
            if ($match) { return @{ Url = "https://api.github.com/$scope/packages/maven/$name/versions/$($match.id)"; Id = $match.id } }
            $page++
        }
    }
    return $null
}

function Write-Checksums([string]$Path) {
    $files = @()
    foreach ($ext in $Checksums.Keys) {
        $hash = (Get-FileHash -Path $Path -Algorithm $Checksums[$ext]).Hash.ToLowerInvariant()
        $out  = "$Path.$ext"
        [System.IO.File]::WriteAllText($out, $hash, $Utf8NoBom)
        $files += $out
    }
    return $files
}

function Invoke-MavenPromote([string]$ArtifactId, [hashtable]$Auth, [string]$WorkDir) {
    Write-Step "Maven $GroupId`:$ArtifactId $Snapshot -> $Version"
    $base = "$MavenRepo/$GroupPath/$ArtifactId"
    $dir  = Join-Path $WorkDir $ArtifactId
    New-Item -ItemType Directory -Path $dir | Out-Null

    [xml]$meta = Get-Url "$base/$Snapshot/maven-metadata.xml" $Auth.Maven
    $build = $meta.metadata.versioning.snapshot
    if (-not $build -or -not $build.timestamp -or -not $build.buildNumber) {
        Stop-Promote "no current snapshot build listed for $ArtifactId $Snapshot"
    }
    $current = "$Version-$($build.timestamp)-$($build.buildNumber)"
    Write-Info "snapshot build: $current"
    $entries = @($meta.metadata.versioning.snapshotVersions.snapshotVersion |
        Where-Object { $_.value -eq $current -and $_.extension -notmatch '\.(sha1|md5|sha256|sha512)$' })
    if ($entries.Count -eq 0) { Stop-Promote "no files listed for snapshot build $current of $ArtifactId" }

    $files = @()
    foreach ($entry in $entries) {
        $classifier = if ($entry.classifier) { "-$($entry.classifier)" } else { '' }
        $source = "$ArtifactId-$($entry.value)$classifier.$($entry.extension)"
        $target = "$ArtifactId-$Version$classifier.$($entry.extension)"
        $path   = Join-Path $dir $target
        Save-Url "$base/$Snapshot/$source" $path $Auth.Maven
        Test-Download $path $entry.extension
        if ($entry.extension -in @('pom', 'module')) {
            $text = [System.IO.File]::ReadAllText($path)
            $text = $text.Replace($entry.value, $Version).Replace($Snapshot, $Version)
            [System.IO.File]::WriteAllText($path, $text, $Utf8NoBom)
            if ($text.Contains($Snapshot) -or $text.Contains($entry.value)) {
                Stop-Promote "$target still references $Snapshot after rewrite"
            }
            Write-Info "rewrote $target (no $Snapshot references remain)"
        }
        $files += $path
        $files += Write-Checksums $path
        Write-Info "staged $target  <=  $source"
    }

    $releasePom = "$base/$Version/$ArtifactId-$Version.pom"
    $existing   = Get-PackageVersion $ArtifactId $Auth.Api
    $pomStatus  = Get-HttpStatus $releasePom $Auth.Maven
    if ($existing -or $pomStatus -in @(200, 301, 302, 303, 307, 308)) {
        if (-not $existing) { Stop-Promote "$ArtifactId $Version exists but its GitHub package version id could not be found" }
        if ($DryRun) {
            Write-Plan "would DELETE existing $ArtifactId $Version (package version id $($existing.Id))"
        } elseif (Confirm-Action "$ArtifactId $Version already exists. Delete it and republish?") {
            & curl.exe -sS -f -K $Auth.Api -X DELETE $existing.Url | Out-Null
            if ($LASTEXITCODE -ne 0) { Stop-Promote "delete failed for $ArtifactId $Version (token needs delete:packages)" }
            Write-Info "deleted existing $ArtifactId $Version"
        } else {
            Write-Info "skipped $ArtifactId (existing $Version kept)"
            return $false
        }
    } else {
        Write-Info "$ArtifactId $Version does not exist yet"
    }

    foreach ($file in $files) {
        $url = "$base/$Version/$(Split-Path -Leaf $file)"
        if ($DryRun) { Write-Plan "would PUT $url" } else { Send-File $file $url $Auth.Maven }
    }
    if (-not $DryRun) { Write-Info "published $ArtifactId $Version ($($files.Count) files)" }
    return $true
}

function Invoke-Npm([string[]]$Arguments) {
    $output = & npm.cmd @Arguments
    if ($LASTEXITCODE -ne 0) { Stop-Promote "npm $($Arguments -join ' ') failed" }
    return $output
}

function Test-NpmVersion([string]$Package, [string]$Ver, [string]$Registry) {
    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    $found = & npm.cmd view "$Package@$Ver" version --registry $Registry --prefer-online 2>$null
    $code  = $LASTEXITCODE
    $ErrorActionPreference = $previous
    return ($code -eq 0 -and [bool]$found)
}

$PinScript = @'
const fs = require("fs");
const { execFileSync } = require("child_process");
const [manifest, from, to, releasedFile, registry] = process.argv.slice(2);
const version = to.replace(/-release\..*$/, "");
const released = JSON.parse(fs.readFileSync(releasedFile, "utf8"));
const fail = m => { console.error(m); process.exit(1); };
const j = JSON.parse(fs.readFileSync(manifest, "utf8"));
if (j.version !== from) fail("version " + from + " not found in staged package.json");
j.version = to;
const notes = ["version: " + from + " -> " + to];
for (const field of ["dependencies", "peerDependencies", "optionalDependencies"]) {
    const deps = j[field];
    if (!deps) continue;
    for (const [name, spec] of Object.entries(deps)) {
        if (!name.startsWith("strata.")) continue;
        const snapshot = /^snapshot-(.+)$/.exec(spec);
        if (!snapshot) continue;
        const tag = "release-" + snapshot[1];
        if (!(released[name] && snapshot[1] === version)) {
            let resolved = "";
            try {
                resolved = execFileSync("npm", ["view", name + "@" + tag, "version", "--registry", registry],
                    { encoding: "utf8", shell: process.platform === "win32", stdio: ["ignore", "pipe", "ignore"] }).trim();
            } catch (e) {}
            if (!/^\d+\.\d+\.\d+\S*$/.test(resolved)) fail(field + " " + name + "@" + spec + " is not promoted in this run and " + name + "@" + tag + " does not exist");
        }
        deps[name] = tag;
        notes.push(field + " " + name + ": " + spec + " -> " + tag);
    }
}
fs.writeFileSync(manifest, JSON.stringify(j, null, 2) + "\n");
process.stdout.write(notes.join("\n"));
'@

function Write-PinScript([string]$WorkDir) {
    $path = Join-Path $WorkDir 'pin-dependencies.js'
    [System.IO.File]::WriteAllText($path, $PinScript, $Utf8NoBom)
    return $path
}

function Write-ReleasedJson([string]$WorkDir) {
    $path  = Join-Path $WorkDir 'released.json'
    $pairs = @($NpmReleased.Keys | ForEach-Object { '"' + $_ + '":"' + $NpmReleased[$_] + '"' })
    [System.IO.File]::WriteAllText($path, '{' + ($pairs -join ',') + '}', $Utf8NoBom)
    return $path
}

function Invoke-NpmPromote([string]$Package, [string]$PinScriptPath, [string]$WorkDir) {
    $registry   = $NpmRegistry
    $tag        = "snapshot-$Version"
    $releaseTag = "release-$Version"
    Write-Step "npm $Package $tag -> $releaseTag ($registry)"

    $source = $NpmSnapshotFor[$Package]
    if (-not $source) {
        $tags = (Invoke-Npm @('view', $Package, 'dist-tags', '--json', '--registry', $registry)) -join "`n" | ConvertFrom-Json
        $source = $tags.$tag
        if (-not $source) { Stop-Promote "dist-tag $tag not found for $Package on $registry" }
    }
    $stamp = [regex]::Match($source, '^' + [regex]::Escape($Version) + '-snapshot\.(\d+)$')
    if (-not $stamp.Success) { Stop-Promote "$source is not a $Version-snapshot.<timestamp> version" }
    $release = if ($ReleaseStamp) { "$Version-release.$ReleaseStamp" } else { "$Version-release.$($stamp.Groups[1].Value)" }
    Write-Info "source snapshot: $Package@$source"
    Write-Info "release version: $Package@$release"

    if (Test-NpmVersion $Package $release $registry) {
        Write-Info "$Package@$release already exists; only the tags will be moved"
        $previous = $ErrorActionPreference
        $ErrorActionPreference = 'Continue'
        $existing = (& npm.cmd view "$Package@$release" dependencies --json --registry $registry 2>$null) -join ''
        $ErrorActionPreference = $previous
        if ($existing -match '"strata\.[^"]*"\s*:\s*"(snapshot-|\d)') {
            Write-Info "WARNING: $Package@$release depends on a snapshot-* dist-tag or an exact version: $($existing -replace '\s', '')"
        }
    } else {
        Write-Info "$Package@$release does not exist yet"
        $dir = Join-Path (Join-Path $WorkDir 'npm') $Package
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Push-Location $dir
        try {
            $tarball = (Invoke-Npm @('pack', "$Package@$source", '--registry', $registry, '--silent')) | Select-Object -Last 1
        } finally {
            Pop-Location
        }
        $tar = Join-Path $env:SystemRoot 'System32\tar.exe'
        if (-not (Test-Path $tar)) { $tar = 'tar.exe' }
        & $tar -xzf (Join-Path $dir $tarball) -C $dir
        if ($LASTEXITCODE -ne 0) { Stop-Promote "could not extract $tarball" }

        $manifest = Join-Path $dir 'package\package.json'
        $released = Write-ReleasedJson $WorkDir
        $pinned   = & node.exe $PinScriptPath $manifest $source $release $released $registry
        if ($LASTEXITCODE -ne 0) { Stop-Promote "could not rewrite staged package.json for $Package" }
        foreach ($line in @($pinned)) { Write-Info "staged $line" }

        if ($DryRun) {
            Write-Plan "would PUBLISH $Package@$release to $registry with dist-tag $releaseTag"
        } else {
            Invoke-Npm @('publish', (Join-Path $dir 'package'), '--registry', $registry, '--tag', $releaseTag) | Out-Null
            Write-Info "npm published $Package@$release (dist-tag $releaseTag)"
            $NpmPending.Add($Package)
        }
    }
    $NpmReleased[$Package] = $release

    if (-not $NpmPending.Contains($Package)) { Set-NpmTags $Package $release }
    return $true
}

function Set-NpmTags([string]$Package, [string]$Release) {
    foreach ($distTag in @("release-$Version", 'latest')) {
        if ($DryRun) {
            Write-Plan "would TAG $Package@$Release as $distTag"
        } else {
            Invoke-Npm @('dist-tag', 'add', "$Package@$Release", $distTag, '--registry', $NpmRegistry) | Out-Null
            Write-Info "tagged $distTag -> $Release"
        }
    }
}

function Complete-NpmPending {
    $remaining = @($NpmPending)
    if ($remaining.Count -eq 0) { return }
    Write-Step "Waiting for $($remaining.Count) published package(s) to become visible on $NpmRegistry"
    $deadline = (Get-Date).AddSeconds($NpmVisibleTimeoutSeconds)
    while ($true) {
        $still = @()
        foreach ($package in $remaining) {
            $release = $NpmReleased[$package]
            if (Test-NpmVersion $package $release $NpmRegistry) {
                Write-Info "visible: $package@$release"
                Set-NpmTags $package $release
            } else {
                $still += $package
            }
        }
        if ($still.Count -eq 0) { return }
        $remaining = $still
        if ((Get-Date) -gt $deadline) {
            Stop-Promote "not visible on $NpmRegistry after $NpmVisibleTimeoutSeconds s: $($remaining -join ', '); re-run with the same -ReleaseStamp to move their tags"
        }
        Start-Sleep -Seconds 15
    }
}

function Show-Help {
    $name = Split-Path -Leaf $PSCommandPath
    Write-Host @"
Usage:
  $name -Version <x.y.z> [-NpmSnapshot <package>=<ver>[,...]] [-ReleaseStamp <ts>] [-DryRun] [-Force] [-SkipMaven] [-SkipNpm]
  $name -Help

Promotes published <version>-SNAPSHOT builds of Strata Client to release <version>.

  Maven (GitHub Packages, $MavenRepo):
    Downloads $($Artifacts -join ', ')
    at <version>-SNAPSHOT, rewrites the pom and module to <version>, and deploys them as <version>.
    An existing <version> is deleted (after confirmation) and republished.

  npm ($NpmRegistry), in order $($NpmPackages -join ', '):
    Takes each package from dist-tag snapshot-<version> (<version>-snapshot.<timestamp>),
    publishes it as <version>-release.<timestamp>, and points dist-tags release-<version>
    and latest at it. If that release version already exists, only the tags are moved.
    Every package is published first; latest is moved once its new version is visible.
    Every strata.* snapshot-<v> dependency in the published package.json becomes release-<v>;
    every other spec, including release-* dist-tags, is kept as is. A snapshot-<v> dependency
    fails unless its package is promoted in this run or release-<v> already exists.

Parameters:
  -Version <x.y.z>                    Release version to promote (required), e.g. 1.0.0
  -NpmSnapshot <package>=<ver>[,...]  npm snapshot to promote for <package> instead of its
                                      snapshot-<version> dist-tag target
  -ReleaseStamp <ts>                  Publish as <version>-release.<ts> instead of reusing the
                                      snapshot timestamp (to republish an existing release)
  -DryRun                             Download and stage everything; print deletes, uploads
                                      and tags without changing any registry
  -Force                              Do not prompt before deleting an existing Maven release
  -SkipMaven                          Skip the Maven artifacts
  -SkipNpm                            Skip the npm packages
  -Help                               Show this help

Environment:
  REPOSITORY_USER, REPOSITORY_PASSWORD   GitHub Packages credentials
                                         (token needs read, write and delete:packages)
  npm authentication for $NpmRegistry comes from ~/.npmrc

Examples:
  $name -Version 1.0.0 -DryRun
  $name -Version 1.0.0 -SkipNpm -Force
  $name -Version 1.0.0 -SkipMaven
"@
}

if ($Help) { Show-Help; return }

if ($Version -match '(?i)snapshot') { Stop-Promote "pass the release version (e.g. 1.0.0), not a snapshot" }

if ($ReleaseStamp -and $ReleaseStamp -notmatch '^\d+$') { Stop-Promote "-ReleaseStamp must be a number, got '$ReleaseStamp'" }

foreach ($entry in @($NpmSnapshot | Where-Object { $_ })) {
    $parts = $entry -split '=', 2
    if ($parts.Count -ne 2 -or -not $parts[0] -or -not $parts[1]) { Stop-Promote "-NpmSnapshot expects <package>=<version>, got '$entry'" }
    if ($NpmPackages -notcontains $parts[0]) { Stop-Promote "-NpmSnapshot: unknown package '$($parts[0])' (expected one of: $($NpmPackages -join ', '))" }
    $NpmSnapshotFor[$parts[0]] = $parts[1]
}

$work = Join-Path ([System.IO.Path]::GetTempPath()) ("strata-client-promote-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $work | Out-Null
$skipped = @()
try {
    if ($DryRun) { Write-Step 'DRY RUN: no registry will be changed' }
    if (-not $SkipMaven) {
        $auth = New-AuthConfigs $work
        foreach ($artifactId in $Artifacts) {
            if (-not (Invoke-MavenPromote $artifactId $auth $work)) { $skipped += "maven:$artifactId" }
        }
    }
    if (-not $SkipNpm) {
        $ping = Get-HttpStatus "$($NpmRegistry)-/ping" $null
        if ($ping -eq 0) { Stop-Promote "npm registry $NpmRegistry is not reachable" }
        $pinScriptPath = Write-PinScript $work
        foreach ($package in $NpmPackages) {
            Invoke-NpmPromote $package $pinScriptPath $work | Out-Null
        }
        Complete-NpmPending
    }
    if ($skipped.Count -gt 0) { Write-Step "Done; skipped: $($skipped -join ', ')" } else { Write-Step 'Done' }
} finally {
    Remove-Item -Recurse -Force $work -ErrorAction SilentlyContinue
}
