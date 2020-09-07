"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _base = require("../base");

const internalTiming = (0, _base.proc)(function (clock, time, frameTime, position, finished, toValue, duration, nextProgress, progress, newFrameTime) {
  const state = {
    time,
    finished,
    frameTime,
    position
  };
  const config = {
    duration,
    toValue
  };
  const distanceLeft = (0, _base.sub)(config.toValue, state.position);
  const fullDistance = (0, _base.divide)(distanceLeft, (0, _base.sub)(1, progress));
  const startPosition = (0, _base.sub)(config.toValue, fullDistance);
  const nextPosition = (0, _base.add)(startPosition, (0, _base.multiply)(fullDistance, nextProgress));
  return (0, _base.block)([(0, _base.cond)((0, _base.greaterOrEq)(newFrameTime, config.duration), [(0, _base.set)(state.position, config.toValue), (0, _base.set)(state.finished, 1)], (0, _base.set)(state.position, nextPosition)), (0, _base.set)(state.frameTime, newFrameTime), (0, _base.set)(state.time, clock)]);
});

function _default(clock, state, config) {
  if (config.duration === 0) {
    // when duration is zero we end the timing immediately
    return (0, _base.block)([(0, _base.set)(state.position, config.toValue), (0, _base.set)(state.finished, 1)]);
  }

  const lastTime = (0, _base.cond)(state.time, state.time, clock);
  const newFrameTime = (0, _base.add)(state.frameTime, (0, _base.sub)(clock, lastTime));
  const nextProgress = config.easing((0, _base.divide)(newFrameTime, config.duration));
  const progress = config.easing((0, _base.divide)(state.frameTime, config.duration));
  return internalTiming(clock, state.time, state.frameTime, state.position, state.finished, config.toValue, config.duration, nextProgress, progress, newFrameTime);
}
//# sourceMappingURL=timing.js.map