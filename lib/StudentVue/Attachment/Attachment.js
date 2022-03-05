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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0F0dGFjaG1lbnQvQXR0YWNobWVudC50cyJdLCJuYW1lcyI6WyJBdHRhY2htZW50Iiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwibmFtZSIsImF0dGFjaG1lbnRHdSIsInNlc3Npb24iLCJmaWxlRXh0ZW5zaW9uIiwibWF0Y2giLCJnZXQiLCJQcm9taXNlIiwicmVzIiwicmVqZWN0IiwieG1sT2JqZWN0IiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwiU21BdHRhY2htZW50R3UiLCJBdHRhY2htZW50WE1MIiwiQmFzZTY0Q29kZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsUUFBTUEsVUFBTixTQUF5QkMsY0FBS0MsTUFBOUIsQ0FBcUM7QUFPM0NDLElBQUFBLFdBQVcsQ0FBQ0MsSUFBRCxFQUFlQyxZQUFmLEVBQXFDQyxPQUFyQyxFQUFnRTtBQUNoRixZQUFNQSxPQUFOO0FBRUE7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNJLFdBQUtGLElBQUwsR0FBWUEsSUFBWjtBQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxXQUFLQyxZQUFMLEdBQW9CQSxZQUFwQjtBQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxXQUFLRSxhQUFMLEdBQXFCLENBQUNILElBQUksQ0FBQ0ksS0FBTCxDQUFXLFlBQVgsS0FBNEIsQ0FBQyxJQUFELENBQTdCLEVBQXFDLENBQXJDLENBQXJCO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU0MsSUFBQUEsR0FBRyxHQUEwQjtBQUNsQyxhQUFPLElBQUlDLE9BQUosQ0FBMEIsT0FBT0MsR0FBUCxFQUFZQyxNQUFaLEtBQXVCO0FBQ3RELFlBQUk7QUFDRixnQkFBTUMsU0FBOEIsR0FBRyxNQUFNLE1BQU1DLGNBQU4sQ0FBcUI7QUFDaEVDLFlBQUFBLFVBQVUsRUFBRSwwQkFEb0Q7QUFFaEVDLFlBQUFBLFFBQVEsRUFBRTtBQUFFQyxjQUFBQSxVQUFVLEVBQUUsQ0FBZDtBQUFpQkMsY0FBQUEsY0FBYyxFQUFFLEtBQUtiO0FBQXRDO0FBRnNELFdBQXJCLENBQTdDO0FBS0FNLFVBQUFBLEdBQUcsQ0FBQ0UsU0FBUyxDQUFDTSxhQUFWLENBQXdCLENBQXhCLEVBQTJCQyxVQUEzQixDQUFzQyxDQUF0QyxDQUFELENBQUg7QUFDRCxTQVBELENBT0UsT0FBT0MsQ0FBUCxFQUFVO0FBQ1ZULFVBQUFBLE1BQU0sQ0FBQ1MsQ0FBRCxDQUFOO0FBQ0Q7QUFDRixPQVhNLENBQVA7QUFZRDs7QUEzRGlEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZTY0U3RyaW5nIH0gZnJvbSAnLi4vLi4vdXRpbHMvdHlwZXMnO1xyXG5pbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgc29hcCBmcm9tICcuLi8uLi91dGlscy9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgeyBBdHRhY2htZW50WE1MT2JqZWN0IH0gZnJvbSAnLi9BdHRhY2htZW50LnhtbCc7XHJcblxyXG4vKipcclxuICogQXR0YWNobWVudCBjbGFzc1xyXG4gKiBUaGlzIGlzIGEgY2xhc3MgdXNlZCB0byBkZWZpbmUgbWVzc2FnZSBhdHRhY2htZW50c1xyXG4gKiBAY29uc3RydWN0b3JcclxuICogQGV4dGVuZHMge3NvYXAuQ2xpZW50fVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXR0YWNobWVudCBleHRlbmRzIHNvYXAuQ2xpZW50IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgYXR0YWNobWVudEd1OiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBmaWxlRXh0ZW5zaW9uOiBzdHJpbmcgfCBudWxsO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBhdHRhY2htZW50R3U6IHN0cmluZywgc2Vzc2lvbjogTG9naW5DcmVkZW50aWFscykge1xyXG4gICAgc3VwZXIoc2Vzc2lvbik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYXR0YWNobWVudC5cclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIHRoZSBHVSBvZiB0aGUgYXR0YWNobWVudC5cclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdGhpcy5hdHRhY2htZW50R3UgPSBhdHRhY2htZW50R3U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZmlsZSBleHRlbnNpb24gb2YgdGhlIGF0dGFjaG1lbnQgZXh0cmFjdGVkIHVzaW5nIHJlZ2V4XHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nIHwgbnVsbH1cclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLmZpbGVFeHRlbnNpb24gPSAobmFtZS5tYXRjaCgvKFxcLlteLl0rKSQvKSA/PyBbbnVsbF0pWzBdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyB0aGUgYXR0YWNobWVudCBmcm9tIHN5bmVyZ3kgc2VydmVycy5cclxuICAgKiBVbmZvcnR1bmF0ZWx5LCB0aGUgYXBpIGRvZXMgbm90IG9mZmVyIGEgVVJMIHBhdGggdG8gdGhlIGZpbGVcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBiYXNlNjQgc3RyaW5nXHJcbiAgICpcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IGJhc2U2NCA9IGF3YWl0IHNvbWVBdHRhY2htZW50LmdldCgpO1xyXG4gICAqIGNvbnNvbGUubG9nKGJhc2U2NCkgLy8gLT4gVUVzREJCUUFCZ0FJQUFBQUlRQ2o3N3MuLi5cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0KCk6IFByb21pc2U8QmFzZTY0U3RyaW5nPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8QmFzZTY0U3RyaW5nPihhc3luYyAocmVzLCByZWplY3QpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB4bWxPYmplY3Q6IEF0dGFjaG1lbnRYTUxPYmplY3QgPSBhd2FpdCBzdXBlci5wcm9jZXNzUmVxdWVzdCh7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnU3luZXJneU1haWxHZXRBdHRhY2htZW50JyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIFNtQXR0YWNobWVudEd1OiB0aGlzLmF0dGFjaG1lbnRHdSB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXMoeG1sT2JqZWN0LkF0dGFjaG1lbnRYTUxbMF0uQmFzZTY0Q29kZVswXSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=