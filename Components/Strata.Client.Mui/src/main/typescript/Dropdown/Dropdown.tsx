import * as React from "react";
import Element = React.JSX.Element;
import {Component} from "react";
import {IDropdownPropertySet} from "./IDropdownPropertySet";
import {IDropdownState} from "./IDropdownState";
import {Autocomplete} from "@mui/material";
import {TextField} from "@mui/material";

export
class Dropdown
    extends Component<IDropdownPropertySet,IDropdownState>
{
    constructor(props: IDropdownPropertySet)
    {
        super(props);
        this.state = {}
    }

    render(): Element
    {
        return (
            <Autocomplete
                disablePortal
                id={this.props.id}
                options={this.props.options}
                getOptionLabel={(option) => option}
                sx={{ width: this.props.width || 300 }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        placeholder={this.props.placeholder || "Select..."}
                        slotProps={{ ...params.inputProps, input: {readOnly:true} }}/>}
                onChange={(event, value) => {
                    this.setState({selected: value ? value : null});
                    if (this.props.onChange)
                        this.props.onChange(value ? value : null);
                }}
                value={this.props.value}
                clearOnBlur={false}
                clearOnEscape
                disableClearable={false}
            />
        );
    }
}