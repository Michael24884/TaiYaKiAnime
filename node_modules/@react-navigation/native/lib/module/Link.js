import * as React from 'react';
import { Text, Platform } from 'react-native';
import useLinkProps from './useLinkProps';

/**
 * Component to render link to another screen using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.to Absolute path to screen (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 * @param props.children Child elements to render the content.
 */
export default function Link({
  to,
  action,
  ...rest
}) {
  const props = useLinkProps({
    to,
    action
  });

  const onPress = e => {
    if ('onPress' in rest) {
      var _rest$onPress;

      (_rest$onPress = rest.onPress) === null || _rest$onPress === void 0 ? void 0 : _rest$onPress.call(rest, e);
    }

    props.onPress(e);
  };

  return /*#__PURE__*/React.createElement(Text, { ...props,
    ...rest,
    ...Platform.select({
      web: {
        onClick: onPress
      },
      default: {
        onPress
      }
    })
  });
}
//# sourceMappingURL=Link.js.map