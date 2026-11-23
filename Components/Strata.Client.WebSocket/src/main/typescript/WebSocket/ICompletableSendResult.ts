import {SendResult} from "strata.foundation.core/Event";

export interface ICompletableSendResult<E> {
    /**
     * Resolves to the result of the send operation.
     */
    toPromise(): Promise<SendResult<E>>;
}