import {IHelloService} from "./IHelloService";
import {SayHelloRequest} from "./SayHelloRequest";
import {SayHelloReply} from "./SayHelloReply";
import {ICompletionStage} from "strata.foundation.core";
import {AbstractRestClient} from "strata.client.core";
import {Guid} from "guid-typescript";

export
class HelloServiceClient
    extends AbstractRestClient
    implements IHelloService
{
    constructor(baseUrl: string)
    {
        super(baseUrl);
        this.setHeader("Content-Type","application/json");
    }

    sayHello(request: SayHelloRequest): ICompletionStage<SayHelloReply>
    {
        console.log("HelloServiceClient.sayHello");
        return this.doPost<SayHelloReply,SayHelloRequest>(
            "say-hello-async",
            this.initializeRequest(request));
    }

    private initializeRequest(request: SayHelloRequest): SayHelloRequest
    {
        console.log("HelloServiceClient.initializeRequest");
        if (request.correlationId == null)
            request.correlationId = Guid.create().toString();

        if (request.timestamp == null)
            request.timestamp = Date.now().valueOf()

        return request;
    }
}