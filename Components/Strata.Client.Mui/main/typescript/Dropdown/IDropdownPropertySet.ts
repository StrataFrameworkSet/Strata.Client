export
interface IDropdownPropertySet
{
    id: string;
    placeholder?: string;
    value?: string;
    options: Array<string>;
    width?: number | string;
    onChange?: (newValue: string) => void;
}