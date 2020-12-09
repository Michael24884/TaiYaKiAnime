"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MaybeScreen = exports.MaybeScreenContainer = exports.shouldUseActivityState = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _Screens;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

let Screens;

try {
  Screens = require('react-native-screens');
} catch (e) {// Ignore
} // The web implementation in react-native-screens seems buggy.
// The view doesn't become visible after coming back in some cases.
// So we use our custom implementation.


class WebScreen extends React.Component {
  render() {
    const {
      active,
      style,
      ...rest
    } = this.props;
    return /*#__PURE__*/React.createElement(_reactNative.View // @ts-expect-error: hidden exists on web, but not in React Native
    , _extends({
      hidden: !active,
      style: [style, {
        display: active ? 'flex' : 'none'
      }]
    }, rest));
  }

}

const AnimatedWebScreen = _reactNative.Animated.createAnimatedComponent(WebScreen); // @ts-ignore


const shouldUseActivityState = (_Screens = Screens) === null || _Screens === void 0 ? void 0 : _Screens.shouldUseActivityState;
exports.shouldUseActivityState = shouldUseActivityState;

const MaybeScreenContainer = ({
  enabled,
  ...rest
}) => {
  var _Screens2;

  if (enabled && _reactNative.Platform.OS !== 'web' && ((_Screens2 = Screens) === null || _Screens2 === void 0 ? void 0 : _Screens2.screensEnabled())) {
    return (
      /*#__PURE__*/
      // @ts-ignore
      React.createElement(Screens.ScreenContainer, _extends({
        enabled: enabled
      }, rest))
    );
  }

  return /*#__PURE__*/React.createElement(_reactNative.View, rest);
};

exports.MaybeScreenContainer = MaybeScreenContainer;

const MaybeScreen = ({
  enabled,
  active,
  ...rest
}) => {
  var _Screens3;

  if (enabled && _reactNative.Platform.OS === 'web') {
    return /*#__PURE__*/React.createElement(AnimatedWebScreen, _extends({
      active: active
    }, rest));
  }

  if (enabled && ((_Screens3 = Screens) === null || _Screens3 === void 0 ? void 0 : _Screens3.screensEnabled())) {
    if (shouldUseActivityState) {
      return (
        /*#__PURE__*/
        // @ts-expect-error: there was an `active` prop and no `activityState` in older version and stackPresentation was required
        React.createElement(Screens.Screen, _extends({
          enabled: enabled,
          activityState: active
        }, rest))
      );
    } else {
      return (
        /*#__PURE__*/
        // @ts-expect-error: there was an `active` prop and no `activityState` in older version and stackPresentation was required
        React.createElement(Screens.Screen, _extends({
          enabled: enabled,
          active: active
        }, rest))
      );
    }
  }

  return /*#__PURE__*/React.createElement(_reactNative.View, rest);
};

exports.MaybeScreen = MaybeScreen;
//# sourceMappingURL=Screens.js.map