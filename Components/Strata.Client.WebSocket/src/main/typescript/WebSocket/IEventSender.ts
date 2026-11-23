import {ICompletableSendResult} from "./ICompletableSendResult";

export interface IEventSender<E>
{
    open(): Promise<IEventSender<E>>;
    close(): Promise<IEventSender<E>>;
    send(event: E): ICompletableSendResult<E>;
    isOpen(): boolean;
    isClosed(): boolean;
}