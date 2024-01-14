import {ReactNode} from "react";
import {IConsumer} from "strata.foundation.core/Utility";
import {HamburgerMenuContainer} from "./HamburgerMenuContainer";

export
interface IHamburgerMenuContainerPropertySet
{
    initialUserType: string;
    consumer: IConsumer<HamburgerMenuContainer>
    children?: ReactNode;
}