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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZXBvcnRDYXJkIiwiRmlsZSIsInBhcnNlWE1MT2JqZWN0IiwieG1sT2JqZWN0IiwiZG9jdW1lbnQiLCJuYW1lIiwiRG9jdW1lbnREYXRhIiwidHlwZSIsImJhc2U2NCIsIkJhc2U2NENvZGUiLCJ1bmRlZmluZWQiLCJjb25zdHJ1Y3RvciIsInhtbE9iaiIsImNyZWRlbnRpYWxzIiwiZGF0ZSIsIkRhdGUiLCJwZXJpb2ROYW1lIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL1N0dWRlbnRWdWUvUmVwb3J0Q2FyZC9SZXBvcnRDYXJkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XG5pbXBvcnQgRmlsZSBmcm9tICcuLi9GaWxlL0ZpbGUnO1xuaW1wb3J0IHsgUmVwb3J0Q2FyZEZpbGUgfSBmcm9tICcuL1JlcG9ydENhcmQuaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBSZXBvcnRDYXJkQmFzZTY0WE1MT2JqZWN0LCBSZXBvcnRDYXJkc1hNTE9iamVjdCB9IGZyb20gJy4vUmVwb3J0Q2FyZC54bWwnO1xuXG4vKipcbiAqIFJlcG9ydENhcmQgY2xhc3NcbiAqIEBjbGFzc1xuICogQGV4dGVuZHMge0ZpbGU8UmVwb3J0Q2FyZEZpbGU+fVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXBvcnRDYXJkIGV4dGVuZHMgRmlsZTxSZXBvcnRDYXJkRmlsZSB8IHVuZGVmaW5lZD4ge1xuICBwdWJsaWMgcmVhZG9ubHkgZGF0ZTogRGF0ZTtcblxuICBwdWJsaWMgcmVhZG9ubHkgcGVyaW9kTmFtZTogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBwYXJzZVhNTE9iamVjdCh4bWxPYmplY3Q6IFJlcG9ydENhcmRCYXNlNjRYTUxPYmplY3QpOiBSZXBvcnRDYXJkRmlsZSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCdEb2N1bWVudERhdGEnIGluIHhtbE9iamVjdClcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRvY3VtZW50OiB7XG4gICAgICAgICAgbmFtZTogeG1sT2JqZWN0LkRvY3VtZW50RGF0YVswXVsnQF9Eb2NGaWxlTmFtZSddWzBdLFxuICAgICAgICAgIHR5cGU6IHhtbE9iamVjdC5Eb2N1bWVudERhdGFbMF1bJ0BfRG9jVHlwZSddWzBdLFxuICAgICAgICB9LFxuICAgICAgICBuYW1lOiB4bWxPYmplY3QuRG9jdW1lbnREYXRhWzBdWydAX0ZpbGVOYW1lJ11bMF0sXG4gICAgICAgIGJhc2U2NDogeG1sT2JqZWN0LkRvY3VtZW50RGF0YVswXS5CYXNlNjRDb2RlWzBdLFxuICAgICAgfTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICB4bWxPYmo6IFJlcG9ydENhcmRzWE1MT2JqZWN0WydSQ1JlcG9ydGluZ1BlcmlvZERhdGEnXVswXVsnUkNSZXBvcnRpbmdQZXJpb2RzJ11bMF1bJ1JDUmVwb3J0aW5nUGVyaW9kJ11bMF0sXG4gICAgY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHNcbiAgKSB7XG4gICAgc3VwZXIoY3JlZGVudGlhbHMsIHhtbE9ialsnQF9Eb2N1bWVudEdVJ11bMF0sICdHZXRSZXBvcnRDYXJkRG9jdW1lbnREYXRhJyk7XG4gICAgLyoqXG4gICAgICogVGhlIGRhdGUgb2YgdGhlIHJlcG9ydCBjYXJkXG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtEYXRlfVxuICAgICAqL1xuICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKHhtbE9ialsnQF9FbmREYXRlJ11bMF0pO1xuICAgIC8qKlxuICAgICAqIFRoZSB0aW1lIHBlcmlvZCBvZiB0aGUgcmVwb3J0IGNhcmRcbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLnBlcmlvZE5hbWUgPSB4bWxPYmpbJ0BfUmVwb3J0aW5nUGVyaW9kTmFtZSddWzBdO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDZSxNQUFNQSxVQUFVLFNBQVNDLGFBQUksQ0FBNkI7SUFLN0RDLGNBQWMsQ0FBQ0MsU0FBb0MsRUFBOEI7TUFDekYsSUFBSSxjQUFjLElBQUlBLFNBQVM7UUFDN0IsT0FBTztVQUNMQyxRQUFRLEVBQUU7WUFDUkMsSUFBSSxFQUFFRixTQUFTLENBQUNHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkRDLElBQUksRUFBRUosU0FBUyxDQUFDRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztVQUNoRCxDQUFDO1VBQ0RELElBQUksRUFBRUYsU0FBUyxDQUFDRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1VBQ2hERSxNQUFNLEVBQUVMLFNBQVMsQ0FBQ0csWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDRyxVQUFVLENBQUMsQ0FBQztRQUNoRCxDQUFDO01BQUM7TUFDSixPQUFPQyxTQUFTO0lBQ2xCO0lBQ09DLFdBQVcsQ0FDaEJDLE1BQXlHLEVBQ3pHQyxXQUE2QixFQUM3QjtNQUNBLEtBQUssQ0FBQ0EsV0FBVyxFQUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsMkJBQTJCLENBQUM7TUFDMUU7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ0ksSUFBSSxDQUFDRSxJQUFJLEdBQUcsSUFBSUMsSUFBSSxDQUFDSCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUM7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ0ksSUFBSSxDQUFDSSxVQUFVLEdBQUdKLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RDtFQUNGO0VBQUM7QUFBQSJ9