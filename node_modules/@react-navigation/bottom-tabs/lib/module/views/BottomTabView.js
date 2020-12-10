function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { NavigationHelpersContext, useTheme } from '@react-navigation/native';
import { ScreenContainer } from 'react-native-screens';
import SafeAreaProviderCompat, { initialSafeAreaInsets } from './SafeAreaProviderCompat';
import ResourceSavingScene from './ResourceSavingScene';
import BottomTabBar, { getTabBarHeight } from './BottomTabBar';
import BottomTabBarHeightCallbackContext from '../utils/BottomTabBarHeightCallbackContext';
import BottomTabBarHeightContext from '../utils/BottomTabBarHeightContext';

function SceneContent({
  isFocused,
  children,
  style
}) {
  const {
    colors
  } = useTheme();
  return /*#__PURE__*/React.createElement(View, {
    accessibilityElementsHidden: !isFocused,
    importantForAccessibility: isFocused ? 'auto' : 'no-hide-descendants',
    style: [styles.content, {
      backgroundColor: colors.background
    }, style]
  }, children);
}

export default class BottomTabView extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const focusedRouteKey = nextProps.state.routes[nextProps.state.index].key;
    return {
      // Set the current tab to be loaded if it was not loaded before
      loaded: prevState.loaded.includes(focusedRouteKey) ? prevState.loaded : [...prevState.loaded, focusedRouteKey]
    };
  }

  constructor(_props) {
    super(_props);

    _defineProperty(this, "renderTabBar", () => {
      const {
        tabBar = props => /*#__PURE__*/React.createElement(BottomTabBar, props),
        tabBarOptions,
        state,
        navigation,
        descriptors
      } = this.props;
      return tabBar({ ...tabBarOptions,
        state: state,
        descriptors: descriptors,
        navigation: navigation
      });
    });

    _defineProperty(this, "handleTabBarHeightChange", height => {
      this.setState(state => {
        if (state.tabBarHeight !== height) {
          return {
            tabBarHeight: height
          };
        }

        return null;
      });
    });

    const {
      state: _state,
      tabBarOptions: _tabBarOptions
    } = this.props;
    const dimensions = Dimensions.get('window');
    const tabBarHeight = getTabBarHeight({
      state: _state,
      dimensions,
      layout: {
        width: dimensions.width,
        height: 0
      },
      insets: initialSafeAreaInsets,
      adaptive: _tabBarOptions === null || _tabBarOptions === void 0 ? void 0 : _tabBarOptions.adaptive,
      labelPosition: _tabBarOptions === null || _tabBarOptions === void 0 ? void 0 : _tabBarOptions.labelPosition,
      tabStyle: _tabBarOptions === null || _tabBarOptions === void 0 ? void 0 : _tabBarOptions.tabStyle,
      style: _tabBarOptions === null || _tabBarOptions === void 0 ? void 0 : _tabBarOptions.style
    });
    this.state = {
      loaded: [_state.routes[_state.index].key],
      tabBarHeight: tabBarHeight
    };
  }

  render() {
    const {
      state,
      descriptors,
      navigation,
      lazy,
      detachInactiveScreens = true,
      sceneContainerStyle
    } = this.props;
    const {
      routes
    } = state;
    const {
      loaded,
      tabBarHeight
    } = this.state;
    return /*#__PURE__*/React.createElement(NavigationHelpersContext.Provider, {
      value: navigation
    }, /*#__PURE__*/React.createElement(SafeAreaProviderCompat, null, /*#__PURE__*/React.createElement(View, {
      style: styles.container
    }, /*#__PURE__*/React.createElement(ScreenContainer // @ts-ignore
    , {
      enabled: detachInactiveScreens,
      style: styles.pages
    }, routes.map((route, index) => {
      const descriptor = descriptors[route.key];
      const {
        unmountOnBlur
      } = descriptor.options;
      const isFocused = state.index === index;

      if (unmountOnBlur && !isFocused) {
        return null;
      }

      if (lazy && !loaded.includes(route.key) && !isFocused) {
        // Don't render a screen if we've never navigated to it
        return null;
      }

      return /*#__PURE__*/React.createElement(ResourceSavingScene, {
        key: route.key,
        style: StyleSheet.absoluteFill,
        isVisible: isFocused,
        enabled: detachInactiveScreens
      }, /*#__PURE__*/React.createElement(SceneContent, {
        isFocused: isFocused,
        style: sceneContainerStyle
      }, /*#__PURE__*/React.createElement(BottomTabBarHeightContext.Provider, {
        value: tabBarHeight
      }, descriptor.render())));
    })), /*#__PURE__*/React.createElement(BottomTabBarHeightCallbackContext.Provider, {
      value: this.handleTabBarHeightChange
    }, this.renderTabBar()))));
  }

}

_defineProperty(BottomTabView, "defaultProps", {
  lazy: true
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  pages: {
    flex: 1
  },
  content: {
    flex: 1
  }
});
//# sourceMappingURL=BottomTabView.js.map