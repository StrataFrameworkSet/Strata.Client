import {ICompletableSendResult} from "./ICompletableSendResult";
import {SendResult} from "strata.foundation.core/Event";

export class CompletableSendResult<E> implements ICompletableSendResult<E>
{
    constructor(private readonly promise: Promise<SendResult<E>>) {}

    public toPromise(): Promise<SendResult<E>>
    {
        return this.promise;
    }
}