//////////////////////////////////////////////////////////////////////////////
// PropertiesBasedBaseUrlProvider.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.inject;

import javax.inject.Inject;
import java.util.Properties;

public
class PropertiesBasedBaseUrlProvider
    implements IBaseUrlProvider
{
    private final Properties itsProperties;
    private final String     itsBaseUrlKey;

    @Inject
    public
    PropertiesBasedBaseUrlProvider(Properties properties)
    {
        this(properties,"service.base.url");
    }

    public
    PropertiesBasedBaseUrlProvider(
        Properties properties,
        String     baseUrlKey)
    {
        itsProperties = properties;
        itsBaseUrlKey = baseUrlKey;

        if (!itsProperties.containsKey(itsBaseUrlKey))
            throw
                new IllegalArgumentException(
                    "properties does not contain: " + itsBaseUrlKey);
    }

    @Override
    public String
    get()
    {
        return itsProperties.getProperty(itsBaseUrlKey);
    }
}

//////////////////////////////////////////////////////////////////////////////
