import {IResponseProcessor} from "./IResponseProcessor";
import {IResponse} from "./IResponse";
import {ServiceError} from "./ServiceError";

export
class StandardResponseProcessor
    implements IResponseProcessor
{
    process<R>(response: IResponse): Promise<R>
    {
        switch (response.getStatus())
        {
            case 200: // OK
            case 500: //INTERNAL_SERVER_ERROR
                return response.readEntity<R>();

            default:
                throw new ServiceError(response);
        }
    }
}