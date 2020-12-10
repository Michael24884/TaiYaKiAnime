import * as React from 'react';
import { CommonActions } from '@react-navigation/routers';
import NavigationContext from './NavigationContext';
import UnhandledActionContext from './UnhandledActionContext';
import { PrivateValueStore } from './types'; // This is to make TypeScript compiler happy
// eslint-disable-next-line babel/no-unused-expressions

PrivateValueStore;

/**
 * Navigation object with helper methods to be used by a navigator.
 * This object includes methods for common actions as well as methods the parent screen's navigation object.
 */
export default function useNavigationHelpers({
  onAction,
  getState,
  emitter,
  router
}) {
  const onUnhandledAction = React.useContext(UnhandledActionContext);
  const parentNavigationHelpers = React.useContext(NavigationContext);
  return React.useMemo(() => {
    const dispatch = op => {
      const action = typeof op === 'function' ? op(getState()) : op;
      const handled = onAction(action);

      if (!handled) {
        onUnhandledAction === null || onUnhandledAction === void 0 ? void 0 : onUnhandledAction(action);
      }
    };

    const actions = { ...router.actionCreators,
      ...CommonActions
    };
    const helpers = Object.keys(actions).reduce((acc, name) => {
      // @ts-expect-error: name is a valid key, but TypeScript is dumb
      acc[name] = (...args) => dispatch(actions[name](...args));

      return acc;
    }, {});
    return { ...parentNavigationHelpers,
      ...helpers,
      dispatch,
      emit: emitter.emit,
      isFocused: parentNavigationHelpers ? parentNavigationHelpers.isFocused : () => true,
      canGoBack: () => {
        const state = getState();
        return router.getStateForAction(state, CommonActions.goBack(), {
          routeNames: state.routeNames,
          routeParamList: {}
        }) !== null || (parentNavigationHelpers === null || parentNavigationHelpers === void 0 ? void 0 : parentNavigationHelpers.canGoBack()) || false;
      },
      dangerouslyGetParent: () => parentNavigationHelpers,
      dangerouslyGetState: getState
    };
  }, [emitter.emit, getState, onAction, onUnhandledAction, parentNavigationHelpers, router]);
}
//# sourceMappingURL=useNavigationHelpers.js.map