(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./StudentVue/StudentVue", "./Constants/ResourceType", "./Constants/EventType", "./StudentVue/RequestException/RequestException", "./StudentVue/Message/Message", "./StudentVue/Icon/Icon", "./StudentVue/Client/Client", "./StudentVue/Attachment/Attachment", "./StudentVue/File/File", "./StudentVue/ReportCard/ReportCard", "./StudentVue/Document/Document"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./StudentVue/StudentVue"), require("./Constants/ResourceType"), require("./Constants/EventType"), require("./StudentVue/RequestException/RequestException"), require("./StudentVue/Message/Message"), require("./StudentVue/Icon/Icon"), require("./StudentVue/Client/Client"), require("./StudentVue/Attachment/Attachment"), require("./StudentVue/File/File"), require("./StudentVue/ReportCard/ReportCard"), require("./StudentVue/Document/Document"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.StudentVue, global.ResourceType, global.EventType, global.RequestException, global.Message, global.Icon, global.Client, global.Attachment, global.File, global.ReportCard, global.Document);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, StudentVue, _ResourceType, _EventType, _RequestException, _Message, _Icon, _Client, _Attachment, _File, _ReportCard, _Document) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "Attachment", {
    enumerable: true,
    get: function () {
      return _Attachment.default;
    }
  });
  Object.defineProperty(_exports, "Client", {
    enumerable: true,
    get: function () {
      return _Client.default;
    }
  });
  Object.defineProperty(_exports, "Document", {
    enumerable: true,
    get: function () {
      return _Document.default;
    }
  });
  Object.defineProperty(_exports, "EventType", {
    enumerable: true,
    get: function () {
      return _EventType.default;
    }
  });
  Object.defineProperty(_exports, "File", {
    enumerable: true,
    get: function () {
      return _File.default;
    }
  });
  Object.defineProperty(_exports, "Icon", {
    enumerable: true,
    get: function () {
      return _Icon.default;
    }
  });
  Object.defineProperty(_exports, "Message", {
    enumerable: true,
    get: function () {
      return _Message.default;
    }
  });
  Object.defineProperty(_exports, "ReportCard", {
    enumerable: true,
    get: function () {
      return _ReportCard.default;
    }
  });
  Object.defineProperty(_exports, "RequestException", {
    enumerable: true,
    get: function () {
      return _RequestException.default;
    }
  });
  Object.defineProperty(_exports, "ResourceType", {
    enumerable: true,
    get: function () {
      return _ResourceType.default;
    }
  });
  _exports.default = void 0;
  StudentVue = _interopRequireWildcard(StudentVue);
  _ResourceType = _interopRequireDefault(_ResourceType);
  _EventType = _interopRequireDefault(_EventType);
  _RequestException = _interopRequireDefault(_RequestException);
  _Message = _interopRequireDefault(_Message);
  _Icon = _interopRequireDefault(_Icon);
  _Client = _interopRequireDefault(_Client);
  _Attachment = _interopRequireDefault(_Attachment);
  _File = _interopRequireDefault(_File);
  _ReportCard = _interopRequireDefault(_ReportCard);
  _Document = _interopRequireDefault(_Document);
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") { return null; } var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
  function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
  var _default = StudentVue;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTdHVkZW50VnVlIl0sInNvdXJjZXMiOlsiLi4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFN0dWRlbnRWdWUgZnJvbSAnLi9TdHVkZW50VnVlL1N0dWRlbnRWdWUnO1xuZXhwb3J0IGRlZmF1bHQgU3R1ZGVudFZ1ZTtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmVzb3VyY2VUeXBlIH0gZnJvbSAnLi9Db25zdGFudHMvUmVzb3VyY2VUeXBlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRXZlbnRUeXBlIH0gZnJvbSAnLi9Db25zdGFudHMvRXZlbnRUeXBlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmVxdWVzdEV4Y2VwdGlvbiB9IGZyb20gJy4vU3R1ZGVudFZ1ZS9SZXF1ZXN0RXhjZXB0aW9uL1JlcXVlc3RFeGNlcHRpb24nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNZXNzYWdlIH0gZnJvbSAnLi9TdHVkZW50VnVlL01lc3NhZ2UvTWVzc2FnZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEljb24gfSBmcm9tICcuL1N0dWRlbnRWdWUvSWNvbi9JY29uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2xpZW50IH0gZnJvbSAnLi9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBdHRhY2htZW50IH0gZnJvbSAnLi9TdHVkZW50VnVlL0F0dGFjaG1lbnQvQXR0YWNobWVudCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZpbGUgfSBmcm9tICcuL1N0dWRlbnRWdWUvRmlsZS9GaWxlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmVwb3J0Q2FyZCB9IGZyb20gJy4vU3R1ZGVudFZ1ZS9SZXBvcnRDYXJkL1JlcG9ydENhcmQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBEb2N1bWVudCB9IGZyb20gJy4vU3R1ZGVudFZ1ZS9Eb2N1bWVudC9Eb2N1bWVudCc7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpQkFDZUEsVUFBVTtFQUFBO0FBQUEifQ==