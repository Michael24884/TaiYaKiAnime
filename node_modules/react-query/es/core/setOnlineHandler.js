import { createSetHandler, isServer } from './utils';
import { onVisibilityOrOnlineChange } from './queryCache';
export var setOnlineHandler = createSetHandler(function () {
  return onVisibilityOrOnlineChange('online');
});
setOnlineHandler(function (handleOnline) {
  var _window;

  if (isServer || !((_window = window) == null ? void 0 : _window.addEventListener)) {
    return;
  } // Listen to online


  window.addEventListener('online', handleOnline, false);
  return function () {
    // Be sure to unsubscribe if a new handler is set
    window.removeEventListener('online', handleOnline);
  };
});