import {IModelStore} from "./IModelStore";
import {IAction} from "./IAction";
import {IUpdatable} from "./IUpdatable";
import {ICompletionStage} from 'strata.foundation.core/Concurrent';
import {IMultiMap} from 'strata.foundation.core/Container';
import {MultiMap} from 'strata.foundation.core/Container';

export
class ModelStore
    implements IModelStore
{
    private updatables: IMultiMap<string,Object>;
    private models: Map<string,Object>;

    constructor()
    {
        this.updatables = new MultiMap<string,Object>();
        this.models = new Map<string, Object>();
    }

    attach<M>(updatable: IUpdatable<M>): IModelStore
    {
        this.updatables.put(updatable.getKey(),updatable);

        if (updatable.getModelStore() != this)
            updatable.setModelStore(this);

        return this;
    }

    detach<M>(updatable: IUpdatable<M>): IModelStore
    {
        this.updatables.remove(updatable.getKey(),updatable);

        if (updatable.getModelStore() == this)
            updatable.clearModelStore();

        return this;
    }

    insert<M>(key: string, model: M): IModelStore
    {
        this.models.set(key,model);
        return this;
    }

    remove(key: string): IModelStore
    {
        this.models.delete(key);
        return this;
    }

    hasUpdatable(key: string): boolean
    {
        return this.updatables.containsKey(key);
    }

    hasModel(key: string): boolean
    {
        return this.models.has(key);
    }

    apply<M>(action: IAction<M>): void
    {
        let key: string = action.getKey();
        let updatables: Array<Object> = this.updatables.get(key);
        let model: M = <M>this.models.get(key);
        let updated: ICompletionStage<M> = action.apply(model);

        this.replace(key,updated,model,updatables);
    }

    private replace<M>(
        key:        string,
        updated:    ICompletionStage<M>,
        previous:   M,
        updatables: Array<Object>): void
    {
        updated
            .thenApply(
                current =>
                {
                    this.models.delete(key);
                    this.models.set(key,current);
                    return current;
                })
            .thenAccept(
                current =>
                    updatables
                        .map(updatable => <IUpdatable<M>>updatable)
                        .forEach(updatable => updatable.update(current)),
                error => console.error(error))
            .subscribe();
    }

}