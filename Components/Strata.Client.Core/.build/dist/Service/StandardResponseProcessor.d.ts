import { IResponseProcessor } from "./IResponseProcessor";
import { IResponse } from "./IResponse";
export declare class StandardResponseProcessor implements IResponseProcessor {
    process<R>(response: IResponse): Promise<R>;
}
