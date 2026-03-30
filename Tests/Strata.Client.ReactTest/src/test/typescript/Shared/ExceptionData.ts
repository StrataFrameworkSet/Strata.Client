export
class ExceptionData
{
    exceptionType?:	string;
    exceptionCode?:	number;
    exceptionMessage?: string;
    stackTrace?: string;
    cause?: ExceptionData;
}