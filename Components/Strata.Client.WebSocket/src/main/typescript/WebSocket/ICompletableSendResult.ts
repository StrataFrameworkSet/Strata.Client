import {SendResult} from "strata.foundation.core/Event";

// This interface represents a send operation that can be completed in the future.
// It provides a method to convert the result of the send operation into a Promise, allowing callers to await the result or attach then/catch handlers as needed.
export interface ICompletableSendResult<E> {
    /**
     * Resolves to the result of the send operation.
     */
    toPromise(): Promise<SendResult<E>>;
}