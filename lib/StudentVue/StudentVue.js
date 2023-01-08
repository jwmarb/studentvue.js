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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJsb2dpbiIsImRpc3RyaWN0VXJsIiwiY3JlZGVudGlhbHMiLCJQcm9taXNlIiwicmVzIiwicmVqIiwibGVuZ3RoIiwiUmVxdWVzdEV4Y2VwdGlvbiIsIm1lc3NhZ2UiLCJob3N0IiwiVVJMIiwiZW5kcG9pbnQiLCJjbGllbnQiLCJDbGllbnQiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiaXNQYXJlbnQiLCJ2YWxpZGF0ZUNyZWRlbnRpYWxzIiwidGhlbiIsImNhdGNoIiwiZmluZERpc3RyaWN0cyIsInppcENvZGUiLCJyZWplY3QiLCJzb2FwIiwicHJvY2Vzc0Fub255bW91c1JlcXVlc3QiLCJwYXJhbVN0ciIsIktleSIsIk1hdGNoVG9EaXN0cmljdFppcENvZGUiLCJ4bWxPYmplY3QiLCJEaXN0cmljdExpc3RzIiwiRGlzdHJpY3RJbmZvcyIsIkRpc3RyaWN0SW5mbyIsImRpc3RyaWN0IiwicGFyZW50VnVlVXJsIiwiYWRkcmVzcyIsImlkIiwibmFtZSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TdHVkZW50VnVlL1N0dWRlbnRWdWUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2Nob29sRGlzdHJpY3QsIFVzZXJDcmVkZW50aWFscyB9IGZyb20gJy4vU3R1ZGVudFZ1ZS5pbnRlcmZhY2VzJztcclxuaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudC9DbGllbnQnO1xyXG5pbXBvcnQgc29hcCBmcm9tICcuLi91dGlscy9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgeyBEaXN0cmljdExpc3RYTUxPYmplY3QgfSBmcm9tICcuL1N0dWRlbnRWdWUueG1sJztcclxuaW1wb3J0IFJlcXVlc3RFeGNlcHRpb24gZnJvbSAnLi9SZXF1ZXN0RXhjZXB0aW9uL1JlcXVlc3RFeGNlcHRpb24nO1xyXG5cclxuLyoqIEBtb2R1bGUgU3R1ZGVudFZ1ZSAqL1xyXG5cclxuLyoqXHJcbiAqIExvZ2luIHRvIHRoZSBTdHVkZW50VlVFIEFQSVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGlzdHJpY3RVcmwgVGhlIFVSTCBvZiB0aGUgZGlzdHJpY3Qgd2hpY2ggY2FuIGJlIGZvdW5kIHVzaW5nIGBmaW5kRGlzdHJpY3RzKClgIG1ldGhvZFxyXG4gKiBAcGFyYW0ge1VzZXJDcmVkZW50aWFsc30gY3JlZGVudGlhbHMgVXNlciBjcmVkZW50aWFscyBvZiB0aGUgc3R1ZGVudFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxDbGllbnQ+fSBSZXR1cm5zIHRoZSBjbGllbnQgYW5kIHRoZSBpbmZvcm1hdGlvbiBvZiB0aGUgc3R1ZGVudCB1cG9uIHN1Y2Nlc3NmdWwgbG9naW5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dpbihkaXN0cmljdFVybDogc3RyaW5nLCBjcmVkZW50aWFsczogVXNlckNyZWRlbnRpYWxzKTogUHJvbWlzZTxDbGllbnQ+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICBpZiAoZGlzdHJpY3RVcmwubGVuZ3RoID09PSAwKVxyXG4gICAgICByZXR1cm4gcmVqKG5ldyBSZXF1ZXN0RXhjZXB0aW9uKHsgbWVzc2FnZTogJ0Rpc3RyaWN0IFVSTCBjYW5ub3QgYmUgYW4gZW1wdHkgc3RyaW5nJyB9KSk7XHJcbiAgICBjb25zdCBob3N0ID0gbmV3IFVSTChkaXN0cmljdFVybCkuaG9zdDtcclxuICAgIGNvbnN0IGVuZHBvaW50ID0gYGh0dHBzOi8vJHtob3N0fS9TZXJ2aWNlL1BYUENvbW11bmljYXRpb24uYXNteGA7XHJcbiAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KFxyXG4gICAgICB7XHJcbiAgICAgICAgdXNlcm5hbWU6IGNyZWRlbnRpYWxzLnVzZXJuYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiBjcmVkZW50aWFscy5wYXNzd29yZCxcclxuICAgICAgICBkaXN0cmljdFVybDogZW5kcG9pbnQsXHJcbiAgICAgICAgaXNQYXJlbnQ6IGNyZWRlbnRpYWxzLmlzUGFyZW50LFxyXG4gICAgICB9LFxyXG4gICAgICBgaHR0cHM6Ly8ke2hvc3R9L2BcclxuICAgICk7XHJcbiAgICBjbGllbnRcclxuICAgICAgLnZhbGlkYXRlQ3JlZGVudGlhbHMoKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgcmVzKGNsaWVudCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChyZWopO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogRmluZCBzY2hvb2wgZGlzdHJpY3RzIHVzaW5nIGEgemlwY29kZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gemlwQ29kZSBUaGUgemlwY29kZSB0byBnZXQgYSBsaXN0IG9mIHNjaG9vbHMgZnJvbVxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxTY2hvb2xEaXN0cmljdFtdPn0gUmV0dXJucyBhIGxpc3Qgb2Ygc2Nob29sIGRpc3RyaWN0cyB3aGljaCBjYW4gYmUgdXNlZCB0byBsb2dpbiB0byB0aGUgQVBJXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZmluZERpc3RyaWN0cyh6aXBDb2RlOiBzdHJpbmcpOiBQcm9taXNlPFNjaG9vbERpc3RyaWN0W10+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqZWN0KSA9PiB7XHJcbiAgICBzb2FwLkNsaWVudC5wcm9jZXNzQW5vbnltb3VzUmVxdWVzdDxEaXN0cmljdExpc3RYTUxPYmplY3QgfCB1bmRlZmluZWQ+KFxyXG4gICAgICAnaHR0cHM6Ly9zdXBwb3J0LmVkdXBvaW50LmNvbS9TZXJ2aWNlL0hESW5mb0NvbW11bmljYXRpb24uYXNteCcsXHJcbiAgICAgIHtcclxuICAgICAgICBwYXJhbVN0cjoge1xyXG4gICAgICAgICAgS2V5OiAnNUU0Qjc4NTktQjgwNS00NzRCLUE4MzMtRkRCMTVEMjA1RDQwJyxcclxuICAgICAgICAgIE1hdGNoVG9EaXN0cmljdFppcENvZGU6IHppcENvZGUsXHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgKVxyXG4gICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYgKCF4bWxPYmplY3QgfHwgIXhtbE9iamVjdC5EaXN0cmljdExpc3RzLkRpc3RyaWN0SW5mb3MuRGlzdHJpY3RJbmZvKSByZXR1cm4gcmVzKFtdKTtcclxuICAgICAgICByZXMoXHJcbiAgICAgICAgICB4bWxPYmplY3QuRGlzdHJpY3RMaXN0cy5EaXN0cmljdEluZm9zLkRpc3RyaWN0SW5mby5tYXAoKGRpc3RyaWN0KSA9PiAoe1xyXG4gICAgICAgICAgICBwYXJlbnRWdWVVcmw6IGRpc3RyaWN0WydAX1B2dWVVUkwnXSxcclxuICAgICAgICAgICAgYWRkcmVzczogZGlzdHJpY3RbJ0BfQWRkcmVzcyddLFxyXG4gICAgICAgICAgICBpZDogZGlzdHJpY3RbJ0BfRGlzdHJpY3RJRCddLFxyXG4gICAgICAgICAgICBuYW1lOiBkaXN0cmljdFsnQF9OYW1lJ10sXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICApO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2gocmVqZWN0KTtcclxuICB9KTtcclxufVxyXG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQU1BOztFQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNPLFNBQVNBLEtBQUssQ0FBQ0MsV0FBbUIsRUFBRUMsV0FBNEIsRUFBbUI7SUFDeEYsT0FBTyxJQUFJQyxPQUFPLENBQUMsQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEtBQUs7TUFDL0IsSUFBSUosV0FBVyxDQUFDSyxNQUFNLEtBQUssQ0FBQztRQUMxQixPQUFPRCxHQUFHLENBQUMsSUFBSUUseUJBQWdCLENBQUM7VUFBRUMsT0FBTyxFQUFFO1FBQXlDLENBQUMsQ0FBQyxDQUFDO01BQUM7TUFDMUYsTUFBTUMsSUFBSSxHQUFHLElBQUlDLEdBQUcsQ0FBQ1QsV0FBVyxDQUFDLENBQUNRLElBQUk7TUFDdEMsTUFBTUUsUUFBUSxHQUFJLFdBQVVGLElBQUssZ0NBQStCO01BQ2hFLE1BQU1HLE1BQU0sR0FBRyxJQUFJQyxlQUFNLENBQ3ZCO1FBQ0VDLFFBQVEsRUFBRVosV0FBVyxDQUFDWSxRQUFRO1FBQzlCQyxRQUFRLEVBQUViLFdBQVcsQ0FBQ2EsUUFBUTtRQUM5QmQsV0FBVyxFQUFFVSxRQUFRO1FBQ3JCSyxRQUFRLEVBQUVkLFdBQVcsQ0FBQ2M7TUFDeEIsQ0FBQyxFQUNBLFdBQVVQLElBQUssR0FBRSxDQUNuQjtNQUNERyxNQUFNLENBQ0hLLG1CQUFtQixFQUFFLENBQ3JCQyxJQUFJLENBQUMsTUFBTTtRQUNWZCxHQUFHLENBQUNRLE1BQU0sQ0FBQztNQUNiLENBQUMsQ0FBQyxDQUNETyxLQUFLLENBQUNkLEdBQUcsQ0FBQztJQUNmLENBQUMsQ0FBQztFQUNKOztFQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDTyxTQUFTZSxhQUFhLENBQUNDLE9BQWUsRUFBNkI7SUFDeEUsT0FBTyxJQUFJbEIsT0FBTyxDQUFDLENBQUNDLEdBQUcsRUFBRWtCLE1BQU0sS0FBSztNQUNsQ0MsYUFBSSxDQUFDVixNQUFNLENBQUNXLHVCQUF1QixDQUNqQywrREFBK0QsRUFDL0Q7UUFDRUMsUUFBUSxFQUFFO1VBQ1JDLEdBQUcsRUFBRSxzQ0FBc0M7VUFDM0NDLHNCQUFzQixFQUFFTjtRQUMxQjtNQUNGLENBQUMsQ0FDRixDQUNFSCxJQUFJLENBQUVVLFNBQVMsSUFBSztRQUNuQixJQUFJLENBQUNBLFNBQVMsSUFBSSxDQUFDQSxTQUFTLENBQUNDLGFBQWEsQ0FBQ0MsYUFBYSxDQUFDQyxZQUFZO1VBQUUsT0FBTzNCLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFBQztRQUFBLFNBRXBGd0IsU0FBUyxDQUFDQyxhQUFhLENBQUNDLGFBQWEsQ0FBQ0MsWUFBWTtRQUFBLFNBQU1DLFFBQVE7VUFBQSxPQUFNO1lBQ3BFQyxZQUFZLEVBQUVELFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFDbkNFLE9BQU8sRUFBRUYsUUFBUSxDQUFDLFdBQVcsQ0FBQztZQUM5QkcsRUFBRSxFQUFFSCxRQUFRLENBQUMsY0FBYyxDQUFDO1lBQzVCSSxJQUFJLEVBQUVKLFFBQVEsQ0FBQyxRQUFRO1VBQ3pCLENBQUM7UUFBQSxDQUFDO1FBQUE7UUFBQTtVQUFBO1FBQUE7UUFOSjVCLEdBQUcsSUFPRjtNQUNILENBQUMsQ0FBQyxDQUNEZSxLQUFLLENBQUNHLE1BQU0sQ0FBQztJQUNsQixDQUFDLENBQUM7RUFDSjtBQUFDIn0=