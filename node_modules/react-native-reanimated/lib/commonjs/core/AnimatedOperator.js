"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedOperator = createAnimatedOperator;

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

var _val = require("../val");

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _AnimatedBlock = require("../core/AnimatedBlock");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function reduce(fn) {
  return input => input.reduce((a, b) => fn((0, _val.val)(a), (0, _val.val)(b)));
}

function reduceFrom(fn, initialValue) {
  return input => input.reduce((a, b) => fn((0, _val.val)(a), (0, _val.val)(b)), initialValue);
}

function infix(fn) {
  return input => fn((0, _val.val)(input[0]), (0, _val.val)(input[1]));
}

function single(fn) {
  return input => fn((0, _val.val)(input[0]));
}

const OPERATIONS = {
  // arithmetic
  add: reduce((a, b) => a + b),
  sub: reduce((a, b) => a - b),
  multiply: reduce((a, b) => a * b),
  divide: reduce((a, b) => a / b),
  pow: reduce((a, b) => Math.pow(a, b)),
  modulo: reduce((a, b) => (a % b + b) % b),
  sqrt: single(a => Math.sqrt(a)),
  log: single(a => Math.log(a)),
  sin: single(a => Math.sin(a)),
  cos: single(a => Math.cos(a)),
  tan: single(a => Math.tan(a)),
  acos: single(a => Math.acos(a)),
  asin: single(a => Math.asin(a)),
  atan: single(a => Math.atan(a)),
  exp: single(a => Math.exp(a)),
  round: single(a => Math.round(a)),
  abs: single(a => Math.abs(a)),
  ceil: single(a => Math.ceil(a)),
  floor: single(a => Math.floor(a)),
  max: reduce((a, b) => Math.max(a, b)),
  min: reduce((a, b) => Math.min(a, b)),
  // logical
  and: reduceFrom((a, b) => a && b, true),
  or: reduceFrom((a, b) => a || b, false),
  not: single(a => !a),
  defined: single(a => a !== null && a !== undefined && !isNaN(a)),
  // comparing
  lessThan: infix((a, b) => a < b),

  /* eslint-disable-next-line eqeqeq */
  eq: infix((a, b) => a == b),
  greaterThan: infix((a, b) => a > b),
  lessOrEq: infix((a, b) => a <= b),
  greaterOrEq: infix((a, b) => a >= b),

  /* eslint-disable-next-line eqeqeq */
  neq: infix((a, b) => a != b)
};

class AnimatedOperator extends _AnimatedNode.default {
  constructor(operator, input) {
    (0, _invariant.default)(typeof operator === 'string', "Reanimated: Animated.operator node first argument should be of type String, but got: ".concat(operator));
    (0, _invariant.default)(input.every(el => el instanceof _AnimatedNode.default || typeof el === 'string' || typeof el === 'number'), "Reanimated: Animated.operator node second argument should be one or more of type AnimatedNode, String or Number but got ".concat(input));
    super({
      type: 'op',
      op: operator,
      input
    }, input);

    _defineProperty(this, "_input", void 0);

    _defineProperty(this, "_op", void 0);

    _defineProperty(this, "_operation", void 0);

    this._op = operator;
    this._input = input;
  }

  toString() {
    return "AnimatedOperator, id: ".concat(this.__nodeID);
  }

  __onEvaluate() {
    if (!this._operation) {
      this._operation = OPERATIONS[this._op];
      (0, _invariant.default)(this._operation, "Illegal operator '%s'", this._op);
    }

    return this._operation(this._input);
  }

}

function createAnimatedOperator(name) {
  return (...args) => new AnimatedOperator(name, args.map(_AnimatedBlock.adapt));
}
//# sourceMappingURL=AnimatedOperator.js.map