//////////////////////////////////////////////////////////////////////////////
// AbstractRestClient.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.resteasy.service;

import jakarta.ws.rs.client.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.MultivaluedHashMap;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import strata.client.core.service.*;
import strata.foundation.core.transfer.AbstractServiceRequest;
import strata.foundation.core.utility.BasicRetryExecutor;
import strata.foundation.core.utility.IRetryExecutor;


import java.util.*;
import java.util.concurrent.CompletionStage;

public abstract
class RestEasyRestClient
{
    private final ClientBuilder           builder;
    private final String                  baseUrl;
    private final String                  endpointPath;
    private MultivaluedMap<String,Object> headers;
    private IResponseProcessor            responseProcessor;
    private final IRetryExecutor          retry;
    private final Logger                  logger;

    protected
    RestEasyRestClient(
        ClientBuilder builder,
        String        baseUrl,
        String        endpointPath)
    {
        this(
            builder,
            baseUrl,
            endpointPath,
            new StandardResponseProcessor(),
            new BasicRetryExecutor());
    }

    protected
    RestEasyRestClient(
        ClientBuilder      builder,
        String             baseUrl,
        String             endpointPath,
        IResponseProcessor processor,
        IRetryExecutor     retry)
    {
        this.builder = builder;
        this.baseUrl = baseUrl;
        this.endpointPath = endpointPath;
        this.headers = new MultivaluedHashMap<>();
        this.responseProcessor = processor;
        this.retry = retry;
        this.logger = LogManager.getLogger(getClass());
    }

    @Deprecated
    public RestEasyRestClient
    setHeader(String headerKey,String headerValue)
    {
        headers.add(headerKey,headerValue);
        return this;
    }

    @Deprecated
    public RestEasyRestClient
    clearHeader(String headerKey)
    {
        headers.remove(headerKey);
        return this;
    }

    @Deprecated
    public RestEasyRestClient
    clearHeaders()
    {
        headers.clear();
        return this;
    }

    @Deprecated
    public Set<String>
    getHeaderKeys()
    {
        return headers.keySet();
    }

    @Deprecated
    public List<Object>
    getHeader(String headerKey)
    {
        return headers.get(headerKey);
    }

    @Deprecated
    public boolean
    hasHeader(String headerKey)
    {
        return headers.containsKey(headerKey);
    }

    protected <Request,Reply> Reply
    doPost(String methodPath,Class<Reply> replyType,Request request)
    {
        return
            retry.executeGet(
                () -> doPostInternal(methodPath,replyType,request));
    }

    protected <Request,Reply> Reply
    doPut(String methodPath,Class<Reply> replyType,Request request)
    {
        return
            retry.executeGet(
                () -> doPutInternal(methodPath,replyType,request));
    }

    protected <Reply> Reply
    doDelete(String methodPath,Class<Reply> replyType,Map<String,Object> params)
    {
        return
            retry.executeGet(
                () -> doDeleteInternal(methodPath,replyType,params));
    }

    protected <Reply> Reply
    doGet(String methodPath,Class<Reply> replyType,Map<String,Object> params)
    {
        return
            retry.executeGet(
                () -> doGetInternal(methodPath,replyType,params));
    }

    protected <Request,Reply> CompletionStage<Reply>
    doPostAsync(String methodPath,Class<Reply> replyType,Request request)
    {
        return
            retry.executeGet(
                () -> doPostAsyncInternal(methodPath,replyType,request));
    }

    protected <Request,Reply> CompletionStage<Reply>
    doPutAsync(String methodPath,Class<Reply> replyType,Request request)
    {
        return
            retry.executeGet(
                () -> doPutAsyncInternal(methodPath,replyType,request));
    }

    protected <Reply> CompletionStage<Reply>
    doDeleteAsync(String methodPath,Class<Reply> replyType,Map<String,Object> params)
    {
        return
            retry.executeGet(
                () -> doDeleteAsyncInternal(methodPath,replyType,Map.of(),params));
    }

