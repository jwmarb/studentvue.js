(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./Client/Client", "../utils/soap/soap", "./RequestException/RequestException"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./Client/Client"), require("../utils/soap/soap"), require("./RequestException/RequestException"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Client, global.soap, global.RequestException);
    global.StudentVue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _Client, _soap, _RequestException) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.findDistricts = findDistricts;
  _exports.login = login;
  _Client = _interopRequireDefault(_Client);
  _soap = _interopRequireDefault(_soap);
  _RequestException = _interopRequireDefault(_RequestException);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /** @module StudentVue */

  /**
   * Login to the StudentVUE API
   * @param {string} districtUrl The URL of the district which can be found using `findDistricts()` method
   * @param {UserCredentials} credentials User credentials of the student
   * @returns {Promise<Client>} Returns the client and the information of the student upon successful login
   */
  function login(districtUrl, credentials) {
    return new Promise((res, rej) => {
      if (districtUrl.length === 0) {
        return rej(new _RequestException.default({
          message: 'District URL cannot be an empty string'
        }));
      }

      const host = new URL(districtUrl).host;
      const endpoint = `https://${host}/Service/PXPCommunication.asmx`;
      const client = new _Client.default({
        username: credentials.username,
        password: credentials.password,
        districtUrl: endpoint,
        isParent: credentials.isParent
      }, `https://${host}/`);
      client.validateCredentials().then(() => {
        res(client);
      }).catch(rej);
    });
  }
  /**
   * Find school districts using a zipcode
   * @param {string} zipCode The zipcode to get a list of schools from
   * @returns {Promise<SchoolDistrict[]>} Returns a list of school districts which can be used to login to the API
   */


  function findDistricts(zipCode) {
    return new Promise((res, reject) => {
      _soap.default.Client.processAnonymousRequest('https://support.edupoint.com/Service/HDInfoCommunication.asmx', {
        paramStr: {
          Key: '5E4B7859-B805-474B-A833-FDB15D205D40',
          MatchToDistrictZipCode: zipCode
        }
      }).then(xmlObject => {
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
      }).catch(reject);
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TdHVkZW50VnVlL1N0dWRlbnRWdWUudHMiXSwibmFtZXMiOlsibG9naW4iLCJkaXN0cmljdFVybCIsImNyZWRlbnRpYWxzIiwiUHJvbWlzZSIsInJlcyIsInJlaiIsImxlbmd0aCIsIlJlcXVlc3RFeGNlcHRpb24iLCJtZXNzYWdlIiwiaG9zdCIsIlVSTCIsImVuZHBvaW50IiwiY2xpZW50IiwiQ2xpZW50IiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImlzUGFyZW50IiwidmFsaWRhdGVDcmVkZW50aWFscyIsInRoZW4iLCJjYXRjaCIsImZpbmREaXN0cmljdHMiLCJ6aXBDb2RlIiwicmVqZWN0Iiwic29hcCIsInByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0IiwicGFyYW1TdHIiLCJLZXkiLCJNYXRjaFRvRGlzdHJpY3RaaXBDb2RlIiwieG1sT2JqZWN0IiwiRGlzdHJpY3RMaXN0cyIsIkRpc3RyaWN0SW5mb3MiLCJEaXN0cmljdEluZm8iLCJkaXN0cmljdCIsInBhcmVudFZ1ZVVybCIsImFkZHJlc3MiLCJpZCIsIm5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sV0FBU0EsS0FBVCxDQUFlQyxXQUFmLEVBQW9DQyxXQUFwQyxFQUFtRjtBQUN4RixXQUFPLElBQUlDLE9BQUosQ0FBWSxDQUFDQyxHQUFELEVBQU1DLEdBQU4sS0FBYztBQUMvQixVQUFJSixXQUFXLENBQUNLLE1BQVosS0FBdUIsQ0FBM0I7QUFDRSxlQUFPRCxHQUFHLENBQUMsSUFBSUUseUJBQUosQ0FBcUI7QUFBRUMsVUFBQUEsT0FBTyxFQUFFO0FBQVgsU0FBckIsQ0FBRCxDQUFWO0FBREY7O0FBRUEsWUFBTUMsSUFBSSxHQUFHLElBQUlDLEdBQUosQ0FBUVQsV0FBUixFQUFxQlEsSUFBbEM7QUFDQSxZQUFNRSxRQUFRLEdBQUksV0FBVUYsSUFBSyxnQ0FBakM7QUFDQSxZQUFNRyxNQUFNLEdBQUcsSUFBSUMsZUFBSixDQUNiO0FBQ0VDLFFBQUFBLFFBQVEsRUFBRVosV0FBVyxDQUFDWSxRQUR4QjtBQUVFQyxRQUFBQSxRQUFRLEVBQUViLFdBQVcsQ0FBQ2EsUUFGeEI7QUFHRWQsUUFBQUEsV0FBVyxFQUFFVSxRQUhmO0FBSUVLLFFBQUFBLFFBQVEsRUFBRWQsV0FBVyxDQUFDYztBQUp4QixPQURhLEVBT1osV0FBVVAsSUFBSyxHQVBILENBQWY7QUFTQUcsTUFBQUEsTUFBTSxDQUNISyxtQkFESCxHQUVHQyxJQUZILENBRVEsTUFBTTtBQUNWZCxRQUFBQSxHQUFHLENBQUNRLE1BQUQsQ0FBSDtBQUNELE9BSkgsRUFLR08sS0FMSCxDQUtTZCxHQUxUO0FBTUQsS0FwQk0sQ0FBUDtBQXFCRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFdBQVNlLGFBQVQsQ0FBdUJDLE9BQXZCLEVBQW1FO0FBQ3hFLFdBQU8sSUFBSWxCLE9BQUosQ0FBWSxDQUFDQyxHQUFELEVBQU1rQixNQUFOLEtBQWlCO0FBQ2xDQyxvQkFBS1YsTUFBTCxDQUFZVyx1QkFBWixDQUNFLCtEQURGLEVBRUU7QUFDRUMsUUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFVBQUFBLEdBQUcsRUFBRSxzQ0FERztBQUVSQyxVQUFBQSxzQkFBc0IsRUFBRU47QUFGaEI7QUFEWixPQUZGLEVBU0dILElBVEgsQ0FTU1UsU0FBRCxJQUFlO0FBQ25CLFlBQUksQ0FBQ0EsU0FBRCxJQUFjLENBQUNBLFNBQVMsQ0FBQ0MsYUFBVixDQUF3QkMsYUFBeEIsQ0FBc0NDLFlBQXpEO0FBQXVFLGlCQUFPM0IsR0FBRyxDQUFDLEVBQUQsQ0FBVjtBQUF2RTs7QUFEbUIsaUJBR2pCd0IsU0FBUyxDQUFDQyxhQUFWLENBQXdCQyxhQUF4QixDQUFzQ0MsWUFIckI7O0FBQUEsaUJBR3VDQyxRQUFEO0FBQUEsaUJBQWU7QUFDcEVDLFlBQUFBLFlBQVksRUFBRUQsUUFBUSxDQUFDLFdBQUQsQ0FEOEM7QUFFcEVFLFlBQUFBLE9BQU8sRUFBRUYsUUFBUSxDQUFDLFdBQUQsQ0FGbUQ7QUFHcEVHLFlBQUFBLEVBQUUsRUFBRUgsUUFBUSxDQUFDLGNBQUQsQ0FId0Q7QUFJcEVJLFlBQUFBLElBQUksRUFBRUosUUFBUSxDQUFDLFFBQUQ7QUFKc0QsV0FBZjtBQUFBLFNBSHRDOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFFbkI1QixRQUFBQSxHQUFHLElBQUg7QUFRRCxPQW5CSCxFQW9CR2UsS0FwQkgsQ0FvQlNHLE1BcEJUO0FBcUJELEtBdEJNLENBQVA7QUF1QkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTY2hvb2xEaXN0cmljdCwgVXNlckNyZWRlbnRpYWxzIH0gZnJvbSAnLi9TdHVkZW50VnVlLmludGVyZmFjZXMnO1xyXG5pbXBvcnQgQ2xpZW50IGZyb20gJy4vQ2xpZW50L0NsaWVudCc7XHJcbmltcG9ydCBzb2FwIGZyb20gJy4uL3V0aWxzL3NvYXAvc29hcCc7XHJcbmltcG9ydCB7IERpc3RyaWN0TGlzdFhNTE9iamVjdCB9IGZyb20gJy4vU3R1ZGVudFZ1ZS54bWwnO1xyXG5pbXBvcnQgUmVxdWVzdEV4Y2VwdGlvbiBmcm9tICcuL1JlcXVlc3RFeGNlcHRpb24vUmVxdWVzdEV4Y2VwdGlvbic7XHJcblxyXG4vKiogQG1vZHVsZSBTdHVkZW50VnVlICovXHJcblxyXG4vKipcclxuICogTG9naW4gdG8gdGhlIFN0dWRlbnRWVUUgQVBJXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkaXN0cmljdFVybCBUaGUgVVJMIG9mIHRoZSBkaXN0cmljdCB3aGljaCBjYW4gYmUgZm91bmQgdXNpbmcgYGZpbmREaXN0cmljdHMoKWAgbWV0aG9kXHJcbiAqIEBwYXJhbSB7VXNlckNyZWRlbnRpYWxzfSBjcmVkZW50aWFscyBVc2VyIGNyZWRlbnRpYWxzIG9mIHRoZSBzdHVkZW50XHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPENsaWVudD59IFJldHVybnMgdGhlIGNsaWVudCBhbmQgdGhlIGluZm9ybWF0aW9uIG9mIHRoZSBzdHVkZW50IHVwb24gc3VjY2Vzc2Z1bCBsb2dpblxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2luKGRpc3RyaWN0VXJsOiBzdHJpbmcsIGNyZWRlbnRpYWxzOiBVc2VyQ3JlZGVudGlhbHMpOiBQcm9taXNlPENsaWVudD4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgIGlmIChkaXN0cmljdFVybC5sZW5ndGggPT09IDApXHJcbiAgICAgIHJldHVybiByZWoobmV3IFJlcXVlc3RFeGNlcHRpb24oeyBtZXNzYWdlOiAnRGlzdHJpY3QgVVJMIGNhbm5vdCBiZSBhbiBlbXB0eSBzdHJpbmcnIH0pKTtcclxuICAgIGNvbnN0IGhvc3QgPSBuZXcgVVJMKGRpc3RyaWN0VXJsKS5ob3N0O1xyXG4gICAgY29uc3QgZW5kcG9pbnQgPSBgaHR0cHM6Ly8ke2hvc3R9L1NlcnZpY2UvUFhQQ29tbXVuaWNhdGlvbi5hc214YDtcclxuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoXHJcbiAgICAgIHtcclxuICAgICAgICB1c2VybmFtZTogY3JlZGVudGlhbHMudXNlcm5hbWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IGNyZWRlbnRpYWxzLnBhc3N3b3JkLFxyXG4gICAgICAgIGRpc3RyaWN0VXJsOiBlbmRwb2ludCxcclxuICAgICAgICBpc1BhcmVudDogY3JlZGVudGlhbHMuaXNQYXJlbnQsXHJcbiAgICAgIH0sXHJcbiAgICAgIGBodHRwczovLyR7aG9zdH0vYFxyXG4gICAgKTtcclxuICAgIGNsaWVudFxyXG4gICAgICAudmFsaWRhdGVDcmVkZW50aWFscygpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICByZXMoY2xpZW50KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKHJlaik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGaW5kIHNjaG9vbCBkaXN0cmljdHMgdXNpbmcgYSB6aXBjb2RlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB6aXBDb2RlIFRoZSB6aXBjb2RlIHRvIGdldCBhIGxpc3Qgb2Ygc2Nob29scyBmcm9tXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPFNjaG9vbERpc3RyaWN0W10+fSBSZXR1cm5zIGEgbGlzdCBvZiBzY2hvb2wgZGlzdHJpY3RzIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGxvZ2luIHRvIHRoZSBBUElcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kRGlzdHJpY3RzKHppcENvZGU6IHN0cmluZyk6IFByb21pc2U8U2Nob29sRGlzdHJpY3RbXT4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWplY3QpID0+IHtcclxuICAgIHNvYXAuQ2xpZW50LnByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0PERpc3RyaWN0TGlzdFhNTE9iamVjdCB8IHVuZGVmaW5lZD4oXHJcbiAgICAgICdodHRwczovL3N1cHBvcnQuZWR1cG9pbnQuY29tL1NlcnZpY2UvSERJbmZvQ29tbXVuaWNhdGlvbi5hc214JyxcclxuICAgICAge1xyXG4gICAgICAgIHBhcmFtU3RyOiB7XHJcbiAgICAgICAgICBLZXk6ICc1RTRCNzg1OS1CODA1LTQ3NEItQTgzMy1GREIxNUQyMDVENDAnLFxyXG4gICAgICAgICAgTWF0Y2hUb0Rpc3RyaWN0WmlwQ29kZTogemlwQ29kZSxcclxuICAgICAgICB9LFxyXG4gICAgICB9XHJcbiAgICApXHJcbiAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcclxuICAgICAgICBpZiAoIXhtbE9iamVjdCB8fCAheG1sT2JqZWN0LkRpc3RyaWN0TGlzdHMuRGlzdHJpY3RJbmZvcy5EaXN0cmljdEluZm8pIHJldHVybiByZXMoW10pO1xyXG4gICAgICAgIHJlcyhcclxuICAgICAgICAgIHhtbE9iamVjdC5EaXN0cmljdExpc3RzLkRpc3RyaWN0SW5mb3MuRGlzdHJpY3RJbmZvLm1hcCgoZGlzdHJpY3QpID0+ICh7XHJcbiAgICAgICAgICAgIHBhcmVudFZ1ZVVybDogZGlzdHJpY3RbJ0BfUHZ1ZVVSTCddLFxyXG4gICAgICAgICAgICBhZGRyZXNzOiBkaXN0cmljdFsnQF9BZGRyZXNzJ10sXHJcbiAgICAgICAgICAgIGlkOiBkaXN0cmljdFsnQF9EaXN0cmljdElEJ10sXHJcbiAgICAgICAgICAgIG5hbWU6IGRpc3RyaWN0WydAX05hbWUnXSxcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChyZWplY3QpO1xyXG4gIH0pO1xyXG59XHJcbiJdfQ==