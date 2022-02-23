(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.Client = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  class Client {
    get username() {
      return this.__username__;
    }

    get password() {
      return this.__password__;
    }

    constructor(username, password) {
      this.__username__ = username;
      this.__password__ = password;
    }

    processRequest() {
      return new Promise(async res => {
        res({});
      });
    }

    processAnonymousRequest(options = {}) {
      return new Promise(async res => {
        res({});
      });
    }

  }

  _exports.default = Client;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9zb2FwL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50IiwidXNlcm5hbWUiLCJfX3VzZXJuYW1lX18iLCJwYXNzd29yZCIsIl9fcGFzc3dvcmRfXyIsImNvbnN0cnVjdG9yIiwicHJvY2Vzc1JlcXVlc3QiLCJQcm9taXNlIiwicmVzIiwicHJvY2Vzc0Fub255bW91c1JlcXVlc3QiLCJvcHRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVlLFFBQU1BLE1BQU4sQ0FBYTtBQUlKLFFBQVJDLFFBQVEsR0FBVztBQUMvQixhQUFPLEtBQUtDLFlBQVo7QUFDRDs7QUFFcUIsUUFBUkMsUUFBUSxHQUFXO0FBQy9CLGFBQU8sS0FBS0MsWUFBWjtBQUNEOztBQUVEQyxJQUFBQSxXQUFXLENBQUNKLFFBQUQsRUFBbUJFLFFBQW5CLEVBQXFDO0FBQzlDLFdBQUtELFlBQUwsR0FBb0JELFFBQXBCO0FBQ0EsV0FBS0csWUFBTCxHQUFvQkQsUUFBcEI7QUFDRDs7QUFFU0csSUFBQUEsY0FBYyxHQUFrQjtBQUN4QyxhQUFPLElBQUlDLE9BQUosQ0FBWSxNQUFPQyxHQUFQLElBQWU7QUFDaENBLFFBQUFBLEdBQUcsQ0FBQyxFQUFELENBQUg7QUFDRCxPQUZNLENBQVA7QUFHRDs7QUFFU0MsSUFBQUEsdUJBQXVCLENBQUlDLE9BQXVCLEdBQUcsRUFBOUIsRUFBOEM7QUFDN0UsYUFBTyxJQUFJSCxPQUFKLENBQVksTUFBT0MsR0FBUCxJQUFlO0FBQ2hDQSxRQUFBQSxHQUFHLENBQUMsRUFBRCxDQUFIO0FBQ0QsT0FGTSxDQUFQO0FBR0Q7O0FBM0J5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlcXVlc3RPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IHtcclxuICBwcml2YXRlIF9fdXNlcm5hbWVfXzogc3RyaW5nO1xyXG4gIHByaXZhdGUgX19wYXNzd29yZF9fOiBzdHJpbmc7XHJcblxyXG4gIHByb3RlY3RlZCBnZXQgdXNlcm5hbWUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9fdXNlcm5hbWVfXztcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBnZXQgcGFzc3dvcmQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9fcGFzc3dvcmRfXztcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX191c2VybmFtZV9fID0gdXNlcm5hbWU7XHJcbiAgICB0aGlzLl9fcGFzc3dvcmRfXyA9IHBhc3N3b3JkO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIHByb2Nlc3NSZXF1ZXN0PFQ+KCk6IFByb21pc2U8VD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXMpID0+IHtcclxuICAgICAgcmVzKHt9IGFzIFQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgcHJvY2Vzc0Fub255bW91c1JlcXVlc3Q8VD4ob3B0aW9uczogUmVxdWVzdE9wdGlvbnMgPSB7fSk6IFByb21pc2U8VD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXMpID0+IHtcclxuICAgICAgcmVzKHt9IGFzIFQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==