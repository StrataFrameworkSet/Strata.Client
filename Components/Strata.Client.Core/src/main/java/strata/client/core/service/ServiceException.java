//////////////////////////////////////////////////////////////////////////////
// ServiceException.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.core.service;

public
class ServiceException
    extends RuntimeException
{
    private final String itsRequestPath;
    private final int    itsResponseStatus;
    private final String itsStatusReason;

    public
    ServiceException(IResponse response)
    {
        super(initializeMessage(response));
        itsRequestPath = response.getRequestPath();
        itsResponseStatus = response.getStatusAsInt();
        itsStatusReason = response.getStatusReason();
    }

    public
    ServiceException(IResponse response,Throwable cause)
    {
        super(initializeMessage(response),cause);
        itsRequestPath = response.getRequestPath();
        itsResponseStatus = response.getStatusAsInt();
        itsStatusReason = response.getStatusReason();
    }

    public String
    getRequestPath()
    {
        return itsRequestPath;
    }

    public int
    getResponseStatus()
    {
        return itsResponseStatus;
    }

    public String
    getStatusReason()
    {
        return itsStatusReason;
    }

    private static String
    initializeMessage(IResponse response)
    {
        StringBuilder builder = new StringBuilder();

        builder
            .append("Exception during response processing:\n")
            .append("\tFrom request: ")
            .append(response.getRequestPath())
            .append('\n')
            .append("\tResponse status code: ")
            .append(response.getStatusAsInt())
            .append('\n')
            .append("\tResponse status message: ")
            .append(response.getStatusReason())
            .append('\n')
            .append("\tResponse media type: ")
            .append(response.getMediaType())
            .append('\n');

        return builder.toString();
    }
}

//////////////////////////////////////////////////////////////////////////////
