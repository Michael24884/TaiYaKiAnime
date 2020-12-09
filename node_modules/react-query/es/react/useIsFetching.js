import React from 'react';
import { useQueryCache } from './ReactQueryCacheProvider';
import { useIsMounted } from './utils';
export function useIsFetching() {
  var isMounted = useIsMounted();
  var queryCache = useQueryCache();

  var _React$useState = React.useState(queryCache.isFetching),
      isFetching = _React$useState[0],
      setIsFetching = _React$useState[1];

  React.useEffect(function () {
    return queryCache.subscribe(function () {
      if (isMounted()) {
        setIsFetching(queryCache.isFetching);
      }
    });
  }, [queryCache, setIsFetching, isMounted]);
  return isFetching;
}