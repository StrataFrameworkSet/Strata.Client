//////////////////////////////////////////////////////////////////////////////
// CountedClientTest.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.service;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.Invocation;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.Configuration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

@Tag("CommitStage")
public
class CountedClientTest
{
    private AtomicInteger              closeCount;
    private AtomicReference<Exception> closeFailure;
    private List<String>               calls;
    private Map<String,Object>         returned;
    private Client                     delegate;
    private CountedClient              subject;

    @BeforeEach
    public void
    setUp()
    {
        closeCount = new AtomicInteger(0);
        closeFailure = new AtomicReference<>();
        calls = Collections.synchronizedList(new ArrayList<>());
        returned = new HashMap<>();
        delegate =
            (Client)Proxy.newProxyInstance(
                Client.class.getClassLoader(),
                new Class<?>[] {Client.class},
                (proxy,method,args) -> handle(proxy,method,args));
        subject = new CountedClient(delegate);
    }

    @Test
    public void
    testGetReturnsDelegate()
    {
        assertSame(delegate,subject.get());
    }

    @Test
    public void
    testCopyReturnsDistinctCountedClientSharingDelegate()
    {
        CountedClient copy = subject.copy();

        assertNotSame(subject,copy);
        assertSame(delegate,copy.get());
    }

    @Test
    public void
    testCopyConstructorSharesDelegate()
    {
        assertSame(delegate,new CountedClient(subject).get());
    }

    @Test
    public void
    testCloseSingleReferenceClosesDelegate()
    {
        subject.close();

        assertEquals(1,closeCount.get());
    }

    @Test
    public void
    testDelegateNotClosedUntilAllCopiesClosed()
    {
        CountedClient copy1 = subject.copy();
        CountedClient copy2 = copy1.copy();
        CountedClient copy3 = new CountedClient(subject);

        for (CountedClient client : List.of(copy2,subject,copy3))
        {
            client.close();
            assertEquals(0,closeCount.get());
        }

        copy1.close();
        assertEquals(1,closeCount.get());
    }

    @Test
    public void
    testExtraClosesDoNotCloseDelegateAgain()
    {
        subject.close();
        subject.close();
        subject.close();

        assertEquals(1,closeCount.get());
    }

    @Test
    public void
    testTryWithResourcesReleasesReference()
    {
        try (CountedClient copy = subject.copy())
        {
            assertSame(delegate,copy.get());
        }

        assertEquals(0,closeCount.get());

        try (CountedClient original = subject)
        {
            assertSame(delegate,original.get());
        }

        assertEquals(1,closeCount.get());
    }

    @Test
    public void
    testCloseRethrowsRuntimeExceptionUnchanged()
    {
        IllegalStateException expected = new IllegalStateException("failure");

        closeFailure.set(expected);

        assertSame(expected,assertThrows(IllegalStateException.class,subject::close));
    }

    @Test
    public void
    testCloseWrapsCheckedException()
    {
        Exception expected = new Exception("failure");

        closeFailure.set(expected);

        RuntimeException actual = assertThrows(RuntimeException.class,subject::close);

        assertSame(expected,actual.getCause());
    }

    @Test
    public void
    testTargetStringDelegates()
    {
        WebTarget result = subject.target("http://localhost/a");

        assertSame(returned.get("target"),result);
        assertEquals(List.of("target[http://localhost/a]"),calls);
    }

    @Test
    public void
    testTargetUriDelegates()
    {
        URI       uri = URI.create("http://localhost/b");
        WebTarget result = subject.target(uri);

        assertSame(returned.get("target"),result);
        assertEquals(List.of("target[http://localhost/b]"),calls);
    }

    @Test
    public void
    testTargetUriBuilderDelegates()
    {
        WebTarget result = subject.target((jakarta.ws.rs.core.UriBuilder)null);

        assertSame(returned.get("target"),result);
        assertEquals(List.of("target[null]"),calls);
    }

    @Test
    public void
    testTargetLinkDelegates()
    {
        WebTarget result = subject.target((jakarta.ws.rs.core.Link)null);

        assertSame(returned.get("target"),result);
        assertEquals(List.of("target[null]"),calls);
    }

    @Test
    public void
    testInvocationDelegates()
    {
        Invocation.Builder result = subject.invocation(null);

        assertSame(returned.get("invocation"),result);
        assertEquals(List.of("invocation[null]"),calls);
    }

    @Test
    public void
    testGetSslContextDelegates()
    {
        SSLContext result = subject.getSslContext();

        assertNotNull(result);
        assertSame(returned.get("getSslContext"),result);
        assertEquals(List.of("getSslContext[]"),calls);
    }

    @Test
    public void
    testGetHostnameVerifierDelegates()
    {
        HostnameVerifier result = subject.getHostnameVerifier();

        assertSame(returned.get("getHostnameVerifier"),result);
        assertEquals(List.of("getHostnameVerifier[]"),calls);
    }

    @Test
    public void
    testGetConfigurationDelegates()
    {
        Configuration result = subject.getConfiguration();

        assertSame(returned.get("getConfiguration"),result);
        assertEquals(List.of("getConfiguration[]"),calls);
    }

    @Test
    public void
    testPropertyDelegatesAndReturnsSelf()
    {
        assertSame(subject,subject.property("key","value"));
        assertEquals(List.of("property[key, value]"),calls);
    }

