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
  var _exportNames = {
    ResourceType: true,
    EventType: true,
    RequestException: true,
    Message: true,
    Icon: true,
    Client: true,
    Attachment: true,
    File: true,
    ReportCard: true,
    Document: true
  };
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
  undefined;
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
  var _a = Object.keys(StudentVue);
  var _f = function (key) {
    if (key === "default" || key === "__esModule") {
      return;
    }
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) {
      return;
    }
    if (key in _exports && _exports[key] === StudentVue[key]) {
      return;
    }
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return StudentVue[key];
      }
    });
  };
  for (var _i = 0; _i < _a.length; _i++) {
    _f(_a[_i], _i, _a);
  }
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") { return null; } var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
  function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
  var _default = StudentVue;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTdHVkZW50VnVlIl0sInNvdXJjZXMiOlsiLi4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFN0dWRlbnRWdWUgZnJvbSAnLi9TdHVkZW50VnVlL1N0dWRlbnRWdWUnO1xyXG5leHBvcnQgZGVmYXVsdCBTdHVkZW50VnVlO1xyXG5leHBvcnQgKiBmcm9tICcuL1N0dWRlbnRWdWUvU3R1ZGVudFZ1ZSc7XHJcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmVzb3VyY2VUeXBlIH0gZnJvbSAnLi9Db25zdGFudHMvUmVzb3VyY2VUeXBlJztcclxuZXhwb3J0IHsgZGVmYXVsdCBhcyBFdmVudFR5cGUgfSBmcm9tICcuL0NvbnN0YW50cy9FdmVudFR5cGUnO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIFJlcXVlc3RFeGNlcHRpb24gfSBmcm9tICcuL1N0dWRlbnRWdWUvUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcclxuZXhwb3J0IHsgZGVmYXVsdCBhcyBNZXNzYWdlIH0gZnJvbSAnLi9TdHVkZW50VnVlL01lc3NhZ2UvTWVzc2FnZSc7XHJcbmV4cG9ydCB7IGRlZmF1bHQgYXMgSWNvbiB9IGZyb20gJy4vU3R1ZGVudFZ1ZS9JY29uL0ljb24nO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIENsaWVudCB9IGZyb20gJy4vU3R1ZGVudFZ1ZS9DbGllbnQvQ2xpZW50JztcclxuZXhwb3J0IHsgZGVmYXVsdCBhcyBBdHRhY2htZW50IH0gZnJvbSAnLi9TdHVkZW50VnVlL0F0dGFjaG1lbnQvQXR0YWNobWVudCc7XHJcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRmlsZSB9IGZyb20gJy4vU3R1ZGVudFZ1ZS9GaWxlL0ZpbGUnO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIFJlcG9ydENhcmQgfSBmcm9tICcuL1N0dWRlbnRWdWUvUmVwb3J0Q2FyZC9SZXBvcnRDYXJkJztcclxuZXhwb3J0IHsgZGVmYXVsdCBhcyBEb2N1bWVudCB9IGZyb20gJy4vU3R1ZGVudFZ1ZS9Eb2N1bWVudC9Eb2N1bWVudCc7XHJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFFQTtFQUF3QztFQUFBO0VBQUE7RUFBQTtFQUFBO0VBQUE7RUFBQTtFQUFBO0VBQUE7RUFBQTtFQUFBO0VBQUE7SUFBQTtNQUFBO0lBQUE7SUFBQTtNQUFBO0lBQUE7SUFBQTtNQUFBO0lBQUE7SUFBQTtNQUFBO01BQUE7UUFBQTtNQUFBO0lBQUE7RUFBQTtFQUFBO0lBQUE7RUFBQTtFQUFBO0VBQUE7RUFBQTtFQUFBLGVBRHpCQSxVQUFVO0VBQUE7QUFBQSJ9