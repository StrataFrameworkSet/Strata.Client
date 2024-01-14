import * as React from "react";
import Element = React.JSX.Element;
import {Component,Fragment} from "react";
import {INavigationLinkGroupContainerPropertySet} from "./INavigationLinkGroupContainerPropertySet";
import {INavigationLinkGroupContainerState} from "./INavigationLinkGroupContainerState";
import {NavigationLinkGroup} from "./NavigationLinkGroup";

export
class NavigationLinkGroupContainer
    extends Component<INavigationLinkGroupContainerPropertySet,INavigationLinkGroupContainerState>
{
    private groups: Array<NavigationLinkGroup>;

    constructor(props: INavigationLinkGroupContainerPropertySet)
    {
        super(props);
        this.groups = new Array<NavigationLinkGroup>();
        this
            .props
            .consumer
            .accept(this);
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

    registerGroup(alternate: NavigationLinkGroup): void
    {
        console.log("NavigationLinkGroupContainer.register: registering " + alternate.props.id);
        this.groups.push(alternate);
    }

    setCurrent(id: string): void
    {
        if (this.hasGroup(id))
        {
            console.log("NavigationLinkGroupContainer.setCurrent");
            this.groups.forEach(
                (a) =>
                {
                    if (a.props.id == id)
                        a.show();
                    else
                        a.hide();
                });
        }
    }

    hasGroup(id: string): boolean
    {
        return this.groups.find((a) => a.props.id == id) != undefined;
    }

    private initializeCurrentIfNeeded(): void
    {
        console.log("NavigationLinkGroupContainer.initializeIfNeeded");

        if (this.state.initialized == false)
        {
            console.log("NavigationLinkGroupContainer.initializeIfNeeded: setting initial alternate");
            this.setCurrent(this.props.selectedGroup);
            this.setState({initialized:true});
        }
    }

}