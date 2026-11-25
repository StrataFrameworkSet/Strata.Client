//////////////////////////////////////////////////////////////////////////////
// TestRestClient.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.resteasy.service;

import jakarta.ws.rs.client.ClientBuilder;
import strata.client.core.service.CountedClient;
import strata.client.core.service.StandardResponseProcessor;
import strata.foundation.core.utility.BasicRetryExecutor;

import java.util.Map;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.ExecutorService;

public
class TestRestClient
    extends RestEasyRestClient
{
    public static final String ENDPOINT_PATH = "api";
    public static final String METHOD_PATH = "items";

    public
    TestRestClient(ClientBuilder builder,String baseUrl)
    {
        super(
            builder,
            baseUrl,
            ENDPOINT_PATH,
            new StandardResponseProcessor(),
            new BasicRetryExecutor(1,0L,1.0));
    }

    public
    TestRestClient(ClientBuilder builder,String baseUrl,ExecutorService executorService)
    {
        super(
            builder,
            baseUrl,
            ENDPOINT_PATH,
            new StandardResponseProcessor(),
            new BasicRetryExecutor(1,0L,1.0),
            executorService);
    }

    public
    TestRestClient(CountedClient client,String baseUrl)
    {
        super(
            client,
            baseUrl,
            ENDPOINT_PATH,
            new StandardResponseProcessor(),
            new BasicRetryExecutor(1,0L,1.0));
    }

    public TestReply
    get()
    {
        return doGet(METHOD_PATH,TestReply.class,Map.of());
    }

    public TestReply
    post(TestReply request)
    {
        return doPost(METHOD_PATH,TestReply.class,request);
    }

    public TestReply
    put(TestReply request)
    {
        return doPut(METHOD_PATH,TestReply.class,request);
    }

    public TestReply
    delete()
    {
        return doDelete(METHOD_PATH,TestReply.class,Map.of());
    }

    public CompletionStage<TestReply>
    getAsync()
    {
        return doGetAsync(METHOD_PATH,TestReply.class,Map.of());
    }

    public CompletionStage<TestReply>
    postAsync(TestReply request)
    {
        return doPostAsync(METHOD_PATH,TestReply.class,request);
    }

    public CompletionStage<TestReply>
    putAsync(TestReply request)
    {
        return doPutAsync(METHOD_PATH,TestReply.class,request);
    }

    public CompletionStage<TestReply>
    deleteAsync()
    {
        return doDeleteAsync(METHOD_PATH,TestReply.class,Map.of());
    }
}

//////////////////////////////////////////////////////////////////////////////
