"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelStore = void 0;
class ModelStore {
    constructor() {
        this.updatables = new Map();
        this.models = new Map();
    }
    attach(updatable) {
        this.updatables.set(updatable.getKey(), updatable);
        return this;
    }
    detach(updatable) {
        return undefined;
    }
    insert(key, model) {
        return undefined;
    }
    remove(key) {
        return undefined;
    }
    hasModel(key) {
        return false;
    }
    hasUpdatable(key) {
        return false;
    }
    apply(action) {
    }
}
exports.ModelStore = ModelStore;
//# sourceMappingURL=ModelStore.js.map