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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZXF1ZXN0RXhjZXB0aW9uIiwiY29uc3RydWN0b3IiLCJvYmoiLCJtZXNzYWdlIiwic3RhY2siLCJBcnJheSIsImlzQXJyYXkiLCJSVF9FUlJPUiIsIlNUQUNLX1RSQUNFIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL1N0dWRlbnRWdWUvUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhcnNlZEFub255bW91c1JlcXVlc3RFcnJvciwgUGFyc2VkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xuXG4vKipcbiAqIFJlcXVlc3RFeGNlcHRpb24gaXMgYSBjbGFzcyB1c2VkIHRvIHBhcnNlIGVycm9ycyBmcm9tIFN5bmVyZ3kgc2VydmVyc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcXVlc3RFeGNlcHRpb24ge1xuICBwdWJsaWMgcmVhZG9ubHkgbWVzc2FnZTogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBzdGFjazogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihvYmo6IFBhcnNlZFJlcXVlc3RFcnJvciB8IHsgbWVzc2FnZTogc3RyaW5nOyBzdGFjaz86IHN0cmluZyB9IHwgUGFyc2VkQW5vbnltb3VzUmVxdWVzdEVycm9yKSB7XG4gICAgaWYgKCdtZXNzYWdlJyBpbiBvYmopIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIG1lc3NhZ2Ugb2YgdGhlIGV4Y2VwdGlvblxuICAgICAgICogQHB1YmxpY1xuICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgKi9cbiAgICAgIHRoaXMubWVzc2FnZSA9IG9iai5tZXNzYWdlO1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgc3RhY2sgdHJhY2Ugb2YgdGhlIGV4Y2VwdGlvbi4gKGphdmEpXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAqL1xuICAgICAgdGhpcy5zdGFjayA9IG9iai5zdGFjaztcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqLlJUX0VSUk9SKSkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbWVzc2FnZSBvZiB0aGUgZXhjZXB0aW9uXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAqL1xuICAgICAgdGhpcy5tZXNzYWdlID0gb2JqLlJUX0VSUk9SWzBdWydAX0VSUk9SX01FU1NBR0UnXVswXTtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIHN0YWNrIHRyYWNlIG9mIHRoZSBleGNlcHRpb24uIChqYXZhKVxuICAgICAgICogQHB1YmxpY1xuICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgKi9cbiAgICAgIHRoaXMuc3RhY2sgPSBvYmouUlRfRVJST1JbMF0uU1RBQ0tfVFJBQ0VbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIG1lc3NhZ2Ugb2YgdGhlIGV4Y2VwdGlvblxuICAgICAgICogQHB1YmxpY1xuICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgKi9cbiAgICAgIHRoaXMubWVzc2FnZSA9IG9iai5SVF9FUlJPUlsnQF9FUlJPUl9NRVNTQUdFJ107XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBzdGFjayB0cmFjZSBvZiB0aGUgZXhjZXB0aW9uLiAoamF2YSlcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqIEByZWFkb25seVxuICAgICAgICovXG4gICAgICB0aGlzLnN0YWNrID0gb2JqLlJUX0VSUk9SLlNUQUNLX1RSQUNFO1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7RUFDZSxNQUFNQSxnQkFBZ0IsQ0FBQztJQUs3QkMsV0FBVyxDQUFDQyxHQUEyRixFQUFFO01BQzlHLElBQUksU0FBUyxJQUFJQSxHQUFHLEVBQUU7UUFDcEI7QUFDTjtBQUNBO0FBQ0E7QUFDQTtRQUNNLElBQUksQ0FBQ0MsT0FBTyxHQUFHRCxHQUFHLENBQUNDLE9BQU87UUFDMUI7QUFDTjtBQUNBO0FBQ0E7QUFDQTtRQUNNLElBQUksQ0FBQ0MsS0FBSyxHQUFHRixHQUFHLENBQUNFLEtBQUs7TUFDeEIsQ0FBQyxNQUFNLElBQUlDLEtBQUssQ0FBQ0MsT0FBTyxDQUFDSixHQUFHLENBQUNLLFFBQVEsQ0FBQyxFQUFFO1FBQ3RDO0FBQ047QUFDQTtBQUNBO0FBQ0E7UUFDTSxJQUFJLENBQUNKLE9BQU8sR0FBR0QsR0FBRyxDQUFDSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQ7QUFDTjtBQUNBO0FBQ0E7QUFDQTtRQUNNLElBQUksQ0FBQ0gsS0FBSyxHQUFHRixHQUFHLENBQUNLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsV0FBVyxDQUFDLENBQUMsQ0FBQztNQUM3QyxDQUFDLE1BQU07UUFDTDtBQUNOO0FBQ0E7QUFDQTtBQUNBO1FBQ00sSUFBSSxDQUFDTCxPQUFPLEdBQUdELEdBQUcsQ0FBQ0ssUUFBUSxDQUFDLGlCQUFpQixDQUFDO1FBQzlDO0FBQ047QUFDQTtBQUNBO0FBQ0E7UUFDTSxJQUFJLENBQUNILEtBQUssR0FBR0YsR0FBRyxDQUFDSyxRQUFRLENBQUNDLFdBQVc7TUFDdkM7SUFDRjtFQUNGO0VBQUM7QUFBQSJ9