    @Test
    public void
    testRegisterClassOverloadsDelegateAndReturnSelf()
    {
        assertSame(subject,subject.register(String.class));
        assertSame(subject,subject.register(String.class,5));
        assertSame(subject,subject.register(String.class,Runnable.class));
        assertSame(subject,subject.register(String.class,Map.of(Runnable.class,7)));

        assertEquals(
            List.of(
                "register[class java.lang.String]",
                "register[class java.lang.String, 5]",
                "register[class java.lang.String, [interface java.lang.Runnable]]",
                "register[class java.lang.String, {interface java.lang.Runnable=7}]"),
            calls);
    }

    @Test
    public void
    testRegisterObjectOverloadsDelegateAndReturnSelf()
    {
        assertSame(subject,subject.register("component"));
        assertSame(subject,subject.register("component",5));
        assertSame(subject,subject.register("component",Runnable.class));
        assertSame(subject,subject.register("component",Map.of(Runnable.class,7)));

        assertEquals(
            List.of(
                "register[component]",
                "register[component, 5]",
                "register[component, [interface java.lang.Runnable]]",
                "register[component, {interface java.lang.Runnable=7}]"),
            calls);
    }

    @Test
    public void
    testCopiesShareConfiguration()
    {
        CountedClient copy = subject.copy();

        copy.property("key","value");

        assertEquals(List.of("property[key, value]"),calls);
        assertSame(subject.get(),copy.get());
    }

    @Test
    public void
    testOfCountedClientHoldsReference()
    {
        CountedClient counted = CountedClient.ofCountedClient(delegate);

        assertTrue(counted.isCounted());
        assertSame(delegate,counted.get());

        counted.close();

        assertEquals(1,closeCount.get());
        assertTrue(counted.isResourceClosed());
    }

    @Test
    public void
    testOfUncountedClientCopiesOwnResource()
    {
        CountedClient uncounted = CountedClient.ofUncountedClient(delegate);
        CountedClient copy1 = uncounted.copy();
        CountedClient copy2 = uncounted.copy();

        assertFalse(uncounted.isCounted());
        assertTrue(copy1.isCounted());

        copy1.close();
        assertEquals(0,closeCount.get());

        copy2.close();
        assertEquals(1,closeCount.get());
        assertTrue(uncounted.isResourceClosed());
    }

    @Test
    public void
    testClosingUncountedClientWithActiveCopiesDoesNotCloseDelegate()
    {
        CountedClient uncounted = CountedClient.ofUncountedClient(delegate);
        CountedClient copy = uncounted.copy();

        uncounted.close();
        assertEquals(0,closeCount.get());

        copy.close();
        assertEquals(1,closeCount.get());
    }

    @Test
    public void
    testCopyOfClosedReferenceThrows()
    {
        CountedClient copy = subject.copy();

        copy.close();

        assertTrue(copy.isReferenceClosed());
        assertThrows(IllegalStateException.class,copy::copy);
        assertThrows(IllegalStateException.class,() -> new CountedClient(copy));
    }

    @Test
    public void
    testCopyAfterResourceClosedThrows()
    {
        CountedClient uncounted = CountedClient.ofUncountedClient(delegate);

        uncounted.copy().close();

        assertTrue(uncounted.isResourceClosed());
        assertThrows(IllegalStateException.class,uncounted::copy);
    }

    @Test
    public void
    testNullClientRejected()
    {
        assertThrows(NullPointerException.class,() -> new CountedClient((Client)null));
        assertThrows(NullPointerException.class,() -> CountedClient.ofUncountedClient(null));
    }

    @Test
    public void
    testConcurrentCopyAndCloseClosesDelegateExactlyOnce() throws Exception
    {
        int             threads = 16;
        int             perThread = 1000;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch  start = new CountDownLatch(1);
        List<Future<?>> futures = new ArrayList<>();

        try
        {
            for (int i = 0; i < threads; i++)
            {
                futures.add(
                    executor.submit(
                        () ->
                        {
                            start.await();

                            for (int j = 0; j < perThread; j++)
                                subject.copy().close();

                            return null;
                        }));
            }

            start.countDown();

            for (Future<?> future : futures)
                future.get();
        }
        finally
        {
            executor.shutdownNow();
        }

        assertEquals(0,closeCount.get());

        subject.close();

        assertEquals(1,closeCount.get());
    }

    private Object
    handle(Object proxy,Method method,Object[] args) throws Exception
    {
        switch (method.getName())
        {
            case "equals":
                return proxy == args[0];

            case "hashCode":
                return System.identityHashCode(proxy);

            case "toString":
                return "FakeClient";

            case "close":
                closeCount.incrementAndGet();

                if (closeFailure.get() != null)
                    throw closeFailure.get();

                return null;

            default:
                break;
        }

        calls.add(method.getName() + format(args));

        Class<?> type = method.getReturnType();

        if (type == Client.class)
            return proxy;

        return
            returned.computeIfAbsent(
                method.getName(),
                name -> create(type));
    }

    private static String
    format(Object[] args)
    {
        if (args == null)
            return "[]";

        return
            Arrays
                .stream(args)
                .map(
                    arg ->
                        arg instanceof Object[] array
                            ? Arrays.toString(array)
                            : String.valueOf(arg))
                .toList()
                .toString();
    }

    private static Object
    create(Class<?> type)
    {
        if (type == SSLContext.class)
        {
            try
            {
                return SSLContext.getDefault();
            }
            catch (Exception e)
            {
                throw new IllegalStateException(e);
            }
        }

        return
            Proxy.newProxyInstance(
                type.getClassLoader(),
                new Class<?>[] {type},
                (proxy,method,args) ->
                    switch (method.getName())
                    {
                        case "equals" -> proxy == args[0];
                        case "hashCode" -> System.identityHashCode(proxy);
                        case "toString" -> type.getSimpleName();
                        default -> null;
                    });
    }
}

//////////////////////////////////////////////////////////////////////////////
