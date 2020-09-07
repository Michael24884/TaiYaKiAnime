"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTransitioningComponent = createTransitioningComponent;
exports.Transition = exports.Transitioning = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _ReanimatedModule = _interopRequireDefault(require("./ReanimatedModule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const TransitioningContext = _react.default.createContext();

function configFromProps(type, props) {
  const config = {
    type
  };

  if ('durationMs' in props) {
    config.durationMs = props.durationMs;
  }

  if ('interpolation' in props) {
    config.interpolation = props.interpolation;
  }

  if ('type' in props) {
    config.animation = props.type;
  }

  if ('delayMs' in props) {
    config.delayMs = props.delayMs;
  }

  if ('propagation' in props) {
    config.propagation = props.propagation;
  }

  return config;
}
/**
 * The below wrapper is used to support legacy context API with Context.Consumer
 * render prop. We need it as we want to access `context` from within
 * `componentDidMount` callback. If we decided to drop support for older
 * react native we could rewrite it using hooks or `static contextType` API.
 */


function wrapTransitioningContext(Comp) {
  return props => {
    return /*#__PURE__*/_react.default.createElement(TransitioningContext.Consumer, null, context => /*#__PURE__*/_react.default.createElement(Comp, _extends({
      context: context
    }, props)));
  };
}

class In extends _react.default.Component {
  componentDidMount() {
    this.props.context.push(configFromProps('in', this.props));
  }

  render() {
    return this.props.children || null;
  }

}

class Change extends _react.default.Component {
  componentDidMount() {
    this.props.context.push(configFromProps('change', this.props));
  }

  render() {
    return this.props.children || null;
  }

}

class Out extends _react.default.Component {
  componentDidMount() {
    this.props.context.push(configFromProps('out', this.props));
  }

  render() {
    return this.props.children || null;
  }

}

class Together extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "transitions", []);
  }

  componentDidMount() {
    const config = configFromProps('group', this.props);
    config.transitions = this.transitions;
    this.props.context.push(config);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(TransitioningContext.Provider, {
      value: this.transitions
    }, this.props.children);
  }

}

class Sequence extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "transitions", []);
  }

  componentDidMount() {
    const config = configFromProps('group', this.props);
    config.sequence = true;
    config.transitions = this.transitions;
    this.props.context.push(config);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(TransitioningContext.Provider, {
      value: this.transitions
    }, this.props.children);
  }

}

function createTransitioningComponent(Component) {
  class Wrapped extends _react.default.Component {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "propTypes", Component.propTypes);

      _defineProperty(this, "transitions", []);

      _defineProperty(this, "viewRef", _react.default.createRef());
    }

    componentDidMount() {
      if (this.props.animateMount) {
        this.animateNextTransition();
      }
    }

    setNativeProps(props) {
      this.viewRef.current.setNativeProps(props);
    }

    animateNextTransition() {
      const viewTag = (0, _reactNative.findNodeHandle)(this.viewRef.current);

      _ReanimatedModule.default.animateNextTransition(viewTag, {
        transitions: this.transitions
      });
    }

    render() {
      const _this$props = this.props,
            {
        transition
      } = _this$props,
            rest = _objectWithoutProperties(_this$props, ["transition"]);

      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(TransitioningContext.Provider, {
        value: this.transitions
      }, transition), /*#__PURE__*/_react.default.createElement(Component, _extends({}, rest, {
        ref: this.viewRef,
        collapsable: false
      })));
    }

  }

  return Wrapped;
}

const Transitioning = {
  View: createTransitioningComponent(_reactNative.View)
};
exports.Transitioning = Transitioning;
const Transition = {
  Sequence: wrapTransitioningContext(Sequence),
  Together: wrapTransitioningContext(Together),
  In: wrapTransitioningContext(In),
  Out: wrapTransitioningContext(Out),
  Change: wrapTransitioningContext(Change)
};
exports.Transition = Transition;
//# sourceMappingURL=Transitioning.js.map