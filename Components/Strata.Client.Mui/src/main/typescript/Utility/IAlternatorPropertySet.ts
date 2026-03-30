import {ReactNode} from "react";
import {Alternator} from "./Alternator";
import {IConsumer} from "strata.foundation.core/Utility";

export
interface IAlternatorPropertySet
{
    initialEngaged: string;
    consumer: IConsumer<Alternator>
    children?: ReactNode;
}