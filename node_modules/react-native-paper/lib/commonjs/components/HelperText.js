"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _color = _interopRequireDefault(require("color"));

var _reactNative = require("react-native");

var _AnimatedText = _interopRequireDefault(require("./Typography/AnimatedText"));

var _theming = require("../core/theming");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Helper text is used in conjuction with input elements to provide additional hints for the user.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/helper-text.gif" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { HelperText, TextInput } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [text, setText] = React.useState('');
 *
 *    const onChangeText = text => setText(text);
 *
 *   const hasErrors = () => {
 *     return !text.includes('@');
 *   };
 *
 *  return (
 *     <View>
 *       <TextInput label="Email" value={text} onChangeText={onChangeText} />
 *       <HelperText type="error" visible={hasErrors()}>
 *         Email address is invalid!
 *       </HelperText>
 *     </View>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
class HelperText extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      shown: new _reactNative.Animated.Value(this.props.visible ? 1 : 0),
      textHeight: 0
    });

    _defineProperty(this, "showText", () => {
      const {
        scale
      } = this.props.theme.animation;

      _reactNative.Animated.timing(this.state.shown, {
        toValue: 1,
        duration: 150 * scale,
        useNativeDriver: true
      }).start();
    });

    _defineProperty(this, "hideText", () => {
      const {
        scale
      } = this.props.theme.animation;

      _reactNative.Animated.timing(this.state.shown, {
        toValue: 0,
        duration: 180 * scale,
        useNativeDriver: true
      }).start();
    });

    _defineProperty(this, "handleTextLayout", e => {
      //@ts-ignore Animated.Text typings are improved but something is still broken. It thinks onLayout is not callable.
      this.props.onLayout && this.props.onLayout(e);
      this.setState({
        textHeight: e.nativeEvent.layout.height
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visible !== this.props.visible || prevState.textHeight !== this.state.textHeight) {
      if (this.props.visible) {
        this.showText();
      } else {
        this.hideText();
      }
    }
  }

  render() {
    const _this$props = this.props,
          {
      style,
      type,
      visible,
      theme,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onLayout,
      padding
    } = _this$props,
          rest = _objectWithoutProperties(_this$props, ["style", "type", "visible", "theme", "onLayout", "padding"]);

    const {
      colors,
      dark
    } = theme;
    const textColor = this.props.type === 'error' ? colors.error : (0, _color.default)(colors.text).alpha(dark ? 0.7 : 0.54).rgb().string();
    return (
      /*#__PURE__*/
      // @ts-ignore
      React.createElement(_AnimatedText.default, _extends({
        onLayout: this.handleTextLayout,
        style: [styles.text, padding !== 'none' ? styles.padding : {}, {
          color: textColor,
          opacity: this.state.shown,
          transform: visible && type === 'error' ? [{
            translateY: this.state.shown.interpolate({
              inputRange: [0, 1],
              outputRange: [-this.state.textHeight / 2, 0]
            })
          }] : []
        }, style]
      }, rest), this.props.children)
    );
  }

}

_defineProperty(HelperText, "defaultProps", {
  type: 'info',
  padding: 'normal',
  visible: true
});

const styles = _reactNative.StyleSheet.create({
  text: {
    fontSize: 12,
    paddingVertical: 4
  },
  padding: {
    paddingHorizontal: 12
  }
});

var _default = (0, _theming.withTheme)(HelperText);

exports.default = _default;
//# sourceMappingURL=HelperText.js.map