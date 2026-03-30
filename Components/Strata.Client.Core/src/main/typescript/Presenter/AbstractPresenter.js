"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractPresenter = void 0;
const AbstractUpdatable_1 = require("./AbstractUpdatable");
class AbstractPresenter extends AbstractUpdatable_1.AbstractUpdatable {
    constructor(modelstore, key) {
        super(modelstore, key);
        this.view = null;
    }
    getView() {
        return this.view;
    }
    update(model) {
        this.doUpdate(this.view, model);
    }
    setView(view) {
        this.view = view;
    }
}
exports.AbstractPresenter = AbstractPresenter;
//# sourceMappingURL=AbstractPresenter.js.map