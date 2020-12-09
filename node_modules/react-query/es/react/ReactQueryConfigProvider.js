import React from 'react';
import { mergeReactQueryConfigs } from '../core/config';
var configContext = /*#__PURE__*/React.createContext(undefined);
export function useContextConfig() {
  return React.useContext(configContext);
}
export var ReactQueryConfigProvider = function ReactQueryConfigProvider(_ref) {
  var config = _ref.config,
      children = _ref.children;
  var parentConfig = useContextConfig();
  var mergedConfig = React.useMemo(function () {
    return parentConfig ? mergeReactQueryConfigs(parentConfig, config) : config;
  }, [config, parentConfig]);
  return /*#__PURE__*/React.createElement(configContext.Provider, {
    value: mergedConfig
  }, children);
};