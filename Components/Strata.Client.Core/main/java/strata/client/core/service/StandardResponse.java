//////////////////////////////////////////////////////////////////////////////
// StandardResponse.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.service;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public
class StandardResponse
    implements IResponse
{
    private final String   itsRequestPath;
    private final Response itsResponse;

    public
    StandardResponse(String rootPath,String methodPath,Response response)
    {
        itsRequestPath = rootPath + "/" + methodPath;
        itsResponse = response;
    }

    @Override
    public String
    getRequestPath()
    {
        return itsRequestPath;
    }

    @Override
    public MediaType
    getMediaType()
    {
        return itsResponse.getMediaType();
    }

    @Override
    public Response.Status
    getStatusAsEnum()
    {
        return itsResponse.getStatusInfo().toEnum();
    }

    @Override
    public int
    getStatusAsInt()
    {
        return itsResponse.getStatus();
    }

    @Override
    public String
    getStatusReason()
    {
        return itsResponse.getStatusInfo().getReasonPhrase();
    }

    @Override
    public <E> E
    readEntity(Class<E> entityType)
    {
        return itsResponse.readEntity(entityType);
    }

    @Override
    public void
    close()
    {
        itsResponse.close();
    }
}

//////////////////////////////////////////////////////////////////////////////
