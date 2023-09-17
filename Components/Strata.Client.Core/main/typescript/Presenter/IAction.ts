import {ICompletionStage} from "strata.foundation.core/Concurrent";

export
interface IAction<M>
{
    getKey(): string;

    apply(model: M): ICompletionStage<M>;
}