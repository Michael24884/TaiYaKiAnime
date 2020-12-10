function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { Animated, Platform } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
const AnimatedBaseButton = Animated.createAnimatedComponent(BaseButton);
const useNativeDriver = Platform.OS !== 'web';
export default class BorderlessButton extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "opacity", new Animated.Value(1));

    _defineProperty(this, "handleActiveStateChange", active => {
      var _this$props$onActiveS, _this$props;

      if (Platform.OS !== 'android') {
        Animated.spring(this.opacity, {
          stiffness: 1000,
          damping: 500,
          mass: 3,
          overshootClamping: true,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
          toValue: active ? this.props.activeOpacity : 1,
          useNativeDriver
        }).start();
      }

      (_this$props$onActiveS = (_this$props = this.props).onActiveStateChange) === null || _this$props$onActiveS === void 0 ? void 0 : _this$props$onActiveS.call(_this$props, active);
    });
  }

  render() {
    const {
      children,
      style,
      enabled,
      ...rest
    } = this.props;
    return /*#__PURE__*/React.createElement(AnimatedBaseButton, _extends({}, rest, {
      onActiveStateChange: this.handleActiveStateChange,
      style: [style, Platform.OS === 'ios' && enabled && {
        opacity: this.opacity
      }]
    }), children);
  }

}

_defineProperty(BorderlessButton, "defaultProps", {
  activeOpacity: 0.3,
  borderless: true
});
//# sourceMappingURL=BorderlessButton.js.map