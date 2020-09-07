function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { StyleSheet, View, I18nManager, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import TabBarItem from './TabBarItem';
import TabBarIndicator from './TabBarIndicator';
import memoize from './memoize';

const scheduleInNextFrame = cb => {
  let frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(cb);
  });
  return () => cancelAnimationFrame(frame);
};

export default class TabBar extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      layout: {
        width: 0,
        height: 0
      },
      tabWidths: {}
    });

    _defineProperty(this, "measuredTabWidths", {});

    _defineProperty(this, "scrollAmount", new Animated.Value(0));

    _defineProperty(this, "scrollViewRef", /*#__PURE__*/React.createRef());

    _defineProperty(this, "cancelNextFrameCb", undefined);

    _defineProperty(this, "getFlattenedTabWidth", style => {
      const tabStyle = StyleSheet.flatten(style);
      return tabStyle ? tabStyle.width : undefined;
    });

    _defineProperty(this, "getComputedTabWidth", (index, layout, routes, scrollEnabled, tabWidths, flattenedWidth) => {
      if (flattenedWidth === 'auto') {
        return tabWidths[routes[index].key] || 0;
      }

      switch (typeof flattenedWidth) {
        case 'number':
          return flattenedWidth;

        case 'string':
          if (flattenedWidth.endsWith('%')) {
            const width = parseFloat(flattenedWidth);

            if (Number.isFinite(width)) {
              return layout.width * (width / 100);
            }
          }

      }

      if (scrollEnabled) {
        return layout.width / 5 * 2;
      }

      return layout.width / routes.length;
    });

    _defineProperty(this, "getMemoizedTabWidthGettter", memoize((layout, routes, scrollEnabled, tabWidths, flattenedWidth) => i => this.getComputedTabWidth(i, layout, routes, scrollEnabled, tabWidths, flattenedWidth)));

    _defineProperty(this, "getMaxScrollDistance", (tabBarWidth, layoutWidth) => tabBarWidth - layoutWidth);

    _defineProperty(this, "getTabBarWidth", (props, state) => {
      const {
        layout,
        tabWidths
      } = state;
      const {
        scrollEnabled,
        tabStyle
      } = props;
      const {
        routes
      } = props.navigationState;
      return routes.reduce((acc, _, i) => acc + this.getComputedTabWidth(i, layout, routes, scrollEnabled, tabWidths, this.getFlattenedTabWidth(tabStyle)), 0);
    });

    _defineProperty(this, "normalizeScrollValue", (props, state, value) => {
      const {
        layout
      } = state;
      const tabBarWidth = this.getTabBarWidth(props, state);
      const maxDistance = this.getMaxScrollDistance(tabBarWidth, layout.width);
      const scrollValue = Math.max(Math.min(value, maxDistance), 0);

      if (Platform.OS === 'android' && I18nManager.isRTL) {
        // On Android, scroll value is not applied in reverse in RTL
        // so we need to manually adjust it to apply correct value
        return maxDistance - scrollValue;
      }

      return scrollValue;
    });

    _defineProperty(this, "getScrollAmount", (props, state, index) => {
      const {
        layout,
        tabWidths
      } = state;
      const {
        scrollEnabled,
        tabStyle
      } = props;
      const {
        routes
      } = props.navigationState;
      const centerDistance = Array.from({
        length: index + 1
      }).reduce((total, _, i) => {
        const tabWidth = this.getComputedTabWidth(i, layout, routes, scrollEnabled, tabWidths, this.getFlattenedTabWidth(tabStyle)); // To get the current index centered we adjust scroll amount by width of indexes
        // 0 through (i - 1) and add half the width of current index i

        return total + (index === i ? tabWidth / 2 : tabWidth);
      }, 0);
      const scrollAmount = centerDistance - layout.width / 2;
      return this.normalizeScrollValue(props, state, scrollAmount);
    });

    _defineProperty(this, "resetScroll", index => {
      if (this.props.scrollEnabled) {
        var _this$scrollViewRef$c, _this$scrollViewRef$c2;

        // getNode() is not necessary in newer versions of React Native
        const scrollView = // @ts-ignore
        typeof ((_this$scrollViewRef$c = this.scrollViewRef.current) === null || _this$scrollViewRef$c === void 0 ? void 0 : _this$scrollViewRef$c.scrollTo) === 'function' ? this.scrollViewRef.current : (_this$scrollViewRef$c2 = this.scrollViewRef.current) === null || _this$scrollViewRef$c2 === void 0 ? void 0 : _this$scrollViewRef$c2.getNode(); // @ts-ignore

        scrollView === null || scrollView === void 0 ? void 0 : scrollView.scrollTo({
          x: this.getScrollAmount(this.props, this.state, index),
          animated: true
        });
      }
    });

    _defineProperty(this, "handleLayout", e => {
      var _this$cancelNextFrame;

      const {
        height,
        width
      } = e.nativeEvent.layout;

      if (this.state.layout.width === width && this.state.layout.height === height) {
        return;
      } // If we don't delay this state update, the UI gets stuck in weird state
      // Maybe an issue in Reanimated?
      // https://github.com/react-native-community/react-native-tab-view/issues/877
      // Cancel any pending callbacks, since we're scheduling a new one


      (_this$cancelNextFrame = this.cancelNextFrameCb) === null || _this$cancelNextFrame === void 0 ? void 0 : _this$cancelNextFrame.call(this);
      this.cancelNextFrameCb = scheduleInNextFrame(() => this.setState({
        layout: {
          height,
          width
        }
      }));
    });

    _defineProperty(this, "getTranslateX", memoize((scrollAmount, maxScrollDistance) => Animated.multiply(Platform.OS === 'android' && I18nManager.isRTL ? Animated.sub(maxScrollDistance, scrollAmount) : scrollAmount, I18nManager.isRTL ? 1 : -1)));
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      navigationState
    } = this.props;
    const {
      layout,
      tabWidths
    } = this.state;

    if (prevProps.navigationState.routes.length !== navigationState.routes.length || prevProps.navigationState.index !== navigationState.index || prevState.layout.width !== layout.width || prevState.tabWidths !== tabWidths) {
      if (this.getFlattenedTabWidth(this.props.tabStyle) === 'auto' && !(layout.width && navigationState.routes.every(r => typeof tabWidths[r.key] === 'number'))) {
        // When tab width is dynamic, only adjust the scroll once we have all tab widths and layout
        return;
      }

      this.resetScroll(navigationState.index);
    }
  }

  componentWillUnmount() {
    var _this$cancelNextFrame2;

    (_this$cancelNextFrame2 = this.cancelNextFrameCb) === null || _this$cancelNextFrame2 === void 0 ? void 0 : _this$cancelNextFrame2.call(this);
  } // to store the layout.width of each tab
  // when all onLayout's are fired, this would be set in state


  render() {
    const {
      position,
      navigationState,
      jumpTo,
      scrollEnabled,
      bounces,
      getAccessibilityLabel,
      getAccessible,
      getLabelText,
      getTestID,
      renderBadge,
      renderIcon,
      renderLabel,
      renderTabBarItem,
      activeColor,
      inactiveColor,
      pressColor,
      pressOpacity,
      onTabPress,
      onTabLongPress,
      tabStyle,
      labelStyle,
      indicatorStyle,
      contentContainerStyle,
      style,
      indicatorContainerStyle
    } = this.props;
    const {
      layout,
      tabWidths
    } = this.state;
    const {
      routes
    } = navigationState;
    const isWidthDynamic = this.getFlattenedTabWidth(tabStyle) === 'auto';
    const tabBarWidth = this.getTabBarWidth(this.props, this.state);
    const tabBarWidthPercent = "".concat(routes.length * 40, "%");
    const translateX = this.getTranslateX(this.scrollAmount, this.getMaxScrollDistance(tabBarWidth, layout.width));
    return /*#__PURE__*/React.createElement(Animated.View, {
      onLayout: this.handleLayout,
      style: [styles.tabBar, style]
    }, /*#__PURE__*/React.createElement(Animated.View, {
      pointerEvents: "none",
      style: [styles.indicatorContainer, scrollEnabled ? {
        transform: [{
          translateX
        }]
      } : null, tabBarWidth ? {
        width: tabBarWidth
      } : scrollEnabled ? {
        width: tabBarWidthPercent
      } : null, indicatorContainerStyle]
    }, this.props.renderIndicator({
      position,
      layout,
      navigationState,
      jumpTo,
      width: isWidthDynamic ? 'auto' : "".concat(100 / routes.length, "%"),
      style: indicatorStyle,
      getTabWidth: this.getMemoizedTabWidthGettter(layout, routes, scrollEnabled, tabWidths, this.getFlattenedTabWidth(tabStyle))
    })), /*#__PURE__*/React.createElement(View, {
      style: styles.scroll
    }, /*#__PURE__*/React.createElement(Animated.ScrollView, {
      horizontal: true,
      accessibilityRole: "tablist",
      keyboardShouldPersistTaps: "handled",
      scrollEnabled: scrollEnabled,
      bounces: bounces,
      alwaysBounceHorizontal: false,
      scrollsToTop: false,
      showsHorizontalScrollIndicator: false,
      automaticallyAdjustContentInsets: false,
      overScrollMode: "never",
      contentContainerStyle: [styles.tabContent, scrollEnabled ? {
        width: tabBarWidth || tabBarWidthPercent
      } : styles.container, contentContainerStyle],
      scrollEventThrottle: 16,
      onScroll: Animated.event([{
        nativeEvent: {
          contentOffset: {
            x: this.scrollAmount
          }
        }
      }]),
      ref: this.scrollViewRef
    }, routes.map(route => {
      const props = {
        key: route.key,
        position: position,
        route: route,
        navigationState: navigationState,
        getAccessibilityLabel: getAccessibilityLabel,
        getAccessible: getAccessible,
        getLabelText: getLabelText,
        getTestID: getTestID,
        renderBadge: renderBadge,
        renderIcon: renderIcon,
        renderLabel: renderLabel,
        activeColor: activeColor,
        inactiveColor: inactiveColor,
        pressColor: pressColor,
        pressOpacity: pressOpacity,
        onLayout: isWidthDynamic ? e => {
          this.measuredTabWidths[route.key] = e.nativeEvent.layout.width; // When we have measured widths for all of the tabs, we should updates the state
          // We avoid doing separate setState for each layout since it triggers multiple renders and slows down app

          if (routes.every(r => typeof this.measuredTabWidths[r.key] === 'number')) {
            this.setState({
              tabWidths: _objectSpread({}, this.measuredTabWidths)
            });
          }
        } : undefined,
        onPress: () => {
          const event = {
            route,
            defaultPrevented: false,
            preventDefault: () => {
              event.defaultPrevented = true;
            }
          };
          onTabPress === null || onTabPress === void 0 ? void 0 : onTabPress(event);

          if (event.defaultPrevented) {
            return;
          }

          this.props.jumpTo(route.key);
        },
        onLongPress: () => onTabLongPress === null || onTabLongPress === void 0 ? void 0 : onTabLongPress({
          route
        }),
        labelStyle: labelStyle,
        style: tabStyle
      };
      return renderTabBarItem ? renderTabBarItem(props) : /*#__PURE__*/React.createElement(TabBarItem, props);
    }))));
  }

}

_defineProperty(TabBar, "defaultProps", {
  getLabelText: ({
    route
  }) => typeof route.title === 'string' ? route.title.toUpperCase() : route.title,
  getAccessible: ({
    route
  }) => typeof route.accessible !== 'undefined' ? route.accessible : true,
  getAccessibilityLabel: ({
    route
  }) => typeof route.accessibilityLabel === 'string' ? route.accessibilityLabel : typeof route.title === 'string' ? route.title : undefined,
  getTestID: ({
    route
  }) => route.testID,
  renderIndicator: props => /*#__PURE__*/React.createElement(TabBarIndicator, props)
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scroll: {
    overflow: Platform.select({
      default: 'scroll',
      web: undefined
    })
  },
  tabBar: {
    backgroundColor: '#2196f3',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
      width: 0
    },
    zIndex: 1
  },
  tabContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
//# sourceMappingURL=TabBar.js.map