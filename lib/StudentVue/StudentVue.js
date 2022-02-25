(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./Client/Client", "../utils/soap/soap", "./RequestException/RequestException", "url", "./Message/Message", "./Attachment/Attachment", "./Icon/Icon"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./Client/Client"), require("../utils/soap/soap"), require("./RequestException/RequestException"), require("url"), require("./Message/Message"), require("./Attachment/Attachment"), require("./Icon/Icon"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Client, global.soap, global.RequestException, global.url, global.Message, global.Attachment, global.Icon);
    global.StudentVue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _Client, _soap, _RequestException, _url, _Message, _Attachment, _Icon) {
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
  _exports.default = void 0;
  _Client = _interopRequireDefault(_Client);
  _soap = _interopRequireDefault(_soap);
  _RequestException = _interopRequireDefault(_RequestException);
  _url = _interopRequireDefault(_url);
  _Message = _interopRequireDefault(_Message);
  _Attachment = _interopRequireDefault(_Attachment);
  _Icon = _interopRequireDefault(_Icon);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  class StudentVue {
    static login(districtUrl, credentials) {
      return new Promise(async (res, rej) => {
        if (districtUrl.length === 0) {
          return rej(new _RequestException.default({
            message: 'District URL cannot be an empty string'
          }));
        }

        try {
          const host = _url.default.parse(districtUrl).host;

          const endpoint = `https://${host}/Service/PXPCommunication.asmx`;
          const client = new _Client.default({
            username: credentials.username,
            password: credentials.password,
            districtUrl: endpoint
          }, `https://${host}/`);
          const studentInfo = await client.studentInfo();
          res([client, studentInfo]);
        } catch (e) {
          rej(e);
        }
      });
    }

    static findDistricts(zipCode) {
      return new Promise(async (res, reject) => {
        try {
          const xmlObject = await _soap.default.Client.processAnonymousRequest('https://support.edupoint.com/Service/HDInfoCommunication.asmx', {
            paramStr: {
              Key: '5E4B7859-B805-474B-A833-FDB15D205D40',
              MatchToDistrictZipCode: zipCode
            }
          });

          if (!xmlObject || !xmlObject.DistrictLists.DistrictInfos.DistrictInfo) {
            return res([]);
          }

          var _a = xmlObject.DistrictLists.DistrictInfos.DistrictInfo;

          var _f = district => {
            return {
              parentVueUrl: district['@_PvueURL'],
              address: district['@_Address'],
              id: district['@_DistrictID'],
              name: district['@_Name']
            };
          };

          var _r = [];

          for (var _i = 0; _i < _a.length; _i++) {
            _r.push(_f(_a[_i], _i, _a));
          }

          res(_r);
        } catch (e) {
          reject(e);
        }
      });
    }

  }

  _exports.default = StudentVue;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TdHVkZW50VnVlL1N0dWRlbnRWdWUudHMiXSwibmFtZXMiOlsiU3R1ZGVudFZ1ZSIsImxvZ2luIiwiZGlzdHJpY3RVcmwiLCJjcmVkZW50aWFscyIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJsZW5ndGgiLCJSZXF1ZXN0RXhjZXB0aW9uIiwibWVzc2FnZSIsImhvc3QiLCJ1cmwiLCJwYXJzZSIsImVuZHBvaW50IiwiY2xpZW50IiwiQ2xpZW50IiwidXNlcm5hbWUiLCJwYXNzd29yZCIsInN0dWRlbnRJbmZvIiwiZSIsImZpbmREaXN0cmljdHMiLCJ6aXBDb2RlIiwicmVqZWN0IiwieG1sT2JqZWN0Iiwic29hcCIsInByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0IiwicGFyYW1TdHIiLCJLZXkiLCJNYXRjaFRvRGlzdHJpY3RaaXBDb2RlIiwiRGlzdHJpY3RMaXN0cyIsIkRpc3RyaWN0SW5mb3MiLCJEaXN0cmljdEluZm8iLCJkaXN0cmljdCIsInBhcmVudFZ1ZVVybCIsImFkZHJlc3MiLCJpZCIsIm5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWWUsUUFBTUEsVUFBTixDQUFpQjtBQUNYLFdBQUxDLEtBQUssQ0FBQ0MsV0FBRCxFQUFzQkMsV0FBdEIsRUFBb0Y7QUFDckcsYUFBTyxJQUFJQyxPQUFKLENBQVksT0FBT0MsR0FBUCxFQUFZQyxHQUFaLEtBQW9CO0FBQ3JDLFlBQUlKLFdBQVcsQ0FBQ0ssTUFBWixLQUF1QixDQUEzQjtBQUNFLGlCQUFPRCxHQUFHLENBQUMsSUFBSUUseUJBQUosQ0FBcUI7QUFBRUMsWUFBQUEsT0FBTyxFQUFFO0FBQVgsV0FBckIsQ0FBRCxDQUFWO0FBREY7O0FBRUEsWUFBSTtBQUNGLGdCQUFNQyxJQUFJLEdBQUdDLGFBQUlDLEtBQUosQ0FBVVYsV0FBVixFQUF1QlEsSUFBcEM7O0FBQ0EsZ0JBQU1HLFFBQWdCLEdBQUksV0FBVUgsSUFBSyxnQ0FBekM7QUFDQSxnQkFBTUksTUFBTSxHQUFHLElBQUlDLGVBQUosQ0FDYjtBQUFFQyxZQUFBQSxRQUFRLEVBQUViLFdBQVcsQ0FBQ2EsUUFBeEI7QUFBa0NDLFlBQUFBLFFBQVEsRUFBRWQsV0FBVyxDQUFDYyxRQUF4RDtBQUFrRWYsWUFBQUEsV0FBVyxFQUFFVztBQUEvRSxXQURhLEVBRVosV0FBVUgsSUFBSyxHQUZILENBQWY7QUFJQSxnQkFBTVEsV0FBVyxHQUFHLE1BQU1KLE1BQU0sQ0FBQ0ksV0FBUCxFQUExQjtBQUNBYixVQUFBQSxHQUFHLENBQUMsQ0FBQ1MsTUFBRCxFQUFTSSxXQUFULENBQUQsQ0FBSDtBQUNELFNBVEQsQ0FTRSxPQUFPQyxDQUFQLEVBQVU7QUFDVmIsVUFBQUEsR0FBRyxDQUFDYSxDQUFELENBQUg7QUFDRDtBQUNGLE9BZk0sQ0FBUDtBQWdCRDs7QUFFMEIsV0FBYkMsYUFBYSxDQUFDQyxPQUFELEVBQTZDO0FBQ3RFLGFBQU8sSUFBSWpCLE9BQUosQ0FBWSxPQUFPQyxHQUFQLEVBQVlpQixNQUFaLEtBQXVCO0FBQ3hDLFlBQUk7QUFDRixnQkFBTUMsU0FBNEMsR0FBRyxNQUFNQyxjQUFLVCxNQUFMLENBQVlVLHVCQUFaLENBQ3pELCtEQUR5RCxFQUV6RDtBQUNFQyxZQUFBQSxRQUFRLEVBQUU7QUFDUkMsY0FBQUEsR0FBRyxFQUFFLHNDQURHO0FBRVJDLGNBQUFBLHNCQUFzQixFQUFFUDtBQUZoQjtBQURaLFdBRnlELENBQTNEOztBQVVBLGNBQUksQ0FBQ0UsU0FBRCxJQUFjLENBQUNBLFNBQVMsQ0FBQ00sYUFBVixDQUF3QkMsYUFBeEIsQ0FBc0NDLFlBQXpEO0FBQXVFLG1CQUFPMUIsR0FBRyxDQUFDLEVBQUQsQ0FBVjtBQUF2RTs7QUFYRSxtQkFhQWtCLFNBQVMsQ0FBQ00sYUFBVixDQUF3QkMsYUFBeEIsQ0FBc0NDLFlBYnRDOztBQUFBLG1CQWF3REMsUUFBRDtBQUFBLG1CQUFlO0FBQ3BFQyxjQUFBQSxZQUFZLEVBQUVELFFBQVEsQ0FBQyxXQUFELENBRDhDO0FBRXBFRSxjQUFBQSxPQUFPLEVBQUVGLFFBQVEsQ0FBQyxXQUFELENBRm1EO0FBR3BFRyxjQUFBQSxFQUFFLEVBQUVILFFBQVEsQ0FBQyxjQUFELENBSHdEO0FBSXBFSSxjQUFBQSxJQUFJLEVBQUVKLFFBQVEsQ0FBQyxRQUFEO0FBSnNELGFBQWY7QUFBQSxXQWJ2RDs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBWUYzQixVQUFBQSxHQUFHLElBQUg7QUFRRCxTQXBCRCxDQW9CRSxPQUFPYyxDQUFQLEVBQVU7QUFDVkcsVUFBQUEsTUFBTSxDQUFDSCxDQUFELENBQU47QUFDRDtBQUNGLE9BeEJNLENBQVA7QUF5QkQ7O0FBOUM2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNjaG9vbERpc3RyaWN0LCBVc2VyQ3JlZGVudGlhbHMgfSBmcm9tICcuL1N0dWRlbnRWdWUuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBDbGllbnQgZnJvbSAnLi9DbGllbnQvQ2xpZW50JztcclxuaW1wb3J0IHNvYXAgZnJvbSAnLi4vdXRpbHMvc29hcC9zb2FwJztcclxuaW1wb3J0IHsgRGlzdHJpY3RMaXN0WE1MT2JqZWN0IH0gZnJvbSAnLi9TdHVkZW50VnVlLnhtbCc7XHJcbmltcG9ydCBSZXF1ZXN0RXhjZXB0aW9uIGZyb20gJy4vUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcclxuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xyXG5pbXBvcnQgeyBTdHVkZW50SW5mbyB9IGZyb20gJy4vQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi9NZXNzYWdlL01lc3NhZ2UnO1xyXG5pbXBvcnQgQXR0YWNobWVudCBmcm9tICcuL0F0dGFjaG1lbnQvQXR0YWNobWVudCc7XHJcbmltcG9ydCBJY29uIGZyb20gJy4vSWNvbi9JY29uJztcclxuXHJcbmV4cG9ydCB7IENsaWVudCwgTWVzc2FnZSwgQXR0YWNobWVudCwgSWNvbiwgUmVxdWVzdEV4Y2VwdGlvbiB9O1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHVkZW50VnVlIHtcclxuICBwdWJsaWMgc3RhdGljIGxvZ2luKGRpc3RyaWN0VXJsOiBzdHJpbmcsIGNyZWRlbnRpYWxzOiBVc2VyQ3JlZGVudGlhbHMpOiBQcm9taXNlPFtDbGllbnQsIFN0dWRlbnRJbmZvXT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBpZiAoZGlzdHJpY3RVcmwubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiByZWoobmV3IFJlcXVlc3RFeGNlcHRpb24oeyBtZXNzYWdlOiAnRGlzdHJpY3QgVVJMIGNhbm5vdCBiZSBhbiBlbXB0eSBzdHJpbmcnIH0pKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBob3N0ID0gdXJsLnBhcnNlKGRpc3RyaWN0VXJsKS5ob3N0O1xyXG4gICAgICAgIGNvbnN0IGVuZHBvaW50OiBzdHJpbmcgPSBgaHR0cHM6Ly8ke2hvc3R9L1NlcnZpY2UvUFhQQ29tbXVuaWNhdGlvbi5hc214YDtcclxuICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KFxyXG4gICAgICAgICAgeyB1c2VybmFtZTogY3JlZGVudGlhbHMudXNlcm5hbWUsIHBhc3N3b3JkOiBjcmVkZW50aWFscy5wYXNzd29yZCwgZGlzdHJpY3RVcmw6IGVuZHBvaW50IH0sXHJcbiAgICAgICAgICBgaHR0cHM6Ly8ke2hvc3R9L2BcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHN0dWRlbnRJbmZvID0gYXdhaXQgY2xpZW50LnN0dWRlbnRJbmZvKCk7XHJcbiAgICAgICAgcmVzKFtjbGllbnQsIHN0dWRlbnRJbmZvXSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBmaW5kRGlzdHJpY3RzKHppcENvZGU6IHN0cmluZyk6IFByb21pc2U8U2Nob29sRGlzdHJpY3RbXT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXMsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHhtbE9iamVjdDogRGlzdHJpY3RMaXN0WE1MT2JqZWN0IHwgdW5kZWZpbmVkID0gYXdhaXQgc29hcC5DbGllbnQucHJvY2Vzc0Fub255bW91c1JlcXVlc3QoXHJcbiAgICAgICAgICAnaHR0cHM6Ly9zdXBwb3J0LmVkdXBvaW50LmNvbS9TZXJ2aWNlL0hESW5mb0NvbW11bmljYXRpb24uYXNteCcsXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHBhcmFtU3RyOiB7XHJcbiAgICAgICAgICAgICAgS2V5OiAnNUU0Qjc4NTktQjgwNS00NzRCLUE4MzMtRkRCMTVEMjA1RDQwJyxcclxuICAgICAgICAgICAgICBNYXRjaFRvRGlzdHJpY3RaaXBDb2RlOiB6aXBDb2RlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICgheG1sT2JqZWN0IHx8ICF4bWxPYmplY3QuRGlzdHJpY3RMaXN0cy5EaXN0cmljdEluZm9zLkRpc3RyaWN0SW5mbykgcmV0dXJuIHJlcyhbXSk7XHJcbiAgICAgICAgcmVzKFxyXG4gICAgICAgICAgeG1sT2JqZWN0LkRpc3RyaWN0TGlzdHMuRGlzdHJpY3RJbmZvcy5EaXN0cmljdEluZm8ubWFwKChkaXN0cmljdCkgPT4gKHtcclxuICAgICAgICAgICAgcGFyZW50VnVlVXJsOiBkaXN0cmljdFsnQF9QdnVlVVJMJ10sXHJcbiAgICAgICAgICAgIGFkZHJlc3M6IGRpc3RyaWN0WydAX0FkZHJlc3MnXSxcclxuICAgICAgICAgICAgaWQ6IGRpc3RyaWN0WydAX0Rpc3RyaWN0SUQnXSxcclxuICAgICAgICAgICAgbmFtZTogZGlzdHJpY3RbJ0BfTmFtZSddLFxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlamVjdChlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==