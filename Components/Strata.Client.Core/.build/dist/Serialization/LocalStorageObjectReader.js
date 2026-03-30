"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageObjectReader = void 0;
const Serialization_1 = require("strata.foundation.core/Serialization");
class LocalStorageObjectReader extends Serialization_1.AbstractObjectReader {
    source;
    constructor(storageKey) {
        super(LocalStorageObjectReader.fromLocalStorage(storageKey));
    }
    static fromLocalStorage(storageKey) {
        const item = localStorage.getItem(storageKey);
        if (item === null) {
            console.log("LocalStorageObjectReader: No item found in local storage for key " + storageKey);
            return null;
        }
        return JSON.parse(item);
    }
}
exports.LocalStorageObjectReader = LocalStorageObjectReader;
//# sourceMappingURL=LocalStorageObjectReader.js.map