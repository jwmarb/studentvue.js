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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBdHRhY2htZW50Iiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwibmFtZSIsImF0dGFjaG1lbnRHdSIsInNlc3Npb24iLCJmaWxlRXh0ZW5zaW9uIiwibWF0Y2giLCJnZXQiLCJQcm9taXNlIiwicmVzIiwicmVqZWN0IiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwiU21BdHRhY2htZW50R3UiLCJ0aGVuIiwieG1sT2JqZWN0IiwiQXR0YWNobWVudFhNTCIsIkJhc2U2NENvZGUiLCJjYXRjaCJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0F0dGFjaG1lbnQvQXR0YWNobWVudC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlNjRTdHJpbmcgfSBmcm9tICcuLi8uLi91dGlscy90eXBlcyc7XG5pbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xuaW1wb3J0IHNvYXAgZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9zb2FwJztcbmltcG9ydCB7IEF0dGFjaG1lbnRYTUxPYmplY3QgfSBmcm9tICcuL0F0dGFjaG1lbnQueG1sJztcblxuLyoqXG4gKiBBdHRhY2htZW50IGNsYXNzXG4gKiBUaGlzIGlzIGEgY2xhc3MgdXNlZCB0byBkZWZpbmUgbWVzc2FnZSBhdHRhY2htZW50c1xuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF0dGFjaG1lbnQgZXh0ZW5kcyBzb2FwLkNsaWVudCB7XG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGF0dGFjaG1lbnRHdTogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBmaWxlRXh0ZW5zaW9uOiBzdHJpbmcgfCBudWxsO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGF0dGFjaG1lbnRHdTogc3RyaW5nLCBzZXNzaW9uOiBMb2dpbkNyZWRlbnRpYWxzKSB7XG4gICAgc3VwZXIoc2Vzc2lvbik7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYXR0YWNobWVudC5cbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXG4gICAgLyoqXG4gICAgICogdGhlIEdVIG9mIHRoZSBhdHRhY2htZW50LlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuYXR0YWNobWVudEd1ID0gYXR0YWNobWVudEd1O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGZpbGUgZXh0ZW5zaW9uIG9mIHRoZSBhdHRhY2htZW50IGV4dHJhY3RlZCB1c2luZyByZWdleFxuICAgICAqIEB0eXBlIHtzdHJpbmcgfCBudWxsfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmZpbGVFeHRlbnNpb24gPSAobmFtZS5tYXRjaCgvKFxcLlteLl0rKSQvKSA/PyBbbnVsbF0pWzBdO1xuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoZXMgdGhlIGF0dGFjaG1lbnQgZnJvbSBzeW5lcmd5IHNlcnZlcnMuXG4gICAqIFVuZm9ydHVuYXRlbHksIHRoZSBhcGkgZG9lcyBub3Qgb2ZmZXIgYSBVUkwgcGF0aCB0byB0aGUgZmlsZVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBiYXNlNjQgc3RyaW5nXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBjb25zdCBiYXNlNjQgPSBhd2FpdCBzb21lQXR0YWNobWVudC5nZXQoKTtcbiAgICogY29uc29sZS5sb2coYmFzZTY0KSAvLyAtPiBVRXNEQkJRQUJnQUlBQUFBSVFDajc3cy4uLlxuICAgKiBgYGBcbiAgICovXG4gIHB1YmxpYyBnZXQoKTogUHJvbWlzZTxCYXNlNjRTdHJpbmc+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8QmFzZTY0U3RyaW5nPigocmVzLCByZWplY3QpID0+IHtcbiAgICAgIHN1cGVyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxBdHRhY2htZW50WE1MT2JqZWN0Pih7XG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N5bmVyZ3lNYWlsR2V0QXR0YWNobWVudCcsXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgU21BdHRhY2htZW50R3U6IHRoaXMuYXR0YWNobWVudEd1IH0sXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcbiAgICAgICAgICByZXMoeG1sT2JqZWN0LkF0dGFjaG1lbnRYTUxbMF0uQmFzZTY0Q29kZVswXSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgIH0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNlLE1BQU1BLFVBQVUsU0FBU0MsYUFBSSxDQUFDQyxNQUFNLENBQUM7SUFPM0NDLFdBQVcsQ0FBQ0MsSUFBWSxFQUFFQyxZQUFvQixFQUFFQyxPQUF5QixFQUFFO01BQ2hGLEtBQUssQ0FBQ0EsT0FBTyxDQUFDOztNQUVkO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUNJLElBQUksQ0FBQ0YsSUFBSSxHQUFHQSxJQUFJOztNQUVoQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDSSxJQUFJLENBQUNDLFlBQVksR0FBR0EsWUFBWTs7TUFFaEM7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ0ksSUFBSSxDQUFDRSxhQUFhLEdBQUcsQ0FBQ0gsSUFBSSxDQUFDSSxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDOUQ7O0lBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNTQyxHQUFHLEdBQTBCO01BQ2xDLE9BQU8sSUFBSUMsT0FBTyxDQUFlLENBQUNDLEdBQUcsRUFBRUMsTUFBTSxLQUFLO1FBQ2hELEtBQUssQ0FDRkMsY0FBYyxDQUFzQjtVQUNuQ0MsVUFBVSxFQUFFLDBCQUEwQjtVQUN0Q0MsUUFBUSxFQUFFO1lBQUVDLFVBQVUsRUFBRSxDQUFDO1lBQUVDLGNBQWMsRUFBRSxJQUFJLENBQUNaO1VBQWE7UUFDL0QsQ0FBQyxDQUFDLENBQ0RhLElBQUksQ0FBRUMsU0FBUyxJQUFLO1VBQ25CUixHQUFHLENBQUNRLFNBQVMsQ0FBQ0MsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQ0RDLEtBQUssQ0FBQ1YsTUFBTSxDQUFDO01BQ2xCLENBQUMsQ0FBQztJQUNKO0VBQ0Y7RUFBQztBQUFBIn0=