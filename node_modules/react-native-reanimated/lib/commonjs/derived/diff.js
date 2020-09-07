"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = diff;

var _base = require("../base");

var _InternalAnimatedValue = _interopRequireDefault(require("../core/InternalAnimatedValue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const procDiff = (0, _base.proc)(function (v, stash, prev) {
  return (0, _base.block)([(0, _base.set)(stash, (0, _base.cond)((0, _base.defined)(prev), (0, _base.sub)(v, prev), 0)), (0, _base.set)(prev, v), stash]);
});

function diff(v) {
  const stash = new _InternalAnimatedValue.default(0);
  const prev = new _InternalAnimatedValue.default();
  return procDiff(v, stash, prev);
}
//# sourceMappingURL=diff.js.map