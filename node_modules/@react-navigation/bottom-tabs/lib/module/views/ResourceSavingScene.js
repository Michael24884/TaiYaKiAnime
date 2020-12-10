function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Screen, screensEnabled // @ts-ignore
, shouldUseActivityState } from 'react-native-screens';
const FAR_FAR_AWAY = 30000; // this should be big enough to move the whole view out of its container

export default class ResourceSavingScene extends React.Component {
  render() {
    // react-native-screens is buggy on web
    if ((screensEnabled === null || screensEnabled === void 0 ? void 0 : screensEnabled()) && Platform.OS !== 'web') {
      const {
        isVisible,
        ...rest
      } = this.props;

      if (shouldUseActivityState) {
        return (
          /*#__PURE__*/
          // @ts-expect-error: there was an `active` prop and no `activityState` in older version and stackPresentation was required
          React.createElement(Screen, _extends({
            activityState: isVisible ? 2 : 0
          }, rest))
        );
      } else {
        return (
          /*#__PURE__*/
          // @ts-expect-error: there was an `active` prop and no `activityState` in older version and stackPresentation was required
          React.createElement(Screen, _extends({
            active: isVisible ? 1 : 0
          }, rest))
        );
      }
    }

    const {
      isVisible,
      children,
      style,
      ...rest
    } = this.props;
    return /*#__PURE__*/React.createElement(View, _extends({
      style: [styles.container, Platform.OS === 'web' ? {
        display: isVisible ? 'flex' : 'none'
      } : null, style],
      collapsable: false,
      removeClippedSubviews: // On iOS, set removeClippedSubviews to true only when not focused
      // This is an workaround for a bug where the clipped view never re-appears
      Platform.OS === 'ios' ? !isVisible : true,
      pointerEvents: isVisible ? 'auto' : 'none'
    }, rest), /*#__PURE__*/React.createElement(View, {
      style: isVisible ? styles.attached : styles.detached
    }, children));
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  attached: {
    flex: 1
  },
  detached: {
    flex: 1,
    top: FAR_FAR_AWAY
  }
});
//# sourceMappingURL=ResourceSavingScene.js.map