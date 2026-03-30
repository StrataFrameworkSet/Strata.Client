import * as React from "react";
import Element = React.JSX.Element;
import {Component} from "react";
import {Box} from "@mui/material";
import {IAlternatePropertySet} from "./IAlternatePropertySet";

export
class Alternate
    extends Component<IAlternatePropertySet,any>
{
    private readonly direction: string;

    constructor(props: IAlternatePropertySet)
    {
        super(props);
        this
            .props
            .supplier
            .get()
            .register(this);

        this.direction = props.direction ? props.direction : 'row';

        this.state = {
            engaged: false
        };
    }

    render(): Element
    {
        return (
                <Box
                    sx={{
                        display: this.state.engaged ? 'flex' : 'none',
                        flexDirection:this.direction}}
                    alignItems='center'>
                    {this.props.children}
                </Box>
        );
    }

    engage(): void
    {
        console.log("Alternate.engage: engaging " + this.props.id);
        this.setState({engaged:true});
        this.props.onEngage();
    }

    disengage(): void
    {
        console.log("Alternate.disengage: disengaging " + this.props.id);
        this.setState({engaged:false});
        this.props.onDisengage();
    }
}