import { IResponse } from "./IResponse";
export declare class StandardResponse implements IResponse {
    private readonly requestPath;
    private readonly response;
    constructor(rootPath: string, methodPath: string, response: Response);
    getRequestPath(): string;
    getMediaType(): string;
    getStatus(): number;
    getStatusReason(): string;
    readEntity<E>(): Promise<E>;
    close(): void;
}
