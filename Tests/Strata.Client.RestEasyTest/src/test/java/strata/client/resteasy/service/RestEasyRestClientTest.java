//////////////////////////////////////////////////////////////////////////////
// RestEasyRestClientTest.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.resteasy.service;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import strata.client.core.service.CountedClient;
import strata.client.core.service.ObjectMapperProvider;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.AbstractExecutorService;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@Tag("CommitStage")
public
class RestEasyRestClientTest
{
    private HttpServer      server;
    private ExecutorService serverExecutor;
    private List<String>    receivedMethods;
    private String          baseUrl;

    @BeforeEach
    public void
    setUp() throws IOException
    {
        receivedMethods = Collections.synchronizedList(new ArrayList<>());
        serverExecutor = Executors.newFixedThreadPool(8);
        server = HttpServer.create(new InetSocketAddress("127.0.0.1",0),0);
        server.createContext(
            "/" + TestRestClient.ENDPOINT_PATH + "/" + TestRestClient.METHOD_PATH,
            this::respond);
        server.setExecutor(serverExecutor);
        server.start();
        baseUrl = "http://127.0.0.1:" + server.getAddress().getPort();
    }

    @AfterEach
    public void
    tearDown()
    {
        server.stop(0);
        serverExecutor.shutdownNow();
    }

    @Test
    public void
    testRepeatedSyncGetsSucceedOnSameInstance()
    {
        try (TestRestClient client = new TestRestClient(ClientBuilder.newBuilder(),baseUrl))
        {
            for (int i = 0; i < 3; i++)
                assertEquals("ok",client.get().getValue());
        }

        assertEquals(List.of("GET","GET","GET"),receivedMethods);
    }

    @Test
    public void
    testRepeatedSyncPostPutDeleteSucceed()
    {
        try (TestRestClient client = new TestRestClient(ClientBuilder.newBuilder(),baseUrl))
        {
            for (int i = 0; i < 2; i++)
            {
                assertEquals("ok",client.post(new TestReply("in")).getValue());
                assertEquals("ok",client.put(new TestReply("in")).getValue());
                assertEquals("ok",client.delete().getValue());
            }
        }

        assertEquals(
            List.of("POST","PUT","DELETE","POST","PUT","DELETE"),
            receivedMethods);
    }

    @Test
    public void
    testRepeatedAsyncRequestsSucceedOnSameInstance() throws Exception
    {
        try (TestRestClient client = new TestRestClient(ClientBuilder.newBuilder(),baseUrl))
        {
            for (int i = 0; i < 2; i++)
            {
                assertEquals("ok",join(client.getAsync()).getValue());
                assertEquals("ok",join(client.postAsync(new TestReply("in"))).getValue());
                assertEquals("ok",join(client.putAsync(new TestReply("in"))).getValue());
                assertEquals("ok",join(client.deleteAsync()).getValue());
            }
        }

        assertEquals(8,receivedMethods.size());
    }

    @Test
    public void
    testConcurrentAsyncGetsSucceed() throws Exception
    {
        try (TestRestClient client = new TestRestClient(ClientBuilder.newBuilder(),baseUrl))
        {
            List<CompletableFuture<TestReply>> futures = new ArrayList<>();

            for (int i = 0; i < 20; i++)
                futures.add(client.getAsync().toCompletableFuture());

            for (CompletableFuture<TestReply> future : futures)
                assertEquals("ok",future.get(10,TimeUnit.SECONDS).getValue());
        }

        assertEquals(20,receivedMethods.size());
    }

    @Test
    public void
    testRequestAfterCloseThrows()
    {
        TestRestClient client = new TestRestClient(ClientBuilder.newBuilder(),baseUrl);

        client.close();

        assertThrows(IllegalStateException.class,client::get);
    }

    @Test
    public void
    testCloseIsIdempotent()
    {
        TestRestClient client = new TestRestClient(ClientBuilder.newBuilder(),baseUrl);

        client.close();

        assertDoesNotThrow(client::close);
    }

    @Test
    public void
    testBuilderBuiltClientClosedOnClose()
    {
        AtomicInteger  closeCount = new AtomicInteger();
        TestRestClient client = new TestRestClient(new SpyClientBuilder(closeCount),baseUrl);

        assertEquals("ok",client.get().getValue());
        assertEquals(0,closeCount.get());

        client.close();
        assertEquals(1,closeCount.get());

        client.close();
        assertEquals(1,closeCount.get());
    }

    @Test
    public void
    testClosingOneSharingInstanceLeavesOtherWorking()
    {
        try (CountedClient shared = newSharedClient(new AtomicInteger(),true))
        {
            TestRestClient first = new TestRestClient(shared,baseUrl);
            TestRestClient second = new TestRestClient(shared,baseUrl);

            assertEquals("ok",first.get().getValue());

            first.close();

            assertEquals("ok",second.get().getValue());

            second.close();
        }
    }

    @Test
    public void
    testRepeatedCloseDoesNotReleaseSharedClientEarly()
    {
        AtomicInteger closeCount = new AtomicInteger();
        CountedClient shared = newSharedClient(closeCount,true);
        TestRestClient first = new TestRestClient(shared,baseUrl);
        TestRestClient second = new TestRestClient(shared,baseUrl);

        shared.close();
        first.close();
        first.close();
        first.close();

        assertEquals(0,closeCount.get());
        assertEquals("ok",second.get().getValue());

        second.close();

        assertEquals(1,closeCount.get());
    }

