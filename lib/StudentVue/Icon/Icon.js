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
    global.Icon = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  class Icon {
    /**
     *
     * @param path The URL path to the icon (e.g. /path/to/icon.png)
     * @param hostUrl The host url (e.g. https://schooldistrict.org/)
     */
    constructor(path, hostUrl) {
      /**
       * The URI of the icon
       * @public
       * @readonly
       * @type {string}
       */
      this.uri = hostUrl + path;
    }

  }

  _exports.default = Icon;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0ljb24vSWNvbi50cyJdLCJuYW1lcyI6WyJJY29uIiwiY29uc3RydWN0b3IiLCJwYXRoIiwiaG9zdFVybCIsInVyaSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZSxRQUFNQSxJQUFOLENBQVc7QUFHeEI7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNTQyxJQUFBQSxXQUFXLENBQUNDLElBQUQsRUFBZUMsT0FBZixFQUFnQztBQUNoRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSSxXQUFLQyxHQUFMLEdBQVdELE9BQU8sR0FBR0QsSUFBckI7QUFDRDs7QUFoQnVCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSWNvbiB7XHJcbiAgcHVibGljIHJlYWRvbmx5IHVyaTogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSBwYXRoIFRoZSBVUkwgcGF0aCB0byB0aGUgaWNvbiAoZS5nLiAvcGF0aC90by9pY29uLnBuZylcclxuICAgKiBAcGFyYW0gaG9zdFVybCBUaGUgaG9zdCB1cmwgKGUuZy4gaHR0cHM6Ly9zY2hvb2xkaXN0cmljdC5vcmcvKVxyXG4gICAqL1xyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcsIGhvc3RVcmw6IHN0cmluZykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgVVJJIG9mIHRoZSBpY29uXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMudXJpID0gaG9zdFVybCArIHBhdGg7XHJcbiAgfVxyXG59XHJcbiJdfQ==