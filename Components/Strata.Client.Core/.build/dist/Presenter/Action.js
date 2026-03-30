"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
class Action {
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
        return this.action(model);
    }
}
exports.Action = Action;
//# sourceMappingURL=Action.js.map