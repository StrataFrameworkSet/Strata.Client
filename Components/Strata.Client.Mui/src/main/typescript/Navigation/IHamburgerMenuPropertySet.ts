import {ButtonProps as IButtonProps} from '@mui/material';
import {BrowserRouter} from "react-router-dom";
import {HamburgerMenuContainer} from "./HamburgerMenuContainer";
import {ISupplier} from "strata.foundation.core/Utility";
import {UserTypeNavigationGroup} from "./UserTypeNavigationGroup";

export
interface IHamburgerMenuPropertySet
    extends IButtonProps
{
    id: string;
    supplier: ISupplier<HamburgerMenuContainer>;
    group: UserTypeNavigationGroup;
    router?: BrowserRouter;
}