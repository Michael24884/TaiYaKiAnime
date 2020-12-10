import * as React from 'react';
import NavigationBuilderContext from './NavigationBuilderContext';
import NavigationRouteContext from './NavigationRouteContext';
import isArrayEqual from './isArrayEqual';
export default function useOnGetState({
  getState,
  getStateListeners
}) {
  const {
    addKeyedListener
  } = React.useContext(NavigationBuilderContext);
  const route = React.useContext(NavigationRouteContext);
  const key = route ? route.key : 'root';
  const getRehydratedState = React.useCallback(() => {
    const state = getState(); // Avoid returning new route objects if we don't need to

    const routes = state.routes.map(route => {
      var _getStateListeners$ro;

      const childState = (_getStateListeners$ro = getStateListeners[route.key]) === null || _getStateListeners$ro === void 0 ? void 0 : _getStateListeners$ro.call(getStateListeners);

      if (route.state === childState) {
        return route;
      }

      return { ...route,
        state: childState
      };
    });

    if (isArrayEqual(state.routes, routes)) {
      return state;
    }

    return { ...state,
      routes
    };
  }, [getState, getStateListeners]);
  React.useEffect(() => {
    return addKeyedListener === null || addKeyedListener === void 0 ? void 0 : addKeyedListener('getState', key, getRehydratedState);
  }, [addKeyedListener, getRehydratedState, key]);
}
//# sourceMappingURL=useOnGetState.js.map