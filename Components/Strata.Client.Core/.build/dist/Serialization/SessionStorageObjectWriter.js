"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStorageObjectWriter = void 0;
const Serialization_1 = require("strata.foundation.core/Serialization");
class SessionStorageObjectWriter extends Serialization_1.AbstractObjectWriter {
    storageKey;
    constructor(storageKey) {
        super();
        this.storageKey = storageKey;
    }
    write(value) {
        return super.write(value);
    }
    toSessionStorage() {
        sessionStorage.setItem(this.storageKey, JSON.stringify(this.getRoot()));
        return this;
    }
}
exports.SessionStorageObjectWriter = SessionStorageObjectWriter;
//# sourceMappingURL=SessionStorageObjectWriter.js.map