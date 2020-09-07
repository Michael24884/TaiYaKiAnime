"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrReuseStyleNode = createOrReuseStyleNode;
exports.default = void 0;

var _reactNative = require("react-native");

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

var _AnimatedTransform = require("./AnimatedTransform");

var _areEqual = _interopRequireDefault(require("fbjs/lib/areEqual"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function sanitizeStyle(inputStyle) {
  const style = {};

  for (const key in inputStyle) {
    const value = inputStyle[key];

    if (value instanceof _AnimatedNode.default) {
      style[key] = value.__nodeID;
    }
  }

  return style;
}

function createOrReuseStyleNode(style, oldNode) {
  style = _reactNative.StyleSheet.flatten(style) || {};

  if (style.transform) {
    style = _objectSpread(_objectSpread({}, style), {}, {
      transform: (0, _AnimatedTransform.createOrReuseTransformNode)(style.transform, oldNode && oldNode._style.transform)
    });
  }

  const config = sanitizeStyle(style);

  if (oldNode && (0, _areEqual.default)(config, oldNode._config)) {
    return oldNode;
  }

  return new AnimatedStyle(style, config);
}
/**
 * AnimatedStyle should never be directly instantiated, use createOrReuseStyleNode
 * in order to make a new instance of this node.
 */


class AnimatedStyle extends _AnimatedNode.default {
  constructor(style, config) {
    super({
      type: 'style',
      style: config
    }, Object.values(style));
    this._config = config;
    this._style = style;
  }

  toString() {
    return "AnimatedStyle, id: ".concat(this.__nodeID);
  }

  _walkStyleAndGetAnimatedValues(style) {
    const updatedStyle = {};

    for (const key in style) {
      const value = style[key];

      if (value instanceof _AnimatedNode.default) {
        updatedStyle[key] = value.__getValue();
      } else if (value && !Array.isArray(value) && typeof value === 'object') {
        // Support animating nested values (for example: shadowOffset.height)
        updatedStyle[key] = this._walkStyleAndGetAnimatedValues(value);
      }
    }

    return updatedStyle;
  }

  __onEvaluate() {
    return this._walkStyleAndGetAnimatedValues(this._style);
  }

}

exports.default = AnimatedStyle;
//# sourceMappingURL=AnimatedStyle.js.map