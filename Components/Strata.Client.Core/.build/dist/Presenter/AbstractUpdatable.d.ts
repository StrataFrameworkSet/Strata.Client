import { IUpdatable } from "./IUpdatable";
import { IModelStore } from "./IModelStore";
import { IAction } from "./IAction";
import { ICompletionStage } from "strata.foundation.core/Concurrent";
export declare abstract class AbstractUpdatable<M> implements IUpdatable<M> {
    private modelstore;
    private readonly key;
    protected constructor(key: string, modelstore?: IModelStore);
    setModelStore(modelStore: IModelStore): void;
    clearModelStore(): void;
    getModelStore(): IModelStore;
    getKey(): string;
    abstract update(model: M): void;
    protected dispatch(action: (m: M) => ICompletionStage<M>): void;
    protected dispatchAction(action: IAction<M>): void;
}
