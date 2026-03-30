import * as React from 'react';
import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {INavigationMenuPropertySet} from './INavigationMenuPropertySet';
import Element = React.JSX.Element;

export
class NavigationMenu
    extends Component<INavigationMenuPropertySet,any>
{
    constructor(props:INavigationMenuPropertySet)
    {
        super(props);
        this.state = { selected: props.selected };
        if (props.menubar != null)
            props.menubar.register(this);
    }

    render(): Element
    {
        return (
            <NavLink
                className="bp5-button bp5-minimal nav-menu"
                role="button"
                activeClassName="menu-selected"
                id={this.props.id}
                to={this.props.to}
                onClick={() => this.select()}>{this.props.text}</NavLink>);
     }

     select(): void
     {
         this.setState(() => ({selected:true}));
         this.props.menubar.onSelectionChange(this);
     }

     unselect(): void
     {
         this.setState(() => ({selected:false}));
     }
}
