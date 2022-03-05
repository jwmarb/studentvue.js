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
       */

      this.comment = xmlObj['@_DocumentComment'][0];
    }

  }

  _exports.default = Document;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0RvY3VtZW50L0RvY3VtZW50LnRzIl0sIm5hbWVzIjpbIkRvY3VtZW50IiwiRmlsZSIsInBhcnNlWE1MT2JqZWN0IiwieG1sT2JqZWN0IiwiU3R1ZGVudEF0dGFjaGVkRG9jdW1lbnREYXRhIiwiRG9jdW1lbnREYXRhcyIsIkRvY3VtZW50RGF0YSIsImRvY3VtZW50IiwiZmlsZSIsIm5hbWUiLCJ0eXBlIiwiZGF0ZSIsIkRhdGUiLCJjYXRlZ29yeSIsIm5vdGVzIiwiYmFzZTY0IiwiQmFzZTY0Q29kZSIsImNvbnN0cnVjdG9yIiwieG1sT2JqIiwiY3JlZGVudGlhbHMiLCJjb21tZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtlLFFBQU1BLFFBQU4sU0FBdUJDLGFBQXZCLENBQTRDO0FBUS9DQyxJQUFBQSxjQUFjLENBQUNDLFNBQUQsRUFBbUM7QUFBQSxlQUNsREEsU0FBUyxDQUFDQywyQkFBVixDQUFzQyxDQUF0QyxFQUF5Q0MsYUFBekMsQ0FBdUQsQ0FBdkQsRUFBMERDLFlBRFI7O0FBQUEsZUFDMEJDLFFBQUQ7QUFBQSxlQUFlO0FBQy9GQyxVQUFBQSxJQUFJLEVBQUU7QUFDSkMsWUFBQUEsSUFBSSxFQUFFRixRQUFRLENBQUMsWUFBRCxDQUFSLENBQXVCLENBQXZCLENBREY7QUFFSkcsWUFBQUEsSUFBSSxFQUFFSCxRQUFRLENBQUMsV0FBRCxDQUFSLENBQXNCLENBQXRCLENBRkY7QUFHSkksWUFBQUEsSUFBSSxFQUFFLElBQUlDLElBQUosQ0FBU0wsUUFBUSxDQUFDLFdBQUQsQ0FBUixDQUFzQixDQUF0QixDQUFUO0FBSEYsV0FEeUY7QUFNL0ZNLFVBQUFBLFFBQVEsRUFBRU4sUUFBUSxDQUFDLFlBQUQsQ0FBUixDQUF1QixDQUF2QixDQU5xRjtBQU8vRk8sVUFBQUEsS0FBSyxFQUFFUCxRQUFRLENBQUMsU0FBRCxDQUFSLENBQW9CLENBQXBCLENBUHdGO0FBUS9GUSxVQUFBQSxNQUFNLEVBQUVSLFFBQVEsQ0FBQ1MsVUFBVCxDQUFvQixDQUFwQjtBQVJ1RixTQUFmO0FBQUEsT0FEekI7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUN6RDtBQVVEOztBQUNNQyxJQUFBQSxXQUFXLENBQ2hCQyxNQURnQixFQUVoQkMsV0FGZ0IsRUFHaEI7QUFDQSxZQUFNQSxXQUFOLEVBQW1CRCxNQUFNLENBQUMsY0FBRCxDQUFOLENBQXVCLENBQXZCLENBQW5CLEVBQThDLHlCQUE5QztBQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBQ0ksV0FBS1YsSUFBTCxHQUFZO0FBQ1ZDLFFBQUFBLElBQUksRUFBRVMsTUFBTSxDQUFDLG9CQUFELENBQU4sQ0FBNkIsQ0FBN0IsQ0FESTtBQUVWUixRQUFBQSxJQUFJLEVBQUVRLE1BQU0sQ0FBQyxnQkFBRCxDQUFOLENBQXlCLENBQXpCLENBRkk7QUFHVlAsUUFBQUEsSUFBSSxFQUFFLElBQUlDLElBQUosQ0FBU00sTUFBTSxDQUFDLGdCQUFELENBQU4sQ0FBeUIsQ0FBekIsQ0FBVDtBQUhJLE9BQVo7QUFNQTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUNJLFdBQUtFLE9BQUwsR0FBZUYsTUFBTSxDQUFDLG1CQUFELENBQU4sQ0FBNEIsQ0FBNUIsQ0FBZjtBQUNEOztBQTNDd0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgRmlsZSBmcm9tICcuLi9GaWxlL0ZpbGUnO1xyXG5pbXBvcnQgeyBEb2N1bWVudEZpbGUgfSBmcm9tICcuL0RvY3VtZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBEb2N1bWVudEZpbGVYTUxPYmplY3QsIERvY3VtZW50WE1MT2JqZWN0IH0gZnJvbSAnLi9Eb2N1bWVudC54bWwnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG9jdW1lbnQgZXh0ZW5kcyBGaWxlPERvY3VtZW50RmlsZVtdPiB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGZpbGU6IHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGRhdGU6IERhdGU7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IGNvbW1lbnQ6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgcGFyc2VYTUxPYmplY3QoeG1sT2JqZWN0OiBEb2N1bWVudEZpbGVYTUxPYmplY3QpIHtcclxuICAgIHJldHVybiB4bWxPYmplY3QuU3R1ZGVudEF0dGFjaGVkRG9jdW1lbnREYXRhWzBdLkRvY3VtZW50RGF0YXNbMF0uRG9jdW1lbnREYXRhLm1hcCgoZG9jdW1lbnQpID0+ICh7XHJcbiAgICAgIGZpbGU6IHtcclxuICAgICAgICBuYW1lOiBkb2N1bWVudFsnQF9GaWxlTmFtZSddWzBdLFxyXG4gICAgICAgIHR5cGU6IGRvY3VtZW50WydAX0RvY1R5cGUnXVswXSxcclxuICAgICAgICBkYXRlOiBuZXcgRGF0ZShkb2N1bWVudFsnQF9Eb2NEYXRlJ11bMF0pLFxyXG4gICAgICB9LFxyXG4gICAgICBjYXRlZ29yeTogZG9jdW1lbnRbJ0BfQ2F0ZWdvcnknXVswXSxcclxuICAgICAgbm90ZXM6IGRvY3VtZW50WydAX05vdGVzJ11bMF0sXHJcbiAgICAgIGJhc2U2NDogZG9jdW1lbnQuQmFzZTY0Q29kZVswXSxcclxuICAgIH0pKTtcclxuICB9XHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgeG1sT2JqOiBEb2N1bWVudFhNTE9iamVjdFsnU3R1ZGVudERvY3VtZW50cyddWzBdWydTdHVkZW50RG9jdW1lbnREYXRhcyddWzBdWydTdHVkZW50RG9jdW1lbnREYXRhJ11bMF0sXHJcbiAgICBjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFsc1xyXG4gICkge1xyXG4gICAgc3VwZXIoY3JlZGVudGlhbHMsIHhtbE9ialsnQF9Eb2N1bWVudEdVJ11bMF0sICdHZXRDb250ZW50T2ZBdHRhY2hlZERvYycpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIHByb3BlcnRpZXMgb2YgdGhlIGZpbGVcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLmZpbGUgPSB7XHJcbiAgICAgIG5hbWU6IHhtbE9ialsnQF9Eb2N1bWVudEZpbGVOYW1lJ11bMF0sXHJcbiAgICAgIHR5cGU6IHhtbE9ialsnQF9Eb2N1bWVudFR5cGUnXVswXSxcclxuICAgICAgZGF0ZTogbmV3IERhdGUoeG1sT2JqWydAX0RvY3VtZW50RGF0ZSddWzBdKSxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgY29tbWVudCBpbmNsdWRlZCBpbiB0aGUgZG9jdW1lbnRcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLmNvbW1lbnQgPSB4bWxPYmpbJ0BfRG9jdW1lbnRDb21tZW50J11bMF07XHJcbiAgfVxyXG59XHJcbiJdfQ==