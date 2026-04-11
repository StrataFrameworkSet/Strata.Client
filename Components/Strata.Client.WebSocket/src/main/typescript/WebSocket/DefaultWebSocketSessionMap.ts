import {IWebSocketSessionMap} from "./IWebSocketSessionMap";

export class DefaultWebSocketSessionMap implements IWebSocketSessionMap
{
    private readonly map: Map<string, Set<WebSocket>> = new Map();

    public addSession(path: string, session: WebSocket): void
    {
        if (!this.map.has(path)) {
            this.map.set(path, new Set<WebSocket>());
        }
        this.map.get(path)!.add(session);
    }

    public removeSession(path: string, session: WebSocket): void
    {
        const sessions = this.map.get(path);
        if (sessions) {
            sessions.delete(session);
            if (sessions.size === 0) {
                this.map.delete(path);
            }
        }
    }

    public getSessions(path: string): Set<WebSocket>
    {
        return this.map.get(path) || new Set<WebSocket>();
    }

    public getAllSessions(): Set<WebSocket>
    {
        const allSessions = new Set<WebSocket>();
        for (const sessions of this.map.values()) {
            sessions.forEach(session => allSessions.add(session));
        }
        return allSessions;
    }

    public clear(): void
    {
        this.map.clear();
    }
}