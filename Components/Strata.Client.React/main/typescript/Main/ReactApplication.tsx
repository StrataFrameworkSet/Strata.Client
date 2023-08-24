import * as React from "react";
import * as ReactDOM from 'react-dom';
import {
    AbstractApplication,
    IApplication,
    IPresenter
} from "strata.client.core";
import {BrowserRouter} from 'react-router-dom';
import {IRenderable} from "../Presenter/IRenderable";

export
abstract class ReactApplication<M,V extends IRenderable,P extends IPresenter<M,V>>
    extends AbstractApplication<M,V,P>
    implements IApplication
{

    protected constructor()
    {
        super();
    }

    start(): void
    {
        ReactDOM.render(
            <BrowserRouter>
                {this.getMainView()}
            </BrowserRouter>,
            document.getElementById('root')
        );
    }

    stop(): void
    {

    }

    protected abstract getMainView(): any;
}