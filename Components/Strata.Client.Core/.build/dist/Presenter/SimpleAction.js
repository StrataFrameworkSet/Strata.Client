"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleAction = void 0;
const Concurrent_1 = require("strata.foundation.core/Concurrent");
class SimpleAction {
    key;
    action;
    constructor(key, action) {
        this.key = key;
        this.action = action;
    }
    getKey() {
        return this.key;
    }
    apply(model) {
        return Concurrent_1.CompletableObservable.fromResult(this.action(model));
    }
}
exports.SimpleAction = SimpleAction;
//# sourceMappingURL=SimpleAction.js.map