"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractUpdatable = void 0;
class AbstractUpdatable {
    constructor(modelstore, key) {
        this.modelStore = modelstore;
        this.key = key;
        this.modelStore.attach(this);
    }
    setModelStore(modelStore) {
        this.modelStore = modelStore;
    }
    clearModelStore() {
        this.modelStore = null;
    }
    getModelStore() {
        return this.modelStore;
    }
    getKey() {
        return this.key;
    }
    dispatch(action) {
        this.modelStore.apply(action);
    }
}
exports.AbstractUpdatable = AbstractUpdatable;
//# sourceMappingURL=AbstractUpdatable.js.map