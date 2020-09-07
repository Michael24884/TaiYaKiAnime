"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimatedEvent = createAnimatedEvent;
exports.default = void 0;

var _reactNative = require("react-native");

var _ReanimatedModule = _interopRequireDefault(require("../ReanimatedModule"));

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

var _AnimatedValue = _interopRequireDefault(require("./AnimatedValue"));

var _AnimatedAlways = require("./AnimatedAlways");

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _createEventObjectProxyPolyfill = _interopRequireDefault(require("./createEventObjectProxyPolyfill"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function sanitizeArgMapping(argMapping) {
  // Find animated values in `argMapping` and create an array representing their
  // key path inside the `nativeEvent` object. Ex.: ['contentOffset', 'x'].
  const eventMappings = [];
  const alwaysNodes = [];

  const getNode = node => {
    if (_reactNative.Platform.OS === 'web' || _reactNative.Platform.OS === 'windows' || _reactNative.Platform.OS === 'macos') {
      return node;
    }

    return node.__nodeID;
  };

  const traverse = (value, path) => {
    if (value instanceof _AnimatedValue.default) {
      eventMappings.push(path.concat(getNode(value)));
    } else if (typeof value === 'object' && value.__val) {
      eventMappings.push(path.concat(getNode(value.__val)));
    } else if (typeof value === 'function') {
      const node = new _AnimatedValue.default(0);
      alwaysNodes.push((0, _AnimatedAlways.createAnimatedAlways)(value(node)));
      eventMappings.push(path.concat(getNode(node)));
    } else if (typeof value === 'object') {
      for (const key in value) {
        traverse(value[key], path.concat(key));
      }
    }
  };

  (0, _invariant.default)(argMapping[0] && argMapping[0].nativeEvent, 'Native driven events only support animated values contained inside `nativeEvent`.'); // Assume that the event containing `nativeEvent` is always the first argument.

  const ev = argMapping[0].nativeEvent;

  if (typeof ev === 'object') {
    traverse(ev, []);
  } else if (typeof ev === 'function') {
    const proxyHandler = {
      get: function get(target, name) {
        if (name === '__isProxy') {
          return true;
        }

        if (!target[name] && name !== '__val') {
          target[name] = new Proxy({}, proxyHandler);
        }

        return target[name];
      },
      set: function set(target, prop, value) {
        if (prop === '__val') {
          target[prop] = value;
          return true;
        }

        return false;
      }
    };
    const proxy = typeof Proxy === 'function' ? new Proxy({}, proxyHandler) : (0, _createEventObjectProxyPolyfill.default)();
    alwaysNodes.push((0, _AnimatedAlways.createAnimatedAlways)(ev(proxy)));
    traverse(proxy, []);
  }

  return {
    eventMappings,
    alwaysNodes
  };
}

class AnimatedEvent extends _AnimatedNode.default {
  constructor(argMapping, config = {}) {
    const {
      eventMappings,
      alwaysNodes
    } = sanitizeArgMapping(argMapping);
    super({
      type: 'event',
      argMapping: eventMappings
    });

    _defineProperty(this, "__isNative", true);

    this._alwaysNodes = alwaysNodes;
  }

  toString() {
    return "AnimatedEvent, id: ".concat(this.__nodeID);
  } // The below field is a temporary workaround to make AnimatedEvent object be recognized
  // as Animated.event event callback and therefore filtered out from being send over the
  // bridge which was causing the object to be frozen in JS.


  attachEvent(viewRef, eventName) {
    for (let i = 0; i < this._alwaysNodes.length; i++) {
      this._alwaysNodes[i].__attach();
    }

    this.__attach();

    const viewTag = (0, _reactNative.findNodeHandle)(viewRef);

    _ReanimatedModule.default.attachEvent(viewTag, eventName, this.__nodeID);
  }

  __onEvaluate() {
    return 0;
  }

  detachEvent(viewRef, eventName) {
    for (let i = 0; i < this._alwaysNodes.length; i++) {
      this._alwaysNodes[i].isNativelyInitialized() && this._alwaysNodes[i].__detach();
    }

    const viewTag = (0, _reactNative.findNodeHandle)(viewRef);

    _ReanimatedModule.default.detachEvent(viewTag, eventName, this.__nodeID);

    this.__detach();
  }

}

exports.default = AnimatedEvent;

function createAnimatedEvent(argMapping, config) {
  return new AnimatedEvent(argMapping, config);
}
//# sourceMappingURL=AnimatedEvent.js.map