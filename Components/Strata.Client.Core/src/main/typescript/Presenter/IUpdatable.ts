import {IModelStore} from "./IModelStore";

export
interface IUpdatable<M>
{
    setModelStore(modelStore: IModelStore): void;

    clearModelStore(): void;

    getModelStore(): IModelStore;

    getKey(): string;

    update(model: M);

}