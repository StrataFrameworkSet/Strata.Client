import {IResponse} from "./IResponse";

export
class StandardResponse
    implements IResponse
{
    private readonly requestPath: string;
    private readonly response: Response;

    constructor(rootPath: string,methodPath: string,response: Response)
    {
        this.requestPath = rootPath + '/' + methodPath;
        this.response = response;
    }

    getRequestPath(): string
    {
        return this.requestPath;
    }

    getMediaType(): string
    {
        if (this.response.headers.has("Content-Type"))
            return this.response.headers.get("Content-Type");

        return "unknown";
    }

    getStatus(): number
    {
        return this.response.status;
    }

    getStatusReason(): string
    {
        return this.response.statusText;
    }

    async readEntity<E>(): Promise<E>
    {
        return await
            this
                .response
                .json()
                .then((entity) => entity as E);
    }

    close(): void
    {
    }
}