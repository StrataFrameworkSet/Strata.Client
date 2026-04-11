import {SendResult} from "./SendResult";

export interface ICompletableSendResult<E> {
    /**
     * Resolves to the result of the send operation.
     */
    toPromise(): Promise<SendResult<E>>;
}