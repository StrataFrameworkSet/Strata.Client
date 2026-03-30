import { IModelStore } from "./IModelStore";
import { IAction } from "./IAction";
import { IUpdatable } from "./IUpdatable";
export declare class ModelStore implements IModelStore {
    private updatables;
    private models;
    constructor();
    attach<M>(updatable: IUpdatable<M>): IModelStore;
    detach<M>(updatable: IUpdatable<M>): IModelStore;
    insert<M>(key: string, model: M): IModelStore;
    remove(key: string): IModelStore;
    getModel<M>(key: string): M;
    hasUpdatable(key: string): boolean;
    hasModel(key: string): boolean;
    apply<M>(action: IAction<M>): void;
    private replace;
}
