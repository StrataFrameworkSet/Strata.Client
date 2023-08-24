import {INavbarGroupProps} from '@blueprintjs/core';
import {NavigationMenuBar} from './NavigationMenuBar';
import {BrowserRouter} from 'react-router-dom';

export
interface INavigationMenuPropertySet
    extends INavbarGroupProps
{
    id: string;
    to: string;
    text: string;
    selected: boolean;
    menubar: NavigationMenuBar;
    router?: BrowserRouter;
}
