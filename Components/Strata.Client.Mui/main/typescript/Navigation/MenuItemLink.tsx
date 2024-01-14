import * as React from 'react';
import {Component} from 'react';
import {RouteComponentProps,withRouter} from 'react-router-dom';
import {IMenuItemLinkPropertySet} from './IMenuItemLinkPropertySet';
import {MenuItem} from "@mui/material";
import MouseEvent = React.MouseEvent;
import Element = React.JSX.Element;


export
class MenuItemLink
    extends Component<IMenuItemLinkPropertySet & RouteComponentProps,any>
{
    constructor(props: IMenuItemLinkPropertySet & RouteComponentProps)
    {
        super(props);
    }

    render(): Element
    {
        return (
            <MenuItem
                dense={true}
                onClick={(event) => this.doClick(event)}>
                {this.props.content}
            </MenuItem>);
    }

    doClick(event: MouseEvent<HTMLLIElement>): void
    {
        this
            .props
            .history
            .push(this.props.to);

        if (this.props.callback != null)
            this
                .props
                .callback();

        if (this.props.onClick != null)
            this
                .props
                .onClick(event);
    }
}

export default withRouter(MenuItemLink);
