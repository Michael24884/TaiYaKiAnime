"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedDebug = createAnimatedDebug;

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _val = require("../val");

var _AnimatedBlock = require("./AnimatedBlock");

var _AnimatedCall = require("./AnimatedCall");

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AnimatedDebug extends _AnimatedNode.default {
  constructor(message, value) {
    (0, _invariant.default)(typeof message === 'string', "Reanimated: Animated.debug node first argument should be of type string but got ".concat(message));
    (0, _invariant.default)(value instanceof _AnimatedNode.default, "Reanimated: Animated.debug node second argument should be of type AnimatedNode but got ".concat(value));
    super({
      type: 'debug',
      message,
      value
    }, [value]);

    _defineProperty(this, "_message", void 0);

    _defineProperty(this, "_value", void 0);

    this._message = message;
    this._value = value;
  }

  toString() {
    return "AnimatedDebug, id: ".concat(this.__nodeID);
  }

  __onEvaluate() {
    const value = (0, _val.val)(this._value);
    console.log(this._message, value);
    return value;
  }

}

function createAnimatedDebug(message, value) {
  if (__DEV__) {
    const runningInRemoteDebugger = typeof atob !== 'undefined'; // hack to detect if app is running in remote debugger
    // https://stackoverflow.com/questions/39022216

    const runningInExpoShell = global.Expo && global.Expo.Constants.appOwnership !== 'standalone';

    if (runningInRemoteDebugger || runningInExpoShell) {
      // When running in expo or remote debugger we use JS console.log to output variables
      // otherwise we output to the native console using native debug node
      return (0, _AnimatedBlock.createAnimatedBlock)([(0, _AnimatedCall.createAnimatedCall)([value], ([a]) => console.log("".concat(message, " ").concat(a))), value]);
    } else {
      return new AnimatedDebug(message, (0, _AnimatedBlock.adapt)(value));
    }
  } // Debugging is disabled in PROD


  return value;
}
//# sourceMappingURL=AnimatedDebug.js.map