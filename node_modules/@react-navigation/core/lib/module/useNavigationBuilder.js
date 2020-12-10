import * as React from 'react';
import { isValidElementType } from 'react-is';
import { CommonActions } from '@react-navigation/routers';
import NavigationStateContext from './NavigationStateContext';
import NavigationRouteContext from './NavigationRouteContext';
import Screen from './Screen';
import useEventEmitter from './useEventEmitter';
import useRegisterNavigator from './useRegisterNavigator';
import useDescriptors from './useDescriptors';
import useNavigationHelpers from './useNavigationHelpers';
import useOnAction from './useOnAction';
import useFocusEvents from './useFocusEvents';
import useOnRouteFocus from './useOnRouteFocus';
import useChildListeners from './useChildListeners';
import useFocusedListenersChildrenAdapter from './useFocusedListenersChildrenAdapter';
import useKeyedChildListeners from './useKeyedChildListeners';
import useOnGetState from './useOnGetState';
import useScheduleUpdate from './useScheduleUpdate';
import useCurrentRender from './useCurrentRender';
import isArrayEqual from './isArrayEqual';
import { PrivateValueStore } from './types'; // This is to make TypeScript compiler happy
// eslint-disable-next-line babel/no-unused-expressions

PrivateValueStore;

/**
 * Extract route config object from React children elements.
 *
 * @param children React Elements to extract the config from.
 */
