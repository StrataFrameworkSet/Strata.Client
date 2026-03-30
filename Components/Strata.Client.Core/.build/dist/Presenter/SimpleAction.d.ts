import { IAction } from "./IAction";
import { ICompletionStage } from "strata.foundation.core/Concurrent";
export declare class SimpleAction<M> implements IAction<M> {
    private readonly key;
    private readonly action;
    constructor(key: string, action: (model: M) => M);
    getKey(): string;
    apply(model: M): ICompletionStage<M>;
}
