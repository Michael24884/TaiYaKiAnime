"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _native = require("@react-navigation/native");

var _reactNativeScreens = require("react-native-screens");

var _SafeAreaProviderCompat = _interopRequireWildcard(require("./SafeAreaProviderCompat"));

var _ResourceSavingScene = _interopRequireDefault(require("./ResourceSavingScene"));

var _BottomTabBar = _interopRequireWildcard(require("./BottomTabBar"));

var _BottomTabBarHeightCallbackContext = _interopRequireDefault(require("../utils/BottomTabBarHeightCallbackContext"));

var _BottomTabBarHeightContext = _interopRequireDefault(require("../utils/BottomTabBarHeightContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function SceneContent({
  isFocused,
  children,
  style
}) {
  const {
    colors
  } = (0, _native.useTheme)();
  return /*#__PURE__*/React.createElement(_reactNative.View, {
    accessibilityElementsHidden: !isFocused,
    importantForAccessibility: isFocused ? 'auto' : 'no-hide-descendants',
    style: [styles.content, {
      backgroundColor: colors.background
    }, style]
  }, children);
}

class BottomTabView extends React.Component {
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
        tabBar = props => /*#__PURE__*/React.createElement(_BottomTabBar.default, props),
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

    const dimensions = _reactNative.Dimensions.get('window');

    const tabBarHeight = (0, _BottomTabBar.getTabBarHeight)({
      state: _state,
      dimensions,
      layout: {
        width: dimensions.width,
        height: 0
      },
      insets: _SafeAreaProviderCompat.initialSafeAreaInsets,
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
    return /*#__PURE__*/React.createElement(_native.NavigationHelpersContext.Provider, {
      value: navigation
    }, /*#__PURE__*/React.createElement(_SafeAreaProviderCompat.default, null, /*#__PURE__*/React.createElement(_reactNative.View, {
      style: styles.container
    }, /*#__PURE__*/React.createElement(_reactNativeScreens.ScreenContainer // @ts-ignore
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

      return /*#__PURE__*/React.createElement(_ResourceSavingScene.default, {
        key: route.key,
        style: _reactNative.StyleSheet.absoluteFill,
        isVisible: isFocused,
        enabled: detachInactiveScreens
      }, /*#__PURE__*/React.createElement(SceneContent, {
        isFocused: isFocused,
        style: sceneContainerStyle
      }, /*#__PURE__*/React.createElement(_BottomTabBarHeightContext.default.Provider, {
        value: tabBarHeight
      }, descriptor.render())));
    })), /*#__PURE__*/React.createElement(_BottomTabBarHeightCallbackContext.default.Provider, {
      value: this.handleTabBarHeightChange
    }, this.renderTabBar()))));
  }

}

exports.default = BottomTabView;

_defineProperty(BottomTabView, "defaultProps", {
  lazy: true
});

const styles = _reactNative.StyleSheet.create({
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