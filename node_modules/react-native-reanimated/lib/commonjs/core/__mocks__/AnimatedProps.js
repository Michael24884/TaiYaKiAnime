"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrReusePropsNode = createOrReusePropsNode;

var _AnimatedNode = _interopRequireDefault(require("../AnimatedNode"));

var _AnimatedEvent = _interopRequireDefault(require("../AnimatedEvent"));

var _AnimatedStyle = _interopRequireWildcard(require("../AnimatedStyle"));

var _areEqual = _interopRequireDefault(require("fbjs/lib/areEqual"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// This file has been mocked as react-native's `findNodeHandle` is returning undefined value;
// and I became easier to mock whole this file instead of mocking RN
function sanitizeProps(inputProps) {
  const props = {};

  for (const key in inputProps) {
    const value = inputProps[key];

    if (value instanceof _AnimatedNode.default && !(value instanceof _AnimatedEvent.default)) {
      props[key] = value.__nodeID;
    }
  }

  return props;
}

function createOrReusePropsNode(props, callback, oldNode) {
  if (props.style) {
    props = _objectSpread(_objectSpread({}, props), {}, {
      style: (0, _AnimatedStyle.createOrReuseStyleNode)(props.style, oldNode && oldNode._props.style)
    });
  }

  const config = sanitizeProps(props);

  if (oldNode && (0, _areEqual.default)(config, oldNode._config)) {
    return oldNode;
  }

  return new AnimatedProps(props, config, callback);
}

class AnimatedProps extends _AnimatedNode.default {
  constructor(props, config, callback) {
    super({
      type: 'props',
      props: config
    }, Object.values(props).filter(n => !(n instanceof _AnimatedEvent.default)));
    this._config = config;
    this._props = props;
    this._callback = callback;

    this.__attach();
  }

  __getProps() {
    const props = {};

    for (const key in this._props) {
      const value = this._props[key];

      if (value instanceof _AnimatedNode.default) {
        if (value instanceof _AnimatedStyle.default) {
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

      if (value instanceof _AnimatedNode.default) {
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