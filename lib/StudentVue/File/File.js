(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/soap/soap"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/soap/soap"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.soap);
    global.File = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _soap) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _soap = _interopRequireDefault(_soap);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * File class
   * @abstract
   * @extends {soap.Client}
   * @constructor
   */
  class File extends _soap.default.Client {
    constructor(credentials, documentGu, methodName) {
      super(credentials);
      /**
       * The DocumentGU of the file so that it can be fetched from synergy servers
       * This value is important for `File.get()` method. You cannot fetch the file without it
       * @public
       * @readonly
       * @type {string}
       */

      this.documentGu = documentGu;
      /**
       * Synergy servers have different methods for retrieving files. For example,
       *
       * To retrieve a document, there is a specific method for it: `GetContentOfAttachedDoc`
       *
       * To retrieve a report card, there is a specific method for it: `GetReportCardDocumentData`
       *
       * Therefore, methodName must be defined to get retrieve the file data. See how methodName is implemented
       * in `Document.ts` and `ReportCard.ts`
       * @private
       * @readonly
       * @type {string}
       */

      this.methodName = methodName;
    }
    /**
     * Parse the XML object to translate it into an ordinary object. This method must be written for every class that extends Document (which gets the file from synergy servers using a POST fetch request)
     * @param {unknown} xmlObject The XML Object passed after parsing
     * @protected
     * @returns {T} Returns a reformatted XML object to make it easier for code
     * @description
     * ```js
     * const xmlObject = await super.processRequest({...}); // { "@_Attribute": [{ "@_Nested": [{...}, {...}]}]}
     * parseXMLObject(xmlObject); // { attribute: { nested: [{...}, {...}] } }
     *
     * ```
     */


    /**
     * Retrieve the file from synergy servers. After retrieving the xmlObject, this method calls parseXMLObject which must be defined to parse the xmlObject into a readable, typesafe object.
     * @public
     * @returns {Promise<T>} Returns a base64 object
     * @description
     * ```js
     * const base64 = await document.get(); // { attribute: { nested: {...} }, base64: "base64 code" }
     * ```
     */
    get() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: this.methodName,
          paramStr: {
            childIntId: 0,
            DocumentGU: this.documentGu
          }
        }).then(base64Data => {
          res(this.parseXMLObject(base64Data));
        }).catch(rej);
      });
    }

  }

  _exports.default = File;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0ZpbGUvRmlsZS50cyJdLCJuYW1lcyI6WyJGaWxlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJkb2N1bWVudEd1IiwibWV0aG9kTmFtZSIsImdldCIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJwcm9jZXNzUmVxdWVzdCIsInBhcmFtU3RyIiwiY2hpbGRJbnRJZCIsIkRvY3VtZW50R1UiLCJ0aGVuIiwiYmFzZTY0RGF0YSIsInBhcnNlWE1MT2JqZWN0IiwiY2F0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsUUFBZUEsSUFBZixTQUErQkMsY0FBS0MsTUFBcEMsQ0FBMkM7QUFLakRDLElBQUFBLFdBQVcsQ0FBQ0MsV0FBRCxFQUFnQ0MsVUFBaEMsRUFBb0RDLFVBQXBELEVBQXdFO0FBQ3hGLFlBQU1GLFdBQU47QUFFQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxXQUFLQyxVQUFMLEdBQWtCQSxVQUFsQjtBQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNJLFdBQUtDLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNTQyxJQUFBQSxHQUFHLEdBQWU7QUFDdkIsYUFBTyxJQUFJQyxPQUFKLENBQVksQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEtBQWM7QUFDL0IsY0FDR0MsY0FESCxDQUMyQztBQUN2Q0wsVUFBQUEsVUFBVSxFQUFFLEtBQUtBLFVBRHNCO0FBRXZDTSxVQUFBQSxRQUFRLEVBQUU7QUFBRUMsWUFBQUEsVUFBVSxFQUFFLENBQWQ7QUFBaUJDLFlBQUFBLFVBQVUsRUFBRSxLQUFLVDtBQUFsQztBQUY2QixTQUQzQyxFQUtHVSxJQUxILENBS1NDLFVBQUQsSUFBZ0I7QUFDcEJQLFVBQUFBLEdBQUcsQ0FBQyxLQUFLUSxjQUFMLENBQW9CRCxVQUFwQixDQUFELENBQUg7QUFDRCxTQVBILEVBUUdFLEtBUkgsQ0FRU1IsR0FSVDtBQVNELE9BVk0sQ0FBUDtBQVdEOztBQXBFdUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xuaW1wb3J0IHNvYXAgZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9zb2FwJztcblxuLyoqXG4gKiBGaWxlIGNsYXNzXG4gKiBAYWJzdHJhY3RcbiAqIEBleHRlbmRzIHtzb2FwLkNsaWVudH1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBGaWxlPFQ+IGV4dGVuZHMgc29hcC5DbGllbnQge1xuICBwdWJsaWMgcmVhZG9ubHkgZG9jdW1lbnRHdTogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgbWV0aG9kTmFtZTogc3RyaW5nO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFscywgZG9jdW1lbnRHdTogc3RyaW5nLCBtZXRob2ROYW1lOiBzdHJpbmcpIHtcbiAgICBzdXBlcihjcmVkZW50aWFscyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgRG9jdW1lbnRHVSBvZiB0aGUgZmlsZSBzbyB0aGF0IGl0IGNhbiBiZSBmZXRjaGVkIGZyb20gc3luZXJneSBzZXJ2ZXJzXG4gICAgICogVGhpcyB2YWx1ZSBpcyBpbXBvcnRhbnQgZm9yIGBGaWxlLmdldCgpYCBtZXRob2QuIFlvdSBjYW5ub3QgZmV0Y2ggdGhlIGZpbGUgd2l0aG91dCBpdFxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuZG9jdW1lbnRHdSA9IGRvY3VtZW50R3U7XG5cbiAgICAvKipcbiAgICAgKiBTeW5lcmd5IHNlcnZlcnMgaGF2ZSBkaWZmZXJlbnQgbWV0aG9kcyBmb3IgcmV0cmlldmluZyBmaWxlcy4gRm9yIGV4YW1wbGUsXG4gICAgICpcbiAgICAgKiBUbyByZXRyaWV2ZSBhIGRvY3VtZW50LCB0aGVyZSBpcyBhIHNwZWNpZmljIG1ldGhvZCBmb3IgaXQ6IGBHZXRDb250ZW50T2ZBdHRhY2hlZERvY2BcbiAgICAgKlxuICAgICAqIFRvIHJldHJpZXZlIGEgcmVwb3J0IGNhcmQsIHRoZXJlIGlzIGEgc3BlY2lmaWMgbWV0aG9kIGZvciBpdDogYEdldFJlcG9ydENhcmREb2N1bWVudERhdGFgXG4gICAgICpcbiAgICAgKiBUaGVyZWZvcmUsIG1ldGhvZE5hbWUgbXVzdCBiZSBkZWZpbmVkIHRvIGdldCByZXRyaWV2ZSB0aGUgZmlsZSBkYXRhLiBTZWUgaG93IG1ldGhvZE5hbWUgaXMgaW1wbGVtZW50ZWRcbiAgICAgKiBpbiBgRG9jdW1lbnQudHNgIGFuZCBgUmVwb3J0Q2FyZC50c2BcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5tZXRob2ROYW1lID0gbWV0aG9kTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSB0aGUgWE1MIG9iamVjdCB0byB0cmFuc2xhdGUgaXQgaW50byBhbiBvcmRpbmFyeSBvYmplY3QuIFRoaXMgbWV0aG9kIG11c3QgYmUgd3JpdHRlbiBmb3IgZXZlcnkgY2xhc3MgdGhhdCBleHRlbmRzIERvY3VtZW50ICh3aGljaCBnZXRzIHRoZSBmaWxlIGZyb20gc3luZXJneSBzZXJ2ZXJzIHVzaW5nIGEgUE9TVCBmZXRjaCByZXF1ZXN0KVxuICAgKiBAcGFyYW0ge3Vua25vd259IHhtbE9iamVjdCBUaGUgWE1MIE9iamVjdCBwYXNzZWQgYWZ0ZXIgcGFyc2luZ1xuICAgKiBAcHJvdGVjdGVkXG4gICAqIEByZXR1cm5zIHtUfSBSZXR1cm5zIGEgcmVmb3JtYXR0ZWQgWE1MIG9iamVjdCB0byBtYWtlIGl0IGVhc2llciBmb3IgY29kZVxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogYGBganNcbiAgICogY29uc3QgeG1sT2JqZWN0ID0gYXdhaXQgc3VwZXIucHJvY2Vzc1JlcXVlc3Qoey4uLn0pOyAvLyB7IFwiQF9BdHRyaWJ1dGVcIjogW3sgXCJAX05lc3RlZFwiOiBbey4uLn0sIHsuLi59XX1dfVxuICAgKiBwYXJzZVhNTE9iamVjdCh4bWxPYmplY3QpOyAvLyB7IGF0dHJpYnV0ZTogeyBuZXN0ZWQ6IFt7Li4ufSwgey4uLn1dIH0gfVxuICAgKlxuICAgKiBgYGBcbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBwYXJzZVhNTE9iamVjdCh4bWxPYmplY3Q6IHVua25vd24pOiBUO1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgZmlsZSBmcm9tIHN5bmVyZ3kgc2VydmVycy4gQWZ0ZXIgcmV0cmlldmluZyB0aGUgeG1sT2JqZWN0LCB0aGlzIG1ldGhvZCBjYWxscyBwYXJzZVhNTE9iamVjdCB3aGljaCBtdXN0IGJlIGRlZmluZWQgdG8gcGFyc2UgdGhlIHhtbE9iamVjdCBpbnRvIGEgcmVhZGFibGUsIHR5cGVzYWZlIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxUPn0gUmV0dXJucyBhIGJhc2U2NCBvYmplY3RcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGNvbnN0IGJhc2U2NCA9IGF3YWl0IGRvY3VtZW50LmdldCgpOyAvLyB7IGF0dHJpYnV0ZTogeyBuZXN0ZWQ6IHsuLi59IH0sIGJhc2U2NDogXCJiYXNlNjQgY29kZVwiIH1cbiAgICogYGBgXG4gICAqL1xuICBwdWJsaWMgZ2V0KCk6IFByb21pc2U8VD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIHN1cGVyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oe1xuICAgICAgICAgIG1ldGhvZE5hbWU6IHRoaXMubWV0aG9kTmFtZSxcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwLCBEb2N1bWVudEdVOiB0aGlzLmRvY3VtZW50R3UgfSxcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKGJhc2U2NERhdGEpID0+IHtcbiAgICAgICAgICByZXModGhpcy5wYXJzZVhNTE9iamVjdChiYXNlNjREYXRhKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWopO1xuICAgIH0pO1xuICB9XG59XG4iXX0=