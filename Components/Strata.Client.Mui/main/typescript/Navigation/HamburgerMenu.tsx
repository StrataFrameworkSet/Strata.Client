import * as React from 'react';
import Element = React.JSX.Element;
import MouseEvent = React.MouseEvent;
import {Component,Fragment} from "react";
import MenuItemLink from './MenuItemLink';
import {Box,IconButton,Menu} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Alternate,Alternator} from "../Utility";
import {IHamburgerMenuPropertySet} from "./IHamburgerMenuPropertySet";
import {IHamburgerMenuState} from "./IHamburgerMenuState";
import {Holder} from "strata.foundation.core/Utility";

export
class HamburgerMenu
    extends Component<IHamburgerMenuPropertySet,IHamburgerMenuState>
{
    private readonly holder: Holder<Alternator>;

    constructor(props:IHamburgerMenuPropertySet)
    {
        super(props);
        this
            .props
            .supplier
            .get()
            .registerMenu(this);
        this.state = {
            visible: false,
            anchor:null,
            open:false};
    }

    render(): Element
    {
         return (
             <Fragment>
                <IconButton
                    id={this.props.id + '-hamburger-button'}
                    sx={{display: this.state.visible ? 'flex' : 'none'}}
                    aria-controls={this.props.id + '-hamburger-menu'}
                    aria-haspopup={'menu'}
                    aria-expanded={this.state.open}
                    size={'large'}
                    onClick={(event) => this.openMenu(event)}>
                    <MenuIcon/>
                </IconButton>
                <Menu
                    id={this.props.id + "-hamburger-menu"}
                    anchorEl={this.state.anchor}
                    open={this.state.open}
                    onClose={() => this.closeMenu()}
                    MenuListProps={{
                        'aria-labelledby': this.props.id + '-hamburger-button',
                    }}>
                    {this.props.group.getNavigationItems().map((item) =>
                        <MenuItemLink
                            id={item.getId()}
                            to={item.getTo()}
                            content={item.getText()}
                            onClick={() => this.closeMenu()}/>)}
                </Menu>
             </Fragment>
        );

    }

    protected openMenu(event: MouseEvent<HTMLButtonElement>): void
    {
        this.setState({anchor:event.currentTarget});
        this.setState({open:true});
    }

    protected closeMenu(): void
    {
        this.setState({open:false});
        this.setState({anchor:null});
    }

    show(): void
    {
        console.log("HamburgerMenu.show: showing " + this.props.id);
        this.setState({visible:true});
    }

    hide(): void
    {
        console.log("HamburgerMenu.hide: hiding " + this.props.id);
        this.setState({visible:false});
    }
}