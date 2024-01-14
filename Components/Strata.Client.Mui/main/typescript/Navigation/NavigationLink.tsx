import * as React from 'react';
import Element = React.JSX.Element;
import {Component,RefObject} from 'react';
import {NavLink} from 'react-router-dom';
import {INavigationLinkPropertySet} from './INavigationLinkPropertySet';
import {NavigationLinkGroup} from "./NavigationLinkGroup";

export
class NavigationLink
    extends Component<INavigationLinkPropertySet,any>
{
    private group: NavigationLinkGroup;
    private readonly navLink: RefObject<HTMLAnchorElement>;

    constructor(props:INavigationLinkPropertySet)
    {
        super(props);
        this.navLink = React.createRef();
        this.click = this.click.bind(this);
        this.group =
            this
                .props
                .supplier
                .get();
        this
            .group
            .registerLink(this);
        this.state = { selected: props.selected };
    }

    render(): Element
    {
        return (
            <NavLink
                className=".MuiButton-text nav-menu"
                role="button"
                ref={this.navLink}
                activeClassName="menu-selected"
                id={this.props.id}
                to={this.props.to}
                onClick={() => this.select()}>
                {this.props.text}
            </NavLink>);
     }

     click(): void
     {
         console.log("NavigationLink.click: clicking " + this.props.id);
         this.navLink.current.focus();
         this.navLink.current.click();
     }

     select(): void
     {
         this.setState({selected:true});
         this.group.onSelectionChange(this);
     }

     unselect(): void
     {
         this.setState(() => ({selected:false}));
     }
}
