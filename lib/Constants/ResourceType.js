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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZXNvdXJjZVR5cGUiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvQ29uc3RhbnRzL1Jlc291cmNlVHlwZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogVGhlIHR5cGUgdGhlIHJlc291cmNlIHVzZXNcclxuICogQGVudW1cclxuICovXHJcbmVudW0gUmVzb3VyY2VUeXBlIHtcclxuICBGSUxFID0gJ0ZpbGUnLFxyXG4gIFVSTCA9ICdVUkwnLFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZVR5cGU7XHJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFBO0FBQ0E7QUFDQTtBQUNBO0VBSEEsSUFJS0EsWUFBWTtFQUFBLFdBQVpBLFlBQVk7SUFBWkEsWUFBWTtJQUFaQSxZQUFZO0VBQUEsR0FBWkEsWUFBWSxLQUFaQSxZQUFZO0VBQUEsZUFLRkEsWUFBWTtFQUFBO0FBQUEifQ==