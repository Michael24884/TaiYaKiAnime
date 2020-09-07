function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { TouchableNativeFeedback, TouchableOpacity, Platform, View } from 'react-native';
const LOLLIPOP = 21;
export default class TouchableItem extends React.Component {
  render() {
    const _this$props = this.props,
          {
      style,
      pressOpacity,
      pressColor,
      borderless,
      children
    } = _this$props,
          rest = _objectWithoutProperties(_this$props, ["style", "pressOpacity", "pressColor", "borderless", "children"]);

    if (Platform.OS === 'android' && Platform.Version >= LOLLIPOP) {
      return /*#__PURE__*/React.createElement(TouchableNativeFeedback, _extends({}, rest, {
        background: TouchableNativeFeedback.Ripple(pressColor, borderless)
      }), /*#__PURE__*/React.createElement(View, {
        style: style
      }, React.Children.only(children)));
    } else {
      return /*#__PURE__*/React.createElement(TouchableOpacity, _extends({}, rest, {
        style: style,
        activeOpacity: pressOpacity
      }), children);
    }
  }

}

_defineProperty(TouchableItem, "defaultProps", {
  pressColor: 'rgba(255, 255, 255, .4)'
});
//# sourceMappingURL=TouchableItem.js.map