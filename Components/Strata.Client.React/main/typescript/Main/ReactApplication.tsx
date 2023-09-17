import * as React from "react";
import * as ReactDOM from 'react-dom';
import {createRoot,Root} from "react-dom/client";
import {AbstractApplication,IApplication} from "strata.client.core/Main";
import {IPresenter} from "strata.client.core/Presenter";
import {BrowserRouter} from 'react-router-dom';
import {IRenderable} from "../Presenter/IRenderable";

export
abstract class ReactApplication<M,V extends IRenderable,P extends IPresenter<M,V>>
    extends AbstractApplication<M,V,P>
    implements IApplication
{
    private root: Root;

    protected constructor()
    {
        super();
        this.root = createRoot(document.getElementById('root'))
    }

    start(): void
    {
        this.root.render(
            <BrowserRouter>
                {this.getMainView()}
            </BrowserRouter>);
    }

    stop(): void
    {
        this.root.unmount()
    }

    protected abstract getMainView(): any;
}