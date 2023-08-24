import * as React from "react";
import {IMainPresenter} from "./IMainPresenter";
import {IMainViewProperty} from "./IMainViewProperty";
import {IMainView} from "./IMainView";
import {NavigationMenuBar,PresenterView} from "strata.client.react";
import {RouteSet} from "./RouteSet";
import {MainNavigationMenuBar} from "./MainNavigationMenuBar";
import {IHelloWorldPresenter} from "../Hello/IHelloWorldPresenter";
import "./MainView.css";

export 
class MainView
    extends PresenterView<IMainView,IMainPresenter,IMainViewProperty>
    implements IMainView
{
    constructor(props: IMainViewProperty)
    {
        super(props);
    }

    render(): any
    {
        let presenter: IHelloWorldPresenter =
            this
                .props
                .presenter
                .getHelloWorldPresenter();

        return (
            <div className="app-container bp3-dark">
                <MainNavigationMenuBar heading="HelloWorld"/>
                <RouteSet helloWorldPresenter={presenter}/>
                <footer className="main-footer"></footer>
            </div>);
    }

    protected getSelf(): IMainView
    {
        return this;
    }
}