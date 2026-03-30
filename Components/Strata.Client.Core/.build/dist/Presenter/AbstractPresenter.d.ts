import { AbstractUpdatable } from "./AbstractUpdatable";
import { IPresenter } from "./IPresenter";
import { IModelStore } from "./IModelStore";
export declare abstract class AbstractPresenter<M, V> extends AbstractUpdatable<M> implements IPresenter<M, V> {
    private view;
    protected constructor(key: string, modelstore?: IModelStore);
    setView(view: V): void;
    getView(): V;
    update(model: M): void;
    protected abstract doUpdate(view: V, model: M): void;
}
