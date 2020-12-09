import type { NavigationState, NavigationAction } from '@react-navigation/routers';
import { ChildBeforeRemoveListener } from './NavigationBuilderContext';
import type { NavigationEventEmitter } from './useEventEmitter';
import type { EventMapCore } from './types';
declare type Options = {
    getState: () => NavigationState;
    emitter: NavigationEventEmitter<EventMapCore<any>>;
    beforeRemoveListeners: Record<string, ChildBeforeRemoveListener | undefined>;
};
export declare const shouldPreventRemove: (emitter: NavigationEventEmitter<EventMapCore<any>>, beforeRemoveListeners: Record<string, ChildBeforeRemoveListener | undefined>, currentRoutes: {
    key: string;
}[], nextRoutes: {
    key?: string | undefined;
}[], action: NavigationAction) => boolean;
export default function useOnPreventRemove({ getState, emitter, beforeRemoveListeners, }: Options): void;
export {};
