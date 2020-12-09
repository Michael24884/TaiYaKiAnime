function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Platform } from 'react-native';
import { Link, useTheme } from '@react-navigation/native';
import Color from 'color';
import TabBarIcon from './TabBarIcon';
export default function BottomTabBarItem({
  focused,
  route,
  label,
  icon,
  badge,
  badgeStyle,
  to,
  button = ({
    children,
    style,
    onPress,
    to,
    accessibilityRole,
    ...rest
  }) => {
    if (Platform.OS === 'web' && to) {
      // React Native Web doesn't forward `onClick` if we use `TouchableWithoutFeedback`.
      // We need to use `onClick` to be able to prevent default browser handling of links.
      return /*#__PURE__*/React.createElement(Link, _extends({}, rest, {
        to: to,
        style: [styles.button, style],
        onPress: e => {
          if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && ( // ignore clicks with modifier keys
          e.button == null || e.button === 0) // ignore everything but left clicks
          ) {
              e.preventDefault();
              onPress === null || onPress === void 0 ? void 0 : onPress(e);
            }
        }
      }), children);
    } else {
      return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, _extends({}, rest, {
        accessibilityRole: accessibilityRole,
        onPress: onPress
      }), /*#__PURE__*/React.createElement(View, {
        style: style
      }, children));
    }
  },
  accessibilityLabel,
  testID,
  onPress,
  onLongPress,
  horizontal,
  activeTintColor: customActiveTintColor,
  inactiveTintColor: customInactiveTintColor,
  activeBackgroundColor = 'transparent',
  inactiveBackgroundColor = 'transparent',
  showLabel = true,
  allowFontScaling,
  labelStyle,
  iconStyle,
  style
}) {
  const {
    colors
  } = useTheme();
  const activeTintColor = customActiveTintColor === undefined ? colors.primary : customActiveTintColor;
  const inactiveTintColor = customInactiveTintColor === undefined ? Color(colors.text).mix(Color(colors.card), 0.5).hex() : customInactiveTintColor;

  const renderLabel = ({
    focused
  }) => {
    if (showLabel === false) {
      return null;
    }

    const color = focused ? activeTintColor : inactiveTintColor;

    if (typeof label === 'string') {
      return /*#__PURE__*/React.createElement(Text, {
        numberOfLines: 1,
        style: [styles.label, {
          color
        }, horizontal ? styles.labelBeside : styles.labelBeneath, labelStyle],
        allowFontScaling: allowFontScaling
      }, label);
    }

    return label({
      focused,
      color,
      position: horizontal ? 'beside-icon' : 'below-icon'
    });
  };

  const renderIcon = ({
    focused
  }) => {
    if (icon === undefined) {
      return null;
    }

    const activeOpacity = focused ? 1 : 0;
    const inactiveOpacity = focused ? 0 : 1;
    return /*#__PURE__*/React.createElement(TabBarIcon, {
      route: route,
      horizontal: horizontal,
      badge: badge,
      badgeStyle: badgeStyle,
      activeOpacity: activeOpacity,
      inactiveOpacity: inactiveOpacity,
      activeTintColor: activeTintColor,
      inactiveTintColor: inactiveTintColor,
      renderIcon: icon,
      style: iconStyle
    });
  };

  const scene = {
    route,
    focused
  };
  const backgroundColor = focused ? activeBackgroundColor : inactiveBackgroundColor;
  return button({
    to,
    onPress,
    onLongPress,
    testID,
    accessibilityLabel,
    accessibilityRole: 'button',
    accessibilityState: {
      selected: focused
    },
    // @ts-expect-error: keep for compatibility with older React Native versions
    accessibilityStates: focused ? ['selected'] : [],
    style: [styles.tab, {
      backgroundColor
    }, horizontal ? styles.tabLandscape : styles.tabPortrait, style],
    children: /*#__PURE__*/React.createElement(React.Fragment, null, renderIcon(scene), renderLabel(scene))
  });
}
const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center'
  },
  tabPortrait: {
    justifyContent: 'flex-end',
    flexDirection: 'column'
  },
  tabLandscape: {
    justifyContent: 'center',
    flexDirection: 'row'
  },
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  labelBeneath: {
    fontSize: 10
  },
  labelBeside: {
    fontSize: 13,
    marginLeft: 20,
    marginTop: 3
  },
  button: {
    display: 'flex'
  }
});
//# sourceMappingURL=BottomTabItem.js.map