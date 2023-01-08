(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../File/File"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../File/File"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.File);
    global.ReportCard = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _File) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _File = _interopRequireDefault(_File);
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  /**
   * ReportCard class
   * @class
   * @extends {File<ReportCardFile>}
   */
  class ReportCard extends _File.default {
    parseXMLObject(xmlObject) {
      if ('DocumentData' in xmlObject) {
        return {
          document: {
            name: xmlObject.DocumentData[0]['@_DocFileName'][0],
            type: xmlObject.DocumentData[0]['@_DocType'][0]
          },
          name: xmlObject.DocumentData[0]['@_FileName'][0],
          base64: xmlObject.DocumentData[0].Base64Code[0]
        };
      }
      return undefined;
    }
    constructor(xmlObj, credentials) {
      super(credentials, xmlObj['@_DocumentGU'][0], 'GetReportCardDocumentData');
      /**
       * The date of the report card
       * @public
       * @readonly
       * @type {Date}
       */
      this.date = new Date(xmlObj['@_EndDate'][0]);
      /**
       * The time period of the report card
       * @public
       * @readonly
       * @type {string}
       */
      this.periodName = xmlObj['@_ReportingPeriodName'][0];
    }
  }
  _exports.default = ReportCard;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZXBvcnRDYXJkIiwiRmlsZSIsInBhcnNlWE1MT2JqZWN0IiwieG1sT2JqZWN0IiwiZG9jdW1lbnQiLCJuYW1lIiwiRG9jdW1lbnREYXRhIiwidHlwZSIsImJhc2U2NCIsIkJhc2U2NENvZGUiLCJ1bmRlZmluZWQiLCJjb25zdHJ1Y3RvciIsInhtbE9iaiIsImNyZWRlbnRpYWxzIiwiZGF0ZSIsIkRhdGUiLCJwZXJpb2ROYW1lIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL1N0dWRlbnRWdWUvUmVwb3J0Q2FyZC9SZXBvcnRDYXJkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBGaWxlIGZyb20gJy4uL0ZpbGUvRmlsZSc7XHJcbmltcG9ydCB7IFJlcG9ydENhcmRGaWxlIH0gZnJvbSAnLi9SZXBvcnRDYXJkLmludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBSZXBvcnRDYXJkQmFzZTY0WE1MT2JqZWN0LCBSZXBvcnRDYXJkc1hNTE9iamVjdCB9IGZyb20gJy4vUmVwb3J0Q2FyZC54bWwnO1xyXG5cclxuLyoqXHJcbiAqIFJlcG9ydENhcmQgY2xhc3NcclxuICogQGNsYXNzXHJcbiAqIEBleHRlbmRzIHtGaWxlPFJlcG9ydENhcmRGaWxlPn1cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcG9ydENhcmQgZXh0ZW5kcyBGaWxlPFJlcG9ydENhcmRGaWxlIHwgdW5kZWZpbmVkPiB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGRhdGU6IERhdGU7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBwZXJpb2ROYW1lOiBzdHJpbmc7XHJcblxyXG4gIHByb3RlY3RlZCBwYXJzZVhNTE9iamVjdCh4bWxPYmplY3Q6IFJlcG9ydENhcmRCYXNlNjRYTUxPYmplY3QpOiBSZXBvcnRDYXJkRmlsZSB8IHVuZGVmaW5lZCB7XHJcbiAgICBpZiAoJ0RvY3VtZW50RGF0YScgaW4geG1sT2JqZWN0KVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRvY3VtZW50OiB7XHJcbiAgICAgICAgICBuYW1lOiB4bWxPYmplY3QuRG9jdW1lbnREYXRhWzBdWydAX0RvY0ZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICB0eXBlOiB4bWxPYmplY3QuRG9jdW1lbnREYXRhWzBdWydAX0RvY1R5cGUnXVswXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIG5hbWU6IHhtbE9iamVjdC5Eb2N1bWVudERhdGFbMF1bJ0BfRmlsZU5hbWUnXVswXSxcclxuICAgICAgICBiYXNlNjQ6IHhtbE9iamVjdC5Eb2N1bWVudERhdGFbMF0uQmFzZTY0Q29kZVswXSxcclxuICAgICAgfTtcclxuICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgfVxyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgIHhtbE9iajogUmVwb3J0Q2FyZHNYTUxPYmplY3RbJ1JDUmVwb3J0aW5nUGVyaW9kRGF0YSddWzBdWydSQ1JlcG9ydGluZ1BlcmlvZHMnXVswXVsnUkNSZXBvcnRpbmdQZXJpb2QnXVswXSxcclxuICAgIGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzXHJcbiAgKSB7XHJcbiAgICBzdXBlcihjcmVkZW50aWFscywgeG1sT2JqWydAX0RvY3VtZW50R1UnXVswXSwgJ0dldFJlcG9ydENhcmREb2N1bWVudERhdGEnKTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRhdGUgb2YgdGhlIHJlcG9ydCBjYXJkXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqIEB0eXBlIHtEYXRlfVxyXG4gICAgICovXHJcbiAgICB0aGlzLmRhdGUgPSBuZXcgRGF0ZSh4bWxPYmpbJ0BfRW5kRGF0ZSddWzBdKTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIHRpbWUgcGVyaW9kIG9mIHRoZSByZXBvcnQgY2FyZFxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICB0aGlzLnBlcmlvZE5hbWUgPSB4bWxPYmpbJ0BfUmVwb3J0aW5nUGVyaW9kTmFtZSddWzBdO1xyXG4gIH1cclxufVxyXG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDZSxNQUFNQSxVQUFVLFNBQVNDLGFBQUksQ0FBNkI7SUFLN0RDLGNBQWMsQ0FBQ0MsU0FBb0MsRUFBOEI7TUFDekYsSUFBSSxjQUFjLElBQUlBLFNBQVM7UUFDN0IsT0FBTztVQUNMQyxRQUFRLEVBQUU7WUFDUkMsSUFBSSxFQUFFRixTQUFTLENBQUNHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkRDLElBQUksRUFBRUosU0FBUyxDQUFDRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztVQUNoRCxDQUFDO1VBQ0RELElBQUksRUFBRUYsU0FBUyxDQUFDRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1VBQ2hERSxNQUFNLEVBQUVMLFNBQVMsQ0FBQ0csWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDRyxVQUFVLENBQUMsQ0FBQztRQUNoRCxDQUFDO01BQUM7TUFDSixPQUFPQyxTQUFTO0lBQ2xCO0lBQ09DLFdBQVcsQ0FDaEJDLE1BQXlHLEVBQ3pHQyxXQUE2QixFQUM3QjtNQUNBLEtBQUssQ0FBQ0EsV0FBVyxFQUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsMkJBQTJCLENBQUM7TUFDMUU7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ0ksSUFBSSxDQUFDRSxJQUFJLEdBQUcsSUFBSUMsSUFBSSxDQUFDSCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUM7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ0ksSUFBSSxDQUFDSSxVQUFVLEdBQUdKLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RDtFQUNGO0VBQUM7QUFBQSJ9