import {ExceptionData} from "../Shared/ExceptionData";

export
interface SayHelloReply
{
    correlationId: string
    timestamp: number;
    success: boolean;
    successMessage: string;
    failureMessage: string;
    exception: ExceptionData;
    greeting: string;
}