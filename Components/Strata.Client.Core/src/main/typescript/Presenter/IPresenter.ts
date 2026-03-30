import {IUpdatable} from "./IUpdatable";
import {IPresentable} from "./IPresentable";

export
interface IPresenter<M,V>
    extends IUpdatable<M>,IPresentable<V> {}