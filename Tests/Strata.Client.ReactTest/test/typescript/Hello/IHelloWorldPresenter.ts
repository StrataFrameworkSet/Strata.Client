import {IHelloWorldView} from "./IHelloWorldView";
import {IHelloWorldModel} from "./IHelloWorldModel";
import {IPresenter} from 'strata.client.core';

export
interface IHelloWorldPresenter
    extends IPresenter<IHelloWorldModel,IHelloWorldView>
{
    submit(): void;

    exit(): void;
}