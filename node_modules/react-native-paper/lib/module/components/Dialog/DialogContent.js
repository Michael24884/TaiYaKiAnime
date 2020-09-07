function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * A component to show content in a Dialog.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/dialog-content.png" />
 *   </figure>
 * </div>
 *
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Paragraph, Dialog, Portal } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const hideDialog = () => setVisible(false);
 *
 *   return (
 *     <Portal>
 *       <Dialog visible={visible} onDismiss={hideDialog}>
 *         <Dialog.Content>
 *           <Paragraph>This is simple dialog</Paragraph>
 *         </Dialog.Content>
 *       </Dialog>
 *     </Portal>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
class DialogContent extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement(View, _extends({}, this.props, {
      style: [styles.container, this.props.style]
    }), this.props.children);
  }

}

_defineProperty(DialogContent, "displayName", 'Dialog.Content');

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: 24
  }
});
export default DialogContent;
//# sourceMappingURL=DialogContent.js.map