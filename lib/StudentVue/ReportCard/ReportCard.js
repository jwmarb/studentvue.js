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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL1JlcG9ydENhcmQvUmVwb3J0Q2FyZC50cyJdLCJuYW1lcyI6WyJSZXBvcnRDYXJkIiwiRmlsZSIsInBhcnNlWE1MT2JqZWN0IiwieG1sT2JqZWN0IiwiZG9jdW1lbnQiLCJuYW1lIiwiRG9jdW1lbnREYXRhIiwidHlwZSIsImJhc2U2NCIsIkJhc2U2NENvZGUiLCJ1bmRlZmluZWQiLCJjb25zdHJ1Y3RvciIsInhtbE9iaiIsImNyZWRlbnRpYWxzIiwiZGF0ZSIsIkRhdGUiLCJwZXJpb2ROYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxRQUFNQSxVQUFOLFNBQXlCQyxhQUF6QixDQUEwRDtBQUs3REMsSUFBQUEsY0FBYyxDQUFDQyxTQUFELEVBQW1FO0FBQ3pGLFVBQUksa0JBQWtCQSxTQUF0QjtBQUNFLGVBQU87QUFDTEMsVUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFlBQUFBLElBQUksRUFBRUYsU0FBUyxDQUFDRyxZQUFWLENBQXVCLENBQXZCLEVBQTBCLGVBQTFCLEVBQTJDLENBQTNDLENBREU7QUFFUkMsWUFBQUEsSUFBSSxFQUFFSixTQUFTLENBQUNHLFlBQVYsQ0FBdUIsQ0FBdkIsRUFBMEIsV0FBMUIsRUFBdUMsQ0FBdkM7QUFGRSxXQURMO0FBS0xELFVBQUFBLElBQUksRUFBRUYsU0FBUyxDQUFDRyxZQUFWLENBQXVCLENBQXZCLEVBQTBCLFlBQTFCLEVBQXdDLENBQXhDLENBTEQ7QUFNTEUsVUFBQUEsTUFBTSxFQUFFTCxTQUFTLENBQUNHLFlBQVYsQ0FBdUIsQ0FBdkIsRUFBMEJHLFVBQTFCLENBQXFDLENBQXJDO0FBTkgsU0FBUDtBQURGOztBQVNBLGFBQU9DLFNBQVA7QUFDRDs7QUFDTUMsSUFBQUEsV0FBVyxDQUNoQkMsTUFEZ0IsRUFFaEJDLFdBRmdCLEVBR2hCO0FBQ0EsWUFBTUEsV0FBTixFQUFtQkQsTUFBTSxDQUFDLGNBQUQsQ0FBTixDQUF1QixDQUF2QixDQUFuQixFQUE4QywyQkFBOUM7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0ksV0FBS0UsSUFBTCxHQUFZLElBQUlDLElBQUosQ0FBU0gsTUFBTSxDQUFDLFdBQUQsQ0FBTixDQUFvQixDQUFwQixDQUFULENBQVo7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0ksV0FBS0ksVUFBTCxHQUFrQkosTUFBTSxDQUFDLHVCQUFELENBQU4sQ0FBZ0MsQ0FBaEMsQ0FBbEI7QUFDRDs7QUFwQ3NFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscyB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IEZpbGUgZnJvbSAnLi4vRmlsZS9GaWxlJztcclxuaW1wb3J0IHsgUmVwb3J0Q2FyZEZpbGUgfSBmcm9tICcuL1JlcG9ydENhcmQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFJlcG9ydENhcmRCYXNlNjRYTUxPYmplY3QsIFJlcG9ydENhcmRzWE1MT2JqZWN0IH0gZnJvbSAnLi9SZXBvcnRDYXJkLnhtbCc7XHJcblxyXG4vKipcclxuICogUmVwb3J0Q2FyZCBjbGFzc1xyXG4gKiBAY2xhc3NcclxuICogQGV4dGVuZHMge0ZpbGU8UmVwb3J0Q2FyZEZpbGU+fVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVwb3J0Q2FyZCBleHRlbmRzIEZpbGU8UmVwb3J0Q2FyZEZpbGUgfCB1bmRlZmluZWQ+IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgZGF0ZTogRGF0ZTtcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IHBlcmlvZE5hbWU6IHN0cmluZztcclxuXHJcbiAgcHJvdGVjdGVkIHBhcnNlWE1MT2JqZWN0KHhtbE9iamVjdDogUmVwb3J0Q2FyZEJhc2U2NFhNTE9iamVjdCk6IFJlcG9ydENhcmRGaWxlIHwgdW5kZWZpbmVkIHtcclxuICAgIGlmICgnRG9jdW1lbnREYXRhJyBpbiB4bWxPYmplY3QpXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZG9jdW1lbnQ6IHtcclxuICAgICAgICAgIG5hbWU6IHhtbE9iamVjdC5Eb2N1bWVudERhdGFbMF1bJ0BfRG9jRmlsZU5hbWUnXVswXSxcclxuICAgICAgICAgIHR5cGU6IHhtbE9iamVjdC5Eb2N1bWVudERhdGFbMF1bJ0BfRG9jVHlwZSddWzBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbmFtZTogeG1sT2JqZWN0LkRvY3VtZW50RGF0YVswXVsnQF9GaWxlTmFtZSddWzBdLFxyXG4gICAgICAgIGJhc2U2NDogeG1sT2JqZWN0LkRvY3VtZW50RGF0YVswXS5CYXNlNjRDb2RlWzBdLFxyXG4gICAgICB9O1xyXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICB9XHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgeG1sT2JqOiBSZXBvcnRDYXJkc1hNTE9iamVjdFsnUkNSZXBvcnRpbmdQZXJpb2REYXRhJ11bMF1bJ1JDUmVwb3J0aW5nUGVyaW9kcyddWzBdWydSQ1JlcG9ydGluZ1BlcmlvZCddWzBdLFxyXG4gICAgY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHNcclxuICApIHtcclxuICAgIHN1cGVyKGNyZWRlbnRpYWxzLCB4bWxPYmpbJ0BfRG9jdW1lbnRHVSddWzBdLCAnR2V0UmVwb3J0Q2FyZERvY3VtZW50RGF0YScpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGF0ZSBvZiB0aGUgcmVwb3J0IGNhcmRcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICogQHR5cGUge0RhdGV9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKHhtbE9ialsnQF9FbmREYXRlJ11bMF0pO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgdGltZSBwZXJpb2Qgb2YgdGhlIHJlcG9ydCBjYXJkXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMucGVyaW9kTmFtZSA9IHhtbE9ialsnQF9SZXBvcnRpbmdQZXJpb2ROYW1lJ11bMF07XHJcbiAgfVxyXG59XHJcbiJdfQ==