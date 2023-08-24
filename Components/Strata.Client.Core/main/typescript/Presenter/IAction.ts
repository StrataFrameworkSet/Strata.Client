import {ICompletionStage} from "strata.foundation.core";

export
interface IAction<M>
{
    getKey(): string;

    apply(model: M): ICompletionStage<M>;
}