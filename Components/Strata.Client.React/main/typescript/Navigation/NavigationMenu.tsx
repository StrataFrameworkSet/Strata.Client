import * as React from 'react';
import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {INavigationMenuPropertySet} from './INavigationMenuPropertySet';

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

    render()
    {
        return (
            <NavLink
                className="bp3-button bp3-minimal"
                role="button"
                activeClassName="menu-selected"
                id={this.props.id}
                to={this.props.to}
                onClick={() => this.select()}>{this.props.text}</NavLink>);
     }

     select()
     {
         this.setState(() => ({selected:true}));
         this.props.menubar.onSelectionChange(this);
     }

     unselect()
     {
         this.setState(() => ({selected:false}));
     }
}
