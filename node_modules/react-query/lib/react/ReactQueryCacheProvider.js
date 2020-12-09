"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ReactQueryCacheProvider = exports.useQueryCache = void 0;

var _react = _interopRequireDefault(require("react"));

var _core = require("../core");

var queryCacheContext = /*#__PURE__*/_react.default.createContext(_core.queryCache);

var useQueryCache = function useQueryCache() {
  return _react.default.useContext(queryCacheContext);
};

exports.useQueryCache = useQueryCache;

var ReactQueryCacheProvider = function ReactQueryCacheProvider(_ref) {
  var queryCache = _ref.queryCache,
      children = _ref.children;

  var resolvedQueryCache = _react.default.useMemo(function () {
    return queryCache || new _core.QueryCache();
  }, [queryCache]);

  _react.default.useEffect(function () {
    _core.queryCaches.push(resolvedQueryCache);

    return function () {
      // remove the cache from the active list
      var i = _core.queryCaches.indexOf(resolvedQueryCache);

      if (i > -1) {
        _core.queryCaches.splice(i, 1);
      } // if the resolvedQueryCache was created by us, we need to tear it down


      if (queryCache == null) {
        resolvedQueryCache.clear({
          notify: false
        });
      }
    };
  }, [resolvedQueryCache, queryCache]);

  return /*#__PURE__*/_react.default.createElement(queryCacheContext.Provider, {
    value: resolvedQueryCache
  }, children);
};

exports.ReactQueryCacheProvider = ReactQueryCacheProvider;