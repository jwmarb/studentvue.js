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
    global.Document = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _File) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _File = _interopRequireDefault(_File);
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  class Document extends _File.default {
    parseXMLObject(xmlObject) {
      var _a = xmlObject.StudentAttachedDocumentData[0].DocumentDatas[0].DocumentData;
      var _f = document => {
        return {
          file: {
            name: document['@_FileName'][0],
            type: document['@_DocType'][0],
            date: new Date(document['@_DocDate'][0])
          },
          category: document['@_Category'][0],
          notes: document['@_Notes'][0],
          base64: document.Base64Code[0]
        };
      };
      var _r = [];
      for (var _i = 0; _i < _a.length; _i++) {
        _r.push(_f(_a[_i], _i, _a));
      }
      return _r;
    }
    constructor(xmlObj, credentials) {
      super(credentials, xmlObj['@_DocumentGU'][0], 'GetContentOfAttachedDoc');

      /**
       * The properties of the file
       * @public
       * @readonly
       * @property {string} name The name of the file
       * @property {string} type The file type
       * @property {Date} date The date the file was created
       */
      this.file = {
        name: xmlObj['@_DocumentFileName'][0],
        type: xmlObj['@_DocumentType'][0],
        date: new Date(xmlObj['@_DocumentDate'][0])
      };

      /**
       * The comment included in the document
       * @public
       * @readonly
       * @type {string}
       */
      this.comment = xmlObj['@_DocumentComment'][0];
    }
  }
  _exports.default = Document;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEb2N1bWVudCIsIkZpbGUiLCJwYXJzZVhNTE9iamVjdCIsInhtbE9iamVjdCIsIlN0dWRlbnRBdHRhY2hlZERvY3VtZW50RGF0YSIsIkRvY3VtZW50RGF0YXMiLCJEb2N1bWVudERhdGEiLCJkb2N1bWVudCIsImZpbGUiLCJuYW1lIiwidHlwZSIsImRhdGUiLCJEYXRlIiwiY2F0ZWdvcnkiLCJub3RlcyIsImJhc2U2NCIsIkJhc2U2NENvZGUiLCJjb25zdHJ1Y3RvciIsInhtbE9iaiIsImNyZWRlbnRpYWxzIiwiY29tbWVudCJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0RvY3VtZW50L0RvY3VtZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBGaWxlIGZyb20gJy4uL0ZpbGUvRmlsZSc7XHJcbmltcG9ydCB7IERvY3VtZW50RmlsZSB9IGZyb20gJy4vRG9jdW1lbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IERvY3VtZW50RmlsZVhNTE9iamVjdCwgRG9jdW1lbnRYTUxPYmplY3QgfSBmcm9tICcuL0RvY3VtZW50LnhtbCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb2N1bWVudCBleHRlbmRzIEZpbGU8RG9jdW1lbnRGaWxlW10+IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgZmlsZToge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgZGF0ZTogRGF0ZTtcclxuICAgIHR5cGU6IHN0cmluZztcclxuICB9O1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgY29tbWVudDogc3RyaW5nO1xyXG4gIHByb3RlY3RlZCBwYXJzZVhNTE9iamVjdCh4bWxPYmplY3Q6IERvY3VtZW50RmlsZVhNTE9iamVjdCkge1xyXG4gICAgcmV0dXJuIHhtbE9iamVjdC5TdHVkZW50QXR0YWNoZWREb2N1bWVudERhdGFbMF0uRG9jdW1lbnREYXRhc1swXS5Eb2N1bWVudERhdGEubWFwKChkb2N1bWVudCkgPT4gKHtcclxuICAgICAgZmlsZToge1xyXG4gICAgICAgIG5hbWU6IGRvY3VtZW50WydAX0ZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgdHlwZTogZG9jdW1lbnRbJ0BfRG9jVHlwZSddWzBdLFxyXG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKGRvY3VtZW50WydAX0RvY0RhdGUnXVswXSksXHJcbiAgICAgIH0sXHJcbiAgICAgIGNhdGVnb3J5OiBkb2N1bWVudFsnQF9DYXRlZ29yeSddWzBdLFxyXG4gICAgICBub3RlczogZG9jdW1lbnRbJ0BfTm90ZXMnXVswXSxcclxuICAgICAgYmFzZTY0OiBkb2N1bWVudC5CYXNlNjRDb2RlWzBdLFxyXG4gICAgfSkpO1xyXG4gIH1cclxuICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICB4bWxPYmo6IERvY3VtZW50WE1MT2JqZWN0WydTdHVkZW50RG9jdW1lbnRzJ11bMF1bJ1N0dWRlbnREb2N1bWVudERhdGFzJ11bMF1bJ1N0dWRlbnREb2N1bWVudERhdGEnXVswXSxcclxuICAgIGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzXHJcbiAgKSB7XHJcbiAgICBzdXBlcihjcmVkZW50aWFscywgeG1sT2JqWydAX0RvY3VtZW50R1UnXVswXSwgJ0dldENvbnRlbnRPZkF0dGFjaGVkRG9jJyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgcHJvcGVydGllcyBvZiB0aGUgZmlsZVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZmlsZVxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgVGhlIGZpbGUgdHlwZVxyXG4gICAgICogQHByb3BlcnR5IHtEYXRlfSBkYXRlIFRoZSBkYXRlIHRoZSBmaWxlIHdhcyBjcmVhdGVkXHJcbiAgICAgKi9cclxuICAgIHRoaXMuZmlsZSA9IHtcclxuICAgICAgbmFtZTogeG1sT2JqWydAX0RvY3VtZW50RmlsZU5hbWUnXVswXSxcclxuICAgICAgdHlwZTogeG1sT2JqWydAX0RvY3VtZW50VHlwZSddWzBdLFxyXG4gICAgICBkYXRlOiBuZXcgRGF0ZSh4bWxPYmpbJ0BfRG9jdW1lbnREYXRlJ11bMF0pLFxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBjb21tZW50IGluY2x1ZGVkIGluIHRoZSBkb2N1bWVudFxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICB0aGlzLmNvbW1lbnQgPSB4bWxPYmpbJ0BfRG9jdW1lbnRDb21tZW50J11bMF07XHJcbiAgfVxyXG59XHJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBS2UsTUFBTUEsUUFBUSxTQUFTQyxhQUFJLENBQWlCO0lBUS9DQyxjQUFjLENBQUNDLFNBQWdDLEVBQUU7TUFBQSxTQUNsREEsU0FBUyxDQUFDQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDQyxZQUFZO01BQUEsU0FBTUMsUUFBUTtRQUFBLE9BQU07VUFDL0ZDLElBQUksRUFBRTtZQUNKQyxJQUFJLEVBQUVGLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0JHLElBQUksRUFBRUgsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QkksSUFBSSxFQUFFLElBQUlDLElBQUksQ0FBQ0wsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUN6QyxDQUFDO1VBQ0RNLFFBQVEsRUFBRU4sUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUNuQ08sS0FBSyxFQUFFUCxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1VBQzdCUSxNQUFNLEVBQUVSLFFBQVEsQ0FBQ1MsVUFBVSxDQUFDLENBQUM7UUFDL0IsQ0FBQztNQUFBLENBQUM7TUFBQTtNQUFBO1FBQUE7TUFBQTtNQVRGO0lBVUY7SUFDT0MsV0FBVyxDQUNoQkMsTUFBcUcsRUFDckdDLFdBQTZCLEVBQzdCO01BQ0EsS0FBSyxDQUFDQSxXQUFXLEVBQUVELE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSx5QkFBeUIsQ0FBQzs7TUFFeEU7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUNJLElBQUksQ0FBQ1YsSUFBSSxHQUFHO1FBQ1ZDLElBQUksRUFBRVMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDUixJQUFJLEVBQUVRLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQ1AsSUFBSSxFQUFFLElBQUlDLElBQUksQ0FBQ00sTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzVDLENBQUM7O01BRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ0ksSUFBSSxDQUFDRSxPQUFPLEdBQUdGLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQztFQUNGO0VBQUM7QUFBQSJ9