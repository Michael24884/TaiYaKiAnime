"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCallID = getCallID;
exports.setCallID = setCallID;
exports.default = void 0;

var _ReanimatedModule = _interopRequireDefault(require("../ReanimatedModule"));

var _reactNative = require("react-native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const UPDATED_NODES = [];
let loopID = 1;
let propUpdatesEnqueued = null;
let nodeCount = 0;
let callID = "";

function getCallID() {
  return callID;
}

function setCallID(nextCallID) {
  callID = nextCallID;
}

function sanitizeConfig(config) {
  if (_reactNative.Platform.OS === 'web' || _reactNative.Platform.OS === 'windows' || _reactNative.Platform.OS === 'macos' || ['undefined', 'string', 'function', 'boolean', 'number'].includes(typeof config)) {
    return config;
  } else if (Array.isArray(config)) {
    return config.map(sanitizeConfig);
  } else if (config instanceof AnimatedNode) {
    return config.__nodeID;
  } else if (typeof config === 'object') {
    const output = {};

    for (const property in config) {
      if (property in config) {
        output[property] = sanitizeConfig(config[property]);
      }
    }

    return output;
  } // unhandled


  return config;
}

function runPropUpdates() {
  const visitedNodes = new Set();

  const findAndUpdateNodes = node => {
    if (!node) {
      console.warn('findAndUpdateNodes was passed a nullish node');
      return;
    }

    if (visitedNodes.has(node)) {
      return;
    } else {
      visitedNodes.add(node);
    }

    if (typeof node.update === 'function') {
      node.update();
    } else {
      const nodes = node.__getChildren();

      if (nodes) {
        for (let i = 0, l = nodes.length; i < l; i++) {
          findAndUpdateNodes(nodes[i]);
        }
      }
    }
  };

  for (let i = 0; i < UPDATED_NODES.length; i++) {
    const node = UPDATED_NODES[i];
    findAndUpdateNodes(node);
  }

  UPDATED_NODES.length = 0; // clear array

  propUpdatesEnqueued = null;
  loopID += 1;
}

class AnimatedNode {
  constructor(nodeConfig, inputNodes) {
    _defineProperty(this, "__nodeID", void 0);

    _defineProperty(this, "__lastLoopID", {
      "": -1
    });

    _defineProperty(this, "__memoizedValue", {
      "": null
    });

    _defineProperty(this, "__children", []);

    this.__nodeID = ++nodeCount;
    this.__nodeConfig = sanitizeConfig(nodeConfig);
    this.__initialized = false;
    this.__inputNodes = inputNodes && inputNodes.filter(node => node instanceof AnimatedNode);
  }

  toString() {
    return "AnimatedNode, id: ".concat(this.__nodeID);
  }

  __attach() {
    this.__nativeInitialize();

    const nodes = this.__inputNodes;

    if (nodes) {
      for (let i = 0, l = nodes.length; i < l; i++) {
        nodes[i].__addChild(this);
      }
    }
  }

  __detach() {
    const nodes = this.__inputNodes;

    if (nodes) {
      for (let i = 0, l = nodes.length; i < l; i++) {
        nodes[i].__removeChild(this);
      }
    }

    this.__nativeTearDown();
  }

  __getValue() {
    if (!(callID in this.__lastLoopID) || this.__lastLoopID[callID] < loopID) {
      this.__lastLoopID[callID] = loopID;

      const result = this.__onEvaluate();

      this.__memoizedValue[callID] = result;
      return result;
    }

    return this.__memoizedValue[callID];
  }

  __forceUpdateCache(newValue) {
    this.__memoizedValue[callID] = newValue;

    this.__markUpdated();
  }

  __dangerouslyRescheduleEvaluate() {
    this.__lastLoopID[callID] = -1;

    this.__markUpdated();
  }

  __markUpdated() {
    UPDATED_NODES.push(this);

    if (!propUpdatesEnqueued) {
      propUpdatesEnqueued = setImmediate(runPropUpdates);
    }
  }

  __nativeInitialize() {
    if (!this.__initialized) {
      _ReanimatedModule.default.createNode(this.__nodeID, _objectSpread({}, this.__nodeConfig));

      this.__initialized = true;
    }
  }

  __nativeTearDown() {
    if (this.__initialized) {
      _ReanimatedModule.default.dropNode(this.__nodeID);

      this.__initialized = false;
    }
  }

  isNativelyInitialized() {
    return this.__initialized;
  }

  __onEvaluate() {
    throw new Error('Missing implementation of onEvaluate');
  }

  __getProps() {
    return this.__getValue();
  }

  __getChildren() {
    return this.__children;
  }

  __addChild(child) {
    if (this.__children.length === 0) {
      this.__attach();
    }

    this.__children.push(child);

    child.__nativeInitialize();

    if (_ReanimatedModule.default.connectNodes) {
      _ReanimatedModule.default.connectNodes(this.__nodeID, child.__nodeID);
    } else {
      child.__dangerouslyRescheduleEvaluate();
    }
  }

  __removeChild(child) {
    const index = this.__children.indexOf(child);

    if (index === -1) {
      console.warn("Trying to remove a child that doesn't exist");
      return;
    }

    if (_ReanimatedModule.default.disconnectNodes) {
      _ReanimatedModule.default.disconnectNodes(this.__nodeID, child.__nodeID);
    }

    this.__children.splice(index, 1);

    if (this.__children.length === 0) {
      this.__detach();
    }
  }

  _connectAnimatedView(nativeViewTag) {
    if (_ReanimatedModule.default.connectNodeToView) {
      _ReanimatedModule.default.connectNodeToView(this.__nodeID, nativeViewTag);
    } else {
      this.__dangerouslyRescheduleEvaluate();
    }
  }

  _disconnectAnimatedView(nativeViewTag) {
    _ReanimatedModule.default.disconnectNodeFromView(this.__nodeID, nativeViewTag);
  }

}

exports.default = AnimatedNode;
//# sourceMappingURL=AnimatedNode.js.map