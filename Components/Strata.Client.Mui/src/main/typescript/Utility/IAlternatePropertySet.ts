import {ReactNode} from "react";
import {Alternator} from "./Alternator";
import {ISupplier} from "strata.foundation.core/Utility";

export
interface IAlternatePropertySet
{
    id: string;
    onEngage: () => void;
    onDisengage: () => void;
    supplier: ISupplier<Alternator>;
    direction?: string;
    children?: ReactNode;
}