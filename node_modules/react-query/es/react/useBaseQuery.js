import React from 'react';
import { useIsMounted } from './utils';
import { getResolvedQueryConfig } from '../core/config';
import { QueryObserver } from '../core/queryObserver';
import { useErrorResetBoundary } from './ReactQueryErrorResetBoundary';
import { useQueryCache } from './ReactQueryCacheProvider';
import { useContextConfig } from './ReactQueryConfigProvider';
export function useBaseQuery(queryKey, config) {
  var _React$useReducer = React.useReducer(function (c) {
    return c + 1;
  }, 0),
      rerender = _React$useReducer[1];

  var isMounted = useIsMounted();
  var cache = useQueryCache();
  var contextConfig = useContextConfig();
  var errorResetBoundary = useErrorResetBoundary(); // Get resolved config

  var resolvedConfig = getResolvedQueryConfig(cache, queryKey, contextConfig, config); // Create query observer

  var observerRef = React.useRef();
  var firstRender = !observerRef.current;
  var observer = observerRef.current || new QueryObserver(resolvedConfig);
  observerRef.current = observer; // Subscribe to the observer

  React.useEffect(function () {
    errorResetBoundary.clearReset();
    return observer.subscribe(function () {
      if (isMounted()) {
        rerender();
      }
    });
  }, [isMounted, observer, rerender, errorResetBoundary]); // Update config

  if (!firstRender) {
    observer.updateConfig(resolvedConfig);
  }

  var result = observer.getCurrentResult(); // Handle suspense

  if (resolvedConfig.suspense || resolvedConfig.useErrorBoundary) {
    var query = observer.getCurrentQuery();

    if (result.isError && !errorResetBoundary.isReset() && query.state.throwInErrorBoundary) {
      throw result.error;
    }

    if (resolvedConfig.enabled && resolvedConfig.suspense && !result.isSuccess) {
      errorResetBoundary.clearReset();
      var unsubscribe = observer.subscribe();
      throw observer.fetch().finally(unsubscribe);
    }
  }

  return result;
}