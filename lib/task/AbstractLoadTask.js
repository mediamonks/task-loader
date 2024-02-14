"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _sengEvent = _interopRequireDefault(require("seng-event"));

var _sequentialPromises = _interopRequireDefault(require("../util/sequentialPromises"));

var _CacheManager = _interopRequireDefault(require("../CacheManager"));

var _TaskLoaderEvent = _interopRequireDefault(require("../event/TaskLoaderEvent"));

var LoadTask =
/*#__PURE__*/
function (_EventDispatcher) {
  (0, _inheritsLoose2.default)(LoadTask, _EventDispatcher);

  /**
   * @description Array containing the batches of assets to be loaded
   * @type {Array}
   */

  /**
   * @description The default options for a task
   */
  function LoadTask(options) {
    var _this;

    _this = _EventDispatcher.call(this) || this; // Assets must be an array, so if it's not provided we create it

    Object.defineProperty((0, _assertThisInitialized2.default)(_this), "batches", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: []
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), "options", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        assets: [],
        batchSize: 1,
        weight: 1,
        cacheNameSpace: null,
        cached: true
      }
    });
    options.assets = !Array.isArray(options.assets) ? [options.assets] : options.assets; // Merge the options

    _this.options = Object.assign(_this.options, options); // Create the batches

    _this.createBatches();

    return _this;
  }
  /**
   * @public
   * @description Actually load the asset, this method should be overwritten in the parent class!
   * @method loadAsset
   * @param {string} src
   * @returns {Promise<T>}
   */


  var _proto = LoadTask.prototype;

  /**
   * @public
   * @method setWeight
   * @param {number} weight
   */
  _proto.setWeight = function setWeight(weight) {
    this.options.weight = weight;
  };
  /**
   * @public
   * @method getWeight
   * @param {number} weight
   */


  _proto.getWeight = function getWeight() {
    return this.options.weight;
  };
  /**
   * @public
   * @method load
   * @param {(progress: number) => void} update
   * @returns {Promise<void>}
   */


  _proto.load = function load(update) {
    var _this2 = this;

    var batchProgress = this.batches.map(function () {
      return 0;
    }); // Dispatch an event about the start

    this.dispatchEvent(new _TaskLoaderEvent.default(_TaskLoaderEvent.default.START));
    return (0, _sequentialPromises.default)(this.batches.map(function (batch, batchIndex) {
      return function () {
        return _this2.parseBatch(batch, function (progress) {
          batchProgress[batchIndex] = progress; // Calculate the total progress for the task

          var totalProgress = batchProgress.reduce(function (totalProgress, currentProgress) {
            return totalProgress + currentProgress;
          }, 0) / batchProgress.length; // Dispatch an event with the task progress

          _this2.dispatchEvent(new _TaskLoaderEvent.default(_TaskLoaderEvent.default.UPDATE, {
            progress: totalProgress
          })); // Trigger the callback if provided


          if (update) {
            // Update with the batch progress total value
            update(totalProgress);
          }
        });
      };
    })).then(function () {
      _this2.dispatchEvent(new _TaskLoaderEvent.default(_TaskLoaderEvent.default.COMPLETE));
    }).catch(function (reason) {
      _this2.dispatchEvent(new _TaskLoaderEvent.default(_TaskLoaderEvent.default.FAILED));

      throw new Error("Task failed: " + reason);
    });
  };
  /**
   * @private
   * @method loadBatch
   * @description Load a batch of assets, we can do multiple xhr requests at the same time!
   * @param {Array<IBatch>} batch
   * @param {(progress: number) => void} update
   * @returns {Promise<void>}
   */


  _proto.parseBatch = function parseBatch(batch, update) {
    var _this3 = this;

    return new Promise(function (resolve, reject) {
      var batchProgress = batch.map(function () {
        return 0;
      });
      Promise.all(batch.map(function (item) {
        return _this3.loadBatch(item, batchProgress, update).then(function (asset) {
          // Return the asset through the asset loaded callback method
          if (_this3.options.onAssetLoaded) {
            _this3.options.onAssetLoaded({
              asset: asset,
              index: item.index
            });
          }
        });
      })).then(function () {
        return resolve();
      }).catch(function (reason) {
        return reject(reason);
      });
    });
  };
  /**
   * @protected
   * @method createBatches
   * @description Split up the assets into smaller batches so we can do multiple xhr requests at the same time!
   */


  _proto.createBatches = function createBatches() {
    var _this4 = this;

    this.options.assets.forEach(function (src, index) {
      // Create new batch
      if (index % _this4.options.batchSize === 0) {
        _this4.batches.push([]);
      } // Push into the new batch


      _this4.batches[_this4.batches.length - 1].push({
        src: src,
        index: index,
        batchIndex: index % _this4.options.batchSize
      });
    });
  };
  /**
   * @private
   * @method loadBatch
   * @param {IBatch} item
   * @param {Array<number>} batchProgress
   * @param {(progress: number) => void} update
   * @returns {Promise<any>}
   */


  _proto.loadBatch = function loadBatch(item, batchProgress, update) {
    var _this5 = this;

    var cachedItem = _CacheManager.default.get(item.src, this.options.cacheNameSpace);

    if (cachedItem) {
      if (update) update(1);
      return Promise.resolve(cachedItem);
    }

    return this.loadAsset(item.src, function (progress) {
      batchProgress[item.batchIndex] = progress;

      if (update) {
        update(batchProgress.reduce(function (totalProgress, currentProgress) {
          return totalProgress + currentProgress;
        }, 0) / batchProgress.length);
      }
    }).then(function (asset) {
      // Add to the cache manager if enabled
      if (_this5.options.cached) {
        _CacheManager.default.add(item.src, asset, _this5.options.cacheNameSpace);
      }

      return asset;
    });
  };
  /**
   * @public
   * @method dispose
   */


  _proto.dispose = function dispose() {
    this.options = null;
    this.batches = null;

    _EventDispatcher.prototype.dispose.call(this);
  };

  return LoadTask;
}(_sengEvent.default);

exports.default = LoadTask;