(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./parser/parser", "./builder/builder"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./parser/parser"), require("./builder/builder"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.parser, global.builder);
    global.xmlParser = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _parser, _builder) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _parser = _interopRequireDefault(_parser);
  _builder = _interopRequireDefault(_builder);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var _default = {
    Parser: _parser.default,
    Builder: _builder.default
  };
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy94bWwtcGFyc2VyL3htbC1wYXJzZXIudHMiXSwibmFtZXMiOlsiUGFyc2VyIiwiQnVpbGRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lCQUdlO0FBQUVBLElBQUFBLE1BQU0sRUFBTkEsZUFBRjtBQUFVQyxJQUFBQSxPQUFPLEVBQVBBO0FBQVYsRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYXJzZXIgZnJvbSAnLi9wYXJzZXIvcGFyc2VyJztcclxuaW1wb3J0IEJ1aWxkZXIgZnJvbSAnLi9idWlsZGVyL2J1aWxkZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgeyBQYXJzZXIsIEJ1aWxkZXIgfTtcclxuIl19