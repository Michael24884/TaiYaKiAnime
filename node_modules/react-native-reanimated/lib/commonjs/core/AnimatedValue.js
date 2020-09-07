"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AnimatedSet = require("../core/AnimatedSet");

var _interpolate = _interopRequireDefault(require("../derived/interpolate"));

var _InternalAnimatedValue = _interopRequireDefault(require("./InternalAnimatedValue"));

var _reactNative = require("react-native");

var _evaluateOnce = require("../derived/evaluateOnce");

var _ReanimatedModule = _interopRequireDefault(require("../ReanimatedModule"));

var _val = require("../val");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Animated value wrapped with extra methods for omit cycle of dependencies
class AnimatedValue extends _InternalAnimatedValue.default {
  setValue(value) {
    this.__detachAnimation(this._animation);

    if (_reactNative.Platform.OS === 'web' || _reactNative.Platform.OS === 'windows' || _reactNative.Platform.OS === 'macos') {
      this._updateValue((0, _val.val)(value));
    } else {
      if (_ReanimatedModule.default.setValue && typeof value === 'number') {
        // FIXME Remove it after some time
        // For OTA-safety
        // FIXME handle setting value with a node
        _ReanimatedModule.default.setValue(this.__nodeID, value);
      } else {
        (0, _evaluateOnce.evaluateOnce)((0, _AnimatedSet.createAnimatedSet)(this, value), this);
      }
    }
  }

  toString() {
    return "AnimatedValue, id: ".concat(this.__nodeID);
  }

  interpolate(config) {
    return (0, _interpolate.default)(this, config);
  }

}

exports.default = AnimatedValue;
//# sourceMappingURL=AnimatedValue.js.map