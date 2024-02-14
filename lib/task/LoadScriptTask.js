"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _AbstractLoadTask2 = _interopRequireDefault(require("../task/AbstractLoadTask"));

/**
 * @description Load external script in the TaskLoader
 *
 * Example:
 * ```typescript
 *  new LoadScriptTask({
 *      assets: ['path/to/script.js'],
 *      onAssetLoaded: result => console.log(result),
 *  })
 * ```
 */
var LoadScriptTask =
/*#__PURE__*/
function (_AbstractLoadTask) {
  (0, _inheritsLoose2.default)(LoadScriptTask, _AbstractLoadTask);

  function LoadScriptTask() {
    return _AbstractLoadTask.apply(this, arguments) || this;
  }

  var _proto = LoadScriptTask.prototype;

  /**
   * @private
   * @method loadAsset
   * @param {string} src
   * @param {function} update
   * @returns {Promise<HTMLScriptElement>}
   */
  _proto.loadAsset = function loadAsset(src, update) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      var r = false;
      s.type = 'text/javascript';
      s.src = src;

      var onload = function onload() {
        if (!r && (!s['readyState'] || s['readyState'] === 'complete')) {
          r = true;
          if (update) update(1); // TODO: implement loading progress?

          resolve(s);
        }
      };

      s.onload = onload;

      s.onerror = function () {
        return reject('Failed to load the script: ' + src);
      };

      s['onreadystatechange'] = onload;
      var t = document.getElementsByTagName('head')[0];
      t.appendChild(s);
    });
  };

  return LoadScriptTask;
}(_AbstractLoadTask2.default);

exports.default = LoadScriptTask;