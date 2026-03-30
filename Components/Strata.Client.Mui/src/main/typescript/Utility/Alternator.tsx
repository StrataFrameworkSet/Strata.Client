import * as React from "react";
import Element = React.JSX.Element;
import {Component,Fragment} from "react";
import {IAlternatorPropertySet} from "./IAlternatorPropertySet";
import {IAlternatorState} from "./IAlternatorState";
import {Alternate} from "./Alternate";

export
class Alternator
    extends Component<IAlternatorPropertySet,IAlternatorState>
{
    private alternates: Array<Alternate>;

    constructor(props: IAlternatorPropertySet)
    {
        super(props);
        this.alternates = new Array<Alternate>();
        this.props.consumer.accept(this);
        this.state = {
            initialized: false
        };

    }

    render(): Element
    {
        return (
            <Fragment>
                {this.props.children}
            </Fragment>
        );
    }

    componentDidMount(): void
    {
        this.initializeCurrentIfNeeded();
    }

    register(alternate: Alternate): void
    {
        console.log("Alternator.register: registering " + alternate.props.id);
        this.alternates.push(alternate);
    }

    setCurrent(id: string): void
    {
        if (this.hasAlternate(id))
        {
            console.log("Alternator.setCurrent");
            this.alternates.forEach(
                (a) =>
                {
                    if (a.props.id == id)
                        a.engage();
                    else
                        a.disengage();
                });
        }
    }

    hasAlternate(id: string): boolean
    {
        return this.alternates.find((a) => a.props.id == id) != undefined;
    }

    private initializeCurrentIfNeeded(): void
    {
        console.log("Alternator.initializeIfNeeded");

        if (this.state.initialized == false)
        {
            console.log("Alternator.initializeIfNeeded: setting initial alternate");
            this.setCurrent(this.props.initialEngaged);
            this.setState({initialized:true});
        }
    }

}