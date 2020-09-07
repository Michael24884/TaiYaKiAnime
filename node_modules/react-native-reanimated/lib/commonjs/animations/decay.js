"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _base = require("../base");

const VELOCITY_EPS = 5;

function decay(clock, state, config) {
  const lastTime = (0, _base.cond)(state.time, state.time, clock);
  const deltaTime = (0, _base.sub)(clock, lastTime); // v0 = v / 1000
  // v = v0 * powf(deceleration, dt);
  // v = v * 1000;
  // x0 = x;
  // x = x0 + v0 * deceleration * (1 - powf(deceleration, dt)) / (1 - deceleration)

  const kv = (0, _base.pow)(config.deceleration, deltaTime);
  const kx = (0, _base.divide)((0, _base.multiply)(config.deceleration, (0, _base.sub)(1, kv)), (0, _base.sub)(1, config.deceleration));
  const v0 = (0, _base.divide)(state.velocity, 1000);
  const v = (0, _base.multiply)(v0, kv, 1000);
  const x = (0, _base.add)(state.position, (0, _base.multiply)(v0, kx));
  return (0, _base.block)([(0, _base.set)(state.position, x), (0, _base.set)(state.velocity, v), (0, _base.set)(state.time, clock), (0, _base.cond)((0, _base.lessThan)((0, _base.abs)(v), VELOCITY_EPS), (0, _base.set)(state.finished, 1))]);
}

const procDecay = (0, _base.proc)((clock, time, velocity, position, finished, deceleration) => decay(clock, {
  time,
  velocity,
  position,
  finished
}, {
  deceleration
}));

var _default = (clock, {
  time,
  velocity,
  position,
  finished
}, {
  deceleration
}) => procDecay(clock, time, velocity, position, finished, deceleration);

exports.default = _default;
//# sourceMappingURL=decay.js.map