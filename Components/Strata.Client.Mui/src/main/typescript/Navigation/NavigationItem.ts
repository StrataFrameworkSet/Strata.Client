export
class NavigationItem
{
    private readonly id: string;
    private readonly to: string;
    private readonly text: string;
    private readonly selected: boolean;

    constructor(id: string,to: string,text: string,selected: boolean)
    {
        this.id = id;
        this.to = to;
        this.text = text;
        this.selected = selected;
    }

    getId(): string { return this.id; }

    getTo(): string { return this.to; }

    getText(): string { return this.text; }

    isSelected(): boolean { return this.selected; }
}