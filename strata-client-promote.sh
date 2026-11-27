#!/usr/bin/env bash
set -euo pipefail

VERSION=""
NPM_SNAPSHOTS=()
RELEASE_STAMP=""
DRY_RUN=false
FORCE=false
SKIP_MAVEN=false
SKIP_NPM=false

NAME="$(basename "$0")"

print_help() {
    cat <<EOF
Usage:
  $NAME --version <x.y.z> [--npm-snapshot <package>=<ver>]... [--release-stamp <ts>] [--dry-run] [--force] [--skip-maven] [--skip-npm]
  $NAME --help

Promotes published <version>-SNAPSHOT builds of Strata Client to release <version>.

  Maven (GitHub Packages, https://maven.pkg.github.com/StrataFrameworkSet/repository):
    Downloads strata-client-core, strata-client-resteasy, strata-client-spring
    at <version>-SNAPSHOT, rewrites the pom and module to <version>, and deploys them as <version>.
    An existing <version> is deleted (after confirmation) and republished.

  npm (https://registry.npmjs.org/), in order strata.client.core, strata.client.react,
  strata.client.mui, strata.client.blueprint:
    Takes each package from dist-tag snapshot-<version> (<version>-snapshot.<timestamp>),
    publishes it as <version>-release.<timestamp>, and points dist-tags release-<version>
    and latest at it. If that release version already exists, only the tags are moved.
    Every strata.* snapshot-<v> dependency in the published package.json becomes release-<v>;
    every other spec, including release-* dist-tags, is kept as is. A snapshot-<v> dependency
    fails unless its package is promoted in this run or release-<v> already exists.

Parameters:
  --version <x.y.z>               Release version to promote (required), e.g. 1.0.0
  --npm-snapshot <package>=<ver>  npm snapshot to promote for <package> instead of its
                                  snapshot-<version> dist-tag target (repeatable)
  --release-stamp <ts>            Publish as <version>-release.<ts> instead of reusing the
                                  snapshot timestamp (to republish an existing release)
  --dry-run                       Download and stage everything; print deletes, uploads and
                                  tags without changing any registry
  --force                         Do not prompt before deleting an existing Maven release
  --skip-maven                    Skip the Maven artifacts
  --skip-npm                      Skip the npm packages
  -h, --help                      Show this help

Environment:
  REPOSITORY_USER, REPOSITORY_PASSWORD   GitHub Packages credentials
                                         (token needs read, write and delete:packages)
  npm authentication for https://registry.npmjs.org/ comes from ~/.npmrc

Examples:
  $NAME --version 1.0.0 --dry-run
  $NAME --version 1.0.0 --skip-npm --force
  $NAME --version 1.0.0 --skip-maven
EOF
}

usage() {
    echo "usage: $NAME --version <x.y.z> [--npm-snapshot <package>=<ver>]... [--release-stamp <ts>] [--dry-run] [--force] [--skip-maven] [--skip-npm]" >&2
    echo "       $NAME --help" >&2
    exit 2
}

while [ $# -gt 0 ]; do
    case "$1" in
        --version)      [ $# -ge 2 ] || usage; VERSION="$2"; shift 2 ;;
        --npm-snapshot) [ $# -ge 2 ] || usage; NPM_SNAPSHOTS+=("$2"); shift 2 ;;
        --release-stamp) [ $# -ge 2 ] || usage; RELEASE_STAMP="$2"; shift 2 ;;
        --dry-run)      DRY_RUN=true; shift ;;
        --force)        FORCE=true; shift ;;
        --skip-maven)   SKIP_MAVEN=true; shift ;;
        --skip-npm)     SKIP_NPM=true; shift ;;
        -h|--help)      print_help; exit 0 ;;
        *)              echo "unknown option: $1" >&2; usage ;;
    esac
done
[ -n "$VERSION" ] || usage

OWNER="StrataFrameworkSet"
MAVEN_REPO="https://maven.pkg.github.com/$OWNER/repository"
GROUP_ID="strata.client"
GROUP_PATH="${GROUP_ID//.//}"
ARTIFACTS=(
    strata-client-core
    strata-client-resteasy
    strata-client-spring
)
NPM_PACKAGES=(
    strata.client.core
    strata.client.react
    strata.client.mui
    strata.client.blueprint
)
declare -A NPM_SNAPSHOT_FOR=()
declare -A NPM_RELEASED=()
NPM_REGISTRY="https://registry.npmjs.org/"
NPM_VISIBLE_TIMEOUT_SECONDS=300
SNAPSHOT="$VERSION-SNAPSHOT"
CHECKSUMS=(sha512 sha256 md5 sha1)

