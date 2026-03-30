"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractApplication = void 0;
class AbstractApplication {
    modelstore;
    presenter;
    constructor() {
        this.modelstore = null;
        this.presenter = null;
    }
    initialize(modelstore, presenter) {
        this.modelstore = modelstore;
        this.presenter = presenter;
        this.modelstore.attach(this.presenter);
    }
    getModelStore() {
        return this.modelstore;
    }
    getPresenter() {
        return this.presenter;
    }
}
exports.AbstractApplication = AbstractApplication;
//# sourceMappingURL=AbstractApplication.js.map