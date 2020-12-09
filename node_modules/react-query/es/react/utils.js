import React from 'react';
import { isServer } from '../core/utils';
export function useIsMounted() {
  var mountedRef = React.useRef(false);
  var isMounted = React.useCallback(function () {
    return mountedRef.current;
  }, []);
  React[isServer ? 'useEffect' : 'useLayoutEffect'](function () {
    mountedRef.current = true;
    return function () {
      mountedRef.current = false;
    };
  }, []);
  return isMounted;
}
export function useMountedCallback(callback) {
  var isMounted = useIsMounted();
  return React.useCallback(function () {
    if (isMounted()) {
      return callback.apply(void 0, arguments);
    }
  }, [callback, isMounted]);
}