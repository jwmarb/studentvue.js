(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./StudentVue/StudentVue", "./Constants/ResourceType", "./Constants/EventType", "./StudentVue/RequestException/RequestException", "./StudentVue/Message/Message", "./StudentVue/Icon/Icon", "./StudentVue/Client/Client", "./StudentVue/Attachment/Attachment"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./StudentVue/StudentVue"), require("./Constants/ResourceType"), require("./Constants/EventType"), require("./StudentVue/RequestException/RequestException"), require("./StudentVue/Message/Message"), require("./StudentVue/Icon/Icon"), require("./StudentVue/Client/Client"), require("./StudentVue/Attachment/Attachment"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.StudentVue, global.ResourceType, global.EventType, global.RequestException, global.Message, global.Icon, global.Client, global.Attachment);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _StudentVue, _ResourceType, _EventType, _RequestException, _Message, _Icon, _Client, _Attachment) {
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
  Object.defineProperty(_exports, "EventType", {
    enumerable: true,
    get: function () {
      return _EventType.default;
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
  _StudentVue = _interopRequireDefault(_StudentVue);
  _ResourceType = _interopRequireDefault(_ResourceType);
  _EventType = _interopRequireDefault(_EventType);
  _RequestException = _interopRequireDefault(_RequestException);
  _Message = _interopRequireDefault(_Message);
  _Icon = _interopRequireDefault(_Icon);
  _Client = _interopRequireDefault(_Client);
  _Attachment = _interopRequireDefault(_Attachment);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var _default = _StudentVue.default;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJTdHVkZW50VnVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aUJBU2VBLG1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0dWRlbnRWdWUgZnJvbSAnLi9TdHVkZW50VnVlL1N0dWRlbnRWdWUnO1xyXG5cclxuZXhwb3J0IHsgZGVmYXVsdCBhcyBSZXNvdXJjZVR5cGUgfSBmcm9tICcuL0NvbnN0YW50cy9SZXNvdXJjZVR5cGUnO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIEV2ZW50VHlwZSB9IGZyb20gJy4vQ29uc3RhbnRzL0V2ZW50VHlwZSc7XHJcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmVxdWVzdEV4Y2VwdGlvbiB9IGZyb20gJy4vU3R1ZGVudFZ1ZS9SZXF1ZXN0RXhjZXB0aW9uL1JlcXVlc3RFeGNlcHRpb24nO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIE1lc3NhZ2UgfSBmcm9tICcuL1N0dWRlbnRWdWUvTWVzc2FnZS9NZXNzYWdlJztcclxuZXhwb3J0IHsgZGVmYXVsdCBhcyBJY29uIH0gZnJvbSAnLi9TdHVkZW50VnVlL0ljb24vSWNvbic7XHJcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2xpZW50IH0gZnJvbSAnLi9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQnO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIEF0dGFjaG1lbnQgfSBmcm9tICcuL1N0dWRlbnRWdWUvQXR0YWNobWVudC9BdHRhY2htZW50JztcclxuZXhwb3J0IGRlZmF1bHQgU3R1ZGVudFZ1ZTtcclxuIl19