import * as React from 'react';
import {Component} from 'react';
import {IRenderable} from "./IRenderable";
import {IPresenterViewProperty} from "./IPresenterViewProperty";
import {IPresentable} from "strata.client.core/Presenter";
import Element = React.JSX.Element

export
abstract class PresenterView<
    V,
    T extends IPresentable<V>,
    P extends IPresenterViewProperty<T>,
    S={}>
    extends Component<P,S>
    implements IRenderable
{
    protected constructor(props: P)
    {
        super(props);
    }

    componentWillMount(): void
    {
        this.props.presenter.setView(this.getSelf());
    }

    abstract render(): Element;

    protected abstract getSelf(): V;

}
