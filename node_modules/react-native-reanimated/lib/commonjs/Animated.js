"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  decay: true,
  timing: true,
  spring: true,
  Easing: true,
  Clock: true,
  Value: true,
  Node: true,
  Transition: true,
  Transitioning: true,
  createTransitioningComponent: true,
  SpringUtils: true,
  useValue: true
};
Object.defineProperty(exports, "Easing", {
  enumerable: true,
  get: function get() {
    return _Easing.default;
  }
});
Object.defineProperty(exports, "Clock", {
  enumerable: true,
  get: function get() {
    return _AnimatedClock.default;
  }
});
Object.defineProperty(exports, "Value", {
  enumerable: true,
  get: function get() {
    return _AnimatedValue.default;
  }
});
Object.defineProperty(exports, "Node", {
  enumerable: true,
  get: function get() {
    return _AnimatedNode.default;
  }
});
Object.defineProperty(exports, "Transition", {
  enumerable: true,
  get: function get() {
    return _Transitioning.Transition;
  }
});
Object.defineProperty(exports, "Transitioning", {
  enumerable: true,
  get: function get() {
    return _Transitioning.Transitioning;
  }
});
Object.defineProperty(exports, "createTransitioningComponent", {
  enumerable: true,
  get: function get() {
    return _Transitioning.createTransitioningComponent;
  }
});
Object.defineProperty(exports, "SpringUtils", {
  enumerable: true,
  get: function get() {
    return _SpringUtils.default;
  }
});
Object.defineProperty(exports, "useValue", {
  enumerable: true,
  get: function get() {
    return _useValue.default;
  }
});
exports.spring = exports.timing = exports.decay = exports.default = void 0;

var _reactNative = require("react-native");

var _Easing = _interopRequireDefault(require("./Easing"));

var _AnimatedClock = _interopRequireDefault(require("./core/AnimatedClock"));

var _AnimatedValue = _interopRequireDefault(require("./core/AnimatedValue"));

var _AnimatedNode = _interopRequireDefault(require("./core/AnimatedNode"));

var _AnimatedCode = _interopRequireDefault(require("./core/AnimatedCode"));

var base = _interopRequireWildcard(require("./base"));

Object.keys(base).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return base[key];
    }
  });
});

var derived = _interopRequireWildcard(require("./derived"));

Object.keys(derived).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return derived[key];
    }
  });
});

var _createAnimatedComponent = _interopRequireDefault(require("./createAnimatedComponent"));

var _decay = _interopRequireDefault(require("./animations/decay"));

var _timing = _interopRequireDefault(require("./animations/timing"));

var _spring = _interopRequireDefault(require("./animations/spring"));

var _Animation = _interopRequireDefault(require("./animations/Animation"));

var _ConfigHelper = require("./ConfigHelper");

var _backwardCompatibleAnimWrapper = _interopRequireDefault(require("./animations/backwardCompatibleAnimWrapper"));

var _Transitioning = require("./Transitioning");

var _SpringUtils = _interopRequireDefault(require("./animations/SpringUtils"));

var _useValue = _interopRequireDefault(require("./useValue"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const decayWrapper = (0, _backwardCompatibleAnimWrapper.default)(_decay.default, _Animation.default.decayDefaultState);
exports.decay = decayWrapper;
const timingWrapper = (0, _backwardCompatibleAnimWrapper.default)(_timing.default, _Animation.default.timingDefaultState);
exports.timing = timingWrapper;
const springWrapper = (0, _backwardCompatibleAnimWrapper.default)(_spring.default, _Animation.default.springDefaultState);
exports.spring = springWrapper;

const Animated = _objectSpread(_objectSpread(_objectSpread({
  // components
  View: (0, _createAnimatedComponent.default)(_reactNative.View),
  Text: (0, _createAnimatedComponent.default)(_reactNative.Text),
  Image: (0, _createAnimatedComponent.default)(_reactNative.Image),
  ScrollView: (0, _createAnimatedComponent.default)(_reactNative.ScrollView),
  Code: _AnimatedCode.default,
  createAnimatedComponent: _createAnimatedComponent.default,
  // classes
  Clock: _AnimatedClock.default,
  Value: _AnimatedValue.default,
  Node: _AnimatedNode.default
}, base), derived), {}, {
  // animations
  decay: decayWrapper,
  timing: timingWrapper,
  spring: springWrapper,
  SpringUtils: _SpringUtils.default,
  // configuration
  addWhitelistedNativeProps: _ConfigHelper.addWhitelistedNativeProps,
  addWhitelistedUIProps: _ConfigHelper.addWhitelistedUIProps,
  // hooks
  useValue: _useValue.default
});

var _default = Animated; // operations

exports.default = _default;
//# sourceMappingURL=Animated.js.map