const getRouteConfigsFromChildren = children => {
  const configs = React.Children.toArray(children).reduce((acc, child) => {
    var _child$type, _child$props;

    if ( /*#__PURE__*/React.isValidElement(child)) {
      if (child.type === Screen) {
        // We can only extract the config from `Screen` elements
        // If something else was rendered, it's probably a bug
        acc.push(child.props);
        return acc;
      }

      if (child.type === React.Fragment) {
        // When we encounter a fragment, we need to dive into its children to extract the configs
        // This is handy to conditionally define a group of screens
        acc.push(...getRouteConfigsFromChildren(child.props.children));
        return acc;
      }
    }

    throw new Error("A navigator can only contain 'Screen' components as its direct children (found ".concat( /*#__PURE__*/React.isValidElement(child) ? "'".concat(typeof child.type === 'string' ? child.type : (_child$type = child.type) === null || _child$type === void 0 ? void 0 : _child$type.name, "'").concat(((_child$props = child.props) === null || _child$props === void 0 ? void 0 : _child$props.name) ? " for the screen '".concat(child.props.name, "'") : '') : typeof child === 'object' ? JSON.stringify(child) : "'".concat(String(child), "'"), "). To render this component in the navigator, pass it in the 'component' prop to 'Screen'."));
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    configs.forEach(config => {
      const {
        name,
        children,
        component,
        getComponent
      } = config;

      if (typeof name !== 'string' || !name) {
        throw new Error("Got an invalid name (".concat(JSON.stringify(name), ") for the screen. It must be a non-empty string."));
      }

      if (children != null || component !== undefined || getComponent !== undefined) {
        if (children != null && component !== undefined) {
          throw new Error("Got both 'component' and 'children' props for the screen '".concat(name, "'. You must pass only one of them."));
        }

        if (children != null && getComponent !== undefined) {
          throw new Error("Got both 'getComponent' and 'children' props for the screen '".concat(name, "'. You must pass only one of them."));
        }

        if (component !== undefined && getComponent !== undefined) {
          throw new Error("Got both 'component' and 'getComponent' props for the screen '".concat(name, "'. You must pass only one of them."));
        }

        if (children != null && typeof children !== 'function') {
          throw new Error("Got an invalid value for 'children' prop for the screen '".concat(name, "'. It must be a function returning a React Element."));
        }

        if (component !== undefined && !isValidElementType(component)) {
          throw new Error("Got an invalid value for 'component' prop for the screen '".concat(name, "'. It must be a valid React Component."));
        }

        if (getComponent !== undefined && typeof getComponent !== 'function') {
          throw new Error("Got an invalid value for 'getComponent' prop for the screen '".concat(name, "'. It must be a function returning a React Component."));
        }

        if (typeof component === 'function' && component.name === 'component') {
          // Inline anonymous functions passed in the `component` prop will have the name of the prop
          // It's relatively safe to assume that it's not a component since it should also have PascalCase name
          // We won't catch all scenarios here, but this should catch a good chunk of incorrect use.
          console.warn("Looks like you're passing an inline function for 'component' prop for the screen '".concat(name, "' (e.g. component={() => <SomeComponent />}). Passing an inline function will cause the component state to be lost on re-render and cause perf issues since it's re-created every render. You can pass the function as children to 'Screen' instead to achieve the desired behaviour."));
        }
      } else {
        throw new Error("Couldn't find a 'component', 'getComponent' or 'children' prop for the screen '".concat(name, "'. This can happen if you passed 'undefined'. You likely forgot to export your component from the file it's defined in, or mixed up default import and named import when importing."));
      }
    });
  }

  return configs;
};
/**
 * Hook for building navigators.
 *
 * @param createRouter Factory method which returns router object.
 * @param options Options object containing `children` and additional options for the router.
 * @returns An object containing `state`, `navigation`, `descriptors` objects.
 */


export default function useNavigationBuilder(createRouter, options) {
  const navigatorKey = useRegisterNavigator();
  const route = React.useContext(NavigationRouteContext);
  const {
    children,
    ...rest
  } = options;
  const {
    current: router
  } = React.useRef(createRouter({ ...rest,
    ...((route === null || route === void 0 ? void 0 : route.params) && route.params.state == null && route.params.initial !== false && typeof route.params.screen === 'string' ? {
      initialRouteName: route.params.screen
    } : null)
  }));
  const routeConfigs = getRouteConfigsFromChildren(children);
  const screens = routeConfigs.reduce((acc, config) => {
    if (config.name in acc) {
      throw new Error("A navigator cannot contain multiple 'Screen' components with the same name (found duplicate screen named '".concat(config.name, "')"));
    }

    acc[config.name] = config;
    return acc;
  }, {});
  const routeNames = routeConfigs.map(config => config.name);
  const routeParamList = routeNames.reduce((acc, curr) => {
    var _route$params, _route$params2, _route$params3;

    const {
      initialParams
    } = screens[curr];
    const initialParamsFromParams = (route === null || route === void 0 ? void 0 : (_route$params = route.params) === null || _route$params === void 0 ? void 0 : _route$params.state) == null && (route === null || route === void 0 ? void 0 : (_route$params2 = route.params) === null || _route$params2 === void 0 ? void 0 : _route$params2.initial) !== false && (route === null || route === void 0 ? void 0 : (_route$params3 = route.params) === null || _route$params3 === void 0 ? void 0 : _route$params3.screen) === curr ? route.params.params : undefined;
    acc[curr] = initialParams !== undefined || initialParamsFromParams !== undefined ? { ...initialParams,
      ...initialParamsFromParams
    } : undefined;
    return acc;
  }, {});

  if (!routeNames.length) {
    throw new Error("Couldn't find any screens for the navigator. Have you defined any screens as its children?");
  }

  const isStateValid = React.useCallback(state => state.type === undefined || state.type === router.type, [router.type]);
  const isStateInitialized = React.useCallback(state => state !== undefined && state.stale === false && isStateValid(state), [isStateValid]);
  const {
    state: currentState,
    getState: getCurrentState,
    setState,
    setKey,
    getKey,
    getIsInitial
  } = React.useContext(NavigationStateContext);
  const [initializedState, isFirstStateInitialization] = React.useMemo(() => {
    var _route$params4;

    // If the current state isn't initialized on first render, we initialize it
    // We also need to re-initialize it if the state passed from parent was changed (maybe due to reset)
    // Otherwise assume that the state was provided as initial state
    // So we need to rehydrate it to make it usable
    if ((currentState === undefined || !isStateValid(currentState)) && (route === null || route === void 0 ? void 0 : (_route$params4 = route.params) === null || _route$params4 === void 0 ? void 0 : _route$params4.state) == null) {
      return [router.getInitialState({
        routeNames,
        routeParamList
      }), true];
    } else {
      var _route$params$state, _route$params5;

      return [router.getRehydratedState((_route$params$state = route === null || route === void 0 ? void 0 : (_route$params5 = route.params) === null || _route$params5 === void 0 ? void 0 : _route$params5.state) !== null && _route$params$state !== void 0 ? _route$params$state : currentState, {
        routeNames,
        routeParamList
      }), false];
    } // We explicitly don't include routeNames/routeParamList in the dep list
    // below. We want to avoid forcing a new state to be calculated in cases
    // where routeConfigs change without affecting routeNames/routeParamList.
    // Instead, we handle changes to these in the nextState code below. Note
    // that some changes to routeConfigs are explicitly ignored, such as changes
    // to initialParams
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [currentState, router, isStateValid]);
  let state = // If the state isn't initialized, or stale, use the state we initialized instead
  // The state won't update until there's a change needed in the state we have initalized locally
  // So it'll be `undefined` or stale until the first navigation event happens
  isStateInitialized(currentState) ? currentState : initializedState;
  let nextState = state;

  if (!isArrayEqual(state.routeNames, routeNames)) {
    // When the list of route names change, the router should handle it to remove invalid routes
    nextState = router.getStateForRouteNamesChange(state, {
      routeNames,
      routeParamList
    });
  }

  const previousNestedParamsRef = React.useRef(route === null || route === void 0 ? void 0 : route.params);
  React.useEffect(() => {
    previousNestedParamsRef.current = route === null || route === void 0 ? void 0 : route.params;
  }, [route === null || route === void 0 ? void 0 : route.params]);

  if (route === null || route === void 0 ? void 0 : route.params) {
    const previousParams = previousNestedParamsRef.current;
    let action;

    if (typeof route.params.state === 'object' && route.params.state != null && route.params.state !== (previousParams === null || previousParams === void 0 ? void 0 : previousParams.state)) {
      // If the route was updated with new state, we should reset to it
      action = CommonActions.reset(route.params.state);
    } else if (typeof route.params.screen === 'string' && (route.params.initial === false && isFirstStateInitialization || route.params !== previousParams)) {
      // FIXME: Since params are merged, `route.params.params` might contain params from an older route
      // If the route was updated with new screen name and/or params, we should navigate there
      action = CommonActions.navigate(route.params.screen, route.params.params);
    } // The update should be limited to current navigator only, so we call the router manually


    const updatedState = action ? router.getStateForAction(nextState, action, {
      routeNames,
      routeParamList
    }) : null;
    nextState = updatedState !== null ? router.getRehydratedState(updatedState, {
      routeNames,
      routeParamList
    }) : nextState;
  }

  const shouldUpdate = state !== nextState;
  useScheduleUpdate(() => {
    if (shouldUpdate) {
      // If the state needs to be updated, we'll schedule an update
      setState(nextState);
    }
  }); // The up-to-date state will come in next render, but we don't need to wait for it
  // We can't use the outdated state since the screens have changed, which will cause error due to mismatched config
  // So we override the state object we return to use the latest state as soon as possible

  state = nextState;
  React.useEffect(() => {
    setKey(navigatorKey);

    if (!getIsInitial()) {
      // If it's not initial render, we need to update the state
      // This will make sure that our container gets notifier of state changes due to new mounts
      // This is necessary for proper screen tracking, URL updates etc.
      setState(nextState);
    }

    return () => {
      // We need to clean up state for this navigator on unmount
      // We do it in a timeout because we need to detect if another navigator mounted in the meantime
      // For example, if another navigator has started rendering, we should skip cleanup
      // Otherwise, our cleanup step will cleanup state for the other navigator and re-initialize it
      setTimeout(() => {
        if (getCurrentState() !== undefined && getKey() === navigatorKey) {
          setState(undefined);
        }
      }, 0);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // We initialize this ref here to avoid a new getState getting initialized
  // whenever initializedState changes. We want getState to have access to the
  // latest initializedState, but don't need it to change when that happens

  const initializedStateRef = React.useRef();
  initializedStateRef.current = initializedState;
  const getState = React.useCallback(() => {
    const currentState = getCurrentState();
    return isStateInitialized(currentState) ? currentState : initializedStateRef.current;
  }, [getCurrentState, isStateInitialized]);
  const emitter = useEventEmitter(e => {
    let routeNames = [];
    let route;

    if (e.target) {
      var _route;

      route = state.routes.find(route => route.key === e.target);

      if ((_route = route) === null || _route === void 0 ? void 0 : _route.name) {
        routeNames.push(route.name);
      }
    } else {
      route = state.routes[state.index];
      routeNames.push(...Object.keys(screens).filter(name => {
        var _route2;

        return ((_route2 = route) === null || _route2 === void 0 ? void 0 : _route2.name) === name;
      }));
    }

    if (route == null) {
      return;
    }

    const navigation = descriptors[route.key].navigation;
    const listeners = [].concat(...routeNames.map(name => {
      const {
        listeners
      } = screens[name];
      const map = typeof listeners === 'function' ? listeners({
        route: route,
        navigation
      }) : listeners;
      return map ? Object.keys(map).filter(type => type === e.type).map(type => map === null || map === void 0 ? void 0 : map[type]) : undefined;
    })).filter((cb, i, self) => cb && self.lastIndexOf(cb) === i);
    listeners.forEach(listener => listener === null || listener === void 0 ? void 0 : listener(e));
  });
  useFocusEvents({
    state,
    emitter
  });
  React.useEffect(() => {
    emitter.emit({
      type: 'state',
      data: {
        state
      }
    });
  }, [emitter, state]);
  const {
    listeners: childListeners,
    addListener
  } = useChildListeners();
  const {
    keyedListeners,
    addKeyedListener
  } = useKeyedChildListeners();
  const onAction = useOnAction({
    router,
    getState,
    setState,
    key: route === null || route === void 0 ? void 0 : route.key,
    actionListeners: childListeners.action,
    beforeRemoveListeners: keyedListeners.beforeRemove,
    routerConfigOptions: {
      routeNames,
      routeParamList
    },
    emitter
  });
  const onRouteFocus = useOnRouteFocus({
    router,
    key: route === null || route === void 0 ? void 0 : route.key,
    getState,
    setState
  });
  const navigation = useNavigationHelpers({
    onAction,
    getState,
    emitter,
    router
  });
  useFocusedListenersChildrenAdapter({
    navigation,
    focusedListeners: childListeners.focus
  });
  useOnGetState({
    getState,
    getStateListeners: keyedListeners.getState
  });
  const descriptors = useDescriptors({
    state,
    screens,
    navigation,
    screenOptions: options.screenOptions,
    onAction,
    getState,
    setState,
    onRouteFocus,
    addListener,
    addKeyedListener,
    router,
    emitter
  });
  useCurrentRender({
    state,
    navigation,
    descriptors
  });
  return {
    state,
    navigation,
    descriptors
  };
}
//# sourceMappingURL=useNavigationBuilder.js.map