step() { printf '\033[36m==> %s\033[0m\n' "$*"; }
info() { printf '    %s\n' "$*"; }
plan() { printf '\033[33m    [dry-run] %s\033[0m\n' "$*"; }
die()  { echo "strata-client-promote: $*" >&2; exit 1; }

confirm() {
    $FORCE && return 0
    local answer
    read -r -p "    $1 [y/N] " answer
    [[ "$answer" =~ ^(y|yes)$ ]]
}

http_status() {
    local url="$1"; shift
    curl -s -o /dev/null -w '%{http_code}' "$@" "$url" || true
}

regex_escape() { printf '%s' "$1" | sed 's/[][\.*^$/]/\\&/g'; }

xml_value() { printf '%s' "$1" | sed -n "s#.*<$2>\([^<]*\)</$2>.*#\1#p"; }

new_auth_configs() {
    [ -n "${REPOSITORY_USER:-}" ] && [ -n "${REPOSITORY_PASSWORD:-}" ] \
        || die "REPOSITORY_USER and REPOSITORY_PASSWORD must be set"
    MAVEN_AUTH="$WORK/maven.curlrc"
    API_AUTH="$WORK/api.curlrc"
    ( umask 077
      printf 'user = "%s:%s"\n' "$REPOSITORY_USER" "$REPOSITORY_PASSWORD" > "$MAVEN_AUTH"
      {
          printf 'header = "Authorization: Bearer %s"\n' "$REPOSITORY_PASSWORD"
          printf 'header = "Accept: application/vnd.github+json"\n'
          printf 'header = "X-GitHub-Api-Version: 2022-11-28"\n'
      } > "$API_AUTH" )
}

find_package_version_url() {
    local artifact_id="$1" name="$GROUP_ID.$1" scope page json result
    for scope in "orgs/$OWNER" "users/$OWNER"; do
        page=1
        while true; do
            json=$(curl -sS -f -K "$API_AUTH" \
                "https://api.github.com/$scope/packages/maven/$name/versions?per_page=100&page=$page" 2>/dev/null) || break
            result=$(printf '%s' "$json" | node -e '
                let s = "";
                process.stdin.on("data", d => s += d).on("end", () => {
                    const v = JSON.parse(s);
                    if (!Array.isArray(v) || v.length === 0) { process.stdout.write("END"); return; }
                    const m = v.find(x => x.name === process.argv[1]);
                    process.stdout.write(m ? String(m.id) : "");
                });' "$VERSION")
            [ "$result" = "END" ] && break
            if [ -n "$result" ]; then
                printf '%s %s' "$result" "https://api.github.com/$scope/packages/maven/$name/versions/$result"
                return 0
            fi
            page=$((page + 1))
        done
    done
    return 1
}

write_checksums() {
    local path="$1" algo
    for algo in "${CHECKSUMS[@]}"; do
        "${algo}sum" "$path" | cut -d' ' -f1 | tr -d '\n' > "$path.$algo"
        FILES+=("$path.$algo")
    done
}

verify_download() {
    local path="$1" ext="$2" ok=true
    case "$ext" in
        jar)    [ "$(head -c 2 "$path")" = "PK" ] || ok=false ;;
        pom)    grep -q '<project' "$path" || ok=false ;;
        module) [ "$(tr -d ' \t\r\n' < "$path" | head -c 1)" = "{" ] || ok=false ;;
    esac
    $ok || die "$(basename "$path") is not a valid .$ext file (starts with: $(head -c 60 "$path" | tr -d '\r\n'))"
}

