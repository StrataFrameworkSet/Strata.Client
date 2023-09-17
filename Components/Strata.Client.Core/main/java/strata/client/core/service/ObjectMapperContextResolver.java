//////////////////////////////////////////////////////////////////////////////
// ObjectMapperContextResolver.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.ext.ContextResolver;
import jakarta.ws.rs.ext.Provider;
import strata.foundation.core.mapper.ObjectMapperSupplier;


@Provider
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public
class ObjectMapperContextResolver
    implements ContextResolver<ObjectMapper>
{
    private final ObjectMapper mapper;

    public
    ObjectMapperContextResolver()
    {
        mapper = new ObjectMapperSupplier().get();
    }

    @Override
    public ObjectMapper
    getContext(Class<?> type) {
        return mapper;
    }
}

//////////////////////////////////////////////////////////////////////////////
