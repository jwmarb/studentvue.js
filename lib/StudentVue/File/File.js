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
    /**
     * The DocumentGU of the file so that it can be fetched from synergy servers
     * This value is important for `File.get()` method. You cannot fetch the file without it
     * @public
     * @readonly
     */

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
     */
    constructor(credentials, documentGu, methodName) {
      super(credentials);
      this.documentGu = documentGu;
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
      return new Promise(async (res, rej) => {
        try {
          const base64Data = await super.processRequest({
            methodName: this.methodName,
            paramStr: {
              childIntId: 0,
              DocumentGU: this.documentGu
            }
          });
          res(this.parseXMLObject(base64Data));
        } catch (e) {
          rej(e);
        }
      });
    }

  }

  _exports.default = File;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0ZpbGUvRmlsZS50cyJdLCJuYW1lcyI6WyJGaWxlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJkb2N1bWVudEd1IiwibWV0aG9kTmFtZSIsImdldCIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJiYXNlNjREYXRhIiwicHJvY2Vzc1JlcXVlc3QiLCJwYXJhbVN0ciIsImNoaWxkSW50SWQiLCJEb2N1bWVudEdVIiwicGFyc2VYTUxPYmplY3QiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLFFBQWVBLElBQWYsU0FBK0JDLGNBQUtDLE1BQXBDLENBQTJDO0FBQ3hEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHU0MsSUFBQUEsV0FBVyxDQUFDQyxXQUFELEVBQWdDQyxVQUFoQyxFQUFvREMsVUFBcEQsRUFBd0U7QUFDeEYsWUFBTUYsV0FBTjtBQUNBLFdBQUtDLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsV0FBS0MsVUFBTCxHQUFrQkEsVUFBbEI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0U7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1NDLElBQUFBLEdBQUcsR0FBZTtBQUN2QixhQUFPLElBQUlDLE9BQUosQ0FBWSxPQUFPQyxHQUFQLEVBQVlDLEdBQVosS0FBb0I7QUFDckMsWUFBSTtBQUNGLGdCQUFNQyxVQUFtQyxHQUFHLE1BQU0sTUFBTUMsY0FBTixDQUFxQjtBQUNyRU4sWUFBQUEsVUFBVSxFQUFFLEtBQUtBLFVBRG9EO0FBRXJFTyxZQUFBQSxRQUFRLEVBQUU7QUFBRUMsY0FBQUEsVUFBVSxFQUFFLENBQWQ7QUFBaUJDLGNBQUFBLFVBQVUsRUFBRSxLQUFLVjtBQUFsQztBQUYyRCxXQUFyQixDQUFsRDtBQUlBSSxVQUFBQSxHQUFHLENBQUMsS0FBS08sY0FBTCxDQUFvQkwsVUFBcEIsQ0FBRCxDQUFIO0FBQ0QsU0FORCxDQU1FLE9BQU9NLENBQVAsRUFBVTtBQUNWUCxVQUFBQSxHQUFHLENBQUNPLENBQUQsQ0FBSDtBQUNEO0FBQ0YsT0FWTSxDQUFQO0FBV0Q7O0FBaEV1RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XHJcbmltcG9ydCB7IEJhc2U2NFN0cmluZyB9IGZyb20gJy4uLy4uL3V0aWxzL3R5cGVzJztcclxuXHJcbi8qKlxyXG4gKiBGaWxlIGNsYXNzXHJcbiAqIEBhYnN0cmFjdFxyXG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgRmlsZTxUPiBleHRlbmRzIHNvYXAuQ2xpZW50IHtcclxuICAvKipcclxuICAgKiBUaGUgRG9jdW1lbnRHVSBvZiB0aGUgZmlsZSBzbyB0aGF0IGl0IGNhbiBiZSBmZXRjaGVkIGZyb20gc3luZXJneSBzZXJ2ZXJzXHJcbiAgICogVGhpcyB2YWx1ZSBpcyBpbXBvcnRhbnQgZm9yIGBGaWxlLmdldCgpYCBtZXRob2QuIFlvdSBjYW5ub3QgZmV0Y2ggdGhlIGZpbGUgd2l0aG91dCBpdFxyXG4gICAqIEBwdWJsaWNcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKi9cclxuICBwdWJsaWMgcmVhZG9ubHkgZG9jdW1lbnRHdTogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBTeW5lcmd5IHNlcnZlcnMgaGF2ZSBkaWZmZXJlbnQgbWV0aG9kcyBmb3IgcmV0cmlldmluZyBmaWxlcy4gRm9yIGV4YW1wbGUsXHJcbiAgICpcclxuICAgKiBUbyByZXRyaWV2ZSBhIGRvY3VtZW50LCB0aGVyZSBpcyBhIHNwZWNpZmljIG1ldGhvZCBmb3IgaXQ6IGBHZXRDb250ZW50T2ZBdHRhY2hlZERvY2BcclxuICAgKlxyXG4gICAqIFRvIHJldHJpZXZlIGEgcmVwb3J0IGNhcmQsIHRoZXJlIGlzIGEgc3BlY2lmaWMgbWV0aG9kIGZvciBpdDogYEdldFJlcG9ydENhcmREb2N1bWVudERhdGFgXHJcbiAgICpcclxuICAgKiBUaGVyZWZvcmUsIG1ldGhvZE5hbWUgbXVzdCBiZSBkZWZpbmVkIHRvIGdldCByZXRyaWV2ZSB0aGUgZmlsZSBkYXRhLiBTZWUgaG93IG1ldGhvZE5hbWUgaXMgaW1wbGVtZW50ZWRcclxuICAgKiBpbiBgRG9jdW1lbnQudHNgIGFuZCBgUmVwb3J0Q2FyZC50c2BcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEByZWFkb25seVxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgbWV0aG9kTmFtZTogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsIGRvY3VtZW50R3U6IHN0cmluZywgbWV0aG9kTmFtZTogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihjcmVkZW50aWFscyk7XHJcbiAgICB0aGlzLmRvY3VtZW50R3UgPSBkb2N1bWVudEd1O1xyXG4gICAgdGhpcy5tZXRob2ROYW1lID0gbWV0aG9kTmFtZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhcnNlIHRoZSBYTUwgb2JqZWN0IHRvIHRyYW5zbGF0ZSBpdCBpbnRvIGFuIG9yZGluYXJ5IG9iamVjdC4gVGhpcyBtZXRob2QgbXVzdCBiZSB3cml0dGVuIGZvciBldmVyeSBjbGFzcyB0aGF0IGV4dGVuZHMgRG9jdW1lbnQgKHdoaWNoIGdldHMgdGhlIGZpbGUgZnJvbSBzeW5lcmd5IHNlcnZlcnMgdXNpbmcgYSBQT1NUIGZldGNoIHJlcXVlc3QpXHJcbiAgICogQHBhcmFtIHt1bmtub3dufSB4bWxPYmplY3QgVGhlIFhNTCBPYmplY3QgcGFzc2VkIGFmdGVyIHBhcnNpbmdcclxuICAgKiBAcHJvdGVjdGVkXHJcbiAgICogQHJldHVybnMge1R9IFJldHVybnMgYSByZWZvcm1hdHRlZCBYTUwgb2JqZWN0IHRvIG1ha2UgaXQgZWFzaWVyIGZvciBjb2RlXHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCB4bWxPYmplY3QgPSBhd2FpdCBzdXBlci5wcm9jZXNzUmVxdWVzdCh7Li4ufSk7IC8vIHsgXCJAX0F0dHJpYnV0ZVwiOiBbeyBcIkBfTmVzdGVkXCI6IFt7Li4ufSwgey4uLn1dfV19XHJcbiAgICogcGFyc2VYTUxPYmplY3QoeG1sT2JqZWN0KTsgLy8geyBhdHRyaWJ1dGU6IHsgbmVzdGVkOiBbey4uLn0sIHsuLi59XSB9IH1cclxuICAgKlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBwYXJzZVhNTE9iamVjdCh4bWxPYmplY3Q6IHVua25vd24pOiBUO1xyXG5cclxuICAvKipcclxuICAgKiBSZXRyaWV2ZSB0aGUgZmlsZSBmcm9tIHN5bmVyZ3kgc2VydmVycy4gQWZ0ZXIgcmV0cmlldmluZyB0aGUgeG1sT2JqZWN0LCB0aGlzIG1ldGhvZCBjYWxscyBwYXJzZVhNTE9iamVjdCB3aGljaCBtdXN0IGJlIGRlZmluZWQgdG8gcGFyc2UgdGhlIHhtbE9iamVjdCBpbnRvIGEgcmVhZGFibGUsIHR5cGVzYWZlIG9iamVjdC5cclxuICAgKiBAcHVibGljXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8VD59IFJldHVybnMgYSBiYXNlNjQgb2JqZWN0XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBiYXNlNjQgPSBhd2FpdCBkb2N1bWVudC5nZXQoKTsgLy8geyBhdHRyaWJ1dGU6IHsgbmVzdGVkOiB7Li4ufSB9LCBiYXNlNjQ6IFwiYmFzZTY0IGNvZGVcIiB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGdldCgpOiBQcm9taXNlPFQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBiYXNlNjREYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6IHRoaXMubWV0aG9kTmFtZSxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIERvY3VtZW50R1U6IHRoaXMuZG9jdW1lbnRHdSB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJlcyh0aGlzLnBhcnNlWE1MT2JqZWN0KGJhc2U2NERhdGEpKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlaihlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==