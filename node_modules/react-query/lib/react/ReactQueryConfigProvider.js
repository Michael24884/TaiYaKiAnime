"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.useContextConfig = useContextConfig;
exports.ReactQueryConfigProvider = void 0;

var _react = _interopRequireDefault(require("react"));

var _config = require("../core/config");

var configContext = /*#__PURE__*/_react.default.createContext(undefined);

function useContextConfig() {
  return _react.default.useContext(configContext);
}

var ReactQueryConfigProvider = function ReactQueryConfigProvider(_ref) {
  var config = _ref.config,
      children = _ref.children;
  var parentConfig = useContextConfig();

  var mergedConfig = _react.default.useMemo(function () {
    return parentConfig ? (0, _config.mergeReactQueryConfigs)(parentConfig, config) : config;
  }, [config, parentConfig]);

  return /*#__PURE__*/_react.default.createElement(configContext.Provider, {
    value: mergedConfig
  }, children);
};

exports.ReactQueryConfigProvider = ReactQueryConfigProvider;