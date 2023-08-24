import * as React from "react";
import {NavigationMenuBar} from "./NavigationMenuBar";
import {INavigationMenuBarPropertySet} from "./INavigationMenuBarPropertySet";
import {NavbarDivider,NavbarGroup,NavbarHeading} from "@blueprintjs/core";
import {NavigationMenu} from "./NavigationMenu";
import {LoginAndProfileMenu} from "./LoginAndProfileMenu";
import {SearchInput} from "./SearchInput";
import {Alignment} from "@blueprintjs/core/lib/esm/common/alignment";


export
class StandardNavigationMenuBar
    extends NavigationMenuBar
{
    constructor(props: INavigationMenuBarPropertySet)
    {
        super(props);
    }

    protected renderLeft(): any
    {
        return (
            <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading>Granite</NavbarHeading>
                <NavbarDivider/>
                <NavigationMenu id="main.home" to="/home" text="Home" selected={true} menubar={this}/>
                <NavigationMenu id="main.user" to="/user" text="User" selected={false} menubar={this}/>
                <NavigationMenu id="main.group" to="/group" text="Group" selected={false} menubar={this}/>
                <NavigationMenu id="main.role" to="/role" text="Role" selected={false} menubar={this}/>
                <NavigationMenu id="main.tenant" to="/tenant" text="Tenant" selected={false} menubar={this}/>
                <NavigationMenu id="main.help" to="/help" text="Help" selected={false} menubar={this}/>
            </NavbarGroup>);
    }

    protected renderRight(): any
    {
        return (
            <NavbarGroup align={Alignment.RIGHT}>
                <LoginAndProfileMenu id="main.login-profile" to="" text="guest" selected={false} menubar={this}/>
                <NavbarDivider/>
                <SearchInput/>
            </NavbarGroup>);
    }
}