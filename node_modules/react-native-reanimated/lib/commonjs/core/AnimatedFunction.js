"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedFunction = createAnimatedFunction;

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

var _AnimatedCallFunc = require("./AnimatedCallFunc");

var _AnimatedParam = require("./AnimatedParam");

var _val = require("../val");

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AnimatedFunction extends _AnimatedNode.default {
  constructor(what, ...params) {
    (0, _invariant.default)(what instanceof _AnimatedNode.default, "Reanimated: AnimatedCallFunc 'what' argument should be of type AnimatedNode but got ".concat(what));
    super({
      type: 'func',
      what
    }, [what, ...params]);

    _defineProperty(this, "_what", void 0);

    this._what = what;

    this.__attach();
  }

  __onEvaluate() {
    return (0, _val.val)(this._what);
  }

  toString() {
    return "AnimatedFunction, id: ".concat(this.__nodeID);
  }

}

function createAnimatedFunction(cb) {
  const params = new Array(cb.length);

  for (let i = 0; i < params.length; i++) {
    params[i] = (0, _AnimatedParam.createAnimatedParam)();
  } // eslint-disable-next-line standard/no-callback-literal


  const what = cb(...params);
  const func = new AnimatedFunction(what, ...params);
  return (...args) => {
    if (args.length !== params.length) {
      throw new Error('Parameter mismatch when calling reanimated function. Expected ' + params.length + ' parameters, got ' + args.length + '.');
    }

    return (0, _AnimatedCallFunc.createAnimatedCallFunc)(func, args, params);
  };
}
//# sourceMappingURL=AnimatedFunction.js.map