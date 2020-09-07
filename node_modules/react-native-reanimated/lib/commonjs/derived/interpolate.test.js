"use strict";

var _interpolate = _interopRequireDefault(require("./interpolate"));

var _AnimatedValue = _interopRequireDefault(require("../core/AnimatedValue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.mock('../ReanimatedEventEmitter');
jest.mock('../ReanimatedModule');
const value = new _AnimatedValue.default(0);
it('throws if inputRange or outputRange does not contain at least 2 elements', () => {
  expect(() => (0, _interpolate.default)(value, {
    inputRange: [0],
    outputRange: [0, 1]
  })).toThrowErrorMatchingSnapshot();
  expect(() => (0, _interpolate.default)(value, {
    inputRange: [0, 1],
    outputRange: [0]
  })).toThrowErrorMatchingSnapshot();
});
it('throws if inputRange and outputRange are not the same length', () => {
  expect(() => (0, _interpolate.default)(value, {
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 2, 3]
  })).toThrowErrorMatchingSnapshot();
});
it('throws if inputRange or outputRange contains an invalid value', () => {
  expect(() => (0, _interpolate.default)(value, {
    inputRange: [0, 1, Infinity],
    outputRange: [0, 1, 2]
  })).toThrowErrorMatchingSnapshot();
  expect(() => (0, _interpolate.default)(value, {
    inputRange: [0, 1, 2],
    outputRange: [0, 1, NaN]
  })).toThrowErrorMatchingSnapshot();
});
it('throws if inputRange is not monotonically non-decreasing', () => {
  expect(() => (0, _interpolate.default)(value, {
    inputRange: [0, 1, 0],
    outputRange: [0, 1, 2]
  })).toThrowErrorMatchingSnapshot();
});
//# sourceMappingURL=interpolate.test.js.map