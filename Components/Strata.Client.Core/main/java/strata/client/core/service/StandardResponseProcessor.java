//////////////////////////////////////////////////////////////////////////////
// StandardResponseProcessor.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.service;

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
                    return response.readEntity(replyType);

                default:
                    throw new ServiceException(response);
            }
        }
        finally
        {
            response.close();
        }
    }


}

//////////////////////////////////////////////////////////////////////////////
