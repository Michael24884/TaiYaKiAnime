import { getBatchedUpdates, scheduleMicrotask } from './utils'; // TYPES

// CLASS
export var NotifyManager = /*#__PURE__*/function () {
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
      scheduleMicrotask(function () {
        notify();
      });
    }
  };

  _proto.flush = function flush() {
    var queue = this.queue;
    this.queue = [];

    if (queue.length) {
      scheduleMicrotask(function () {
        var batchedUpdates = getBatchedUpdates();
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

export var notifyManager = new NotifyManager();