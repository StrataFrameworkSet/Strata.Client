import {IAction} from "./IAction";
import {ICompletionStage} from "strata.foundation.core";

export
class Action<M>
    implements IAction<M>
{
    private readonly key: string;
    private readonly action: (model: M) => ICompletionStage<M>;

    constructor(key: string,action: (model: M) => ICompletionStage<M>)
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
        return this.action(model);
    }

}