    protected <Reply> CompletionStage<Reply>
    doGetAsync(String methodPath,Class<Reply> replyType,Map<String,Object> params)
    {
        return
            retry.executeGet(
                () -> doGetAsyncInternal(methodPath,replyType,Map.of(),params));
    }

    private <Request,Reply> Reply
    doPostInternal(String methodPath,Class<Reply> replyType,Request request)
    {
        Client client =
            builder
                .register(new ObjectMapperProvider())
                .build();

        try
        {
            return
                responseProcessor.process(
                    replyType,
                    toResponse(
                        methodPath,
                        buildRequest(client,methodPath,request).post(Entity.json(request))));
        }
        finally
        {
            if (Objects.nonNull(client))
            {
                logger.debug("Closing client");
                client.close();
            }
        }
    }

    private <Request,Reply> Reply
    doPutInternal(String methodPath,Class<Reply> replyType,Request request)
    {
        Client client =
            builder
                .register(new ObjectMapperProvider())
                .build();

        try
        {
            return
                responseProcessor.process(
                    replyType,
                    toResponse(
                        methodPath,
                        buildRequest(client,methodPath,request)
                            .put(
                                Entity.entity(
                                    request,
                                    MediaType.APPLICATION_JSON))));
        }
        finally
        {
            if (Objects.nonNull(client))
            {
                logger.debug("Closing client");
                client.close();
            }
        }
    }

    private <Reply> Reply
    doDeleteInternal(String methodPath,Class<Reply> replyType,Map<String,Object> params)
    {
        Client client =
            builder
                .register(new ObjectMapperProvider())
                .build();

        try
        {
            return
                responseProcessor.process(
                    replyType,
                    toResponse(
                        methodPath,
                        buildRequest(client,methodPath,null,Map.of(),params)
                            .buildDelete()
                            .invoke()));
        }
        finally
        {
            if (Objects.nonNull(client))
            {
                logger.debug("Closing client");
                client.close();
            }
        }
    }

    private <Reply> Reply
    doGetInternal(String methodPath,Class<Reply> replyType,Map<String,Object> params)
    {
        Client client =
            builder
                .register(new ObjectMapperProvider())
                .build();
        try
        {
            return
                responseProcessor.process(
                    replyType,
                    toResponse(
                        methodPath,
                        buildRequest(client,methodPath,null,Map.of(),params)
                            .buildGet()
                            .invoke()));
        }
        finally
        {
            if (Objects.nonNull(client))
            {
                logger.debug("Closing client");
                client.close();
            }
        }
    }

    private <Request,Reply> CompletionStage<Reply>
    doPostAsyncInternal(String methodPath,Class<Reply> replyType,Request request)
    {
        Client client =
            builder
                .register(new ObjectMapperProvider())
                .build();

        return
            buildRequest(client,methodPath,request)
                .rx()
                .post(Entity.json(request))
                .thenApply(
                    response ->
                        processResponse(client,methodPath,replyType,response));
    }

    private <Request,Reply> CompletionStage<Reply>
    doPutAsyncInternal(String methodPath,Class<Reply> replyType,Request request)
    {
        Client client =
            builder
                .register(new ObjectMapperProvider())
                .build();

        return
            buildRequest(client,methodPath,request)
                .rx()
                .put(
                    Entity.entity(
                        request,
                        MediaType.APPLICATION_JSON))
                .thenApply(
                    response ->
                        processResponse(client,methodPath,replyType,response));
    }

    private <Reply> CompletionStage<Reply>
    doDeleteAsyncInternal(
        String             methodPath,
        Class<Reply>       replyType,
        Map<String,Object> pathParams,
        Map<String,Object> queryParams)
    {
        Client client =
            builder
                .register(new ObjectMapperProvider())
                .build();

        return
            buildRequest(client,methodPath,null,pathParams,queryParams)
                .rx()
                .delete()
                .thenApply(
                    response ->
                        processResponse(client,methodPath,replyType,response));
    }

    protected <Reply> CompletionStage<Reply>
    doGetAsyncInternal(
        String             methodPath,
        Class<Reply>       replyType,
        Map<String,Object> pathParams,
        Map<String,Object> queryParams)
    {
        Client client =
            builder
                .register(new ObjectMapperProvider())
                .build();

        return
            buildRequest(client,methodPath,null,pathParams,queryParams)
                .rx()
                .get()
                .thenApply(
                    response ->
                        processResponse(client,methodPath,replyType,response));
    }

