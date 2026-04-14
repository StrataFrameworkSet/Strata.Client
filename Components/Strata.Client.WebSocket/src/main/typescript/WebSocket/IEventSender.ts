import {ICompletableSendResult} from "./ICompletableSendResult";

// This interface defines the contract for an event sender that can send events of any type.
export interface IEventSender<E>
{
    open(): Promise<IEventSender<E>>;
    close(): Promise<IEventSender<E>>;
    send(event: E): ICompletableSendResult<E>;
    isOpen(): boolean;
    isClosed(): boolean;
}