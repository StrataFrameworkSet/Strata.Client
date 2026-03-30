import {IViewVisitor} from "./IViewVisitor";

export
interface IView
{
    accept(visitor: IViewVisitor): void;
}