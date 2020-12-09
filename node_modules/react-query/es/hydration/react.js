import React from 'react';
import { useQueryCache } from 'react-query';
import { hydrate } from './hydration';
export function useHydrate(queries) {
  var queryCache = useQueryCache(); // Running hydrate again with the same queries is safe,
  // it wont overwrite or initialize existing queries,
  // relying on useMemo here is only a performance optimization

  React.useMemo(function () {
    if (queries) {
      hydrate(queryCache, queries);
    }

    return undefined;
  }, [queryCache, queries]);
}
export var Hydrate = function Hydrate(_ref) {
  var state = _ref.state,
      children = _ref.children;
  useHydrate(state);
  return children;
};