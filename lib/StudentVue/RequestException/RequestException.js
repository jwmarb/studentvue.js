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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZXF1ZXN0RXhjZXB0aW9uIiwiY29uc3RydWN0b3IiLCJvYmoiLCJtZXNzYWdlIiwic3RhY2siLCJBcnJheSIsImlzQXJyYXkiLCJSVF9FUlJPUiIsIlNUQUNLX1RSQUNFIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL1N0dWRlbnRWdWUvUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhcnNlZEFub255bW91c1JlcXVlc3RFcnJvciwgUGFyc2VkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5cclxuLyoqXHJcbiAqIFJlcXVlc3RFeGNlcHRpb24gaXMgYSBjbGFzcyB1c2VkIHRvIHBhcnNlIGVycm9ycyBmcm9tIFN5bmVyZ3kgc2VydmVyc1xyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcXVlc3RFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyByZWFkb25seSBtZXNzYWdlOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBzdGFjazogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3Iob2JqOiBQYXJzZWRSZXF1ZXN0RXJyb3IgfCB7IG1lc3NhZ2U6IHN0cmluZzsgc3RhY2s/OiBzdHJpbmcgfSB8IFBhcnNlZEFub255bW91c1JlcXVlc3RFcnJvcikge1xyXG4gICAgaWYgKCdtZXNzYWdlJyBpbiBvYmopIHtcclxuICAgICAgLyoqXHJcbiAgICAgICAqIFRoZSBtZXNzYWdlIG9mIHRoZSBleGNlcHRpb25cclxuICAgICAgICogQHB1YmxpY1xyXG4gICAgICAgKiBAcmVhZG9ubHlcclxuICAgICAgICovXHJcbiAgICAgIHRoaXMubWVzc2FnZSA9IG9iai5tZXNzYWdlO1xyXG4gICAgICAvKipcclxuICAgICAgICogVGhlIHN0YWNrIHRyYWNlIG9mIHRoZSBleGNlcHRpb24uIChqYXZhKVxyXG4gICAgICAgKiBAcHVibGljXHJcbiAgICAgICAqIEByZWFkb25seVxyXG4gICAgICAgKi9cclxuICAgICAgdGhpcy5zdGFjayA9IG9iai5zdGFjaztcclxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmouUlRfRVJST1IpKSB7XHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBUaGUgbWVzc2FnZSBvZiB0aGUgZXhjZXB0aW9uXHJcbiAgICAgICAqIEBwdWJsaWNcclxuICAgICAgICogQHJlYWRvbmx5XHJcbiAgICAgICAqL1xyXG4gICAgICB0aGlzLm1lc3NhZ2UgPSBvYmouUlRfRVJST1JbMF1bJ0BfRVJST1JfTUVTU0FHRSddWzBdO1xyXG4gICAgICAvKipcclxuICAgICAgICogVGhlIHN0YWNrIHRyYWNlIG9mIHRoZSBleGNlcHRpb24uIChqYXZhKVxyXG4gICAgICAgKiBAcHVibGljXHJcbiAgICAgICAqIEByZWFkb25seVxyXG4gICAgICAgKi9cclxuICAgICAgdGhpcy5zdGFjayA9IG9iai5SVF9FUlJPUlswXS5TVEFDS19UUkFDRVswXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBUaGUgbWVzc2FnZSBvZiB0aGUgZXhjZXB0aW9uXHJcbiAgICAgICAqIEBwdWJsaWNcclxuICAgICAgICogQHJlYWRvbmx5XHJcbiAgICAgICAqL1xyXG4gICAgICB0aGlzLm1lc3NhZ2UgPSBvYmouUlRfRVJST1JbJ0BfRVJST1JfTUVTU0FHRSddO1xyXG4gICAgICAvKipcclxuICAgICAgICogVGhlIHN0YWNrIHRyYWNlIG9mIHRoZSBleGNlcHRpb24uIChqYXZhKVxyXG4gICAgICAgKiBAcHVibGljXHJcbiAgICAgICAqIEByZWFkb25seVxyXG4gICAgICAgKi9cclxuICAgICAgdGhpcy5zdGFjayA9IG9iai5SVF9FUlJPUi5TVEFDS19UUkFDRTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7RUFDZSxNQUFNQSxnQkFBZ0IsQ0FBQztJQUs3QkMsV0FBVyxDQUFDQyxHQUEyRixFQUFFO01BQzlHLElBQUksU0FBUyxJQUFJQSxHQUFHLEVBQUU7UUFDcEI7QUFDTjtBQUNBO0FBQ0E7QUFDQTtRQUNNLElBQUksQ0FBQ0MsT0FBTyxHQUFHRCxHQUFHLENBQUNDLE9BQU87UUFDMUI7QUFDTjtBQUNBO0FBQ0E7QUFDQTtRQUNNLElBQUksQ0FBQ0MsS0FBSyxHQUFHRixHQUFHLENBQUNFLEtBQUs7TUFDeEIsQ0FBQyxNQUFNLElBQUlDLEtBQUssQ0FBQ0MsT0FBTyxDQUFDSixHQUFHLENBQUNLLFFBQVEsQ0FBQyxFQUFFO1FBQ3RDO0FBQ047QUFDQTtBQUNBO0FBQ0E7UUFDTSxJQUFJLENBQUNKLE9BQU8sR0FBR0QsR0FBRyxDQUFDSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQ7QUFDTjtBQUNBO0FBQ0E7QUFDQTtRQUNNLElBQUksQ0FBQ0gsS0FBSyxHQUFHRixHQUFHLENBQUNLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsV0FBVyxDQUFDLENBQUMsQ0FBQztNQUM3QyxDQUFDLE1BQU07UUFDTDtBQUNOO0FBQ0E7QUFDQTtBQUNBO1FBQ00sSUFBSSxDQUFDTCxPQUFPLEdBQUdELEdBQUcsQ0FBQ0ssUUFBUSxDQUFDLGlCQUFpQixDQUFDO1FBQzlDO0FBQ047QUFDQTtBQUNBO0FBQ0E7UUFDTSxJQUFJLENBQUNILEtBQUssR0FBR0YsR0FBRyxDQUFDSyxRQUFRLENBQUNDLFdBQVc7TUFDdkM7SUFDRjtFQUNGO0VBQUM7QUFBQSJ9