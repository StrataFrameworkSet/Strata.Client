import { IAction } from "./IAction";
import { ICompletionStage } from "strata.foundation.core/Concurrent";
export declare class Action<M> implements IAction<M> {
    private readonly key;
    private readonly action;
    constructor(key: string, action: (model: M) => ICompletionStage<M>);
    getKey(): string;
    apply(model: M): ICompletionStage<M>;
}
