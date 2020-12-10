function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
// This component will render a page which overflows the screen
// if the container fills the body by comparing the size
// This lets the document.body handle scrolling of the content
// It's necessary for mobile browsers to be able to hide address bar on scroll
export default /*#__PURE__*/React.forwardRef(function CardSheet({
  enabled,
  layout,
  style,
  ...rest
}, ref) {
  const [fill, setFill] = React.useState(false);
  React.useEffect(() => {
    if (typeof document === 'undefined' || !document.body) {
      // Only run when DOM is available
      return;
    }

    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    setFill(width === layout.width && height === layout.height);
  }, [layout.height, layout.width]);
  return /*#__PURE__*/React.createElement(View, _extends({}, rest, {
    ref: ref,
    style: [enabled && fill ? styles.page : styles.card, style]
  }));
});
const styles = StyleSheet.create({
  page: {
    minHeight: '100%'
  },
  card: {
    flex: 1,
    overflow: 'hidden'
  }
});
//# sourceMappingURL=CardSheet.js.map