// IEventListener defines the interface for handling WebSocket events such as connection start, stop, receiving events, and exceptions.
export interface IEventListener<E>
{
    onStart(): void;
    onStop(): void;
    onEvents(events: E[]): void;
    onException(error: Error): void;
}