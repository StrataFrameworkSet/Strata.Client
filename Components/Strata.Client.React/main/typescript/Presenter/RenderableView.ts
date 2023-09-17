import {Component} from 'react';
import {IRenderableViewProperty} from "./IRenderableViewProperty";
import {IRenderable} from "./IRenderable";
import {IPresenter} from "strata.client.core/Presenter";
import Element = React.JSX.Element;

export
class RenderableView<M,V extends IRenderable,P extends IPresenter<M,V>>
    extends Component<IRenderableViewProperty,any>
{
    constructor(props: IRenderableViewProperty)
    {
        super(props);
    }

    render(): Element
    {
        return this.props.view.render();
    }
}