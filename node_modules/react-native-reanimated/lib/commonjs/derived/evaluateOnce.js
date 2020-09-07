"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evaluateOnce = evaluateOnce;

var _InternalAnimatedValue = _interopRequireDefault(require("../core/InternalAnimatedValue"));

var _AnimatedSet = require("../core/AnimatedSet");

var _AnimatedCall = require("../core/AnimatedCall");

var _AnimatedAlways = require("../core/AnimatedAlways");

var _AnimatedCond = require("../core/AnimatedCond");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * evaluate given node and notify children
 * @param node - node to be evaluated
 * @param input - nodes (or one node) representing values which states input for node.
 * @param callback - after callback
 */
function evaluateOnce(node, input = [], callback) {
  if (!Array.isArray(input)) {
    input = [input];
  }

  const done = new _InternalAnimatedValue.default(0);
  const evalNode = (0, _AnimatedCond.createAnimatedCond)(done, 0, (0, _AnimatedCall.createAnimatedCall)([node, (0, _AnimatedSet.createAnimatedSet)(done, 1)], () => {
    callback && callback();

    for (let i = 0; i < input.length; i++) {
      input[i].__removeChild(alwaysNode);

      alwaysNode.__detach();
    }
  }));
  const alwaysNode = (0, _AnimatedAlways.createAnimatedAlways)(evalNode);

  for (let i = 0; i < input.length; i++) {
    input[i].__addChild(alwaysNode);

    alwaysNode.__attach();
  }
}
//# sourceMappingURL=evaluateOnce.js.map