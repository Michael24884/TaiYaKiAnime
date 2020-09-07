"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedConcat = createAnimatedConcat;

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _AnimatedBlock = require("../core/AnimatedBlock");

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

var _val = require("../val");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AnimatedConcat extends _AnimatedNode.default {
  constructor(input) {
    (0, _invariant.default)(input.every(el => el instanceof _AnimatedNode.default || typeof el === 'number' || typeof el === 'string'), "Reanimated: Animated.concat node arguments should be of type AnimatedNode or String or Number. One or more of them are not of that type. Node: ".concat(input));
    super({
      type: 'concat',
      input
    }, input);
    this._input = input;
  }

  __onEvaluate() {
    return this._input.reduce((prev, current) => prev + (0, _val.val)(current), '');
  }

  toString() {
    return "AnimatedConcat, id: ".concat(this.__nodeID);
  }

}

function createAnimatedConcat(...args) {
  return new AnimatedConcat(args.map(_AnimatedBlock.adapt));
}
//# sourceMappingURL=AnimatedConcat.js.map