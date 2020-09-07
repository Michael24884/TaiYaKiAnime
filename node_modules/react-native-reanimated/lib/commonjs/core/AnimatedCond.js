"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedCond = createAnimatedCond;

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _AnimatedBlock = require("../core/AnimatedBlock");

var _val = require("../val");

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AnimatedCond extends _AnimatedNode.default {
  constructor(condition, ifBlock, elseBlock) {
    (0, _invariant.default)(condition instanceof _AnimatedNode.default, "Reanimated: Animated.cond node first argument should be of type AnimatedNode but got ".concat(condition));
    (0, _invariant.default)(ifBlock instanceof _AnimatedNode.default, "Reanimated: Animated.cond node second argument should be of type AnimatedNode but got ".concat(ifBlock));
    (0, _invariant.default)(elseBlock instanceof _AnimatedNode.default || elseBlock === undefined, "Reanimated: Animated.cond node third argument should be of type AnimatedNode or should be undefined but got ".concat(elseBlock));
    super({
      type: 'cond',
      cond: condition,
      ifBlock,
      elseBlock
    }, [condition, ifBlock, elseBlock]);

    _defineProperty(this, "_condition", void 0);

    _defineProperty(this, "_ifBlock", void 0);

    _defineProperty(this, "_elseBlock", void 0);

    this._condition = condition;
    this._ifBlock = ifBlock;
    this._elseBlock = elseBlock;
  }

  toString() {
    return "AnimatedCond, id: ".concat(this.__nodeID);
  }

  __onEvaluate() {
    if ((0, _val.val)(this._condition)) {
      return (0, _val.val)(this._ifBlock);
    } else {
      return this._elseBlock !== undefined ? (0, _val.val)(this._elseBlock) : undefined;
    }
  }

}

function createAnimatedCond(cond, ifBlock, elseBlock) {
  return new AnimatedCond((0, _AnimatedBlock.adapt)(cond), (0, _AnimatedBlock.adapt)(ifBlock), elseBlock === undefined ? undefined : (0, _AnimatedBlock.adapt)(elseBlock));
}
//# sourceMappingURL=AnimatedCond.js.map