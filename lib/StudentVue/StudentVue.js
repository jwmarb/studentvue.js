(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./Client/Client"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./Client/Client"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Client);
    global.StudentVue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _Client) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Client = _interopRequireDefault(_Client);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  class StudentVue {
    static login(districtUrl, credentials) {
      return new Promise(async res => {
        res(new _Client.default(credentials.username, credentials.password));
      });
    }

    static findDistricts(zipCode) {
      return new Promise(async res => {
        res([]);
      });
    }

  }

  _exports.default = StudentVue;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TdHVkZW50VnVlL1N0dWRlbnRWdWUudHMiXSwibmFtZXMiOlsiU3R1ZGVudFZ1ZSIsImxvZ2luIiwiZGlzdHJpY3RVcmwiLCJjcmVkZW50aWFscyIsIlByb21pc2UiLCJyZXMiLCJDbGllbnQiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiZmluZERpc3RyaWN0cyIsInppcENvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR2UsUUFBTUEsVUFBTixDQUFpQjtBQUNYLFdBQUxDLEtBQUssQ0FBQ0MsV0FBRCxFQUFzQkMsV0FBdEIsRUFBcUU7QUFDdEYsYUFBTyxJQUFJQyxPQUFKLENBQVksTUFBT0MsR0FBUCxJQUFlO0FBQ2hDQSxRQUFBQSxHQUFHLENBQUMsSUFBSUMsZUFBSixDQUFXSCxXQUFXLENBQUNJLFFBQXZCLEVBQWlDSixXQUFXLENBQUNLLFFBQTdDLENBQUQsQ0FBSDtBQUNELE9BRk0sQ0FBUDtBQUdEOztBQUUwQixXQUFiQyxhQUFhLENBQUNDLE9BQUQsRUFBNkM7QUFDdEUsYUFBTyxJQUFJTixPQUFKLENBQVksTUFBT0MsR0FBUCxJQUFlO0FBQ2hDQSxRQUFBQSxHQUFHLENBQUMsRUFBRCxDQUFIO0FBQ0QsT0FGTSxDQUFQO0FBR0Q7O0FBWDZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2Nob29sRGlzdHJpY3QsIFVzZXJDcmVkZW50aWFscyB9IGZyb20gJy4vU3R1ZGVudFZ1ZS5pbnRlcmZhY2VzJztcclxuaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudC9DbGllbnQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3R1ZGVudFZ1ZSB7XHJcbiAgcHVibGljIHN0YXRpYyBsb2dpbihkaXN0cmljdFVybDogc3RyaW5nLCBjcmVkZW50aWFsczogVXNlckNyZWRlbnRpYWxzKTogUHJvbWlzZTxDbGllbnQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzKSA9PiB7XHJcbiAgICAgIHJlcyhuZXcgQ2xpZW50KGNyZWRlbnRpYWxzLnVzZXJuYW1lLCBjcmVkZW50aWFscy5wYXNzd29yZCkpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGZpbmREaXN0cmljdHMoemlwQ29kZTogc3RyaW5nKTogUHJvbWlzZTxTY2hvb2xEaXN0cmljdFtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcykgPT4ge1xyXG4gICAgICByZXMoW10pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==