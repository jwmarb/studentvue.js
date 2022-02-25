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
      this._name = name;
      this._attachmentGu = attachmentGu;
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

    get fileExtension() {
      return (this._name.match(/(\.[^.]+)$/) ?? [null])[0];
    }

    get attachmentGu() {
      return this._attachmentGu;
    }

    get name() {
      return this._name;
    }

  }

  _exports.default = Attachment;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0F0dGFjaG1lbnQvQXR0YWNobWVudC50cyJdLCJuYW1lcyI6WyJBdHRhY2htZW50Iiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwibmFtZSIsImF0dGFjaG1lbnRHdSIsInNlc3Npb24iLCJfbmFtZSIsIl9hdHRhY2htZW50R3UiLCJnZXQiLCJQcm9taXNlIiwicmVzIiwicmVqZWN0IiwieG1sT2JqZWN0IiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwiU21BdHRhY2htZW50R3UiLCJBdHRhY2htZW50WE1MIiwiQmFzZTY0Q29kZSIsImUiLCJmaWxlRXh0ZW5zaW9uIiwibWF0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS2UsUUFBTUEsVUFBTixTQUF5QkMsY0FBS0MsTUFBOUIsQ0FBcUM7QUFJM0NDLElBQUFBLFdBQVcsQ0FBQ0MsSUFBRCxFQUFlQyxZQUFmLEVBQXFDQyxPQUFyQyxFQUFnRTtBQUNoRixZQUFNQSxPQUFOO0FBQ0EsV0FBS0MsS0FBTCxHQUFhSCxJQUFiO0FBQ0EsV0FBS0ksYUFBTCxHQUFxQkgsWUFBckI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNTSSxJQUFBQSxHQUFHLEdBQTBCO0FBQ2xDLGFBQU8sSUFBSUMsT0FBSixDQUEwQixPQUFPQyxHQUFQLEVBQVlDLE1BQVosS0FBdUI7QUFDdEQsWUFBSTtBQUNGLGdCQUFNQyxTQUE4QixHQUFHLE1BQU0sTUFBTUMsY0FBTixDQUFxQjtBQUNoRUMsWUFBQUEsVUFBVSxFQUFFLDBCQURvRDtBQUVoRUMsWUFBQUEsUUFBUSxFQUFFO0FBQUVDLGNBQUFBLFVBQVUsRUFBRSxDQUFkO0FBQWlCQyxjQUFBQSxjQUFjLEVBQUUsS0FBS2I7QUFBdEM7QUFGc0QsV0FBckIsQ0FBN0M7QUFLQU0sVUFBQUEsR0FBRyxDQUFDRSxTQUFTLENBQUNNLGFBQVYsQ0FBd0IsQ0FBeEIsRUFBMkJDLFVBQTNCLENBQXNDLENBQXRDLENBQUQsQ0FBSDtBQUNELFNBUEQsQ0FPRSxPQUFPQyxDQUFQLEVBQVU7QUFDVlQsVUFBQUEsTUFBTSxDQUFDUyxDQUFELENBQU47QUFDRDtBQUNGLE9BWE0sQ0FBUDtBQVlEOztBQUV1QixRQUFiQyxhQUFhLEdBQWtCO0FBQ3hDLGFBQU8sQ0FBQyxLQUFLZixLQUFMLENBQVdnQixLQUFYLENBQWlCLFlBQWpCLEtBQWtDLENBQUMsSUFBRCxDQUFuQyxFQUEyQyxDQUEzQyxDQUFQO0FBQ0Q7O0FBRXNCLFFBQVpsQixZQUFZLEdBQVc7QUFDaEMsYUFBTyxLQUFLRyxhQUFaO0FBQ0Q7O0FBRWMsUUFBSkosSUFBSSxHQUFXO0FBQ3hCLGFBQU8sS0FBS0csS0FBWjtBQUNEOztBQTlDaUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlNjRTdHJpbmcgfSBmcm9tICcuLi8uLi91dGlscy90eXBlcyc7XHJcbmltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XHJcbmltcG9ydCB7IEF0dGFjaG1lbnRYTUxPYmplY3QgfSBmcm9tICcuL0F0dGFjaG1lbnQueG1sJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF0dGFjaG1lbnQgZXh0ZW5kcyBzb2FwLkNsaWVudCB7XHJcbiAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgX2F0dGFjaG1lbnRHdTogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBhdHRhY2htZW50R3U6IHN0cmluZywgc2Vzc2lvbjogTG9naW5DcmVkZW50aWFscykge1xyXG4gICAgc3VwZXIoc2Vzc2lvbik7XHJcbiAgICB0aGlzLl9uYW1lID0gbmFtZTtcclxuICAgIHRoaXMuX2F0dGFjaG1lbnRHdSA9IGF0dGFjaG1lbnRHdTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgdGhlIGF0dGFjaG1lbnQgZnJvbSBzeW5lcmd5IHNlcnZlcnMuXHJcbiAgICogVW5mb3J0dW5hdGVseSwgdGhlIGFwaSBkb2VzIG5vdCBvZmZlciBhIFVSTCBwYXRoIHRvIHRoZSBmaWxlXHJcbiAgICogQHJldHVybnMgYmFzZTY0IHN0cmluZ1xyXG4gICAqXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IGJhc2U2NCA9IGF3YWl0IHNvbWVBdHRhY2htZW50LmdldCgpO1xyXG4gICAqIGNvbnNvbGUubG9nKGJhc2U2NCkgLy8gLT4gVUVzREJCUUFCZ0FJQUFBQUlRQ2o3N3MuLi5cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0KCk6IFByb21pc2U8QmFzZTY0U3RyaW5nPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8QmFzZTY0U3RyaW5nPihhc3luYyAocmVzLCByZWplY3QpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB4bWxPYmplY3Q6IEF0dGFjaG1lbnRYTUxPYmplY3QgPSBhd2FpdCBzdXBlci5wcm9jZXNzUmVxdWVzdCh7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnU3luZXJneU1haWxHZXRBdHRhY2htZW50JyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIFNtQXR0YWNobWVudEd1OiB0aGlzLmF0dGFjaG1lbnRHdSB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXMoeG1sT2JqZWN0LkF0dGFjaG1lbnRYTUxbMF0uQmFzZTY0Q29kZVswXSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBmaWxlRXh0ZW5zaW9uKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgcmV0dXJuICh0aGlzLl9uYW1lLm1hdGNoKC8oXFwuW14uXSspJC8pID8/IFtudWxsXSlbMF07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0IGF0dGFjaG1lbnRHdSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX2F0dGFjaG1lbnRHdTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgfVxyXG59XHJcbiJdfQ==