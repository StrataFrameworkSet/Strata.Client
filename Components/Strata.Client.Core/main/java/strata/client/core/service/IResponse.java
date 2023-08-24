//////////////////////////////////////////////////////////////////////////////
// IResponse.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.service;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public
interface IResponse
{
    String
    getRequestPath();

    MediaType
    getMediaType();

    Response.Status
    getStatusAsEnum();

    int
    getStatusAsInt();

    String
    getStatusReason();

    <E> E
    readEntity(Class<E> entityType);

    void
    close();
}

//////////////////////////////////////////////////////////////////////////////