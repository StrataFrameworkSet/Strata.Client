import {ReactNode} from "react";
import {NavigationLinkGroupContainer} from "./NavigationLinkGroupContainer";
import {ISupplier,IConsumer} from "strata.foundation.core/Utility";
import {NavigationLinkGroup} from "./NavigationLinkGroup";

export
interface INavigationLinkGroupPropertySet
{
    id: string;
    supplier: ISupplier<NavigationLinkGroupContainer>;
    consumer: IConsumer<NavigationLinkGroup>;
    children?: ReactNode;
}