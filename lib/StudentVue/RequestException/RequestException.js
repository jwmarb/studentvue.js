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
    global.RequestException = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  class RequestException {
    get message() {
      return this._message;
    }

    get stack() {
      return this._stackTrace;
    }

    constructor(obj) {
      if ('message' in obj) {
        this._message = obj.message;
        this._stackTrace = obj.stack;
      } else if (Array.isArray(obj.RT_ERROR)) {
        this._message = obj.RT_ERROR[0]['@_ERROR_MESSAGE'][0];
        this._stackTrace = obj.RT_ERROR[0].STACK_TRACE[0];
      } else {
        this._message = obj.RT_ERROR['@_ERROR_MESSAGE'];
        this._stackTrace = obj.RT_ERROR.STACK_TRACE;
      }
    }

  }

  _exports.default = RequestException;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL1JlcXVlc3RFeGNlcHRpb24vUmVxdWVzdEV4Y2VwdGlvbi50cyJdLCJuYW1lcyI6WyJSZXF1ZXN0RXhjZXB0aW9uIiwibWVzc2FnZSIsIl9tZXNzYWdlIiwic3RhY2siLCJfc3RhY2tUcmFjZSIsImNvbnN0cnVjdG9yIiwib2JqIiwiQXJyYXkiLCJpc0FycmF5IiwiUlRfRVJST1IiLCJTVEFDS19UUkFDRSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFZSxRQUFNQSxnQkFBTixDQUF1QjtBQUlsQixRQUFQQyxPQUFPLEdBQUc7QUFDbkIsYUFBTyxLQUFLQyxRQUFaO0FBQ0Q7O0FBRWUsUUFBTEMsS0FBSyxHQUFHO0FBQ2pCLGFBQU8sS0FBS0MsV0FBWjtBQUNEOztBQUVNQyxJQUFBQSxXQUFXLENBQUNDLEdBQUQsRUFBOEY7QUFDOUcsVUFBSSxhQUFhQSxHQUFqQixFQUFzQjtBQUNwQixhQUFLSixRQUFMLEdBQWdCSSxHQUFHLENBQUNMLE9BQXBCO0FBQ0EsYUFBS0csV0FBTCxHQUFtQkUsR0FBRyxDQUFDSCxLQUF2QjtBQUNELE9BSEQsTUFHTyxJQUFJSSxLQUFLLENBQUNDLE9BQU4sQ0FBY0YsR0FBRyxDQUFDRyxRQUFsQixDQUFKLEVBQWlDO0FBQ3RDLGFBQUtQLFFBQUwsR0FBZ0JJLEdBQUcsQ0FBQ0csUUFBSixDQUFhLENBQWIsRUFBZ0IsaUJBQWhCLEVBQW1DLENBQW5DLENBQWhCO0FBQ0EsYUFBS0wsV0FBTCxHQUFtQkUsR0FBRyxDQUFDRyxRQUFKLENBQWEsQ0FBYixFQUFnQkMsV0FBaEIsQ0FBNEIsQ0FBNUIsQ0FBbkI7QUFDRCxPQUhNLE1BR0E7QUFDTCxhQUFLUixRQUFMLEdBQWdCSSxHQUFHLENBQUNHLFFBQUosQ0FBYSxpQkFBYixDQUFoQjtBQUNBLGFBQUtMLFdBQUwsR0FBbUJFLEdBQUcsQ0FBQ0csUUFBSixDQUFhQyxXQUFoQztBQUNEO0FBQ0Y7O0FBdkJtQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhcnNlZEFub255bW91c1JlcXVlc3RFcnJvciwgUGFyc2VkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVxdWVzdEV4Y2VwdGlvbiB7XHJcbiAgcHJpdmF0ZSBfbWVzc2FnZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgX3N0YWNrVHJhY2U6IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuXHJcbiAgcHVibGljIGdldCBtZXNzYWdlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2U7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0IHN0YWNrKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3N0YWNrVHJhY2U7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3Iob2JqOiBQYXJzZWRSZXF1ZXN0RXJyb3IgfCB7IG1lc3NhZ2U6IHN0cmluZzsgc3RhY2s/OiBzdHJpbmcgfSB8IFBhcnNlZEFub255bW91c1JlcXVlc3RFcnJvcikge1xyXG4gICAgaWYgKCdtZXNzYWdlJyBpbiBvYmopIHtcclxuICAgICAgdGhpcy5fbWVzc2FnZSA9IG9iai5tZXNzYWdlO1xyXG4gICAgICB0aGlzLl9zdGFja1RyYWNlID0gb2JqLnN0YWNrO1xyXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KG9iai5SVF9FUlJPUikpIHtcclxuICAgICAgdGhpcy5fbWVzc2FnZSA9IG9iai5SVF9FUlJPUlswXVsnQF9FUlJPUl9NRVNTQUdFJ11bMF07XHJcbiAgICAgIHRoaXMuX3N0YWNrVHJhY2UgPSBvYmouUlRfRVJST1JbMF0uU1RBQ0tfVFJBQ0VbMF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9tZXNzYWdlID0gb2JqLlJUX0VSUk9SWydAX0VSUk9SX01FU1NBR0UnXTtcclxuICAgICAgdGhpcy5fc3RhY2tUcmFjZSA9IG9iai5SVF9FUlJPUi5TVEFDS19UUkFDRTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19