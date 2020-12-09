"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.uid = uid;
exports.noop = noop;
exports.setConsole = setConsole;
exports.functionalUpdate = functionalUpdate;
exports.stableStringify = stableStringify;
exports.deepIncludes = deepIncludes;
exports.isValidTimeout = isValidTimeout;
exports.isDocumentVisible = isDocumentVisible;
exports.isOnline = isOnline;
exports.getQueryArgs = getQueryArgs;
exports.replaceEqualDeep = replaceEqualDeep;
exports.isPlainObject = isPlainObject;
exports.isCancelable = isCancelable;
exports.isError = isError;
exports.isCancelledError = isCancelledError;
exports.sleep = sleep;
exports.getStatusProps = getStatusProps;
exports.createSetHandler = createSetHandler;
exports.scheduleMicrotask = scheduleMicrotask;
exports.setBatchedUpdates = setBatchedUpdates;
exports.getBatchedUpdates = getBatchedUpdates;
exports.Console = exports.isServer = exports.CancelledError = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _types = require("./types");

var CancelledError = function CancelledError(silent) {
  this.silent = silent;
}; // UTILS


exports.CancelledError = CancelledError;
var _uid = 0;

function uid() {
  return _uid++;
}

var isServer = typeof window === 'undefined';
exports.isServer = isServer;

function noop() {
  return undefined;
}

var Console = console || {
  error: noop,
  warn: noop,
  log: noop
};
exports.Console = Console;

function setConsole(c) {
  exports.Console = Console = c;
}

function functionalUpdate(updater, input) {
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

function stableStringify(value) {
  return JSON.stringify(value, stableStringifyReplacer);
}

function deepIncludes(a, b) {
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

function isValidTimeout(value) {
  return typeof value === 'number' && value >= 0 && value !== Infinity;
}

function isDocumentVisible() {
  // document global can be unavailable in react native
  if (typeof document === 'undefined') {
    return true;
  }

  return [undefined, 'visible', 'prerender'].includes(document.visibilityState);
}

function isOnline() {
  return navigator.onLine === undefined || navigator.onLine;
}

function getQueryArgs(arg1, arg2, arg3, arg4) {
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
    config = (0, _extends2.default)({}, config, {
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


function replaceEqualDeep(a, b) {
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


function isPlainObject(o) {
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

function isCancelable(value) {
  return typeof (value == null ? void 0 : value.cancel) === 'function';
}

function isError(value) {
  return value instanceof Error;
}

function isCancelledError(value) {
  return value instanceof CancelledError;
}

function sleep(timeout) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}

function getStatusProps(status) {
  return {
    status: status,
    isLoading: status === _types.QueryStatus.Loading,
    isSuccess: status === _types.QueryStatus.Success,
    isError: status === _types.QueryStatus.Error,
    isIdle: status === _types.QueryStatus.Idle
  };
}

function createSetHandler(fn) {
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


function scheduleMicrotask(callback) {
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


function setBatchedUpdates(fn) {
  batchedUpdates = fn;
} // Supply a getter just to skip dealing with ESM bindings


function getBatchedUpdates() {
  return batchedUpdates;
}