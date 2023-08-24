import * as React from 'react';
import {Button, Classes, Intent, Menu, MenuItem, Popover, Position, Tab} from '@blueprintjs/core';
import {INavigationMenuPropertySet} from './INavigationMenuPropertySet';
import {NavigationMenu} from './NavigationMenu';
import MenuItemLink from './MenuItemLink';

export
class LoginAndProfileMenu
    extends NavigationMenu
{
    router?: History;

    constructor(props: INavigationMenuPropertySet)
    {
        super(props);
    }

    render(): any
    {
        let className: string;

        if (this.state.selected)
            className = "bp3-minimal menu-selected";
        else
            className = "bp3-minimal";

        return (
            <Popover
                className="bp3-minimal"
                popoverClassName={Classes.POPOVER_DISMISS}
                content={
                    <Menu className={Classes.POPOVER_DISMISS}>
                        <MenuItemLink icon="log-in" to="/login" text="Login" callback={() => this.select()}/>
                        <MenuItemLink icon="cog" to="/profile" text="Edit Profile" callback={() => this.select()}/>
                    </Menu>}
                position={Position.BOTTOM_LEFT}>
                <Button className={className} small={true} icon="user" rightIcon="caret-down" text={this.props.text} intent={Intent.NONE}/>
            </Popover>);
    }

}

