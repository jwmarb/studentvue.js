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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJJY29uIiwiY29uc3RydWN0b3IiLCJwYXRoIiwiaG9zdFVybCIsInVyaSJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0ljb24vSWNvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBJY29uIHtcclxuICBwdWJsaWMgcmVhZG9ubHkgdXJpOiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhdGggVGhlIFVSTCBwYXRoIHRvIHRoZSBpY29uIChlLmcuIC9wYXRoL3RvL2ljb24ucG5nKVxyXG4gICAqIEBwYXJhbSBob3N0VXJsIFRoZSBob3N0IHVybCAoZS5nLiBodHRwczovL3NjaG9vbGRpc3RyaWN0Lm9yZy8pXHJcbiAgICovXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgaG9zdFVybDogc3RyaW5nKSB7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBVUkkgb2YgdGhlIGljb25cclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgdGhpcy51cmkgPSBob3N0VXJsICsgcGF0aDtcclxuICB9XHJcbn1cclxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQWUsTUFBTUEsSUFBSSxDQUFDO0lBR3hCO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7SUFDU0MsV0FBVyxDQUFDQyxJQUFZLEVBQUVDLE9BQWUsRUFBRTtNQUNoRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDSSxJQUFJLENBQUNDLEdBQUcsR0FBR0QsT0FBTyxHQUFHRCxJQUFJO0lBQzNCO0VBQ0Y7RUFBQztBQUFBIn0=