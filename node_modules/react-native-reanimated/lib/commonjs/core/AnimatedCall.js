"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedCall = createAnimatedCall;

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _ReanimatedEventEmitter = _interopRequireDefault(require("../ReanimatedEventEmitter"));

var _val = require("../val");

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const NODE_MAPPING = new Map();

function listener(data) {
  const node = NODE_MAPPING.get(data.id);
  node && node._callback(data.args);
}

class AnimatedCall extends _AnimatedNode.default {
  constructor(args, jsFunction) {
    (0, _invariant.default)(args.every(el => el instanceof _AnimatedNode.default), "Reanimated: Animated.call node args should be an array with elements of type AnimatedNode. One or more of them are not AnimatedNodes");
    super({
      type: 'call',
      input: args
    }, args);

    _defineProperty(this, "_callback", void 0);

    _defineProperty(this, "_args", void 0);

    this._callback = jsFunction;
    this._args = args;
  }

  toString() {
    return "AnimatedCall, id: ".concat(this.__nodeID);
  }

  __attach() {
    super.__attach();

    NODE_MAPPING.set(this.__nodeID, this);

    if (NODE_MAPPING.size === 1) {
      _ReanimatedEventEmitter.default.addListener('onReanimatedCall', listener);
    }
  }

  __detach() {
    NODE_MAPPING.delete(this.__nodeID);

    if (NODE_MAPPING.size === 0) {
      _ReanimatedEventEmitter.default.removeAllListeners('onReanimatedCall');
    }

    super.__detach();
  }

  __onEvaluate() {
    this._callback(this._args.map(_val.val));

    return 0;
  }

}

function createAnimatedCall(args, func) {
  return new AnimatedCall(args, func);
}
//# sourceMappingURL=AnimatedCall.js.map