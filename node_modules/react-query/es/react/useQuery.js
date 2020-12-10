import { getQueryArgs } from '../core/utils';
import { useBaseQuery } from './useBaseQuery'; // TYPES

// Implementation
export function useQuery(arg1, arg2, arg3) {
  var _getQueryArgs = getQueryArgs(arg1, arg2, arg3),
      queryKey = _getQueryArgs[0],
      config = _getQueryArgs[1];

  return useBaseQuery(queryKey, config);
}