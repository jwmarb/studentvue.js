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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDbGllbnQiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvc29hcC9zb2FwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnQgZnJvbSAnLi9DbGllbnQvQ2xpZW50JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHsgQ2xpZW50IH07XHJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lCQUVlO0lBQUVBLE1BQU0sRUFBTkE7RUFBTyxDQUFDO0VBQUE7QUFBQSJ9