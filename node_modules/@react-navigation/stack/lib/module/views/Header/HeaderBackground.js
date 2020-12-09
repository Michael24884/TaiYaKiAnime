function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import { Animated, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
export default function HeaderBackground({
  style,
  ...rest
}) {
  const {
    colors
  } = useTheme();
  return /*#__PURE__*/React.createElement(Animated.View, _extends({
    style: [styles.container, {
      backgroundColor: colors.card,
      borderBottomColor: colors.border,
      shadowColor: colors.border
    }, style]
  }, rest));
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      android: {
        elevation: 4
      },
      ios: {
        shadowOpacity: 0.85,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: StyleSheet.hairlineWidth
        }
      },
      default: {
        borderBottomWidth: StyleSheet.hairlineWidth
      }
    })
  }
});
//# sourceMappingURL=HeaderBackground.js.map