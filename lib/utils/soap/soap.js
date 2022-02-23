(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./Client/Client"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./Client/Client"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Client);
    global.soap = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _Client) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Client = _interopRequireDefault(_Client);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var _default = {
    Client: _Client.default
  };
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9zb2FwL3NvYXAudHMiXSwibmFtZXMiOlsiQ2xpZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpQkFFZTtBQUFFQSxJQUFBQSxNQUFNLEVBQU5BO0FBQUYsRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnQgZnJvbSAnLi9DbGllbnQvQ2xpZW50JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHsgQ2xpZW50IH07XHJcbiJdfQ==