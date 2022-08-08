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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TdHVkZW50VnVlL1N0dWRlbnRWdWUudHMiXSwibmFtZXMiOlsibG9naW4iLCJkaXN0cmljdFVybCIsImNyZWRlbnRpYWxzIiwiUHJvbWlzZSIsInJlcyIsInJlaiIsImxlbmd0aCIsIlJlcXVlc3RFeGNlcHRpb24iLCJtZXNzYWdlIiwiaG9zdCIsIlVSTCIsImVuZHBvaW50IiwiY2xpZW50IiwiQ2xpZW50IiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImlzUGFyZW50IiwidmFsaWRhdGVDcmVkZW50aWFscyIsInRoZW4iLCJjYXRjaCIsImZpbmREaXN0cmljdHMiLCJ6aXBDb2RlIiwicmVqZWN0Iiwic29hcCIsInByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0IiwicGFyYW1TdHIiLCJLZXkiLCJNYXRjaFRvRGlzdHJpY3RaaXBDb2RlIiwieG1sT2JqZWN0IiwiRGlzdHJpY3RMaXN0cyIsIkRpc3RyaWN0SW5mb3MiLCJEaXN0cmljdEluZm8iLCJkaXN0cmljdCIsInBhcmVudFZ1ZVVybCIsImFkZHJlc3MiLCJpZCIsIm5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sV0FBU0EsS0FBVCxDQUFlQyxXQUFmLEVBQW9DQyxXQUFwQyxFQUFtRjtBQUN4RixXQUFPLElBQUlDLE9BQUosQ0FBWSxDQUFDQyxHQUFELEVBQU1DLEdBQU4sS0FBYztBQUMvQixVQUFJSixXQUFXLENBQUNLLE1BQVosS0FBdUIsQ0FBM0I7QUFDRSxlQUFPRCxHQUFHLENBQUMsSUFBSUUseUJBQUosQ0FBcUI7QUFBRUMsVUFBQUEsT0FBTyxFQUFFO0FBQVgsU0FBckIsQ0FBRCxDQUFWO0FBREY7O0FBRUEsWUFBTUMsSUFBSSxHQUFHLElBQUlDLEdBQUosQ0FBUVQsV0FBUixFQUFxQlEsSUFBbEM7QUFDQSxZQUFNRSxRQUFRLEdBQUksV0FBVUYsSUFBSyxnQ0FBakM7QUFDQSxZQUFNRyxNQUFNLEdBQUcsSUFBSUMsZUFBSixDQUNiO0FBQ0VDLFFBQUFBLFFBQVEsRUFBRVosV0FBVyxDQUFDWSxRQUR4QjtBQUVFQyxRQUFBQSxRQUFRLEVBQUViLFdBQVcsQ0FBQ2EsUUFGeEI7QUFHRWQsUUFBQUEsV0FBVyxFQUFFVSxRQUhmO0FBSUVLLFFBQUFBLFFBQVEsRUFBRWQsV0FBVyxDQUFDYztBQUp4QixPQURhLEVBT1osV0FBVVAsSUFBSyxHQVBILENBQWY7QUFTQUcsTUFBQUEsTUFBTSxDQUNISyxtQkFESCxHQUVHQyxJQUZILENBRVEsTUFBTTtBQUNWZCxRQUFBQSxHQUFHLENBQUNRLE1BQUQsQ0FBSDtBQUNELE9BSkgsRUFLR08sS0FMSCxDQUtTZCxHQUxUO0FBTUQsS0FwQk0sQ0FBUDtBQXFCRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFdBQVNlLGFBQVQsQ0FBdUJDLE9BQXZCLEVBQW1FO0FBQ3hFLFdBQU8sSUFBSWxCLE9BQUosQ0FBWSxDQUFDQyxHQUFELEVBQU1rQixNQUFOLEtBQWlCO0FBQ2xDQyxvQkFBS1YsTUFBTCxDQUFZVyx1QkFBWixDQUNFLCtEQURGLEVBRUU7QUFDRUMsUUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFVBQUFBLEdBQUcsRUFBRSxzQ0FERztBQUVSQyxVQUFBQSxzQkFBc0IsRUFBRU47QUFGaEI7QUFEWixPQUZGLEVBU0dILElBVEgsQ0FTU1UsU0FBRCxJQUFlO0FBQ25CLFlBQUksQ0FBQ0EsU0FBRCxJQUFjLENBQUNBLFNBQVMsQ0FBQ0MsYUFBVixDQUF3QkMsYUFBeEIsQ0FBc0NDLFlBQXpEO0FBQXVFLGlCQUFPM0IsR0FBRyxDQUFDLEVBQUQsQ0FBVjtBQUF2RTs7QUFEbUIsaUJBR2pCd0IsU0FBUyxDQUFDQyxhQUFWLENBQXdCQyxhQUF4QixDQUFzQ0MsWUFIckI7O0FBQUEsaUJBR3VDQyxRQUFEO0FBQUEsaUJBQWU7QUFDcEVDLFlBQUFBLFlBQVksRUFBRUQsUUFBUSxDQUFDLFdBQUQsQ0FEOEM7QUFFcEVFLFlBQUFBLE9BQU8sRUFBRUYsUUFBUSxDQUFDLFdBQUQsQ0FGbUQ7QUFHcEVHLFlBQUFBLEVBQUUsRUFBRUgsUUFBUSxDQUFDLGNBQUQsQ0FId0Q7QUFJcEVJLFlBQUFBLElBQUksRUFBRUosUUFBUSxDQUFDLFFBQUQ7QUFKc0QsV0FBZjtBQUFBLFNBSHRDOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFFbkI1QixRQUFBQSxHQUFHLElBQUg7QUFRRCxPQW5CSCxFQW9CR2UsS0FwQkgsQ0FvQlNHLE1BcEJUO0FBcUJELEtBdEJNLENBQVA7QUF1QkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTY2hvb2xEaXN0cmljdCwgVXNlckNyZWRlbnRpYWxzIH0gZnJvbSAnLi9TdHVkZW50VnVlLmludGVyZmFjZXMnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudC9DbGllbnQnO1xuaW1wb3J0IHNvYXAgZnJvbSAnLi4vdXRpbHMvc29hcC9zb2FwJztcbmltcG9ydCB7IERpc3RyaWN0TGlzdFhNTE9iamVjdCB9IGZyb20gJy4vU3R1ZGVudFZ1ZS54bWwnO1xuaW1wb3J0IFJlcXVlc3RFeGNlcHRpb24gZnJvbSAnLi9SZXF1ZXN0RXhjZXB0aW9uL1JlcXVlc3RFeGNlcHRpb24nO1xuXG4vKiogQG1vZHVsZSBTdHVkZW50VnVlICovXG5cbi8qKlxuICogTG9naW4gdG8gdGhlIFN0dWRlbnRWVUUgQVBJXG4gKiBAcGFyYW0ge3N0cmluZ30gZGlzdHJpY3RVcmwgVGhlIFVSTCBvZiB0aGUgZGlzdHJpY3Qgd2hpY2ggY2FuIGJlIGZvdW5kIHVzaW5nIGBmaW5kRGlzdHJpY3RzKClgIG1ldGhvZFxuICogQHBhcmFtIHtVc2VyQ3JlZGVudGlhbHN9IGNyZWRlbnRpYWxzIFVzZXIgY3JlZGVudGlhbHMgb2YgdGhlIHN0dWRlbnRcbiAqIEByZXR1cm5zIHtQcm9taXNlPENsaWVudD59IFJldHVybnMgdGhlIGNsaWVudCBhbmQgdGhlIGluZm9ybWF0aW9uIG9mIHRoZSBzdHVkZW50IHVwb24gc3VjY2Vzc2Z1bCBsb2dpblxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9naW4oZGlzdHJpY3RVcmw6IHN0cmluZywgY3JlZGVudGlhbHM6IFVzZXJDcmVkZW50aWFscyk6IFByb21pc2U8Q2xpZW50PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICBpZiAoZGlzdHJpY3RVcmwubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHJlaihuZXcgUmVxdWVzdEV4Y2VwdGlvbih7IG1lc3NhZ2U6ICdEaXN0cmljdCBVUkwgY2Fubm90IGJlIGFuIGVtcHR5IHN0cmluZycgfSkpO1xuICAgIGNvbnN0IGhvc3QgPSBuZXcgVVJMKGRpc3RyaWN0VXJsKS5ob3N0O1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYGh0dHBzOi8vJHtob3N0fS9TZXJ2aWNlL1BYUENvbW11bmljYXRpb24uYXNteGA7XG4gICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudChcbiAgICAgIHtcbiAgICAgICAgdXNlcm5hbWU6IGNyZWRlbnRpYWxzLnVzZXJuYW1lLFxuICAgICAgICBwYXNzd29yZDogY3JlZGVudGlhbHMucGFzc3dvcmQsXG4gICAgICAgIGRpc3RyaWN0VXJsOiBlbmRwb2ludCxcbiAgICAgICAgaXNQYXJlbnQ6IGNyZWRlbnRpYWxzLmlzUGFyZW50LFxuICAgICAgfSxcbiAgICAgIGBodHRwczovLyR7aG9zdH0vYFxuICAgICk7XG4gICAgY2xpZW50XG4gICAgICAudmFsaWRhdGVDcmVkZW50aWFscygpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHJlcyhjbGllbnQpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChyZWopO1xuICB9KTtcbn1cblxuLyoqXG4gKiBGaW5kIHNjaG9vbCBkaXN0cmljdHMgdXNpbmcgYSB6aXBjb2RlXG4gKiBAcGFyYW0ge3N0cmluZ30gemlwQ29kZSBUaGUgemlwY29kZSB0byBnZXQgYSBsaXN0IG9mIHNjaG9vbHMgZnJvbVxuICogQHJldHVybnMge1Byb21pc2U8U2Nob29sRGlzdHJpY3RbXT59IFJldHVybnMgYSBsaXN0IG9mIHNjaG9vbCBkaXN0cmljdHMgd2hpY2ggY2FuIGJlIHVzZWQgdG8gbG9naW4gdG8gdGhlIEFQSVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZERpc3RyaWN0cyh6aXBDb2RlOiBzdHJpbmcpOiBQcm9taXNlPFNjaG9vbERpc3RyaWN0W10+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlamVjdCkgPT4ge1xuICAgIHNvYXAuQ2xpZW50LnByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0PERpc3RyaWN0TGlzdFhNTE9iamVjdCB8IHVuZGVmaW5lZD4oXG4gICAgICAnaHR0cHM6Ly9zdXBwb3J0LmVkdXBvaW50LmNvbS9TZXJ2aWNlL0hESW5mb0NvbW11bmljYXRpb24uYXNteCcsXG4gICAgICB7XG4gICAgICAgIHBhcmFtU3RyOiB7XG4gICAgICAgICAgS2V5OiAnNUU0Qjc4NTktQjgwNS00NzRCLUE4MzMtRkRCMTVEMjA1RDQwJyxcbiAgICAgICAgICBNYXRjaFRvRGlzdHJpY3RaaXBDb2RlOiB6aXBDb2RlLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgIClcbiAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcbiAgICAgICAgaWYgKCF4bWxPYmplY3QgfHwgIXhtbE9iamVjdC5EaXN0cmljdExpc3RzLkRpc3RyaWN0SW5mb3MuRGlzdHJpY3RJbmZvKSByZXR1cm4gcmVzKFtdKTtcbiAgICAgICAgcmVzKFxuICAgICAgICAgIHhtbE9iamVjdC5EaXN0cmljdExpc3RzLkRpc3RyaWN0SW5mb3MuRGlzdHJpY3RJbmZvLm1hcCgoZGlzdHJpY3QpID0+ICh7XG4gICAgICAgICAgICBwYXJlbnRWdWVVcmw6IGRpc3RyaWN0WydAX1B2dWVVUkwnXSxcbiAgICAgICAgICAgIGFkZHJlc3M6IGRpc3RyaWN0WydAX0FkZHJlc3MnXSxcbiAgICAgICAgICAgIGlkOiBkaXN0cmljdFsnQF9EaXN0cmljdElEJ10sXG4gICAgICAgICAgICBuYW1lOiBkaXN0cmljdFsnQF9OYW1lJ10sXG4gICAgICAgICAgfSkpXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKHJlamVjdCk7XG4gIH0pO1xufVxuIl19