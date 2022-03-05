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
    global.Attachment = mod.exports;
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
   * Attachment class
   * This is a class used to define message attachments
   * @constructor
   * @extends {soap.Client}
   */
  class Attachment extends _soap.default.Client {
    /**
     * The name of the attachment.
     * @type {string}
     * @public
     * @readonly
     */

    /**
     * the GU of the attachment.
     * @type {string}
     * @public
     * @readonly
     */

    /**
     * The file extension of the attachment extracted using regex
     * @type {string | null}
     * @public
     * @readonly
     */
    constructor(name, attachmentGu, session) {
      super(session);
      this.name = name;
      this.attachmentGu = attachmentGu;
      this.fileExtension = (name.match(/(\.[^.]+)$/) ?? [null])[0];
    }
    /**
     * Fetches the attachment from synergy servers.
     * Unfortunately, the api does not offer a URL path to the file
     * @returns {string} base64 string
     *
     * @description
     * ```js
     * const base64 = await someAttachment.get();
     * console.log(base64) // -> UEsDBBQABgAIAAAAIQCj77s...
     * ```
     */


    get() {
      return new Promise(async (res, reject) => {
        try {
          const xmlObject = await super.processRequest({
            methodName: 'SynergyMailGetAttachment',
            paramStr: {
              childIntId: 0,
              SmAttachmentGu: this.attachmentGu
            }
          });
          res(xmlObject.AttachmentXML[0].Base64Code[0]);
        } catch (e) {
          reject(e);
        }
      });
    }

  }

  _exports.default = Attachment;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0F0dGFjaG1lbnQvQXR0YWNobWVudC50cyJdLCJuYW1lcyI6WyJBdHRhY2htZW50Iiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwibmFtZSIsImF0dGFjaG1lbnRHdSIsInNlc3Npb24iLCJmaWxlRXh0ZW5zaW9uIiwibWF0Y2giLCJnZXQiLCJQcm9taXNlIiwicmVzIiwicmVqZWN0IiwieG1sT2JqZWN0IiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwiU21BdHRhY2htZW50R3UiLCJBdHRhY2htZW50WE1MIiwiQmFzZTY0Q29kZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsUUFBTUEsVUFBTixTQUF5QkMsY0FBS0MsTUFBOUIsQ0FBcUM7QUFDbEQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHU0MsSUFBQUEsV0FBVyxDQUFDQyxJQUFELEVBQWVDLFlBQWYsRUFBcUNDLE9BQXJDLEVBQWdFO0FBQ2hGLFlBQU1BLE9BQU47QUFDQSxXQUFLRixJQUFMLEdBQVlBLElBQVo7QUFDQSxXQUFLQyxZQUFMLEdBQW9CQSxZQUFwQjtBQUNBLFdBQUtFLGFBQUwsR0FBcUIsQ0FBQ0gsSUFBSSxDQUFDSSxLQUFMLENBQVcsWUFBWCxLQUE0QixDQUFDLElBQUQsQ0FBN0IsRUFBcUMsQ0FBckMsQ0FBckI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNTQyxJQUFBQSxHQUFHLEdBQTBCO0FBQ2xDLGFBQU8sSUFBSUMsT0FBSixDQUEwQixPQUFPQyxHQUFQLEVBQVlDLE1BQVosS0FBdUI7QUFDdEQsWUFBSTtBQUNGLGdCQUFNQyxTQUE4QixHQUFHLE1BQU0sTUFBTUMsY0FBTixDQUFxQjtBQUNoRUMsWUFBQUEsVUFBVSxFQUFFLDBCQURvRDtBQUVoRUMsWUFBQUEsUUFBUSxFQUFFO0FBQUVDLGNBQUFBLFVBQVUsRUFBRSxDQUFkO0FBQWlCQyxjQUFBQSxjQUFjLEVBQUUsS0FBS2I7QUFBdEM7QUFGc0QsV0FBckIsQ0FBN0M7QUFLQU0sVUFBQUEsR0FBRyxDQUFDRSxTQUFTLENBQUNNLGFBQVYsQ0FBd0IsQ0FBeEIsRUFBMkJDLFVBQTNCLENBQXNDLENBQXRDLENBQUQsQ0FBSDtBQUNELFNBUEQsQ0FPRSxPQUFPQyxDQUFQLEVBQVU7QUFDVlQsVUFBQUEsTUFBTSxDQUFDUyxDQUFELENBQU47QUFDRDtBQUNGLE9BWE0sQ0FBUDtBQVlEOztBQXhEaUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlNjRTdHJpbmcgfSBmcm9tICcuLi8uLi91dGlscy90eXBlcyc7XHJcbmltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XHJcbmltcG9ydCB7IEF0dGFjaG1lbnRYTUxPYmplY3QgfSBmcm9tICcuL0F0dGFjaG1lbnQueG1sJztcclxuXHJcbi8qKlxyXG4gKiBBdHRhY2htZW50IGNsYXNzXHJcbiAqIFRoaXMgaXMgYSBjbGFzcyB1c2VkIHRvIGRlZmluZSBtZXNzYWdlIGF0dGFjaG1lbnRzXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRhY2htZW50IGV4dGVuZHMgc29hcC5DbGllbnQge1xyXG4gIC8qKlxyXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBhdHRhY2htZW50LlxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICogQHB1YmxpY1xyXG4gICAqIEByZWFkb25seVxyXG4gICAqL1xyXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIHRoZSBHVSBvZiB0aGUgYXR0YWNobWVudC5cclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBwdWJsaWNcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKi9cclxuICBwdWJsaWMgcmVhZG9ubHkgYXR0YWNobWVudEd1OiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBmaWxlIGV4dGVuc2lvbiBvZiB0aGUgYXR0YWNobWVudCBleHRyYWN0ZWQgdXNpbmcgcmVnZXhcclxuICAgKiBAdHlwZSB7c3RyaW5nIHwgbnVsbH1cclxuICAgKiBAcHVibGljXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICovXHJcbiAgcHVibGljIHJlYWRvbmx5IGZpbGVFeHRlbnNpb246IHN0cmluZyB8IG51bGw7XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGF0dGFjaG1lbnRHdTogc3RyaW5nLCBzZXNzaW9uOiBMb2dpbkNyZWRlbnRpYWxzKSB7XHJcbiAgICBzdXBlcihzZXNzaW9uKTtcclxuICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB0aGlzLmF0dGFjaG1lbnRHdSA9IGF0dGFjaG1lbnRHdTtcclxuICAgIHRoaXMuZmlsZUV4dGVuc2lvbiA9IChuYW1lLm1hdGNoKC8oXFwuW14uXSspJC8pID8/IFtudWxsXSlbMF07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaGVzIHRoZSBhdHRhY2htZW50IGZyb20gc3luZXJneSBzZXJ2ZXJzLlxyXG4gICAqIFVuZm9ydHVuYXRlbHksIHRoZSBhcGkgZG9lcyBub3Qgb2ZmZXIgYSBVUkwgcGF0aCB0byB0aGUgZmlsZVxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGJhc2U2NCBzdHJpbmdcclxuICAgKlxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgYmFzZTY0ID0gYXdhaXQgc29tZUF0dGFjaG1lbnQuZ2V0KCk7XHJcbiAgICogY29uc29sZS5sb2coYmFzZTY0KSAvLyAtPiBVRXNEQkJRQUJnQUlBQUFBSVFDajc3cy4uLlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXQoKTogUHJvbWlzZTxCYXNlNjRTdHJpbmc+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxCYXNlNjRTdHJpbmc+KGFzeW5jIChyZXMsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHhtbE9iamVjdDogQXR0YWNobWVudFhNTE9iamVjdCA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTeW5lcmd5TWFpbEdldEF0dGFjaG1lbnQnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgU21BdHRhY2htZW50R3U6IHRoaXMuYXR0YWNobWVudEd1IH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJlcyh4bWxPYmplY3QuQXR0YWNobWVudFhNTFswXS5CYXNlNjRDb2RlWzBdKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlamVjdChlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==