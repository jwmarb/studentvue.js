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
    global.builder = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  class Builder {
    constructor(obj) {
      this.obj = obj;
    }

    build() {
      return ''; // todo
    }

  }

  _exports.default = Builder;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy94bWwtcGFyc2VyL2J1aWxkZXIvYnVpbGRlci50cyJdLCJuYW1lcyI6WyJCdWlsZGVyIiwiY29uc3RydWN0b3IiLCJvYmoiLCJidWlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZSxRQUFNQSxPQUFOLENBQWM7QUFFM0JDLElBQUFBLFdBQVcsQ0FBQ0MsR0FBRCxFQUFjO0FBQ3ZCLFdBQUtBLEdBQUwsR0FBV0EsR0FBWDtBQUNEOztBQUVNQyxJQUFBQSxLQUFLLEdBQVc7QUFDckIsYUFBTyxFQUFQLENBRHFCLENBQ1Y7QUFDWjs7QUFSMEIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBCdWlsZGVyIHtcclxuICBwcml2YXRlIG9iajogb2JqZWN0O1xyXG4gIGNvbnN0cnVjdG9yKG9iajogb2JqZWN0KSB7XHJcbiAgICB0aGlzLm9iaiA9IG9iajtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBidWlsZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuICcnOyAvLyB0b2RvXHJcbiAgfVxyXG59XHJcbiJdfQ==