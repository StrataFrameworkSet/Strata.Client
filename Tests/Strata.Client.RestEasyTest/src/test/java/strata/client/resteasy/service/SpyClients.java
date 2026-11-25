//////////////////////////////////////////////////////////////////////////////
// SpyClients.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.resteasy.service;

import jakarta.ws.rs.client.Client;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Proxy;
import java.util.concurrent.atomic.AtomicInteger;

public final
class SpyClients
{
    private
    SpyClients() {}

    public static Client
    countingCloses(Client real,AtomicInteger closeCount)
    {
        return
            (Client)Proxy.newProxyInstance(
                Client.class.getClassLoader(),
                new Class<?>[] {Client.class},
                (proxy,method,args) ->
                {
                    if (method.getName().equals("close"))
                        closeCount.incrementAndGet();

                    try
                    {
                        return method.invoke(real,args);
                    }
                    catch (InvocationTargetException e)
                    {
                        throw e.getCause();
                    }
                });
    }
}

//////////////////////////////////////////////////////////////////////////////
