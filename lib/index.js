(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./StudentVue/StudentVue", "./Constants/EventType"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./StudentVue/StudentVue"), require("./Constants/EventType"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.StudentVue, global.EventType);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _StudentVue, _EventType) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {};
  _exports.default = void 0;
  _StudentVue = _interopRequireDefault(_StudentVue);
  undefined;

  var _a = Object.keys(_EventType);

  var _f = function (key) {
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

  for (var _i = 0; _i < _a.length; _i++) {
    _f(_a[_i], _i, _a);
  }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var _default = _StudentVue.default;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJTdHVkZW50VnVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpQkFDZUEsbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3R1ZGVudFZ1ZSBmcm9tICcuL1N0dWRlbnRWdWUvU3R1ZGVudFZ1ZSc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL0NvbnN0YW50cy9FdmVudFR5cGUnO1xyXG5leHBvcnQgZGVmYXVsdCBTdHVkZW50VnVlO1xyXG4iXX0=