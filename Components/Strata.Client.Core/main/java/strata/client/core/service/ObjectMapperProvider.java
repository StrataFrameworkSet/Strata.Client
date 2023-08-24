//////////////////////////////////////////////////////////////////////////////
// ObjectMapperProvider.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.service;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import strata.foundation.core.mapper.ObjectMapperContextResolver;

import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.ext.Provider;

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
