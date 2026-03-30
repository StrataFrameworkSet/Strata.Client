"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageObjectWriter = void 0;
const Serialization_1 = require("strata.foundation.core/Serialization");
class LocalStorageObjectWriter extends Serialization_1.AbstractObjectWriter {
    storageKey;
    constructor(storageKey) {
        super();
        this.storageKey = storageKey;
    }
    write(value) {
        return super.write(value);
    }
    toLocalStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.getRoot()));
        return this;
    }
}
exports.LocalStorageObjectWriter = LocalStorageObjectWriter;
//# sourceMappingURL=LocalStorageObjectWriter.js.map