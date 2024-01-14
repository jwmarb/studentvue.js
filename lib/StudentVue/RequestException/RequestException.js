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
        const rtError = obj.RT_ERROR[0];
        /**
         * The message of the exception
         * @public
         * @readonly
         */
        this.message = rtError['@_ERROR_MESSAGE'][0];
        /**
         * The stack trace of the exception. (java)
         * @public
         * @readonly
         */
        this.stack = rtError.STACK_TRACE ? rtError.STACK_TRACE[0] : undefined;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZXF1ZXN0RXhjZXB0aW9uIiwiY29uc3RydWN0b3IiLCJvYmoiLCJtZXNzYWdlIiwic3RhY2siLCJBcnJheSIsImlzQXJyYXkiLCJSVF9FUlJPUiIsInJ0RXJyb3IiLCJTVEFDS19UUkFDRSIsInVuZGVmaW5lZCJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL1JlcXVlc3RFeGNlcHRpb24vUmVxdWVzdEV4Y2VwdGlvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYXJzZWRBbm9ueW1vdXNSZXF1ZXN0RXJyb3IsIFBhcnNlZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuXHJcbi8qKlxyXG4gKiBSZXF1ZXN0RXhjZXB0aW9uIGlzIGEgY2xhc3MgdXNlZCB0byBwYXJzZSBlcnJvcnMgZnJvbSBTeW5lcmd5IHNlcnZlcnNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXF1ZXN0RXhjZXB0aW9uIHtcclxuICBwdWJsaWMgcmVhZG9ubHkgbWVzc2FnZTogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgc3RhY2s6IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKG9iajogUGFyc2VkUmVxdWVzdEVycm9yIHwgeyBtZXNzYWdlOiBzdHJpbmc7IHN0YWNrPzogc3RyaW5nIH0gfCBQYXJzZWRBbm9ueW1vdXNSZXF1ZXN0RXJyb3IpIHtcclxuICAgIGlmICgnbWVzc2FnZScgaW4gb2JqKSB7XHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBUaGUgbWVzc2FnZSBvZiB0aGUgZXhjZXB0aW9uXHJcbiAgICAgICAqIEBwdWJsaWNcclxuICAgICAgICogQHJlYWRvbmx5XHJcbiAgICAgICAqL1xyXG4gICAgICB0aGlzLm1lc3NhZ2UgPSBvYmoubWVzc2FnZTtcclxuICAgICAgLyoqXHJcbiAgICAgICAqIFRoZSBzdGFjayB0cmFjZSBvZiB0aGUgZXhjZXB0aW9uLiAoamF2YSlcclxuICAgICAgICogQHB1YmxpY1xyXG4gICAgICAgKiBAcmVhZG9ubHlcclxuICAgICAgICovXHJcbiAgICAgIHRoaXMuc3RhY2sgPSBvYmouc3RhY2s7XHJcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqLlJUX0VSUk9SKSkge1xyXG4gICAgICBjb25zdCBydEVycm9yID0gb2JqLlJUX0VSUk9SWzBdO1xyXG4gICAgICAvKipcclxuICAgICAgICogVGhlIG1lc3NhZ2Ugb2YgdGhlIGV4Y2VwdGlvblxyXG4gICAgICAgKiBAcHVibGljXHJcbiAgICAgICAqIEByZWFkb25seVxyXG4gICAgICAgKi9cclxuICAgICAgdGhpcy5tZXNzYWdlID0gcnRFcnJvclsnQF9FUlJPUl9NRVNTQUdFJ11bMF07XHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBUaGUgc3RhY2sgdHJhY2Ugb2YgdGhlIGV4Y2VwdGlvbi4gKGphdmEpXHJcbiAgICAgICAqIEBwdWJsaWNcclxuICAgICAgICogQHJlYWRvbmx5XHJcbiAgICAgICAqL1xyXG4gICAgICB0aGlzLnN0YWNrID0gcnRFcnJvci5TVEFDS19UUkFDRSA/IHJ0RXJyb3IuU1RBQ0tfVFJBQ0VbMF0gOiB1bmRlZmluZWQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvKipcclxuICAgICAgICogVGhlIG1lc3NhZ2Ugb2YgdGhlIGV4Y2VwdGlvblxyXG4gICAgICAgKiBAcHVibGljXHJcbiAgICAgICAqIEByZWFkb25seVxyXG4gICAgICAgKi9cclxuICAgICAgdGhpcy5tZXNzYWdlID0gb2JqLlJUX0VSUk9SWydAX0VSUk9SX01FU1NBR0UnXTtcclxuICAgICAgLyoqXHJcbiAgICAgICAqIFRoZSBzdGFjayB0cmFjZSBvZiB0aGUgZXhjZXB0aW9uLiAoamF2YSlcclxuICAgICAgICogQHB1YmxpY1xyXG4gICAgICAgKiBAcmVhZG9ubHlcclxuICAgICAgICovXHJcbiAgICAgIHRoaXMuc3RhY2sgPSBvYmouUlRfRVJST1IuU1RBQ0tfVFJBQ0U7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUVBO0FBQ0E7QUFDQTtBQUNBO0VBQ2UsTUFBTUEsZ0JBQWdCLENBQUM7SUFLN0JDLFdBQVcsQ0FBQ0MsR0FBMkYsRUFBRTtNQUM5RyxJQUFJLFNBQVMsSUFBSUEsR0FBRyxFQUFFO1FBQ3BCO0FBQ047QUFDQTtBQUNBO0FBQ0E7UUFDTSxJQUFJLENBQUNDLE9BQU8sR0FBR0QsR0FBRyxDQUFDQyxPQUFPO1FBQzFCO0FBQ047QUFDQTtBQUNBO0FBQ0E7UUFDTSxJQUFJLENBQUNDLEtBQUssR0FBR0YsR0FBRyxDQUFDRSxLQUFLO01BQ3hCLENBQUMsTUFBTSxJQUFJQyxLQUFLLENBQUNDLE9BQU8sQ0FBQ0osR0FBRyxDQUFDSyxRQUFRLENBQUMsRUFBRTtRQUN0QyxNQUFNQyxPQUFPLEdBQUdOLEdBQUcsQ0FBQ0ssUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMvQjtBQUNOO0FBQ0E7QUFDQTtBQUNBO1FBQ00sSUFBSSxDQUFDSixPQUFPLEdBQUdLLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QztBQUNOO0FBQ0E7QUFDQTtBQUNBO1FBQ00sSUFBSSxDQUFDSixLQUFLLEdBQUdJLE9BQU8sQ0FBQ0MsV0FBVyxHQUFHRCxPQUFPLENBQUNDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBR0MsU0FBUztNQUN2RSxDQUFDLE1BQU07UUFDTDtBQUNOO0FBQ0E7QUFDQTtBQUNBO1FBQ00sSUFBSSxDQUFDUCxPQUFPLEdBQUdELEdBQUcsQ0FBQ0ssUUFBUSxDQUFDLGlCQUFpQixDQUFDO1FBQzlDO0FBQ047QUFDQTtBQUNBO0FBQ0E7UUFDTSxJQUFJLENBQUNILEtBQUssR0FBR0YsR0FBRyxDQUFDSyxRQUFRLENBQUNFLFdBQVc7TUFDdkM7SUFDRjtFQUNGO0VBQUM7QUFBQSJ9