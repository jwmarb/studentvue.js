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
    global.EventType = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var EventType;

  (function (EventType) {
    EventType["ASSIGNMENT"] = "Assignment";
    EventType["REGULAR"] = "Regular";
    EventType["HOLIDAY"] = "Holiday";
  })(EventType || (EventType = {}));

  var _default = EventType;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Db25zdGFudHMvRXZlbnRUeXBlLnRzIl0sIm5hbWVzIjpbIkV2ZW50VHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUFLQSxTOzthQUFBQSxTO0FBQUFBLElBQUFBLFM7QUFBQUEsSUFBQUEsUztBQUFBQSxJQUFBQSxTO0tBQUFBLFMsS0FBQUEsUzs7aUJBTVVBLFMiLCJzb3VyY2VzQ29udGVudCI6WyJlbnVtIEV2ZW50VHlwZSB7XHJcbiAgQVNTSUdOTUVOVCA9ICdBc3NpZ25tZW50JyxcclxuICBSRUdVTEFSID0gJ1JlZ3VsYXInLFxyXG4gIEhPTElEQVkgPSAnSG9saWRheScsXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEV2ZW50VHlwZTtcclxuIl19