maven_promote() {
    local artifact_id="$1"
    local base="$MAVEN_REPO/$GROUP_PATH/$artifact_id"
    local dir="$WORK/$artifact_id"
    local meta entries entry ext cls val classifier source target path text found
    step "Maven $GROUP_ID:$artifact_id $SNAPSHOT -> $VERSION"
    mkdir -p "$dir"

    meta=$(curl -sS -f -L -K "$MAVEN_AUTH" "$base/$SNAPSHOT/maven-metadata.xml") \
        || die "GET failed: $base/$SNAPSHOT/maven-metadata.xml"
    meta=$(printf '%s' "$meta" | tr -d '\r\n')
    local build ts bn current
    build=$(printf '%s' "$meta" | sed -n 's#.*<snapshot>\(.*\)</snapshot>.*#\1#p')
    ts=$(xml_value "$build" timestamp)
    bn=$(xml_value "$build" buildNumber)
    [ -n "$ts" ] && [ -n "$bn" ] || die "no current snapshot build listed for $artifact_id $SNAPSHOT"
    current="$VERSION-$ts-$bn"
    info "snapshot build: $current"
    entries=$(printf '%s' "$meta" | sed 's#</snapshotVersion>#&\n#g' | grep '<snapshotVersion>' || true)
    [ -n "$entries" ] || die "no snapshot files listed for $artifact_id $SNAPSHOT"

    FILES=()
    found=0
    while IFS= read -r entry; do
        ext=$(xml_value "$entry" extension)
        cls=$(xml_value "$entry" classifier)
        val=$(xml_value "$entry" value)
        [ "$val" = "$current" ] || continue
        case "$ext" in *.sha1|*.md5|*.sha256|*.sha512) continue ;; esac
        classifier=""
        [ -n "$cls" ] && classifier="-$cls"
        source="$artifact_id-$val$classifier.$ext"
        target="$artifact_id-$VERSION$classifier.$ext"
        path="$dir/$target"
        curl -sS -f -L -K "$MAVEN_AUTH" -o "$path" "$base/$SNAPSHOT/$source" || die "download failed: $base/$SNAPSHOT/$source"
        verify_download "$path" "$ext"
        if [ "$ext" = "pom" ] || [ "$ext" = "module" ]; then
            sed -i "s/$(regex_escape "$val")/$VERSION/g; s/$(regex_escape "$SNAPSHOT")/$VERSION/g" "$path"
            if grep -qF -e "$SNAPSHOT" -e "$val" "$path"; then
                die "$target still references $SNAPSHOT after rewrite"
            fi
            info "rewrote $target (no $SNAPSHOT references remain)"
        fi
        FILES+=("$path")
        write_checksums "$path"
        info "staged $target  <=  $source"
        found=$((found + 1))
    done <<< "$entries"
    [ "$found" -gt 0 ] || die "no files listed for snapshot build $current of $artifact_id"

    local release_pom="$base/$VERSION/$artifact_id-$VERSION.pom" existing pom_status id url
    existing=$(find_package_version_url "$artifact_id") || existing=""
    pom_status=$(http_status "$release_pom" -K "$MAVEN_AUTH")
    if [ -n "$existing" ] || [[ "$pom_status" =~ ^(200|301|302|303|307|308)$ ]]; then
        [ -n "$existing" ] \
            || die "$artifact_id $VERSION exists but its GitHub package version id could not be found"
        id="${existing%% *}"
        url="${existing#* }"
        if $DRY_RUN; then
            plan "would DELETE existing $artifact_id $VERSION (package version id $id)"
        elif confirm "$artifact_id $VERSION already exists. Delete it and republish?"; then
            curl -sS -f -K "$API_AUTH" -X DELETE "$url" > /dev/null \
                || die "delete failed for $artifact_id $VERSION (token needs delete:packages)"
            info "deleted existing $artifact_id $VERSION"
        else
            info "skipped $artifact_id (existing $VERSION kept)"
            return 1
        fi
    else
        info "$artifact_id $VERSION does not exist yet"
    fi

    local file
    for file in "${FILES[@]}"; do
        url="$base/$VERSION/$(basename "$file")"
        if $DRY_RUN; then
            plan "would PUT $url"
        else
            curl -sS -f -K "$MAVEN_AUTH" -T "$file" "$url" > /dev/null || die "upload failed: $url"
        fi
    done
    $DRY_RUN || info "published $artifact_id $VERSION (${#FILES[@]} files)"
    return 0
}

npm_version_exists() {
    local found
    found=$(npm view "$1@$2" version --registry "$3" --prefer-online 2>/dev/null) || return 1
    [ -n "$found" ]
}

write_pin_script() {
    PIN_SCRIPT="$WORK/pin-dependencies.js"
    cat > "$PIN_SCRIPT" <<'EOF'
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
EOF
}

write_released_json() {
    local file="$WORK/released.json" sep="" name
    {
        printf '{'
        for name in "${!NPM_RELEASED[@]}"; do
            printf '%s"%s":"%s"' "$sep" "$name" "${NPM_RELEASED[$name]}"
            sep=","
        done
        printf '}\n'
    } > "$file"
    printf '%s' "$file"
}

