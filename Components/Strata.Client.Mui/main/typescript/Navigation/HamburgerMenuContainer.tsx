import * as React from "react";
import Element = React.JSX.Element;
import {Component,Fragment} from "react";
import {HamburgerMenu} from "./HamburgerMenu";
import {IHamburgerMenuContainerPropertySet} from "./IHamburgerMenuContainerPropertySet";
import {IHamburgerMenuContainerState} from "./IHamburgerMenuContainerState";

export
class HamburgerMenuContainer
    extends Component<IHamburgerMenuContainerPropertySet,IHamburgerMenuContainerState>
{
    private menus: Array<HamburgerMenu>;

    constructor(props: IHamburgerMenuContainerPropertySet)
    {
        super(props);
        this.menus = new Array<HamburgerMenu>();
        this
            .props
            .consumer
            .accept(this);
        this.state = {
            initialized: false
        };

    }

    render(): Element
    {
        return (
            <Fragment>
                {this.props.children}
            </Fragment>
        );
    }

    componentDidMount(): void
    {
        this.initializeCurrentIfNeeded();
    }

    registerMenu(menu: HamburgerMenu): void
    {
        console.log("HamburgerMenuContainer.registerMenu: registering " + menu.props.id);
        this.menus.push(menu);
    }

    setCurrent(id: string): void
    {
        if (this.hasMenu(id))
        {
            console.log("HamburgerMenuContainer.setCurrent");
            this.menus.forEach(
                (menu) =>
                {
                    if (menu.props.id == id)
                        menu.show();
                    else
                        menu.hide();
                });
        }
    }

    hasMenu(id: string): boolean
    {
        return this.menus.find((menu) => menu.props.id == id) != undefined;
    }

    private initializeCurrentIfNeeded(): void
    {
        console.log("HamburgerMenuContainer.initializeIfNeeded");

        if (this.state.initialized == false)
        {
            console.log("HamburgerMenuContainer.initializeIfNeeded: setting initial menu");
            this.setCurrent(this.props.initialUserType);
            this.setState({initialized:true});
        }
    }

}