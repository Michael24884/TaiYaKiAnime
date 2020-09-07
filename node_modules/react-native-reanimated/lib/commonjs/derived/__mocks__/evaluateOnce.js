"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evaluateOnce = evaluateOnce;

var _base = require("../../base");

function evaluateOnce(node, children = [], callback) {
  if (!Array.isArray(children)) {
    children = [children];
  }

  const alwaysNode = (0, _base.always)(node);

  for (let i = 0; i < children.length; i++) {
    alwaysNode.__addChild(children[i]);
  }

  for (let i = 0; i < children.length; i++) {
    alwaysNode.__removeChild(children[i]);
  }

  callback && callback();
}
//# sourceMappingURL=evaluateOnce.js.map