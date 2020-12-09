import React from 'react';
import { View, Animated, StyleSheet, Platform } from 'react-native';
import { NavigationContext, NavigationRouteContext, CommonActions, useTheme, useLinkBuilder } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';
import BottomTabItem from './BottomTabItem';
import BottomTabBarHeightCallbackContext from '../utils/BottomTabBarHeightCallbackContext';
import useWindowDimensions from '../utils/useWindowDimensions';
import useIsKeyboardShown from '../utils/useIsKeyboardShown';
const DEFAULT_TABBAR_HEIGHT = 49;
const COMPACT_TABBAR_HEIGHT = 32;
const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;
const useNativeDriver = Platform.OS !== 'web';

const shouldUseHorizontalLabels = ({
  state,
  layout,
  dimensions,
  adaptive = true,
  labelPosition,
  tabStyle
}) => {
  if (labelPosition) {
    return labelPosition === 'beside-icon';
  }

  if (!adaptive) {
    return false;
  }

  if (layout.width >= 768) {
    // Screen size matches a tablet
    let maxTabItemWidth = DEFAULT_MAX_TAB_ITEM_WIDTH;
    const flattenedStyle = StyleSheet.flatten(tabStyle);

    if (flattenedStyle) {
      if (typeof flattenedStyle.width === 'number') {
        maxTabItemWidth = flattenedStyle.width;
      } else if (typeof flattenedStyle.maxWidth === 'number') {
        maxTabItemWidth = flattenedStyle.maxWidth;
      }
    }

    return state.routes.length * maxTabItemWidth <= layout.width;
  } else {
    return dimensions.width > dimensions.height;
  }
};

const getPaddingBottom = insets => Math.max(insets.bottom - Platform.select({
  ios: 4,
  default: 0
}), 0);

