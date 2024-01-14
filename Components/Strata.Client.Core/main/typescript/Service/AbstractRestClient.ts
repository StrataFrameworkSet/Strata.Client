import {CompletableObservable,ICompletionStage} from "strata.foundation.core/Concurrent";
import {IResponseProcessor} from "./IResponseProcessor";
import {StandardResponseProcessor} from "./StandardResponseProcessor";
import {StandardResponse} from "./StandardResponse";
import {AbstractServiceReply} from "strata.foundation.core/Transfer";
import {ExceptionDataBuilder} from "strata.foundation.core/Transfer";
import {IHeadersConsumer} from "./IHeadersConsumer";

export
abstract class AbstractRestClient
{
    private readonly baseUrl: string;
    private headers: Headers;
    private consumer: IHeadersConsumer;
    private readonly responseProcessor: IResponseProcessor;

    protected constructor(baseUrl: string,responseProcessor?: IResponseProcessor)
    {
        this.baseUrl = baseUrl;
        this.headers = new Headers();
        this.consumer = null;
        this.responseProcessor =
            responseProcessor == null
                ? new StandardResponseProcessor()
                : responseProcessor;
    }

    protected setHeader(headerKey: string,headerValue: string): AbstractRestClient
    {
        this.headers.append(headerKey,headerValue);
        return this;
    }

    protected clearHeader(headerKey: string): AbstractRestClient
    {
        this.headers.delete(headerKey);
        return this;
    }

    protected clearHeaders(): AbstractRestClient
    {
        this.headers = new Headers();
        return this;
    }

    protected getHeader(headerKey: string): string
    {
        return this.headers.get(headerKey);
    }

    protected hasHeader(headerKey: string): boolean
    {
        return this.headers.has(headerKey);
    }

    protected setHeadersConsumer(consumer: IHeadersConsumer): void
    {
        this.consumer = consumer;
    }

    protected doPost<TReply,TRequest>(methodPath: string,request: TRequest):
        ICompletionStage<TReply>
    {
        return this.sendRequestWithBody("POST",methodPath,request);
    }

    protected doPut<TReply,TRequest>(methodPath: string,request: TRequest):
        ICompletionStage<TReply>
    {
        return this.sendRequestWithBody("PUT",methodPath,request);
    }

    protected doDelete<TReply>(
        methodPath: string,
        pathParams: Map<string,Object>,
        queryParams: Map<string,Object>):
        ICompletionStage<TReply>
    {
        return this.sendRequestWithParameters("DELETE",methodPath,pathParams,queryParams);
    }

    protected doGet<TReply>(
        methodPath: string,
        pathParams: Map<string,Object>,
        queryParams: Map<string,Object>):
        ICompletionStage<TReply>
    {
        return this.sendRequestWithParameters("GET",methodPath,pathParams,queryParams);
    }

    private sendRequestWithBody<TReply,TRequest>(
        method: string,
        methodPath: string,
        request: TRequest):
        ICompletionStage<TReply>
    {
        return CompletableObservable.fromPromise(
            fetch(
                this.getUrl(methodPath),
                {
                    method: method,
                    mode: "cors",
                    body: JSON.stringify(request),
                    headers: this.headers})
                .then(response => this.processHeaders(response))
                .then(response => this.processResponse<TReply>(response,methodPath))
                .catch(exception => this.processException<TReply>(exception)));
    }

    private sendRequestWithParameters<TReply>(
        method: string,
        methodPath: string,
        pathParams: Map<string,Object>,
        queryParams: Map<string,Object>):
        ICompletionStage<TReply>
    {
        let requestUrl: string =
            this.resolveTemplates(this.getUrl(methodPath),pathParams);

        requestUrl = this.appendQueryParams(requestUrl,queryParams);

        return CompletableObservable.fromPromise(
            fetch(
                requestUrl,
                {
                    method: method,
                    mode: "cors",
                    headers: this.headers})
                .then(response => this.processHeaders(response))
                .then(response => this.processResponse<TReply>(response,methodPath))
                .catch(exception => this.processException<TReply>(exception)));
    }

    private getUrl(methodPath: string): string
    {
        return this.baseUrl + "/" + methodPath;
    }

    private resolveTemplates(inputUrl: string,pathParams: Map<string,Object>): string
    {
        pathParams
            .forEach(
                (value,key,ignore) =>
                {
                    let template: string = '{' + key + '}';
                    return inputUrl = inputUrl.replace(template,value.toString);
                });

        return inputUrl;
    }

    private appendQueryParams(inputUrl: string,queryParams: Map<string,Object>): string
    {
        let i: number = 0;

        queryParams
            .forEach(
                (value,key,ignore) =>
                {
                    if (i == 0)
                        inputUrl = inputUrl + '?';
                    else
                        inputUrl = inputUrl + '&';

                    ++i;
                    return inputUrl = inputUrl + key + '=' + value.toString();
                });

        return inputUrl;
    }

    private processHeaders(response: Response): Response
    {
        if (this.consumer)
            this.consumer.accept(response.headers);

        return response;
    }

    private processResponse<TReply>(response: Response,methodPath: string):
        Promise<TReply>
    {

        console.log("AbstractRestClient.processResponse")
        return this
            .responseProcessor
            .process<TReply>(new StandardResponse(this.baseUrl,methodPath,response));
    }

    private processException<TReply>(exception: any): TReply
    {
        const reply: TReply =  {} as TReply;

        console.log("AbstractRestClient.processException: " + exception);

        if (this.isAbstractServiceReply(reply))
        {
            const serviceReply: AbstractServiceReply = reply as AbstractServiceReply;

            console.log("Service reply is subtype of AbstractServiceReply");
            serviceReply.exception =
                    new ExceptionDataBuilder()
                        .setExceptionType("strata.client.core.service.ServiceException")
                        .setExceptionMessage(exception.message)
                        .build();
            serviceReply.success = false;
            serviceReply.failureMessage = exception.message;
        }

        return reply;
    }

    private isAbstractServiceReply<TReply>(reply: TReply): boolean
    {
        const comparable: AbstractServiceReply = {} as AbstractServiceReply;

        return Object
            .keys(comparable)
            .every((property) => reply.hasOwnProperty(property));
    }
}