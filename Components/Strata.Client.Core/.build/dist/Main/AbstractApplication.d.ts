import { IApplication } from "./IApplication";
import { IModelStore } from "../Presenter/IModelStore";
import { IPresenter } from "../Presenter/IPresenter";
export declare abstract class AbstractApplication<M, V, P extends IPresenter<M, V>> implements IApplication {
    private modelstore;
    private presenter;
    protected constructor();
    protected initialize(modelstore: IModelStore, presenter: P): void;
    abstract start(): void;
    abstract stop(): void;
    protected getModelStore(): IModelStore;
    protected getPresenter(): P;
}
