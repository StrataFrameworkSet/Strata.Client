import * as React from 'react';
import {Component} from 'react';
import {ISearchInputPropertySet} from './ISearchInputPropertySet';
import {InputGroup, Intent} from '@blueprintjs/core';

export
class SearchInput
    extends Component<ISearchInputPropertySet,any>
{

    constructor(props: ISearchInputPropertySet)
    {
        super(props);
    }

    render()
    {
        return (
            <InputGroup
                className="bp3-minimal"
                leftIcon="search"
                placeholder="Search"
                type="text"
                intent={Intent.NONE}
                small={true}>
            </InputGroup>);
    }
}
