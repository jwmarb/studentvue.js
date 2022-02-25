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

    get uri() {
      return this.hostUrl + this.path;
    }

  }

  _exports.default = Icon;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0ljb24vSWNvbi50cyJdLCJuYW1lcyI6WyJJY29uIiwiY29uc3RydWN0b3IiLCJwYXRoIiwiaG9zdFVybCIsInVyaSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZSxRQUFNQSxJQUFOLENBQVc7QUFHakJDLElBQUFBLFdBQVcsQ0FBQ0MsSUFBRCxFQUFlQyxPQUFmLEVBQWdDO0FBQ2hELFdBQUtELElBQUwsR0FBWUEsSUFBWjtBQUNBLFdBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNEOztBQUVhLFFBQUhDLEdBQUcsR0FBVztBQUN2QixhQUFPLEtBQUtELE9BQUwsR0FBZSxLQUFLRCxJQUEzQjtBQUNEOztBQVZ1QiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEljb24ge1xyXG4gIHByaXZhdGUgcGF0aDogc3RyaW5nO1xyXG4gIHByaXZhdGUgaG9zdFVybDogc3RyaW5nO1xyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcsIGhvc3RVcmw6IHN0cmluZykge1xyXG4gICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgIHRoaXMuaG9zdFVybCA9IGhvc3RVcmw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0IHVyaSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuaG9zdFVybCArIHRoaXMucGF0aDtcclxuICB9XHJcbn1cclxuIl19