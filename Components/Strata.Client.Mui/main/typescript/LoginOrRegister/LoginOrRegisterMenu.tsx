import * as React from 'react';
import {Button,Menu,Tooltip} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {INavigationLinkPropertySet} from '../Navigation/INavigationLinkPropertySet';
import MenuItemLink from '../Navigation/MenuItemLink';
import MouseEvent = React.MouseEvent;
import Element = React.JSX.Element;
import {Component} from "react";

export
class LoginOrRegisterMenu
    extends Component<any,any>
{
    constructor(props: INavigationLinkPropertySet)
    {
        super(props);
        this.state = {
            selected: props.selected,
            anchor: null,
            open: false}
    }

    render(): Element
    {
        let className: string;

        if (this.state.selected)
            className = ".Button menu-selected";
        else
            className = ".Button";

        return (
            <div>
                <Tooltip title={'click to login or register'}>
                    <Button
                        id={'basic-button'}
                        aria-controls={'basic-menu'}
                        aria-haspopup={'menu'}
                        aria-expanded={this.state.open}
                        startIcon={<AccountCircleIcon/>}
                        size={'small'}
                        sx={{textTransform:'none'}}
                        onClick={(event) => this.handleClick(event)}>
                        {this.props.text}
                    </Button>
                </Tooltip>
                <Menu
                    id="basic-menu"
                    anchorEl={this.state.anchor}
                    open={this.state.open}
                    onClose={() => this.handleClose()}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}>
                    <MenuItemLink  to="/login" content="Login" onClick={() => this.handleClose()}/>
                    <MenuItemLink to="/register" content="Register" onClick={() => this.handleClose()}/>
                </Menu>
            </div>);
        /*
            <Popover
                className="bp5-minimal"
                open={false}
                popoverClassName={Classes.POPOVER_DISMISS}
                content={
                    <Menu className={Classes.POPOVER_DISMISS}>
                        <MenuItemLink icon="log-in" to="/login" text="Login" callback={() => this.select()}/>
                        <MenuItemLink icon="cog" to="/profile" text="Edit Profile" callback={() => this.select()}/>
                    </Menu>}
                position={Position.BOTTOM_LEFT}>
                <Button className={className} small={true} icon="user" rightIcon="caret-down" text={this.props.text} intent={Intent.NONE}/>
            </Popover>);

         */
    }

    protected handleClick(event: MouseEvent<HTMLButtonElement>): void
    {
        this.setState({anchor:event.currentTarget});
        this.setState({open:true});
    }

    protected handleClose(): void
    {
        this.setState({open:false});
        this.setState({anchor:null});
    }
}

