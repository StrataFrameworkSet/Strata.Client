export 
interface IResponse
{
    getRequestPath(): string;

    getMediaType(): string;

    getStatus(): number;

    getStatusReason(): string;

    readEntity<E>(): Promise<E>;

    close(): void;

}