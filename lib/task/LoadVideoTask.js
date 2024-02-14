"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _AbstractLoadTask2 = _interopRequireDefault(require("../task/AbstractLoadTask"));

/**
 * @description Load videos in the TaskLoader
 *
 * Example:
 * ```typescript
 *  new LoadVideoTask({
 *      assets: ['path/to/video.mp4'],
 *      onAssetLoaded: result => console.log(result),
 *  })
 * ```
 */
var LoadVideoTask =
/*#__PURE__*/
function (_AbstractLoadTask) {
  (0, _inheritsLoose2.default)(LoadVideoTask, _AbstractLoadTask);

  function LoadVideoTask() {
    return _AbstractLoadTask.apply(this, arguments) || this;
  }

  var _proto = LoadVideoTask.prototype;

  /**
   * @private
   * @method loadAsset
   * @param {string} src
   * @returns {Promise<string>}
   */
  _proto.loadAsset = function loadAsset(src, update) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', src, true);
      xhr.responseType = 'blob';

      xhr.onprogress = function (event) {
        if (update) {
          update(event.loaded / event.total);
        }
      };

      xhr.onload = function () {
        xhr.onprogress = null;
        xhr.onload = null;
        xhr.onerror = null;

        if (xhr.status === 200) {
          resolve(URL.createObjectURL(xhr.response));
        } else {
          reject();
        }
      };

      xhr.onerror = function () {
        xhr.onprogress = null;
        xhr.onload = null;
        xhr.onerror = null;
        reject();
      };

      xhr.send();
    });
  };

  return LoadVideoTask;
}(_AbstractLoadTask2.default);

exports.default = LoadVideoTask;