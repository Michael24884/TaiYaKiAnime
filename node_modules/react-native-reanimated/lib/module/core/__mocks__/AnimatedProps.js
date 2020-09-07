function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import AnimatedNode from '../AnimatedNode';
import AnimatedEvent from '../AnimatedEvent';
import AnimatedStyle, { createOrReuseStyleNode } from '../AnimatedStyle';
import deepEqual from 'fbjs/lib/areEqual'; // This file has been mocked as react-native's `findNodeHandle` is returning undefined value;
// and I became easier to mock whole this file instead of mocking RN

function sanitizeProps(inputProps) {
  const props = {};

  for (const key in inputProps) {
    const value = inputProps[key];

    if (value instanceof AnimatedNode && !(value instanceof AnimatedEvent)) {
      props[key] = value.__nodeID;
    }
  }

  return props;
}

export function createOrReusePropsNode(props, callback, oldNode) {
  if (props.style) {
    props = _objectSpread(_objectSpread({}, props), {}, {
      style: createOrReuseStyleNode(props.style, oldNode && oldNode._props.style)
    });
  }

  const config = sanitizeProps(props);

  if (oldNode && deepEqual(config, oldNode._config)) {
    return oldNode;
  }

  return new AnimatedProps(props, config, callback);
}

class AnimatedProps extends AnimatedNode {
  constructor(props, config, callback) {
    super({
      type: 'props',
      props: config
    }, Object.values(props).filter(n => !(n instanceof AnimatedEvent)));
    this._config = config;
    this._props = props;
    this._callback = callback;

    this.__attach();
  }

  __getProps() {
    const props = {};

    for (const key in this._props) {
      const value = this._props[key];

      if (value instanceof AnimatedNode) {
        if (value instanceof AnimatedStyle) {
          props[key] = value.__getProps();
        }
      } else {
        props[key] = value;
      }
    }

    return props;
  }

  __onEvaluate() {
    const props = {};

    for (const key in this._props) {
      const value = this._props[key];

      if (value instanceof AnimatedNode) {
        props[key] = value.__getValue();
      }
    }

    return props;
  }

  update() {
    this._callback();
  }

  setNativeView(animatedView) {
    if (this._animatedView === animatedView) {
      return;
    }

    this._animatedView = animatedView;
  }

}
//# sourceMappingURL=AnimatedProps.js.map