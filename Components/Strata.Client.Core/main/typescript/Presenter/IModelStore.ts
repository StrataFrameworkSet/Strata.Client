import {IUpdatable} from "./IUpdatable";
import {IAction} from "./IAction";

export
interface IModelStore
{
    attach<M>(updatable: IUpdatable<M>): IModelStore;

    detach<M>(updatable: IUpdatable<M>): IModelStore;

    insert<M>(key: string,model:M): IModelStore;

    remove(key: string): IModelStore;

    hasUpdatable(key: string): boolean;

    hasModel(key: string): boolean;

    apply<M>(action: IAction<M>): void;

}