//////////////////////////////////////////////////////////////////////////////
// AbstractPresenter.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.presenter;

public abstract
class AbstractPresenter<M,V>
    extends AbstractUpdatable<M>
    implements IPresenter<M,V>
{
    private V itsView;

    protected
    AbstractPresenter(
        IModelStore modelStore,
        Class<M>    key)
    {
        super(modelStore,key);
        itsView = null;
    }

    @Override
    public IPresenter<M,V>
    setView(V view)
    {
        itsView = view;
        return this;
    }

    @Override
    public V
    getView()
    {
        return itsView;
    }

    @Override
    public void
    update(M model)
    {
        doUpdate(itsView,model);
    }

    protected abstract void
    doUpdate(V view,M model);

}

//////////////////////////////////////////////////////////////////////////////
