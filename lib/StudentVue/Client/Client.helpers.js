(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "tiny-async-pool"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("tiny-async-pool"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.tinyAsyncPool);
    global.ClientHelpers = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _tinyAsyncPool) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.asyncPoolAll = asyncPoolAll;
  _exports.optional = optional;
  _tinyAsyncPool = _interopRequireDefault(_tinyAsyncPool);
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  /**
   * Use concurrency limits to fulfill promises
   * @param poolLimit The concurrency limit
   * @param array An array of Promises
   * @param iteratorFn A map function
   * @returns Returns the results of each promise.
   */
  async function asyncPoolAll(poolLimit, array, iteratorFn) {
    const results = [];
    for await (const result of (0, _tinyAsyncPool.default)(poolLimit, array, iteratorFn)) {
      results.push(result);
    }
    return results;
  }

  /**
   * A short and simplified version of the single-line if-else statement.
   * @param xmlArr The input is a value parsed from the XML parser library. It will be an array
   * @returns Returns undefined or the value of the XML
   */
  function optional(xmlArr) {
    return xmlArr ? xmlArr[0] : undefined;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3luY1Bvb2xBbGwiLCJwb29sTGltaXQiLCJhcnJheSIsIml0ZXJhdG9yRm4iLCJyZXN1bHRzIiwicmVzdWx0IiwiYXN5bmNQb29sIiwicHVzaCIsIm9wdGlvbmFsIiwieG1sQXJyIiwidW5kZWZpbmVkIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL1N0dWRlbnRWdWUvQ2xpZW50L0NsaWVudC5oZWxwZXJzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhc3luY1Bvb2wgZnJvbSAndGlueS1hc3luYy1wb29sJztcclxuXHJcbi8qKlxyXG4gKiBVc2UgY29uY3VycmVuY3kgbGltaXRzIHRvIGZ1bGZpbGwgcHJvbWlzZXNcclxuICogQHBhcmFtIHBvb2xMaW1pdCBUaGUgY29uY3VycmVuY3kgbGltaXRcclxuICogQHBhcmFtIGFycmF5IEFuIGFycmF5IG9mIFByb21pc2VzXHJcbiAqIEBwYXJhbSBpdGVyYXRvckZuIEEgbWFwIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIFJldHVybnMgdGhlIHJlc3VsdHMgb2YgZWFjaCBwcm9taXNlLlxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFzeW5jUG9vbEFsbDxJTiwgT1VUPihcclxuICBwb29sTGltaXQ6IG51bWJlcixcclxuICBhcnJheTogcmVhZG9ubHkgSU5bXSxcclxuICBpdGVyYXRvckZuOiAoZ2VuZXJhdG9yOiBJTikgPT4gUHJvbWlzZTxPVVQ+XHJcbikge1xyXG4gIGNvbnN0IHJlc3VsdHM6IEF3YWl0ZWQ8T1VUPltdID0gW107XHJcbiAgZm9yIGF3YWl0IChjb25zdCByZXN1bHQgb2YgYXN5bmNQb29sKHBvb2xMaW1pdCwgYXJyYXksIGl0ZXJhdG9yRm4pKSB7XHJcbiAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdHM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIHNob3J0IGFuZCBzaW1wbGlmaWVkIHZlcnNpb24gb2YgdGhlIHNpbmdsZS1saW5lIGlmLWVsc2Ugc3RhdGVtZW50LlxyXG4gKiBAcGFyYW0geG1sQXJyIFRoZSBpbnB1dCBpcyBhIHZhbHVlIHBhcnNlZCBmcm9tIHRoZSBYTUwgcGFyc2VyIGxpYnJhcnkuIEl0IHdpbGwgYmUgYW4gYXJyYXlcclxuICogQHJldHVybnMgUmV0dXJucyB1bmRlZmluZWQgb3IgdGhlIHZhbHVlIG9mIHRoZSBYTUxcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBvcHRpb25hbDxUPih4bWxBcnI/OiBUW10pOiBUIHwgdW5kZWZpbmVkIHtcclxuICByZXR1cm4geG1sQXJyID8geG1sQXJyWzBdIDogdW5kZWZpbmVkO1xyXG59XHJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ08sZUFBZUEsWUFBWSxDQUNoQ0MsU0FBaUIsRUFDakJDLEtBQW9CLEVBQ3BCQyxVQUEyQyxFQUMzQztJQUNBLE1BQU1DLE9BQXVCLEdBQUcsRUFBRTtJQUNsQyxXQUFXLE1BQU1DLE1BQU0sSUFBSSxJQUFBQyxzQkFBUyxFQUFDTCxTQUFTLEVBQUVDLEtBQUssRUFBRUMsVUFBVSxDQUFDLEVBQUU7TUFDbEVDLE9BQU8sQ0FBQ0csSUFBSSxDQUFDRixNQUFNLENBQUM7SUFDdEI7SUFDQSxPQUFPRCxPQUFPO0VBQ2hCOztFQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDTyxTQUFTSSxRQUFRLENBQUlDLE1BQVksRUFBaUI7SUFDdkQsT0FBT0EsTUFBTSxHQUFHQSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUdDLFNBQVM7RUFDdkM7QUFBQyJ9