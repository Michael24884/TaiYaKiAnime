"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = acc;

var _base = require("../base");

var _InternalAnimatedValue = _interopRequireDefault(require("../core/InternalAnimatedValue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const procAcc = (0, _base.proc)(function (v, acc) {
  return (0, _base.set)(acc, (0, _base.add)(acc, v));
});

function acc(v) {
  const acc = new _InternalAnimatedValue.default(0);
  return procAcc(v, acc);
}
//# sourceMappingURL=acc.js.map