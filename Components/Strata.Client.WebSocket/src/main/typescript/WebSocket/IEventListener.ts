export interface IEventListener<E>
{
    onStart(): void;
    onStop(): void;
    onEvents(events: E[]): void;
    onException(error: Error): void;
}