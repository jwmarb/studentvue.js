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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJYTUxGYWN0b3J5IiwiY29uc3RydWN0b3IiLCJ4bWwiLCJlbmNvZGVBdHRyaWJ1dGUiLCJhdHRyaWJ1dGVOYW1lIiwiZm9sbG93aW5nQXR0cmlidXRlTmFtZSIsInJlZ2V4cCIsIlJlZ0V4cCIsInJlcGxhY2UiLCJmb3VuZCIsImJhc2U2NCIsImVuY29kZVVSSSIsInN1YnN0cmluZyIsImxlbmd0aCIsInRvU3RyaW5nIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL1hNTEZhY3RvcnkvWE1MRmFjdG9yeS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZSB0aGlzIGNsYXNzIHRvIG11dGF0ZSBhbmQgbWFuaXB1bGF0ZSBYTUwgYmVmb3JlIHBhcnNpbmcgaXQgaW50byBhbiBYTUwgb2JqZWN0XG4gKi9cbmNsYXNzIFhNTEZhY3Rvcnkge1xuICBwcml2YXRlIHhtbDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0geG1sIFhNTCBpbiBhIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKHhtbDogc3RyaW5nKSB7XG4gICAgLyoqXG4gICAgICogVGhlIFhNTCB5b3Ugd2FudCB0byBtdXRhdGUgYmVmb3JlIHBhcnNpbmcgaW50byBhIGphdmFzY3JpcHQgb2JqZWN0XG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLnhtbCA9IHhtbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBNdXRhdGUgYW4gYXR0cmlidXRlJ3MgdmFsdWUgdG8gZW5jb2RlIGl0IGludG8gYSBiYXNlNjQgc28gdGhhdCBgZmFzdC14bWwtcGFyc2VyYCBkb2VzIG5vdCBoYXZlIHBhcnNpbmcgZXJyb3JzLlxuICAgKiBAcGFyYW0gYXR0cmlidXRlTmFtZSBUaGUgYXR0cmlidXRlIHRoYXQgc2hvdWxkIGhhdmUgaXRzIHZhbHVlIGNvbnZlcnRlZCB0byBhIGJhc2U2NFxuICAgKiBAcGFyYW0gZm9sbG93aW5nQXR0cmlidXRlTmFtZSBUaGUgYXR0cmlidXRlIGFmdGVyIHRoZSBtdXRhdGVkIGF0dHJpYnV0ZSBzbyB0aGF0IHRoZSBsb2NhdGlvbiBvZiBgYXR0cmlidXRlTmFtZWAgY2FuIGJlIGlkZW50aWZpZWQgdGhyb3VnaCByZWd1bGFyIGV4cHJlc3Npb25zXG4gICAqIEByZXR1cm5zIHtYTUxGYWN0b3J5fSBSZXR1cm5zIGFub3RoZXIgaW5zdGFuY2Ugb2YgWE1MRmFjdG9yeSBmb3IgbWV0aG9kIGNoYWluaW5nXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgYXBwcm9wcmlhdGUgc2NlbmFyaW8gdG8gdXNlIHRoaXMgaXMgd2hlbiBhbiBYTUwgYXR0cmlidXRlIGJyZWFrcyBgZmFzdC14bWwtcGFyc2VyYC4gU3VjaCBleGFtcGxlIHdvdWxkIGJlIHRoaXMgWE1MOlxuICAgKiBgYGB4bWxcbiAgICogPEFzc2lnbm1lbnQgTWVhc3VyZURlc2NyaXB0aW9uPVwiV2UgZGlkIHRoaXMgbGFiIHRvZ2V0aGVyLCBzbyBqdXN0IHR1cm5pbmcgaXQgaW4gZ2l2ZXMgZnVsbCBjcmVkaXQuIFRvIHR1cm4gaW4sIHRha2UgYSBnb29kIHBpY3R1cmUgb2YgdGhlIGxhYiBpbiB5b3VyIGxhYiBub3RlYm9vayBhbmQgdXBsb2FkIGl0IG9udG8gdGhlIENsYXNzIE5vdGVib29rIHBhZ2UgdW5kZXIgdGhlIGFzc2lnbm1lbnQgaW4gVGVhbXMuIFRoZW4gY2xpY2sgXCJUdXJuIEluXCIgb24gdGhlIGFzc2lnbm1lbnQgb24gVGVhbXMuXCIgSGFzRHJvcEJveD1cImZhbHNlXCI+XG4gICAqIGBgYFxuICAgKiBBcyB5b3UgY2FuIHNlZSwgYE1lYXN1cmVEZXNjcmlwdGlvbmAgaGFzIG5vbi1lc2NhcGVkIHF1b3RhdGlvbiBtYXJrcyBhcm91bmQgKipUdXJuIEluKiosIHRoZXJlZm9yZSBgZmFzdC14bWwtcGFyc2VyYCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIFRoaXMgbWV0aG9kIGZpeGVzIHRoaXMgaXNzdWUgYnkgcmVwbGFjaW5nIGBNZWFzdXJlRGVzY3JpcHRpb25gJ3MgdmFsdWUgd2l0aCBhbiBlc2NhcGVkIHN0cmluZy4gVGhpcyBpcyBob3cgd2Ugd291bGQgY2FsbCB0aGlzIG1ldGhvZCBhbmQgcmV0dXJuIGEgc3RyaW5nOlxuICAgKiBgYGBqc1xuICAgKiBuZXcgWE1MRmFjdG9yeShhc3NpZ25tZW50WE1MKVxuICAgKiAgLmVuY29kZUF0dHJpYnV0ZShcIk1lYXN1cmVEZXNjcmlwdGlvblwiLCBcIkhhc0Ryb3BCb3hcIilcbiAgICogIC50b1N0cmluZygpO1xuICAgKiBgYGBcbiAgICogQWZ0ZXIgZXNjYXBpbmcgdGhlIGNoYXJhY3RlcnMgaW4gdGhlIHN0cmluZywgYGZhc3QteG1sLXBhcnNlcmAgd2lsbCBub3cgd29yay4gVGhlIGRvd25zaWRlIG9mIHRoaXMgbWV0aG9kIGlzIHRoYXQgYGRlY29kZVVSSWAgbXVzdCBiZSBjYWxsZWQgdG8gZ2V0IHRoZSBhY3R1YWwgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZS5cbiAgICovXG4gIHB1YmxpYyBlbmNvZGVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZTogc3RyaW5nLCBmb2xsb3dpbmdBdHRyaWJ1dGVOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKGAke2F0dHJpYnV0ZU5hbWV9PVwiLipcIiAke2ZvbGxvd2luZ0F0dHJpYnV0ZU5hbWV9YCwgJ2cnKTtcblxuICAgIHRoaXMueG1sID0gdGhpcy54bWwucmVwbGFjZShyZWdleHAsIChmb3VuZCkgPT4ge1xuICAgICAgY29uc3QgYmFzZTY0ID0gZW5jb2RlVVJJKFxuICAgICAgICBmb3VuZC5zdWJzdHJpbmcoYXR0cmlidXRlTmFtZS5sZW5ndGggKyAyLCBmb3VuZC5sZW5ndGggLSBmb2xsb3dpbmdBdHRyaWJ1dGVOYW1lLmxlbmd0aCAtIDIpXG4gICAgICApO1xuICAgICAgcmV0dXJuIGAke2F0dHJpYnV0ZU5hbWV9PVwiJHtiYXNlNjR9XCIgJHtmb2xsb3dpbmdBdHRyaWJ1dGVOYW1lfWA7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnhtbDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBYTUxGYWN0b3J5O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQUE7QUFDQTtBQUNBO0VBQ0EsTUFBTUEsVUFBVSxDQUFDO0lBR2Y7QUFDRjtBQUNBO0FBQ0E7SUFDU0MsV0FBVyxDQUFDQyxHQUFXLEVBQUU7TUFDOUI7QUFDSjtBQUNBO0FBQ0E7TUFDSSxJQUFJLENBQUNBLEdBQUcsR0FBR0EsR0FBRztJQUNoQjs7SUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNTQyxlQUFlLENBQUNDLGFBQXFCLEVBQUVDLHNCQUE4QixFQUFFO01BQzVFLE1BQU1DLE1BQU0sR0FBRyxJQUFJQyxNQUFNLENBQUUsR0FBRUgsYUFBYyxTQUFRQyxzQkFBdUIsRUFBQyxFQUFFLEdBQUcsQ0FBQztNQUVqRixJQUFJLENBQUNILEdBQUcsR0FBRyxJQUFJLENBQUNBLEdBQUcsQ0FBQ00sT0FBTyxDQUFDRixNQUFNLEVBQUdHLEtBQUssSUFBSztRQUM3QyxNQUFNQyxNQUFNLEdBQUdDLFNBQVMsQ0FDdEJGLEtBQUssQ0FBQ0csU0FBUyxDQUFDUixhQUFhLENBQUNTLE1BQU0sR0FBRyxDQUFDLEVBQUVKLEtBQUssQ0FBQ0ksTUFBTSxHQUFHUixzQkFBc0IsQ0FBQ1EsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUM1RjtRQUNELE9BQVEsR0FBRVQsYUFBYyxLQUFJTSxNQUFPLEtBQUlMLHNCQUF1QixFQUFDO01BQ2pFLENBQUMsQ0FBQztNQUVGLE9BQU8sSUFBSTtJQUNiO0lBRU9TLFFBQVEsR0FBVztNQUN4QixPQUFPLElBQUksQ0FBQ1osR0FBRztJQUNqQjtFQUNGO0VBQUMsZUFFY0YsVUFBVTtFQUFBO0FBQUEifQ==