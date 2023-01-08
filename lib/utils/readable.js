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
    global.readable = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = readable;
  function readable(value) {
    return JSON.stringify(value, null, 2);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJyZWFkYWJsZSIsInZhbHVlIiwiSlNPTiIsInN0cmluZ2lmeSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9yZWFkYWJsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWFkYWJsZSh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB7XHJcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlLCBudWxsLCAyKTtcclxufVxyXG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBZSxTQUFTQSxRQUFRLENBQUNDLEtBQWMsRUFBVTtJQUN2RCxPQUFPQyxJQUFJLENBQUNDLFNBQVMsQ0FBQ0YsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7RUFDdkM7QUFBQyJ9