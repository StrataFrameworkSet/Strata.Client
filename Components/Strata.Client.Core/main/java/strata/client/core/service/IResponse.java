//////////////////////////////////////////////////////////////////////////////
// IResponse.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.service;


import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response.Status;

public
interface IResponse
{
    String
    getRequestPath();

    MediaType
    getMediaType();

    Status
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