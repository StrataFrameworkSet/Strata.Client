import {SayHelloRequest} from "./SayHelloRequest";
import {SayHelloReply} from "./SayHelloReply";
import {ICompletionStage} from "strata.foundation.core";

export
interface IHelloService
{
    sayHello(request: SayHelloRequest): ICompletionStage<SayHelloReply>;
}