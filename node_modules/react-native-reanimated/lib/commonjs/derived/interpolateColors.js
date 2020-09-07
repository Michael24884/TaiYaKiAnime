"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = interpolateColors;

var _reactNative = require("react-native");

var _base = require("../base");

var _color = _interopRequireDefault(require("./color"));

var _interpolate = _interopRequireWildcard(require("./interpolate"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function red(c) {
  return c >> 16 & 255;
}

function green(c) {
  return c >> 8 & 255;
}

function blue(c) {
  return c & 255;
}

function opacity(c) {
  return (c >> 24 & 255) / 255;
}
/**
 * Use this if you want to interpolate an `Animated.Value` into color values.
 *
 * #### Why is this needed?
 *
 * Unfortunately, if you'll pass color values directly into the `outputRange` option
 * of `interpolate()` function, that won't really work (at least at the moment).
 * See https://github.com/software-mansion/react-native-reanimated/issues/181 .
 *
 * So, for now you can just use this helper instead.
 */


function interpolateColors(animationValue, options) {
  const {
    inputRange,
    outputColorRange
  } = options;
  const colors = outputColorRange.map(_reactNative.processColor);
  const r = (0, _base.round)((0, _interpolate.default)(animationValue, {
    inputRange,
    outputRange: colors.map(red),
    extrapolate: _interpolate.Extrapolate.CLAMP
  }));
  const g = (0, _base.round)((0, _interpolate.default)(animationValue, {
    inputRange,
    outputRange: colors.map(green),
    extrapolate: _interpolate.Extrapolate.CLAMP
  }));
  const b = (0, _base.round)((0, _interpolate.default)(animationValue, {
    inputRange,
    outputRange: colors.map(blue),
    extrapolate: _interpolate.Extrapolate.CLAMP
  }));
  const a = (0, _interpolate.default)(animationValue, {
    inputRange,
    outputRange: colors.map(opacity),
    extrapolate: _interpolate.Extrapolate.CLAMP
  });
  return (0, _color.default)(r, g, b, a);
}
//# sourceMappingURL=interpolateColors.js.map