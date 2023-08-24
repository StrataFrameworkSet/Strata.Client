//////////////////////////////////////////////////////////////////////////////
// LambdaAction.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.presenter;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.function.Function;

public
class SimpleAction<M>
    implements IAction<M>
{
    private final Class<M>      itsKey;
    private final Function<M,M> itsAction;

    public
    SimpleAction(Class<M> key,Function<M,M> action)
    {
        itsKey = key;
        itsAction = action;
    }

    @Override
    public Class<M>
    getKey()
    {
        return itsKey;
    }

    @Override
    public CompletionStage<M>
    apply(M model)
    {
        return
            CompletableFuture.completedFuture(itsAction.apply(model));
    }
}

//////////////////////////////////////////////////////////////////////////////
