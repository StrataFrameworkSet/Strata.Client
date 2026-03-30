import { IResponse } from "./IResponse";
export declare class ServiceError extends Error {
    private readonly requestPath;
    private readonly status;
    private readonly statusReason;
    constructor(response: IResponse);
    getRequestPath(): string;
    getStatus(): number;
    getStatusReason(): string;
}
