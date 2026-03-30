"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractPresenter = void 0;
const AbstractUpdatable_1 = require("./AbstractUpdatable");
class AbstractPresenter extends AbstractUpdatable_1.AbstractUpdatable {
    view;
    constructor(key, modelstore) {
        super(key, modelstore);
        this.view = null;
    }
    setView(view) {
        this.view = view;
    }
    getView() {
        return this.view;
    }
    update(model) {
        this.doUpdate(this.view, model);
    }
}
exports.AbstractPresenter = AbstractPresenter;
//# sourceMappingURL=AbstractPresenter.js.map