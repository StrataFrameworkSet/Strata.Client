"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractUpdatable = void 0;
const Action_1 = require("./Action");
class AbstractUpdatable {
    modelstore;
    key;
    constructor(key, modelstore) {
        this.key = key;
        if (modelstore != null) {
            this.modelstore = modelstore;
            this.modelstore.attach(this);
        }
        else
            this.modelstore = null;
    }
    setModelStore(modelStore) {
        this.modelstore = modelStore;
    }
    clearModelStore() {
        this.modelstore = null;
    }
    getModelStore() {
        return this.modelstore;
    }
    getKey() {
        return this.key;
    }
    dispatch(action) {
        this.dispatchAction(new Action_1.Action(this.getKey(), action));
    }
    dispatchAction(action) {
        this.modelstore.apply(action);
    }
}
exports.AbstractUpdatable = AbstractUpdatable;
//# sourceMappingURL=AbstractUpdatable.js.map