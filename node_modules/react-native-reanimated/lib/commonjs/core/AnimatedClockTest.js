"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedClockTest = createAnimatedClockTest;

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AnimatedClockTest extends _AnimatedNode.default {
  constructor(clockNode) {
    super({
      type: 'clockTest',
      clock: clockNode
    });

    _defineProperty(this, "_clockNode", void 0);

    this._clockNode = clockNode;
  }

  toString() {
    return "AnimatedClockTest, id: ".concat(this.__nodeID);
  }

  __onEvaluate() {
    return this._clockNode.isStarted() ? 1 : 0;
  }

}

function createAnimatedClockTest(clock) {
  return new AnimatedClockTest(clock);
}
//# sourceMappingURL=AnimatedClockTest.js.map