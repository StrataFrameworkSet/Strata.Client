/// ///////////////////////////////////////////////////////////////////////////
// AbstractWebSocketClientEventReceiver.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.websocket.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.ClientEndpointConfig;
import jakarta.websocket.ContainerProvider;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.Session;
import jakarta.websocket.WebSocketContainer;
import strata.foundation.core.event.AbstractEventReceiver;
import strata.foundation.core.event.IEventListener;
import strata.foundation.core.mapper.ObjectMapperSupplier;

import java.net.URI;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

public abstract
class AbstractWebSocketClientEventReceiver<E,L extends IEventListener<E>>
    extends AbstractEventReceiver<E,L>
{
    private final URI                      uri;
    private final Class<E>                 eventType;
    private final WebSocketContainer       container;
    private final ClientEndpointConfig     config;
    private final ObjectMapper             mapper;
    private final AtomicReference<Session> session;
    private ExecutorService                executor;
    private AtomicBoolean                  listening;

    protected
    AbstractWebSocketClientEventReceiver(URI uri,Class<E> eventType)
    {
        this(uri,eventType,ContainerProvider.getWebSocketContainer(),null);
    }

    protected
    AbstractWebSocketClientEventReceiver(
        URI                uri,
        Class<E>           eventType,
        WebSocketContainer container)
    {
        this(uri,eventType,container,null);
    }

    protected
    AbstractWebSocketClientEventReceiver(
        URI                  uri,
        Class<E>             eventType,
        WebSocketContainer   container,
        ClientEndpointConfig config)
    {
        this.uri       = uri;
        this.eventType = eventType;
        this.container = container;
        this.config    = config != null ? config : ClientEndpointConfig.Builder.create().build();
        this.mapper    = new ObjectMapperSupplier().get();
        this.session   = new AtomicReference<>(null);
        this.executor  = Executors.newSingleThreadExecutor();
        this.listening = new AtomicBoolean(false);
    }

    @Override
    public void
    startListening()
    {
        if (isListening())
            return;

        if (!hasListener())
            throw new IllegalStateException("No listener.");

        listening.set(true);
        executor.execute(this::runListeningLoop);
    }

    @Override
    public void
    stopListening()
    {
        listening.set(false);

        Session s = session.getAndSet(null);
        if (s != null && s.isOpen())
        {
            try
            {
                s.close();
            }
            catch (Exception exception)
            {
                getListener().ifPresent(listener -> listener.onException(exception));
            }
        }

        if (executor != null)
            executor.shutdownNow();

        executor = Executors.newSingleThreadExecutor();
    }

    @Override
    public boolean
    isListening()
    {
        return listening.get();
    }

    private void
    runListeningLoop()
    {
        try
        {
            getListener().ifPresent(
                listener ->
                {
                    try { listener.onStart(); }
                    catch (Exception exception) { listener.onException(exception); }
                });

            Session connectedSession =
                container.connectToServer(
                    new Endpoint()
                    {
                        @Override
                        public void
                        onOpen(Session session,EndpointConfig endpointConfig)
                        {
                            AbstractWebSocketClientEventReceiver.this.session.set(session);

                            session.addMessageHandler(
                                String.class,
                                (String payload) ->
                                    getListener().ifPresent(
                                        listener ->
                                        {
                                            try
                                            {
                                                E event = mapper.readValue(payload,eventType);
                                                listener.onEvents(List.of(event));
                                            }
                                            catch (Exception exception)
                                            {
                                                listener.onException(exception);
                                            }
                                        }));
                        }

                        @Override
                        public void
                        onError(Session session,Throwable throwable)
                        {
                            Exception exception =
                                throwable instanceof Exception
                                    ? (Exception) throwable
                                    : new Exception(throwable);

                            getListener().ifPresent(listener -> listener.onException(exception));
                        }
                    },
                    config,
                    uri);

            session.set(connectedSession);

            while (listening.get() && connectedSession.isOpen())
                Thread.sleep(100);
        }
        catch (InterruptedException interrupted) {}
        catch (Exception exception)
        {
            getListener().ifPresent(listener -> listener.onException(exception));
        }
        finally
        {
            Session s = session.getAndSet(null);
            if (s != null && s.isOpen())
            {
                try { s.close(); }
                catch (Exception ignored) {}
            }

            listening.set(false);
            getListener().ifPresent(IEventListener::onStop);
        }
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

    @Override
    public void
    startListening(L listener)
    {
        super.startListening(listener);
    }
}

//////////////////////////////////////////////////////////////////////////////
