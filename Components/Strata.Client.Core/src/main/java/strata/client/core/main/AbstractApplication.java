//////////////////////////////////////////////////////////////////////////////
// AbstractApplication.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.main;

import strata.client.core.presenter.IModelStore;
import strata.client.core.presenter.IPresenter;

public abstract
class AbstractApplication<M,V,P>
    implements IApplication
{
    private final IModelStore itsModelStore;
    private IPresenter<M,V> itsPresenter;
    private V                 itsView;

    protected
    AbstractApplication(IModelStore modelStore,IPresenter<M,V> presenter,V view)
    {
        itsModelStore = modelStore;
        itsPresenter = presenter;
        itsView = view;
    }

}

//////////////////////////////////////////////////////////////////////////////
