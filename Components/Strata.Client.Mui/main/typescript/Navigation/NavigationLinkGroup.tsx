import * as React from "react";
import Element = React.JSX.Element;
import {Component} from "react";
import {Box} from "@mui/material";
import {INavigationLinkGroupPropertySet} from "./INavigationLinkGroupPropertySet";
import {INavigationLinkGroupState} from "./INavigationLinkGroupState";
import {NavigationLink} from "./NavigationLink";

export
class NavigationLinkGroup
    extends Component<INavigationLinkGroupPropertySet,INavigationLinkGroupState>
{
    private links: Array<NavigationLink>;

    constructor(props: INavigationLinkGroupPropertySet)
    {
        super(props);
        this.links = new Array<NavigationLink>();
        this
            .props
            .supplier
            .get()
            .registerGroup(this);
        this
            .props
            .consumer
            .accept(this);
        this.state = {
            visible: false,
            selected: null
        };
    }

    render(): Element
    {
        return (
                <Box
                    display={this.state.visible ? 'flex' : 'none'}
                    alignItems={'center'}>
                    {this.props.children}
                </Box>
        );
    }

    componentDidMount(): void
    {
        //this.initializeSelectedIfNeeded();
    }

    registerLink(link: NavigationLink): void
    {
        this.links.push(link);

        if (this.state.selected == null && link.props.selected)
            this.setState({selected:link});
    }

    hasLink(id: string): boolean
    {
        return this.links.find((l) => l.props.id == id) != undefined;
    }

    show(): void
    {
        console.log("NavigationLinkGroup.show: showing " + this.props.id);
        this.setState({visible:true});
        this.onShow();
    }

    hide(): void
    {
        console.log("NavigationLinkGroup.hide: hiding " + this.props.id);
        this.setState({visible:false});
    }

    onSelectionChange(selected: NavigationLink): void
    {
        if (this.hasLink(selected.props.id))
            this.setState({selected: selected});

        this
            .links
            .forEach(
                (link) =>
                {
                    if (link.props.id != selected.props.id)
                        link.unselect();
                });
    }

    protected onShow(): void
    {
        this.initializeSelectedIfNeeded();

        if (this.state.selected != null)
        {
            console.log("NavigationLinkGroup.onShow: clicking selected");
            this.state.selected.click();
        }
        else
            console.log("NavigationLinkGroup.onShow: selected is null");
    }

    protected initializeSelectedIfNeeded(): void
    {
        const link: NavigationLink =
            this.links.find((l) => l.props.selected);

        if (link != undefined)
        {
            console.log("NavigationLinkGroup.initializeSelectedIfNeeded: initializing selected to " + link.props.id);
            this.setState({selected: link});
        }
        else
            console.log("NavigationLinkGroup.initializeSelectedIfNeeded: no link selected");
    }
}