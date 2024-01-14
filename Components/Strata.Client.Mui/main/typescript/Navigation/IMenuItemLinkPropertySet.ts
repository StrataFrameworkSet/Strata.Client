import {MenuItemProps as IMenuItemProps} from '@mui/material'

export
interface IMenuItemLinkPropertySet
    extends IMenuItemProps
{
    to: string;
    callback?: () => void;
}
