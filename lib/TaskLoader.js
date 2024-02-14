"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _EventDispatcher2 = _interopRequireDefault(require("seng-event/lib/EventDispatcher"));

var _sequentialPromises = _interopRequireDefault(require("./util/sequentialPromises"));

var _TaskLoaderEvent = _interopRequireDefault(require("./event/TaskLoaderEvent"));

/**
 * @class TaskLoader
 * @description The TaskLoader class is used to manage loading of tasks, it dispatches the task progress so it's
 * super simple to create pre-loaders which load all sorts of files.
 *
 * Example usage:
 * ```typescript
 *    const taskLoader = new TaskLoader();
 *    taskLoader.addEventListener(TaskLoaderEvent.START, event => console.log('start pre-loading)
 *    taskLoader.addEventListener(TaskLoaderEvent.UPDATE, event => console.log(`update, ${event.data.progress}`)
 *    taskLoader.addEventListener(TaskLoaderEvent.COMPLETE, event => console.log('done pre-loading)
 *
 *    taskLoader.loadTasks([
 *      new LoadVideoTask({
 *          assets: 'path/to/video.mp4',
 *          onAssetLoaded: result => console.log(result),
 *      }),
 *      new LoadImageTask({
 *          assets: [
 *              'path/to/image1.jpg',
 *              'path/to/image2.jpg',
 *              'path/to/image3.jpg',
 *              'path/to/image4.jpg',
 *              'path/to/image5.jpg',
 *              'path/to/image6.jpg',
 *          ],
 *          batchSize: 5,
 *          onAssetLoaded: result => console.log(result),
 *      }),
 *    ]).then(() => console.log('all assets have been loaded'));
 * ```
 */
var TaskLoader =
/*#__PURE__*/
function (_EventDispatcher) {
  (0, _inheritsLoose2.default)(TaskLoader, _EventDispatcher);

  function TaskLoader() {
    var _temp, _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_temp = _this = _EventDispatcher.call.apply(_EventDispatcher, [this].concat(args)) || this, Object.defineProperty((0, _assertThisInitialized2.default)(_this), "tasks", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: []
    }), _temp) || (0, _assertThisInitialized2.default)(_this);
  }

  var _proto = TaskLoader.prototype;

  /**
   * @description This method starts loading the tasks. You can provide an array of tasks which all contain their
   * own progress. When everything is done it will resolve the returned promise.
   * @param {Array<LoadTask≤any≥>} tasks
   * @returns {Promise<bool>}
   */
  _proto.loadTasks = function loadTasks(tasks) {
    var _this2 = this;

    // Reset the data
    this.reset(); // Create the task objects

    this.tasks = tasks.reduce(function (tasks, task) {
      tasks.push({
        task: task,
        progress: 0
      });
      return tasks;
    }, []); // Apply the weight to all the tasks to make sure the total equals 1

    var weightPerTask = 1 / tasks.length;
    var weights = tasks.map(function (task) {
      return task.getWeight() * weightPerTask;
    }); // Extra weight value to be added to al tasks to match the total of 1

    var extraWeight = weights.reduce(function (extraWeight, currentWeight) {
      return extraWeight + (weightPerTask - currentWeight);
    }, 0) / tasks.length; // Update the weight on each task

    tasks.forEach(function (task, index) {
      task.setWeight(weights[index] + extraWeight);
    }); // Notify about the starting

    this.dispatchEvent(new _TaskLoaderEvent.default(_TaskLoaderEvent.default.START)); // Start loading the tasks

    return (0, _sequentialPromises.default)(this.tasks.map(function (taskObject) {
      return function () {
        return taskObject.task.load(function (progress) {
          // Update the task progress
          taskObject.progress = progress; // Notify about the progress

          _this2.update();
        });
      };
    })).then(function () {
      return _this2.tasks.forEach(function (taskObject) {
        return taskObject.task.dispose();
      });
    }).then(function () {
      return _this2.dispatchEvent(new _TaskLoaderEvent.default(_TaskLoaderEvent.default.COMPLETE));
    }).catch(function () {
      _this2.dispatchEvent(new _TaskLoaderEvent.default(_TaskLoaderEvent.default.FAILED));

      throw new Error('Loading tasks failed');
    });
  };
  /**
   * @private
   * @method getProgress
   * @description get the total progress of the load action
   * @returns {number}
   */


  _proto.getProgress = function getProgress() {
    // Calculate the total progress
    var totalProgress = this.tasks.reduce(function (totalProgress, currentTask) {
      return totalProgress + currentTask.progress * currentTask.task.getWeight();
    }, 0); // Divide by the amount of tasks

    return this.tasks.length ? totalProgress : 0;
  };
  /**
   * @private
   * @method reset
   * @description Reset the task loader to allow another batch of tasks to run through it.
   */


  _proto.reset = function reset() {
    this.tasks = [];
  };
  /**
   * @private
   * @method update
   * @param {number} progress
   * @description Dispatches the current progress for the task loader
   */


  _proto.update = function update() {
    this.dispatchEvent(new _TaskLoaderEvent.default(_TaskLoaderEvent.default.UPDATE, {
      progress: this.getProgress()
    }));
  };
  /**
   * @public
   * @method dispose
   * @description Dispose the task loader and clean all the variables
   */


  _proto.dispose = function dispose() {
    this.tasks = null;
  };

  return TaskLoader;
}(_EventDispatcher2.default);

exports.default = TaskLoader;