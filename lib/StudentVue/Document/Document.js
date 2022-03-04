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
      this.file = {
        name: xmlObj['@_DocumentFileName'][0],
        type: xmlObj['@_DocumentType'][0],
        date: new Date(xmlObj['@_DocumentDate'][0])
      };
      this.comment = xmlObj['@_DocumentComment'][0];
    }

  }

  _exports.default = Document;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0RvY3VtZW50L0RvY3VtZW50LnRzIl0sIm5hbWVzIjpbIkRvY3VtZW50IiwiRmlsZSIsInBhcnNlWE1MT2JqZWN0IiwieG1sT2JqZWN0IiwiU3R1ZGVudEF0dGFjaGVkRG9jdW1lbnREYXRhIiwiRG9jdW1lbnREYXRhcyIsIkRvY3VtZW50RGF0YSIsImRvY3VtZW50IiwiZmlsZSIsIm5hbWUiLCJ0eXBlIiwiZGF0ZSIsIkRhdGUiLCJjYXRlZ29yeSIsIm5vdGVzIiwiYmFzZTY0IiwiQmFzZTY0Q29kZSIsImNvbnN0cnVjdG9yIiwieG1sT2JqIiwiY3JlZGVudGlhbHMiLCJjb21tZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtlLFFBQU1BLFFBQU4sU0FBdUJDLGFBQXZCLENBQTRDO0FBTy9DQyxJQUFBQSxjQUFjLENBQUNDLFNBQUQsRUFBbUM7QUFBQSxlQUNsREEsU0FBUyxDQUFDQywyQkFBVixDQUFzQyxDQUF0QyxFQUF5Q0MsYUFBekMsQ0FBdUQsQ0FBdkQsRUFBMERDLFlBRFI7O0FBQUEsZUFDMEJDLFFBQUQ7QUFBQSxlQUFlO0FBQy9GQyxVQUFBQSxJQUFJLEVBQUU7QUFDSkMsWUFBQUEsSUFBSSxFQUFFRixRQUFRLENBQUMsWUFBRCxDQUFSLENBQXVCLENBQXZCLENBREY7QUFFSkcsWUFBQUEsSUFBSSxFQUFFSCxRQUFRLENBQUMsV0FBRCxDQUFSLENBQXNCLENBQXRCLENBRkY7QUFHSkksWUFBQUEsSUFBSSxFQUFFLElBQUlDLElBQUosQ0FBU0wsUUFBUSxDQUFDLFdBQUQsQ0FBUixDQUFzQixDQUF0QixDQUFUO0FBSEYsV0FEeUY7QUFNL0ZNLFVBQUFBLFFBQVEsRUFBRU4sUUFBUSxDQUFDLFlBQUQsQ0FBUixDQUF1QixDQUF2QixDQU5xRjtBQU8vRk8sVUFBQUEsS0FBSyxFQUFFUCxRQUFRLENBQUMsU0FBRCxDQUFSLENBQW9CLENBQXBCLENBUHdGO0FBUS9GUSxVQUFBQSxNQUFNLEVBQUVSLFFBQVEsQ0FBQ1MsVUFBVCxDQUFvQixDQUFwQjtBQVJ1RixTQUFmO0FBQUEsT0FEekI7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUN6RDtBQVVEOztBQUNNQyxJQUFBQSxXQUFXLENBQ2hCQyxNQURnQixFQUVoQkMsV0FGZ0IsRUFHaEI7QUFDQSxZQUFNQSxXQUFOLEVBQW1CRCxNQUFNLENBQUMsY0FBRCxDQUFOLENBQXVCLENBQXZCLENBQW5CLEVBQThDLHlCQUE5QztBQUNBLFdBQUtWLElBQUwsR0FBWTtBQUNWQyxRQUFBQSxJQUFJLEVBQUVTLE1BQU0sQ0FBQyxvQkFBRCxDQUFOLENBQTZCLENBQTdCLENBREk7QUFFVlIsUUFBQUEsSUFBSSxFQUFFUSxNQUFNLENBQUMsZ0JBQUQsQ0FBTixDQUF5QixDQUF6QixDQUZJO0FBR1ZQLFFBQUFBLElBQUksRUFBRSxJQUFJQyxJQUFKLENBQVNNLE1BQU0sQ0FBQyxnQkFBRCxDQUFOLENBQXlCLENBQXpCLENBQVQ7QUFISSxPQUFaO0FBS0EsV0FBS0UsT0FBTCxHQUFlRixNQUFNLENBQUMsbUJBQUQsQ0FBTixDQUE0QixDQUE1QixDQUFmO0FBQ0Q7O0FBOUJ3RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBGaWxlIGZyb20gJy4uL0ZpbGUvRmlsZSc7XHJcbmltcG9ydCB7IERvY3VtZW50RmlsZSB9IGZyb20gJy4vRG9jdW1lbnQuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgRG9jdW1lbnRGaWxlWE1MT2JqZWN0LCBEb2N1bWVudFhNTE9iamVjdCB9IGZyb20gJy4vRG9jdW1lbnQueG1sJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvY3VtZW50IGV4dGVuZHMgRmlsZTxEb2N1bWVudEZpbGVbXT4ge1xyXG4gIHB1YmxpYyByZWFkb25seSBmaWxlOiB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBkYXRlOiBEYXRlO1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gIH07XHJcbiAgcHVibGljIHJlYWRvbmx5IGNvbW1lbnQ6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgcGFyc2VYTUxPYmplY3QoeG1sT2JqZWN0OiBEb2N1bWVudEZpbGVYTUxPYmplY3QpIHtcclxuICAgIHJldHVybiB4bWxPYmplY3QuU3R1ZGVudEF0dGFjaGVkRG9jdW1lbnREYXRhWzBdLkRvY3VtZW50RGF0YXNbMF0uRG9jdW1lbnREYXRhLm1hcCgoZG9jdW1lbnQpID0+ICh7XHJcbiAgICAgIGZpbGU6IHtcclxuICAgICAgICBuYW1lOiBkb2N1bWVudFsnQF9GaWxlTmFtZSddWzBdLFxyXG4gICAgICAgIHR5cGU6IGRvY3VtZW50WydAX0RvY1R5cGUnXVswXSxcclxuICAgICAgICBkYXRlOiBuZXcgRGF0ZShkb2N1bWVudFsnQF9Eb2NEYXRlJ11bMF0pLFxyXG4gICAgICB9LFxyXG4gICAgICBjYXRlZ29yeTogZG9jdW1lbnRbJ0BfQ2F0ZWdvcnknXVswXSxcclxuICAgICAgbm90ZXM6IGRvY3VtZW50WydAX05vdGVzJ11bMF0sXHJcbiAgICAgIGJhc2U2NDogZG9jdW1lbnQuQmFzZTY0Q29kZVswXSxcclxuICAgIH0pKTtcclxuICB9XHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgeG1sT2JqOiBEb2N1bWVudFhNTE9iamVjdFsnU3R1ZGVudERvY3VtZW50cyddWzBdWydTdHVkZW50RG9jdW1lbnREYXRhcyddWzBdWydTdHVkZW50RG9jdW1lbnREYXRhJ11bMF0sXHJcbiAgICBjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFsc1xyXG4gICkge1xyXG4gICAgc3VwZXIoY3JlZGVudGlhbHMsIHhtbE9ialsnQF9Eb2N1bWVudEdVJ11bMF0sICdHZXRDb250ZW50T2ZBdHRhY2hlZERvYycpO1xyXG4gICAgdGhpcy5maWxlID0ge1xyXG4gICAgICBuYW1lOiB4bWxPYmpbJ0BfRG9jdW1lbnRGaWxlTmFtZSddWzBdLFxyXG4gICAgICB0eXBlOiB4bWxPYmpbJ0BfRG9jdW1lbnRUeXBlJ11bMF0sXHJcbiAgICAgIGRhdGU6IG5ldyBEYXRlKHhtbE9ialsnQF9Eb2N1bWVudERhdGUnXVswXSksXHJcbiAgICB9O1xyXG4gICAgdGhpcy5jb21tZW50ID0geG1sT2JqWydAX0RvY3VtZW50Q29tbWVudCddWzBdO1xyXG4gIH1cclxufVxyXG4iXX0=