function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import { cond, sub, divide, multiply, add, pow, lessOrEq, and, greaterThan } from './../base';
import AnimatedValue from './../core/InternalAnimatedValue';

function stiffnessFromOrigamiValue(oValue) {
  return (oValue - 30) * 3.62 + 194;
}

function dampingFromOrigamiValue(oValue) {
  return (oValue - 8) * 3 + 25;
}

function stiffnessFromOrigamiNode(oValue) {
  return add(multiply(sub(oValue, 30), 3.62), 194);
}

function dampingFromOrigamiNode(oValue) {
  return add(multiply(sub(oValue, 8), 3), 25);
}

function makeConfigFromOrigamiTensionAndFriction(prevConfig) {
  const {
    tension,
    friction
  } = prevConfig,
        rest = _objectWithoutProperties(prevConfig, ["tension", "friction"]);

  return _objectSpread(_objectSpread({}, rest), {}, {
    stiffness: typeof tension === 'number' ? stiffnessFromOrigamiValue(tension) : stiffnessFromOrigamiNode(tension),
    damping: typeof friction === 'number' ? dampingFromOrigamiValue(friction) : dampingFromOrigamiNode(friction)
  });
}

function makeConfigFromBouncinessAndSpeed(prevConfig) {
  const {
    bounciness,
    speed
  } = prevConfig,
        rest = _objectWithoutProperties(prevConfig, ["bounciness", "speed"]);

  if (typeof bounciness === 'number' && typeof speed === 'number') {
    return fromBouncinessAndSpeedNumbers(bounciness, speed, rest);
  }

  return fromBouncinessAndSpeedNodes(bounciness, speed, rest);
}

function fromBouncinessAndSpeedNodes(bounciness, speed, rest) {
  function normalize(value, startValue, endValue) {
    return divide(sub(value, startValue), sub(endValue, startValue));
  }

  function projectNormal(n, start, end) {
    return add(start, multiply(n, sub(end, start)));
  }

  function linearInterpolation(t, start, end) {
    return add(multiply(t, end), multiply(sub(1, t), start));
  }

  function quadraticOutInterpolation(t, start, end) {
    return linearInterpolation(sub(multiply(2, t), multiply(t, t)), start, end);
  }

  function b3Friction1(x) {
    return add(sub(multiply(0.0007, pow(x, 3)), multiply(0.031, pow(x, 2))), multiply(0.64, x), 1.28);
  }

  function b3Friction2(x) {
    return add(sub(multiply(0.000044, pow(x, 3)), multiply(0.006, pow(x, 2))), multiply(0.36, x), 2);
  }

  function b3Friction3(x) {
    return add(sub(multiply(0.00000045, pow(x, 3)), multiply(0.000332, pow(x, 2))), multiply(0.1078, x), 5.84);
  }

  function b3Nobounce(tension) {
    return cond(lessOrEq(tension, 18), b3Friction1(tension), cond(and(greaterThan(tension, 18), lessOrEq(tension, 44)), b3Friction2(tension), b3Friction3(tension)));
  }

  let b = normalize(divide(bounciness, 1.7), 0, 20);
  b = projectNormal(b, 0, 0.8);
  const s = normalize(divide(speed, 1.7), 0, 20);
  const bouncyTension = projectNormal(s, 0.5, 200);
  const bouncyFriction = quadraticOutInterpolation(b, b3Nobounce(bouncyTension), 0.01);
  return _objectSpread(_objectSpread({}, rest), {}, {
    stiffness: stiffnessFromOrigamiNode(bouncyTension),
    damping: dampingFromOrigamiNode(bouncyFriction)
  });
}

function fromBouncinessAndSpeedNumbers(bounciness, speed, rest) {
  function normalize(value, startValue, endValue) {
    return (value - startValue) / (endValue - startValue);
  }

  function projectNormal(n, start, end) {
    return start + n * (end - start);
  }

  function linearInterpolation(t, start, end) {
    return t * end + (1 - t) * start;
  }

  function quadraticOutInterpolation(t, start, end) {
    return linearInterpolation(2 * t - t * t, start, end);
  }

  function b3Friction1(x) {
    return 0.0007 * Math.pow(x, 3) - 0.031 * Math.pow(x, 2) + 0.64 * x + 1.28;
  }

  function b3Friction2(x) {
    return 0.000044 * Math.pow(x, 3) - 0.006 * Math.pow(x, 2) + 0.36 * x + 2;
  }

  function b3Friction3(x) {
    return 0.00000045 * Math.pow(x, 3) - 0.000332 * Math.pow(x, 2) + 0.1078 * x + 5.84;
  }

  function b3Nobounce(tension) {
    if (tension <= 18) {
      return b3Friction1(tension);
    } else if (tension > 18 && tension <= 44) {
      return b3Friction2(tension);
    } else {
      return b3Friction3(tension);
    }
  }

  let b = normalize(bounciness / 1.7, 0, 20);
  b = projectNormal(b, 0, 0.8);
  const s = normalize(speed / 1.7, 0, 20);
  const bouncyTension = projectNormal(s, 0.5, 200);
  const bouncyFriction = quadraticOutInterpolation(b, b3Nobounce(bouncyTension), 0.01);
  return _objectSpread(_objectSpread({}, rest), {}, {
    stiffness: stiffnessFromOrigamiValue(bouncyTension),
    damping: dampingFromOrigamiValue(bouncyFriction)
  });
}

function makeDefaultConfig() {
  return {
    stiffness: new AnimatedValue(100),
    mass: new AnimatedValue(1),
    damping: new AnimatedValue(10),
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new AnimatedValue(0)
  };
}

export default {
  makeDefaultConfig,
  makeConfigFromBouncinessAndSpeed,
  makeConfigFromOrigamiTensionAndFriction
};
//# sourceMappingURL=SpringUtils.js.map