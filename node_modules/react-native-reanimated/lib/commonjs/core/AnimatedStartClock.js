"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedStartClock = createAnimatedStartClock;

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

var _AnimatedClock = _interopRequireDefault(require("./AnimatedClock"));

var _AnimatedParam = require("./AnimatedParam");

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AnimatedStartClock extends _AnimatedNode.default {
  constructor(clockNode) {
    (0, _invariant.default)(clockNode instanceof _AnimatedClock.default || clockNode instanceof _AnimatedParam.AnimatedParam, "Reanimated: Animated.startClock argument should be of type AnimatedClock but got ".concat(clockNode));
    super({
      type: 'clockStart',
      clock: clockNode
    });

    _defineProperty(this, "_clockNode", void 0);

    this._clockNode = clockNode;
  }

  toString() {
    return "AnimatedStartClock, id: ".concat(this.__nodeID);
  }

  __onEvaluate() {
    this._clockNode.start();

    return 0;
  }

}

function createAnimatedStartClock(clock) {
  return new AnimatedStartClock(clock);
}
//# sourceMappingURL=AnimatedStartClock.js.map