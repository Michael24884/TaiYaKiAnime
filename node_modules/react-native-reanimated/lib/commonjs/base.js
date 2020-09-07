"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  cond: true,
  set: true,
  startClock: true,
  stopClock: true,
  clockRunning: true,
  debug: true,
  call: true,
  event: true,
  always: true,
  concat: true,
  block: true,
  adapt: true,
  proc: true
};
Object.defineProperty(exports, "cond", {
  enumerable: true,
  get: function get() {
    return _AnimatedCond.createAnimatedCond;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function get() {
    return _AnimatedSet.createAnimatedSet;
  }
});
Object.defineProperty(exports, "startClock", {
  enumerable: true,
  get: function get() {
    return _AnimatedStartClock.createAnimatedStartClock;
  }
});
Object.defineProperty(exports, "stopClock", {
  enumerable: true,
  get: function get() {
    return _AnimatedStopClock.createAnimatedStopClock;
  }
});
Object.defineProperty(exports, "clockRunning", {
  enumerable: true,
  get: function get() {
    return _AnimatedClockTest.createAnimatedClockTest;
  }
});
Object.defineProperty(exports, "debug", {
  enumerable: true,
  get: function get() {
    return _AnimatedDebug.createAnimatedDebug;
  }
});
Object.defineProperty(exports, "call", {
  enumerable: true,
  get: function get() {
    return _AnimatedCall.createAnimatedCall;
  }
});
Object.defineProperty(exports, "event", {
  enumerable: true,
  get: function get() {
    return _AnimatedEvent.createAnimatedEvent;
  }
});
Object.defineProperty(exports, "always", {
  enumerable: true,
  get: function get() {
    return _AnimatedAlways.createAnimatedAlways;
  }
});
Object.defineProperty(exports, "concat", {
  enumerable: true,
  get: function get() {
    return _AnimatedConcat.createAnimatedConcat;
  }
});
Object.defineProperty(exports, "block", {
  enumerable: true,
  get: function get() {
    return _AnimatedBlock.createAnimatedBlock;
  }
});
Object.defineProperty(exports, "adapt", {
  enumerable: true,
  get: function get() {
    return _AnimatedBlock.adapt;
  }
});
Object.defineProperty(exports, "proc", {
  enumerable: true,
  get: function get() {
    return _AnimatedFunction.createAnimatedFunction;
  }
});

var _AnimatedCond = require("./core/AnimatedCond");

var _AnimatedSet = require("./core/AnimatedSet");

var _AnimatedStartClock = require("./core/AnimatedStartClock");

var _AnimatedStopClock = require("./core/AnimatedStopClock");

var _AnimatedClockTest = require("./core/AnimatedClockTest");

var _AnimatedDebug = require("./core/AnimatedDebug");

var _AnimatedCall = require("./core/AnimatedCall");

var _AnimatedEvent = require("./core/AnimatedEvent");

var _AnimatedAlways = require("./core/AnimatedAlways");

var _AnimatedConcat = require("./core/AnimatedConcat");

var _AnimatedBlock = require("./core/AnimatedBlock");

var _AnimatedFunction = require("./core/AnimatedFunction");

var _operators = require("./operators");

Object.keys(_operators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _operators[key];
    }
  });
});
//# sourceMappingURL=base.js.map