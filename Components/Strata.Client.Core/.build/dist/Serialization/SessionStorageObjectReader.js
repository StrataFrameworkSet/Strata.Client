"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStorageObjectReader = void 0;
const Serialization_1 = require("strata.foundation.core/Serialization");
class SessionStorageObjectReader extends Serialization_1.AbstractObjectReader {
    source;
    constructor(storageKey) {
        super(SessionStorageObjectReader.fromSessionStorage(storageKey));
    }
    static fromSessionStorage(storageKey) {
        const item = sessionStorage.getItem(storageKey);
        if (item === null) {
            console.log("LocalStorageObjectReader: No item found in local storage for key " + storageKey);
            return null;
        }
        return JSON.parse(item);
    }
}
exports.SessionStorageObjectReader = SessionStorageObjectReader;
//# sourceMappingURL=SessionStorageObjectReader.js.map