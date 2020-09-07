function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from 'react';

class SceneComponent extends React.PureComponent {
  render() {
    const _this$props = this.props,
          {
      component
    } = _this$props,
          rest = _objectWithoutProperties(_this$props, ["component"]);

    return /*#__PURE__*/React.createElement(component, rest);
  }

}

export default function SceneMap(scenes) {
  return ({
    route,
    jumpTo,
    position
  }) => /*#__PURE__*/React.createElement(SceneComponent, {
    key: route.key,
    component: scenes[route.key],
    route: route,
    jumpTo: jumpTo,
    position: position
  });
}
//# sourceMappingURL=SceneMap.js.map