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
    global.isBase64 = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = isBase64;

  function isBase64(str) {
    const base64regex = new RegExp('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$');
    return base64regex.test(str);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9pc0Jhc2U2NC50cyJdLCJuYW1lcyI6WyJpc0Jhc2U2NCIsInN0ciIsImJhc2U2NHJlZ2V4IiwiUmVnRXhwIiwidGVzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZSxXQUFTQSxRQUFULENBQWtCQyxHQUFsQixFQUF3QztBQUNyRCxVQUFNQyxXQUFXLEdBQUcsSUFBSUMsTUFBSixDQUFXLGtFQUFYLENBQXBCO0FBQ0EsV0FBT0QsV0FBVyxDQUFDRSxJQUFaLENBQWlCSCxHQUFqQixDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0Jhc2U2NChzdHI6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIGNvbnN0IGJhc2U2NHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXig/OltBLVphLXowLTkrL117NH0pKig/OltBLVphLXowLTkrL117Mn09PXxbQS1aYS16MC05Ky9dezN9PSk/JCcpO1xyXG4gIHJldHVybiBiYXNlNjRyZWdleC50ZXN0KHN0cik7XHJcbn1cclxuIl19