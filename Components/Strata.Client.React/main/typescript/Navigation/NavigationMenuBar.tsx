import * as React from 'react';
import {Component} from 'react';
import {INavigationMenuBarPropertySet} from './INavigationMenuBarPropertySet';
import {NavigationMenu} from './NavigationMenu';
import {Navbar,NavbarGroup} from "@blueprintjs/core";
import {Alignment} from "@blueprintjs/core/lib/esm/common/alignment";

export
abstract class NavigationMenuBar
    extends Component<INavigationMenuBarPropertySet,any>
{
    private menus: Map<string,NavigationMenu>

    protected constructor(props: INavigationMenuBarPropertySet)
    {
        super(props);
        this.menus = new Map<string,NavigationMenu>();
    }

    render(): any
    {
        return (
            <Navbar>
                {this.renderLeft()}
                {this.renderRight()}
            </Navbar>
        );
    }

    register(menu:NavigationMenu)
    {
        this.menus.set(menu.props.id,menu);
    }

    onSelectionChange(selected:NavigationMenu)
    {
        this
            .menus
            .forEach(
                (menu) =>
                {
                    if (menu.props.id != selected.props.id)
                        menu.unselect();
                });
    }

    protected abstract renderLeft(): any;

    protected abstract renderRight(): any;
}
