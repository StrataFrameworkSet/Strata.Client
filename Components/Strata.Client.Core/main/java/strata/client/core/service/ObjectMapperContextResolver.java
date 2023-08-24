//////////////////////////////////////////////////////////////////////////////
// ObjectMapperContextResolver.java
//////////////////////////////////////////////////////////////////////////////

package strata.foundation.core.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.apache.avro.specific.SpecificRecordBase;

import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

@Provider
@Produces(MediaType.APPLICATION_JSON)
public
class ObjectMapperContextResolver
    implements ContextResolver<ObjectMapper>
{
    private final ObjectMapper mapper;

    public
    ObjectMapperContextResolver()
    {
        mapper = new ObjectMapper();
        mapper
            .registerModule(new SimpleModule())
            .registerModule(new JavaTimeModule())
            .registerModule(new Jdk8Module())
            .addMixIn(SpecificRecordBase.class,IExcludeAvroFieldsMixin.class)
            .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    }

    @Override
    public ObjectMapper
    getContext(Class<?> type) {
        return mapper;
    }
}

//////////////////////////////////////////////////////////////////////////////
