"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _base = require("../base");

var _InternalAnimatedValue = _interopRequireDefault(require("../core/InternalAnimatedValue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MAX_STEPS_MS = 64;

function spring(clock, state, config) {
  const lastTime = (0, _base.cond)(state.time, state.time, clock);
  const deltaTime = (0, _base.min)((0, _base.sub)(clock, lastTime), MAX_STEPS_MS);
  const c = config.damping;
  const m = config.mass;
  const k = config.stiffness;
  const v0 = (0, _base.multiply)(-1, state.velocity);
  const x0 = (0, _base.sub)(config.toValue, state.position);
  const zeta = (0, _base.divide)(c, (0, _base.multiply)(2, (0, _base.sqrt)((0, _base.multiply)(k, m)))); // damping ratio

  const omega0 = (0, _base.sqrt)((0, _base.divide)(k, m)); // undamped angular frequency of the oscillator (rad/ms)

  const omega1 = (0, _base.multiply)(omega0, (0, _base.sqrt)((0, _base.sub)(1, (0, _base.multiply)(zeta, zeta)))); // exponential decay

  const t = (0, _base.divide)(deltaTime, 1000); // in seconds

  const sin1 = (0, _base.sin)((0, _base.multiply)(omega1, t));
  const cos1 = (0, _base.cos)((0, _base.multiply)(omega1, t)); // under damped

  const underDampedEnvelope = (0, _base.exp)((0, _base.multiply)(-1, zeta, omega0, t));
  const underDampedFrag1 = (0, _base.multiply)(underDampedEnvelope, (0, _base.add)((0, _base.multiply)(sin1, (0, _base.divide)((0, _base.add)(v0, (0, _base.multiply)(zeta, omega0, x0)), omega1)), (0, _base.multiply)(x0, cos1)));
  const underDampedPosition = (0, _base.sub)(config.toValue, underDampedFrag1); // This looks crazy -- it's actually just the derivative of the oscillation function

  const underDampedVelocity = (0, _base.sub)((0, _base.multiply)(zeta, omega0, underDampedFrag1), (0, _base.multiply)(underDampedEnvelope, (0, _base.sub)((0, _base.multiply)(cos1, (0, _base.add)(v0, (0, _base.multiply)(zeta, omega0, x0))), (0, _base.multiply)(omega1, x0, sin1)))); // critically damped

  const criticallyDampedEnvelope = (0, _base.exp)((0, _base.multiply)(-1, omega0, t));
  const criticallyDampedPosition = (0, _base.sub)(config.toValue, (0, _base.multiply)(criticallyDampedEnvelope, (0, _base.add)(x0, (0, _base.multiply)((0, _base.add)(v0, (0, _base.multiply)(omega0, x0)), t))));
  const criticallyDampedVelocity = (0, _base.multiply)(criticallyDampedEnvelope, (0, _base.add)((0, _base.multiply)(v0, (0, _base.sub)((0, _base.multiply)(t, omega0), 1)), (0, _base.multiply)(t, x0, omega0, omega0))); // conditions for stopping the spring animations

  const prevPosition = state.prevPosition ? state.prevPosition : new _InternalAnimatedValue.default(0);
  const isOvershooting = (0, _base.cond)((0, _base.and)(config.overshootClamping, (0, _base.neq)(config.stiffness, 0)), (0, _base.cond)((0, _base.lessThan)(prevPosition, config.toValue), (0, _base.greaterThan)(state.position, config.toValue), (0, _base.lessThan)(state.position, config.toValue)));
  const isVelocity = (0, _base.lessThan)((0, _base.abs)(state.velocity), config.restSpeedThreshold);
  const isDisplacement = (0, _base.or)((0, _base.eq)(config.stiffness, 0), (0, _base.lessThan)((0, _base.abs)((0, _base.sub)(config.toValue, state.position)), config.restDisplacementThreshold));
  return (0, _base.block)([(0, _base.set)(prevPosition, state.position), (0, _base.cond)((0, _base.lessThan)(zeta, 1), [(0, _base.set)(state.position, underDampedPosition), (0, _base.set)(state.velocity, underDampedVelocity)], [(0, _base.set)(state.position, criticallyDampedPosition), (0, _base.set)(state.velocity, criticallyDampedVelocity)]), (0, _base.set)(state.time, clock), (0, _base.cond)((0, _base.or)(isOvershooting, (0, _base.and)(isVelocity, isDisplacement)), [(0, _base.cond)((0, _base.neq)(config.stiffness, 0), [(0, _base.set)(state.velocity, 0), (0, _base.set)(state.position, config.toValue)]), (0, _base.set)(state.finished, 1)])]);
}

const procSpring = (0, _base.proc)((finished, velocity, position, time, prevPosition, toValue, damping, mass, stiffness, overshootClamping, restSpeedThreshold, restDisplacementThreshold, clock) => spring(clock, {
  finished,
  velocity,
  position,
  time,
  // @ts-ignore
  prevPosition
}, {
  toValue,
  damping,
  mass,
  stiffness,
  overshootClamping,
  restDisplacementThreshold,
  restSpeedThreshold
}));

var _default = (clock, {
  finished,
  velocity,
  position,
  time,
  // @ts-ignore
  prevPosition
}, {
  toValue,
  damping,
  mass,
  stiffness,
  overshootClamping,
  restDisplacementThreshold,
  restSpeedThreshold
}) => procSpring(finished, velocity, position, time, prevPosition, toValue, damping, mass, stiffness, overshootClamping, restSpeedThreshold, restDisplacementThreshold, clock);

exports.default = _default;
//# sourceMappingURL=spring.js.map