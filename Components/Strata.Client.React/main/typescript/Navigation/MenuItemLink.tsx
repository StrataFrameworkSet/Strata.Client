import * as React from 'react';
import {Component} from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {MenuItem} from '@blueprintjs/core';
import {IMenuItemLinkPropertySet} from './IMenuItemLinkPropertySet';


export
class MenuItemLink
    extends Component<IMenuItemLinkPropertySet & RouteComponentProps,any>
{
    constructor(props: IMenuItemLinkPropertySet & RouteComponentProps)
    {
        super(props);
    }

    render()
    {
        return (
            <MenuItem className="bp5-minimal" icon={this.props.icon} text={this.props.text} onClick={() => this.doClick()}/>);
    }

    doClick()
    {
        this
            .props
            .history
            .push(this.props.to);
        this
            .props
            .callback();
    }
}

export default withRouter(MenuItemLink);
