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
     * @example
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0F0dGFjaG1lbnQvQXR0YWNobWVudC50cyJdLCJuYW1lcyI6WyJBdHRhY2htZW50Iiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwibmFtZSIsImF0dGFjaG1lbnRHdSIsInNlc3Npb24iLCJmaWxlRXh0ZW5zaW9uIiwibWF0Y2giLCJnZXQiLCJQcm9taXNlIiwicmVzIiwicmVqZWN0IiwieG1sT2JqZWN0IiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwiU21BdHRhY2htZW50R3UiLCJBdHRhY2htZW50WE1MIiwiQmFzZTY0Q29kZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS2UsUUFBTUEsVUFBTixTQUF5QkMsY0FBS0MsTUFBOUIsQ0FBcUM7QUFLM0NDLElBQUFBLFdBQVcsQ0FBQ0MsSUFBRCxFQUFlQyxZQUFmLEVBQXFDQyxPQUFyQyxFQUFnRTtBQUNoRixZQUFNQSxPQUFOO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNJLFdBQUtGLElBQUwsR0FBWUEsSUFBWjtBQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxXQUFLQyxZQUFMLEdBQW9CQSxZQUFwQjtBQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxXQUFLRSxhQUFMLEdBQXFCLENBQUNILElBQUksQ0FBQ0ksS0FBTCxDQUFXLFlBQVgsS0FBNEIsQ0FBQyxJQUFELENBQTdCLEVBQXFDLENBQXJDLENBQXJCO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU0MsSUFBQUEsR0FBRyxHQUEwQjtBQUNsQyxhQUFPLElBQUlDLE9BQUosQ0FBMEIsT0FBT0MsR0FBUCxFQUFZQyxNQUFaLEtBQXVCO0FBQ3RELFlBQUk7QUFDRixnQkFBTUMsU0FBOEIsR0FBRyxNQUFNLE1BQU1DLGNBQU4sQ0FBcUI7QUFDaEVDLFlBQUFBLFVBQVUsRUFBRSwwQkFEb0Q7QUFFaEVDLFlBQUFBLFFBQVEsRUFBRTtBQUFFQyxjQUFBQSxVQUFVLEVBQUUsQ0FBZDtBQUFpQkMsY0FBQUEsY0FBYyxFQUFFLEtBQUtiO0FBQXRDO0FBRnNELFdBQXJCLENBQTdDO0FBS0FNLFVBQUFBLEdBQUcsQ0FBQ0UsU0FBUyxDQUFDTSxhQUFWLENBQXdCLENBQXhCLEVBQTJCQyxVQUEzQixDQUFzQyxDQUF0QyxDQUFELENBQUg7QUFDRCxTQVBELENBT0UsT0FBT0MsQ0FBUCxFQUFVO0FBQ1ZULFVBQUFBLE1BQU0sQ0FBQ1MsQ0FBRCxDQUFOO0FBQ0Q7QUFDRixPQVhNLENBQVA7QUFZRDs7QUF4RGlEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZTY0U3RyaW5nIH0gZnJvbSAnLi4vLi4vdXRpbHMvdHlwZXMnO1xyXG5pbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgc29hcCBmcm9tICcuLi8uLi91dGlscy9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgeyBBdHRhY2htZW50WE1MT2JqZWN0IH0gZnJvbSAnLi9BdHRhY2htZW50LnhtbCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRhY2htZW50IGV4dGVuZHMgc29hcC5DbGllbnQge1xyXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGF0dGFjaG1lbnRHdTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBmaWxlRXh0ZW5zaW9uOiBzdHJpbmcgfCBudWxsO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBhdHRhY2htZW50R3U6IHN0cmluZywgc2Vzc2lvbjogTG9naW5DcmVkZW50aWFscykge1xyXG4gICAgc3VwZXIoc2Vzc2lvbik7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBhdHRhY2htZW50LlxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogdGhlIEdVIG9mIHRoZSBhdHRhY2htZW50LlxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLmF0dGFjaG1lbnRHdSA9IGF0dGFjaG1lbnRHdTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBmaWxlIGV4dGVuc2lvbiBvZiB0aGUgYXR0YWNobWVudCBleHRyYWN0ZWQgdXNpbmcgcmVnZXhcclxuICAgICAqIEB0eXBlIHtzdHJpbmcgfCBudWxsfVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZmlsZUV4dGVuc2lvbiA9IChuYW1lLm1hdGNoKC8oXFwuW14uXSspJC8pID8/IFtudWxsXSlbMF07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaGVzIHRoZSBhdHRhY2htZW50IGZyb20gc3luZXJneSBzZXJ2ZXJzLlxyXG4gICAqIFVuZm9ydHVuYXRlbHksIHRoZSBhcGkgZG9lcyBub3Qgb2ZmZXIgYSBVUkwgcGF0aCB0byB0aGUgZmlsZVxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGJhc2U2NCBzdHJpbmdcclxuICAgKlxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBiYXNlNjQgPSBhd2FpdCBzb21lQXR0YWNobWVudC5nZXQoKTtcclxuICAgKiBjb25zb2xlLmxvZyhiYXNlNjQpIC8vIC0+IFVFc0RCQlFBQmdBSUFBQUFJUUNqNzdzLi4uXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGdldCgpOiBQcm9taXNlPEJhc2U2NFN0cmluZz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPEJhc2U2NFN0cmluZz4oYXN5bmMgKHJlcywgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeG1sT2JqZWN0OiBBdHRhY2htZW50WE1MT2JqZWN0ID0gYXdhaXQgc3VwZXIucHJvY2Vzc1JlcXVlc3Qoe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N5bmVyZ3lNYWlsR2V0QXR0YWNobWVudCcsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwLCBTbUF0dGFjaG1lbnRHdTogdGhpcy5hdHRhY2htZW50R3UgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVzKHhtbE9iamVjdC5BdHRhY2htZW50WE1MWzBdLkJhc2U2NENvZGVbMF0pO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19