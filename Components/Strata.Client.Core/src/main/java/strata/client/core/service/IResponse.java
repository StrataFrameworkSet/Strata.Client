//////////////////////////////////////////////////////////////////////////////
// IResponse.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.service;


import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response.Status;

import java.util.Map;

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

    MultivaluedMap<String,Object>
    getHeaders();

    <E> E
    readEntity(Class<E> entityType);

    void
    close();
}

//////////////////////////////////////////////////////////////////////////////