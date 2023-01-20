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
  /**
   * The event type of a calendar day.
   * @enum
   */
  var EventType;
  (function (EventType) {
    EventType["ASSIGNMENT"] = "Assignment";
    EventType["REGULAR"] = "Regular";
    EventType["HOLIDAY"] = "Holiday";
  })(EventType || (EventType = {}));
  var _default = EventType;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFdmVudFR5cGUiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvQ29uc3RhbnRzL0V2ZW50VHlwZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBldmVudCB0eXBlIG9mIGEgY2FsZW5kYXIgZGF5LlxuICogQGVudW1cbiAqL1xuZW51bSBFdmVudFR5cGUge1xuICBBU1NJR05NRU5UID0gJ0Fzc2lnbm1lbnQnLFxuICBSRUdVTEFSID0gJ1JlZ3VsYXInLFxuICBIT0xJREFZID0gJ0hvbGlkYXknLFxufVxuXG5leHBvcnQgZGVmYXVsdCBFdmVudFR5cGU7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBQTtBQUNBO0FBQ0E7QUFDQTtFQUhBLElBSUtBLFNBQVM7RUFBQSxXQUFUQSxTQUFTO0lBQVRBLFNBQVM7SUFBVEEsU0FBUztJQUFUQSxTQUFTO0VBQUEsR0FBVEEsU0FBUyxLQUFUQSxTQUFTO0VBQUEsZUFNQ0EsU0FBUztFQUFBO0FBQUEifQ==