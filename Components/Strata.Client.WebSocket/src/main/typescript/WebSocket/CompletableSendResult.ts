import {ICompletableSendResult} from "./ICompletableSendResult";
import {SendResult} from "strata.foundation.core/Event";

// This class is a simple implementation of ICompletableSendResult that wraps a Promise<SendResult<E>>.
// It allows the caller to create an instance of CompletableSendResult with a Promise that will eventually resolve to the result of the send operation.
// The toPromise() method simply returns the underlying Promise, allowing the caller to await it or attach then/catch handlers as needed.
export class CompletableSendResult<E> implements ICompletableSendResult<E>
{
    constructor(private readonly promise: Promise<SendResult<E>>) {}

    public toPromise(): Promise<SendResult<E>>
    {
        return this.promise;
    }
}