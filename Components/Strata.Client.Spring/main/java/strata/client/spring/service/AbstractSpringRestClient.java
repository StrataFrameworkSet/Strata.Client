//////////////////////////////////////////////////////////////////////////////
// AbstractSpringRestClient.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.spring.service;

import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory;
import org.apache.hc.core5.ssl.SSLContextBuilder;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;
import strata.foundation.core.mapper.ObjectMapperSupplier;

import javax.net.ssl.SSLContext;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

public abstract
class AbstractSpringRestClient
{
    private String       base;
    private RestTemplate template;

    protected
    AbstractSpringRestClient(String baseUrl,String keyStoreFilename,String password)
        throws RuntimeException
    {
        MappingJackson2HttpMessageConverter converter =
            new MappingJackson2HttpMessageConverter();

        converter.setObjectMapper(new ObjectMapperSupplier().get());

        base =
            baseUrl.endsWith("/")
                ? baseUrl
                : baseUrl + '/';
        template =
            new RestTemplateBuilder()
                .messageConverters(converter)
                .setBufferRequestBody(true)
                .requestFactory(() -> getRequestFactory(keyStoreFilename,password))
                .build();
    }

    protected ClientHttpRequestFactory
    getRequestFactory(String keyStoreFilename,String password)
        throws RuntimeException
    {
        try
        {
            Resource keystore = new ClassPathResource(keyStoreFilename);
            SSLContext sslContext =
                new SSLContextBuilder()
                    .loadTrustMaterial(
                        keystore.getURL(),
                        password.toCharArray())
                    .build();
            SSLConnectionSocketFactory sslConFactory =
                new SSLConnectionSocketFactory(sslContext);
            CloseableHttpClient httpClient =
                HttpClients
                    .custom()
                    .setConnectionManager(
                        PoolingHttpClientConnectionManagerBuilder
                            .create()
                            .setSSLSocketFactory(sslConFactory)
                            .build())
                    .build();

            return new HttpComponentsClientHttpRequestFactory(httpClient);
        }
        catch (Throwable cause)
        {
            throw new RuntimeException(cause);
        }
    }

    protected <Reply> Reply
    doGetSync(String path,Class<Reply> replyType,Map<String,Object> parameters)
    {
        return
            template
                .getForEntity(
                    base + path,
                    replyType,
                    parameters)
                .getBody();
    }

    protected <Reply> CompletionStage<Reply>
    doGetAsync(String path,Class<Reply> replyType,Map<String,Object> parameters)
    {
        return
            CompletableFuture
                .supplyAsync(() -> doGetSync(path,replyType,parameters));
    }

    protected <Reply,Request> Reply
    doPostSync(String path,Class<Reply> replyType,Request request)
    {
        return
            template
                .postForEntity(
                    base + path,
                    request,
                    replyType)
                .getBody();
    }

    protected <Reply,Request> CompletionStage<Reply>
    doPostAsync(String path,Class<Reply> replyType,Request request)
    {
        return
            CompletableFuture
                .supplyAsync(() -> doPostSync(path,replyType,request));
    }

    protected <Reply,Request> Reply
    doPatchSync(String path,Class<Reply> replyType,Request request)
    {
        return
            template
                .patchForObject(
                    base + path,
                    request,
                    replyType);
    }

    protected <Reply,Request> CompletionStage<Reply>
    doPatchAsync(String path,Class<Reply> replyType,Request request)
    {
        return
            CompletableFuture
                .supplyAsync(() -> doPatchSync(path,replyType,request));
    }
}

//////////////////////////////////////////////////////////////////////////////
