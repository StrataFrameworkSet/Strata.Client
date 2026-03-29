/// ///////////////////////////////////////////////////////////////////////////
// AbstractWebSocketClientEventSender.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.websocket.event;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.ClientEndpointConfig;
import jakarta.websocket.ClientEndpointConfig.Builder;
import jakarta.websocket.ContainerProvider;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.Session;
import jakarta.websocket.WebSocketContainer;
import strata.foundation.core.event.CompletableSendResult;
import strata.foundation.core.event.ICompletableSendResult;
import strata.foundation.core.event.IEventSender;
import strata.foundation.core.event.SendResult;
import strata.foundation.core.mapper.ObjectMapperSupplier;

import java.net.URI;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

public abstract
class AbstractWebSocketClientEventSender<E>
    implements IEventSender<E>
{
    private final URI                      uri;
    private final WebSocketContainer       container;
    private final ClientEndpointConfig     config;
    private final ObjectMapper             mapper;
    private final AtomicBoolean            opened;
    private final AtomicReference<Session> session;

    protected
    AbstractWebSocketClientEventSender(URI uri)
    {
        this(uri,ContainerProvider.getWebSocketContainer(),null);
    }

    protected
    AbstractWebSocketClientEventSender(URI uri,WebSocketContainer container)
    {
        this(uri,container,null);
    }

    protected
    AbstractWebSocketClientEventSender(
        URI                  uri,
        WebSocketContainer   container,
        ClientEndpointConfig config)
    {
        this.uri       = uri;
        this.container = container;
        this.config    = config != null ? config : Builder.create().build();
        this.mapper    = new ObjectMapperSupplier().get();
        this.opened    = new AtomicBoolean(false);
        this.session   = new AtomicReference<>(null);
    }

    @Override
    public IEventSender<E>
    open() throws Exception
    {
        if (!opened.getAndSet(true))
        {
            Session s =
                container.connectToServer(
                    new Endpoint()
                    {
                        @Override
                        public void
                        onOpen(Session session,EndpointConfig endpointConfig) {}

                        @Override
                        public void
                        onError(Session session,Throwable throwable)
                        {
                            throwable.printStackTrace();
                        }
                    },
                    config,
                    uri);

            session.set(s);
        }

        return this;
    }

    @Override
    public IEventSender<E>
    close() throws Exception
    {
        if (opened.getAndSet(false))
        {
            Session s = session.getAndSet(null);

            if (s != null && s.isOpen())
                s.close();
        }

        return this;
    }

    @Override
    public ICompletableSendResult<E>
    send(E e)
    {
        CompletableFuture<SendResult<E>> future =
            new CompletableFuture<>();

        try
        {
            Session s = session.get();

            if (s == null || !s.isOpen())
                throw new IllegalStateException("sender not open");

            String payload = mapper.writeValueAsString(e);

            s
                .getAsyncRemote()
                .sendText(
                    payload,
                    result ->
                    {
                        if (result.isOK())
                            future.complete(new SendResult<>(e));
                        else
                            future.complete(
                                new SendResult<>(
                                    result.getException()));
                    });
        }
        catch (JsonProcessingException ex)
        {
            future.complete(new SendResult<>(ex));
        }

        return new CompletableSendResult<>(future);
    }

    @Override
    public boolean
    isOpen()
    {
        return opened.get();
    }

    @Override
    public boolean
    isClosed()
    {
        return !opened.get();
    }

    protected Session
    getSession()
    {
        return session.get();
    }

    protected URI
    getUri()
    {
        return uri;
    }
}

//////////////////////////////////////////////////////////////////////////////
