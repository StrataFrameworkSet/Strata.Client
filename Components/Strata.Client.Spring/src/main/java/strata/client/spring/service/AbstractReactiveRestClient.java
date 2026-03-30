//////////////////////////////////////////////////////////////////////////////
// AbstractReactiveRestClient.java
//////////////////////////////////////////////////////////////////////////////

package strata.client.spring.service;

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import org.apache.avro.specific.SpecificRecordBase;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ClientHttpConnector;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.http.codec.json.Jackson2JsonEncoder;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import strata.foundation.core.mapper.IExcludeAvroFieldsMixin;
import strata.foundation.core.mapper.ObjectMapperSupplier;

import javax.net.ssl.TrustManagerFactory;
import java.io.IOException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.util.Map;
import java.util.concurrent.CompletionStage;

public abstract
class AbstractReactiveRestClient
{
    private WebClient client;

    protected
    AbstractReactiveRestClient(String baseUrl,String keyStoreFilename,String password)
        throws RuntimeException
    {
        String base =
            baseUrl.endsWith("/")
                ? baseUrl
                : baseUrl + '/';
        ObjectMapper mapper = new ObjectMapperSupplier().get();

        client =
            WebClient
                .builder()
                .baseUrl(base)
                .exchangeStrategies(
                    ExchangeStrategies
                        .builder()
                        .codecs(
                            configurer ->
                            {
                                configurer
                                    .defaultCodecs()
                                    .jackson2JsonEncoder(new Jackson2JsonEncoder(mapper));
                                configurer
                                    .defaultCodecs()
                                    .jackson2JsonDecoder(new Jackson2JsonDecoder(mapper));
                            })
                        .build())
                .clientConnector(getClientHttpConnector(keyStoreFilename,password))

                .build();
    }

    protected <Reply> CompletionStage<Reply>
    doGetAsync(String path,Class<Reply> replyType,Map<String,Object> parameters)
    {
        return
            client
                .get()
                .uri(path,parameters)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(replyType)
                .toFuture();
    }

    protected <Reply,Request> CompletionStage<Reply>
    doPostAsync(String path,Class<Reply> replyType,Request request)
    {
        return
            client
                .post()
                .uri(path)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(replyType)
                .toFuture();
    }


    protected ClientHttpConnector
    getClientHttpConnector(String keyStoreFilename,String password)
        throws RuntimeException
    {
        try
        {
            TrustManagerFactory trustManager =
                TrustManagerFactory
                    .getInstance(TrustManagerFactory.getDefaultAlgorithm());

            trustManager.init(getKeyStore(keyStoreFilename,password));

            SslContext sslContext =
                SslContextBuilder
                    .forClient()
                    .trustManager(trustManager)
                    .build();

            HttpClient httpClient =
                HttpClient
                    .create()
                    .secure(ssl -> ssl.sslContext(sslContext));

            return new ReactorClientHttpConnector(httpClient);
        }
        catch (Throwable cause)
        {
            throw new RuntimeException(cause);
        }
    }

    protected KeyStore
    getKeyStore(String keyStoreFilename,String password)
    {
        try
        {
            KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());

            keyStore.load(
                new ClassPathResource(keyStoreFilename).getInputStream(),
                password.toCharArray());

            return keyStore;
        }
        catch (
            KeyStoreException | CertificateException |
            IOException | NoSuchAlgorithmException e)
        {
            throw new RuntimeException(e);
        }
    }

}

//////////////////////////////////////////////////////////////////////////////
