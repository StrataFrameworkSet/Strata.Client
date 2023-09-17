import {CompletableObservable,ICompletionStage} from "strata.foundation.core/Concurrent";
import {IResponseProcessor} from "./IResponseProcessor";
import {StandardResponseProcessor} from "./StandardResponseProcessor";
import {StandardResponse} from "./StandardResponse";

export
abstract class AbstractRestClient
{
    private readonly baseUrl: string;
    private headers: Headers;
    private readonly responseProcessor: IResponseProcessor;

    protected constructor(baseUrl: string,responseProcessor?: IResponseProcessor)
    {
        this.baseUrl = baseUrl;
        this.headers = new Headers();
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

    protected doPost<TReply,TRequest>(methodPath:string,request: TRequest):
        ICompletionStage<TReply>
    {
        return this.sendRequestWithBody("POST",methodPath,request);
    }

    protected doPut<TReply,TRequest>(methodPath:string,request: TRequest):
        ICompletionStage<TReply>
    {
        return this.sendRequestWithBody("PUT",methodPath,request);
    }

    protected doDelete<TReply>(
        methodPath:string,
        pathParams: Map<string,Object>,
        queryParams: Map<string,Object>):
        ICompletionStage<TReply>
    {
        return this.sendRequestWithParameters(
            "DELETE",
            methodPath,
            pathParams,
            queryParams);
    }

    protected doGet<TReply>(
        methodPath:string,
        pathParams: Map<string,Object>,
        queryParams: Map<string,Object>):
        ICompletionStage<TReply>
    {
        return this.sendRequestWithParameters(
            "GET",
            methodPath,
            pathParams,
            queryParams);
    }

    private sendRequestWithBody<TReply,TRequest>(
        method: string,
        methodPath:string,
        request: TRequest):
        ICompletionStage<TReply>
    {
        return CompletableObservable.fromPromise(
            fetch(
                this.getUrl(methodPath),
                {
                    method: method,
                    body: JSON.stringify(request),
                    headers: this.headers
                }).then(response => this.processResponse(response,methodPath)));
    }

    private sendRequestWithParameters<TReply>(
        method: string,
        methodPath:string,
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
                    headers: this.headers
                }).then(response => this.processResponse(response,methodPath)));
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

    private processResponse<TReply>(response: Response,methodPath: string):
        Promise<TReply>
    {
        return this
            .responseProcessor
            .process<TReply>(new StandardResponse(this.baseUrl,methodPath,response));
    }
}