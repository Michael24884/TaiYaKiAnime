"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _InternalAnimatedValue = _interopRequireDefault(require("./InternalAnimatedValue"));

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

var _val = require("../val");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AnimatedMainClock extends _InternalAnimatedValue.default {
  constructor() {
    super({
      type: 'MAIN_CLOCK'
    });

    _defineProperty(this, "_frameCallback", void 0);

    _defineProperty(this, "_runFrame", () => {
      this._updateValue(0);

      if (this.__children.length > 0) {
        this._frameCallback = requestAnimationFrame(this._runFrame);
      }
    });
  }

  __onEvaluate() {
    return +new Date();
  }

  __attach() {
    super.__attach();

    if (!this._frameCallback) {
      this._frameCallback = requestAnimationFrame(this._runFrame);
    }
  }

  __detach() {
    if (this._frameCallback) {
      cancelAnimationFrame(this._frameCallback);
      this._frameCallback = null;
    }

    super.__detach();
  }

}

const mainClock = new AnimatedMainClock();

class AnimatedClock extends _AnimatedNode.default {
  constructor() {
    super({
      type: 'clock'
    });

    _defineProperty(this, "_started", void 0);

    _defineProperty(this, "_attached", void 0);
  }

  toString() {
    return "AnimatedClock, id: ".concat(this.__nodeID);
  }

  __onEvaluate() {
    return (0, _val.val)(mainClock);
  }

  __attach() {
    super.__attach();

    if (this._started && !this._attached) {
      mainClock.__addChild(this);
    }

    this._attached = true;
  }

  __detach() {
    if (this._started && this._attached) {
      mainClock.__removeChild(this);
    }

    this._attached = false;

    super.__detach();
  }

  start() {
    if (!this._started && this._attached) {
      mainClock.__addChild(this);
    }

    this._started = true;
  }

  stop() {
    if (this._started && this._attached) {
      mainClock.__removeChild(this);
    }

    this._started = false;
  }

  isStarted() {
    return this._started;
  }

}

exports.default = AnimatedClock;
//# sourceMappingURL=AnimatedClock.js.map