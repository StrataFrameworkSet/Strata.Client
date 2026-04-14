// IWebSocketSessionMap.ts
// Interface for managing WebSocket sessions by path.
export interface IWebSocketSessionMap
{
    addSession(path: string, session: WebSocket): void;
    removeSession(path: string, session: WebSocket): void;
    getSessions(path: string): Set<WebSocket>;
    getAllSessions(): Set<WebSocket>;
    clear(): void;
}