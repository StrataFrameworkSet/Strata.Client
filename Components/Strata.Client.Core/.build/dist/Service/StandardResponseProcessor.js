"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardResponseProcessor = void 0;
const ServiceError_1 = require("./ServiceError");
class StandardResponseProcessor {
    process(response) {
        switch (response.getStatus()) {
            case 200: // OK
            case 500: //INTERNAL_SERVER_ERROR
                return response.readEntity();
            default:
                throw new ServiceError_1.ServiceError(response);
        }
    }
}
exports.StandardResponseProcessor = StandardResponseProcessor;
//# sourceMappingURL=StandardResponseProcessor.js.map