"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrReuseTransformNode = createOrReuseTransformNode;

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

var _areEqual = _interopRequireDefault(require("fbjs/lib/areEqual"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sanitizeTransform(inputTransform) {
  const outputTransform = [];
  inputTransform.forEach(transform => {
    for (const key in transform) {
      const value = transform[key];

      if (value instanceof _AnimatedNode.default) {
        outputTransform.push({
          property: key,
          nodeID: value.__nodeID
        });
      } else {
        outputTransform.push({
          property: key,
          value
        });
      }
    }
  });
  return outputTransform;
}

function extractAnimatedParentNodes(transform) {
  const parents = [];
  transform.forEach(transform => {
    for (const key in transform) {
      const value = transform[key];

      if (value instanceof _AnimatedNode.default) {
        parents.push(value);
      }
    }
  });
  return parents;
}

function createOrReuseTransformNode(transform, oldNode) {
  const config = sanitizeTransform(transform);

  if (oldNode && (0, _areEqual.default)(config, oldNode._config)) {
    return oldNode;
  }

  return new AnimatedTransform(transform, config);
}

class AnimatedTransform extends _AnimatedNode.default {
  constructor(transform, config) {
    super({
      type: 'transform',
      transform: config
    }, extractAnimatedParentNodes(transform));
    this._config = config;
    this._transform = transform;
  }

  toString() {
    return "AnimatedTransform, id: ".concat(this.__nodeID);
  }

  __onEvaluate() {
    return this._transform.map(transform => {
      const result = {};

      for (const key in transform) {
        const value = transform[key];

        if (value instanceof _AnimatedNode.default) {
          result[key] = value.__getValue();
        }
      }

      return result;
    });
  }

}
//# sourceMappingURL=AnimatedTransform.js.map