npm_promote() {
    local package="$1"
    local registry="$NPM_REGISTRY"
    local tag="snapshot-$VERSION"
    local release_tag="release-$VERSION"
    local source stamp release dir tarball manifest pinned existing dist_tag line
    step "npm $package $tag -> $release_tag ($registry)"

    source="${NPM_SNAPSHOT_FOR[$package]:-}"
    if [ -z "$source" ]; then
        source=$(npm view "$package" dist-tags --json --registry "$registry" | node -e '
            let s = "";
            process.stdin.on("data", d => s += d).on("end", () => {
                const t = JSON.parse(s);
                process.stdout.write(t[process.argv[1]] || "");
            });' "$tag") || die "npm view dist-tags failed for $package"
        [ -n "$source" ] || die "dist-tag $tag not found for $package on $registry"
    fi
    stamp=$(printf '%s' "$source" | sed -n "s/^$(regex_escape "$VERSION")-snapshot\.\([0-9][0-9]*\)$/\1/p")
    [ -n "$stamp" ] || die "$source is not a $VERSION-snapshot.<timestamp> version"
    release="$VERSION-release.${RELEASE_STAMP:-$stamp}"
    info "source snapshot: $package@$source"
    info "release version: $package@$release"

    if npm_version_exists "$package" "$release" "$registry"; then
        info "$package@$release already exists; only the tags will be moved"
        existing=$(npm view "$package@$release" dependencies --json --registry "$registry" 2>/dev/null || true)
        if printf '%s' "$existing" | grep -q '"strata\.[^"]*": *"\(snapshot-\|[0-9]\)'; then
            info "WARNING: $package@$release depends on a snapshot-* dist-tag or an exact version: $(printf '%s' "$existing" | tr -d '\r\n ')"
        fi
    else
        info "$package@$release does not exist yet"
        dir="$WORK/npm/$package"
        mkdir -p "$dir"
        tarball=$(cd "$dir" && npm pack "$package@$source" --registry "$registry" --silent | tail -n 1) \
            || die "npm pack $package@$source failed"
        tar -xzf "$dir/$tarball" -C "$dir" || die "could not extract $tarball"

        manifest="$dir/package/package.json"
        pinned=$(node "$PIN_SCRIPT" "$manifest" "$source" "$release" "$(write_released_json)" "$registry") \
            || die "could not rewrite staged package.json for $package"
        while IFS= read -r line; do info "staged $line"; done <<< "$pinned"

        if $DRY_RUN; then
            plan "would PUBLISH $package@$release to $registry with dist-tag $release_tag"
        else
            npm publish "$dir/package" --registry "$registry" --tag "$release_tag" > /dev/null \
                || die "npm publish $package@$release failed"
            info "npm published $package@$release (dist-tag $release_tag); waiting for it to become visible"
            local waited=0
            until npm_version_exists "$package" "$release" "$registry"; do
                [ "$waited" -lt "$NPM_VISIBLE_TIMEOUT_SECONDS" ] \
                    || die "$package@$release is not visible on $registry after ${NPM_VISIBLE_TIMEOUT_SECONDS}s; check 'npm view $package dist-tags' before re-running"
                sleep 15
                waited=$((waited + 15))
            done
            info "published $package@$release"
        fi
    fi
    NPM_RELEASED[$package]="$release"

    for dist_tag in "$release_tag" latest; do
        if $DRY_RUN; then
            plan "would TAG $package@$release as $dist_tag"
        else
            npm dist-tag add "$package@$release" "$dist_tag" --registry "$registry" > /dev/null \
                || die "npm dist-tag add $dist_tag failed for $package"
            info "tagged $dist_tag -> $release"
        fi
    done
    return 0
}

shopt -s nocasematch
[[ "$VERSION" == *snapshot* ]] && die "pass the release version (e.g. 1.0.0), not a snapshot"
shopt -u nocasematch

[ -z "$RELEASE_STAMP" ] || [[ "$RELEASE_STAMP" =~ ^[0-9]+$ ]] || die "--release-stamp must be a number, got '$RELEASE_STAMP'"

for entry in "${NPM_SNAPSHOTS[@]}"; do
    pkg="${entry%%=*}"
    ver="${entry#*=}"
    [ "$pkg" != "$entry" ] && [ -n "$pkg" ] && [ -n "$ver" ] || die "--npm-snapshot expects <package>=<version>, got '$entry'"
    [[ " ${NPM_PACKAGES[*]} " == *" $pkg "* ]] || die "--npm-snapshot: unknown package '$pkg' (expected one of: ${NPM_PACKAGES[*]})"
    NPM_SNAPSHOT_FOR[$pkg]="$ver"
done

WORK=$(mktemp -d "${TMPDIR:-/tmp}/strata-client-promote-XXXXXX")
trap 'rm -rf "$WORK"' EXIT
SKIPPED=()

$DRY_RUN && step "DRY RUN: no registry will be changed"
if ! $SKIP_MAVEN; then
    new_auth_configs
    for artifact_id in "${ARTIFACTS[@]}"; do
        maven_promote "$artifact_id" || SKIPPED+=("maven:$artifact_id")
    done
fi
if ! $SKIP_NPM; then
    [ "$(http_status "${NPM_REGISTRY}-/ping")" != "000" ] \
        || die "npm registry $NPM_REGISTRY is not reachable"
    write_pin_script
    for package in "${NPM_PACKAGES[@]}"; do
        npm_promote "$package"
    done
fi
if [ ${#SKIPPED[@]} -gt 0 ]; then
    step "Done; skipped: ${SKIPPED[*]}"
else
    step "Done"
fi
