import React from 'react';
import { QueryCache, queryCache as defaultQueryCache, queryCaches } from '../core';
var queryCacheContext = /*#__PURE__*/React.createContext(defaultQueryCache);
export var useQueryCache = function useQueryCache() {
  return React.useContext(queryCacheContext);
};
export var ReactQueryCacheProvider = function ReactQueryCacheProvider(_ref) {
  var queryCache = _ref.queryCache,
      children = _ref.children;
  var resolvedQueryCache = React.useMemo(function () {
    return queryCache || new QueryCache();
  }, [queryCache]);
  React.useEffect(function () {
    queryCaches.push(resolvedQueryCache);
    return function () {
      // remove the cache from the active list
      var i = queryCaches.indexOf(resolvedQueryCache);

      if (i > -1) {
        queryCaches.splice(i, 1);
      } // if the resolvedQueryCache was created by us, we need to tear it down


      if (queryCache == null) {
        resolvedQueryCache.clear({
          notify: false
        });
      }
    };
  }, [resolvedQueryCache, queryCache]);
  return /*#__PURE__*/React.createElement(queryCacheContext.Provider, {
    value: resolvedQueryCache
  }, children);
};