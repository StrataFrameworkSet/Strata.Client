import {IResponse} from "./IResponse";

export
interface IResponseProcessor
{
    process<R>(response: IResponse): Promise<R>;
}