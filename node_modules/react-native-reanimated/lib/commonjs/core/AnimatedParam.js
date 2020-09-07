"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedParam = createAnimatedParam;
exports.AnimatedParam = void 0;

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _AnimatedNode = _interopRequireWildcard(require("./AnimatedNode"));

var _AnimatedClock = _interopRequireDefault(require("./AnimatedClock"));

var _val = require("../val");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AnimatedParam extends _AnimatedNode.default {
  constructor() {
    super({
      type: 'param'
    }, []);

    _defineProperty(this, "argsStack", []);

    _defineProperty(this, "_prevCallID", void 0);

    this.__attach();
  }

  beginContext(ref, prevCallID) {
    this._prevCallID = prevCallID;
    this.argsStack.push(ref);
  }

  endContext() {
    this.argsStack.pop();
  }

  _getTopNode() {
    if (this.argsStack.length === 0) throw new Error("param: Invocation failed because argsStack is empty");
    const top = this.argsStack[this.argsStack.length - 1];
    return top;
  }

  setValue(value) {
    const top = this._getTopNode();

    if (top.setValue) {
      const callID = (0, _AnimatedNode.getCallID)();
      (0, _AnimatedNode.setCallID)(this._prevCallID);
      top.setValue(value);
      (0, _AnimatedNode.setCallID)(callID);
    } else {
      throw new Error("param: setValue(".concat(value, ") failed because the top element has no known method for updating it's current value."));
    }
  }

  __onEvaluate() {
    const callID = (0, _AnimatedNode.getCallID)();
    (0, _AnimatedNode.setCallID)(this._prevCallID);

    const top = this._getTopNode();

    const value = (0, _val.val)(top);
    (0, _AnimatedNode.setCallID)(callID);
    return value;
  }

  start() {
    const node = this._getTopNode();

    (0, _invariant.default)(node instanceof _AnimatedClock.default || node instanceof AnimatedParam, "param: top node should be of type AnimatedClock but got ".concat(node));
    node.start();
  }

  stop() {
    const node = this._getTopNode();

    (0, _invariant.default)(node instanceof _AnimatedClock.default || node instanceof AnimatedParam, "param: top node should be of type AnimatedClock but got ".concat(node));
    node.stop();
  }

  isRunning() {
    const node = this._getTopNode();

    if (node instanceof AnimatedParam) {
      return node.isRunning();
    }

    (0, _invariant.default)(node instanceof _AnimatedClock.default, "param: top node should be of type AnimatedClock but got ".concat(node));
    return node.isStarted();
  }

}

exports.AnimatedParam = AnimatedParam;

function createAnimatedParam() {
  return new AnimatedParam();
}
//# sourceMappingURL=AnimatedParam.js.map