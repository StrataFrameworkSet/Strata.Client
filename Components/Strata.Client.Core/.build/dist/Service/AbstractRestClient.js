"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRestClient = void 0;
const Concurrent_1 = require("strata.foundation.core/Concurrent");
const StandardResponseProcessor_1 = require("./StandardResponseProcessor");
const StandardResponse_1 = require("./StandardResponse");
const Transfer_1 = require("strata.foundation.core/Transfer");
class AbstractRestClient {
    baseUrl;
    headers;
    consumer;
    responseProcessor;
    constructor(baseUrl, responseProcessor) {
        this.baseUrl = baseUrl;
        this.headers = new Headers();
        this.consumer = null;
        this.responseProcessor =
            responseProcessor == null
                ? new StandardResponseProcessor_1.StandardResponseProcessor()
                : responseProcessor;
    }
    setHeader(headerKey, headerValue) {
        this.headers.set(headerKey, headerValue);
        return this;
    }
    appendHeader(headerKey, headerValue) {
        this.headers.append(headerKey, headerValue);
        return this;
    }
    clearHeader(headerKey) {
        this.headers.delete(headerKey);
        return this;
    }
    clearHeaders() {
        this.headers = new Headers();
        return this;
    }
    getHeaderKeys() {
        return this.headers.keys();
    }
    getHeader(headerKey) {
        return this.headers.get(headerKey);
    }
    hasHeader(headerKey) {
        return this.headers.has(headerKey);
    }
    setHeadersConsumer(consumer) {
        this.consumer = consumer;
    }
    doPost(methodPath, request) {
        return this.sendRequestWithBody("POST", methodPath, request);
    }
    doPut(methodPath, request) {
        return this.sendRequestWithBody("PUT", methodPath, request);
    }
    doDelete(methodPath, pathParams, queryParams) {
        return this.sendRequestWithParameters("DELETE", methodPath, pathParams, queryParams);
    }
    doGet(methodPath, pathParams, queryParams) {
        return this.sendRequestWithParameters("GET", methodPath, pathParams, queryParams);
    }
    sendRequestWithBody(method, methodPath, request) {
        return Concurrent_1.CompletableObservable.fromPromise(fetch(this.getUrl(methodPath), {
            method: method,
            mode: "cors",
            body: JSON.stringify(request),
            headers: this.headers
        })
            .then(response => this.processHeaders(response))
            .then(response => this.processResponse(response, methodPath))
            .catch(exception => this.processException(exception)));
    }
    sendRequestWithParameters(method, methodPath, pathParams, queryParams) {
        let requestUrl = this.resolveTemplates(this.getUrl(methodPath), pathParams);
        requestUrl = this.appendQueryParams(requestUrl, queryParams);
        return Concurrent_1.CompletableObservable.fromPromise(fetch(requestUrl, {
            method: method,
            mode: "cors",
            headers: this.headers
        })
            .then(response => this.processHeaders(response))
            .then(response => this.processResponse(response, methodPath))
            .catch(exception => this.processException(exception)));
    }
    getUrl(methodPath) {
        return this.baseUrl + "/" + methodPath;
    }
    resolveTemplates(inputUrl, pathParams) {
        pathParams
            .forEach((value, key, ignore) => {
            let template = '{' + key + '}';
            return inputUrl = inputUrl.replace(template, value.toString);
        });
        return inputUrl;
    }
    appendQueryParams(inputUrl, queryParams) {
        let i = 0;
        queryParams
            .forEach((value, key, ignore) => {
            if (i == 0)
                inputUrl = inputUrl + '?';
            else
                inputUrl = inputUrl + '&';
            ++i;
            return inputUrl = inputUrl + key + '=' + value.toString();
        });
        return inputUrl;
    }
    processHeaders(response) {
        if (this.consumer)
            this.consumer.accept(response.headers);
        return response;
    }
    processResponse(response, methodPath) {
        console.log("AbstractRestClient.processResponse");
        return this
            .responseProcessor
            .process(new StandardResponse_1.StandardResponse(this.baseUrl, methodPath, response));
    }
    processException(exception) {
        const reply = {};
        console.log("AbstractRestClient.processException: " + exception);
        if (this.isAbstractServiceReply(reply)) {
            const serviceReply = reply;
            console.log("Service reply is subtype of AbstractServiceReply");
            serviceReply.exception =
                new Transfer_1.ExceptionDataBuilder()
                    .setExceptionType("strata.client.core.service.ServiceException")
                    .setExceptionMessage(exception.message)
                    .build();
            serviceReply.success = false;
            serviceReply.failureMessage = exception.message;
        }
        return reply;
    }
    isAbstractServiceReply(reply) {
        const comparable = {};
        return Object
            .keys(comparable)
            .every((property) => reply.hasOwnProperty(property));
    }
}
exports.AbstractRestClient = AbstractRestClient;
//# sourceMappingURL=AbstractRestClient.js.map