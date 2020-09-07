function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { View, findNodeHandle } from 'react-native';
import ReanimatedModule from './ReanimatedModule';
const TransitioningContext = React.createContext();

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
    return /*#__PURE__*/React.createElement(TransitioningContext.Consumer, null, context => /*#__PURE__*/React.createElement(Comp, _extends({
      context: context
    }, props)));
  };
}

class In extends React.Component {
  componentDidMount() {
    this.props.context.push(configFromProps('in', this.props));
  }

  render() {
    return this.props.children || null;
  }

}

class Change extends React.Component {
  componentDidMount() {
    this.props.context.push(configFromProps('change', this.props));
  }

  render() {
    return this.props.children || null;
  }

}

class Out extends React.Component {
  componentDidMount() {
    this.props.context.push(configFromProps('out', this.props));
  }

  render() {
    return this.props.children || null;
  }

}

class Together extends React.Component {
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
    return /*#__PURE__*/React.createElement(TransitioningContext.Provider, {
      value: this.transitions
    }, this.props.children);
  }

}

class Sequence extends React.Component {
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
    return /*#__PURE__*/React.createElement(TransitioningContext.Provider, {
      value: this.transitions
    }, this.props.children);
  }

}

function createTransitioningComponent(Component) {
  class Wrapped extends React.Component {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "propTypes", Component.propTypes);

      _defineProperty(this, "transitions", []);

      _defineProperty(this, "viewRef", React.createRef());
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
      const viewTag = findNodeHandle(this.viewRef.current);
      ReanimatedModule.animateNextTransition(viewTag, {
        transitions: this.transitions
      });
    }

    render() {
      const _this$props = this.props,
            {
        transition
      } = _this$props,
            rest = _objectWithoutProperties(_this$props, ["transition"]);

      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TransitioningContext.Provider, {
        value: this.transitions
      }, transition), /*#__PURE__*/React.createElement(Component, _extends({}, rest, {
        ref: this.viewRef,
        collapsable: false
      })));
    }

  }

  return Wrapped;
}

const Transitioning = {
  View: createTransitioningComponent(View)
};
const Transition = {
  Sequence: wrapTransitioningContext(Sequence),
  Together: wrapTransitioningContext(Together),
  In: wrapTransitioningContext(In),
  Out: wrapTransitioningContext(Out),
  Change: wrapTransitioningContext(Change)
};
export { Transitioning, Transition, createTransitioningComponent };
//# sourceMappingURL=Transitioning.js.map