"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = color;

var _reactNative = require("react-native");

var _base = require("../base");

var _AnimatedNode = _interopRequireDefault(require("../core/AnimatedNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const procColor = (0, _base.proc)(function (r, g, b, a) {
  const color = (0, _base.add)((0, _base.multiply)(a, 1 << 24), (0, _base.multiply)((0, _base.round)(r), 1 << 16), (0, _base.multiply)((0, _base.round)(g), 1 << 8), (0, _base.round)(b));

  if (_reactNative.Platform.OS === 'android') {
    // on Android color is represented as signed 32 bit int
    return (0, _base.cond)((0, _base.lessThan)(color, 1 << 31 >>> 0), color, (0, _base.sub)(color, Math.pow(2, 32)));
  }

  return color;
});

function color(r, g, b, a = 1) {
  if (_reactNative.Platform.OS === 'web') {
    // doesn't support bit shifting
    return (0, _base.concat)('rgba(', r, ',', g, ',', b, ',', a, ')');
  }

  if (a instanceof _AnimatedNode.default) {
    a = (0, _base.round)((0, _base.multiply)(a, 255));
  } else {
    a = Math.round(a * 255);
  }

  return procColor(r, g, b, a);
}
//# sourceMappingURL=color.js.map