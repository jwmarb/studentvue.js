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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL1JlcG9ydENhcmQvUmVwb3J0Q2FyZC50cyJdLCJuYW1lcyI6WyJSZXBvcnRDYXJkIiwiRmlsZSIsInBhcnNlWE1MT2JqZWN0IiwieG1sT2JqZWN0IiwiZG9jdW1lbnQiLCJuYW1lIiwiRG9jdW1lbnREYXRhIiwidHlwZSIsImJhc2U2NCIsIkJhc2U2NENvZGUiLCJjb25zdHJ1Y3RvciIsInhtbE9iaiIsImNyZWRlbnRpYWxzIiwiZGF0ZSIsIkRhdGUiLCJwZXJpb2ROYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxRQUFNQSxVQUFOLFNBQXlCQyxhQUF6QixDQUE4QztBQUtqREMsSUFBQUEsY0FBYyxDQUFDQyxTQUFELEVBQXVEO0FBQzdFLGFBQU87QUFDTEMsUUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFVBQUFBLElBQUksRUFBRUYsU0FBUyxDQUFDRyxZQUFWLENBQXVCLENBQXZCLEVBQTBCLGVBQTFCLEVBQTJDLENBQTNDLENBREU7QUFFUkMsVUFBQUEsSUFBSSxFQUFFSixTQUFTLENBQUNHLFlBQVYsQ0FBdUIsQ0FBdkIsRUFBMEIsV0FBMUIsRUFBdUMsQ0FBdkM7QUFGRSxTQURMO0FBS0xELFFBQUFBLElBQUksRUFBRUYsU0FBUyxDQUFDRyxZQUFWLENBQXVCLENBQXZCLEVBQTBCLFlBQTFCLEVBQXdDLENBQXhDLENBTEQ7QUFNTEUsUUFBQUEsTUFBTSxFQUFFTCxTQUFTLENBQUNHLFlBQVYsQ0FBdUIsQ0FBdkIsRUFBMEJHLFVBQTFCLENBQXFDLENBQXJDO0FBTkgsT0FBUDtBQVFEOztBQUNNQyxJQUFBQSxXQUFXLENBQ2hCQyxNQURnQixFQUVoQkMsV0FGZ0IsRUFHaEI7QUFDQSxZQUFNQSxXQUFOLEVBQW1CRCxNQUFNLENBQUMsY0FBRCxDQUFOLENBQXVCLENBQXZCLENBQW5CLEVBQThDLDJCQUE5QztBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxXQUFLRSxJQUFMLEdBQVksSUFBSUMsSUFBSixDQUFTSCxNQUFNLENBQUMsV0FBRCxDQUFOLENBQW9CLENBQXBCLENBQVQsQ0FBWjtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxXQUFLSSxVQUFMLEdBQWtCSixNQUFNLENBQUMsdUJBQUQsQ0FBTixDQUFnQyxDQUFoQyxDQUFsQjtBQUNEOztBQWxDMEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xuaW1wb3J0IEZpbGUgZnJvbSAnLi4vRmlsZS9GaWxlJztcbmltcG9ydCB7IFJlcG9ydENhcmRGaWxlIH0gZnJvbSAnLi9SZXBvcnRDYXJkLmludGVyZmFjZXMnO1xuaW1wb3J0IHsgUmVwb3J0Q2FyZEJhc2U2NFhNTE9iamVjdCwgUmVwb3J0Q2FyZHNYTUxPYmplY3QgfSBmcm9tICcuL1JlcG9ydENhcmQueG1sJztcblxuLyoqXG4gKiBSZXBvcnRDYXJkIGNsYXNzXG4gKiBAY2xhc3NcbiAqIEBleHRlbmRzIHtGaWxlPFJlcG9ydENhcmRGaWxlPn1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVwb3J0Q2FyZCBleHRlbmRzIEZpbGU8UmVwb3J0Q2FyZEZpbGU+IHtcbiAgcHVibGljIHJlYWRvbmx5IGRhdGU6IERhdGU7XG5cbiAgcHVibGljIHJlYWRvbmx5IHBlcmlvZE5hbWU6IHN0cmluZztcblxuICBwcm90ZWN0ZWQgcGFyc2VYTUxPYmplY3QoeG1sT2JqZWN0OiBSZXBvcnRDYXJkQmFzZTY0WE1MT2JqZWN0KTogUmVwb3J0Q2FyZEZpbGUge1xuICAgIHJldHVybiB7XG4gICAgICBkb2N1bWVudDoge1xuICAgICAgICBuYW1lOiB4bWxPYmplY3QuRG9jdW1lbnREYXRhWzBdWydAX0RvY0ZpbGVOYW1lJ11bMF0sXG4gICAgICAgIHR5cGU6IHhtbE9iamVjdC5Eb2N1bWVudERhdGFbMF1bJ0BfRG9jVHlwZSddWzBdLFxuICAgICAgfSxcbiAgICAgIG5hbWU6IHhtbE9iamVjdC5Eb2N1bWVudERhdGFbMF1bJ0BfRmlsZU5hbWUnXVswXSxcbiAgICAgIGJhc2U2NDogeG1sT2JqZWN0LkRvY3VtZW50RGF0YVswXS5CYXNlNjRDb2RlWzBdLFxuICAgIH07XG4gIH1cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHhtbE9iajogUmVwb3J0Q2FyZHNYTUxPYmplY3RbJ1JDUmVwb3J0aW5nUGVyaW9kRGF0YSddWzBdWydSQ1JlcG9ydGluZ1BlcmlvZHMnXVswXVsnUkNSZXBvcnRpbmdQZXJpb2QnXVswXSxcbiAgICBjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFsc1xuICApIHtcbiAgICBzdXBlcihjcmVkZW50aWFscywgeG1sT2JqWydAX0RvY3VtZW50R1UnXVswXSwgJ0dldFJlcG9ydENhcmREb2N1bWVudERhdGEnKTtcbiAgICAvKipcbiAgICAgKiBUaGUgZGF0ZSBvZiB0aGUgcmVwb3J0IGNhcmRcbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge0RhdGV9XG4gICAgICovXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUoeG1sT2JqWydAX0VuZERhdGUnXVswXSk7XG4gICAgLyoqXG4gICAgICogVGhlIHRpbWUgcGVyaW9kIG9mIHRoZSByZXBvcnQgY2FyZFxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kTmFtZSA9IHhtbE9ialsnQF9SZXBvcnRpbmdQZXJpb2ROYW1lJ11bMF07XG4gIH1cbn1cbiJdfQ==