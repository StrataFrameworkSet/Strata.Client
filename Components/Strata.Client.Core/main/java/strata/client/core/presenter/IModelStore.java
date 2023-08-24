//////////////////////////////////////////////////////////////////////////////
// IModelStore.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.presenter;

public
interface IModelStore
{
    <M> IModelStore
    attach(IUpdatable<M> updatable);

    <M> IModelStore
    detach(IUpdatable<M> updatable);

    <M> IModelStore
    insert(Class<M> key,M model);

    <M> IModelStore
    remove(Class<M> key);

    <M> boolean
    hasUpdatable(Class<M> key);

    <M> boolean
    hasModel(Class<M> key);

    <M> void
    apply(IAction<M> action);
}

//////////////////////////////////////////////////////////////////////////////