    @Test
    public void
    testCountedSharedClientClosedOnlyAfterAllReferencesReleased()
    {
        AtomicInteger  closeCount = new AtomicInteger();
        CountedClient  shared = newSharedClient(closeCount,true);
        TestRestClient first = new TestRestClient(shared,baseUrl);
        TestRestClient second = new TestRestClient(shared,baseUrl);

        first.close();
        assertEquals(0,closeCount.get());

        second.close();
        assertEquals(0,closeCount.get());

        shared.close();
        assertEquals(1,closeCount.get());
    }

    @Test
    public void
    testConstructingFromClosedCountedClientThrows()
    {
        CountedClient shared = newSharedClient(new AtomicInteger(),true);

        shared.close();

        assertThrows(
            IllegalStateException.class,
            () -> new TestRestClient(shared,baseUrl));
    }

    @Test
    public void
    testUncountedSharedClientClosedWhenLastInstanceCloses()
    {
        AtomicInteger  closeCount = new AtomicInteger();
        CountedClient  shared = newSharedClient(closeCount,false);
        TestRestClient first = new TestRestClient(shared,baseUrl);
        TestRestClient second = new TestRestClient(shared,baseUrl);

        assertEquals("ok",first.get().getValue());

        first.close();
        assertEquals(0,closeCount.get());
        assertEquals("ok",second.get().getValue());

        second.close();
        assertEquals(1,closeCount.get());
        assertTrue(shared.isResourceClosed());
    }

    @Test
    public void
    testClosingUncountedSharedClientDoesNotReleaseActiveInstances()
    {
        AtomicInteger  closeCount = new AtomicInteger();
        CountedClient  shared = newSharedClient(closeCount,false);
        TestRestClient client = new TestRestClient(shared,baseUrl);

        shared.close();

        assertEquals(0,closeCount.get());
        assertEquals("ok",client.get().getValue());

        client.close();
        assertEquals(1,closeCount.get());
    }

    @Test
    public void
    testConstructingFromUncountedClientAfterResourceClosedThrows()
    {
        CountedClient  shared = newSharedClient(new AtomicInteger(),false);
        TestRestClient first = new TestRestClient(shared,baseUrl);

        first.close();

        assertTrue(shared.isResourceClosed());
        assertThrows(
            IllegalStateException.class,
            () -> new TestRestClient(shared,baseUrl));
    }

    @Test
    public void
    testCallerSuppliedExecutorIsUsedAndNotShutDown() throws Exception
    {
        AtomicInteger   executed = new AtomicInteger();
        ExecutorService pool = Executors.newFixedThreadPool(4);
        ExecutorService counting = counting(pool,executed);

        try
        {
            try (TestRestClient client =
                     new TestRestClient(ClientBuilder.newBuilder(),baseUrl,counting))
            {
                assertEquals("ok",join(client.getAsync()).getValue());
            }

            assertTrue(executed.get() > 0);
            assertFalse(counting.isShutdown());
        }
        finally
        {
            pool.shutdownNow();
        }
    }

    private void
    respond(HttpExchange exchange) throws IOException
    {
        receivedMethods.add(exchange.getRequestMethod());
        exchange.getRequestBody().readAllBytes();

        byte[] body = "{\"value\":\"ok\"}".getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().add("Content-Type","application/json");
        exchange.sendResponseHeaders(200,body.length);

        try (OutputStream output = exchange.getResponseBody())
        {
            output.write(body);
        }
    }

    private static CountedClient
    newSharedClient(AtomicInteger closeCount,boolean counted)
    {
        Client spy =
            SpyClients.countingCloses(
                ClientBuilder
                    .newBuilder()
                    .register(new ObjectMapperProvider())
                    .build(),
                closeCount);

        return
            counted
                ? CountedClient.ofCountedClient(spy)
                : CountedClient.ofUncountedClient(spy);
    }

    private static ExecutorService
    counting(ExecutorService delegate,AtomicInteger executed)
    {
        return
            new AbstractExecutorService()
            {
                @Override
                public void
                execute(Runnable command)
                {
                    executed.incrementAndGet();
                    delegate.execute(command);
                }

                @Override
                public void
                shutdown() { delegate.shutdown(); }

                @Override
                public List<Runnable>
                shutdownNow() { return delegate.shutdownNow(); }

                @Override
                public boolean
                isShutdown() { return delegate.isShutdown(); }

                @Override
                public boolean
                isTerminated() { return delegate.isTerminated(); }

                @Override
                public boolean
                awaitTermination(long timeout,TimeUnit unit) throws InterruptedException
                {
                    return delegate.awaitTermination(timeout,unit);
                }
            };
    }

    private static <T> T
    join(java.util.concurrent.CompletionStage<T> stage) throws Exception
    {
        return stage.toCompletableFuture().get(10,TimeUnit.SECONDS);
    }
}

//////////////////////////////////////////////////////////////////////////////
