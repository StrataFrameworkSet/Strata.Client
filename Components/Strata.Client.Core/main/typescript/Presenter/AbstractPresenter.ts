import {AbstractUpdatable} from "./AbstractUpdatable";
import {IPresenter} from "./IPresenter";
import {IModelStore} from "./IModelStore";

export
abstract class AbstractPresenter<M,V>
    extends AbstractUpdatable<M>
    implements IPresenter<M,V>
{
    private view: V;

    protected constructor(key: string,modelstore?: IModelStore)
    {
        super(key,modelstore);
        this.view = null;
    }

    setView(view: V): void
    {
        this.view = view;
    }

    getView(): V
    {
        return this.view;
    }

    update(model: M): void
    {
        this.doUpdate(this.view,model);
    }


    protected abstract doUpdate(view: V,model: M): void;
}