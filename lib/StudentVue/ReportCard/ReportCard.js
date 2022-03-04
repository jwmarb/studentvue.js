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
      this.date = new Date(xmlObj['@_EndDate'][0]);
      this.periodName = xmlObj['@_ReportingPeriodName'][0];
    }

  }

  _exports.default = ReportCard;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL1JlcG9ydENhcmQvUmVwb3J0Q2FyZC50cyJdLCJuYW1lcyI6WyJSZXBvcnRDYXJkIiwiRmlsZSIsInBhcnNlWE1MT2JqZWN0IiwieG1sT2JqZWN0IiwiZG9jdW1lbnQiLCJuYW1lIiwiRG9jdW1lbnREYXRhIiwidHlwZSIsImJhc2U2NCIsIkJhc2U2NENvZGUiLCJjb25zdHJ1Y3RvciIsInhtbE9iaiIsImNyZWRlbnRpYWxzIiwiZGF0ZSIsIkRhdGUiLCJwZXJpb2ROYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtlLFFBQU1BLFVBQU4sU0FBeUJDLGFBQXpCLENBQThDO0FBSWpEQyxJQUFBQSxjQUFjLENBQUNDLFNBQUQsRUFBdUQ7QUFDN0UsYUFBTztBQUNMQyxRQUFBQSxRQUFRLEVBQUU7QUFDUkMsVUFBQUEsSUFBSSxFQUFFRixTQUFTLENBQUNHLFlBQVYsQ0FBdUIsQ0FBdkIsRUFBMEIsZUFBMUIsRUFBMkMsQ0FBM0MsQ0FERTtBQUVSQyxVQUFBQSxJQUFJLEVBQUVKLFNBQVMsQ0FBQ0csWUFBVixDQUF1QixDQUF2QixFQUEwQixXQUExQixFQUF1QyxDQUF2QztBQUZFLFNBREw7QUFLTEQsUUFBQUEsSUFBSSxFQUFFRixTQUFTLENBQUNHLFlBQVYsQ0FBdUIsQ0FBdkIsRUFBMEIsWUFBMUIsRUFBd0MsQ0FBeEMsQ0FMRDtBQU1MRSxRQUFBQSxNQUFNLEVBQUVMLFNBQVMsQ0FBQ0csWUFBVixDQUF1QixDQUF2QixFQUEwQkcsVUFBMUIsQ0FBcUMsQ0FBckM7QUFOSCxPQUFQO0FBUUQ7O0FBQ01DLElBQUFBLFdBQVcsQ0FDaEJDLE1BRGdCLEVBRWhCQyxXQUZnQixFQUdoQjtBQUNBLFlBQU1BLFdBQU4sRUFBbUJELE1BQU0sQ0FBQyxjQUFELENBQU4sQ0FBdUIsQ0FBdkIsQ0FBbkIsRUFBOEMsMkJBQTlDO0FBQ0EsV0FBS0UsSUFBTCxHQUFZLElBQUlDLElBQUosQ0FBU0gsTUFBTSxDQUFDLFdBQUQsQ0FBTixDQUFvQixDQUFwQixDQUFULENBQVo7QUFDQSxXQUFLSSxVQUFMLEdBQWtCSixNQUFNLENBQUMsdUJBQUQsQ0FBTixDQUFnQyxDQUFoQyxDQUFsQjtBQUNEOztBQXJCMEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgRmlsZSBmcm9tICcuLi9GaWxlL0ZpbGUnO1xyXG5pbXBvcnQgeyBSZXBvcnRDYXJkRmlsZSB9IGZyb20gJy4vUmVwb3J0Q2FyZC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgUmVwb3J0Q2FyZEJhc2U2NFhNTE9iamVjdCwgUmVwb3J0Q2FyZHNYTUxPYmplY3QgfSBmcm9tICcuL1JlcG9ydENhcmQueG1sJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcG9ydENhcmQgZXh0ZW5kcyBGaWxlPFJlcG9ydENhcmRGaWxlPiB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGRhdGU6IERhdGU7XHJcbiAgcHVibGljIHJlYWRvbmx5IHBlcmlvZE5hbWU6IHN0cmluZztcclxuXHJcbiAgcHJvdGVjdGVkIHBhcnNlWE1MT2JqZWN0KHhtbE9iamVjdDogUmVwb3J0Q2FyZEJhc2U2NFhNTE9iamVjdCk6IFJlcG9ydENhcmRGaWxlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRvY3VtZW50OiB7XHJcbiAgICAgICAgbmFtZTogeG1sT2JqZWN0LkRvY3VtZW50RGF0YVswXVsnQF9Eb2NGaWxlTmFtZSddWzBdLFxyXG4gICAgICAgIHR5cGU6IHhtbE9iamVjdC5Eb2N1bWVudERhdGFbMF1bJ0BfRG9jVHlwZSddWzBdLFxyXG4gICAgICB9LFxyXG4gICAgICBuYW1lOiB4bWxPYmplY3QuRG9jdW1lbnREYXRhWzBdWydAX0ZpbGVOYW1lJ11bMF0sXHJcbiAgICAgIGJhc2U2NDogeG1sT2JqZWN0LkRvY3VtZW50RGF0YVswXS5CYXNlNjRDb2RlWzBdLFxyXG4gICAgfTtcclxuICB9XHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgeG1sT2JqOiBSZXBvcnRDYXJkc1hNTE9iamVjdFsnUkNSZXBvcnRpbmdQZXJpb2REYXRhJ11bMF1bJ1JDUmVwb3J0aW5nUGVyaW9kcyddWzBdWydSQ1JlcG9ydGluZ1BlcmlvZCddWzBdLFxyXG4gICAgY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHNcclxuICApIHtcclxuICAgIHN1cGVyKGNyZWRlbnRpYWxzLCB4bWxPYmpbJ0BfRG9jdW1lbnRHVSddWzBdLCAnR2V0UmVwb3J0Q2FyZERvY3VtZW50RGF0YScpO1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUoeG1sT2JqWydAX0VuZERhdGUnXVswXSk7XHJcbiAgICB0aGlzLnBlcmlvZE5hbWUgPSB4bWxPYmpbJ0BfUmVwb3J0aW5nUGVyaW9kTmFtZSddWzBdO1xyXG4gIH1cclxufVxyXG4iXX0=