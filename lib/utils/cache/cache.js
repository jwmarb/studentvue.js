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
    global.cache = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  class Cache {
    memoized = new Map();

    /**
     * Memoize a value so that it can be used again
     * @param {T} val The value to memoize
     * @returns Returns the value
     */
    memo(val) {
      const fn = val.toString();
      const memoizedVal = this.memoized.get(fn);
      if (memoizedVal == null) {
        const result = val();
        this.memoized.set(fn, result);
        return result;
      }
      return memoizedVal;
    }
    isMemo(key) {
      return !!this.memoized.get(key);
    }
  }
  var _default = new Cache();
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDYWNoZSIsIm1lbW9pemVkIiwiTWFwIiwibWVtbyIsInZhbCIsImZuIiwidG9TdHJpbmciLCJtZW1vaXplZFZhbCIsImdldCIsInJlc3VsdCIsInNldCIsImlzTWVtbyIsImtleSJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9jYWNoZS9jYWNoZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBDYWNoZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWVtb2l6ZWQ6IE1hcDxzdHJpbmcsIHVua25vd24+ID0gbmV3IE1hcCgpO1xuXG4gIC8qKlxuICAgKiBNZW1vaXplIGEgdmFsdWUgc28gdGhhdCBpdCBjYW4gYmUgdXNlZCBhZ2FpblxuICAgKiBAcGFyYW0ge1R9IHZhbCBUaGUgdmFsdWUgdG8gbWVtb2l6ZVxuICAgKiBAcmV0dXJucyBSZXR1cm5zIHRoZSB2YWx1ZVxuICAgKi9cbiAgcHVibGljIG1lbW88VD4odmFsOiAoKSA9PiBUKTogVCB7XG4gICAgY29uc3QgZm4gPSB2YWwudG9TdHJpbmcoKTtcbiAgICBjb25zdCBtZW1vaXplZFZhbCA9IHRoaXMubWVtb2l6ZWQuZ2V0KGZuKSBhcyBUO1xuICAgIGlmIChtZW1vaXplZFZhbCA9PSBudWxsKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB2YWwoKTtcbiAgICAgIHRoaXMubWVtb2l6ZWQuc2V0KGZuLCByZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcmV0dXJuIG1lbW9pemVkVmFsO1xuICB9XG5cbiAgcHVibGljIGlzTWVtbyhrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMubWVtb2l6ZWQuZ2V0KGtleSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IENhY2hlKCk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBQSxNQUFNQSxLQUFLLENBQUM7SUFDT0MsUUFBUSxHQUF5QixJQUFJQyxHQUFHLEVBQUU7O0lBRTNEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7SUFDU0MsSUFBSSxDQUFJQyxHQUFZLEVBQUs7TUFDOUIsTUFBTUMsRUFBRSxHQUFHRCxHQUFHLENBQUNFLFFBQVEsRUFBRTtNQUN6QixNQUFNQyxXQUFXLEdBQUcsSUFBSSxDQUFDTixRQUFRLENBQUNPLEdBQUcsQ0FBQ0gsRUFBRSxDQUFNO01BQzlDLElBQUlFLFdBQVcsSUFBSSxJQUFJLEVBQUU7UUFDdkIsTUFBTUUsTUFBTSxHQUFHTCxHQUFHLEVBQUU7UUFDcEIsSUFBSSxDQUFDSCxRQUFRLENBQUNTLEdBQUcsQ0FBQ0wsRUFBRSxFQUFFSSxNQUFNLENBQUM7UUFDN0IsT0FBT0EsTUFBTTtNQUNmO01BQ0EsT0FBT0YsV0FBVztJQUNwQjtJQUVPSSxNQUFNLENBQUNDLEdBQVcsRUFBVztNQUNsQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUNYLFFBQVEsQ0FBQ08sR0FBRyxDQUFDSSxHQUFHLENBQUM7SUFDakM7RUFDRjtFQUFDLGVBRWMsSUFBSVosS0FBSyxFQUFFO0VBQUE7QUFBQSJ9