"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAnimatedComponent;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _ReanimatedEventEmitter = _interopRequireDefault(require("./ReanimatedEventEmitter"));

var _AnimatedEvent = _interopRequireDefault(require("./core/AnimatedEvent"));

var _AnimatedNode = _interopRequireDefault(require("./core/AnimatedNode"));

var _AnimatedValue = _interopRequireDefault(require("./core/AnimatedValue"));

var _AnimatedProps = require("./core/AnimatedProps");

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const NODE_MAPPING = new Map();

function listener(data) {
  const component = NODE_MAPPING.get(data.viewTag);
  component && component._updateFromNative(data.props);
}

function dummyListener() {// empty listener we use to assign to listener properties for which animated
  // event is used.
}

function createAnimatedComponent(Component) {
  (0, _invariant.default)(typeof Component !== 'function' || Component.prototype && Component.prototype.isReactComponent, '`createAnimatedComponent` does not support stateless functional components; ' + 'use a class component instead.');

  class AnimatedComponent extends _react.default.Component {
    constructor(props) {
      super(props);

      _defineProperty(this, "_invokeAnimatedPropsCallbackOnMount", false);

      _defineProperty(this, "_animatedPropsCallback", () => {
        if (this._component == null) {
          // AnimatedProps is created in will-mount because it's used in render.
          // But this callback may be invoked before mount in async mode,
          // In which case we should defer the setNativeProps() call.
          // React may throw away uncommitted work in async mode,
          // So a deferred call won't always be invoked.
          this._invokeAnimatedPropsCallbackOnMount = true;
        } else if (typeof this._component.setNativeProps !== 'function') {
          this.forceUpdate();
        } else {
          this._component.setNativeProps(this._propsAnimated.__getValue());
        }
      });

      _defineProperty(this, "_setComponentRef", c => {
        if (c !== this._component) {
          this._component = c;
        }
      });

      this._attachProps(this.props);
    }

    componentWillUnmount() {
      this._detachPropUpdater();

      this._propsAnimated && this._propsAnimated.__detach();

      this._detachNativeEvents();
    }

    setNativeProps(props) {
      this._component.setNativeProps(props);
    }

    componentDidMount() {
      if (this._invokeAnimatedPropsCallbackOnMount) {
        this._invokeAnimatedPropsCallbackOnMount = false;

        this._animatedPropsCallback();
      }

      this._propsAnimated.setNativeView(this._component);

      this._attachNativeEvents();

      this._attachPropUpdater();
    }

    _getEventViewRef() {
      // Make sure to get the scrollable node for components that implement
      // `ScrollResponder.Mixin`.
      return this._component.getScrollableNode ? this._component.getScrollableNode() : this._component;
    }

    _attachNativeEvents() {
      const node = this._getEventViewRef();

      for (const key in this.props) {
        const prop = this.props[key];

        if (prop instanceof _AnimatedEvent.default) {
          prop.attachEvent(node, key);
        }
      }
    }

    _detachNativeEvents() {
      const node = this._getEventViewRef();

      for (const key in this.props) {
        const prop = this.props[key];

        if (prop instanceof _AnimatedEvent.default) {
          prop.detachEvent(node, key);
        }
      }
    }

    _reattachNativeEvents(prevProps) {
      const node = this._getEventViewRef();

      const attached = new Set();
      const nextEvts = new Set();

      for (const key in this.props) {
        const prop = this.props[key];

        if (prop instanceof _AnimatedEvent.default) {
          nextEvts.add(prop.__nodeID);
        }
      }

      for (const key in prevProps) {
        const prop = this.props[key];

        if (prop instanceof _AnimatedEvent.default) {
          if (!nextEvts.has(prop.__nodeID)) {
            // event was in prev props but not in current props, we detach
            prop.detachEvent(node, key);
          } else {
            // event was in prev and is still in current props
            attached.add(prop.__nodeID);
          }
        }
      }

      for (const key in this.props) {
        const prop = this.props[key];

        if (prop instanceof _AnimatedEvent.default && !attached.has(prop.__nodeID)) {
          // not yet attached
          prop.attachEvent(node, key);
        }
      }
    } // The system is best designed when setNativeProps is implemented. It is
    // able to avoid re-rendering and directly set the attributes that changed.
    // However, setNativeProps can only be implemented on native components
    // If you want to animate a composite component, you need to re-render it.
    // In this case, we have a fallback that uses forceUpdate.


    _attachProps(nextProps) {
      const oldPropsAnimated = this._propsAnimated;
      this._propsAnimated = (0, _AnimatedProps.createOrReusePropsNode)(nextProps, this._animatedPropsCallback, oldPropsAnimated); // If prop node has been reused we don't need to call into "__detach"

      if (oldPropsAnimated !== this._propsAnimated) {
        // When you call detach, it removes the element from the parent list
        // of children. If it goes to 0, then the parent also detaches itself
        // and so on.
        // An optimization is to attach the new elements and THEN detach the old
        // ones instead of detaching and THEN attaching.
        // This way the intermediate state isn't to go to 0 and trigger
        // this expensive recursive detaching to then re-attach everything on
        // the very next operation.
        oldPropsAnimated && oldPropsAnimated.__detach();
      }
    }

    _updateFromNative(props) {
      this._component.setNativeProps(props);
    }

    _attachPropUpdater() {
      const viewTag = (0, _reactNative.findNodeHandle)(this);
      NODE_MAPPING.set(viewTag, this);

      if (NODE_MAPPING.size === 1) {
        _ReanimatedEventEmitter.default.addListener('onReanimatedPropsChange', listener);
      }
    }

    _detachPropUpdater() {
      const viewTag = (0, _reactNative.findNodeHandle)(this);
      NODE_MAPPING.delete(viewTag);

      if (NODE_MAPPING.size === 0) {
        _ReanimatedEventEmitter.default.removeAllListeners('onReanimatedPropsChange');
      }
    }

    componentDidUpdate(prevProps) {
      this._attachProps(this.props);

      this._reattachNativeEvents(prevProps);

      this._propsAnimated.setNativeView(this._component);
    }

    _filterNonAnimatedStyle(inputStyle) {
      const style = {};

      for (const key in inputStyle) {
        const value = inputStyle[key];

        if (key !== 'transform') {
          if (value instanceof _AnimatedValue.default) {
            style[key] = value._startingValue;
          } else if (!(value instanceof _AnimatedNode.default)) {
            style[key] = value;
          }
        }
      }

      return style;
    }

    _filterNonAnimatedProps(inputProps) {
      const props = {};

      for (const key in inputProps) {
        const value = inputProps[key];

        if (key === 'style') {
          props[key] = this._filterNonAnimatedStyle(_reactNative.StyleSheet.flatten(value));
        } else if (value instanceof _AnimatedEvent.default) {
          // we cannot filter out event listeners completely as some components
          // rely on having a callback registered in order to generate events
          // alltogether. Therefore we provide a dummy callback here to allow
          // native event dispatcher to hijack events.
          props[key] = dummyListener;
        } else if (value instanceof _AnimatedValue.default) {
          props[key] = value._startingValue;
        } else if (!(value instanceof _AnimatedNode.default)) {
          props[key] = value;
        }
      }

      return props;
    }

    render() {
      const props = this._filterNonAnimatedProps(this.props);

      const platformProps = _reactNative.Platform.select({
        web: {},
        default: {
          collapsable: false
        }
      });

      return /*#__PURE__*/_react.default.createElement(Component, _extends({}, props, {
        ref: this._setComponentRef
      }, platformProps));
    } // A third party library can use getNode()
    // to get the node reference of the decorated component


    getNode() {
      return this._component;
    }

  }

  AnimatedComponent.displayName = "AnimatedComponent(".concat(Component.displayName || Component.name || 'Component', ")");
  return AnimatedComponent;
}
//# sourceMappingURL=createAnimatedComponent.js.map