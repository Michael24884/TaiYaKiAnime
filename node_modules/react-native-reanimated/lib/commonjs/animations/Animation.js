"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _InternalAnimatedValue = _interopRequireDefault(require("../core/InternalAnimatedValue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Animation {
  static springDefaultState() {
    return {
      position: new _InternalAnimatedValue.default(0),
      finished: new _InternalAnimatedValue.default(0),
      velocity: new _InternalAnimatedValue.default(0),
      time: new _InternalAnimatedValue.default(0)
    };
  }

  static decayDefaultState() {
    return {
      position: new _InternalAnimatedValue.default(0),
      finished: new _InternalAnimatedValue.default(0),
      velocity: new _InternalAnimatedValue.default(0),
      time: new _InternalAnimatedValue.default(0)
    };
  }

  static timingDefaultState() {
    return {
      position: new _InternalAnimatedValue.default(0),
      finished: new _InternalAnimatedValue.default(0),
      time: new _InternalAnimatedValue.default(0),
      frameTime: new _InternalAnimatedValue.default(0)
    };
  }

}

var _default = Animation;
exports.default = _default;
//# sourceMappingURL=Animation.js.map