import * as React from 'react';
import {Component} from 'react';
import {ISearchInputPropertySet} from './ISearchInputPropertySet';
import {InputAdornment,TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Element = React.JSX.Element;

export
class SearchInput
    extends Component<ISearchInputPropertySet,any>
{

    constructor(props: ISearchInputPropertySet)
    {
        super(props);
    }

    render(): Element
    {
        return (
            <TextField
                id="search"
                placeholder="Search"
                size={'small'}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon/>
                        </InputAdornment>)}}
                variant={'outlined'} />);
    }
}
