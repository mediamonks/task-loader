"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _AbstractLoadTask2 = _interopRequireDefault(require("../task/AbstractLoadTask"));

/**
 * @description Load images in the TaskLoader
 *
 * Example:
 * ```typescript
 *  new LoadImageTask({
 *      assets: ['path/to/image.jpg'],
 *      onAssetLoaded: result => console.log(result),
 *      crossOrigin: 'Use-Credentials',
 *  })
 * ```
 */
var LoadImageTask =
/*#__PURE__*/
function (_AbstractLoadTask) {
  (0, _inheritsLoose2.default)(LoadImageTask, _AbstractLoadTask);

  /**
   * @description Overwrite the default load options because we have extra configuration
   */
  function LoadImageTask(options) {
    return _AbstractLoadTask.call(this, Object.assign({
      crossOrigin: 'Use-Credentials'
    }, options)) || this;
  }
  /**
   * @private
   * @method loadAsset
   * @param {string} src
   * @param {function} update
   * @returns {Promise<HTMLImageElement>}
   */


  var _proto = LoadImageTask.prototype;

  _proto.loadAsset = function loadAsset(src, update) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      var image = new Image();

      image.onload = function () {
        if (update !== undefined) update(1); // TODO: implement loading progress?

        resolve(image);
      };

      image.crossOrigin = _this.options.crossOrigin;
      image.onerror = reject;
      image.src = src;
    });
  };

  return LoadImageTask;
}(_AbstractLoadTask2.default);
/**
 * @description Howler has the option for multiple formats like mp3, ogg, mp4 etc
 */


exports.default = LoadImageTask;