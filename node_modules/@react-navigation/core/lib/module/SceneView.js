import * as React from 'react';
import NavigationStateContext from './NavigationStateContext';
import StaticContainer from './StaticContainer';
import EnsureSingleNavigator from './EnsureSingleNavigator';
import useOptionsGetters from './useOptionsGetters';

/**
 * Component which takes care of rendering the screen for a route.
 * It provides all required contexts and applies optimizations when applicable.
 */
export default function SceneView({
  screen,
  route,
  navigation,
  routeState,
  getState,
  setState,
  options
}) {
  const navigatorKeyRef = React.useRef();
  const getKey = React.useCallback(() => navigatorKeyRef.current, []);
  const {
    addOptionsGetter
  } = useOptionsGetters({
    key: route.key,
    options,
    navigation
  });
  const setKey = React.useCallback(key => {
    navigatorKeyRef.current = key;
  }, []);
  const getCurrentState = React.useCallback(() => {
    const state = getState();
    const currentRoute = state.routes.find(r => r.key === route.key);
    return currentRoute ? currentRoute.state : undefined;
  }, [getState, route.key]);
  const setCurrentState = React.useCallback(child => {
    const state = getState();
    setState({ ...state,
      routes: state.routes.map(r => r.key === route.key ? { ...r,
        state: child
      } : r)
    });
  }, [getState, route.key, setState]);
  const isInitialRef = React.useRef(true);
  React.useEffect(() => {
    isInitialRef.current = false;
  });
  const getIsInitial = React.useCallback(() => isInitialRef.current, []);
  const context = React.useMemo(() => ({
    state: routeState,
    getState: getCurrentState,
    setState: setCurrentState,
    getKey,
    setKey,
    getIsInitial,
    addOptionsGetter
  }), [routeState, getCurrentState, setCurrentState, getKey, setKey, getIsInitial, addOptionsGetter]);
  const ScreenComponent = screen.getComponent ? screen.getComponent() : screen.component;
  return /*#__PURE__*/React.createElement(NavigationStateContext.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement(EnsureSingleNavigator, null, /*#__PURE__*/React.createElement(StaticContainer, {
    name: screen.name,
    render: ScreenComponent || screen.children,
    navigation: navigation,
    route: route
  }, ScreenComponent !== undefined ? /*#__PURE__*/React.createElement(ScreenComponent, {
    navigation: navigation,
    route: route
  }) : screen.children !== undefined ? screen.children({
    navigation,
    route
  }) : null)));
}
//# sourceMappingURL=SceneView.js.map