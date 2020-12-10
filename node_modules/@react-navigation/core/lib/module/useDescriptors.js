import * as React from 'react';
import SceneView from './SceneView';
import NavigationBuilderContext from './NavigationBuilderContext';
import useNavigationCache from './useNavigationCache';
import useRouteCache from './useRouteCache';
import NavigationContext from './NavigationContext';
import NavigationRouteContext from './NavigationRouteContext';

/**
 * Hook to create descriptor objects for the child routes.
 *
 * A descriptor object provides 3 things:
 * - Helper method to render a screen
 * - Options specified by the screen for the navigator
 * - Navigation object intended for the route
 */
export default function useDescriptors({
  state,
  screens,
  navigation,
  screenOptions,
  onAction,
  getState,
  setState,
  addListener,
  addKeyedListener,
  onRouteFocus,
  router,
  emitter
}) {
  const [options, setOptions] = React.useState({});
  const {
    onDispatchAction,
    onOptionsChange
  } = React.useContext(NavigationBuilderContext);
  const context = React.useMemo(() => ({
    navigation,
    onAction,
    addListener,
    addKeyedListener,
    onRouteFocus,
    onDispatchAction,
    onOptionsChange
  }), [navigation, onAction, addListener, addKeyedListener, onRouteFocus, onDispatchAction, onOptionsChange]);
  const navigations = useNavigationCache({
    state,
    getState,
    navigation,
    setOptions,
    router,
    emitter
  });
  const routes = useRouteCache(state.routes);
  return routes.reduce((acc, route, i) => {
    const screen = screens[route.name];
    const navigation = navigations[route.key];
    const routeOptions = { // The default `screenOptions` passed to the navigator
      ...(typeof screenOptions === 'object' || screenOptions == null ? screenOptions : // @ts-expect-error: this is a function, but typescript doesn't think so
      screenOptions({
        route,
        navigation
      })),
      // The `options` prop passed to `Screen` elements
      ...(typeof screen.options === 'object' || screen.options == null ? screen.options : // @ts-expect-error: this is a function, but typescript doesn't think so
      screen.options({
        route,
        navigation
      })),
      // The options set via `navigation.setOptions`
      ...options[route.key]
    };
    acc[route.key] = {
      navigation,

      render() {
        return /*#__PURE__*/React.createElement(NavigationBuilderContext.Provider, {
          key: route.key,
          value: context
        }, /*#__PURE__*/React.createElement(NavigationContext.Provider, {
          value: navigation
        }, /*#__PURE__*/React.createElement(NavigationRouteContext.Provider, {
          value: route
        }, /*#__PURE__*/React.createElement(SceneView, {
          navigation: navigation,
          route: route,
          screen: screen,
          routeState: state.routes[i].state,
          getState: getState,
          setState: setState,
          options: routeOptions
        }))));
      },

      options: routeOptions
    };
    return acc;
  }, {});
}
//# sourceMappingURL=useDescriptors.js.map