export const getTabBarHeight = ({
  dimensions,
  insets,
  style,
  ...rest
}) => {
  var _StyleSheet$flatten;

  // @ts-ignore
  const customHeight = (_StyleSheet$flatten = StyleSheet.flatten(style)) === null || _StyleSheet$flatten === void 0 ? void 0 : _StyleSheet$flatten.height;

  if (typeof customHeight === 'number') {
    return customHeight;
  }

  const isLandscape = dimensions.width > dimensions.height;
  const horizontalLabels = shouldUseHorizontalLabels({
    dimensions,
    ...rest
  });
  const paddingBottom = getPaddingBottom(insets);

  if (Platform.OS === 'ios' && !Platform.isPad && isLandscape && horizontalLabels) {
    return COMPACT_TABBAR_HEIGHT + paddingBottom;
  }

  return DEFAULT_TABBAR_HEIGHT + paddingBottom;
};
export default function BottomTabBar({
  state,
  navigation,
  descriptors,
  activeBackgroundColor,
  activeTintColor,
  adaptive,
  allowFontScaling,
  inactiveBackgroundColor,
  inactiveTintColor,
  keyboardHidesTabBar = false,
  labelPosition,
  labelStyle,
  iconStyle,
  safeAreaInsets,
  showLabel,
  style,
  tabStyle
}) {
  var _safeAreaInsets$top, _safeAreaInsets$right, _safeAreaInsets$botto, _safeAreaInsets$left;

  const {
    colors
  } = useTheme();
  const buildLink = useLinkBuilder();
  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;
  const dimensions = useWindowDimensions();
  const isKeyboardShown = useIsKeyboardShown();
  const onHeightChange = React.useContext(BottomTabBarHeightCallbackContext);
  const shouldShowTabBar = focusedOptions.tabBarVisible !== false && !(keyboardHidesTabBar && isKeyboardShown);
  const visibilityAnimationConfigRef = React.useRef(focusedOptions.tabBarVisibilityAnimationConfig);
  React.useEffect(() => {
    visibilityAnimationConfigRef.current = focusedOptions.tabBarVisibilityAnimationConfig;
  });
  const [isTabBarHidden, setIsTabBarHidden] = React.useState(!shouldShowTabBar);
  const [visible] = React.useState(() => new Animated.Value(shouldShowTabBar ? 1 : 0));
  React.useEffect(() => {
    const visibilityAnimationConfig = visibilityAnimationConfigRef.current;

    if (shouldShowTabBar) {
      var _visibilityAnimationC, _visibilityAnimationC2;

      const animation = (visibilityAnimationConfig === null || visibilityAnimationConfig === void 0 ? void 0 : (_visibilityAnimationC = visibilityAnimationConfig.show) === null || _visibilityAnimationC === void 0 ? void 0 : _visibilityAnimationC.animation) === 'spring' ? Animated.spring : Animated.timing;
      animation(visible, {
        toValue: 1,
        useNativeDriver,
        duration: 250,
        ...(visibilityAnimationConfig === null || visibilityAnimationConfig === void 0 ? void 0 : (_visibilityAnimationC2 = visibilityAnimationConfig.show) === null || _visibilityAnimationC2 === void 0 ? void 0 : _visibilityAnimationC2.config)
      }).start(({
        finished
      }) => {
        if (finished) {
          setIsTabBarHidden(false);
        }
      });
    } else {
      var _visibilityAnimationC3, _visibilityAnimationC4;

      setIsTabBarHidden(true);
      const animation = (visibilityAnimationConfig === null || visibilityAnimationConfig === void 0 ? void 0 : (_visibilityAnimationC3 = visibilityAnimationConfig.hide) === null || _visibilityAnimationC3 === void 0 ? void 0 : _visibilityAnimationC3.animation) === 'spring' ? Animated.spring : Animated.timing;
      animation(visible, {
        toValue: 0,
        useNativeDriver,
        duration: 200,
        ...(visibilityAnimationConfig === null || visibilityAnimationConfig === void 0 ? void 0 : (_visibilityAnimationC4 = visibilityAnimationConfig.hide) === null || _visibilityAnimationC4 === void 0 ? void 0 : _visibilityAnimationC4.config)
      }).start();
    }
  }, [visible, shouldShowTabBar]);
  const [layout, setLayout] = React.useState({
    height: 0,
    width: dimensions.width
  });

  const handleLayout = e => {
    var _StyleSheet$flatten2;

    const {
      height,
      width
    } = e.nativeEvent.layout;
    const topBorderWidth = // @ts-ignore
    (_StyleSheet$flatten2 = StyleSheet.flatten([styles.tabBar, style])) === null || _StyleSheet$flatten2 === void 0 ? void 0 : _StyleSheet$flatten2.borderTopWidth;
    onHeightChange === null || onHeightChange === void 0 ? void 0 : onHeightChange(height + paddingBottom + (typeof topBorderWidth === 'number' ? topBorderWidth : 0));
    setLayout(layout => {
      if (height === layout.height && width === layout.width) {
        return layout;
      } else {
        return {
          height,
          width
        };
      }
    });
  };

  const {
    routes
  } = state;
  const defaultInsets = useSafeArea();
  const insets = {
    top: (_safeAreaInsets$top = safeAreaInsets === null || safeAreaInsets === void 0 ? void 0 : safeAreaInsets.top) !== null && _safeAreaInsets$top !== void 0 ? _safeAreaInsets$top : defaultInsets.top,
    right: (_safeAreaInsets$right = safeAreaInsets === null || safeAreaInsets === void 0 ? void 0 : safeAreaInsets.right) !== null && _safeAreaInsets$right !== void 0 ? _safeAreaInsets$right : defaultInsets.right,
    bottom: (_safeAreaInsets$botto = safeAreaInsets === null || safeAreaInsets === void 0 ? void 0 : safeAreaInsets.bottom) !== null && _safeAreaInsets$botto !== void 0 ? _safeAreaInsets$botto : defaultInsets.bottom,
    left: (_safeAreaInsets$left = safeAreaInsets === null || safeAreaInsets === void 0 ? void 0 : safeAreaInsets.left) !== null && _safeAreaInsets$left !== void 0 ? _safeAreaInsets$left : defaultInsets.left
  };
  const paddingBottom = getPaddingBottom(insets);
  const tabBarHeight = getTabBarHeight({
    state,
    insets,
    dimensions,
    layout,
    adaptive,
    labelPosition,
    tabStyle,
    style
  });
  const hasHorizontalLabels = shouldUseHorizontalLabels({
    state,
    dimensions,
    layout,
    adaptive,
    labelPosition,
    tabStyle
  });
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.tabBar, {
      backgroundColor: colors.card,
      borderTopColor: colors.border
    }, {
      transform: [{
        translateY: visible.interpolate({
          inputRange: [0, 1],
          outputRange: [layout.height + paddingBottom + StyleSheet.hairlineWidth, 0]
        })
      }],
      // Absolutely position the tab bar so that the content is below it
      // This is needed to avoid gap at bottom when the tab bar is hidden
      position: isTabBarHidden ? 'absolute' : null
    }, {
      height: tabBarHeight,
      paddingBottom,
      paddingHorizontal: Math.max(insets.left, insets.right)
    }, style],
    pointerEvents: isTabBarHidden ? 'none' : 'auto'
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.content,
    onLayout: handleLayout
  }, routes.map((route, index) => {
    const focused = index === state.index;
    const {
      options
    } = descriptors[route.key];

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true
      });

      if (!focused && !event.defaultPrevented) {
        navigation.dispatch({ ...CommonActions.navigate(route.name),
          target: state.key
        });
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key
      });
    };

    const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
    const accessibilityLabel = options.tabBarAccessibilityLabel !== undefined ? options.tabBarAccessibilityLabel : typeof label === 'string' ? "".concat(label, ", tab, ").concat(index + 1, " of ").concat(routes.length) : undefined;
    return /*#__PURE__*/React.createElement(NavigationContext.Provider, {
      key: route.key,
      value: descriptors[route.key].navigation
    }, /*#__PURE__*/React.createElement(NavigationRouteContext.Provider, {
      value: route
    }, /*#__PURE__*/React.createElement(BottomTabItem, {
      route: route,
      focused: focused,
      horizontal: hasHorizontalLabels,
      onPress: onPress,
      onLongPress: onLongPress,
      accessibilityLabel: accessibilityLabel,
      to: buildLink(route.name, route.params),
      testID: options.tabBarTestID,
      allowFontScaling: allowFontScaling,
      activeTintColor: activeTintColor,
      inactiveTintColor: inactiveTintColor,
      activeBackgroundColor: activeBackgroundColor,
      inactiveBackgroundColor: inactiveBackgroundColor,
      button: options.tabBarButton,
      icon: options.tabBarIcon,
      badge: options.tabBarBadge,
      badgeStyle: options.tabBarBadgeStyle,
      label: label,
      showLabel: showLabel,
      labelStyle: labelStyle,
      iconStyle: iconStyle,
      style: tabStyle
    })));
  })));
}
const styles = StyleSheet.create({
  tabBar: {
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 8
  },
  content: {
    flex: 1,
    flexDirection: 'row'
  }
});
//# sourceMappingURL=BottomTabBar.js.map