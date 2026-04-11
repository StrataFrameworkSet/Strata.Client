import {IEventListener} from "./IEventListener";
import {AbstractEventReceiver} from "./AbstractEventReceiver";

export abstract class AbstractWebSocketClientEventReceiver<E, L extends IEventListener<E>>
    extends AbstractEventReceiver<E, L> {

    private readonly uri: string;
    private session: WebSocket | null = null;

    // JS single-threading means standard booleans act atomically
    private listening: boolean = false;
    private reconnectDelayMs: number = 3000;

    protected constructor(uri: string | URL) {
        super();
        this.uri = uri.toString();
    }

    protected startListeningImpl(): void {
        if (this.isListening()) {
            return;
        }

        if (!this.hasListener()) {
            throw new Error("No listener.");
        }

        this.listening = true;
        // Fire and forget, replacing ExecutorService.execute()
        this.runListeningLoop().catch(console.error);
    }

    public stopListening(): void {
        this.listening = false;

        const s = this.session;
        this.session = null;

        if (s && (s.readyState === WebSocket.OPEN || s.readyState === WebSocket.CONNECTING)) {
            try {
                s.close();
            } catch (exception) {
                this.getListener()?.onException(
                    exception instanceof Error ? exception : new Error(String(exception))
                );
            }
        }
    }

    public isListening(): boolean {
        return this.listening;
    }

    private async runListeningLoop(): Promise<void> {
        const listener = this.getListener();

        try {
            listener?.onStart();
        } catch (exception) {
            listener?.onException(exception instanceof Error ? exception : new Error(String(exception)));
        }

        // Loop handles the connection and automatic reconnection
        while (this.listening) {
            try
            {
                await this.connectAndWait();
            } catch (exception)
            {
                listener?.onException(exception instanceof Error ? exception : new Error(String(exception)));

                // Pause before attempting reconnect if still listening
                if (this.listening)
                {
                    await new Promise(resolve => setTimeout(resolve, this.reconnectDelayMs));
                }
            }
        }

        listener?.onStop();
    }

    private connectAndWait(): Promise<void>
    {
        return new Promise((resolve, reject) => {
            const listener = this.getListener();
            const ws = new WebSocket(this.uri);
            this.session = ws;

            ws.onopen = () => {
                // Connection established
            };

            ws.onmessage = (messageEvent) => {
                try {
                    // Replaces ObjectMapper
                    const payload = messageEvent.data.toString();
                    const event: E = JSON.parse(payload);
                    listener?.onEvents([event]);
                } catch (exception) {
                    listener?.onException(
                        exception instanceof Error ? exception : new Error("Failed to parse incoming event")
                    );
                }
            };

            ws.onerror = (errorEvent) => {
                // WebSocket DOM errors don't provide much detail natively.
                const error = new Error("WebSocket connection error");
                listener?.onException(error);
                reject(error);
            };

            ws.onclose = () => {
                this.session = null;
                resolve(); // Resolving allows the while-loop to handle reconnection/termination
            };
        });
    }

    protected getSession(): WebSocket | null
    {
        return this.session;
    }

    protected getUri(): string
    {
        return this.uri;
    }
}