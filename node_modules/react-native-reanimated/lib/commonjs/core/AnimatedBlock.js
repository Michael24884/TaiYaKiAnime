"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedBlock = createAnimatedBlock;
exports.adapt = adapt;

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _val = require("../val");

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

var _InternalAnimatedValue = _interopRequireDefault(require("./InternalAnimatedValue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AnimatedBlock extends _AnimatedNode.default {
  constructor(array) {
    (0, _invariant.default)(array.every(el => el instanceof _AnimatedNode.default), "Reanimated: Animated.block node argument should be an array with elements of type AnimatedNode. One or more of them are not AnimatedNodes");
    super({
      type: 'block',
      block: array
    }, array);

    _defineProperty(this, "_array", void 0);

    this._array = array;
  }

  toString() {
    return "AnimatedBlock, id: ".concat(this.__nodeID);
  }

  __onEvaluate() {
    let result;

    this._array.forEach(node => {
      result = (0, _val.val)(node);
    });

    return result;
  }

}

function createAnimatedBlock(items) {
  return adapt(items);
}

function nodify(v) {
  if (typeof v === 'object' && (v === null || v === void 0 ? void 0 : v.__isProxy)) {
    if (!v.__val) {
      v.__val = new _InternalAnimatedValue.default(0);
    }

    return v.__val;
  } // TODO: cache some typical static values (e.g. 0, 1, -1)


  return v instanceof _AnimatedNode.default ? v : _InternalAnimatedValue.default.valueForConstant(v);
}

function adapt(v) {
  return Array.isArray(v) ? new AnimatedBlock(v.map(node => adapt(node))) : nodify(v);
}
//# sourceMappingURL=AnimatedBlock.js.map