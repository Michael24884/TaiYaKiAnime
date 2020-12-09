import _extends from "@babel/runtime/helpers/esm/extends";
import { QueryStatus } from './types'; // TYPES

export var CancelledError = function CancelledError(silent) {
  this.silent = silent;
}; // UTILS

var _uid = 0;
export function uid() {
  return _uid++;
}
export var isServer = typeof window === 'undefined';
export function noop() {
  return undefined;
}
export var Console = console || {
  error: noop,
  warn: noop,
  log: noop
};
export function setConsole(c) {
  Console = c;
}
export function functionalUpdate(updater, input) {
  return typeof updater === 'function' ? updater(input) : updater;
}

function stableStringifyReplacer(_key, value) {
  if (typeof value === 'function') {
    throw new Error();
  }

  if (isPlainObject(value)) {
    return Object.keys(value).sort().reduce(function (result, key) {
      result[key] = value[key];
      return result;
    }, {});
  }

  return value;
}

export function stableStringify(value) {
  return JSON.stringify(value, stableStringifyReplacer);
}
export function deepIncludes(a, b) {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'object') {
    return !Object.keys(b).some(function (key) {
      return !deepIncludes(a[key], b[key]);
    });
  }

  return false;
}
export function isValidTimeout(value) {
  return typeof value === 'number' && value >= 0 && value !== Infinity;
}
export function isDocumentVisible() {
  // document global can be unavailable in react native
  if (typeof document === 'undefined') {
    return true;
  }

  return [undefined, 'visible', 'prerender'].includes(document.visibilityState);
}
export function isOnline() {
  return navigator.onLine === undefined || navigator.onLine;
}
export function getQueryArgs(arg1, arg2, arg3, arg4) {
  var queryKey;
  var queryFn;
  var config;
  var options;

  if (isPlainObject(arg1)) {
    queryKey = arg1.queryKey;
    queryFn = arg1.queryFn;
    config = arg1.config;
    options = arg2;
  } else if (isPlainObject(arg2)) {
    queryKey = arg1;
    config = arg2;
    options = arg3;
  } else {
    queryKey = arg1;
    queryFn = arg2;
    config = arg3;
    options = arg4;
  }

  config = config || {};

  if (queryFn) {
    config = _extends({}, config, {
      queryFn: queryFn
    });
  }

  return [queryKey, config, options];
}
/**
 * This function returns `a` if `b` is deeply equal.
 * If not, it will replace any deeply equal children of `b` with those of `a`.
 * This can be used for structural sharing between JSON values for example.
 */

export function replaceEqualDeep(a, b) {
  if (a === b) {
    return a;
  }

  var array = Array.isArray(a) && Array.isArray(b);

  if (array || isPlainObject(a) && isPlainObject(b)) {
    var aSize = array ? a.length : Object.keys(a).length;
    var bItems = array ? b : Object.keys(b);
    var bSize = bItems.length;
    var copy = array ? [] : {};
    var equalItems = 0;

    for (var i = 0; i < bSize; i++) {
      var key = array ? i : bItems[i];
      copy[key] = replaceEqualDeep(a[key], b[key]);

      if (copy[key] === a[key]) {
        equalItems++;
      }
    }

    return aSize === bSize && equalItems === aSize ? a : copy;
  }

  return b;
} // Copied from: https://github.com/jonschlinkert/is-plain-object

export function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  } // If has modified constructor


  var ctor = o.constructor;

  if (typeof ctor === 'undefined') {
    return true;
  } // If has modified prototype


  var prot = ctor.prototype;

  if (!hasObjectPrototype(prot)) {
    return false;
  } // If constructor does not have an Object-specific method


  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  } // Most likely a plain Object


  return true;
}

function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

export function isCancelable(value) {
  return typeof (value == null ? void 0 : value.cancel) === 'function';
}
export function isError(value) {
  return value instanceof Error;
}
export function isCancelledError(value) {
  return value instanceof CancelledError;
}
export function sleep(timeout) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}
export function getStatusProps(status) {
  return {
    status: status,
    isLoading: status === QueryStatus.Loading,
    isSuccess: status === QueryStatus.Success,
    isError: status === QueryStatus.Error,
    isIdle: status === QueryStatus.Idle
  };
}
export function createSetHandler(fn) {
  var removePreviousHandler;
  return function (callback) {
    // Unsub the old handler
    if (removePreviousHandler) {
      removePreviousHandler();
    } // Sub the new handler


    removePreviousHandler = callback(fn);
  };
}
/**
 * Schedules a microtask.
 * This can be useful to schedule state updates after rendering.
 */

export function scheduleMicrotask(callback) {
  Promise.resolve().then(callback).catch(function (error) {
    return setTimeout(function () {
      throw error;
    });
  });
}

// Default to a dummy "batch" implementation that just runs the callback
var batchedUpdates = function batchedUpdates(callback) {
  callback();
}; // Allow injecting another batching function later


export function setBatchedUpdates(fn) {
  batchedUpdates = fn;
} // Supply a getter just to skip dealing with ESM bindings

export function getBatchedUpdates() {
  return batchedUpdates;
}