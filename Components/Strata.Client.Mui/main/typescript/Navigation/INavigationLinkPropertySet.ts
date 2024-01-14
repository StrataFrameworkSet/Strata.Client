import {ButtonProps as IButtonProps} from "@mui/material";
import {NavigationMenuBar} from './NavigationMenuBar';
import {BrowserRouter} from 'react-router-dom';
import {NavigationLinkGroup} from "./NavigationLinkGroup";
import {ISupplier} from "strata.foundation.core/Utility";

export
interface INavigationLinkPropertySet
    extends IButtonProps
{
    userType: string;
    id: string;
    to: string;
    text: string;
    selected: boolean;
    supplier: ISupplier<NavigationLinkGroup>;
    menubar: NavigationMenuBar;
    router?: BrowserRouter;
}
