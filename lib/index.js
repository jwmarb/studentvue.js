(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./StudentVue/StudentVue", "./Constants/ResourceType", "./Constants/EventType"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./StudentVue/StudentVue"), require("./Constants/ResourceType"), require("./Constants/EventType"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.StudentVue, global.ResourceType, global.EventType);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _StudentVue, _ResourceType, _EventType) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {};
  _exports.default = void 0;
  _StudentVue = _interopRequireDefault(_StudentVue);
  undefined;
  undefined;

  var _a = Object.keys(_ResourceType);

  var _f = function (key) {
    if (key === "default" || key === "__esModule") {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) {
      return;
    }

    if (key in _exports && _exports[key] === _ResourceType[key]) {
      return;
    }

    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _ResourceType[key];
      }
    });
  };

  for (var _i = 0; _i < _a.length; _i++) {
    _f(_a[_i], _i, _a);
  }

  var _a2 = Object.keys(_EventType);

  var _f2 = function (key) {
    if (key === "default" || key === "__esModule") {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) {
      return;
    }

    if (key in _exports && _exports[key] === _EventType[key]) {
      return;
    }

    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _EventType[key];
      }
    });
  };

  for (var _i2 = 0; _i2 < _a2.length; _i2++) {
    _f2(_a2[_i2], _i2, _a2);
  }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var _default = _StudentVue.default;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJTdHVkZW50VnVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lCQUNlQSxtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdHVkZW50VnVlIGZyb20gJy4vU3R1ZGVudFZ1ZS9TdHVkZW50VnVlJztcclxuZXhwb3J0ICogZnJvbSAnLi9Db25zdGFudHMvUmVzb3VyY2VUeXBlJztcclxuZXhwb3J0ICogZnJvbSAnLi9Db25zdGFudHMvRXZlbnRUeXBlJztcclxuZXhwb3J0IGRlZmF1bHQgU3R1ZGVudFZ1ZTtcclxuIl19