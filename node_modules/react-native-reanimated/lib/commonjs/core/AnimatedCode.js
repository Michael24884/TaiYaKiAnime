"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _useCode = _interopRequireDefault(require("../derived/useCode"));

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function assertNodesNotNull(code, children, exec) {
  if (!code) {
    const error = !children ? "Got \"".concat(typeof children, "\" type passed to children") : "Got \"".concat(typeof exec, "\" type passed to exec");
    throw new Error("<Animated.Code /> expects the 'exec' prop or children to be an animated node or a function returning an animated node. ".concat(error));
  }
}

function Code({
  exec,
  children,
  dependencies = []
}) {
  const nodes = children || exec;
  let code = null;

  if (nodes instanceof _AnimatedNode.default) {
    code = () => nodes;
  } else if (typeof nodes === 'function') {
    code = nodes;
  }

  assertNodesNotNull(code, children, exec);
  (0, _useCode.default)(code, dependencies);
  return null;
}

var _default = Code;
exports.default = _default;
//# sourceMappingURL=AnimatedCode.js.map