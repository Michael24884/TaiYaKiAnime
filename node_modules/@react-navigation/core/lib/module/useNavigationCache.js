import * as React from 'react';
import { CommonActions } from '@react-navigation/routers';

/**
 * Hook to cache navigation objects for each screen in the navigator.
 * It's important to cache them to make sure navigation objects don't change between renders.
 * This lets us apply optimizations like `React.memo` to minimize re-rendering screens.
 */
export default function useNavigationCache({
  state,
  getState,
  navigation,
  setOptions,
  router,
  emitter
}) {
  // Cache object which holds navigation objects for each screen
  // We use `React.useMemo` instead of `React.useRef` coz we want to invalidate it when deps change
  // In reality, these deps will rarely change, if ever
  const cache = React.useMemo(() => ({
    current: {}
  }), // eslint-disable-next-line react-hooks/exhaustive-deps
  [getState, navigation, setOptions, router, emitter]);
  const actions = { ...router.actionCreators,
    ...CommonActions
  };
  cache.current = state.routes.reduce((acc, route) => {
    const previous = cache.current[route.key];

    if (previous) {
      // If a cached navigation object already exists, reuse it
      acc[route.key] = previous;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {
        emit,
        ...rest
      } = navigation;

      const dispatch = action => {
        const payload = typeof action === 'function' ? action(getState()) : action;
        navigation.dispatch(typeof payload === 'object' && payload != null ? {
          source: route.key,
          ...payload
        } : payload);
      };

      const helpers = Object.keys(actions).reduce((acc, name) => {
        // @ts-expect-error: name is a valid key, but TypeScript is dumb
        acc[name] = (...args) => dispatch(actions[name](...args));

        return acc;
      }, {});
      acc[route.key] = { ...rest,
        ...helpers,
        ...emitter.create(route.key),
        dispatch,
        setOptions: options => setOptions(o => ({ ...o,
          [route.key]: { ...o[route.key],
            ...options
          }
        })),
        isFocused: () => {
          const state = getState();

          if (state.routes[state.index].key !== route.key) {
            return false;
          } // If the current screen is focused, we also need to check if parent navigator is focused
          // This makes sure that we return the focus state in the whole tree, not just this navigator


          return navigation ? navigation.isFocused() : true;
        }
      };
    }

    return acc;
  }, {});
  return cache.current;
}
//# sourceMappingURL=useNavigationCache.js.map