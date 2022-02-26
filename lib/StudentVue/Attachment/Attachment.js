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
      this.name = name;
      this.attachmentGu = attachmentGu;
      this.fileExtension = (name.match(/(\.[^.]+)$/) ?? [null])[0];
    }
    /**
     * Fetches the attachment from synergy servers.
     * Unfortunately, the api does not offer a URL path to the file
     * @returns base64 string
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0F0dGFjaG1lbnQvQXR0YWNobWVudC50cyJdLCJuYW1lcyI6WyJBdHRhY2htZW50Iiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwibmFtZSIsImF0dGFjaG1lbnRHdSIsInNlc3Npb24iLCJmaWxlRXh0ZW5zaW9uIiwibWF0Y2giLCJnZXQiLCJQcm9taXNlIiwicmVzIiwicmVqZWN0IiwieG1sT2JqZWN0IiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwiU21BdHRhY2htZW50R3UiLCJBdHRhY2htZW50WE1MIiwiQmFzZTY0Q29kZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS2UsUUFBTUEsVUFBTixTQUF5QkMsY0FBS0MsTUFBOUIsQ0FBcUM7QUFLM0NDLElBQUFBLFdBQVcsQ0FBQ0MsSUFBRCxFQUFlQyxZQUFmLEVBQXFDQyxPQUFyQyxFQUFnRTtBQUNoRixZQUFNQSxPQUFOO0FBQ0EsV0FBS0YsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsV0FBS0MsWUFBTCxHQUFvQkEsWUFBcEI7QUFDQSxXQUFLRSxhQUFMLEdBQXFCLENBQUNILElBQUksQ0FBQ0ksS0FBTCxDQUFXLFlBQVgsS0FBNEIsQ0FBQyxJQUFELENBQTdCLEVBQXFDLENBQXJDLENBQXJCO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU0MsSUFBQUEsR0FBRyxHQUEwQjtBQUNsQyxhQUFPLElBQUlDLE9BQUosQ0FBMEIsT0FBT0MsR0FBUCxFQUFZQyxNQUFaLEtBQXVCO0FBQ3RELFlBQUk7QUFDRixnQkFBTUMsU0FBOEIsR0FBRyxNQUFNLE1BQU1DLGNBQU4sQ0FBcUI7QUFDaEVDLFlBQUFBLFVBQVUsRUFBRSwwQkFEb0Q7QUFFaEVDLFlBQUFBLFFBQVEsRUFBRTtBQUFFQyxjQUFBQSxVQUFVLEVBQUUsQ0FBZDtBQUFpQkMsY0FBQUEsY0FBYyxFQUFFLEtBQUtiO0FBQXRDO0FBRnNELFdBQXJCLENBQTdDO0FBS0FNLFVBQUFBLEdBQUcsQ0FBQ0UsU0FBUyxDQUFDTSxhQUFWLENBQXdCLENBQXhCLEVBQTJCQyxVQUEzQixDQUFzQyxDQUF0QyxDQUFELENBQUg7QUFDRCxTQVBELENBT0UsT0FBT0MsQ0FBUCxFQUFVO0FBQ1ZULFVBQUFBLE1BQU0sQ0FBQ1MsQ0FBRCxDQUFOO0FBQ0Q7QUFDRixPQVhNLENBQVA7QUFZRDs7QUFwQ2lEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZTY0U3RyaW5nIH0gZnJvbSAnLi4vLi4vdXRpbHMvdHlwZXMnO1xyXG5pbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgc29hcCBmcm9tICcuLi8uLi91dGlscy9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgeyBBdHRhY2htZW50WE1MT2JqZWN0IH0gZnJvbSAnLi9BdHRhY2htZW50LnhtbCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRhY2htZW50IGV4dGVuZHMgc29hcC5DbGllbnQge1xyXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGF0dGFjaG1lbnRHdTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBmaWxlRXh0ZW5zaW9uOiBzdHJpbmcgfCBudWxsO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBhdHRhY2htZW50R3U6IHN0cmluZywgc2Vzc2lvbjogTG9naW5DcmVkZW50aWFscykge1xyXG4gICAgc3VwZXIoc2Vzc2lvbik7XHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgdGhpcy5hdHRhY2htZW50R3UgPSBhdHRhY2htZW50R3U7XHJcbiAgICB0aGlzLmZpbGVFeHRlbnNpb24gPSAobmFtZS5tYXRjaCgvKFxcLlteLl0rKSQvKSA/PyBbbnVsbF0pWzBdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyB0aGUgYXR0YWNobWVudCBmcm9tIHN5bmVyZ3kgc2VydmVycy5cclxuICAgKiBVbmZvcnR1bmF0ZWx5LCB0aGUgYXBpIGRvZXMgbm90IG9mZmVyIGEgVVJMIHBhdGggdG8gdGhlIGZpbGVcclxuICAgKiBAcmV0dXJucyBiYXNlNjQgc3RyaW5nXHJcbiAgICpcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgYmFzZTY0ID0gYXdhaXQgc29tZUF0dGFjaG1lbnQuZ2V0KCk7XHJcbiAgICogY29uc29sZS5sb2coYmFzZTY0KSAvLyAtPiBVRXNEQkJRQUJnQUlBQUFBSVFDajc3cy4uLlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXQoKTogUHJvbWlzZTxCYXNlNjRTdHJpbmc+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxCYXNlNjRTdHJpbmc+KGFzeW5jIChyZXMsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHhtbE9iamVjdDogQXR0YWNobWVudFhNTE9iamVjdCA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTeW5lcmd5TWFpbEdldEF0dGFjaG1lbnQnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgU21BdHRhY2htZW50R3U6IHRoaXMuYXR0YWNobWVudEd1IH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJlcyh4bWxPYmplY3QuQXR0YWNobWVudFhNTFswXS5CYXNlNjRDb2RlWzBdKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlamVjdChlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==