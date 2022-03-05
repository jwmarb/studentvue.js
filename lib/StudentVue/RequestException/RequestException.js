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
    constructor(obj) {
      if ('message' in obj) {
        /**
         * The message of the exception
         * @public
         * @readonly
         */
        this.message = obj.message;
        /**
         * The stack trace of the exception. (java)
         * @public
         * @readonly
         */

        this.stack = obj.stack;
      } else if (Array.isArray(obj.RT_ERROR)) {
        /**
         * The message of the exception
         * @public
         * @readonly
         */
        this.message = obj.RT_ERROR[0]['@_ERROR_MESSAGE'][0];
        /**
         * The stack trace of the exception. (java)
         * @public
         * @readonly
         */

        this.stack = obj.RT_ERROR[0].STACK_TRACE[0];
      } else {
        /**
         * The message of the exception
         * @public
         * @readonly
         */
        this.message = obj.RT_ERROR['@_ERROR_MESSAGE'];
        /**
         * The stack trace of the exception. (java)
         * @public
         * @readonly
         */

        this.stack = obj.RT_ERROR.STACK_TRACE;
      }
    }

  }

  _exports.default = RequestException;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL1JlcXVlc3RFeGNlcHRpb24vUmVxdWVzdEV4Y2VwdGlvbi50cyJdLCJuYW1lcyI6WyJSZXF1ZXN0RXhjZXB0aW9uIiwiY29uc3RydWN0b3IiLCJvYmoiLCJtZXNzYWdlIiwic3RhY2siLCJBcnJheSIsImlzQXJyYXkiLCJSVF9FUlJPUiIsIlNUQUNLX1RSQUNFIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsUUFBTUEsZ0JBQU4sQ0FBdUI7QUFLN0JDLElBQUFBLFdBQVcsQ0FBQ0MsR0FBRCxFQUE4RjtBQUM5RyxVQUFJLGFBQWFBLEdBQWpCLEVBQXNCO0FBQ3BCO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDTSxhQUFLQyxPQUFMLEdBQWVELEdBQUcsQ0FBQ0MsT0FBbkI7QUFDQTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUNNLGFBQUtDLEtBQUwsR0FBYUYsR0FBRyxDQUFDRSxLQUFqQjtBQUNELE9BYkQsTUFhTyxJQUFJQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0osR0FBRyxDQUFDSyxRQUFsQixDQUFKLEVBQWlDO0FBQ3RDO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDTSxhQUFLSixPQUFMLEdBQWVELEdBQUcsQ0FBQ0ssUUFBSixDQUFhLENBQWIsRUFBZ0IsaUJBQWhCLEVBQW1DLENBQW5DLENBQWY7QUFDQTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUNNLGFBQUtILEtBQUwsR0FBYUYsR0FBRyxDQUFDSyxRQUFKLENBQWEsQ0FBYixFQUFnQkMsV0FBaEIsQ0FBNEIsQ0FBNUIsQ0FBYjtBQUNELE9BYk0sTUFhQTtBQUNMO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDTSxhQUFLTCxPQUFMLEdBQWVELEdBQUcsQ0FBQ0ssUUFBSixDQUFhLGlCQUFiLENBQWY7QUFDQTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUNNLGFBQUtILEtBQUwsR0FBYUYsR0FBRyxDQUFDSyxRQUFKLENBQWFDLFdBQTFCO0FBQ0Q7QUFDRjs7QUE5Q21DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFyc2VkQW5vbnltb3VzUmVxdWVzdEVycm9yLCBQYXJzZWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcblxyXG4vKipcclxuICogUmVxdWVzdEV4Y2VwdGlvbiBpcyBhIGNsYXNzIHVzZWQgdG8gcGFyc2UgZXJyb3JzIGZyb20gU3luZXJneSBzZXJ2ZXJzXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVxdWVzdEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIHJlYWRvbmx5IG1lc3NhZ2U6IHN0cmluZztcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IHN0YWNrOiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihvYmo6IFBhcnNlZFJlcXVlc3RFcnJvciB8IHsgbWVzc2FnZTogc3RyaW5nOyBzdGFjaz86IHN0cmluZyB9IHwgUGFyc2VkQW5vbnltb3VzUmVxdWVzdEVycm9yKSB7XHJcbiAgICBpZiAoJ21lc3NhZ2UnIGluIG9iaikge1xyXG4gICAgICAvKipcclxuICAgICAgICogVGhlIG1lc3NhZ2Ugb2YgdGhlIGV4Y2VwdGlvblxyXG4gICAgICAgKiBAcHVibGljXHJcbiAgICAgICAqIEByZWFkb25seVxyXG4gICAgICAgKi9cclxuICAgICAgdGhpcy5tZXNzYWdlID0gb2JqLm1lc3NhZ2U7XHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBUaGUgc3RhY2sgdHJhY2Ugb2YgdGhlIGV4Y2VwdGlvbi4gKGphdmEpXHJcbiAgICAgICAqIEBwdWJsaWNcclxuICAgICAgICogQHJlYWRvbmx5XHJcbiAgICAgICAqL1xyXG4gICAgICB0aGlzLnN0YWNrID0gb2JqLnN0YWNrO1xyXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KG9iai5SVF9FUlJPUikpIHtcclxuICAgICAgLyoqXHJcbiAgICAgICAqIFRoZSBtZXNzYWdlIG9mIHRoZSBleGNlcHRpb25cclxuICAgICAgICogQHB1YmxpY1xyXG4gICAgICAgKiBAcmVhZG9ubHlcclxuICAgICAgICovXHJcbiAgICAgIHRoaXMubWVzc2FnZSA9IG9iai5SVF9FUlJPUlswXVsnQF9FUlJPUl9NRVNTQUdFJ11bMF07XHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBUaGUgc3RhY2sgdHJhY2Ugb2YgdGhlIGV4Y2VwdGlvbi4gKGphdmEpXHJcbiAgICAgICAqIEBwdWJsaWNcclxuICAgICAgICogQHJlYWRvbmx5XHJcbiAgICAgICAqL1xyXG4gICAgICB0aGlzLnN0YWNrID0gb2JqLlJUX0VSUk9SWzBdLlNUQUNLX1RSQUNFWzBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLyoqXHJcbiAgICAgICAqIFRoZSBtZXNzYWdlIG9mIHRoZSBleGNlcHRpb25cclxuICAgICAgICogQHB1YmxpY1xyXG4gICAgICAgKiBAcmVhZG9ubHlcclxuICAgICAgICovXHJcbiAgICAgIHRoaXMubWVzc2FnZSA9IG9iai5SVF9FUlJPUlsnQF9FUlJPUl9NRVNTQUdFJ107XHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBUaGUgc3RhY2sgdHJhY2Ugb2YgdGhlIGV4Y2VwdGlvbi4gKGphdmEpXHJcbiAgICAgICAqIEBwdWJsaWNcclxuICAgICAgICogQHJlYWRvbmx5XHJcbiAgICAgICAqL1xyXG4gICAgICB0aGlzLnN0YWNrID0gb2JqLlJUX0VSUk9SLlNUQUNLX1RSQUNFO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=