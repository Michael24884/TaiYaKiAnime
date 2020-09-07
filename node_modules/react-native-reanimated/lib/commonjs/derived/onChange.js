"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = onChange;

var _base = require("../base");

var _InternalAnimatedValue = _interopRequireDefault(require("../core/InternalAnimatedValue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const procOnChange = (0, _base.proc)(function (value, action, prevValue) {
  return (0, _base.block)([(0, _base.cond)((0, _base.not)((0, _base.defined)(prevValue)), (0, _base.set)(prevValue, value)), (0, _base.cond)((0, _base.neq)(value, prevValue), [(0, _base.set)(prevValue, value), action])]);
});

function onChange(value, action) {
  const prevValue = new _InternalAnimatedValue.default();
  return procOnChange(value, action, prevValue);
}
//# sourceMappingURL=onChange.js.map