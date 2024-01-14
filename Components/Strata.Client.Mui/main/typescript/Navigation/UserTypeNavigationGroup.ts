import {NavigationItem} from "./NavigationItem";

export
class UserTypeNavigationGroup
{
    private userType: string;
    private navigationItems: Array<NavigationItem>;

    constructor()
    {
        this.userType = '';
        this.navigationItems = new Array<NavigationItem>();
    }

    setUserType(userType: string): UserTypeNavigationGroup
    {
        this.userType = userType;
        return this;
    }

    addNavigationItem(item: NavigationItem): UserTypeNavigationGroup
    {
        this.navigationItems.push(item);
        return this;
    }

    clearNavigationItems(): UserTypeNavigationGroup
    {
        this.navigationItems = new Array<NavigationItem>();
        return this;
    }

    getUserType(): string { return this.userType; }

    getNavigationItems(): Array<NavigationItem> { return this.navigationItems; }
}