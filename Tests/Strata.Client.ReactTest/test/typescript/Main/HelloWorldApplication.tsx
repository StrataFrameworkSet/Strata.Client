import * as React from "react";
import {IApplication} from "strata.client.core";
import {ReactApplication} from 'strata.client.react';
import {IModelStore} from 'strata.client.core';
import {ModelStore} from 'strata.client.core';
import {HelloWorldModel} from "../Hello/HelloWorldModel";
import {MainModel} from "./MainModel";
import {MainView} from "./MainView";
import {IMainModel} from "./IMainModel";
import {IMainPresenter} from "./IMainPresenter";
import {IMainView} from "./IMainView";
import {MainPresenter} from "./MainPresenter";

export
class HelloWorldApplication
    extends ReactApplication<IMainModel,IMainView,IMainPresenter>
    implements IApplication
{
    constructor()
    {
        super();

        let modelstore: IModelStore =
            new ModelStore()
                .insert("Main",new MainModel())
                .insert("HelloWorld",new HelloWorldModel());
        let presenter: IMainPresenter = new MainPresenter(modelstore);

        this.initialize(modelstore,presenter);

    }

    protected getMainView(): any
    {
        return (<MainView presenter={this.getPresenter()}/>);
    }
}