"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelStore = void 0;
const Container_1 = require("strata.foundation.core/Container");
class ModelStore {
    updatables;
    models;
    constructor() {
        this.updatables = new Container_1.MultiMap();
        this.models = new Map();
    }
    attach(updatable) {
        this.updatables.put(updatable.getKey(), updatable);
        if (updatable.getModelStore() != this)
            updatable.setModelStore(this);
        return this;
    }
    detach(updatable) {
        this.updatables.remove(updatable.getKey(), updatable);
        if (updatable.getModelStore() == this)
            updatable.clearModelStore();
        return this;
    }
    insert(key, model) {
        this.models.set(key, model);
        return this;
    }
    remove(key) {
        this.models.delete(key);
        return this;
    }
    getModel(key) {
        return this.hasModel(key)
            ? this.models.get(key)
            : null;
    }
    hasUpdatable(key) {
        return this.updatables.containsKey(key);
    }
    hasModel(key) {
        return this.models.has(key);
    }
    apply(action) {
        let key = action.getKey();
        let updatables = this.updatables.get(key);
        let model = this.models.get(key);
        let updated = action.apply(model);
        this.replace(key, updated, model, updatables);
    }
    replace(key, updated, previous, updatables) {
        updated
            .thenApply(current => {
            this.models.delete(key);
            this.models.set(key, current);
            return current;
        })
            .thenAccept(current => updatables
            .map(updatable => updatable)
            .forEach(updatable => updatable.update(current)), error => console.error(error))
            .subscribe();
    }
}
exports.ModelStore = ModelStore;
//# sourceMappingURL=ModelStore.js.map