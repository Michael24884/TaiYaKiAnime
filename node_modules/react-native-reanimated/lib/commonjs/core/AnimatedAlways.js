"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedAlways = createAnimatedAlways;

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _val = require("../val");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AnimatedAlways extends _AnimatedNode.default {
  constructor(what) {
    (0, _invariant.default)(what instanceof _AnimatedNode.default, "Reanimated: Animated.always node argument should be of type AnimatedNode but got ".concat(what));
    super({
      type: 'always',
      what
    }, [what]);

    _defineProperty(this, "_what", void 0);

    this._what = what;
  }

  toString() {
    return "AnimatedAlways, id: ".concat(this.__nodeID);
  }

  update() {
    this.__getValue();
  }

  __onEvaluate() {
    (0, _val.val)(this._what);
    return 0;
  }

}

function createAnimatedAlways(item) {
  return new AnimatedAlways(item);
}
//# sourceMappingURL=AnimatedAlways.js.map