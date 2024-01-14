import {ReactNode} from "react";
import {NavigationLinkGroupContainer} from "./NavigationLinkGroupContainer";
import {IConsumer} from "strata.foundation.core/Utility";

export
interface INavigationLinkGroupContainerPropertySet
{
    selectedGroup: string;
    consumer: IConsumer<NavigationLinkGroupContainer>
    children?: ReactNode;
}