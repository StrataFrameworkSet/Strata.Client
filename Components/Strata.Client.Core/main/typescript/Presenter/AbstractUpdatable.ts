import {IUpdatable} from "./IUpdatable";
import {IModelStore} from "./IModelStore";
import {IAction} from "./IAction";
import {ICompletionStage} from "strata.foundation.core/Concurrent";
import {Action} from "./Action";

export
abstract class AbstractUpdatable<M>
    implements IUpdatable<M>
{
    private modelstore: IModelStore;
    private readonly key: string;

    protected constructor(key: string,modelstore?: IModelStore)
    {
        this.key = key;

        if (modelstore != null)
        {
            this.modelstore = modelstore;
            this.modelstore.attach(this);
        }
        else
            this.modelstore = null;
    }

    setModelStore(modelStore: IModelStore): void
    {
        this.modelstore = modelStore;
    }

    clearModelStore(): void
    {
        this.modelstore = null;
    }

    getModelStore(): IModelStore
    {
        return this.modelstore;
    }

    getKey(): string
    {
        return this.key;
    }

    abstract update(model: M): void;

    protected dispatch(action: (m: M) => ICompletionStage<M>): void
    {
        this.dispatchAction(
            new Action<M>(
                this.getKey(),
                action as (m: M) => ICompletionStage<M>));
    }

    protected dispatchAction(action: IAction<M>): void
    {
        this.modelstore.apply(action);
    }
}