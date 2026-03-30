import {IApplication} from "./IApplication";
import {IModelStore} from "../Presenter/IModelStore";
import {IPresenter} from "../Presenter/IPresenter";

export
abstract class AbstractApplication<M,V,P extends IPresenter<M,V>>
    implements IApplication
{
    private modelstore: IModelStore;
    private presenter: P;

    protected constructor()
    {
        this.modelstore = null;
        this.presenter = null;
    }

    protected initialize(modelstore: IModelStore,presenter: P)
    {
        this.modelstore = modelstore;
        this.presenter = presenter;

        this.modelstore.attach(this.presenter);
    }

    abstract start(): void;

    abstract stop(): void;

    protected getModelStore(): IModelStore
    {
        return this.modelstore;
    }

    protected getPresenter(): P
    {
        return this.presenter;
    }
}