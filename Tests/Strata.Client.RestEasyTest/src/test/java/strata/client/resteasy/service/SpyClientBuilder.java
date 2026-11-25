//////////////////////////////////////////////////////////////////////////////
// SpyClientBuilder.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.resteasy.service;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.core.Configuration;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import java.security.KeyStore;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public
class SpyClientBuilder
    extends ClientBuilder
{
    private final ClientBuilder delegate;
    private final AtomicInteger closeCount;

    public
    SpyClientBuilder(AtomicInteger closeCount)
    {
        this.delegate = ClientBuilder.newBuilder();
        this.closeCount = closeCount;
    }

    @Override
    public Client
    build()
    {
        return SpyClients.countingCloses(delegate.build(),closeCount);
    }

    @Override
    public ClientBuilder
    withConfig(Configuration config)
    {
        delegate.withConfig(config);
        return this;
    }

    @Override
    public ClientBuilder
    sslContext(SSLContext sslContext)
    {
        delegate.sslContext(sslContext);
        return this;
    }

    @Override
    public ClientBuilder
    keyStore(KeyStore keyStore,char[] password)
    {
        delegate.keyStore(keyStore,password);
        return this;
    }

    @Override
    public ClientBuilder
    trustStore(KeyStore trustStore)
    {
        delegate.trustStore(trustStore);
        return this;
    }

    @Override
    public ClientBuilder
    hostnameVerifier(HostnameVerifier verifier)
    {
        delegate.hostnameVerifier(verifier);
        return this;
    }

    @Override
    public ClientBuilder
    executorService(ExecutorService executorService)
    {
        delegate.executorService(executorService);
        return this;
    }

    @Override
    public ClientBuilder
    scheduledExecutorService(ScheduledExecutorService scheduledExecutorService)
    {
        delegate.scheduledExecutorService(scheduledExecutorService);
        return this;
    }

    @Override
    public ClientBuilder
    connectTimeout(long timeout,TimeUnit unit)
    {
        delegate.connectTimeout(timeout,unit);
        return this;
    }

    @Override
    public ClientBuilder
    readTimeout(long timeout,TimeUnit unit)
    {
        delegate.readTimeout(timeout,unit);
        return this;
    }

    @Override
    public Configuration
    getConfiguration()
    {
        return delegate.getConfiguration();
    }

    @Override
    public ClientBuilder
    property(String name,Object value)
    {
        delegate.property(name,value);
        return this;
    }

    @Override
    public ClientBuilder
    register(Class<?> componentClass)
    {
        delegate.register(componentClass);
        return this;
    }

    @Override
    public ClientBuilder
    register(Class<?> componentClass,int priority)
    {
        delegate.register(componentClass,priority);
        return this;
    }

    @Override
    public ClientBuilder
    register(Class<?> componentClass,Class<?>... contracts)
    {
        delegate.register(componentClass,contracts);
        return this;
    }

    @Override
    public ClientBuilder
    register(Class<?> componentClass,Map<Class<?>,Integer> contracts)
    {
        delegate.register(componentClass,contracts);
        return this;
    }

    @Override
    public ClientBuilder
    register(Object component)
    {
        delegate.register(component);
        return this;
    }

    @Override
    public ClientBuilder
    register(Object component,int priority)
    {
        delegate.register(component,priority);
        return this;
    }

    @Override
    public ClientBuilder
    register(Object component,Class<?>... contracts)
    {
        delegate.register(component,contracts);
        return this;
    }

    @Override
    public ClientBuilder
    register(Object component,Map<Class<?>,Integer> contracts)
    {
        delegate.register(component,contracts);
        return this;
    }
}

//////////////////////////////////////////////////////////////////////////////
