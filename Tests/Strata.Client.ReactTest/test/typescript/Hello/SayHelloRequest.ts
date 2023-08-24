export 
interface SayHelloRequest
{
    correlationId?: string;
    timestamp?: number;
    user: string;
    greeting: string;
}