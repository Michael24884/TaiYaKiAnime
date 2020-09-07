"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedCallFunc = createAnimatedCallFunc;

var _AnimatedNode = _interopRequireWildcard(require("./AnimatedNode"));

var _AnimatedBlock = require("./AnimatedBlock");

var _val = require("../val");

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AnimatedCallFunc extends _AnimatedNode.default {
  constructor(what, args, params) {
    (0, _invariant.default)(what instanceof _AnimatedNode.default, "Reanimated: AnimatedCallFunc 'what' argument should be of type AnimatedNode but got ".concat(what));
    (0, _invariant.default)(args.every(el => el instanceof _AnimatedNode.default), "Reanimated: every AnimatedCallFunc 'args' argument should be of type AnimatedNode but got ".concat(args));
    (0, _invariant.default)(params.every(el => el instanceof _AnimatedNode.default), "Reanimated: every AnimatedCallFunc 'params' argument should be of type AnimatedNode but got ".concat(params));
    super({
      type: 'callfunc',
      what,
      args,
      params
    }, [...args]);

    _defineProperty(this, "_previousCallID", void 0);

    _defineProperty(this, "_what", void 0);

    _defineProperty(this, "_args", void 0);

    _defineProperty(this, "_params", void 0);

    this._what = what;
    this._args = args;
    this._params = params;
  }

  toString() {
    return "AnimatedCallFunc, id: ".concat(this.__nodeID);
  }

  beginContext() {
    this._previousCallID = (0, _AnimatedNode.getCallID)();
    (0, _AnimatedNode.setCallID)((0, _AnimatedNode.getCallID)() + '/' + this.__nodeID);

    this._params.forEach((param, index) => {
      param.beginContext(this._args[index], this._previousCallID);
    });
  }

  endContext() {
    this._params.forEach((param, index) => {
      param.endContext();
    });

    (0, _AnimatedNode.setCallID)(this._previousCallID);
  }

  __onEvaluate() {
    this.beginContext();
    const value = (0, _val.val)(this._what);
    this.endContext();
    return value;
  }

}

function createAnimatedCallFunc(proc, args, params) {
  return new AnimatedCallFunc(proc, args.map(p => (0, _AnimatedBlock.adapt)(p)), params);
}
//# sourceMappingURL=AnimatedCallFunc.js.map