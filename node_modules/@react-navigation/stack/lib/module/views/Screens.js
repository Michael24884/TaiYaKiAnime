var _Screens;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import { Animated, View, Platform } from 'react-native';
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
    return /*#__PURE__*/React.createElement(View // @ts-expect-error: hidden exists on web, but not in React Native
    , _extends({
      hidden: !active,
      style: [style, {
        display: active ? 'flex' : 'none'
      }]
    }, rest));
  }

}

const AnimatedWebScreen = Animated.createAnimatedComponent(WebScreen); // @ts-ignore

export const shouldUseActivityState = (_Screens = Screens) === null || _Screens === void 0 ? void 0 : _Screens.shouldUseActivityState;
export const MaybeScreenContainer = ({
  enabled,
  ...rest
}) => {
  var _Screens2;

  if (enabled && Platform.OS !== 'web' && ((_Screens2 = Screens) === null || _Screens2 === void 0 ? void 0 : _Screens2.screensEnabled())) {
    return (
      /*#__PURE__*/
      // @ts-ignore
      React.createElement(Screens.ScreenContainer, _extends({
        enabled: enabled
      }, rest))
    );
  }

  return /*#__PURE__*/React.createElement(View, rest);
};
export const MaybeScreen = ({
  enabled,
  active,
  ...rest
}) => {
  var _Screens3;

  if (enabled && Platform.OS === 'web') {
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

  return /*#__PURE__*/React.createElement(View, rest);
};
//# sourceMappingURL=Screens.js.map