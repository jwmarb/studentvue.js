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
    constructor(name, attachmentGu, session) {
      super(session);

      /**
       * The name of the attachment.
       * @type {string}
       * @public
       * @readonly
       */
      this.name = name;

      /**
       * the GU of the attachment.
       * @type {string}
       * @public
       * @readonly
       */
      this.attachmentGu = attachmentGu;

      /**
       * The file extension of the attachment extracted using regex
       * @type {string | null}
       * @public
       * @readonly
       */
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
      return new Promise((res, reject) => {
        super.processRequest({
          methodName: 'SynergyMailGetAttachment',
          paramStr: {
            childIntId: 0,
            SmAttachmentGu: this.attachmentGu
          }
        }).then(xmlObject => {
          res(xmlObject.AttachmentXML[0].Base64Code[0]);
        }).catch(reject);
      });
    }
  }
  _exports.default = Attachment;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBdHRhY2htZW50Iiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwibmFtZSIsImF0dGFjaG1lbnRHdSIsInNlc3Npb24iLCJmaWxlRXh0ZW5zaW9uIiwibWF0Y2giLCJnZXQiLCJQcm9taXNlIiwicmVzIiwicmVqZWN0IiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwiU21BdHRhY2htZW50R3UiLCJ0aGVuIiwieG1sT2JqZWN0IiwiQXR0YWNobWVudFhNTCIsIkJhc2U2NENvZGUiLCJjYXRjaCJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0F0dGFjaG1lbnQvQXR0YWNobWVudC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlNjRTdHJpbmcgfSBmcm9tICcuLi8uLi91dGlscy90eXBlcyc7XHJcbmltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XHJcbmltcG9ydCB7IEF0dGFjaG1lbnRYTUxPYmplY3QgfSBmcm9tICcuL0F0dGFjaG1lbnQueG1sJztcclxuXHJcbi8qKlxyXG4gKiBBdHRhY2htZW50IGNsYXNzXHJcbiAqIFRoaXMgaXMgYSBjbGFzcyB1c2VkIHRvIGRlZmluZSBtZXNzYWdlIGF0dGFjaG1lbnRzXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRhY2htZW50IGV4dGVuZHMgc29hcC5DbGllbnQge1xyXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBhdHRhY2htZW50R3U6IHN0cmluZztcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IGZpbGVFeHRlbnNpb246IHN0cmluZyB8IG51bGw7XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGF0dGFjaG1lbnRHdTogc3RyaW5nLCBzZXNzaW9uOiBMb2dpbkNyZWRlbnRpYWxzKSB7XHJcbiAgICBzdXBlcihzZXNzaW9uKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBhdHRhY2htZW50LlxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogdGhlIEdVIG9mIHRoZSBhdHRhY2htZW50LlxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLmF0dGFjaG1lbnRHdSA9IGF0dGFjaG1lbnRHdTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBmaWxlIGV4dGVuc2lvbiBvZiB0aGUgYXR0YWNobWVudCBleHRyYWN0ZWQgdXNpbmcgcmVnZXhcclxuICAgICAqIEB0eXBlIHtzdHJpbmcgfCBudWxsfVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZmlsZUV4dGVuc2lvbiA9IChuYW1lLm1hdGNoKC8oXFwuW14uXSspJC8pID8/IFtudWxsXSlbMF07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaGVzIHRoZSBhdHRhY2htZW50IGZyb20gc3luZXJneSBzZXJ2ZXJzLlxyXG4gICAqIFVuZm9ydHVuYXRlbHksIHRoZSBhcGkgZG9lcyBub3Qgb2ZmZXIgYSBVUkwgcGF0aCB0byB0aGUgZmlsZVxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGJhc2U2NCBzdHJpbmdcclxuICAgKlxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgYmFzZTY0ID0gYXdhaXQgc29tZUF0dGFjaG1lbnQuZ2V0KCk7XHJcbiAgICogY29uc29sZS5sb2coYmFzZTY0KSAvLyAtPiBVRXNEQkJRQUJnQUlBQUFBSVFDajc3cy4uLlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXQoKTogUHJvbWlzZTxCYXNlNjRTdHJpbmc+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxCYXNlNjRTdHJpbmc+KChyZXMsIHJlamVjdCkgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxBdHRhY2htZW50WE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnU3luZXJneU1haWxHZXRBdHRhY2htZW50JyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIFNtQXR0YWNobWVudEd1OiB0aGlzLmF0dGFjaG1lbnRHdSB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKHhtbE9iamVjdC5BdHRhY2htZW50WE1MWzBdLkJhc2U2NENvZGVbMF0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlamVjdCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDZSxNQUFNQSxVQUFVLFNBQVNDLGFBQUksQ0FBQ0MsTUFBTSxDQUFDO0lBTzNDQyxXQUFXLENBQUNDLElBQVksRUFBRUMsWUFBb0IsRUFBRUMsT0FBeUIsRUFBRTtNQUNoRixLQUFLLENBQUNBLE9BQU8sQ0FBQzs7TUFFZDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDSSxJQUFJLENBQUNGLElBQUksR0FBR0EsSUFBSTs7TUFFaEI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ0ksSUFBSSxDQUFDQyxZQUFZLEdBQUdBLFlBQVk7O01BRWhDO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUNJLElBQUksQ0FBQ0UsYUFBYSxHQUFHLENBQUNILElBQUksQ0FBQ0ksS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlEOztJQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDU0MsR0FBRyxHQUEwQjtNQUNsQyxPQUFPLElBQUlDLE9BQU8sQ0FBZSxDQUFDQyxHQUFHLEVBQUVDLE1BQU0sS0FBSztRQUNoRCxLQUFLLENBQ0ZDLGNBQWMsQ0FBc0I7VUFDbkNDLFVBQVUsRUFBRSwwQkFBMEI7VUFDdENDLFFBQVEsRUFBRTtZQUFFQyxVQUFVLEVBQUUsQ0FBQztZQUFFQyxjQUFjLEVBQUUsSUFBSSxDQUFDWjtVQUFhO1FBQy9ELENBQUMsQ0FBQyxDQUNEYSxJQUFJLENBQUVDLFNBQVMsSUFBSztVQUNuQlIsR0FBRyxDQUFDUSxTQUFTLENBQUNDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUNEQyxLQUFLLENBQUNWLE1BQU0sQ0FBQztNQUNsQixDQUFDLENBQUM7SUFDSjtFQUNGO0VBQUM7QUFBQSJ9