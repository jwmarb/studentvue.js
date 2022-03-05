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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL1JlcG9ydENhcmQvUmVwb3J0Q2FyZC50cyJdLCJuYW1lcyI6WyJSZXBvcnRDYXJkIiwiRmlsZSIsInBhcnNlWE1MT2JqZWN0IiwieG1sT2JqZWN0IiwiZG9jdW1lbnQiLCJuYW1lIiwiRG9jdW1lbnREYXRhIiwidHlwZSIsImJhc2U2NCIsIkJhc2U2NENvZGUiLCJjb25zdHJ1Y3RvciIsInhtbE9iaiIsImNyZWRlbnRpYWxzIiwiZGF0ZSIsIkRhdGUiLCJwZXJpb2ROYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxRQUFNQSxVQUFOLFNBQXlCQyxhQUF6QixDQUE4QztBQUtqREMsSUFBQUEsY0FBYyxDQUFDQyxTQUFELEVBQXVEO0FBQzdFLGFBQU87QUFDTEMsUUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFVBQUFBLElBQUksRUFBRUYsU0FBUyxDQUFDRyxZQUFWLENBQXVCLENBQXZCLEVBQTBCLGVBQTFCLEVBQTJDLENBQTNDLENBREU7QUFFUkMsVUFBQUEsSUFBSSxFQUFFSixTQUFTLENBQUNHLFlBQVYsQ0FBdUIsQ0FBdkIsRUFBMEIsV0FBMUIsRUFBdUMsQ0FBdkM7QUFGRSxTQURMO0FBS0xELFFBQUFBLElBQUksRUFBRUYsU0FBUyxDQUFDRyxZQUFWLENBQXVCLENBQXZCLEVBQTBCLFlBQTFCLEVBQXdDLENBQXhDLENBTEQ7QUFNTEUsUUFBQUEsTUFBTSxFQUFFTCxTQUFTLENBQUNHLFlBQVYsQ0FBdUIsQ0FBdkIsRUFBMEJHLFVBQTFCLENBQXFDLENBQXJDO0FBTkgsT0FBUDtBQVFEOztBQUNNQyxJQUFBQSxXQUFXLENBQ2hCQyxNQURnQixFQUVoQkMsV0FGZ0IsRUFHaEI7QUFDQSxZQUFNQSxXQUFOLEVBQW1CRCxNQUFNLENBQUMsY0FBRCxDQUFOLENBQXVCLENBQXZCLENBQW5CLEVBQThDLDJCQUE5QztBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxXQUFLRSxJQUFMLEdBQVksSUFBSUMsSUFBSixDQUFTSCxNQUFNLENBQUMsV0FBRCxDQUFOLENBQW9CLENBQXBCLENBQVQsQ0FBWjtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxXQUFLSSxVQUFMLEdBQWtCSixNQUFNLENBQUMsdUJBQUQsQ0FBTixDQUFnQyxDQUFoQyxDQUFsQjtBQUNEOztBQWxDMEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgRmlsZSBmcm9tICcuLi9GaWxlL0ZpbGUnO1xyXG5pbXBvcnQgeyBSZXBvcnRDYXJkRmlsZSB9IGZyb20gJy4vUmVwb3J0Q2FyZC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgUmVwb3J0Q2FyZEJhc2U2NFhNTE9iamVjdCwgUmVwb3J0Q2FyZHNYTUxPYmplY3QgfSBmcm9tICcuL1JlcG9ydENhcmQueG1sJztcclxuXHJcbi8qKlxyXG4gKiBSZXBvcnRDYXJkIGNsYXNzXHJcbiAqIEBjbGFzc1xyXG4gKiBAZXh0ZW5kcyB7RmlsZTxSZXBvcnRDYXJkRmlsZT59XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXBvcnRDYXJkIGV4dGVuZHMgRmlsZTxSZXBvcnRDYXJkRmlsZT4ge1xyXG4gIHB1YmxpYyByZWFkb25seSBkYXRlOiBEYXRlO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgcGVyaW9kTmFtZTogc3RyaW5nO1xyXG5cclxuICBwcm90ZWN0ZWQgcGFyc2VYTUxPYmplY3QoeG1sT2JqZWN0OiBSZXBvcnRDYXJkQmFzZTY0WE1MT2JqZWN0KTogUmVwb3J0Q2FyZEZpbGUge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZG9jdW1lbnQ6IHtcclxuICAgICAgICBuYW1lOiB4bWxPYmplY3QuRG9jdW1lbnREYXRhWzBdWydAX0RvY0ZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgdHlwZTogeG1sT2JqZWN0LkRvY3VtZW50RGF0YVswXVsnQF9Eb2NUeXBlJ11bMF0sXHJcbiAgICAgIH0sXHJcbiAgICAgIG5hbWU6IHhtbE9iamVjdC5Eb2N1bWVudERhdGFbMF1bJ0BfRmlsZU5hbWUnXVswXSxcclxuICAgICAgYmFzZTY0OiB4bWxPYmplY3QuRG9jdW1lbnREYXRhWzBdLkJhc2U2NENvZGVbMF0sXHJcbiAgICB9O1xyXG4gIH1cclxuICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICB4bWxPYmo6IFJlcG9ydENhcmRzWE1MT2JqZWN0WydSQ1JlcG9ydGluZ1BlcmlvZERhdGEnXVswXVsnUkNSZXBvcnRpbmdQZXJpb2RzJ11bMF1bJ1JDUmVwb3J0aW5nUGVyaW9kJ11bMF0sXHJcbiAgICBjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFsc1xyXG4gICkge1xyXG4gICAgc3VwZXIoY3JlZGVudGlhbHMsIHhtbE9ialsnQF9Eb2N1bWVudEdVJ11bMF0sICdHZXRSZXBvcnRDYXJkRG9jdW1lbnREYXRhJyk7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkYXRlIG9mIHRoZSByZXBvcnQgY2FyZFxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKiBAdHlwZSB7RGF0ZX1cclxuICAgICAqL1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUoeG1sT2JqWydAX0VuZERhdGUnXVswXSk7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSB0aW1lIHBlcmlvZCBvZiB0aGUgcmVwb3J0IGNhcmRcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgdGhpcy5wZXJpb2ROYW1lID0geG1sT2JqWydAX1JlcG9ydGluZ1BlcmlvZE5hbWUnXVswXTtcclxuICB9XHJcbn1cclxuIl19