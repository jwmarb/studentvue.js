(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./StudentVue/StudentVue"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./StudentVue/StudentVue"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.StudentVue);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _StudentVue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _StudentVue = _interopRequireDefault(_StudentVue);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var _default = _StudentVue.default;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJTdHVkZW50VnVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpQkFFZUEsbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3R1ZGVudFZ1ZSBmcm9tICcuL1N0dWRlbnRWdWUvU3R1ZGVudFZ1ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTdHVkZW50VnVlO1xyXG4iXX0=