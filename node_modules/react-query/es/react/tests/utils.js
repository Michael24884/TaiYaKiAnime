import { waitFor } from '@testing-library/react';
var queryKeyCount = 0;
export function mockVisibilityState(value) {
  Object.defineProperty(document, 'visibilityState', {
    value: value,
    configurable: true
  });
}
export function mockNavigatorOnLine(value) {
  Object.defineProperty(navigator, 'onLine', {
    value: value,
    configurable: true
  });
}
export function mockConsoleError() {
  var consoleMock = jest.spyOn(console, 'error');
  consoleMock.mockImplementation(function () {
    return undefined;
  });
  return consoleMock;
}
export function queryKey() {
  queryKeyCount++;
  return "query_" + queryKeyCount;
}
export function sleep(timeout) {
  return new Promise(function (resolve, _reject) {
    setTimeout(resolve, timeout);
  });
}
export function waitForMs(ms) {
  var end = Date.now() + ms;
  return waitFor(function () {
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
export var expectType = function expectType(_) {
  return undefined;
};