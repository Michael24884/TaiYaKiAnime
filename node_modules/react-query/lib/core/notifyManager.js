"use strict";

exports.__esModule = true;
exports.notifyManager = exports.NotifyManager = void 0;

var _utils = require("./utils");

// CLASS
var NotifyManager = /*#__PURE__*/function () {
  function NotifyManager() {
    this.queue = [];
    this.transactions = 0;
  }

  var _proto = NotifyManager.prototype;

  _proto.batch = function batch(callback) {
    this.transactions++;
    var result = callback();
    this.transactions--;

    if (!this.transactions) {
      this.flush();
    }

    return result;
  };

  _proto.schedule = function schedule(notify) {
    if (this.transactions) {
      this.queue.push(notify);
    } else {
      (0, _utils.scheduleMicrotask)(function () {
        notify();
      });
    }
  };

  _proto.flush = function flush() {
    var queue = this.queue;
    this.queue = [];

    if (queue.length) {
      (0, _utils.scheduleMicrotask)(function () {
        var batchedUpdates = (0, _utils.getBatchedUpdates)();
        batchedUpdates(function () {
          queue.forEach(function (notify) {
            notify();
          });
        });
      });
    }
  };

  return NotifyManager;
}(); // SINGLETON


exports.NotifyManager = NotifyManager;
var notifyManager = new NotifyManager();
exports.notifyManager = notifyManager;