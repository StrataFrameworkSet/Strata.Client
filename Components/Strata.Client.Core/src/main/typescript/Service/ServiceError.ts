import {IResponse} from "./IResponse";

export
class ServiceError
    extends Error
{
    private readonly requestPath: string;
    private readonly status: number;
    private readonly statusReason: string;

    constructor(response: IResponse)
    {
        super(initializeServiceErrorMessage(response));
        this.requestPath = response.getRequestPath();
        this.status = response.getStatus();
        this.statusReason = response.getStatusReason();
    }

    getRequestPath(): string
    {
        return this.requestPath;
    }

    getStatus(): number
    {
        return this.status;
    }

    getStatusReason(): string
    {
        return this.statusReason;
    }

}

function initializeServiceErrorMessage(response: IResponse): string
{
    return "Exception during response processing:\n" +
        "\tFrom request: " + response.getRequestPath() + '\n' +
        "\tResponse status code: " + response.getStatus() + '\n' +
        "\tResponse status message: " + response.getStatusReason() + '\n' +
        "\tResponse media type: " + response.getMediaType() + '\n';
}