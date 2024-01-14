import * as React from "react";
import {NavigationMenuBar} from "./NavigationMenuBar";
import {INavigationMenuBarPropertySet} from "./INavigationMenuBarPropertySet";
import {SearchInput} from "./SearchInput";
import {Box,Divider} from "@mui/material";
import AccountBoxIcon from '@mui/material/Icon';
import {LoginOrRegisterMenu} from "../LoginOrRegister";
import Element = React.JSX.Element;
import {IMenuItemPropertySet} from "./IMenuItemPropertySet";
import { UserTypeNavigationGroup } from "./UserTypeNavigationGroup";
import {NavigationItem} from "./NavigationItem";

export class StandardNavigationMenuBar
    extends NavigationMenuBar
{
    constructor(props: INavigationMenuBarPropertySet)
    {
        super(props);
    }

    protected renderControls(): Element
    {
        return (
            <Box sx={{justifyContext:'flex-end'}}>
                <LoginOrRegisterMenu
                    userType={'Guest'}
                    id="main.login-profile"
                    to=""
                    startIcon={<AccountBoxIcon/>}
                    text="guest"
                    selected={false}
                    menubar={this}/>
                <Divider/>
                <SearchInput/>
            </Box>);
    }

    protected getMenuItems(): Array<IMenuItemPropertySet>
    {
        const menuItems: Array<IMenuItemPropertySet> =
            [
                {
                    userType: 'Guest',
                    id: 'main.home',
                    to: '/home',
                    text: 'Home',
                    selected: true
                },
                {
                    userType: 'Guest',
                    id: 'main.user',
                    to: '/user',
                    text: 'User',
                    selected: false
                },
                {
                    userType: 'Guest',
                    id: 'main.group',
                    to: '/group',
                    text: 'Group',
                    selected: false
                },
                {
                    userType: 'Guest',
                    id: 'main.role',
                    to: '/role',
                    text: 'Role',
                    selected: false
                },
                {
                    userType: 'Guest',
                    id: 'main.tenant',
                    to: '/tenant',
                    text: 'Tenant',
                    selected: false
                },
                {
                    userType: 'Guest',
                    id: 'main.help',
                    to: '/help',
                    text: 'Help',
                    selected: false
                }
            ];

        return menuItems;
    }

    getUserTypeNavigationGroups(): Array<UserTypeNavigationGroup>
    {
        const groups: Array<UserTypeNavigationGroup> =
            new Array<UserTypeNavigationGroup>();

        groups.push(
            new UserTypeNavigationGroup()
                .setUserType("Guest")
                .addNavigationItem(
                    new NavigationItem("main.home","/home","Home",true))
                .addNavigationItem(
                    new NavigationItem("main.user","/user","User",false))
                .addNavigationItem(
                    new NavigationItem("main.help","/help","Help",false)));

        return groups;
    }

}