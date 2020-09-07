"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = interpolate;
exports.Extrapolate = void 0;

var _operators = require("../operators");

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _AnimatedNode = _interopRequireDefault(require("../core/AnimatedNode"));

var _AnimatedCond = require("../core/AnimatedCond");

var _AnimatedFunction = require("../core/AnimatedFunction");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const interpolateInternalSingleProc = (0, _AnimatedFunction.createAnimatedFunction)(function (value, inS, inE, outS, outE) {
  const progress = (0, _operators.divide)((0, _operators.sub)(value, inS), (0, _operators.sub)(inE, inS)); // logic below was made in order to provide a compatibility witn an Animated API

  const resultForNonZeroRange = (0, _operators.add)(outS, (0, _operators.multiply)(progress, (0, _operators.sub)(outE, outS)));
  const result = (0, _AnimatedCond.createAnimatedCond)((0, _operators.eq)(inS, inE), (0, _AnimatedCond.createAnimatedCond)((0, _operators.lessOrEq)(value, inS), outS, outE), resultForNonZeroRange);
  return result;
});

function interpolateInternalSingle(value, inputRange, outputRange, offset) {
  const inS = inputRange[offset];
  const inE = inputRange[offset + 1];
  const outS = outputRange[offset];
  const outE = outputRange[offset + 1];
  return interpolateInternalSingleProc(value, inS, inE, outS, outE);
}

function interpolateInternal(value, inputRange, outputRange, offset = 0) {
  if (inputRange.length - offset === 2) {
    return interpolateInternalSingle(value, inputRange, outputRange, offset);
  }

  return (0, _AnimatedCond.createAnimatedCond)((0, _operators.lessThan)(value, inputRange[offset + 1]), interpolateInternalSingle(value, inputRange, outputRange, offset), interpolateInternal(value, inputRange, outputRange, offset + 1));
}

const Extrapolate = {
  EXTEND: 'extend',
  CLAMP: 'clamp',
  IDENTITY: 'identity'
};
exports.Extrapolate = Extrapolate;

function checkNonDecreasing(name, arr) {
  for (let i = 1; i < arr.length; ++i) {
    // We can't validate animated nodes in JS.
    if (arr[i] instanceof _AnimatedNode.default || arr[i - 1] instanceof _AnimatedNode.default) continue;
    (0, _invariant.default)(arr[i] >= arr[i - 1], '%s must be monotonically non-decreasing. (%s)', name, arr);
  }
}

function checkMinElements(name, arr) {
  (0, _invariant.default)(arr.length >= 2, '%s must have at least 2 elements. (%s)', name, arr);
}

function checkValidNumbers(name, arr) {
  for (let i = 0; i < arr.length; i++) {
    // We can't validate animated nodes in JS.
    if (arr[i] instanceof _AnimatedNode.default || typeof arr[i] !== 'number') continue;
    (0, _invariant.default)(Number.isFinite(arr[i]), '%s cannot include %s. (%s)', name, arr[i], arr);
  }
}

function convertToRadians(outputRange) {
  for (const [i, value] of outputRange.entries()) {
    if (typeof value === 'string' && value.endsWith('deg')) {
      outputRange[i] = parseFloat(value) * (Math.PI / 180);
    }
  }
}

function interpolate(value, config) {
  const {
    inputRange,
    outputRange,
    extrapolate = Extrapolate.EXTEND,
    extrapolateLeft,
    extrapolateRight
  } = config;
  checkMinElements('inputRange', inputRange);
  checkValidNumbers('inputRange', inputRange);
  checkMinElements('outputRange', outputRange);
  checkValidNumbers('outputRange', outputRange);
  checkNonDecreasing('inputRange', inputRange);
  (0, _invariant.default)(inputRange.length === outputRange.length, 'inputRange and outputRange must be the same length.');
  convertToRadians(outputRange);
  const left = extrapolateLeft || extrapolate;
  const right = extrapolateRight || extrapolate;
  let output = interpolateInternal(value, inputRange, outputRange);

  if (left === Extrapolate.EXTEND) {} else if (left === Extrapolate.CLAMP) {
    output = (0, _AnimatedCond.createAnimatedCond)((0, _operators.lessThan)(value, inputRange[0]), outputRange[0], output);
  } else if (left === Extrapolate.IDENTITY) {
    output = (0, _AnimatedCond.createAnimatedCond)((0, _operators.lessThan)(value, inputRange[0]), value, output);
  }

  if (right === Extrapolate.EXTEND) {} else if (right === Extrapolate.CLAMP) {
    output = (0, _AnimatedCond.createAnimatedCond)((0, _operators.greaterThan)(value, inputRange[inputRange.length - 1]), outputRange[outputRange.length - 1], output);
  } else if (right === Extrapolate.IDENTITY) {
    output = (0, _AnimatedCond.createAnimatedCond)((0, _operators.greaterThan)(value, inputRange[inputRange.length - 1]), value, output);
  }

  return output;
}
//# sourceMappingURL=interpolate.js.map