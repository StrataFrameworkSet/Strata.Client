//////////////////////////////////////////////////////////////////////////////
// ObjectMapperProvider.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.service;

import com.fasterxml.jackson.jakarta.rs.json.JacksonJsonProvider;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.ext.Provider;

@Provider
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public
class ObjectMapperProvider
    extends JacksonJsonProvider
{
    public
    ObjectMapperProvider()
    {
        super(new ObjectMapperContextResolver().getContext(Object.class));
    }
}

//////////////////////////////////////////////////////////////////////////////
