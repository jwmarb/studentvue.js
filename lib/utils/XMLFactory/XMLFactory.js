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
    global.XMLFactory = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
   * Use this class to mutate and manipulate XML before parsing it into an XML object
   */
  class XMLFactory {
    /**
     *
     * @param xml XML in a string
     */
    constructor(xml) {
      /**
       * The XML you want to mutate before parsing into a javascript object
       * @type {string}
       */
      this.xml = xml;
    }
    /**
     * Mutate an attribute's value to encode it into a base64 so that `fast-xml-parser` does not have parsing errors.
     * @param attributeName The attribute that should have its value converted to a base64
     * @param followingAttributeName The attribute after the mutated attribute so that the location of `attributeName` can be identified through regular expressions
     * @returns {XMLFactory} Returns another instance of XMLFactory for method chaining
     * @description
     * The appropriate scenario to use this is when an XML attribute breaks `fast-xml-parser`. Such example would be this XML:
     * ```xml
     * <Assignment MeasureDescription="We did this lab together, so just turning it in gives full credit. To turn in, take a good picture of the lab in your lab notebook and upload it onto the Class Notebook page under the assignment in Teams. Then click "Turn In" on the assignment on Teams." HasDropBox="false">
     * ```
     * As you can see, `MeasureDescription` has non-escaped quotation marks around **Turn In**, therefore `fast-xml-parser` throws an error.
     * This method fixes this issue by replacing `MeasureDescription`'s value with an encoded base64 string. This is how we would call this method and return a string:
     * ```js
     * new XMLFactory(assignmentXML)
     *  .encodeAttribute("MeasureDescription", "HasDropBox")
     *  .toString();
     * ```
     * After encoding it to base64, `fast-xml-parser` will now work. The downside of this method is that `atob` must be called to get the actual value of the attribute.
     */


    encodeAttribute(attributeName, followingAttributeName) {
      const regexp = new RegExp(`${attributeName}=".*" ${followingAttributeName}`, 'g');
      this.xml = this.xml.replace(regexp, found => {
        const base64 = btoa(unescape(encodeURIComponent(found.substring(attributeName.length + 2, found.length - followingAttributeName.length - 2))));
        return `${attributeName}="${base64}" ${followingAttributeName}`;
      });
      return this;
    }

    toString() {
      return this.xml;
    }

  }

  var _default = XMLFactory;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9YTUxGYWN0b3J5L1hNTEZhY3RvcnkudHMiXSwibmFtZXMiOlsiWE1MRmFjdG9yeSIsImNvbnN0cnVjdG9yIiwieG1sIiwiZW5jb2RlQXR0cmlidXRlIiwiYXR0cmlidXRlTmFtZSIsImZvbGxvd2luZ0F0dHJpYnV0ZU5hbWUiLCJyZWdleHAiLCJSZWdFeHAiLCJyZXBsYWNlIiwiZm91bmQiLCJiYXNlNjQiLCJidG9hIiwidW5lc2NhcGUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzdWJzdHJpbmciLCJsZW5ndGgiLCJ0b1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQSxRQUFNQSxVQUFOLENBQWlCO0FBR2Y7QUFDRjtBQUNBO0FBQ0E7QUFDU0MsSUFBQUEsV0FBVyxDQUFDQyxHQUFELEVBQWM7QUFDOUI7QUFDSjtBQUNBO0FBQ0E7QUFDSSxXQUFLQSxHQUFMLEdBQVdBLEdBQVg7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU0MsSUFBQUEsZUFBZSxDQUFDQyxhQUFELEVBQXdCQyxzQkFBeEIsRUFBd0Q7QUFDNUUsWUFBTUMsTUFBTSxHQUFHLElBQUlDLE1BQUosQ0FBWSxHQUFFSCxhQUFjLFNBQVFDLHNCQUF1QixFQUEzRCxFQUE4RCxHQUE5RCxDQUFmO0FBRUEsV0FBS0gsR0FBTCxHQUFXLEtBQUtBLEdBQUwsQ0FBU00sT0FBVCxDQUFpQkYsTUFBakIsRUFBMEJHLEtBQUQsSUFBVztBQUM3QyxjQUFNQyxNQUFNLEdBQUdDLElBQUksQ0FDakJDLFFBQVEsQ0FDTkMsa0JBQWtCLENBQ2hCSixLQUFLLENBQUNLLFNBQU4sQ0FBZ0JWLGFBQWEsQ0FBQ1csTUFBZCxHQUF1QixDQUF2QyxFQUEwQ04sS0FBSyxDQUFDTSxNQUFOLEdBQWVWLHNCQUFzQixDQUFDVSxNQUF0QyxHQUErQyxDQUF6RixDQURnQixDQURaLENBRFMsQ0FBbkI7QUFPQSxlQUFRLEdBQUVYLGFBQWMsS0FBSU0sTUFBTyxLQUFJTCxzQkFBdUIsRUFBOUQ7QUFDRCxPQVRVLENBQVg7QUFXQSxhQUFPLElBQVA7QUFDRDs7QUFFTVcsSUFBQUEsUUFBUSxHQUFXO0FBQ3hCLGFBQU8sS0FBS2QsR0FBWjtBQUNEOztBQXJEYzs7aUJBd0RGRixVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFVzZSB0aGlzIGNsYXNzIHRvIG11dGF0ZSBhbmQgbWFuaXB1bGF0ZSBYTUwgYmVmb3JlIHBhcnNpbmcgaXQgaW50byBhbiBYTUwgb2JqZWN0XHJcbiAqL1xyXG5jbGFzcyBYTUxGYWN0b3J5IHtcclxuICBwcml2YXRlIHhtbDogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB4bWwgWE1MIGluIGEgc3RyaW5nXHJcbiAgICovXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKHhtbDogc3RyaW5nKSB7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBYTUwgeW91IHdhbnQgdG8gbXV0YXRlIGJlZm9yZSBwYXJzaW5nIGludG8gYSBqYXZhc2NyaXB0IG9iamVjdFxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgdGhpcy54bWwgPSB4bWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNdXRhdGUgYW4gYXR0cmlidXRlJ3MgdmFsdWUgdG8gZW5jb2RlIGl0IGludG8gYSBiYXNlNjQgc28gdGhhdCBgZmFzdC14bWwtcGFyc2VyYCBkb2VzIG5vdCBoYXZlIHBhcnNpbmcgZXJyb3JzLlxyXG4gICAqIEBwYXJhbSBhdHRyaWJ1dGVOYW1lIFRoZSBhdHRyaWJ1dGUgdGhhdCBzaG91bGQgaGF2ZSBpdHMgdmFsdWUgY29udmVydGVkIHRvIGEgYmFzZTY0XHJcbiAgICogQHBhcmFtIGZvbGxvd2luZ0F0dHJpYnV0ZU5hbWUgVGhlIGF0dHJpYnV0ZSBhZnRlciB0aGUgbXV0YXRlZCBhdHRyaWJ1dGUgc28gdGhhdCB0aGUgbG9jYXRpb24gb2YgYGF0dHJpYnV0ZU5hbWVgIGNhbiBiZSBpZGVudGlmaWVkIHRocm91Z2ggcmVndWxhciBleHByZXNzaW9uc1xyXG4gICAqIEByZXR1cm5zIHtYTUxGYWN0b3J5fSBSZXR1cm5zIGFub3RoZXIgaW5zdGFuY2Ugb2YgWE1MRmFjdG9yeSBmb3IgbWV0aG9kIGNoYWluaW5nXHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogVGhlIGFwcHJvcHJpYXRlIHNjZW5hcmlvIHRvIHVzZSB0aGlzIGlzIHdoZW4gYW4gWE1MIGF0dHJpYnV0ZSBicmVha3MgYGZhc3QteG1sLXBhcnNlcmAuIFN1Y2ggZXhhbXBsZSB3b3VsZCBiZSB0aGlzIFhNTDpcclxuICAgKiBgYGB4bWxcclxuICAgKiA8QXNzaWdubWVudCBNZWFzdXJlRGVzY3JpcHRpb249XCJXZSBkaWQgdGhpcyBsYWIgdG9nZXRoZXIsIHNvIGp1c3QgdHVybmluZyBpdCBpbiBnaXZlcyBmdWxsIGNyZWRpdC4gVG8gdHVybiBpbiwgdGFrZSBhIGdvb2QgcGljdHVyZSBvZiB0aGUgbGFiIGluIHlvdXIgbGFiIG5vdGVib29rIGFuZCB1cGxvYWQgaXQgb250byB0aGUgQ2xhc3MgTm90ZWJvb2sgcGFnZSB1bmRlciB0aGUgYXNzaWdubWVudCBpbiBUZWFtcy4gVGhlbiBjbGljayBcIlR1cm4gSW5cIiBvbiB0aGUgYXNzaWdubWVudCBvbiBUZWFtcy5cIiBIYXNEcm9wQm94PVwiZmFsc2VcIj5cclxuICAgKiBgYGBcclxuICAgKiBBcyB5b3UgY2FuIHNlZSwgYE1lYXN1cmVEZXNjcmlwdGlvbmAgaGFzIG5vbi1lc2NhcGVkIHF1b3RhdGlvbiBtYXJrcyBhcm91bmQgKipUdXJuIEluKiosIHRoZXJlZm9yZSBgZmFzdC14bWwtcGFyc2VyYCB0aHJvd3MgYW4gZXJyb3IuXHJcbiAgICogVGhpcyBtZXRob2QgZml4ZXMgdGhpcyBpc3N1ZSBieSByZXBsYWNpbmcgYE1lYXN1cmVEZXNjcmlwdGlvbmAncyB2YWx1ZSB3aXRoIGFuIGVuY29kZWQgYmFzZTY0IHN0cmluZy4gVGhpcyBpcyBob3cgd2Ugd291bGQgY2FsbCB0aGlzIG1ldGhvZCBhbmQgcmV0dXJuIGEgc3RyaW5nOlxyXG4gICAqIGBgYGpzXHJcbiAgICogbmV3IFhNTEZhY3RvcnkoYXNzaWdubWVudFhNTClcclxuICAgKiAgLmVuY29kZUF0dHJpYnV0ZShcIk1lYXN1cmVEZXNjcmlwdGlvblwiLCBcIkhhc0Ryb3BCb3hcIilcclxuICAgKiAgLnRvU3RyaW5nKCk7XHJcbiAgICogYGBgXHJcbiAgICogQWZ0ZXIgZW5jb2RpbmcgaXQgdG8gYmFzZTY0LCBgZmFzdC14bWwtcGFyc2VyYCB3aWxsIG5vdyB3b3JrLiBUaGUgZG93bnNpZGUgb2YgdGhpcyBtZXRob2QgaXMgdGhhdCBgYXRvYmAgbXVzdCBiZSBjYWxsZWQgdG8gZ2V0IHRoZSBhY3R1YWwgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZS5cclxuICAgKi9cclxuICBwdWJsaWMgZW5jb2RlQXR0cmlidXRlKGF0dHJpYnV0ZU5hbWU6IHN0cmluZywgZm9sbG93aW5nQXR0cmlidXRlTmFtZTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKGAke2F0dHJpYnV0ZU5hbWV9PVwiLipcIiAke2ZvbGxvd2luZ0F0dHJpYnV0ZU5hbWV9YCwgJ2cnKTtcclxuXHJcbiAgICB0aGlzLnhtbCA9IHRoaXMueG1sLnJlcGxhY2UocmVnZXhwLCAoZm91bmQpID0+IHtcclxuICAgICAgY29uc3QgYmFzZTY0ID0gYnRvYShcclxuICAgICAgICB1bmVzY2FwZShcclxuICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChcclxuICAgICAgICAgICAgZm91bmQuc3Vic3RyaW5nKGF0dHJpYnV0ZU5hbWUubGVuZ3RoICsgMiwgZm91bmQubGVuZ3RoIC0gZm9sbG93aW5nQXR0cmlidXRlTmFtZS5sZW5ndGggLSAyKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIClcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuIGAke2F0dHJpYnV0ZU5hbWV9PVwiJHtiYXNlNjR9XCIgJHtmb2xsb3dpbmdBdHRyaWJ1dGVOYW1lfWA7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMueG1sO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgWE1MRmFjdG9yeTtcclxuIl19