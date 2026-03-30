//////////////////////////////////////////////////////////////////////////////
// AbstractUpdatable.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.presenter;

import java.util.concurrent.CompletionStage;
import java.util.function.Function;

public abstract
class AbstractUpdatable<M>
    implements IUpdatable<M>
{
    private IModelStore    itsModelStore;
    private final Class<M> itsKey;

    protected
    AbstractUpdatable(IModelStore modelStore,Class<M> key)
    {
        itsModelStore = modelStore;
        itsKey = key;

        itsModelStore.attach(this);
    }

    @Override
    public void
    setModelStore(IModelStore modelStore)
    {
        itsModelStore = modelStore;
    }

    @Override
    public void
    clearModelStore()
    {
        itsModelStore = null;
    }

    @Override
    public IModelStore
    getModelStore()
    {
        return itsModelStore;
    }

    @Override
    public Class<M>
    getKey()
    {
        return itsKey;
    }

    protected void
    dispatch(Function<M,CompletionStage<M>> action)
    {
        dispatch(new Action<>(getKey(),action));
    }

    protected void
    dispatch(IAction<M> action)
    {
        itsModelStore.apply(action);
    }

}

//////////////////////////////////////////////////////////////////////////////
