import _extends from "@babel/runtime/helpers/esm/extends";
import { getQueryArgs } from '../core/utils';
import { useBaseQuery } from './useBaseQuery'; // A paginated query is more like a "lag" query, which means
// as the query key changes, we keep the results from the
// last query and use them as placeholder data in the next one
// We DON'T use it as initial data though. That's important
// TYPES

// Implementation
export function usePaginatedQuery(arg1, arg2, arg3) {
  var _getQueryArgs = getQueryArgs(arg1, arg2, arg3),
      queryKey = _getQueryArgs[0],
      config = _getQueryArgs[1];

  var result = useBaseQuery(queryKey, _extends({
    keepPreviousData: true
  }, config));
  return _extends({}, result, {
    resolvedData: result.data,
    latestData: result.isPreviousData ? undefined : result.data
  });
}