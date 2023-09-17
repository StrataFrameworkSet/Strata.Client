import * as React from 'react';
import {Component} from 'react';
import {Card, H1} from '@blueprintjs/core';
import Element = React.JSX.Element;

export
class HomeView
    extends Component<any,any>
{
    render(): Element
    {
        return (
            <Card>
                <h1>Home View</h1>
            </Card>
        );
    }
}
