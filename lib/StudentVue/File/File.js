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

  class File extends _soap.default.Client {
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
     * @example
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
     * @example
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0ZpbGUvRmlsZS50cyJdLCJuYW1lcyI6WyJGaWxlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJkb2N1bWVudEd1IiwibWV0aG9kTmFtZSIsImdldCIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJiYXNlNjREYXRhIiwicHJvY2Vzc1JlcXVlc3QiLCJwYXJhbVN0ciIsImNoaWxkSW50SWQiLCJEb2N1bWVudEdVIiwicGFyc2VYTUxPYmplY3QiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUllLFFBQWVBLElBQWYsU0FBK0JDLGNBQUtDLE1BQXBDLENBQTJDO0FBSWpEQyxJQUFBQSxXQUFXLENBQUNDLFdBQUQsRUFBZ0NDLFVBQWhDLEVBQW9EQyxVQUFwRCxFQUF3RTtBQUN4RixZQUFNRixXQUFOO0FBQ0EsV0FBS0MsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxXQUFLQyxVQUFMLEdBQWtCQSxVQUFsQjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDU0MsSUFBQUEsR0FBRyxHQUFlO0FBQ3ZCLGFBQU8sSUFBSUMsT0FBSixDQUFZLE9BQU9DLEdBQVAsRUFBWUMsR0FBWixLQUFvQjtBQUNyQyxZQUFJO0FBQ0YsZ0JBQU1DLFVBQW1DLEdBQUcsTUFBTSxNQUFNQyxjQUFOLENBQXFCO0FBQ3JFTixZQUFBQSxVQUFVLEVBQUUsS0FBS0EsVUFEb0Q7QUFFckVPLFlBQUFBLFFBQVEsRUFBRTtBQUFFQyxjQUFBQSxVQUFVLEVBQUUsQ0FBZDtBQUFpQkMsY0FBQUEsVUFBVSxFQUFFLEtBQUtWO0FBQWxDO0FBRjJELFdBQXJCLENBQWxEO0FBSUFJLFVBQUFBLEdBQUcsQ0FBQyxLQUFLTyxjQUFMLENBQW9CTCxVQUFwQixDQUFELENBQUg7QUFDRCxTQU5ELENBTUUsT0FBT00sQ0FBUCxFQUFVO0FBQ1ZQLFVBQUFBLEdBQUcsQ0FBQ08sQ0FBRCxDQUFIO0FBQ0Q7QUFDRixPQVZNLENBQVA7QUFXRDs7QUE3Q3VEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscyB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHNvYXAgZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9zb2FwJztcclxuaW1wb3J0IHsgQmFzZTY0U3RyaW5nIH0gZnJvbSAnLi4vLi4vdXRpbHMvdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgRmlsZTxUPiBleHRlbmRzIHNvYXAuQ2xpZW50IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgZG9jdW1lbnRHdTogc3RyaW5nO1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgbWV0aG9kTmFtZTogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsIGRvY3VtZW50R3U6IHN0cmluZywgbWV0aG9kTmFtZTogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihjcmVkZW50aWFscyk7XHJcbiAgICB0aGlzLmRvY3VtZW50R3UgPSBkb2N1bWVudEd1O1xyXG4gICAgdGhpcy5tZXRob2ROYW1lID0gbWV0aG9kTmFtZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhcnNlIHRoZSBYTUwgb2JqZWN0IHRvIHRyYW5zbGF0ZSBpdCBpbnRvIGFuIG9yZGluYXJ5IG9iamVjdC4gVGhpcyBtZXRob2QgbXVzdCBiZSB3cml0dGVuIGZvciBldmVyeSBjbGFzcyB0aGF0IGV4dGVuZHMgRG9jdW1lbnQgKHdoaWNoIGdldHMgdGhlIGZpbGUgZnJvbSBzeW5lcmd5IHNlcnZlcnMgdXNpbmcgYSBQT1NUIGZldGNoIHJlcXVlc3QpXHJcbiAgICogQHBhcmFtIHt1bmtub3dufSB4bWxPYmplY3QgVGhlIFhNTCBPYmplY3QgcGFzc2VkIGFmdGVyIHBhcnNpbmdcclxuICAgKiBAcHJvdGVjdGVkXHJcbiAgICogQHJldHVybnMge1R9IFJldHVybnMgYSByZWZvcm1hdHRlZCBYTUwgb2JqZWN0IHRvIG1ha2UgaXQgZWFzaWVyIGZvciBjb2RlXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IHhtbE9iamVjdCA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHsuLi59KTsgLy8geyBcIkBfQXR0cmlidXRlXCI6IFt7IFwiQF9OZXN0ZWRcIjogW3suLi59LCB7Li4ufV19XX1cclxuICAgKiBwYXJzZVhNTE9iamVjdCh4bWxPYmplY3QpOyAvLyB7IGF0dHJpYnV0ZTogeyBuZXN0ZWQ6IFt7Li4ufSwgey4uLn1dIH0gfVxyXG4gICAqXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHBhcnNlWE1MT2JqZWN0KHhtbE9iamVjdDogdW5rbm93bik6IFQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHJpZXZlIHRoZSBmaWxlIGZyb20gc3luZXJneSBzZXJ2ZXJzLiBBZnRlciByZXRyaWV2aW5nIHRoZSB4bWxPYmplY3QsIHRoaXMgbWV0aG9kIGNhbGxzIHBhcnNlWE1MT2JqZWN0IHdoaWNoIG11c3QgYmUgZGVmaW5lZCB0byBwYXJzZSB0aGUgeG1sT2JqZWN0IGludG8gYSByZWFkYWJsZSwgdHlwZXNhZmUgb2JqZWN0LlxyXG4gICAqIEBwdWJsaWNcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxUPn0gUmV0dXJucyBhIGJhc2U2NCBvYmplY3RcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgYmFzZTY0ID0gYXdhaXQgZG9jdW1lbnQuZ2V0KCk7IC8vIHsgYXR0cmlidXRlOiB7IG5lc3RlZDogey4uLn0gfSwgYmFzZTY0OiBcImJhc2U2NCBjb2RlXCIgfVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXQoKTogUHJvbWlzZTxUPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgYmFzZTY0RGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSBhd2FpdCBzdXBlci5wcm9jZXNzUmVxdWVzdCh7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiB0aGlzLm1ldGhvZE5hbWUsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwLCBEb2N1bWVudEdVOiB0aGlzLmRvY3VtZW50R3UgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXModGhpcy5wYXJzZVhNTE9iamVjdChiYXNlNjREYXRhKSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=