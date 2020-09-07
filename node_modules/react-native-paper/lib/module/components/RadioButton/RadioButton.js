function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { Platform } from 'react-native';
import RadioButtonGroup from './RadioButtonGroup';
import RadioButtonAndroid from './RadioButtonAndroid';
import RadioButtonIOS from './RadioButtonIOS';
import RadioButtonItem from './RadioButtonItem';
import { withTheme } from '../../core/theming';

/**
 * Radio buttons allow the selection a single option from a set.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/radio-enabled.android.png" />
 *     <figcaption>Android (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-disabled.android.png" />
 *     <figcaption>Android (disabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-enabled.ios.png" />
 *     <figcaption>iOS (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-disabled.ios.png" />
 *     <figcaption>iOS (disabled)</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { RadioButton } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [checked, setChecked] = React.useState('first');
 *
 *   return (
 *     <View>
 *       <RadioButton
 *         value="first"
 *         status={ checked === 'first' ? 'checked' : 'unchecked' }
 *         onPress={() => setChecked('first')}
 *       />
 *       <RadioButton
 *         value="second"
 *         status={ checked === 'second' ? 'checked' : 'unchecked' }
 *         onPress={() => setChecked('second')}
 *       />
 *     </View>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
class RadioButton extends React.Component {
  // @component ./RadioButtonGroup.tsx
  // @component ./RadioButtonAndroid.tsx
  // @component ./RadioButtonIOS.tsx
  // @component ./RadioButtonItem.tsx
  render() {
    const Button = Platform.select({
      default: RadioButtonAndroid,
      ios: RadioButtonIOS
    });
    return /*#__PURE__*/React.createElement(Button, this.props);
  }

}

_defineProperty(RadioButton, "Group", RadioButtonGroup);

_defineProperty(RadioButton, "Android", RadioButtonAndroid);

_defineProperty(RadioButton, "IOS", RadioButtonIOS);

_defineProperty(RadioButton, "Item", RadioButtonItem);

export default withTheme(RadioButton);
//# sourceMappingURL=RadioButton.js.map