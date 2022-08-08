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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJTdHVkZW50VnVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lCQUNlQSxVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgU3R1ZGVudFZ1ZSBmcm9tICcuL1N0dWRlbnRWdWUvU3R1ZGVudFZ1ZSc7XG5leHBvcnQgZGVmYXVsdCBTdHVkZW50VnVlO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBSZXNvdXJjZVR5cGUgfSBmcm9tICcuL0NvbnN0YW50cy9SZXNvdXJjZVR5cGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFdmVudFR5cGUgfSBmcm9tICcuL0NvbnN0YW50cy9FdmVudFR5cGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBSZXF1ZXN0RXhjZXB0aW9uIH0gZnJvbSAnLi9TdHVkZW50VnVlL1JlcXVlc3RFeGNlcHRpb24vUmVxdWVzdEV4Y2VwdGlvbic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1lc3NhZ2UgfSBmcm9tICcuL1N0dWRlbnRWdWUvTWVzc2FnZS9NZXNzYWdlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgSWNvbiB9IGZyb20gJy4vU3R1ZGVudFZ1ZS9JY29uL0ljb24nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDbGllbnQgfSBmcm9tICcuL1N0dWRlbnRWdWUvQ2xpZW50L0NsaWVudCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEF0dGFjaG1lbnQgfSBmcm9tICcuL1N0dWRlbnRWdWUvQXR0YWNobWVudC9BdHRhY2htZW50JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRmlsZSB9IGZyb20gJy4vU3R1ZGVudFZ1ZS9GaWxlL0ZpbGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBSZXBvcnRDYXJkIH0gZnJvbSAnLi9TdHVkZW50VnVlL1JlcG9ydENhcmQvUmVwb3J0Q2FyZCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIERvY3VtZW50IH0gZnJvbSAnLi9TdHVkZW50VnVlL0RvY3VtZW50L0RvY3VtZW50JztcbiJdfQ==