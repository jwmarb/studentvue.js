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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJsb2dpbiIsImRpc3RyaWN0VXJsIiwiY3JlZGVudGlhbHMiLCJQcm9taXNlIiwicmVzIiwicmVqIiwibGVuZ3RoIiwiUmVxdWVzdEV4Y2VwdGlvbiIsIm1lc3NhZ2UiLCJob3N0IiwiVVJMIiwiZW5kcG9pbnQiLCJjbGllbnQiLCJDbGllbnQiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiaXNQYXJlbnQiLCJ2YWxpZGF0ZUNyZWRlbnRpYWxzIiwidGhlbiIsImNhdGNoIiwiZmluZERpc3RyaWN0cyIsInppcENvZGUiLCJyZWplY3QiLCJzb2FwIiwicHJvY2Vzc0Fub255bW91c1JlcXVlc3QiLCJwYXJhbVN0ciIsIktleSIsIk1hdGNoVG9EaXN0cmljdFppcENvZGUiLCJ4bWxPYmplY3QiLCJEaXN0cmljdExpc3RzIiwiRGlzdHJpY3RJbmZvcyIsIkRpc3RyaWN0SW5mbyIsImRpc3RyaWN0IiwicGFyZW50VnVlVXJsIiwiYWRkcmVzcyIsImlkIiwibmFtZSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TdHVkZW50VnVlL1N0dWRlbnRWdWUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2Nob29sRGlzdHJpY3QsIFVzZXJDcmVkZW50aWFscyB9IGZyb20gJy4vU3R1ZGVudFZ1ZS5pbnRlcmZhY2VzJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi9DbGllbnQvQ2xpZW50JztcbmltcG9ydCBzb2FwIGZyb20gJy4uL3V0aWxzL3NvYXAvc29hcCc7XG5pbXBvcnQgeyBEaXN0cmljdExpc3RYTUxPYmplY3QgfSBmcm9tICcuL1N0dWRlbnRWdWUueG1sJztcbmltcG9ydCBSZXF1ZXN0RXhjZXB0aW9uIGZyb20gJy4vUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcblxuLyoqIEBtb2R1bGUgU3R1ZGVudFZ1ZSAqL1xuXG4vKipcbiAqIExvZ2luIHRvIHRoZSBTdHVkZW50VlVFIEFQSVxuICogQHBhcmFtIHtzdHJpbmd9IGRpc3RyaWN0VXJsIFRoZSBVUkwgb2YgdGhlIGRpc3RyaWN0IHdoaWNoIGNhbiBiZSBmb3VuZCB1c2luZyBgZmluZERpc3RyaWN0cygpYCBtZXRob2RcbiAqIEBwYXJhbSB7VXNlckNyZWRlbnRpYWxzfSBjcmVkZW50aWFscyBVc2VyIGNyZWRlbnRpYWxzIG9mIHRoZSBzdHVkZW50XG4gKiBAcmV0dXJucyB7UHJvbWlzZTxDbGllbnQ+fSBSZXR1cm5zIHRoZSBjbGllbnQgYW5kIHRoZSBpbmZvcm1hdGlvbiBvZiB0aGUgc3R1ZGVudCB1cG9uIHN1Y2Nlc3NmdWwgbG9naW5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvZ2luKGRpc3RyaWN0VXJsOiBzdHJpbmcsIGNyZWRlbnRpYWxzOiBVc2VyQ3JlZGVudGlhbHMpOiBQcm9taXNlPENsaWVudD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgaWYgKGRpc3RyaWN0VXJsLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiByZWoobmV3IFJlcXVlc3RFeGNlcHRpb24oeyBtZXNzYWdlOiAnRGlzdHJpY3QgVVJMIGNhbm5vdCBiZSBhbiBlbXB0eSBzdHJpbmcnIH0pKTtcbiAgICBjb25zdCBob3N0ID0gbmV3IFVSTChkaXN0cmljdFVybCkuaG9zdDtcbiAgICBjb25zdCBlbmRwb2ludCA9IGBodHRwczovLyR7aG9zdH0vU2VydmljZS9QWFBDb21tdW5pY2F0aW9uLmFzbXhgO1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoXG4gICAgICB7XG4gICAgICAgIHVzZXJuYW1lOiBjcmVkZW50aWFscy51c2VybmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IGNyZWRlbnRpYWxzLnBhc3N3b3JkLFxuICAgICAgICBkaXN0cmljdFVybDogZW5kcG9pbnQsXG4gICAgICAgIGlzUGFyZW50OiBjcmVkZW50aWFscy5pc1BhcmVudCxcbiAgICAgIH0sXG4gICAgICBgaHR0cHM6Ly8ke2hvc3R9L2BcbiAgICApO1xuICAgIGNsaWVudFxuICAgICAgLnZhbGlkYXRlQ3JlZGVudGlhbHMoKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXMoY2xpZW50KTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2gocmVqKTtcbiAgfSk7XG59XG5cbi8qKlxuICogRmluZCBzY2hvb2wgZGlzdHJpY3RzIHVzaW5nIGEgemlwY29kZVxuICogQHBhcmFtIHtzdHJpbmd9IHppcENvZGUgVGhlIHppcGNvZGUgdG8gZ2V0IGEgbGlzdCBvZiBzY2hvb2xzIGZyb21cbiAqIEByZXR1cm5zIHtQcm9taXNlPFNjaG9vbERpc3RyaWN0W10+fSBSZXR1cm5zIGEgbGlzdCBvZiBzY2hvb2wgZGlzdHJpY3RzIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGxvZ2luIHRvIHRoZSBBUElcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmREaXN0cmljdHMoemlwQ29kZTogc3RyaW5nKTogUHJvbWlzZTxTY2hvb2xEaXN0cmljdFtdPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWplY3QpID0+IHtcbiAgICBzb2FwLkNsaWVudC5wcm9jZXNzQW5vbnltb3VzUmVxdWVzdDxEaXN0cmljdExpc3RYTUxPYmplY3QgfCB1bmRlZmluZWQ+KFxuICAgICAgJ2h0dHBzOi8vc3VwcG9ydC5lZHVwb2ludC5jb20vU2VydmljZS9IREluZm9Db21tdW5pY2F0aW9uLmFzbXgnLFxuICAgICAge1xuICAgICAgICBwYXJhbVN0cjoge1xuICAgICAgICAgIEtleTogJzVFNEI3ODU5LUI4MDUtNDc0Qi1BODMzLUZEQjE1RDIwNUQ0MCcsXG4gICAgICAgICAgTWF0Y2hUb0Rpc3RyaWN0WmlwQ29kZTogemlwQ29kZSxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICApXG4gICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XG4gICAgICAgIGlmICgheG1sT2JqZWN0IHx8ICF4bWxPYmplY3QuRGlzdHJpY3RMaXN0cy5EaXN0cmljdEluZm9zLkRpc3RyaWN0SW5mbykgcmV0dXJuIHJlcyhbXSk7XG4gICAgICAgIHJlcyhcbiAgICAgICAgICB4bWxPYmplY3QuRGlzdHJpY3RMaXN0cy5EaXN0cmljdEluZm9zLkRpc3RyaWN0SW5mby5tYXAoKGRpc3RyaWN0KSA9PiAoe1xuICAgICAgICAgICAgcGFyZW50VnVlVXJsOiBkaXN0cmljdFsnQF9QdnVlVVJMJ10sXG4gICAgICAgICAgICBhZGRyZXNzOiBkaXN0cmljdFsnQF9BZGRyZXNzJ10sXG4gICAgICAgICAgICBpZDogZGlzdHJpY3RbJ0BfRGlzdHJpY3RJRCddLFxuICAgICAgICAgICAgbmFtZTogZGlzdHJpY3RbJ0BfTmFtZSddLFxuICAgICAgICAgIH0pKVxuICAgICAgICApO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChyZWplY3QpO1xuICB9KTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBTUE7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ08sU0FBU0EsS0FBSyxDQUFDQyxXQUFtQixFQUFFQyxXQUE0QixFQUFtQjtJQUN4RixPQUFPLElBQUlDLE9BQU8sQ0FBQyxDQUFDQyxHQUFHLEVBQUVDLEdBQUcsS0FBSztNQUMvQixJQUFJSixXQUFXLENBQUNLLE1BQU0sS0FBSyxDQUFDO1FBQzFCLE9BQU9ELEdBQUcsQ0FBQyxJQUFJRSx5QkFBZ0IsQ0FBQztVQUFFQyxPQUFPLEVBQUU7UUFBeUMsQ0FBQyxDQUFDLENBQUM7TUFBQztNQUMxRixNQUFNQyxJQUFJLEdBQUcsSUFBSUMsR0FBRyxDQUFDVCxXQUFXLENBQUMsQ0FBQ1EsSUFBSTtNQUN0QyxNQUFNRSxRQUFRLEdBQUksV0FBVUYsSUFBSyxnQ0FBK0I7TUFDaEUsTUFBTUcsTUFBTSxHQUFHLElBQUlDLGVBQU0sQ0FDdkI7UUFDRUMsUUFBUSxFQUFFWixXQUFXLENBQUNZLFFBQVE7UUFDOUJDLFFBQVEsRUFBRWIsV0FBVyxDQUFDYSxRQUFRO1FBQzlCZCxXQUFXLEVBQUVVLFFBQVE7UUFDckJLLFFBQVEsRUFBRWQsV0FBVyxDQUFDYztNQUN4QixDQUFDLEVBQ0EsV0FBVVAsSUFBSyxHQUFFLENBQ25CO01BQ0RHLE1BQU0sQ0FDSEssbUJBQW1CLEVBQUUsQ0FDckJDLElBQUksQ0FBQyxNQUFNO1FBQ1ZkLEdBQUcsQ0FBQ1EsTUFBTSxDQUFDO01BQ2IsQ0FBQyxDQUFDLENBQ0RPLEtBQUssQ0FBQ2QsR0FBRyxDQUFDO0lBQ2YsQ0FBQyxDQUFDO0VBQ0o7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNPLFNBQVNlLGFBQWEsQ0FBQ0MsT0FBZSxFQUE2QjtJQUN4RSxPQUFPLElBQUlsQixPQUFPLENBQUMsQ0FBQ0MsR0FBRyxFQUFFa0IsTUFBTSxLQUFLO01BQ2xDQyxhQUFJLENBQUNWLE1BQU0sQ0FBQ1csdUJBQXVCLENBQ2pDLCtEQUErRCxFQUMvRDtRQUNFQyxRQUFRLEVBQUU7VUFDUkMsR0FBRyxFQUFFLHNDQUFzQztVQUMzQ0Msc0JBQXNCLEVBQUVOO1FBQzFCO01BQ0YsQ0FBQyxDQUNGLENBQ0VILElBQUksQ0FBRVUsU0FBUyxJQUFLO1FBQ25CLElBQUksQ0FBQ0EsU0FBUyxJQUFJLENBQUNBLFNBQVMsQ0FBQ0MsYUFBYSxDQUFDQyxhQUFhLENBQUNDLFlBQVk7VUFBRSxPQUFPM0IsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUFDO1FBQUEsU0FFcEZ3QixTQUFTLENBQUNDLGFBQWEsQ0FBQ0MsYUFBYSxDQUFDQyxZQUFZO1FBQUEsU0FBTUMsUUFBUTtVQUFBLE9BQU07WUFDcEVDLFlBQVksRUFBRUQsUUFBUSxDQUFDLFdBQVcsQ0FBQztZQUNuQ0UsT0FBTyxFQUFFRixRQUFRLENBQUMsV0FBVyxDQUFDO1lBQzlCRyxFQUFFLEVBQUVILFFBQVEsQ0FBQyxjQUFjLENBQUM7WUFDNUJJLElBQUksRUFBRUosUUFBUSxDQUFDLFFBQVE7VUFDekIsQ0FBQztRQUFBLENBQUM7UUFBQTtRQUFBO1VBQUE7UUFBQTtRQU5KNUIsR0FBRyxJQU9GO01BQ0gsQ0FBQyxDQUFDLENBQ0RlLEtBQUssQ0FBQ0csTUFBTSxDQUFDO0lBQ2xCLENBQUMsQ0FBQztFQUNKO0FBQUMifQ==