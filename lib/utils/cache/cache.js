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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9jYWNoZS9jYWNoZS50cyJdLCJuYW1lcyI6WyJDYWNoZSIsIm1lbW9pemVkIiwiTWFwIiwibWVtbyIsInZhbCIsImZuIiwidG9TdHJpbmciLCJtZW1vaXplZFZhbCIsImdldCIsInJlc3VsdCIsInNldCIsImlzTWVtbyIsImtleSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxRQUFNQSxLQUFOLENBQVk7QUFDT0MsSUFBQUEsUUFBUSxHQUF5QixJQUFJQyxHQUFKLEVBQXpCO0FBRXpCO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBQ1NDLElBQUFBLElBQUksQ0FBSUMsR0FBSixFQUFxQjtBQUM5QixZQUFNQyxFQUFFLEdBQUdELEdBQUcsQ0FBQ0UsUUFBSixFQUFYO0FBQ0EsWUFBTUMsV0FBVyxHQUFHLEtBQUtOLFFBQUwsQ0FBY08sR0FBZCxDQUFrQkgsRUFBbEIsQ0FBcEI7O0FBQ0EsVUFBSUUsV0FBVyxJQUFJLElBQW5CLEVBQXlCO0FBQ3ZCLGNBQU1FLE1BQU0sR0FBR0wsR0FBRyxFQUFsQjtBQUNBLGFBQUtILFFBQUwsQ0FBY1MsR0FBZCxDQUFrQkwsRUFBbEIsRUFBc0JJLE1BQXRCO0FBQ0EsZUFBT0EsTUFBUDtBQUNEOztBQUNELGFBQU9GLFdBQVA7QUFDRDs7QUFFTUksSUFBQUEsTUFBTSxDQUFDQyxHQUFELEVBQXVCO0FBQ2xDLGFBQU8sQ0FBQyxDQUFDLEtBQUtYLFFBQUwsQ0FBY08sR0FBZCxDQUFrQkksR0FBbEIsQ0FBVDtBQUNEOztBQXJCUzs7aUJBd0JHLElBQUlaLEtBQUosRSIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIENhY2hlIHtcclxuICBwcml2YXRlIHJlYWRvbmx5IG1lbW9pemVkOiBNYXA8c3RyaW5nLCB1bmtub3duPiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgLyoqXHJcbiAgICogTWVtb2l6ZSBhIHZhbHVlIHNvIHRoYXQgaXQgY2FuIGJlIHVzZWQgYWdhaW5cclxuICAgKiBAcGFyYW0ge1R9IHZhbCBUaGUgdmFsdWUgdG8gbWVtb2l6ZVxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgdGhlIHZhbHVlXHJcbiAgICovXHJcbiAgcHVibGljIG1lbW88VD4odmFsOiAoKSA9PiBUKTogVCB7XHJcbiAgICBjb25zdCBmbiA9IHZhbC50b1N0cmluZygpO1xyXG4gICAgY29uc3QgbWVtb2l6ZWRWYWwgPSB0aGlzLm1lbW9pemVkLmdldChmbikgYXMgVDtcclxuICAgIGlmIChtZW1vaXplZFZhbCA9PSBudWxsKSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbCgpO1xyXG4gICAgICB0aGlzLm1lbW9pemVkLnNldChmbiwgcmVzdWx0KTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHJldHVybiBtZW1vaXplZFZhbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpc01lbW8oa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAhIXRoaXMubWVtb2l6ZWQuZ2V0KGtleSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgQ2FjaGUoKTtcclxuIl19