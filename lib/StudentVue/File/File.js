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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGaWxlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJkb2N1bWVudEd1IiwibWV0aG9kTmFtZSIsImdldCIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJwcm9jZXNzUmVxdWVzdCIsInBhcmFtU3RyIiwiY2hpbGRJbnRJZCIsIkRvY3VtZW50R1UiLCJ0aGVuIiwiYmFzZTY0RGF0YSIsInBhcnNlWE1MT2JqZWN0IiwiY2F0Y2giXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvU3R1ZGVudFZ1ZS9GaWxlL0ZpbGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscyB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHNvYXAgZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9zb2FwJztcclxuXHJcbi8qKlxyXG4gKiBGaWxlIGNsYXNzXHJcbiAqIEBhYnN0cmFjdFxyXG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgRmlsZTxUPiBleHRlbmRzIHNvYXAuQ2xpZW50IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgZG9jdW1lbnRHdTogc3RyaW5nO1xyXG5cclxuICBwcml2YXRlIHJlYWRvbmx5IG1ldGhvZE5hbWU6IHN0cmluZztcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzLCBkb2N1bWVudEd1OiBzdHJpbmcsIG1ldGhvZE5hbWU6IHN0cmluZykge1xyXG4gICAgc3VwZXIoY3JlZGVudGlhbHMpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIERvY3VtZW50R1Ugb2YgdGhlIGZpbGUgc28gdGhhdCBpdCBjYW4gYmUgZmV0Y2hlZCBmcm9tIHN5bmVyZ3kgc2VydmVyc1xyXG4gICAgICogVGhpcyB2YWx1ZSBpcyBpbXBvcnRhbnQgZm9yIGBGaWxlLmdldCgpYCBtZXRob2QuIFlvdSBjYW5ub3QgZmV0Y2ggdGhlIGZpbGUgd2l0aG91dCBpdFxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICB0aGlzLmRvY3VtZW50R3UgPSBkb2N1bWVudEd1O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3luZXJneSBzZXJ2ZXJzIGhhdmUgZGlmZmVyZW50IG1ldGhvZHMgZm9yIHJldHJpZXZpbmcgZmlsZXMuIEZvciBleGFtcGxlLFxyXG4gICAgICpcclxuICAgICAqIFRvIHJldHJpZXZlIGEgZG9jdW1lbnQsIHRoZXJlIGlzIGEgc3BlY2lmaWMgbWV0aG9kIGZvciBpdDogYEdldENvbnRlbnRPZkF0dGFjaGVkRG9jYFxyXG4gICAgICpcclxuICAgICAqIFRvIHJldHJpZXZlIGEgcmVwb3J0IGNhcmQsIHRoZXJlIGlzIGEgc3BlY2lmaWMgbWV0aG9kIGZvciBpdDogYEdldFJlcG9ydENhcmREb2N1bWVudERhdGFgXHJcbiAgICAgKlxyXG4gICAgICogVGhlcmVmb3JlLCBtZXRob2ROYW1lIG11c3QgYmUgZGVmaW5lZCB0byBnZXQgcmV0cmlldmUgdGhlIGZpbGUgZGF0YS4gU2VlIGhvdyBtZXRob2ROYW1lIGlzIGltcGxlbWVudGVkXHJcbiAgICAgKiBpbiBgRG9jdW1lbnQudHNgIGFuZCBgUmVwb3J0Q2FyZC50c2BcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMubWV0aG9kTmFtZSA9IG1ldGhvZE5hbWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYXJzZSB0aGUgWE1MIG9iamVjdCB0byB0cmFuc2xhdGUgaXQgaW50byBhbiBvcmRpbmFyeSBvYmplY3QuIFRoaXMgbWV0aG9kIG11c3QgYmUgd3JpdHRlbiBmb3IgZXZlcnkgY2xhc3MgdGhhdCBleHRlbmRzIERvY3VtZW50ICh3aGljaCBnZXRzIHRoZSBmaWxlIGZyb20gc3luZXJneSBzZXJ2ZXJzIHVzaW5nIGEgUE9TVCBmZXRjaCByZXF1ZXN0KVxyXG4gICAqIEBwYXJhbSB7dW5rbm93bn0geG1sT2JqZWN0IFRoZSBYTUwgT2JqZWN0IHBhc3NlZCBhZnRlciBwYXJzaW5nXHJcbiAgICogQHByb3RlY3RlZFxyXG4gICAqIEByZXR1cm5zIHtUfSBSZXR1cm5zIGEgcmVmb3JtYXR0ZWQgWE1MIG9iamVjdCB0byBtYWtlIGl0IGVhc2llciBmb3IgY29kZVxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgeG1sT2JqZWN0ID0gYXdhaXQgc3VwZXIucHJvY2Vzc1JlcXVlc3Qoey4uLn0pOyAvLyB7IFwiQF9BdHRyaWJ1dGVcIjogW3sgXCJAX05lc3RlZFwiOiBbey4uLn0sIHsuLi59XX1dfVxyXG4gICAqIHBhcnNlWE1MT2JqZWN0KHhtbE9iamVjdCk7IC8vIHsgYXR0cmlidXRlOiB7IG5lc3RlZDogW3suLi59LCB7Li4ufV0gfSB9XHJcbiAgICpcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcGFyc2VYTUxPYmplY3QoeG1sT2JqZWN0OiB1bmtub3duKTogVDtcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0cmlldmUgdGhlIGZpbGUgZnJvbSBzeW5lcmd5IHNlcnZlcnMuIEFmdGVyIHJldHJpZXZpbmcgdGhlIHhtbE9iamVjdCwgdGhpcyBtZXRob2QgY2FsbHMgcGFyc2VYTUxPYmplY3Qgd2hpY2ggbXVzdCBiZSBkZWZpbmVkIHRvIHBhcnNlIHRoZSB4bWxPYmplY3QgaW50byBhIHJlYWRhYmxlLCB0eXBlc2FmZSBvYmplY3QuXHJcbiAgICogQHB1YmxpY1xyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFQ+fSBSZXR1cm5zIGEgYmFzZTY0IG9iamVjdFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgYmFzZTY0ID0gYXdhaXQgZG9jdW1lbnQuZ2V0KCk7IC8vIHsgYXR0cmlidXRlOiB7IG5lc3RlZDogey4uLn0gfSwgYmFzZTY0OiBcImJhc2U2NCBjb2RlXCIgfVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXQoKTogUHJvbWlzZTxUPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFJlY29yZDxzdHJpbmcsIHVua25vd24+Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiB0aGlzLm1ldGhvZE5hbWUsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwLCBEb2N1bWVudEdVOiB0aGlzLmRvY3VtZW50R3UgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKChiYXNlNjREYXRhKSA9PiB7XHJcbiAgICAgICAgICByZXModGhpcy5wYXJzZVhNTE9iamVjdChiYXNlNjREYXRhKSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNlLE1BQWVBLElBQUksU0FBWUMsYUFBSSxDQUFDQyxNQUFNLENBQUM7SUFLakRDLFdBQVcsQ0FBQ0MsV0FBNkIsRUFBRUMsVUFBa0IsRUFBRUMsVUFBa0IsRUFBRTtNQUN4RixLQUFLLENBQUNGLFdBQVcsQ0FBQzs7TUFFbEI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDSSxJQUFJLENBQUNDLFVBQVUsR0FBR0EsVUFBVTs7TUFFNUI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDSSxJQUFJLENBQUNDLFVBQVUsR0FBR0EsVUFBVTtJQUM5Qjs7SUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0lBR0U7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ1NDLEdBQUcsR0FBZTtNQUN2QixPQUFPLElBQUlDLE9BQU8sQ0FBQyxDQUFDQyxHQUFHLEVBQUVDLEdBQUcsS0FBSztRQUMvQixLQUFLLENBQ0ZDLGNBQWMsQ0FBMEI7VUFDdkNMLFVBQVUsRUFBRSxJQUFJLENBQUNBLFVBQVU7VUFDM0JNLFFBQVEsRUFBRTtZQUFFQyxVQUFVLEVBQUUsQ0FBQztZQUFFQyxVQUFVLEVBQUUsSUFBSSxDQUFDVDtVQUFXO1FBQ3pELENBQUMsQ0FBQyxDQUNEVSxJQUFJLENBQUVDLFVBQVUsSUFBSztVQUNwQlAsR0FBRyxDQUFDLElBQUksQ0FBQ1EsY0FBYyxDQUFDRCxVQUFVLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FDREUsS0FBSyxDQUFDUixHQUFHLENBQUM7TUFDZixDQUFDLENBQUM7SUFDSjtFQUNGO0VBQUM7QUFBQSJ9