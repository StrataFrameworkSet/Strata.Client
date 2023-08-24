import {IMainPresenter} from "./IMainPresenter";
import {IMainModel} from "./IMainModel";
import {IMainView} from "./IMainView";
import {IModelStore} from "strata.client.core";
import {AbstractPresenter} from "strata.client.core";
import {IHelloWorldPresenter} from "../Hello/IHelloWorldPresenter";
import {HelloWorldPresenter} from "../Hello/HelloWorldPresenter";

export
class MainPresenter
    extends AbstractPresenter<IMainModel,IMainView>
    implements IMainPresenter
{
    private readonly helloWorldPresenter: IHelloWorldPresenter;

    constructor(modelstore?: IModelStore)
    {
        super("Main",modelstore);
        this.helloWorldPresenter = new HelloWorldPresenter(modelstore);
    }

    getHelloWorldPresenter(): IHelloWorldPresenter
    {
        return this.helloWorldPresenter;
    }

    protected doUpdate(view: IMainView,model: IMainModel): void
    {
    }


}