import {IMainModel} from "./IMainModel";
import {IMainView} from "./IMainView";
import {IPresenter} from "strata.client.core";
import {IHelloWorldPresenter} from "../Hello/IHelloWorldPresenter";

export
interface IMainPresenter
    extends IPresenter<IMainModel,IMainView>
{
    getHelloWorldPresenter(): IHelloWorldPresenter;
}