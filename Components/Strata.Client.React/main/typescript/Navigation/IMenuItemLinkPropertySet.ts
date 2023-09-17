import {MenuItemProps as IMenuItemProps} from '@blueprintjs/core';

export
interface IMenuItemLinkPropertySet
    extends IMenuItemProps
{
    to: string;
    callback: () => void;
}
