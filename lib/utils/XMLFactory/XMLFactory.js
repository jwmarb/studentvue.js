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
     * This method fixes this issue by replacing `MeasureDescription`'s value with an escaped string. This is how we would call this method and return a string:
     * ```js
     * new XMLFactory(assignmentXML)
     *  .encodeAttribute("MeasureDescription", "HasDropBox")
     *  .toString();
     * ```
     * After escaping the characters in the string, `fast-xml-parser` will now work. The downside of this method is that `decodeURI` must be called to get the actual value of the attribute.
     */


    encodeAttribute(attributeName, followingAttributeName) {
      const regexp = new RegExp(`${attributeName}=".*" ${followingAttributeName}`, 'g');
      this.xml = this.xml.replace(regexp, found => {
        const base64 = encodeURI(found.substring(attributeName.length + 2, found.length - followingAttributeName.length - 2));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9YTUxGYWN0b3J5L1hNTEZhY3RvcnkudHMiXSwibmFtZXMiOlsiWE1MRmFjdG9yeSIsImNvbnN0cnVjdG9yIiwieG1sIiwiZW5jb2RlQXR0cmlidXRlIiwiYXR0cmlidXRlTmFtZSIsImZvbGxvd2luZ0F0dHJpYnV0ZU5hbWUiLCJyZWdleHAiLCJSZWdFeHAiLCJyZXBsYWNlIiwiZm91bmQiLCJiYXNlNjQiLCJlbmNvZGVVUkkiLCJzdWJzdHJpbmciLCJsZW5ndGgiLCJ0b1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQSxRQUFNQSxVQUFOLENBQWlCO0FBR2Y7QUFDRjtBQUNBO0FBQ0E7QUFDU0MsSUFBQUEsV0FBVyxDQUFDQyxHQUFELEVBQWM7QUFDOUI7QUFDSjtBQUNBO0FBQ0E7QUFDSSxXQUFLQSxHQUFMLEdBQVdBLEdBQVg7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU0MsSUFBQUEsZUFBZSxDQUFDQyxhQUFELEVBQXdCQyxzQkFBeEIsRUFBd0Q7QUFDNUUsWUFBTUMsTUFBTSxHQUFHLElBQUlDLE1BQUosQ0FBWSxHQUFFSCxhQUFjLFNBQVFDLHNCQUF1QixFQUEzRCxFQUE4RCxHQUE5RCxDQUFmO0FBRUEsV0FBS0gsR0FBTCxHQUFXLEtBQUtBLEdBQUwsQ0FBU00sT0FBVCxDQUFpQkYsTUFBakIsRUFBMEJHLEtBQUQsSUFBVztBQUM3QyxjQUFNQyxNQUFNLEdBQUdDLFNBQVMsQ0FDdEJGLEtBQUssQ0FBQ0csU0FBTixDQUFnQlIsYUFBYSxDQUFDUyxNQUFkLEdBQXVCLENBQXZDLEVBQTBDSixLQUFLLENBQUNJLE1BQU4sR0FBZVIsc0JBQXNCLENBQUNRLE1BQXRDLEdBQStDLENBQXpGLENBRHNCLENBQXhCO0FBR0EsZUFBUSxHQUFFVCxhQUFjLEtBQUlNLE1BQU8sS0FBSUwsc0JBQXVCLEVBQTlEO0FBQ0QsT0FMVSxDQUFYO0FBT0EsYUFBTyxJQUFQO0FBQ0Q7O0FBRU1TLElBQUFBLFFBQVEsR0FBVztBQUN4QixhQUFPLEtBQUtaLEdBQVo7QUFDRDs7QUFqRGM7O2lCQW9ERkYsVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBVc2UgdGhpcyBjbGFzcyB0byBtdXRhdGUgYW5kIG1hbmlwdWxhdGUgWE1MIGJlZm9yZSBwYXJzaW5nIGl0IGludG8gYW4gWE1MIG9iamVjdFxyXG4gKi9cclxuY2xhc3MgWE1MRmFjdG9yeSB7XHJcbiAgcHJpdmF0ZSB4bWw6IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0geG1sIFhNTCBpbiBhIHN0cmluZ1xyXG4gICAqL1xyXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcih4bWw6IHN0cmluZykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgWE1MIHlvdSB3YW50IHRvIG11dGF0ZSBiZWZvcmUgcGFyc2luZyBpbnRvIGEgamF2YXNjcmlwdCBvYmplY3RcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMueG1sID0geG1sO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTXV0YXRlIGFuIGF0dHJpYnV0ZSdzIHZhbHVlIHRvIGVuY29kZSBpdCBpbnRvIGEgYmFzZTY0IHNvIHRoYXQgYGZhc3QteG1sLXBhcnNlcmAgZG9lcyBub3QgaGF2ZSBwYXJzaW5nIGVycm9ycy5cclxuICAgKiBAcGFyYW0gYXR0cmlidXRlTmFtZSBUaGUgYXR0cmlidXRlIHRoYXQgc2hvdWxkIGhhdmUgaXRzIHZhbHVlIGNvbnZlcnRlZCB0byBhIGJhc2U2NFxyXG4gICAqIEBwYXJhbSBmb2xsb3dpbmdBdHRyaWJ1dGVOYW1lIFRoZSBhdHRyaWJ1dGUgYWZ0ZXIgdGhlIG11dGF0ZWQgYXR0cmlidXRlIHNvIHRoYXQgdGhlIGxvY2F0aW9uIG9mIGBhdHRyaWJ1dGVOYW1lYCBjYW4gYmUgaWRlbnRpZmllZCB0aHJvdWdoIHJlZ3VsYXIgZXhwcmVzc2lvbnNcclxuICAgKiBAcmV0dXJucyB7WE1MRmFjdG9yeX0gUmV0dXJucyBhbm90aGVyIGluc3RhbmNlIG9mIFhNTEZhY3RvcnkgZm9yIG1ldGhvZCBjaGFpbmluZ1xyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIFRoZSBhcHByb3ByaWF0ZSBzY2VuYXJpbyB0byB1c2UgdGhpcyBpcyB3aGVuIGFuIFhNTCBhdHRyaWJ1dGUgYnJlYWtzIGBmYXN0LXhtbC1wYXJzZXJgLiBTdWNoIGV4YW1wbGUgd291bGQgYmUgdGhpcyBYTUw6XHJcbiAgICogYGBgeG1sXHJcbiAgICogPEFzc2lnbm1lbnQgTWVhc3VyZURlc2NyaXB0aW9uPVwiV2UgZGlkIHRoaXMgbGFiIHRvZ2V0aGVyLCBzbyBqdXN0IHR1cm5pbmcgaXQgaW4gZ2l2ZXMgZnVsbCBjcmVkaXQuIFRvIHR1cm4gaW4sIHRha2UgYSBnb29kIHBpY3R1cmUgb2YgdGhlIGxhYiBpbiB5b3VyIGxhYiBub3RlYm9vayBhbmQgdXBsb2FkIGl0IG9udG8gdGhlIENsYXNzIE5vdGVib29rIHBhZ2UgdW5kZXIgdGhlIGFzc2lnbm1lbnQgaW4gVGVhbXMuIFRoZW4gY2xpY2sgXCJUdXJuIEluXCIgb24gdGhlIGFzc2lnbm1lbnQgb24gVGVhbXMuXCIgSGFzRHJvcEJveD1cImZhbHNlXCI+XHJcbiAgICogYGBgXHJcbiAgICogQXMgeW91IGNhbiBzZWUsIGBNZWFzdXJlRGVzY3JpcHRpb25gIGhhcyBub24tZXNjYXBlZCBxdW90YXRpb24gbWFya3MgYXJvdW5kICoqVHVybiBJbioqLCB0aGVyZWZvcmUgYGZhc3QteG1sLXBhcnNlcmAgdGhyb3dzIGFuIGVycm9yLlxyXG4gICAqIFRoaXMgbWV0aG9kIGZpeGVzIHRoaXMgaXNzdWUgYnkgcmVwbGFjaW5nIGBNZWFzdXJlRGVzY3JpcHRpb25gJ3MgdmFsdWUgd2l0aCBhbiBlc2NhcGVkIHN0cmluZy4gVGhpcyBpcyBob3cgd2Ugd291bGQgY2FsbCB0aGlzIG1ldGhvZCBhbmQgcmV0dXJuIGEgc3RyaW5nOlxyXG4gICAqIGBgYGpzXHJcbiAgICogbmV3IFhNTEZhY3RvcnkoYXNzaWdubWVudFhNTClcclxuICAgKiAgLmVuY29kZUF0dHJpYnV0ZShcIk1lYXN1cmVEZXNjcmlwdGlvblwiLCBcIkhhc0Ryb3BCb3hcIilcclxuICAgKiAgLnRvU3RyaW5nKCk7XHJcbiAgICogYGBgXHJcbiAgICogQWZ0ZXIgZXNjYXBpbmcgdGhlIGNoYXJhY3RlcnMgaW4gdGhlIHN0cmluZywgYGZhc3QteG1sLXBhcnNlcmAgd2lsbCBub3cgd29yay4gVGhlIGRvd25zaWRlIG9mIHRoaXMgbWV0aG9kIGlzIHRoYXQgYGRlY29kZVVSSWAgbXVzdCBiZSBjYWxsZWQgdG8gZ2V0IHRoZSBhY3R1YWwgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZS5cclxuICAgKi9cclxuICBwdWJsaWMgZW5jb2RlQXR0cmlidXRlKGF0dHJpYnV0ZU5hbWU6IHN0cmluZywgZm9sbG93aW5nQXR0cmlidXRlTmFtZTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKGAke2F0dHJpYnV0ZU5hbWV9PVwiLipcIiAke2ZvbGxvd2luZ0F0dHJpYnV0ZU5hbWV9YCwgJ2cnKTtcclxuXHJcbiAgICB0aGlzLnhtbCA9IHRoaXMueG1sLnJlcGxhY2UocmVnZXhwLCAoZm91bmQpID0+IHtcclxuICAgICAgY29uc3QgYmFzZTY0ID0gZW5jb2RlVVJJKFxyXG4gICAgICAgIGZvdW5kLnN1YnN0cmluZyhhdHRyaWJ1dGVOYW1lLmxlbmd0aCArIDIsIGZvdW5kLmxlbmd0aCAtIGZvbGxvd2luZ0F0dHJpYnV0ZU5hbWUubGVuZ3RoIC0gMilcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuIGAke2F0dHJpYnV0ZU5hbWV9PVwiJHtiYXNlNjR9XCIgJHtmb2xsb3dpbmdBdHRyaWJ1dGVOYW1lfWA7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMueG1sO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgWE1MRmFjdG9yeTtcclxuIl19