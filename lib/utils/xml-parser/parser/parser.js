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
    global.parser = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  class Parser {
    constructor(xml) {
      this.xml = xml;
    }

    parse() {
      return {};
    }

  }

  _exports.default = Parser;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy94bWwtcGFyc2VyL3BhcnNlci9wYXJzZXIudHMiXSwibmFtZXMiOlsiUGFyc2VyIiwiY29uc3RydWN0b3IiLCJ4bWwiLCJwYXJzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZSxRQUFNQSxNQUFOLENBQWE7QUFFMUJDLElBQUFBLFdBQVcsQ0FBQ0MsR0FBRCxFQUFjO0FBQ3ZCLFdBQUtBLEdBQUwsR0FBV0EsR0FBWDtBQUNEOztBQUVNQyxJQUFBQSxLQUFLLEdBQXlDO0FBQ25ELGFBQU8sRUFBUDtBQUNEOztBQVJ5QiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNlciB7XHJcbiAgcHJpdmF0ZSB4bWw6IHN0cmluZztcclxuICBjb25zdHJ1Y3Rvcih4bWw6IHN0cmluZykge1xyXG4gICAgdGhpcy54bWwgPSB4bWw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcGFyc2U8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+PigpOiBUIHtcclxuICAgIHJldHVybiB7fSBhcyBUO1xyXG4gIH1cclxufVxyXG4iXX0=