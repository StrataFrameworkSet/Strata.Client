//////////////////////////////////////////////////////////////////////////////
// AbstractRestClient.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.service;

import jakarta.ws.rs.client.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.MultivaluedHashMap;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;

import java.util.Map;
import java.util.concurrent.CompletionStage;

public abstract
class AbstractRestClient
{
    private Client                        itsClient;
    private WebTarget                     itsBaseTarget;
    private MultivaluedMap<String,Object> itsHeaders;
    private IResponseProcessor            itsResponseProcessor;

    protected
    AbstractRestClient(
        ClientBuilder builder,
        String        baseUrl,
        String        endpointPath)
    {
        this(builder,baseUrl,endpointPath,new StandardResponseProcessor());
    }

    protected
    AbstractRestClient(
        Client client,
        String baseUrl,
        String endpointPath)
    {
        this(client,baseUrl,endpointPath,new StandardResponseProcessor());
    }

    protected
    AbstractRestClient(
        ClientBuilder      builder,
        String             baseUrl,
        String             endpointPath,
        IResponseProcessor processor)
    {
        itsClient =
                builder
                    .register(new ObjectMapperProvider())
                    //.register(new ObjectMapperContextResolver())
                    .build();

        itsBaseTarget = itsClient.target(initialize(baseUrl,endpointPath));
        itsHeaders = new MultivaluedHashMap<>();
        itsResponseProcessor = processor;
    }

    protected
    AbstractRestClient(
        Client             client,
        String             baseUrl,
        String             endpointPath,
        IResponseProcessor processor)
    {
        itsClient = client;
        itsBaseTarget = itsClient.target(initialize(baseUrl,endpointPath));
        itsHeaders = new MultivaluedHashMap<>();
        itsResponseProcessor = processor;
    }

    public AbstractRestClient
    setHeader(String headerKey,String headerValue)
    {
        itsHeaders.add(headerKey,headerValue);
        return this;
    }

    public AbstractRestClient
    clearHeader(String headerKey)
    {
        itsHeaders.remove(headerKey);
        return this;
    }

    public AbstractRestClient
    clearHeaders()
    {
        itsHeaders.clear();
        return this;
    }

    public boolean
    hasHeader(String headerKey)
    {
        return itsHeaders.containsKey(headerKey);
    }

    public void
    close()
    {
        itsClient.close();
    }

    protected <Request,Reply> Reply
    doPost(String methodPath,Class<Reply> replyType,Request request)
    {
        return
            itsResponseProcessor.process(
                replyType,
                toResponse(
                    methodPath,
                    buildRequest(methodPath).post(Entity.json(request))));
    }

    protected <Request,Reply> Reply
    doPut(String methodPath,Class<Reply> replyType,Request request)
    {
        return
            itsResponseProcessor.process(
                replyType,
                toResponse(
                    methodPath,
                    buildRequest(methodPath)
                        .put(
                            Entity.entity(
                                request,
                                MediaType.APPLICATION_JSON))));
    }

    protected <Request,Reply> Reply
    doDelete(String methodPath,Class<Reply> replyType,Map<String,Object> params)
    {
        WebTarget target = itsBaseTarget.path(methodPath);

        for (Map.Entry<String,Object> param:params.entrySet())
            target.queryParam(param.getKey(),param.getValue());

        return
            itsResponseProcessor.process(
                replyType,
                toResponse(
                    methodPath,
                    target
                        .request(MediaType.APPLICATION_JSON)
                        .buildDelete()
                        .invoke()));
    }

    protected <Request,Reply> Reply
    doGet(String methodPath,Class<Reply> replyType,Map<String,Object> params)
    {
        WebTarget target = itsBaseTarget.path(methodPath);

        for (Map.Entry<String,Object> param:params.entrySet())
            target.queryParam(param.getKey(),param.getValue());

        return
            itsResponseProcessor.process(
                replyType,
                toResponse(
                    methodPath,
                    target
                        .request(MediaType.APPLICATION_JSON)
                        .buildGet()
                        .invoke()));
    }

    protected <Request,Reply> CompletionStage<Reply>
    doPostAsync(String methodPath,Class<Reply> replyType,Request request)
    {
        return
            buildRequest(methodPath)
                .rx()
                .post(Entity.json(request))
                .thenApply(
                    response ->
                        itsResponseProcessor.process(
                            replyType,
                            toResponse(methodPath,response)));
    }

    protected <Request,Reply> CompletionStage<Reply>
    doPutAsync(String methodPath,Class<Reply> replyType,Request request)
    {
        return
            buildRequest(methodPath)
                .rx()
                .put(
                    Entity.entity(
                        request,
                        MediaType.APPLICATION_JSON))
                .thenApply(
                    response ->
                        itsResponseProcessor.process(
                            replyType,
                            toResponse(methodPath,response)));
    }

    protected <Request,Reply> CompletionStage<Reply>
    doDeleteAsync(
        String             methodPath,
        Class<Reply>       replyType,
        Map<String,Object> pathParams,
        Map<String,Object> queryParams)
    {
        WebTarget target =
            itsBaseTarget
                .path(methodPath)
                .resolveTemplates(pathParams);

        for (Map.Entry<String,Object> param:queryParams.entrySet())
            target.queryParam(param.getKey(),param.getValue());

        return
            target
                .request(MediaType.APPLICATION_JSON)
                .rx()
                .delete()
                .thenApply(
                    response ->
                        itsResponseProcessor.process(
                            replyType,
                            toResponse(methodPath,response)));
    }

    protected <Request,Reply> CompletionStage<Reply>
    doGetAsync(
        String             methodPath,
        Class<Reply>       replyType,
        Map<String,Object> pathParams,
        Map<String,Object> queryParams)
    {
        WebTarget target =
            itsBaseTarget
                .path(methodPath)
                .resolveTemplates(pathParams);

        for (Map.Entry<String,Object> param:queryParams.entrySet())
            target.queryParam(param.getKey(),param.getValue());

        return
            target
                .request(MediaType.APPLICATION_JSON)
                .rx()
                .get()
                .thenApply(
                    response ->
                        itsResponseProcessor.process(
                            replyType,
                            toResponse(methodPath,response)));
    }

    private Invocation.Builder
    buildRequest(String path)
    {
        return
            itsBaseTarget
                .path(path)
                .request(MediaType.APPLICATION_JSON)
                .headers(itsHeaders)
                .accept(MediaType.APPLICATION_JSON);
    }

    private static String
    initialize(String baseUrl,String endpointPath)
    {
        return
            baseUrl.endsWith("/" + endpointPath)
                ? baseUrl
                : baseUrl + "/" + endpointPath;
    }

    private IResponse
    toResponse(String methodPath,Response response)
    {
        return
            new StandardResponse(
                itsBaseTarget.getUri().toString(),
                methodPath,
                response);
    }
}

//////////////////////////////////////////////////////////////////////////////
