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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJYTUxGYWN0b3J5IiwiY29uc3RydWN0b3IiLCJ4bWwiLCJlbmNvZGVBdHRyaWJ1dGUiLCJhdHRyaWJ1dGVOYW1lIiwiZm9sbG93aW5nQXR0cmlidXRlTmFtZSIsInJlZ2V4cCIsIlJlZ0V4cCIsInJlcGxhY2UiLCJmb3VuZCIsImJhc2U2NCIsImVuY29kZVVSSSIsInN1YnN0cmluZyIsImxlbmd0aCIsInRvU3RyaW5nIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL1hNTEZhY3RvcnkvWE1MRmFjdG9yeS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogVXNlIHRoaXMgY2xhc3MgdG8gbXV0YXRlIGFuZCBtYW5pcHVsYXRlIFhNTCBiZWZvcmUgcGFyc2luZyBpdCBpbnRvIGFuIFhNTCBvYmplY3RcclxuICovXHJcbmNsYXNzIFhNTEZhY3Rvcnkge1xyXG4gIHByaXZhdGUgeG1sOiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHhtbCBYTUwgaW4gYSBzdHJpbmdcclxuICAgKi9cclxuICBwdWJsaWMgY29uc3RydWN0b3IoeG1sOiBzdHJpbmcpIHtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIFhNTCB5b3Ugd2FudCB0byBtdXRhdGUgYmVmb3JlIHBhcnNpbmcgaW50byBhIGphdmFzY3JpcHQgb2JqZWN0XHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICB0aGlzLnhtbCA9IHhtbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE11dGF0ZSBhbiBhdHRyaWJ1dGUncyB2YWx1ZSB0byBlbmNvZGUgaXQgaW50byBhIGJhc2U2NCBzbyB0aGF0IGBmYXN0LXhtbC1wYXJzZXJgIGRvZXMgbm90IGhhdmUgcGFyc2luZyBlcnJvcnMuXHJcbiAgICogQHBhcmFtIGF0dHJpYnV0ZU5hbWUgVGhlIGF0dHJpYnV0ZSB0aGF0IHNob3VsZCBoYXZlIGl0cyB2YWx1ZSBjb252ZXJ0ZWQgdG8gYSBiYXNlNjRcclxuICAgKiBAcGFyYW0gZm9sbG93aW5nQXR0cmlidXRlTmFtZSBUaGUgYXR0cmlidXRlIGFmdGVyIHRoZSBtdXRhdGVkIGF0dHJpYnV0ZSBzbyB0aGF0IHRoZSBsb2NhdGlvbiBvZiBgYXR0cmlidXRlTmFtZWAgY2FuIGJlIGlkZW50aWZpZWQgdGhyb3VnaCByZWd1bGFyIGV4cHJlc3Npb25zXHJcbiAgICogQHJldHVybnMge1hNTEZhY3Rvcnl9IFJldHVybnMgYW5vdGhlciBpbnN0YW5jZSBvZiBYTUxGYWN0b3J5IGZvciBtZXRob2QgY2hhaW5pbmdcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBUaGUgYXBwcm9wcmlhdGUgc2NlbmFyaW8gdG8gdXNlIHRoaXMgaXMgd2hlbiBhbiBYTUwgYXR0cmlidXRlIGJyZWFrcyBgZmFzdC14bWwtcGFyc2VyYC4gU3VjaCBleGFtcGxlIHdvdWxkIGJlIHRoaXMgWE1MOlxyXG4gICAqIGBgYHhtbFxyXG4gICAqIDxBc3NpZ25tZW50IE1lYXN1cmVEZXNjcmlwdGlvbj1cIldlIGRpZCB0aGlzIGxhYiB0b2dldGhlciwgc28ganVzdCB0dXJuaW5nIGl0IGluIGdpdmVzIGZ1bGwgY3JlZGl0LiBUbyB0dXJuIGluLCB0YWtlIGEgZ29vZCBwaWN0dXJlIG9mIHRoZSBsYWIgaW4geW91ciBsYWIgbm90ZWJvb2sgYW5kIHVwbG9hZCBpdCBvbnRvIHRoZSBDbGFzcyBOb3RlYm9vayBwYWdlIHVuZGVyIHRoZSBhc3NpZ25tZW50IGluIFRlYW1zLiBUaGVuIGNsaWNrIFwiVHVybiBJblwiIG9uIHRoZSBhc3NpZ25tZW50IG9uIFRlYW1zLlwiIEhhc0Ryb3BCb3g9XCJmYWxzZVwiPlxyXG4gICAqIGBgYFxyXG4gICAqIEFzIHlvdSBjYW4gc2VlLCBgTWVhc3VyZURlc2NyaXB0aW9uYCBoYXMgbm9uLWVzY2FwZWQgcXVvdGF0aW9uIG1hcmtzIGFyb3VuZCAqKlR1cm4gSW4qKiwgdGhlcmVmb3JlIGBmYXN0LXhtbC1wYXJzZXJgIHRocm93cyBhbiBlcnJvci5cclxuICAgKiBUaGlzIG1ldGhvZCBmaXhlcyB0aGlzIGlzc3VlIGJ5IHJlcGxhY2luZyBgTWVhc3VyZURlc2NyaXB0aW9uYCdzIHZhbHVlIHdpdGggYW4gZXNjYXBlZCBzdHJpbmcuIFRoaXMgaXMgaG93IHdlIHdvdWxkIGNhbGwgdGhpcyBtZXRob2QgYW5kIHJldHVybiBhIHN0cmluZzpcclxuICAgKiBgYGBqc1xyXG4gICAqIG5ldyBYTUxGYWN0b3J5KGFzc2lnbm1lbnRYTUwpXHJcbiAgICogIC5lbmNvZGVBdHRyaWJ1dGUoXCJNZWFzdXJlRGVzY3JpcHRpb25cIiwgXCJIYXNEcm9wQm94XCIpXHJcbiAgICogIC50b1N0cmluZygpO1xyXG4gICAqIGBgYFxyXG4gICAqIEFmdGVyIGVzY2FwaW5nIHRoZSBjaGFyYWN0ZXJzIGluIHRoZSBzdHJpbmcsIGBmYXN0LXhtbC1wYXJzZXJgIHdpbGwgbm93IHdvcmsuIFRoZSBkb3duc2lkZSBvZiB0aGlzIG1ldGhvZCBpcyB0aGF0IGBkZWNvZGVVUklgIG11c3QgYmUgY2FsbGVkIHRvIGdldCB0aGUgYWN0dWFsIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUuXHJcbiAgICovXHJcbiAgcHVibGljIGVuY29kZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lOiBzdHJpbmcsIGZvbGxvd2luZ0F0dHJpYnV0ZU5hbWU6IHN0cmluZykge1xyXG4gICAgY29uc3QgcmVnZXhwID0gbmV3IFJlZ0V4cChgJHthdHRyaWJ1dGVOYW1lfT1cIi4qXCIgJHtmb2xsb3dpbmdBdHRyaWJ1dGVOYW1lfWAsICdnJyk7XHJcblxyXG4gICAgdGhpcy54bWwgPSB0aGlzLnhtbC5yZXBsYWNlKHJlZ2V4cCwgKGZvdW5kKSA9PiB7XHJcbiAgICAgIGNvbnN0IGJhc2U2NCA9IGVuY29kZVVSSShcclxuICAgICAgICBmb3VuZC5zdWJzdHJpbmcoYXR0cmlidXRlTmFtZS5sZW5ndGggKyAyLCBmb3VuZC5sZW5ndGggLSBmb2xsb3dpbmdBdHRyaWJ1dGVOYW1lLmxlbmd0aCAtIDIpXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiBgJHthdHRyaWJ1dGVOYW1lfT1cIiR7YmFzZTY0fVwiICR7Zm9sbG93aW5nQXR0cmlidXRlTmFtZX1gO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnhtbDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFhNTEZhY3Rvcnk7XHJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFBO0FBQ0E7QUFDQTtFQUNBLE1BQU1BLFVBQVUsQ0FBQztJQUdmO0FBQ0Y7QUFDQTtBQUNBO0lBQ1NDLFdBQVcsQ0FBQ0MsR0FBVyxFQUFFO01BQzlCO0FBQ0o7QUFDQTtBQUNBO01BQ0ksSUFBSSxDQUFDQSxHQUFHLEdBQUdBLEdBQUc7SUFDaEI7O0lBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDU0MsZUFBZSxDQUFDQyxhQUFxQixFQUFFQyxzQkFBOEIsRUFBRTtNQUM1RSxNQUFNQyxNQUFNLEdBQUcsSUFBSUMsTUFBTSxDQUFFLEdBQUVILGFBQWMsU0FBUUMsc0JBQXVCLEVBQUMsRUFBRSxHQUFHLENBQUM7TUFFakYsSUFBSSxDQUFDSCxHQUFHLEdBQUcsSUFBSSxDQUFDQSxHQUFHLENBQUNNLE9BQU8sQ0FBQ0YsTUFBTSxFQUFHRyxLQUFLLElBQUs7UUFDN0MsTUFBTUMsTUFBTSxHQUFHQyxTQUFTLENBQ3RCRixLQUFLLENBQUNHLFNBQVMsQ0FBQ1IsYUFBYSxDQUFDUyxNQUFNLEdBQUcsQ0FBQyxFQUFFSixLQUFLLENBQUNJLE1BQU0sR0FBR1Isc0JBQXNCLENBQUNRLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FDNUY7UUFDRCxPQUFRLEdBQUVULGFBQWMsS0FBSU0sTUFBTyxLQUFJTCxzQkFBdUIsRUFBQztNQUNqRSxDQUFDLENBQUM7TUFFRixPQUFPLElBQUk7SUFDYjtJQUVPUyxRQUFRLEdBQVc7TUFDeEIsT0FBTyxJQUFJLENBQUNaLEdBQUc7SUFDakI7RUFDRjtFQUFDLGVBRWNGLFVBQVU7RUFBQTtBQUFBIn0=