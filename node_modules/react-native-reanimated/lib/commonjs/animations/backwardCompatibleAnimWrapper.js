"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = backwardsCompatibleAnimWrapper;

var _base = require("../base");

var _AnimatedClock = _interopRequireDefault(require("../core/AnimatedClock"));

var _evaluateOnce = require("../derived/evaluateOnce");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createOldAnimationObject(node, animationStateDefaults, value, config) {
  const newClock = new _AnimatedClock.default();
  const currentState = animationStateDefaults();
  let alwaysNode;
  let isStarted = false;
  let isDone = false;
  let wasStopped = false;
  let animationCallback;
  const animation = {
    start: currentAnimationCallback => {
      animationCallback = currentAnimationCallback;

      if (isStarted) {
        animationCallback && animationCallback({
          finished: false
        });
        return;
      }

      if (isDone) {
        console.warn('Animation has been finished before'); // inconsistent with React Native

        return;
      }

      if (!value.isNativelyInitialized()) {
        return;
      }

      isStarted = true;
      (0, _evaluateOnce.evaluateOnce)((0, _base.set)(currentState.position, value), currentState.position, () => {
        alwaysNode = (0, _base.always)((0, _base.set)(value, (0, _base.block)([(0, _base.cond)((0, _base.clockRunning)(newClock), 0, (0, _base.startClock)(newClock)), node(newClock, currentState, config), (0, _base.cond)(currentState.finished, [(0, _base.call)([], () => {
          isStarted = false;

          if (!wasStopped) {
            isDone = true;
          }

          value.__detachAnimation(animation);

          isDone = true;

          if (!wasStopped) {
            wasStopped = false;
          }
        }), (0, _base.stopClock)(newClock)]), currentState.position])));

        value.__attachAnimation(animation);

        alwaysNode.__addChild(value);
      });
    },
    __detach: () => {
      animationCallback && animationCallback({
        finished: isDone
      });
      animationCallback = null;
      value.__initialized && alwaysNode.__removeChild(value);
    },
    stop: () => {
      if (isDone) {
        console.warn('Calling stop has no effect as the animation has already completed');
        return;
      }

      if (!isStarted) {
        console.warn("Calling stop has no effect as the animation hasn't been started");
        return;
      }

      wasStopped = true;
      (0, _evaluateOnce.evaluateOnce)((0, _base.set)(currentState.finished, 1), currentState.finished);
    },
    __stopImmediately_testOnly: result => {
      animation.stop();
      isDone = result;

      value.__detachAnimation(animation);
    }
  };
  return animation;
}
/**
 * Depending on the arguments list we either return animation node or return an
 * animation object that is compatible with the original Animated API
 */


function backwardsCompatibleAnimWrapper(node, animationStateDefaults) {
  return (clock, state, config) => {
    if (config !== undefined) {
      return node(clock, state, config);
    }

    return createOldAnimationObject(node, animationStateDefaults, clock, state);
  };
}
//# sourceMappingURL=backwardCompatibleAnimWrapper.js.map