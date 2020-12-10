export var QueryStatus;

(function (QueryStatus) {
  QueryStatus["Idle"] = "idle";
  QueryStatus["Loading"] = "loading";
  QueryStatus["Error"] = "error";
  QueryStatus["Success"] = "success";
})(QueryStatus || (QueryStatus = {}));