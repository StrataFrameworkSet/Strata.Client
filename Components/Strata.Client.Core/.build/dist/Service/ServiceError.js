"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceError = void 0;
class ServiceError extends Error {
    requestPath;
    status;
    statusReason;
    constructor(response) {
        super(initializeServiceErrorMessage(response));
        this.requestPath = response.getRequestPath();
        this.status = response.getStatus();
        this.statusReason = response.getStatusReason();
    }
    getRequestPath() {
        return this.requestPath;
    }
    getStatus() {
        return this.status;
    }
    getStatusReason() {
        return this.statusReason;
    }
}
exports.ServiceError = ServiceError;
function initializeServiceErrorMessage(response) {
    return "Exception during response processing:\n" +
        "\tFrom request: " + response.getRequestPath() + '\n' +
        "\tResponse status code: " + response.getStatus() + '\n' +
        "\tResponse status message: " + response.getStatusReason() + '\n' +
        "\tResponse media type: " + response.getMediaType() + '\n';
}
//# sourceMappingURL=ServiceError.js.map