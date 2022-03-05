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
    /**
     * The date of the report card
     * @public
     * @readonly
     */

    /**
     * The time period of the report card
     * @public
     * @readonly
     */
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
      this.date = new Date(xmlObj['@_EndDate'][0]);
      this.periodName = xmlObj['@_ReportingPeriodName'][0];
    }

  }

  _exports.default = ReportCard;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL1JlcG9ydENhcmQvUmVwb3J0Q2FyZC50cyJdLCJuYW1lcyI6WyJSZXBvcnRDYXJkIiwiRmlsZSIsInBhcnNlWE1MT2JqZWN0IiwieG1sT2JqZWN0IiwiZG9jdW1lbnQiLCJuYW1lIiwiRG9jdW1lbnREYXRhIiwidHlwZSIsImJhc2U2NCIsIkJhc2U2NENvZGUiLCJjb25zdHJ1Y3RvciIsInhtbE9iaiIsImNyZWRlbnRpYWxzIiwiZGF0ZSIsIkRhdGUiLCJwZXJpb2ROYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxRQUFNQSxVQUFOLFNBQXlCQyxhQUF6QixDQUE4QztBQUMzRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUdFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFHWUMsSUFBQUEsY0FBYyxDQUFDQyxTQUFELEVBQXVEO0FBQzdFLGFBQU87QUFDTEMsUUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFVBQUFBLElBQUksRUFBRUYsU0FBUyxDQUFDRyxZQUFWLENBQXVCLENBQXZCLEVBQTBCLGVBQTFCLEVBQTJDLENBQTNDLENBREU7QUFFUkMsVUFBQUEsSUFBSSxFQUFFSixTQUFTLENBQUNHLFlBQVYsQ0FBdUIsQ0FBdkIsRUFBMEIsV0FBMUIsRUFBdUMsQ0FBdkM7QUFGRSxTQURMO0FBS0xELFFBQUFBLElBQUksRUFBRUYsU0FBUyxDQUFDRyxZQUFWLENBQXVCLENBQXZCLEVBQTBCLFlBQTFCLEVBQXdDLENBQXhDLENBTEQ7QUFNTEUsUUFBQUEsTUFBTSxFQUFFTCxTQUFTLENBQUNHLFlBQVYsQ0FBdUIsQ0FBdkIsRUFBMEJHLFVBQTFCLENBQXFDLENBQXJDO0FBTkgsT0FBUDtBQVFEOztBQUNNQyxJQUFBQSxXQUFXLENBQ2hCQyxNQURnQixFQUVoQkMsV0FGZ0IsRUFHaEI7QUFDQSxZQUFNQSxXQUFOLEVBQW1CRCxNQUFNLENBQUMsY0FBRCxDQUFOLENBQXVCLENBQXZCLENBQW5CLEVBQThDLDJCQUE5QztBQUNBLFdBQUtFLElBQUwsR0FBWSxJQUFJQyxJQUFKLENBQVNILE1BQU0sQ0FBQyxXQUFELENBQU4sQ0FBb0IsQ0FBcEIsQ0FBVCxDQUFaO0FBQ0EsV0FBS0ksVUFBTCxHQUFrQkosTUFBTSxDQUFDLHVCQUFELENBQU4sQ0FBZ0MsQ0FBaEMsQ0FBbEI7QUFDRDs7QUFoQzBEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscyB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IEZpbGUgZnJvbSAnLi4vRmlsZS9GaWxlJztcclxuaW1wb3J0IHsgUmVwb3J0Q2FyZEZpbGUgfSBmcm9tICcuL1JlcG9ydENhcmQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFJlcG9ydENhcmRCYXNlNjRYTUxPYmplY3QsIFJlcG9ydENhcmRzWE1MT2JqZWN0IH0gZnJvbSAnLi9SZXBvcnRDYXJkLnhtbCc7XHJcblxyXG4vKipcclxuICogUmVwb3J0Q2FyZCBjbGFzc1xyXG4gKiBAY2xhc3NcclxuICogQGV4dGVuZHMge0ZpbGU8UmVwb3J0Q2FyZEZpbGU+fVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVwb3J0Q2FyZCBleHRlbmRzIEZpbGU8UmVwb3J0Q2FyZEZpbGU+IHtcclxuICAvKipcclxuICAgKiBUaGUgZGF0ZSBvZiB0aGUgcmVwb3J0IGNhcmRcclxuICAgKiBAcHVibGljXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICovXHJcbiAgcHVibGljIHJlYWRvbmx5IGRhdGU6IERhdGU7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSB0aW1lIHBlcmlvZCBvZiB0aGUgcmVwb3J0IGNhcmRcclxuICAgKiBAcHVibGljXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICovXHJcbiAgcHVibGljIHJlYWRvbmx5IHBlcmlvZE5hbWU6IHN0cmluZztcclxuXHJcbiAgcHJvdGVjdGVkIHBhcnNlWE1MT2JqZWN0KHhtbE9iamVjdDogUmVwb3J0Q2FyZEJhc2U2NFhNTE9iamVjdCk6IFJlcG9ydENhcmRGaWxlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRvY3VtZW50OiB7XHJcbiAgICAgICAgbmFtZTogeG1sT2JqZWN0LkRvY3VtZW50RGF0YVswXVsnQF9Eb2NGaWxlTmFtZSddWzBdLFxyXG4gICAgICAgIHR5cGU6IHhtbE9iamVjdC5Eb2N1bWVudERhdGFbMF1bJ0BfRG9jVHlwZSddWzBdLFxyXG4gICAgICB9LFxyXG4gICAgICBuYW1lOiB4bWxPYmplY3QuRG9jdW1lbnREYXRhWzBdWydAX0ZpbGVOYW1lJ11bMF0sXHJcbiAgICAgIGJhc2U2NDogeG1sT2JqZWN0LkRvY3VtZW50RGF0YVswXS5CYXNlNjRDb2RlWzBdLFxyXG4gICAgfTtcclxuICB9XHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgeG1sT2JqOiBSZXBvcnRDYXJkc1hNTE9iamVjdFsnUkNSZXBvcnRpbmdQZXJpb2REYXRhJ11bMF1bJ1JDUmVwb3J0aW5nUGVyaW9kcyddWzBdWydSQ1JlcG9ydGluZ1BlcmlvZCddWzBdLFxyXG4gICAgY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHNcclxuICApIHtcclxuICAgIHN1cGVyKGNyZWRlbnRpYWxzLCB4bWxPYmpbJ0BfRG9jdW1lbnRHVSddWzBdLCAnR2V0UmVwb3J0Q2FyZERvY3VtZW50RGF0YScpO1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUoeG1sT2JqWydAX0VuZERhdGUnXVswXSk7XHJcbiAgICB0aGlzLnBlcmlvZE5hbWUgPSB4bWxPYmpbJ0BfUmVwb3J0aW5nUGVyaW9kTmFtZSddWzBdO1xyXG4gIH1cclxufVxyXG4iXX0=