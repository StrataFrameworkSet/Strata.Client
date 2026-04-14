import {IEventListener} from "./IEventListener";

// This class is intended to be extended by event receivers that listen for events and notify a listener
export abstract class AbstractEventReceiver<E, L extends IEventListener<E>>
{
    protected listener?: L;

    public startListening(listener?: L): void
    {
        if (listener)
        {
            this.listener = listener;
        }
        this.startListeningImpl();
    }

    protected abstract startListeningImpl(): void;
    public abstract stopListening(): void;
    public abstract isListening(): boolean;

    protected getListener(): L | undefined
    {
        return this.listener;
    }

    protected hasListener(): boolean
    {
        return this.listener !== undefined;
    }
}