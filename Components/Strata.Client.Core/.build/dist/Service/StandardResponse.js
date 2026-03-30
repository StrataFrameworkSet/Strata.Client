"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardResponse = void 0;
class StandardResponse {
    requestPath;
    response;
    constructor(rootPath, methodPath, response) {
        this.requestPath = rootPath + '/' + methodPath;
        this.response = response;
    }
    getRequestPath() {
        return this.requestPath;
    }
    getMediaType() {
        if (this.response.headers.has("Content-Type"))
            return this.response.headers.get("Content-Type");
        return "unknown";
    }
    getStatus() {
        return this.response.status;
    }
    getStatusReason() {
        return this.response.statusText;
    }
    async readEntity() {
        return await this
            .response
            .json()
            .then((entity) => entity);
    }
    close() {
    }
}
exports.StandardResponse = StandardResponse;
//# sourceMappingURL=StandardResponse.js.map