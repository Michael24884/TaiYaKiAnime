import {
  NativeSyntheticEvent,
  NativeScrollEvent,
  NativeScrollPoint,
} from 'react-native';

export default (
  contentOffset?: NativeScrollPoint,
): NativeSyntheticEvent<NativeScrollEvent> => ({
  nativeEvent: {
    contentOffset: { x: 0, y: 50, ...contentOffset },
    contentInset: { top: 0, right: 0, left: 0, bottom: 0 },
    contentSize: { width: 0, height: 0 },
    layoutMeasurement: { width: 0, height: 0 },
    zoomScale: 1,
  },
  bubbles: false,
  cancelable: false,
  currentTarget: 0,
  defaultPrevented: false,
  eventPhase: 0,
  isDefaultPrevented: () => false,
  isPropagationStopped: () => false,
  isTrusted: false,
  persist: () => {},
  preventDefault: () => {},
  stopPropagation: () => false,
  target: 0,
  timeStamp: 0,
  type: '',
});
