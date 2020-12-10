"use strict";

exports.__esModule = true;
exports.mockVisibilityState = mockVisibilityState;
exports.mockNavigatorOnLine = mockNavigatorOnLine;
exports.mockConsoleError = mockConsoleError;
exports.queryKey = queryKey;
exports.sleep = sleep;
exports.waitForMs = waitForMs;
exports.expectType = void 0;

var _react = require("@testing-library/react");

var queryKeyCount = 0;

function mockVisibilityState(value) {
  Object.defineProperty(document, 'visibilityState', {
    value: value,
    configurable: true
  });
}

function mockNavigatorOnLine(value) {
  Object.defineProperty(navigator, 'onLine', {
    value: value,
    configurable: true
  });
}

function mockConsoleError() {
  var consoleMock = jest.spyOn(console, 'error');
  consoleMock.mockImplementation(function () {
    return undefined;
  });
  return consoleMock;
}

function queryKey() {
  queryKeyCount++;
  return "query_" + queryKeyCount;
}

function sleep(timeout) {
  return new Promise(function (resolve, _reject) {
    setTimeout(resolve, timeout);
  });
}

function waitForMs(ms) {
  var end = Date.now() + ms;
  return (0, _react.waitFor)(function () {
    if (Date.now() < end) {
      throw new Error('Time not elapsed yet');
    }
  });
}
/**
 * Checks that `T` is of type `U`.
 */


/**
 * Assert the parameter is of a specific type.
 */
var expectType = function expectType(_) {
  return undefined;
};

exports.expectType = expectType;