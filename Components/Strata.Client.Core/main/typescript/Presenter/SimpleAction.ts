import {IAction} from "./IAction";
import {CompletableObservable,ICompletionStage} from "strata.foundation.core/Concurrent";

export
class SimpleAction<M>
    implements IAction<M>
{
    private readonly key: string;
    private readonly action: (model: M) => M;

    constructor(key: string,action: (model: M) => M)
    {
        this.key = key;
        this.action = action;
    }

    getKey(): string
    {
        return this.key;
    }

    apply(model: M): ICompletionStage<M>
    {
        return CompletableObservable.fromResult(this.action(model));
    }

}