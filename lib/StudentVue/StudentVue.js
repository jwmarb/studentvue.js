(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./Client/Client", "../utils/soap/soap", "./RequestException/RequestException", "url"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./Client/Client"), require("../utils/soap/soap"), require("./RequestException/RequestException"), require("url"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Client, global.soap, global.RequestException, global.url);
    global.StudentVue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _Client, _soap, _RequestException, _url) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Client = _interopRequireDefault(_Client);
  _soap = _interopRequireDefault(_soap);
  _RequestException = _interopRequireDefault(_RequestException);
  _url = _interopRequireDefault(_url);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TdHVkZW50VnVlL1N0dWRlbnRWdWUudHMiXSwibmFtZXMiOlsiU3R1ZGVudFZ1ZSIsImxvZ2luIiwiZGlzdHJpY3RVcmwiLCJjcmVkZW50aWFscyIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJsZW5ndGgiLCJSZXF1ZXN0RXhjZXB0aW9uIiwibWVzc2FnZSIsImhvc3QiLCJ1cmwiLCJwYXJzZSIsImVuZHBvaW50IiwiY2xpZW50IiwiQ2xpZW50IiwidXNlcm5hbWUiLCJwYXNzd29yZCIsInN0dWRlbnRJbmZvIiwiZSIsImZpbmREaXN0cmljdHMiLCJ6aXBDb2RlIiwicmVqZWN0IiwieG1sT2JqZWN0Iiwic29hcCIsInByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0IiwicGFyYW1TdHIiLCJLZXkiLCJNYXRjaFRvRGlzdHJpY3RaaXBDb2RlIiwiRGlzdHJpY3RMaXN0cyIsIkRpc3RyaWN0SW5mb3MiLCJEaXN0cmljdEluZm8iLCJkaXN0cmljdCIsInBhcmVudFZ1ZVVybCIsImFkZHJlc3MiLCJpZCIsIm5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUWUsUUFBTUEsVUFBTixDQUFpQjtBQUNYLFdBQUxDLEtBQUssQ0FBQ0MsV0FBRCxFQUFzQkMsV0FBdEIsRUFBb0Y7QUFDckcsYUFBTyxJQUFJQyxPQUFKLENBQVksT0FBT0MsR0FBUCxFQUFZQyxHQUFaLEtBQW9CO0FBQ3JDLFlBQUlKLFdBQVcsQ0FBQ0ssTUFBWixLQUF1QixDQUEzQjtBQUNFLGlCQUFPRCxHQUFHLENBQUMsSUFBSUUseUJBQUosQ0FBcUI7QUFBRUMsWUFBQUEsT0FBTyxFQUFFO0FBQVgsV0FBckIsQ0FBRCxDQUFWO0FBREY7O0FBRUEsWUFBSTtBQUNGLGdCQUFNQyxJQUFJLEdBQUdDLGFBQUlDLEtBQUosQ0FBVVYsV0FBVixFQUF1QlEsSUFBcEM7O0FBQ0EsZ0JBQU1HLFFBQWdCLEdBQUksV0FBVUgsSUFBSyxnQ0FBekM7QUFDQSxnQkFBTUksTUFBTSxHQUFHLElBQUlDLGVBQUosQ0FDYjtBQUFFQyxZQUFBQSxRQUFRLEVBQUViLFdBQVcsQ0FBQ2EsUUFBeEI7QUFBa0NDLFlBQUFBLFFBQVEsRUFBRWQsV0FBVyxDQUFDYyxRQUF4RDtBQUFrRWYsWUFBQUEsV0FBVyxFQUFFVztBQUEvRSxXQURhLEVBRVosV0FBVUgsSUFBSyxHQUZILENBQWY7QUFJQSxnQkFBTVEsV0FBVyxHQUFHLE1BQU1KLE1BQU0sQ0FBQ0ksV0FBUCxFQUExQjtBQUNBYixVQUFBQSxHQUFHLENBQUMsQ0FBQ1MsTUFBRCxFQUFTSSxXQUFULENBQUQsQ0FBSDtBQUNELFNBVEQsQ0FTRSxPQUFPQyxDQUFQLEVBQVU7QUFDVmIsVUFBQUEsR0FBRyxDQUFDYSxDQUFELENBQUg7QUFDRDtBQUNGLE9BZk0sQ0FBUDtBQWdCRDs7QUFFMEIsV0FBYkMsYUFBYSxDQUFDQyxPQUFELEVBQTZDO0FBQ3RFLGFBQU8sSUFBSWpCLE9BQUosQ0FBWSxPQUFPQyxHQUFQLEVBQVlpQixNQUFaLEtBQXVCO0FBQ3hDLFlBQUk7QUFDRixnQkFBTUMsU0FBNEMsR0FBRyxNQUFNQyxjQUFLVCxNQUFMLENBQVlVLHVCQUFaLENBQ3pELCtEQUR5RCxFQUV6RDtBQUNFQyxZQUFBQSxRQUFRLEVBQUU7QUFDUkMsY0FBQUEsR0FBRyxFQUFFLHNDQURHO0FBRVJDLGNBQUFBLHNCQUFzQixFQUFFUDtBQUZoQjtBQURaLFdBRnlELENBQTNEOztBQVVBLGNBQUksQ0FBQ0UsU0FBRCxJQUFjLENBQUNBLFNBQVMsQ0FBQ00sYUFBVixDQUF3QkMsYUFBeEIsQ0FBc0NDLFlBQXpEO0FBQXVFLG1CQUFPMUIsR0FBRyxDQUFDLEVBQUQsQ0FBVjtBQUF2RTs7QUFYRSxtQkFhQWtCLFNBQVMsQ0FBQ00sYUFBVixDQUF3QkMsYUFBeEIsQ0FBc0NDLFlBYnRDOztBQUFBLG1CQWF3REMsUUFBRDtBQUFBLG1CQUFlO0FBQ3BFQyxjQUFBQSxZQUFZLEVBQUVELFFBQVEsQ0FBQyxXQUFELENBRDhDO0FBRXBFRSxjQUFBQSxPQUFPLEVBQUVGLFFBQVEsQ0FBQyxXQUFELENBRm1EO0FBR3BFRyxjQUFBQSxFQUFFLEVBQUVILFFBQVEsQ0FBQyxjQUFELENBSHdEO0FBSXBFSSxjQUFBQSxJQUFJLEVBQUVKLFFBQVEsQ0FBQyxRQUFEO0FBSnNELGFBQWY7QUFBQSxXQWJ2RDs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBWUYzQixVQUFBQSxHQUFHLElBQUg7QUFRRCxTQXBCRCxDQW9CRSxPQUFPYyxDQUFQLEVBQVU7QUFDVkcsVUFBQUEsTUFBTSxDQUFDSCxDQUFELENBQU47QUFDRDtBQUNGLE9BeEJNLENBQVA7QUF5QkQ7O0FBOUM2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNjaG9vbERpc3RyaWN0LCBVc2VyQ3JlZGVudGlhbHMgfSBmcm9tICcuL1N0dWRlbnRWdWUuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBDbGllbnQgZnJvbSAnLi9DbGllbnQvQ2xpZW50JztcclxuaW1wb3J0IHNvYXAgZnJvbSAnLi4vdXRpbHMvc29hcC9zb2FwJztcclxuaW1wb3J0IHsgRGlzdHJpY3RMaXN0WE1MT2JqZWN0IH0gZnJvbSAnLi9TdHVkZW50VnVlLnhtbCc7XHJcbmltcG9ydCBSZXF1ZXN0RXhjZXB0aW9uIGZyb20gJy4vUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcclxuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xyXG5pbXBvcnQgeyBTdHVkZW50SW5mbyB9IGZyb20gJy4vQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0dWRlbnRWdWUge1xyXG4gIHB1YmxpYyBzdGF0aWMgbG9naW4oZGlzdHJpY3RVcmw6IHN0cmluZywgY3JlZGVudGlhbHM6IFVzZXJDcmVkZW50aWFscyk6IFByb21pc2U8W0NsaWVudCwgU3R1ZGVudEluZm9dPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIGlmIChkaXN0cmljdFVybC5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuIHJlaihuZXcgUmVxdWVzdEV4Y2VwdGlvbih7IG1lc3NhZ2U6ICdEaXN0cmljdCBVUkwgY2Fubm90IGJlIGFuIGVtcHR5IHN0cmluZycgfSkpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGhvc3QgPSB1cmwucGFyc2UoZGlzdHJpY3RVcmwpLmhvc3Q7XHJcbiAgICAgICAgY29uc3QgZW5kcG9pbnQ6IHN0cmluZyA9IGBodHRwczovLyR7aG9zdH0vU2VydmljZS9QWFBDb21tdW5pY2F0aW9uLmFzbXhgO1xyXG4gICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoXHJcbiAgICAgICAgICB7IHVzZXJuYW1lOiBjcmVkZW50aWFscy51c2VybmFtZSwgcGFzc3dvcmQ6IGNyZWRlbnRpYWxzLnBhc3N3b3JkLCBkaXN0cmljdFVybDogZW5kcG9pbnQgfSxcclxuICAgICAgICAgIGBodHRwczovLyR7aG9zdH0vYFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29uc3Qgc3R1ZGVudEluZm8gPSBhd2FpdCBjbGllbnQuc3R1ZGVudEluZm8oKTtcclxuICAgICAgICByZXMoW2NsaWVudCwgc3R1ZGVudEluZm9dKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlaihlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGZpbmREaXN0cmljdHMoemlwQ29kZTogc3RyaW5nKTogUHJvbWlzZTxTY2hvb2xEaXN0cmljdFtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcywgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeG1sT2JqZWN0OiBEaXN0cmljdExpc3RYTUxPYmplY3QgfCB1bmRlZmluZWQgPSBhd2FpdCBzb2FwLkNsaWVudC5wcm9jZXNzQW5vbnltb3VzUmVxdWVzdChcclxuICAgICAgICAgICdodHRwczovL3N1cHBvcnQuZWR1cG9pbnQuY29tL1NlcnZpY2UvSERJbmZvQ29tbXVuaWNhdGlvbi5hc214JyxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgcGFyYW1TdHI6IHtcclxuICAgICAgICAgICAgICBLZXk6ICc1RTRCNzg1OS1CODA1LTQ3NEItQTgzMy1GREIxNUQyMDVENDAnLFxyXG4gICAgICAgICAgICAgIE1hdGNoVG9EaXN0cmljdFppcENvZGU6IHppcENvZGUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCF4bWxPYmplY3QgfHwgIXhtbE9iamVjdC5EaXN0cmljdExpc3RzLkRpc3RyaWN0SW5mb3MuRGlzdHJpY3RJbmZvKSByZXR1cm4gcmVzKFtdKTtcclxuICAgICAgICByZXMoXHJcbiAgICAgICAgICB4bWxPYmplY3QuRGlzdHJpY3RMaXN0cy5EaXN0cmljdEluZm9zLkRpc3RyaWN0SW5mby5tYXAoKGRpc3RyaWN0KSA9PiAoe1xyXG4gICAgICAgICAgICBwYXJlbnRWdWVVcmw6IGRpc3RyaWN0WydAX1B2dWVVUkwnXSxcclxuICAgICAgICAgICAgYWRkcmVzczogZGlzdHJpY3RbJ0BfQWRkcmVzcyddLFxyXG4gICAgICAgICAgICBpZDogZGlzdHJpY3RbJ0BfRGlzdHJpY3RJRCddLFxyXG4gICAgICAgICAgICBuYW1lOiBkaXN0cmljdFsnQF9OYW1lJ10sXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICApO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19