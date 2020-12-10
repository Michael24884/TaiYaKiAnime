import { createSetHandler, isServer } from './utils';
import { onVisibilityOrOnlineChange } from './queryCache';
export var setFocusHandler = createSetHandler(function () {
  return onVisibilityOrOnlineChange('focus');
});
setFocusHandler(function (handleFocus) {
  var _window;

  if (isServer || !((_window = window) == null ? void 0 : _window.addEventListener)) {
    return;
  } // Listen to visibillitychange and focus


  window.addEventListener('visibilitychange', handleFocus, false);
  window.addEventListener('focus', handleFocus, false);
  return function () {
    // Be sure to unsubscribe if a new handler is set
    window.removeEventListener('visibilitychange', handleFocus);
    window.removeEventListener('focus', handleFocus);
  };
});