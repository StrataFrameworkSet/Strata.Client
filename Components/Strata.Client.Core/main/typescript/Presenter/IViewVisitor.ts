import {IView} from "./IView";

export
interface IViewVisitor
{
    visit(view: IView): void;
}