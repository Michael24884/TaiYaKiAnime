"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _TouchableItem = _interopRequireDefault(require("./TouchableItem"));

var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));

var _memoize = _interopRequireDefault(require("./memoize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// @ts-ignore
const AnimatedInterpolate = _reactNativeReanimated.default.interpolateNode || _reactNativeReanimated.default.interpolate;
const DEFAULT_ACTIVE_COLOR = 'rgba(255, 255, 255, 1)';
const DEFAULT_INACTIVE_COLOR = 'rgba(255, 255, 255, 0.7)';

class TabBarItem extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "getActiveOpacity", (0, _memoize.default)((position, routes, tabIndex) => {
      if (routes.length > 1) {
        const inputRange = routes.map((_, i) => i);
        return AnimatedInterpolate(position, {
          inputRange,
          outputRange: inputRange.map(i => i === tabIndex ? 1 : 0)
        });
      } else {
        return 1;
      }
    }));

    _defineProperty(this, "getInactiveOpacity", (0, _memoize.default)((position, routes, tabIndex) => {
      if (routes.length > 1) {
        const inputRange = routes.map((_, i) => i);
        return AnimatedInterpolate(position, {
          inputRange,
          outputRange: inputRange.map(i => i === tabIndex ? 0 : 1)
        });
      } else {
        return 0;
      }
    }));
  }

  render() {
    const {
      route,
      position,
      navigationState,
      renderLabel: renderLabelPassed,
      renderIcon,
      renderBadge,
      getLabelText,
      getTestID,
      getAccessibilityLabel,
      getAccessible,
      activeColor = DEFAULT_ACTIVE_COLOR,
      inactiveColor = DEFAULT_INACTIVE_COLOR,
      pressColor,
      pressOpacity,
      labelStyle,
      style,
      onLayout,
      onPress,
      onLongPress
    } = this.props;
    const tabIndex = navigationState.routes.indexOf(route);
    const isFocused = navigationState.index === tabIndex;
    const activeOpacity = this.getActiveOpacity(position, navigationState.routes, tabIndex);
    const inactiveOpacity = this.getInactiveOpacity(position, navigationState.routes, tabIndex);
    let icon = null;
    let label = null;

    if (renderIcon) {
      const activeIcon = renderIcon({
        route,
        focused: true,
        color: activeColor
      });
      const inactiveIcon = renderIcon({
        route,
        focused: false,
        color: inactiveColor
      });

      if (inactiveIcon != null && activeIcon != null) {
        icon = /*#__PURE__*/React.createElement(_reactNative.View, {
          style: styles.icon
        }, /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
          style: {
            opacity: inactiveOpacity
          }
        }, inactiveIcon), /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
          style: [_reactNative.StyleSheet.absoluteFill, {
            opacity: activeOpacity
          }]
        }, activeIcon));
      }
    }

    const renderLabel = renderLabelPassed !== undefined ? renderLabelPassed : ({
      route,
      color
    }) => {
      const labelText = getLabelText({
        route
      });

      if (typeof labelText === 'string') {
        return /*#__PURE__*/React.createElement(_reactNativeReanimated.default.Text, {
          style: [styles.label, icon ? {
            marginTop: 0
          } : null, {
            color
          }, labelStyle]
        }, labelText);
      }

      return labelText;
    };

    if (renderLabel) {
      const activeLabel = renderLabel({
        route,
        focused: true,
        color: activeColor
      });
      const inactiveLabel = renderLabel({
        route,
        focused: false,
        color: inactiveColor
      });
      label = /*#__PURE__*/React.createElement(_reactNative.View, null, /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
        style: {
          opacity: inactiveOpacity
        }
      }, inactiveLabel), /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
        style: [_reactNative.StyleSheet.absoluteFill, {
          opacity: activeOpacity
        }]
      }, activeLabel));
    }

    const tabStyle = _reactNative.StyleSheet.flatten(style);

    const isWidthSet = (tabStyle === null || tabStyle === void 0 ? void 0 : tabStyle.width) !== undefined;
    const tabContainerStyle = isWidthSet ? null : {
      flex: 1
    };
    const scene = {
      route
    };
    let accessibilityLabel = getAccessibilityLabel(scene);
    accessibilityLabel = typeof accessibilityLabel !== 'undefined' ? accessibilityLabel : getLabelText(scene);
    const badge = renderBadge ? renderBadge(scene) : null;
    return /*#__PURE__*/React.createElement(_TouchableItem.default, {
      borderless: true,
      testID: getTestID(scene),
      accessible: getAccessible(scene),
      accessibilityLabel: accessibilityLabel,
      accessibilityTraits: isFocused ? ['button', 'selected'] : 'button',
      accessibilityComponentType: "button",
      accessibilityRole: "tab",
      accessibilityState: {
        selected: isFocused
      } // @ts-ignore: this is to support older React Native versions
      ,
      accessibilityStates: isFocused ? ['selected'] : [],
      pressColor: pressColor,
      pressOpacity: pressOpacity,
      delayPressIn: 0,
      onLayout: onLayout,
      onPress: onPress,
      onLongPress: onLongPress,
      style: tabContainerStyle
    }, /*#__PURE__*/React.createElement(_reactNative.View, {
      pointerEvents: "none",
      style: [styles.item, tabStyle]
    }, icon, label, badge != null ? /*#__PURE__*/React.createElement(_reactNative.View, {
      style: styles.badge
    }, badge) : null));
  }

}

exports.default = TabBarItem;

const styles = _reactNative.StyleSheet.create({
  label: {
    margin: 4,
    backgroundColor: 'transparent'
  },
  icon: {
    margin: 2
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    minHeight: 48
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0
  }
});
//# sourceMappingURL=TabBarItem.js.map