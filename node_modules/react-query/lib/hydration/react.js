"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.useHydrate = useHydrate;
exports.Hydrate = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactQuery = require("react-query");

var _hydration = require("./hydration");

function useHydrate(queries) {
  var queryCache = (0, _reactQuery.useQueryCache)(); // Running hydrate again with the same queries is safe,
  // it wont overwrite or initialize existing queries,
  // relying on useMemo here is only a performance optimization

  _react.default.useMemo(function () {
    if (queries) {
      (0, _hydration.hydrate)(queryCache, queries);
    }

    return undefined;
  }, [queryCache, queries]);
}

var Hydrate = function Hydrate(_ref) {
  var state = _ref.state,
      children = _ref.children;
  useHydrate(state);
  return children;
};

exports.Hydrate = Hydrate;