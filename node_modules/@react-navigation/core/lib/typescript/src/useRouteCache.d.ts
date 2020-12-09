import type { NavigationState, Route } from '@react-navigation/routers';
/**
 * Utilites such as `getFocusedRouteNameFromRoute` need to access state.
 * So we need a way to suppress the warning for those use cases.
 * This is fine since they are internal utilities and this is not public API.
 */
export declare const SUPPRESS_STATE_ACCESS_WARNING: {
    value: boolean;
};
/**
 * Hook to cache route props for each screen in the navigator.
 * This lets add warnings and modifications to the route object but keep references between renders.
 */
export default function useRouteCache<State extends NavigationState>(routes: State['routes']): Route<string, object | undefined>[];
