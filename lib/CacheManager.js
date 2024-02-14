"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.CacheManager = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _sengDisposable = _interopRequireDefault(require("seng-disposable"));

var _sha = _interopRequireDefault(require("sha1"));

var _debug = _interopRequireDefault(require("debug"));

var CacheManager =
/*#__PURE__*/
function (_Disposable) {
  (0, _inheritsLoose2.default)(CacheManager, _Disposable);

  function CacheManager() {
    var _temp, _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_temp = _this = _Disposable.call.apply(_Disposable, [this].concat(args)) || this, Object.defineProperty((0, _assertThisInitialized2.default)(_this), "cache", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {}
    }), Object.defineProperty((0, _assertThisInitialized2.default)(_this), "log", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: (0, _debug.default)('cacheManager')
    }), _temp) || (0, _assertThisInitialized2.default)(_this);
  }

  var _proto = CacheManager.prototype;

  /**
   * @public
   * @method add
   * @param {string} id
   * @param asset
   * @param {string} nameSpace
   */
  _proto.add = function add(id, asset, nameSpace) {
    var hashedId = (0, _sha.default)(id);

    if (nameSpace) {
      this.getNameSpacedObject(nameSpace)[hashedId] = asset;
    } else {
      this.cache[hashedId] = asset;
    }
  };
  /**
   * @public
   * @method get
   * @param {string} id
   * @param {string} nameSpace
   * @returns {any}
   */


  _proto.get = function get(id, nameSpace) {
    var hashedId = (0, _sha.default)(id);

    if (nameSpace) {
      return this.getNameSpacedObject(nameSpace)[hashedId];
    }

    return this.cache[hashedId];
  };
  /**
   * @public
   * @method remove
   * @param {string} id
   */


  _proto.remove = function remove(idOrNameSpace) {
    var hashedId = (0, _sha.default)(idOrNameSpace);

    if (!this.cache[hashedId]) {
      this.log("Unable to remove: " + idOrNameSpace);
    } else {
      delete this.cache[hashedId];
      this.log("Removed " + idOrNameSpace + " from cache");
    }
  };
  /**
   * @private
   * @method getNamespace
   * @param {string} namespace
   * @returns {ICacheObject}
   */


  _proto.getNameSpacedObject = function getNameSpacedObject(nameSpace) {
    var hashedNameSpace = (0, _sha.default)(nameSpace);

    if (!this.cache[hashedNameSpace]) {
      this.cache[hashedNameSpace] = {};
    }

    return this.cache[hashedNameSpace];
  };
  /**
   * @public
   * @method dispose
   */


  _proto.dispose = function dispose() {
    this.cache = null;

    _Disposable.prototype.dispose.call(this);
  };

  return CacheManager;
}(_sengDisposable.default); // Create an instance because there can only be one cache manager instance


exports.CacheManager = CacheManager;
var cacheManager = new CacheManager(); // Export the instances

var _default = cacheManager;
exports.default = _default;