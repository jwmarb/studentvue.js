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
      return {
        document: {
          name: xmlObject.DocumentData[0]['@_DocFileName'][0],
          type: xmlObject.DocumentData[0]['@_DocType'][0]
        },
        name: xmlObject.DocumentData[0]['@_FileName'][0],
        base64: xmlObject.DocumentData[0].Base64Code[0]
      };
    }

    constructor(xmlObj, credentials) {
      super(credentials, xmlObj['@_DocumentGU'][0], 'GetReportCardDocumentData');
      /**
       * The date of the report card
       * @public
       * @readonly
       */

      this.date = new Date(xmlObj['@_EndDate'][0]);
      /**
       * The time period of the report card
       * @public
       * @readonly
       */

      this.periodName = xmlObj['@_ReportingPeriodName'][0];
    }

  }

  _exports.default = ReportCard;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL1JlcG9ydENhcmQvUmVwb3J0Q2FyZC50cyJdLCJuYW1lcyI6WyJSZXBvcnRDYXJkIiwiRmlsZSIsInBhcnNlWE1MT2JqZWN0IiwieG1sT2JqZWN0IiwiZG9jdW1lbnQiLCJuYW1lIiwiRG9jdW1lbnREYXRhIiwidHlwZSIsImJhc2U2NCIsIkJhc2U2NENvZGUiLCJjb25zdHJ1Y3RvciIsInhtbE9iaiIsImNyZWRlbnRpYWxzIiwiZGF0ZSIsIkRhdGUiLCJwZXJpb2ROYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxRQUFNQSxVQUFOLFNBQXlCQyxhQUF6QixDQUE4QztBQUtqREMsSUFBQUEsY0FBYyxDQUFDQyxTQUFELEVBQXVEO0FBQzdFLGFBQU87QUFDTEMsUUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFVBQUFBLElBQUksRUFBRUYsU0FBUyxDQUFDRyxZQUFWLENBQXVCLENBQXZCLEVBQTBCLGVBQTFCLEVBQTJDLENBQTNDLENBREU7QUFFUkMsVUFBQUEsSUFBSSxFQUFFSixTQUFTLENBQUNHLFlBQVYsQ0FBdUIsQ0FBdkIsRUFBMEIsV0FBMUIsRUFBdUMsQ0FBdkM7QUFGRSxTQURMO0FBS0xELFFBQUFBLElBQUksRUFBRUYsU0FBUyxDQUFDRyxZQUFWLENBQXVCLENBQXZCLEVBQTBCLFlBQTFCLEVBQXdDLENBQXhDLENBTEQ7QUFNTEUsUUFBQUEsTUFBTSxFQUFFTCxTQUFTLENBQUNHLFlBQVYsQ0FBdUIsQ0FBdkIsRUFBMEJHLFVBQTFCLENBQXFDLENBQXJDO0FBTkgsT0FBUDtBQVFEOztBQUNNQyxJQUFBQSxXQUFXLENBQ2hCQyxNQURnQixFQUVoQkMsV0FGZ0IsRUFHaEI7QUFDQSxZQUFNQSxXQUFOLEVBQW1CRCxNQUFNLENBQUMsY0FBRCxDQUFOLENBQXVCLENBQXZCLENBQW5CLEVBQThDLDJCQUE5QztBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBQ0ksV0FBS0UsSUFBTCxHQUFZLElBQUlDLElBQUosQ0FBU0gsTUFBTSxDQUFDLFdBQUQsQ0FBTixDQUFvQixDQUFwQixDQUFULENBQVo7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUNJLFdBQUtJLFVBQUwsR0FBa0JKLE1BQU0sQ0FBQyx1QkFBRCxDQUFOLENBQWdDLENBQWhDLENBQWxCO0FBQ0Q7O0FBaEMwRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBGaWxlIGZyb20gJy4uL0ZpbGUvRmlsZSc7XHJcbmltcG9ydCB7IFJlcG9ydENhcmRGaWxlIH0gZnJvbSAnLi9SZXBvcnRDYXJkLmludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBSZXBvcnRDYXJkQmFzZTY0WE1MT2JqZWN0LCBSZXBvcnRDYXJkc1hNTE9iamVjdCB9IGZyb20gJy4vUmVwb3J0Q2FyZC54bWwnO1xyXG5cclxuLyoqXHJcbiAqIFJlcG9ydENhcmQgY2xhc3NcclxuICogQGNsYXNzXHJcbiAqIEBleHRlbmRzIHtGaWxlPFJlcG9ydENhcmRGaWxlPn1cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcG9ydENhcmQgZXh0ZW5kcyBGaWxlPFJlcG9ydENhcmRGaWxlPiB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGRhdGU6IERhdGU7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBwZXJpb2ROYW1lOiBzdHJpbmc7XHJcblxyXG4gIHByb3RlY3RlZCBwYXJzZVhNTE9iamVjdCh4bWxPYmplY3Q6IFJlcG9ydENhcmRCYXNlNjRYTUxPYmplY3QpOiBSZXBvcnRDYXJkRmlsZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBkb2N1bWVudDoge1xyXG4gICAgICAgIG5hbWU6IHhtbE9iamVjdC5Eb2N1bWVudERhdGFbMF1bJ0BfRG9jRmlsZU5hbWUnXVswXSxcclxuICAgICAgICB0eXBlOiB4bWxPYmplY3QuRG9jdW1lbnREYXRhWzBdWydAX0RvY1R5cGUnXVswXSxcclxuICAgICAgfSxcclxuICAgICAgbmFtZTogeG1sT2JqZWN0LkRvY3VtZW50RGF0YVswXVsnQF9GaWxlTmFtZSddWzBdLFxyXG4gICAgICBiYXNlNjQ6IHhtbE9iamVjdC5Eb2N1bWVudERhdGFbMF0uQmFzZTY0Q29kZVswXSxcclxuICAgIH07XHJcbiAgfVxyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgIHhtbE9iajogUmVwb3J0Q2FyZHNYTUxPYmplY3RbJ1JDUmVwb3J0aW5nUGVyaW9kRGF0YSddWzBdWydSQ1JlcG9ydGluZ1BlcmlvZHMnXVswXVsnUkNSZXBvcnRpbmdQZXJpb2QnXVswXSxcclxuICAgIGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzXHJcbiAgKSB7XHJcbiAgICBzdXBlcihjcmVkZW50aWFscywgeG1sT2JqWydAX0RvY3VtZW50R1UnXVswXSwgJ0dldFJlcG9ydENhcmREb2N1bWVudERhdGEnKTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRhdGUgb2YgdGhlIHJlcG9ydCBjYXJkXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUoeG1sT2JqWydAX0VuZERhdGUnXVswXSk7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSB0aW1lIHBlcmlvZCBvZiB0aGUgcmVwb3J0IGNhcmRcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLnBlcmlvZE5hbWUgPSB4bWxPYmpbJ0BfUmVwb3J0aW5nUGVyaW9kTmFtZSddWzBdO1xyXG4gIH1cclxufVxyXG4iXX0=