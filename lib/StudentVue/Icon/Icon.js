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
    global.Icon = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  class Icon {
    constructor(path, hostUrl) {
      this.path = path;
      this.hostUrl = hostUrl;
    }

    getURI() {
      return this.hostUrl + this.path;
    }

  }

  _exports.default = Icon;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0ljb24vSWNvbi50cyJdLCJuYW1lcyI6WyJJY29uIiwiY29uc3RydWN0b3IiLCJwYXRoIiwiaG9zdFVybCIsImdldFVSSSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZSxRQUFNQSxJQUFOLENBQVc7QUFHakJDLElBQUFBLFdBQVcsQ0FBQ0MsSUFBRCxFQUFlQyxPQUFmLEVBQWdDO0FBQ2hELFdBQUtELElBQUwsR0FBWUEsSUFBWjtBQUNBLFdBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNEOztBQUVNQyxJQUFBQSxNQUFNLEdBQVc7QUFDdEIsYUFBTyxLQUFLRCxPQUFMLEdBQWUsS0FBS0QsSUFBM0I7QUFDRDs7QUFWdUIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBJY29uIHtcclxuICBwcml2YXRlIHBhdGg6IHN0cmluZztcclxuICBwcml2YXRlIGhvc3RVcmw6IHN0cmluZztcclxuICBwdWJsaWMgY29uc3RydWN0b3IocGF0aDogc3RyaW5nLCBob3N0VXJsOiBzdHJpbmcpIHtcclxuICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgICB0aGlzLmhvc3RVcmwgPSBob3N0VXJsO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldFVSSSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuaG9zdFVybCArIHRoaXMucGF0aDtcclxuICB9XHJcbn1cclxuIl19