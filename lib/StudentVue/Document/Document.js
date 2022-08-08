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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0RvY3VtZW50L0RvY3VtZW50LnRzIl0sIm5hbWVzIjpbIkRvY3VtZW50IiwiRmlsZSIsInBhcnNlWE1MT2JqZWN0IiwieG1sT2JqZWN0IiwiU3R1ZGVudEF0dGFjaGVkRG9jdW1lbnREYXRhIiwiRG9jdW1lbnREYXRhcyIsIkRvY3VtZW50RGF0YSIsImRvY3VtZW50IiwiZmlsZSIsIm5hbWUiLCJ0eXBlIiwiZGF0ZSIsIkRhdGUiLCJjYXRlZ29yeSIsIm5vdGVzIiwiYmFzZTY0IiwiQmFzZTY0Q29kZSIsImNvbnN0cnVjdG9yIiwieG1sT2JqIiwiY3JlZGVudGlhbHMiLCJjb21tZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtlLFFBQU1BLFFBQU4sU0FBdUJDLGFBQXZCLENBQTRDO0FBUS9DQyxJQUFBQSxjQUFjLENBQUNDLFNBQUQsRUFBbUM7QUFBQSxlQUNsREEsU0FBUyxDQUFDQywyQkFBVixDQUFzQyxDQUF0QyxFQUF5Q0MsYUFBekMsQ0FBdUQsQ0FBdkQsRUFBMERDLFlBRFI7O0FBQUEsZUFDMEJDLFFBQUQ7QUFBQSxlQUFlO0FBQy9GQyxVQUFBQSxJQUFJLEVBQUU7QUFDSkMsWUFBQUEsSUFBSSxFQUFFRixRQUFRLENBQUMsWUFBRCxDQUFSLENBQXVCLENBQXZCLENBREY7QUFFSkcsWUFBQUEsSUFBSSxFQUFFSCxRQUFRLENBQUMsV0FBRCxDQUFSLENBQXNCLENBQXRCLENBRkY7QUFHSkksWUFBQUEsSUFBSSxFQUFFLElBQUlDLElBQUosQ0FBU0wsUUFBUSxDQUFDLFdBQUQsQ0FBUixDQUFzQixDQUF0QixDQUFUO0FBSEYsV0FEeUY7QUFNL0ZNLFVBQUFBLFFBQVEsRUFBRU4sUUFBUSxDQUFDLFlBQUQsQ0FBUixDQUF1QixDQUF2QixDQU5xRjtBQU8vRk8sVUFBQUEsS0FBSyxFQUFFUCxRQUFRLENBQUMsU0FBRCxDQUFSLENBQW9CLENBQXBCLENBUHdGO0FBUS9GUSxVQUFBQSxNQUFNLEVBQUVSLFFBQVEsQ0FBQ1MsVUFBVCxDQUFvQixDQUFwQjtBQVJ1RixTQUFmO0FBQUEsT0FEekI7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUN6RDtBQVVEOztBQUNNQyxJQUFBQSxXQUFXLENBQ2hCQyxNQURnQixFQUVoQkMsV0FGZ0IsRUFHaEI7QUFDQSxZQUFNQSxXQUFOLEVBQW1CRCxNQUFNLENBQUMsY0FBRCxDQUFOLENBQXVCLENBQXZCLENBQW5CLEVBQThDLHlCQUE5QztBQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0ksV0FBS1YsSUFBTCxHQUFZO0FBQ1ZDLFFBQUFBLElBQUksRUFBRVMsTUFBTSxDQUFDLG9CQUFELENBQU4sQ0FBNkIsQ0FBN0IsQ0FESTtBQUVWUixRQUFBQSxJQUFJLEVBQUVRLE1BQU0sQ0FBQyxnQkFBRCxDQUFOLENBQXlCLENBQXpCLENBRkk7QUFHVlAsUUFBQUEsSUFBSSxFQUFFLElBQUlDLElBQUosQ0FBU00sTUFBTSxDQUFDLGdCQUFELENBQU4sQ0FBeUIsQ0FBekIsQ0FBVDtBQUhJLE9BQVo7QUFNQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0ksV0FBS0UsT0FBTCxHQUFlRixNQUFNLENBQUMsbUJBQUQsQ0FBTixDQUE0QixDQUE1QixDQUFmO0FBQ0Q7O0FBL0N3RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XG5pbXBvcnQgRmlsZSBmcm9tICcuLi9GaWxlL0ZpbGUnO1xuaW1wb3J0IHsgRG9jdW1lbnRGaWxlIH0gZnJvbSAnLi9Eb2N1bWVudC5pbnRlcmZhY2VzJztcbmltcG9ydCB7IERvY3VtZW50RmlsZVhNTE9iamVjdCwgRG9jdW1lbnRYTUxPYmplY3QgfSBmcm9tICcuL0RvY3VtZW50LnhtbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvY3VtZW50IGV4dGVuZHMgRmlsZTxEb2N1bWVudEZpbGVbXT4ge1xuICBwdWJsaWMgcmVhZG9ubHkgZmlsZToge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBkYXRlOiBEYXRlO1xuICAgIHR5cGU6IHN0cmluZztcbiAgfTtcblxuICBwdWJsaWMgcmVhZG9ubHkgY29tbWVudDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgcGFyc2VYTUxPYmplY3QoeG1sT2JqZWN0OiBEb2N1bWVudEZpbGVYTUxPYmplY3QpIHtcbiAgICByZXR1cm4geG1sT2JqZWN0LlN0dWRlbnRBdHRhY2hlZERvY3VtZW50RGF0YVswXS5Eb2N1bWVudERhdGFzWzBdLkRvY3VtZW50RGF0YS5tYXAoKGRvY3VtZW50KSA9PiAoe1xuICAgICAgZmlsZToge1xuICAgICAgICBuYW1lOiBkb2N1bWVudFsnQF9GaWxlTmFtZSddWzBdLFxuICAgICAgICB0eXBlOiBkb2N1bWVudFsnQF9Eb2NUeXBlJ11bMF0sXG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKGRvY3VtZW50WydAX0RvY0RhdGUnXVswXSksXG4gICAgICB9LFxuICAgICAgY2F0ZWdvcnk6IGRvY3VtZW50WydAX0NhdGVnb3J5J11bMF0sXG4gICAgICBub3RlczogZG9jdW1lbnRbJ0BfTm90ZXMnXVswXSxcbiAgICAgIGJhc2U2NDogZG9jdW1lbnQuQmFzZTY0Q29kZVswXSxcbiAgICB9KSk7XG4gIH1cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHhtbE9iajogRG9jdW1lbnRYTUxPYmplY3RbJ1N0dWRlbnREb2N1bWVudHMnXVswXVsnU3R1ZGVudERvY3VtZW50RGF0YXMnXVswXVsnU3R1ZGVudERvY3VtZW50RGF0YSddWzBdLFxuICAgIGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzXG4gICkge1xuICAgIHN1cGVyKGNyZWRlbnRpYWxzLCB4bWxPYmpbJ0BfRG9jdW1lbnRHVSddWzBdLCAnR2V0Q29udGVudE9mQXR0YWNoZWREb2MnKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBmaWxlXG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBmaWxlXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgVGhlIGZpbGUgdHlwZVxuICAgICAqIEBwcm9wZXJ0eSB7RGF0ZX0gZGF0ZSBUaGUgZGF0ZSB0aGUgZmlsZSB3YXMgY3JlYXRlZFxuICAgICAqL1xuICAgIHRoaXMuZmlsZSA9IHtcbiAgICAgIG5hbWU6IHhtbE9ialsnQF9Eb2N1bWVudEZpbGVOYW1lJ11bMF0sXG4gICAgICB0eXBlOiB4bWxPYmpbJ0BfRG9jdW1lbnRUeXBlJ11bMF0sXG4gICAgICBkYXRlOiBuZXcgRGF0ZSh4bWxPYmpbJ0BfRG9jdW1lbnREYXRlJ11bMF0pLFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29tbWVudCBpbmNsdWRlZCBpbiB0aGUgZG9jdW1lbnRcbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmNvbW1lbnQgPSB4bWxPYmpbJ0BfRG9jdW1lbnRDb21tZW50J11bMF07XG4gIH1cbn1cbiJdfQ==