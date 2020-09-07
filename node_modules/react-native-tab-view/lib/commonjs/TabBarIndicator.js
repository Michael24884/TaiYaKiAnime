"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _memoize = _interopRequireDefault(require("./memoize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Easing = _reactNativeReanimated.EasingNode || _reactNativeReanimated.Easing;
const {
  multiply,
  Extrapolate
} = _reactNativeReanimated.default; // @ts-ignore

const interpolate = _reactNativeReanimated.default.interpolateNode || _reactNativeReanimated.default.interpolate;

class TabBarIndicator extends React.Component {
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

        _reactNativeReanimated.default.timing(this.opacity, {
          duration: 150,
          toValue: 1,
          easing: Easing.in(Easing.linear)
        }).start();
      }
    });

    _defineProperty(this, "isIndicatorShown", false);

    _defineProperty(this, "opacity", new _reactNativeReanimated.default.Value(this.props.width === 'auto' ? 0 : 1));

    _defineProperty(this, "getTranslateX", (0, _memoize.default)((position, routes, getTabWidth) => {
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
      return multiply(translateX, _reactNative.I18nManager.isRTL ? -1 : 1);
    }));

    _defineProperty(this, "getWidth", (0, _memoize.default)((position, routes, getTabWidth) => {
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
    return /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
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

exports.default = TabBarIndicator;

const styles = _reactNative.StyleSheet.create({
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