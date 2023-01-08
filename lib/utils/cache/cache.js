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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDYWNoZSIsIm1lbW9pemVkIiwiTWFwIiwibWVtbyIsInZhbCIsImZuIiwidG9TdHJpbmciLCJtZW1vaXplZFZhbCIsImdldCIsInJlc3VsdCIsInNldCIsImlzTWVtbyIsImtleSJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9jYWNoZS9jYWNoZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBDYWNoZSB7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBtZW1vaXplZDogTWFwPHN0cmluZywgdW5rbm93bj4gPSBuZXcgTWFwKCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIE1lbW9pemUgYSB2YWx1ZSBzbyB0aGF0IGl0IGNhbiBiZSB1c2VkIGFnYWluXHJcbiAgICogQHBhcmFtIHtUfSB2YWwgVGhlIHZhbHVlIHRvIG1lbW9pemVcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIHRoZSB2YWx1ZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBtZW1vPFQ+KHZhbDogKCkgPT4gVCk6IFQge1xyXG4gICAgY29uc3QgZm4gPSB2YWwudG9TdHJpbmcoKTtcclxuICAgIGNvbnN0IG1lbW9pemVkVmFsID0gdGhpcy5tZW1vaXplZC5nZXQoZm4pIGFzIFQ7XHJcbiAgICBpZiAobWVtb2l6ZWRWYWwgPT0gbnVsbCkge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSB2YWwoKTtcclxuICAgICAgdGhpcy5tZW1vaXplZC5zZXQoZm4sIHJlc3VsdCk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbWVtb2l6ZWRWYWw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNNZW1vKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gISF0aGlzLm1lbW9pemVkLmdldChrZXkpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IENhY2hlKCk7XHJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFBLE1BQU1BLEtBQUssQ0FBQztJQUNPQyxRQUFRLEdBQXlCLElBQUlDLEdBQUcsRUFBRTs7SUFFM0Q7QUFDRjtBQUNBO0FBQ0E7QUFDQTtJQUNTQyxJQUFJLENBQUlDLEdBQVksRUFBSztNQUM5QixNQUFNQyxFQUFFLEdBQUdELEdBQUcsQ0FBQ0UsUUFBUSxFQUFFO01BQ3pCLE1BQU1DLFdBQVcsR0FBRyxJQUFJLENBQUNOLFFBQVEsQ0FBQ08sR0FBRyxDQUFDSCxFQUFFLENBQU07TUFDOUMsSUFBSUUsV0FBVyxJQUFJLElBQUksRUFBRTtRQUN2QixNQUFNRSxNQUFNLEdBQUdMLEdBQUcsRUFBRTtRQUNwQixJQUFJLENBQUNILFFBQVEsQ0FBQ1MsR0FBRyxDQUFDTCxFQUFFLEVBQUVJLE1BQU0sQ0FBQztRQUM3QixPQUFPQSxNQUFNO01BQ2Y7TUFDQSxPQUFPRixXQUFXO0lBQ3BCO0lBRU9JLE1BQU0sQ0FBQ0MsR0FBVyxFQUFXO01BQ2xDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQ1gsUUFBUSxDQUFDTyxHQUFHLENBQUNJLEdBQUcsQ0FBQztJQUNqQztFQUNGO0VBQUMsZUFFYyxJQUFJWixLQUFLLEVBQUU7RUFBQTtBQUFBIn0=