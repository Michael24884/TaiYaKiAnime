function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { StyleSheet } from 'react-native';
import AnimatedNode from './AnimatedNode';
import { createOrReuseTransformNode } from './AnimatedTransform';
import deepEqual from 'fbjs/lib/areEqual';

function sanitizeStyle(inputStyle) {
  const style = {};

  for (const key in inputStyle) {
    const value = inputStyle[key];

    if (value instanceof AnimatedNode) {
      style[key] = value.__nodeID;
    }
  }

  return style;
}

export function createOrReuseStyleNode(style, oldNode) {
  style = StyleSheet.flatten(style) || {};

  if (style.transform) {
    style = _objectSpread(_objectSpread({}, style), {}, {
      transform: createOrReuseTransformNode(style.transform, oldNode && oldNode._style.transform)
    });
  }

  const config = sanitizeStyle(style);

  if (oldNode && deepEqual(config, oldNode._config)) {
    return oldNode;
  }

  return new AnimatedStyle(style, config);
}
/**
 * AnimatedStyle should never be directly instantiated, use createOrReuseStyleNode
 * in order to make a new instance of this node.
 */

export default class AnimatedStyle extends AnimatedNode {
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

      if (value instanceof AnimatedNode) {
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
//# sourceMappingURL=AnimatedStyle.js.map