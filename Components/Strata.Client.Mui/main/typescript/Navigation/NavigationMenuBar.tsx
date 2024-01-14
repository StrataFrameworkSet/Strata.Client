import * as React from 'react';
import Element = React.JSX.Element;
import {Component,Fragment} from 'react';
import {
    AppBar,
    Box,
    Divider,
    Stack,
    Toolbar,
    Typography
} from "@mui/material";
import {INavigationMenuBarPropertySet} from './INavigationMenuBarPropertySet';
import {INavigationMenuBarState} from "./INavigationMenuBarState";
import {NavigationLink} from './NavigationLink';
import {HamburgerMenu} from "./HamburgerMenu";
import {IMenuItemPropertySet} from "./IMenuItemPropertySet";
import {UserTypeNavigationGroup} from "./UserTypeNavigationGroup";
import {Holder} from "strata.foundation.core/Utility";
import {NavigationLinkGroupContainer} from "./NavigationLinkGroupContainer";
import {NavigationLinkGroup} from "./NavigationLinkGroup";
import {HamburgerMenuContainer} from "./HamburgerMenuContainer";
import MenuItemLink from "./MenuItemLink";

export
abstract class NavigationMenuBar
    extends Component<INavigationMenuBarPropertySet,INavigationMenuBarState>
{
    private links: Map<string,Array<NavigationLink>>;
    private readonly menuContainerHolder: Holder<HamburgerMenuContainer>;
    private readonly groupContainerHolder: Holder<NavigationLinkGroupContainer>;
    private hamburgerMenu : HamburgerMenu;

    protected constructor(props: INavigationMenuBarPropertySet)
    {
        super(props);
        this.links = new Map<string,Array<NavigationLink>>();
        this.menuContainerHolder = new Holder<HamburgerMenuContainer>();
        this.groupContainerHolder = new Holder<NavigationLinkGroupContainer>();
        this.state = {currentUserType:this.props.initialUserType};
    }

    render(): Element
    {
        return (
            <AppBar position={'static'}>
                <Toolbar
                    disableGutters={true}
                    sx={{justifyContent:'space-between'}}>
                    {this.renderLeft()}
                    {this.renderRight()}
                </Toolbar>
            </AppBar>
        );
    }

    abstract getUserTypeNavigationGroups(): Array<UserTypeNavigationGroup>;

    registerLink(menu:NavigationLink): void
    {
        this.initializeIfNeeded(menu);
        this.links.get(menu.props.userType).push(menu);
    }

    registerHamburgerMenu(menu: HamburgerMenu): void
    {
        this.hamburgerMenu = menu;
    }

    changeUserType(newUserType:string): void
    {
        const menuContainer: HamburgerMenuContainer = this.menuContainerHolder.get();
        const groupContainer: NavigationLinkGroupContainer = this.groupContainerHolder.get();

        if (menuContainer.hasMenu(newUserType))
            menuContainer.setCurrent(newUserType);

        if (groupContainer.hasGroup(newUserType))
            groupContainer.setCurrent(newUserType);
    }

    protected renderLeft(): Element
    {
        return (
            <Stack direction={'row'} alignItems={'center'} spacing={2} marginLeft={2}>
                {this.renderHeading()}
                <Divider orientation={'vertical'} flexItem={true}/>
                {this.renderMenus()}
            </Stack>
        );
    }

    protected renderRight(): Element
    {
        return (
            <Stack direction={'row'} alignItems={'center'} spacing={2} marginRight={2}>
                {this.renderControls()}
            </Stack>

        );
    }

    protected renderHeading(): Element
    {
        return (
            <Fragment>
                <Box sx={{display: {xs:'flex', md:'none'}}}>
                    <HamburgerMenuContainer
                        initialUserType={this.props.initialUserType}
                        consumer={this.menuContainerHolder}>
                        {this.getUserTypeNavigationGroups().map((group) =>
                            <HamburgerMenu
                                id={group.getUserType()}
                                supplier={this.menuContainerHolder}
                                group={group}/>)}
                    </HamburgerMenuContainer>
                </Box>
                {this.props.icon != null && this.props.icon}
                <Typography>{this.props.heading}</Typography>
            </Fragment>);
/*
        return (
            <Fragment>
                <HamburgerMenu
                    initialUserType={this.state.currentUserType}
                    id={'main.hamburger'}
                    menubar={this}/>
                {this.props.icon != null && this.props.icon}
                <Typography>{this.props.heading}</Typography>
            </Fragment>
        );

 */
    }

    protected renderMenus(): Element
    {
        return(
            <Box sx={{display: {xs:'none', md:'flex'}}}>
                <NavigationLinkGroupContainer
                    selectedGroup={this.props.initialUserType}
                    consumer={this.groupContainerHolder}>
                    {this.getUserTypeNavigationGroups().map((group) =>
                    {
                        const groupHolder: Holder<NavigationLinkGroup> = new Holder<NavigationLinkGroup>;

                        return (
                            <NavigationLinkGroup
                                id={group.getUserType()}
                                supplier={this.groupContainerHolder}
                                consumer={groupHolder}>
                                {group.getNavigationItems().map((item) =>
                                    <NavigationLink
                                        userType={group.getUserType()}
                                        supplier={groupHolder}
                                        id={item.getId()}
                                        to={item.getTo()}
                                        text={item.getText()}
                                        selected={item.isSelected()}
                                        menubar={this}/>)}
                            </NavigationLinkGroup>)})}
                </NavigationLinkGroupContainer>
            </Box>);
    }

    protected abstract renderControls(): Element;

    protected abstract getMenuItems(): Array<IMenuItemPropertySet>;

    private initializeIfNeeded(menu: NavigationLink): void
    {
        if (!this.links.has(menu.props.userType))
            this.links.set(menu.props.userType,new Array<NavigationLink>());
    }

    private getMenus(): Array<NavigationLink>
    {
        return this.links.get(this.state.currentUserType);
    }
}
