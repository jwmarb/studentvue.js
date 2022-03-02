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
      /**
       * The URI of the icon
       * @public
       * @readonly
       * @type {string}
       */
      this.uri = hostUrl + path;
    }

  }

  _exports.default = Icon;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0ljb24vSWNvbi50cyJdLCJuYW1lcyI6WyJJY29uIiwiY29uc3RydWN0b3IiLCJwYXRoIiwiaG9zdFVybCIsInVyaSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZSxRQUFNQSxJQUFOLENBQVc7QUFFakJDLElBQUFBLFdBQVcsQ0FBQ0MsSUFBRCxFQUFlQyxPQUFmLEVBQWdDO0FBQ2hEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJLFdBQUtDLEdBQUwsR0FBV0QsT0FBTyxHQUFHRCxJQUFyQjtBQUNEOztBQVZ1QiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEljb24ge1xyXG4gIHB1YmxpYyByZWFkb25seSB1cmk6IHN0cmluZztcclxuICBwdWJsaWMgY29uc3RydWN0b3IocGF0aDogc3RyaW5nLCBob3N0VXJsOiBzdHJpbmcpIHtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIFVSSSBvZiB0aGUgaWNvblxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICB0aGlzLnVyaSA9IGhvc3RVcmwgKyBwYXRoO1xyXG4gIH1cclxufVxyXG4iXX0=