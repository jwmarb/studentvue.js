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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGaWxlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJkb2N1bWVudEd1IiwibWV0aG9kTmFtZSIsImdldCIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJwcm9jZXNzUmVxdWVzdCIsInBhcmFtU3RyIiwiY2hpbGRJbnRJZCIsIkRvY3VtZW50R1UiLCJ0aGVuIiwiYmFzZTY0RGF0YSIsInBhcnNlWE1MT2JqZWN0IiwiY2F0Y2giXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvU3R1ZGVudFZ1ZS9GaWxlL0ZpbGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscyB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XG5cbi8qKlxuICogRmlsZSBjbGFzc1xuICogQGFic3RyYWN0XG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgRmlsZTxUPiBleHRlbmRzIHNvYXAuQ2xpZW50IHtcbiAgcHVibGljIHJlYWRvbmx5IGRvY3VtZW50R3U6IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IG1ldGhvZE5hbWU6IHN0cmluZztcblxuICBwdWJsaWMgY29uc3RydWN0b3IoY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsIGRvY3VtZW50R3U6IHN0cmluZywgbWV0aG9kTmFtZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoY3JlZGVudGlhbHMpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIERvY3VtZW50R1Ugb2YgdGhlIGZpbGUgc28gdGhhdCBpdCBjYW4gYmUgZmV0Y2hlZCBmcm9tIHN5bmVyZ3kgc2VydmVyc1xuICAgICAqIFRoaXMgdmFsdWUgaXMgaW1wb3J0YW50IGZvciBgRmlsZS5nZXQoKWAgbWV0aG9kLiBZb3UgY2Fubm90IGZldGNoIHRoZSBmaWxlIHdpdGhvdXQgaXRcbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmRvY3VtZW50R3UgPSBkb2N1bWVudEd1O1xuXG4gICAgLyoqXG4gICAgICogU3luZXJneSBzZXJ2ZXJzIGhhdmUgZGlmZmVyZW50IG1ldGhvZHMgZm9yIHJldHJpZXZpbmcgZmlsZXMuIEZvciBleGFtcGxlLFxuICAgICAqXG4gICAgICogVG8gcmV0cmlldmUgYSBkb2N1bWVudCwgdGhlcmUgaXMgYSBzcGVjaWZpYyBtZXRob2QgZm9yIGl0OiBgR2V0Q29udGVudE9mQXR0YWNoZWREb2NgXG4gICAgICpcbiAgICAgKiBUbyByZXRyaWV2ZSBhIHJlcG9ydCBjYXJkLCB0aGVyZSBpcyBhIHNwZWNpZmljIG1ldGhvZCBmb3IgaXQ6IGBHZXRSZXBvcnRDYXJkRG9jdW1lbnREYXRhYFxuICAgICAqXG4gICAgICogVGhlcmVmb3JlLCBtZXRob2ROYW1lIG11c3QgYmUgZGVmaW5lZCB0byBnZXQgcmV0cmlldmUgdGhlIGZpbGUgZGF0YS4gU2VlIGhvdyBtZXRob2ROYW1lIGlzIGltcGxlbWVudGVkXG4gICAgICogaW4gYERvY3VtZW50LnRzYCBhbmQgYFJlcG9ydENhcmQudHNgXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubWV0aG9kTmFtZSA9IG1ldGhvZE5hbWU7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgdGhlIFhNTCBvYmplY3QgdG8gdHJhbnNsYXRlIGl0IGludG8gYW4gb3JkaW5hcnkgb2JqZWN0LiBUaGlzIG1ldGhvZCBtdXN0IGJlIHdyaXR0ZW4gZm9yIGV2ZXJ5IGNsYXNzIHRoYXQgZXh0ZW5kcyBEb2N1bWVudCAod2hpY2ggZ2V0cyB0aGUgZmlsZSBmcm9tIHN5bmVyZ3kgc2VydmVycyB1c2luZyBhIFBPU1QgZmV0Y2ggcmVxdWVzdClcbiAgICogQHBhcmFtIHt1bmtub3dufSB4bWxPYmplY3QgVGhlIFhNTCBPYmplY3QgcGFzc2VkIGFmdGVyIHBhcnNpbmdcbiAgICogQHByb3RlY3RlZFxuICAgKiBAcmV0dXJucyB7VH0gUmV0dXJucyBhIHJlZm9ybWF0dGVkIFhNTCBvYmplY3QgdG8gbWFrZSBpdCBlYXNpZXIgZm9yIGNvZGVcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGNvbnN0IHhtbE9iamVjdCA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHsuLi59KTsgLy8geyBcIkBfQXR0cmlidXRlXCI6IFt7IFwiQF9OZXN0ZWRcIjogW3suLi59LCB7Li4ufV19XX1cbiAgICogcGFyc2VYTUxPYmplY3QoeG1sT2JqZWN0KTsgLy8geyBhdHRyaWJ1dGU6IHsgbmVzdGVkOiBbey4uLn0sIHsuLi59XSB9IH1cbiAgICpcbiAgICogYGBgXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcGFyc2VYTUxPYmplY3QoeG1sT2JqZWN0OiB1bmtub3duKTogVDtcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGZpbGUgZnJvbSBzeW5lcmd5IHNlcnZlcnMuIEFmdGVyIHJldHJpZXZpbmcgdGhlIHhtbE9iamVjdCwgdGhpcyBtZXRob2QgY2FsbHMgcGFyc2VYTUxPYmplY3Qgd2hpY2ggbXVzdCBiZSBkZWZpbmVkIHRvIHBhcnNlIHRoZSB4bWxPYmplY3QgaW50byBhIHJlYWRhYmxlLCB0eXBlc2FmZSBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge1Byb21pc2U8VD59IFJldHVybnMgYSBiYXNlNjQgb2JqZWN0XG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBjb25zdCBiYXNlNjQgPSBhd2FpdCBkb2N1bWVudC5nZXQoKTsgLy8geyBhdHRyaWJ1dGU6IHsgbmVzdGVkOiB7Li4ufSB9LCBiYXNlNjQ6IFwiYmFzZTY0IGNvZGVcIiB9XG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIGdldCgpOiBQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBzdXBlclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KHtcbiAgICAgICAgICBtZXRob2ROYW1lOiB0aGlzLm1ldGhvZE5hbWUsXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgRG9jdW1lbnRHVTogdGhpcy5kb2N1bWVudEd1IH0sXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKChiYXNlNjREYXRhKSA9PiB7XG4gICAgICAgICAgcmVzKHRoaXMucGFyc2VYTUxPYmplY3QoYmFzZTY0RGF0YSkpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2gocmVqKTtcbiAgICB9KTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDZSxNQUFlQSxJQUFJLFNBQVlDLGFBQUksQ0FBQ0MsTUFBTSxDQUFDO0lBS2pEQyxXQUFXLENBQUNDLFdBQTZCLEVBQUVDLFVBQWtCLEVBQUVDLFVBQWtCLEVBQUU7TUFDeEYsS0FBSyxDQUFDRixXQUFXLENBQUM7O01BRWxCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ0ksSUFBSSxDQUFDQyxVQUFVLEdBQUdBLFVBQVU7O01BRTVCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ0ksSUFBSSxDQUFDQyxVQUFVLEdBQUdBLFVBQVU7SUFDOUI7O0lBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztJQUdFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNTQyxHQUFHLEdBQWU7TUFDdkIsT0FBTyxJQUFJQyxPQUFPLENBQUMsQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEtBQUs7UUFDL0IsS0FBSyxDQUNGQyxjQUFjLENBQTBCO1VBQ3ZDTCxVQUFVLEVBQUUsSUFBSSxDQUFDQSxVQUFVO1VBQzNCTSxRQUFRLEVBQUU7WUFBRUMsVUFBVSxFQUFFLENBQUM7WUFBRUMsVUFBVSxFQUFFLElBQUksQ0FBQ1Q7VUFBVztRQUN6RCxDQUFDLENBQUMsQ0FDRFUsSUFBSSxDQUFFQyxVQUFVLElBQUs7VUFDcEJQLEdBQUcsQ0FBQyxJQUFJLENBQUNRLGNBQWMsQ0FBQ0QsVUFBVSxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQ0RFLEtBQUssQ0FBQ1IsR0FBRyxDQUFDO01BQ2YsQ0FBQyxDQUFDO0lBQ0o7RUFDRjtFQUFDO0FBQUEifQ==