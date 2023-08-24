//////////////////////////////////////////////////////////////////////////////
// LambdaAction.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.presenter;

import java.util.concurrent.CompletionStage;
import java.util.function.Function;

public
class Action<M>
    implements IAction<M>
{
    private final Class<M>                       itsKey;
    private final Function<M,CompletionStage<M>> itsAction;

    public
    Action(Class<M> key,Function<M,CompletionStage<M>> action)
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
        return itsAction.apply(model);
    }
}

//////////////////////////////////////////////////////////////////////////////
