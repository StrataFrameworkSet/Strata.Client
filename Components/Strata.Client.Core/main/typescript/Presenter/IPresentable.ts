import {IView} from "./IView";

export
interface IPresentable<V>
{
    setView(view: V): void;

    getView(): V;
}