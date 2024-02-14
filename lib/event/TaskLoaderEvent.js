"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _sengEvent = require("seng-event");

var _eventTypeUtils = require("seng-event/lib/util/eventTypeUtils");

var TaskLoaderEvent =
/*#__PURE__*/
function (_AbstractEvent) {
  (0, _inheritsLoose2.default)(TaskLoaderEvent, _AbstractEvent);

  function TaskLoaderEvent(type, data, bubbles, cancelable, setTimeStamp) {
    var _this;

    _this = _AbstractEvent.call(this, type, bubbles, cancelable, setTimeStamp) || this;
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), "data", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: void 0
    });
    _this.data = data;
    return _this;
  }

  var _proto = TaskLoaderEvent.prototype;

  _proto.clone = function clone() {
    return new TaskLoaderEvent(this.type, this.data, this.bubbles, this.cancelable);
  };

  return TaskLoaderEvent;
}(_sengEvent.AbstractEvent);

Object.defineProperty(TaskLoaderEvent, "START", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _eventTypeUtils.EVENT_TYPE_PLACEHOLDER
});
Object.defineProperty(TaskLoaderEvent, "UPDATE", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _eventTypeUtils.EVENT_TYPE_PLACEHOLDER
});
Object.defineProperty(TaskLoaderEvent, "COMPLETE", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _eventTypeUtils.EVENT_TYPE_PLACEHOLDER
});
Object.defineProperty(TaskLoaderEvent, "FAILED", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _eventTypeUtils.EVENT_TYPE_PLACEHOLDER
});
(0, _eventTypeUtils.generateEventTypes)({
  TaskLoaderEvent: TaskLoaderEvent
});
var _default = TaskLoaderEvent;
exports.default = _default;