    private <Request> Invocation.Builder
    buildRequest(Client client,String path,Request request)
    {
        Invocation.Builder requestBuilder =
            client
                .target(initialize(baseUrl,endpointPath))
                .path(path)
                .request(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON);

        if (request instanceof AbstractServiceRequest serviceRequest)
        {
            MultivaluedMap<String,Object> requestHeaders = new MultivaluedHashMap<>();

            if (Objects.nonNull(headers) && !headers.isEmpty())
                requestHeaders.putAll(headers);

            serviceRequest
                .getHeaders()
                .flatten()
                .forEach(entry -> requestHeaders.add(entry.getKey(),entry.getValue()));

            requestBuilder.headers(requestHeaders);

            serviceRequest
                .getCookies()
                .forEach(
                    cookie -> requestBuilder.cookie(cookie.getName(),cookie.getValue()));
        }

        logger.debug(
            "Sending request: {}",
            getRequestPath(baseUrl,endpointPath,path));

        return requestBuilder;
    }

    private <Request> Invocation.Builder
    buildRequest(
        Client             client,
        String             path,
        Request            request,
        Map<String,Object> pathParams,
        Map<String,Object> queryParams)
    {
        WebTarget target =
            client
                .target(initialize(baseUrl,endpointPath))
                .path(path)
                .resolveTemplates(pathParams);

        if (Objects.nonNull(queryParams) && !queryParams.isEmpty())
            queryParams
                .entrySet()
                .forEach(param -> target.queryParam(param.getKey(),param.getValue()));

        Invocation.Builder requestBuilder =
            target
                .request(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON);

        if (request instanceof AbstractServiceRequest serviceRequest)
        {
            MultivaluedMap<String,Object> requestHeaders = new MultivaluedHashMap<>();

            if (Objects.nonNull(headers) && !headers.isEmpty())
                requestHeaders.putAll(headers);

            serviceRequest
                .getHeaders()
                .flatten()
                .forEach(entry -> requestHeaders.add(entry.getKey(),entry.getValue()));

            requestBuilder.headers(requestHeaders);

            serviceRequest
                .getCookies()
                .forEach(
                    cookie -> requestBuilder.cookie(cookie.getName(),cookie.getValue()));
        }

        logger.debug(
            "Sending request: {}",
            getRequestPath(baseUrl,endpointPath,path));

        return requestBuilder;
    }

    private static String
    initialize(String baseUrl,String endpointPath)
    {
        if (endpointPath.startsWith("/"))
            endpointPath = endpointPath.substring(1);

        if (endpointPath.endsWith("/"))
            endpointPath = endpointPath.substring(0,endpointPath.length() - 1);

        return
            baseUrl.endsWith("/" + endpointPath)
                ? baseUrl
                : baseUrl.endsWith("/")
                    ? baseUrl + endpointPath
                    : baseUrl + "/" + endpointPath;
    }

    private static String
    getRequestPath(String baseUrl,String endpointPath,String methodPath)
    {
        return
            initialize(baseUrl,endpointPath) +
            (methodPath.startsWith("/") ? methodPath : "/" + methodPath);
    }

    private <Reply> Reply
    processResponse(
        Client       client,
        String       methodPath,
        Class<Reply> replyType,
        Response     response)
    {
        try
        {
            return
                responseProcessor.process(
                    replyType,
                    toResponse(methodPath,response));
        }
        finally
        {
            if (Objects.nonNull(client))
            {
                logger.debug("Closing client");
                client.close();
            }
        }
    }

    private IResponse
    toResponse(String methodPath,Response response)
    {
        IResponse output =
            new StandardResponse(
                initialize(baseUrl,endpointPath),
                methodPath,
                response);

        logger.debug(
            "Received response for: {}",
            output.getRequestPath());
        return output;
    }
}

//////////////////////////////////////////////////////////////////////////////
