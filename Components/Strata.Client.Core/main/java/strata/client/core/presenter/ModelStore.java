//////////////////////////////////////////////////////////////////////////////
// ModelStore.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.presenter;

import strata.foundation.core.utility.IMultiMap;
import strata.foundation.core.utility.MultiMap;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletionStage;

public
class ModelStore
    implements IModelStore
{
    private final IMultiMap<Class<?>,IUpdatable<?>> itsUpdatables;
    private final Map<Class<?>,Object>              itsModels;

    public
    ModelStore()
    {
        itsUpdatables = new MultiMap<>();
        itsModels = new HashMap<>();
    }

    @Override
    public <M> IModelStore
    attach(IUpdatable<M> updatable)
    {
        itsUpdatables.put(updatable.getKey(),updatable);

        if (updatable.getModelStore() != this)
            updatable.setModelStore(this);

        return this;
    }

    @Override
    public <M> IModelStore
    detach(IUpdatable<M> updatable)
    {
        itsUpdatables.remove(updatable.getKey(),updatable);

        if (updatable.getModelStore() == this)
            updatable.clearModelStore();

        return this;
    }

    @Override
    public <M> IModelStore
    insert(Class<M> key,M model)
    {
        itsModels.put(key,model);
        return this;
    }

    @Override
    public <M> IModelStore
    remove(Class<M> key)
    {
        itsModels.remove(key);
        return this;
    }

    @Override
    public <M> boolean
    hasUpdatable(Class<M> key)
    {
        return itsUpdatables.containsKey(key);
    }

    @Override
    public <M> boolean
    hasModel(Class<M> key)
    {
        return itsModels.containsKey(key);
    }

    @Override
    public <M> void
    apply(IAction<M> action)
    {
        Class<M>                  key        = action.getKey();
        Collection<IUpdatable<?>> updatables = itsUpdatables.get(key);
        M                         model      = key.cast(itsModels.get(key));
        CompletionStage<M>        updated    = action.apply(model);

        replace(key,updated,model,updatables);
    }

    private <M> void
    replace(
        Class<M>                  key,
        CompletionStage<M>        updated,
        M                         previous,
        Collection<IUpdatable<?>> updatables)
    {
        updated
            .thenApply(
                current ->
                {
                    itsModels.remove(key,previous);
                    itsModels.put(key,current);
                    return current;
                })
            .thenAccept(
                current ->
                {
                    updatables
                        .stream()
                        .map(updatable -> (IUpdatable<M>)updatable)
                        .forEach(updatable -> updatable.update(current));
                });

    }
}

//////////////////////////////////////////////////////////////////////////////
