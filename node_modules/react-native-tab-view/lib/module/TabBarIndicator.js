function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { StyleSheet, I18nManager } from 'react-native';
import Animated, { Easing as OldEasing // @ts-ignore
, EasingNode } from 'react-native-reanimated';
import memoize from './memoize';
const Easing = EasingNode || OldEasing;
const {
  multiply,
  Extrapolate
} = Animated; // @ts-ignore

const interpolate = Animated.interpolateNode || Animated.interpolate;
export default class TabBarIndicator extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "fadeInIndicator", () => {
      const {
        navigationState,
        layout,
        width,
        getTabWidth
      } = this.props;

      if (!this.isIndicatorShown && width === 'auto' && layout.width && // We should fade-in the indicator when we have widths for all the tab items
      navigationState.routes.every((_, i) => getTabWidth(i))) {
        this.isIndicatorShown = true;
        Animated.timing(this.opacity, {
          duration: 150,
          toValue: 1,
          easing: Easing.in(Easing.linear)
        }).start();
      }
    });

    _defineProperty(this, "isIndicatorShown", false);

    _defineProperty(this, "opacity", new Animated.Value(this.props.width === 'auto' ? 0 : 1));

    _defineProperty(this, "getTranslateX", memoize((position, routes, getTabWidth) => {
      const inputRange = routes.map((_, i) => i); // every index contains widths at all previous indices

      const outputRange = routes.reduce((acc, _, i) => {
        if (i === 0) return [0];
        return [...acc, acc[i - 1] + getTabWidth(i - 1)];
      }, []);
      const translateX = interpolate(position, {
        inputRange,
        outputRange,
        extrapolate: Extrapolate.CLAMP
      });
      return multiply(translateX, I18nManager.isRTL ? -1 : 1);
    }));

    _defineProperty(this, "getWidth", memoize((position, routes, getTabWidth) => {
      const inputRange = routes.map((_, i) => i);
      const outputRange = inputRange.map(getTabWidth);
      return interpolate(position, {
        inputRange,
        outputRange,
        extrapolate: Extrapolate.CLAMP
      });
    }));
  }

  componentDidMount() {
    this.fadeInIndicator();
  }

  componentDidUpdate() {
    this.fadeInIndicator();
  }

  render() {
    const {
      position,
      navigationState,
      getTabWidth,
      width,
      style,
      layout
    } = this.props;
    const {
      routes
    } = navigationState;
    const translateX = routes.length > 1 ? this.getTranslateX(position, routes, getTabWidth) : 0;
    const indicatorWidth = width === 'auto' ? routes.length > 1 ? this.getWidth(position, routes, getTabWidth) : getTabWidth(0) : width;
    return /*#__PURE__*/React.createElement(Animated.View, {
      style: [styles.indicator, // If layout is not available, use `left` property for positioning the indicator
      // This avoids rendering delay until we are able to calculate translateX
      {
        width: indicatorWidth
      }, layout.width ? {
        transform: [{
          translateX
        }]
      } : {
        left: "".concat(100 / routes.length * navigationState.index, "%")
      }, width === 'auto' ? {
        opacity: this.opacity
      } : null, style]
    });
  }

}
const styles = StyleSheet.create({
  indicator: {
    backgroundColor: '#ffeb3b',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 2
  }
});
//# sourceMappingURL=TabBarIndicator.js.map