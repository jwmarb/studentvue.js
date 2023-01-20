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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJJY29uIiwiY29uc3RydWN0b3IiLCJwYXRoIiwiaG9zdFVybCIsInVyaSJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0ljb24vSWNvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBJY29uIHtcbiAgcHVibGljIHJlYWRvbmx5IHVyaTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCBUaGUgVVJMIHBhdGggdG8gdGhlIGljb24gKGUuZy4gL3BhdGgvdG8vaWNvbi5wbmcpXG4gICAqIEBwYXJhbSBob3N0VXJsIFRoZSBob3N0IHVybCAoZS5nLiBodHRwczovL3NjaG9vbGRpc3RyaWN0Lm9yZy8pXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IocGF0aDogc3RyaW5nLCBob3N0VXJsOiBzdHJpbmcpIHtcbiAgICAvKipcbiAgICAgKiBUaGUgVVJJIG9mIHRoZSBpY29uXG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy51cmkgPSBob3N0VXJsICsgcGF0aDtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQWUsTUFBTUEsSUFBSSxDQUFDO0lBR3hCO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7SUFDU0MsV0FBVyxDQUFDQyxJQUFZLEVBQUVDLE9BQWUsRUFBRTtNQUNoRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDSSxJQUFJLENBQUNDLEdBQUcsR0FBR0QsT0FBTyxHQUFHRCxJQUFJO0lBQzNCO0VBQ0Y7RUFBQztBQUFBIn0=