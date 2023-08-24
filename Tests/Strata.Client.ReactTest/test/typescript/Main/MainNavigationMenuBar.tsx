import * as React from "react";
import {
    INavigationMenuBarPropertySet,
    LoginAndProfileMenu,NavigationMenu,
    NavigationMenuBar,SearchInput
} from "strata.client.react";
import {NavbarGroup} from "@blueprintjs/core";
import {NavbarHeading} from "@blueprintjs/core";
import {NavbarDivider} from "@blueprintjs/core";
import {Alignment} from "@blueprintjs/core";
import logo from "./logo.svg";

export
class MainNavigationMenuBar
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
                <NavbarHeading className="app-name">
                    <img className="logo" src={logo} height="35" width="35"/>{this.props.heading}
                </NavbarHeading>
                <NavbarDivider/>
                <NavigationMenu id="main.home" to="/home" text="Home" selected={true} menubar={this}/>
                <NavigationMenu id="main.hello" to="/hello" text="Hello" selected={false} menubar={this}/>
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