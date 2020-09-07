function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Image, ScrollView, Text, View } from 'react-native';
import Easing from './Easing';
import AnimatedClock from './core/AnimatedClock';
import AnimatedValue from './core/AnimatedValue';
import AnimatedNode from './core/AnimatedNode';
import AnimatedCode from './core/AnimatedCode';
import * as base from './base';
import * as derived from './derived';
import createAnimatedComponent from './createAnimatedComponent';
import decay from './animations/decay';
import timing from './animations/timing';
import spring from './animations/spring';
import Animation from './animations/Animation';
import { addWhitelistedNativeProps, addWhitelistedUIProps } from './ConfigHelper';
import backwardCompatibleAnimWrapper from './animations/backwardCompatibleAnimWrapper';
import { Transition, Transitioning, createTransitioningComponent } from './Transitioning';
import SpringUtils from './animations/SpringUtils';
import useValue from './useValue';
const decayWrapper = backwardCompatibleAnimWrapper(decay, Animation.decayDefaultState);
const timingWrapper = backwardCompatibleAnimWrapper(timing, Animation.timingDefaultState);
const springWrapper = backwardCompatibleAnimWrapper(spring, Animation.springDefaultState);

const Animated = _objectSpread(_objectSpread(_objectSpread({
  // components
  View: createAnimatedComponent(View),
  Text: createAnimatedComponent(Text),
  Image: createAnimatedComponent(Image),
  ScrollView: createAnimatedComponent(ScrollView),
  Code: AnimatedCode,
  createAnimatedComponent,
  // classes
  Clock: AnimatedClock,
  Value: AnimatedValue,
  Node: AnimatedNode
}, base), derived), {}, {
  // animations
  decay: decayWrapper,
  timing: timingWrapper,
  spring: springWrapper,
  SpringUtils,
  // configuration
  addWhitelistedNativeProps,
  addWhitelistedUIProps,
  // hooks
  useValue
});

export default Animated; // operations

export * from './base';
export * from './derived';
export { Easing, Transitioning, Transition, createTransitioningComponent // classes
, AnimatedClock as Clock, AnimatedValue as Value, AnimatedNode as Node // animations
, decayWrapper as decay, timingWrapper as timing, springWrapper as spring, SpringUtils // hooks
, useValue };
//# sourceMappingURL=Animated.js.map