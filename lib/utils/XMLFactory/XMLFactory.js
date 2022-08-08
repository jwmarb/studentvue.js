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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9YTUxGYWN0b3J5L1hNTEZhY3RvcnkudHMiXSwibmFtZXMiOlsiWE1MRmFjdG9yeSIsImNvbnN0cnVjdG9yIiwieG1sIiwiZW5jb2RlQXR0cmlidXRlIiwiYXR0cmlidXRlTmFtZSIsImZvbGxvd2luZ0F0dHJpYnV0ZU5hbWUiLCJyZWdleHAiLCJSZWdFeHAiLCJyZXBsYWNlIiwiZm91bmQiLCJiYXNlNjQiLCJlbmNvZGVVUkkiLCJzdWJzdHJpbmciLCJsZW5ndGgiLCJ0b1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQSxRQUFNQSxVQUFOLENBQWlCO0FBR2Y7QUFDRjtBQUNBO0FBQ0E7QUFDU0MsSUFBQUEsV0FBVyxDQUFDQyxHQUFELEVBQWM7QUFDOUI7QUFDSjtBQUNBO0FBQ0E7QUFDSSxXQUFLQSxHQUFMLEdBQVdBLEdBQVg7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU0MsSUFBQUEsZUFBZSxDQUFDQyxhQUFELEVBQXdCQyxzQkFBeEIsRUFBd0Q7QUFDNUUsWUFBTUMsTUFBTSxHQUFHLElBQUlDLE1BQUosQ0FBWSxHQUFFSCxhQUFjLFNBQVFDLHNCQUF1QixFQUEzRCxFQUE4RCxHQUE5RCxDQUFmO0FBRUEsV0FBS0gsR0FBTCxHQUFXLEtBQUtBLEdBQUwsQ0FBU00sT0FBVCxDQUFpQkYsTUFBakIsRUFBMEJHLEtBQUQsSUFBVztBQUM3QyxjQUFNQyxNQUFNLEdBQUdDLFNBQVMsQ0FDdEJGLEtBQUssQ0FBQ0csU0FBTixDQUFnQlIsYUFBYSxDQUFDUyxNQUFkLEdBQXVCLENBQXZDLEVBQTBDSixLQUFLLENBQUNJLE1BQU4sR0FBZVIsc0JBQXNCLENBQUNRLE1BQXRDLEdBQStDLENBQXpGLENBRHNCLENBQXhCO0FBR0EsZUFBUSxHQUFFVCxhQUFjLEtBQUlNLE1BQU8sS0FBSUwsc0JBQXVCLEVBQTlEO0FBQ0QsT0FMVSxDQUFYO0FBT0EsYUFBTyxJQUFQO0FBQ0Q7O0FBRU1TLElBQUFBLFFBQVEsR0FBVztBQUN4QixhQUFPLEtBQUtaLEdBQVo7QUFDRDs7QUFqRGM7O2lCQW9ERkYsVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIHRoaXMgY2xhc3MgdG8gbXV0YXRlIGFuZCBtYW5pcHVsYXRlIFhNTCBiZWZvcmUgcGFyc2luZyBpdCBpbnRvIGFuIFhNTCBvYmplY3RcbiAqL1xuY2xhc3MgWE1MRmFjdG9yeSB7XG4gIHByaXZhdGUgeG1sOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB4bWwgWE1MIGluIGEgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IoeG1sOiBzdHJpbmcpIHtcbiAgICAvKipcbiAgICAgKiBUaGUgWE1MIHlvdSB3YW50IHRvIG11dGF0ZSBiZWZvcmUgcGFyc2luZyBpbnRvIGEgamF2YXNjcmlwdCBvYmplY3RcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMueG1sID0geG1sO1xuICB9XG5cbiAgLyoqXG4gICAqIE11dGF0ZSBhbiBhdHRyaWJ1dGUncyB2YWx1ZSB0byBlbmNvZGUgaXQgaW50byBhIGJhc2U2NCBzbyB0aGF0IGBmYXN0LXhtbC1wYXJzZXJgIGRvZXMgbm90IGhhdmUgcGFyc2luZyBlcnJvcnMuXG4gICAqIEBwYXJhbSBhdHRyaWJ1dGVOYW1lIFRoZSBhdHRyaWJ1dGUgdGhhdCBzaG91bGQgaGF2ZSBpdHMgdmFsdWUgY29udmVydGVkIHRvIGEgYmFzZTY0XG4gICAqIEBwYXJhbSBmb2xsb3dpbmdBdHRyaWJ1dGVOYW1lIFRoZSBhdHRyaWJ1dGUgYWZ0ZXIgdGhlIG11dGF0ZWQgYXR0cmlidXRlIHNvIHRoYXQgdGhlIGxvY2F0aW9uIG9mIGBhdHRyaWJ1dGVOYW1lYCBjYW4gYmUgaWRlbnRpZmllZCB0aHJvdWdoIHJlZ3VsYXIgZXhwcmVzc2lvbnNcbiAgICogQHJldHVybnMge1hNTEZhY3Rvcnl9IFJldHVybnMgYW5vdGhlciBpbnN0YW5jZSBvZiBYTUxGYWN0b3J5IGZvciBtZXRob2QgY2hhaW5pbmdcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBhcHByb3ByaWF0ZSBzY2VuYXJpbyB0byB1c2UgdGhpcyBpcyB3aGVuIGFuIFhNTCBhdHRyaWJ1dGUgYnJlYWtzIGBmYXN0LXhtbC1wYXJzZXJgLiBTdWNoIGV4YW1wbGUgd291bGQgYmUgdGhpcyBYTUw6XG4gICAqIGBgYHhtbFxuICAgKiA8QXNzaWdubWVudCBNZWFzdXJlRGVzY3JpcHRpb249XCJXZSBkaWQgdGhpcyBsYWIgdG9nZXRoZXIsIHNvIGp1c3QgdHVybmluZyBpdCBpbiBnaXZlcyBmdWxsIGNyZWRpdC4gVG8gdHVybiBpbiwgdGFrZSBhIGdvb2QgcGljdHVyZSBvZiB0aGUgbGFiIGluIHlvdXIgbGFiIG5vdGVib29rIGFuZCB1cGxvYWQgaXQgb250byB0aGUgQ2xhc3MgTm90ZWJvb2sgcGFnZSB1bmRlciB0aGUgYXNzaWdubWVudCBpbiBUZWFtcy4gVGhlbiBjbGljayBcIlR1cm4gSW5cIiBvbiB0aGUgYXNzaWdubWVudCBvbiBUZWFtcy5cIiBIYXNEcm9wQm94PVwiZmFsc2VcIj5cbiAgICogYGBgXG4gICAqIEFzIHlvdSBjYW4gc2VlLCBgTWVhc3VyZURlc2NyaXB0aW9uYCBoYXMgbm9uLWVzY2FwZWQgcXVvdGF0aW9uIG1hcmtzIGFyb3VuZCAqKlR1cm4gSW4qKiwgdGhlcmVmb3JlIGBmYXN0LXhtbC1wYXJzZXJgIHRocm93cyBhbiBlcnJvci5cbiAgICogVGhpcyBtZXRob2QgZml4ZXMgdGhpcyBpc3N1ZSBieSByZXBsYWNpbmcgYE1lYXN1cmVEZXNjcmlwdGlvbmAncyB2YWx1ZSB3aXRoIGFuIGVzY2FwZWQgc3RyaW5nLiBUaGlzIGlzIGhvdyB3ZSB3b3VsZCBjYWxsIHRoaXMgbWV0aG9kIGFuZCByZXR1cm4gYSBzdHJpbmc6XG4gICAqIGBgYGpzXG4gICAqIG5ldyBYTUxGYWN0b3J5KGFzc2lnbm1lbnRYTUwpXG4gICAqICAuZW5jb2RlQXR0cmlidXRlKFwiTWVhc3VyZURlc2NyaXB0aW9uXCIsIFwiSGFzRHJvcEJveFwiKVxuICAgKiAgLnRvU3RyaW5nKCk7XG4gICAqIGBgYFxuICAgKiBBZnRlciBlc2NhcGluZyB0aGUgY2hhcmFjdGVycyBpbiB0aGUgc3RyaW5nLCBgZmFzdC14bWwtcGFyc2VyYCB3aWxsIG5vdyB3b3JrLiBUaGUgZG93bnNpZGUgb2YgdGhpcyBtZXRob2QgaXMgdGhhdCBgZGVjb2RlVVJJYCBtdXN0IGJlIGNhbGxlZCB0byBnZXQgdGhlIGFjdHVhbCB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlLlxuICAgKi9cbiAgcHVibGljIGVuY29kZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lOiBzdHJpbmcsIGZvbGxvd2luZ0F0dHJpYnV0ZU5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAoYCR7YXR0cmlidXRlTmFtZX09XCIuKlwiICR7Zm9sbG93aW5nQXR0cmlidXRlTmFtZX1gLCAnZycpO1xuXG4gICAgdGhpcy54bWwgPSB0aGlzLnhtbC5yZXBsYWNlKHJlZ2V4cCwgKGZvdW5kKSA9PiB7XG4gICAgICBjb25zdCBiYXNlNjQgPSBlbmNvZGVVUkkoXG4gICAgICAgIGZvdW5kLnN1YnN0cmluZyhhdHRyaWJ1dGVOYW1lLmxlbmd0aCArIDIsIGZvdW5kLmxlbmd0aCAtIGZvbGxvd2luZ0F0dHJpYnV0ZU5hbWUubGVuZ3RoIC0gMilcbiAgICAgICk7XG4gICAgICByZXR1cm4gYCR7YXR0cmlidXRlTmFtZX09XCIke2Jhc2U2NH1cIiAke2ZvbGxvd2luZ0F0dHJpYnV0ZU5hbWV9YDtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMueG1sO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFhNTEZhY3Rvcnk7XG4iXX0=