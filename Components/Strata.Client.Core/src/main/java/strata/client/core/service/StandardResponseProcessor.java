//////////////////////////////////////////////////////////////////////////////
// StandardResponseProcessor.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.service;

import strata.foundation.core.collection.IMultiMap;
import strata.foundation.core.collection.ListValuedMultiMap;
import strata.foundation.core.transfer.AbstractServiceReply;

public
class StandardResponseProcessor
    implements IResponseProcessor
{

    @Override
    public <R> R
    process(Class<R> replyType,IResponse response)
    {
        try
        {
            switch (response.getStatusAsEnum())
            {
                case OK:
                case INTERNAL_SERVER_ERROR:
                    R reply = response.readEntity(replyType);

                    if (reply instanceof AbstractServiceReply serviceReply)
                        serviceReply.setHeaders(getHeaders(response));

                    return reply;

                default:
                    throw new ServiceException(response);
            }
        }
        finally
        {
            response.close();
        }
    }

    private IMultiMap<String,Object>
    getHeaders(IResponse response)
    {
        IMultiMap<String,Object> headers = new ListValuedMultiMap<>();

        response
            .getHeaders()
            .entrySet()
            .forEach(entry -> headers.put(entry.getKey(),entry.getValue()));

        return headers;
    }
}

//////////////////////////////////////////////////////////////////////////////
