(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.ResourceType = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
   * The type the resource uses
   * @enum
   */
  var ResourceType;

  (function (ResourceType) {
    ResourceType["FILE"] = "File";
    ResourceType["URL"] = "URL";
  })(ResourceType || (ResourceType = {}));

  var _default = ResourceType;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Db25zdGFudHMvUmVzb3VyY2VUeXBlLnRzIl0sIm5hbWVzIjpbIlJlc291cmNlVHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtNQUNLQSxZOzthQUFBQSxZO0FBQUFBLElBQUFBLFk7QUFBQUEsSUFBQUEsWTtLQUFBQSxZLEtBQUFBLFk7O2lCQUtVQSxZIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFRoZSB0eXBlIHRoZSByZXNvdXJjZSB1c2VzXHJcbiAqIEBlbnVtXHJcbiAqL1xyXG5lbnVtIFJlc291cmNlVHlwZSB7XHJcbiAgRklMRSA9ICdGaWxlJyxcclxuICBVUkwgPSAnVVJMJyxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2VUeXBlO1xyXG4iXX0=