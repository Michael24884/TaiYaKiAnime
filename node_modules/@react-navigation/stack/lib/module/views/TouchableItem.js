function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * TouchableItem provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity to handle platform differences.
 *
 * On Android, you can pass the props of TouchableNativeFeedback.
 * On other platforms, you can pass the props of TouchableOpacity.
 */
import * as React from 'react';
import { Platform, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
const ANDROID_VERSION_LOLLIPOP = 21;
export default function TouchableItem({
  borderless = false,
  pressColor = 'rgba(0, 0, 0, .32)',
  style,
  children,
  ...rest
}) {
  /*
   * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
   * therefore only enable it on Android Lollipop and above.
   *
   * All touchables on Android should have the ripple effect according to
   * platform design guidelines.
   * We need to pass the background prop to specify a borderless ripple effect.
   */
  if (Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP) {
    return /*#__PURE__*/React.createElement(TouchableNativeFeedback, _extends({}, rest, {
      useForeground: TouchableNativeFeedback.canUseNativeForeground(),
      background: TouchableNativeFeedback.Ripple(pressColor, borderless)
    }), /*#__PURE__*/React.createElement(View, {
      style: style
    }, React.Children.only(children)));
  } else {
    return /*#__PURE__*/React.createElement(TouchableOpacity, _extends({
      style: style
    }, rest), children);
  }
}
//# sourceMappingURL=TouchableItem.js.map