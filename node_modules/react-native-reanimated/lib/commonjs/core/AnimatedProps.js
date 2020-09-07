"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrReusePropsNode = createOrReusePropsNode;

var _reactNative = require("react-native");

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

var _AnimatedEvent = _interopRequireDefault(require("./AnimatedEvent"));

var _AnimatedStyle = require("./AnimatedStyle");

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _areEqual = _interopRequireDefault(require("fbjs/lib/areEqual"));

var _val = require("../val");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

  toString() {
    return "AnimatedProps, id: ".concat(this.__nodeID);
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

  __detach() {
    const nativeViewTag = (0, _reactNative.findNodeHandle)(this._animatedView);
    (0, _invariant.default)(nativeViewTag != null, 'Unable to locate attached view in the native tree');

    this._disconnectAnimatedView(nativeViewTag);

    super.__detach();
  }

  update() {
    this._callback();

    if (!this._animatedView) {
      return;
    }

    (0, _val.val)(this);
  }

  setNativeView(animatedView) {
    if (this._animatedView === animatedView) {
      return;
    }

    this._animatedView = animatedView;
    const nativeViewTag = (0, _reactNative.findNodeHandle)(this._animatedView);
    (0, _invariant.default)(nativeViewTag != null, 'Unable to locate attached view in the native tree');

    this._connectAnimatedView(nativeViewTag);
  }

}
//# sourceMappingURL=AnimatedProps.js.map