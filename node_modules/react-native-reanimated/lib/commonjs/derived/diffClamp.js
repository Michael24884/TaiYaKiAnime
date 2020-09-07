"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = diffClamp;

var _base = require("../base");

var _InternalAnimatedValue = _interopRequireDefault(require("../core/InternalAnimatedValue"));

var _diff = _interopRequireDefault(require("./diff"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function diffClamp(a, minVal, maxVal) {
  const value = new _InternalAnimatedValue.default();
  return (0, _base.set)(value, (0, _base.min)((0, _base.max)((0, _base.add)((0, _base.cond)((0, _base.defined)(value), value, a), (0, _diff.default)(a)), minVal), maxVal));
}
//# sourceMappingURL=diffClamp.js.map