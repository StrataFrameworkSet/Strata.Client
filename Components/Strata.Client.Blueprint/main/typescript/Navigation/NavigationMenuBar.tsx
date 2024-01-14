import * as React from 'react';
import {Component} from 'react';
import {INavigationMenuBarPropertySet} from './INavigationMenuBarPropertySet';
import {NavigationMenu} from './NavigationMenu';
import {Navbar,NavbarGroup} from "@blueprintjs/core";
import {Alignment} from "@blueprintjs/core/lib/esm/common/alignment";
import Element = React.JSX.Element;

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

    render(): Element
    {
        return (
            <Navbar>
                {this.renderLeft()}
                {this.renderRight()}
            </Navbar>
        );
    }

    register(menu:NavigationMenu): void
    {
        this.menus.set(menu.props.id,menu);
    }

    onSelectionChange(selected:NavigationMenu): void
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

    protected abstract renderLeft(): Element;

    protected abstract renderRight(): Element;
}
