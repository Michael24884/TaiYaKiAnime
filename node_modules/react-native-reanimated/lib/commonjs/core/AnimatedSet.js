"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedSet = createAnimatedSet;

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _val = require("../val");

var _AnimatedBlock = require("../core/AnimatedBlock");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AnimatedSet extends _AnimatedNode.default {
  constructor(what, value) {
    (0, _invariant.default)(what instanceof _AnimatedNode.default, "Reanimated: Animated.set first argument should be of type AnimatedNode but got ".concat(what));
    (0, _invariant.default)(value instanceof _AnimatedNode.default, "Reanimated: Animated.set second argument should be of type AnimatedNode, String or Number but got ".concat(value));
    super({
      type: 'set',
      what,
      value
    }, [value]);

    _defineProperty(this, "_what", void 0);

    _defineProperty(this, "_value", void 0);

    (0, _invariant.default)(!what._constant, 'Value to be set cannot be constant');
    this._what = what;
    this._value = value;
  }

  toString() {
    return "AnimatedSet, id: ".concat(this.__nodeID);
  }

  __onEvaluate() {
    const newValue = (0, _val.val)(this._value);

    this._what.setValue(newValue);

    return newValue;
  }

}

function createAnimatedSet(what, value) {
  return new AnimatedSet(what, (0, _AnimatedBlock.adapt)(value));
}
//# sourceMappingURL=AnimatedSet.js.map