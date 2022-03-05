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

  /**
   * RequestException is a class used to parse errors from Synergy servers
   * @constructor
   */
  class RequestException {
    /**
     * The message of the exception
     * @public
     * @readonly
     */

    /**
     * The stack trace of the exception. (java)
     * @public
     * @readonly
     */
    constructor(obj) {
      if ('message' in obj) {
        this.message = obj.message;
        this.stack = obj.stack;
      } else if (Array.isArray(obj.RT_ERROR)) {
        this.message = obj.RT_ERROR[0]['@_ERROR_MESSAGE'][0];
        this.stack = obj.RT_ERROR[0].STACK_TRACE[0];
      } else {
        this.message = obj.RT_ERROR['@_ERROR_MESSAGE'];
        this.stack = obj.RT_ERROR.STACK_TRACE;
      }
    }

  }

  _exports.default = RequestException;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL1JlcXVlc3RFeGNlcHRpb24vUmVxdWVzdEV4Y2VwdGlvbi50cyJdLCJuYW1lcyI6WyJSZXF1ZXN0RXhjZXB0aW9uIiwiY29uc3RydWN0b3IiLCJvYmoiLCJtZXNzYWdlIiwic3RhY2siLCJBcnJheSIsImlzQXJyYXkiLCJSVF9FUlJPUiIsIlNUQUNLX1RSQUNFIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsUUFBTUEsZ0JBQU4sQ0FBdUI7QUFDcEM7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBR1NDLElBQUFBLFdBQVcsQ0FBQ0MsR0FBRCxFQUE4RjtBQUM5RyxVQUFJLGFBQWFBLEdBQWpCLEVBQXNCO0FBQ3BCLGFBQUtDLE9BQUwsR0FBZUQsR0FBRyxDQUFDQyxPQUFuQjtBQUNBLGFBQUtDLEtBQUwsR0FBYUYsR0FBRyxDQUFDRSxLQUFqQjtBQUNELE9BSEQsTUFHTyxJQUFJQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0osR0FBRyxDQUFDSyxRQUFsQixDQUFKLEVBQWlDO0FBQ3RDLGFBQUtKLE9BQUwsR0FBZUQsR0FBRyxDQUFDSyxRQUFKLENBQWEsQ0FBYixFQUFnQixpQkFBaEIsRUFBbUMsQ0FBbkMsQ0FBZjtBQUNBLGFBQUtILEtBQUwsR0FBYUYsR0FBRyxDQUFDSyxRQUFKLENBQWEsQ0FBYixFQUFnQkMsV0FBaEIsQ0FBNEIsQ0FBNUIsQ0FBYjtBQUNELE9BSE0sTUFHQTtBQUNMLGFBQUtMLE9BQUwsR0FBZUQsR0FBRyxDQUFDSyxRQUFKLENBQWEsaUJBQWIsQ0FBZjtBQUNBLGFBQUtILEtBQUwsR0FBYUYsR0FBRyxDQUFDSyxRQUFKLENBQWFDLFdBQTFCO0FBQ0Q7QUFDRjs7QUExQm1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFyc2VkQW5vbnltb3VzUmVxdWVzdEVycm9yLCBQYXJzZWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcblxyXG4vKipcclxuICogUmVxdWVzdEV4Y2VwdGlvbiBpcyBhIGNsYXNzIHVzZWQgdG8gcGFyc2UgZXJyb3JzIGZyb20gU3luZXJneSBzZXJ2ZXJzXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVxdWVzdEV4Y2VwdGlvbiB7XHJcbiAgLyoqXHJcbiAgICogVGhlIG1lc3NhZ2Ugb2YgdGhlIGV4Y2VwdGlvblxyXG4gICAqIEBwdWJsaWNcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKi9cclxuICBwdWJsaWMgcmVhZG9ubHkgbWVzc2FnZTogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgc3RhY2sgdHJhY2Ugb2YgdGhlIGV4Y2VwdGlvbi4gKGphdmEpXHJcbiAgICogQHB1YmxpY1xyXG4gICAqIEByZWFkb25seVxyXG4gICAqL1xyXG4gIHB1YmxpYyByZWFkb25seSBzdGFjazogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3Iob2JqOiBQYXJzZWRSZXF1ZXN0RXJyb3IgfCB7IG1lc3NhZ2U6IHN0cmluZzsgc3RhY2s/OiBzdHJpbmcgfSB8IFBhcnNlZEFub255bW91c1JlcXVlc3RFcnJvcikge1xyXG4gICAgaWYgKCdtZXNzYWdlJyBpbiBvYmopIHtcclxuICAgICAgdGhpcy5tZXNzYWdlID0gb2JqLm1lc3NhZ2U7XHJcbiAgICAgIHRoaXMuc3RhY2sgPSBvYmouc3RhY2s7XHJcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqLlJUX0VSUk9SKSkge1xyXG4gICAgICB0aGlzLm1lc3NhZ2UgPSBvYmouUlRfRVJST1JbMF1bJ0BfRVJST1JfTUVTU0FHRSddWzBdO1xyXG4gICAgICB0aGlzLnN0YWNrID0gb2JqLlJUX0VSUk9SWzBdLlNUQUNLX1RSQUNFWzBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5tZXNzYWdlID0gb2JqLlJUX0VSUk9SWydAX0VSUk9SX01FU1NBR0UnXTtcclxuICAgICAgdGhpcy5zdGFjayA9IG9iai5SVF9FUlJPUi5TVEFDS19UUkFDRTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19