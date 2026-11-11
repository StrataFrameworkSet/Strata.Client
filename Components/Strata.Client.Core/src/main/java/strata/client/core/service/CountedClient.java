//////////////////////////////////////////////////////////////////////////////
// CountedClient.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.service;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.Invocation.Builder;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.Configuration;
import jakarta.ws.rs.core.Link;
import jakarta.ws.rs.core.UriBuilder;
import strata.foundation.core.utility.CountedCloseable;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import java.net.URI;
import java.util.Map;

public
class CountedClient
    extends CountedCloseable<Client>
    implements Client
{
    public
    CountedClient(Client client)
    {
        super(client);
    }

    public
    CountedClient(CountedClient other)
    {
        super((CountedCloseable<Client>)other);
    }

    @Override
    public CountedClient
    copy() { return new CountedClient(this); }

    @Override
    public void
    close()
    {
        try
        {
            super.close();
        }
        catch (RuntimeException e)
        {
            throw e;
        }
        catch (Exception e)
        {
            throw new RuntimeException(e);
        }
    }

    @Override
    public WebTarget
    target(String uri)
    {
        return get().target(uri);
    }

    @Override
    public WebTarget
    target(URI uri)
    {
        return get().target(uri);
    }

    @Override
    public WebTarget
    target(UriBuilder uriBuilder)
    {
        return get().target(uriBuilder);
    }

    @Override
    public WebTarget
    target(Link link)
    {
        return get().target(link);
    }

    @Override
    public Builder
    invocation(Link link)
    {
        return get().invocation(link);
    }

    @Override
    public SSLContext
    getSslContext()
    {
        return get().getSslContext();
    }

    @Override
    public HostnameVerifier
    getHostnameVerifier()
    {
        return get().getHostnameVerifier();
    }

    @Override
    public Configuration
    getConfiguration()
    {
        return get().getConfiguration();
    }

    @Override
    public CountedClient
    property(String name,Object value)
    {
        get().property(name,value);
        return this;
    }

    @Override
    public CountedClient
    register(Class<?> componentClass)
    {
        get().register(componentClass);
        return this;
    }

    @Override
    public CountedClient
    register(Class<?> componentClass,int priority)
    {
        get().register(componentClass,priority);
        return this;
    }

    @Override
    public CountedClient
    register(Class<?> componentClass,Class<?>... contracts)
    {
        get().register(componentClass,contracts);
        return this;
    }

    @Override
    public CountedClient
    register(Class<?> componentClass,Map<Class<?>,Integer> contracts)
    {
        get().register(componentClass,contracts);
        return this;
    }

    @Override
    public CountedClient
    register(Object component)
    {
        get().register(component);
        return this;
    }

    @Override
    public CountedClient
    register(Object component,int priority)
    {
        get().register(component,priority);
        return this;
    }

    @Override
    public CountedClient
    register(Object component,Class<?>... contracts)
    {
        get().register(component,contracts);
        return this;
    }

    @Override
    public CountedClient
    register(Object component,Map<Class<?>,Integer> contracts)
    {
        get().register(component,contracts);
        return this;
    }

    public static CountedClient
    of(Client client) { return new CountedClient(client); }
}

//////////////////////////////////////////////////////////////////////////////
