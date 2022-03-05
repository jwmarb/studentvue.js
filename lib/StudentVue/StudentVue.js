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
  _exports.findDistricts = findDistricts;
  _exports.login = login;
  _Client = _interopRequireDefault(_Client);
  _soap = _interopRequireDefault(_soap);
  _RequestException = _interopRequireDefault(_RequestException);
  _url = _interopRequireDefault(_url);

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

      const host = _url.default.parse(districtUrl).host;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TdHVkZW50VnVlL1N0dWRlbnRWdWUudHMiXSwibmFtZXMiOlsibG9naW4iLCJkaXN0cmljdFVybCIsImNyZWRlbnRpYWxzIiwiUHJvbWlzZSIsInJlcyIsInJlaiIsImxlbmd0aCIsIlJlcXVlc3RFeGNlcHRpb24iLCJtZXNzYWdlIiwiaG9zdCIsInVybCIsInBhcnNlIiwiZW5kcG9pbnQiLCJjbGllbnQiLCJDbGllbnQiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiaXNQYXJlbnQiLCJ2YWxpZGF0ZUNyZWRlbnRpYWxzIiwidGhlbiIsImNhdGNoIiwiZmluZERpc3RyaWN0cyIsInppcENvZGUiLCJyZWplY3QiLCJzb2FwIiwicHJvY2Vzc0Fub255bW91c1JlcXVlc3QiLCJwYXJhbVN0ciIsIktleSIsIk1hdGNoVG9EaXN0cmljdFppcENvZGUiLCJ4bWxPYmplY3QiLCJEaXN0cmljdExpc3RzIiwiRGlzdHJpY3RJbmZvcyIsIkRpc3RyaWN0SW5mbyIsImRpc3RyaWN0IiwicGFyZW50VnVlVXJsIiwiYWRkcmVzcyIsImlkIiwibmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sV0FBU0EsS0FBVCxDQUFlQyxXQUFmLEVBQW9DQyxXQUFwQyxFQUFtRjtBQUN4RixXQUFPLElBQUlDLE9BQUosQ0FBWSxDQUFDQyxHQUFELEVBQU1DLEdBQU4sS0FBYztBQUMvQixVQUFJSixXQUFXLENBQUNLLE1BQVosS0FBdUIsQ0FBM0I7QUFDRSxlQUFPRCxHQUFHLENBQUMsSUFBSUUseUJBQUosQ0FBcUI7QUFBRUMsVUFBQUEsT0FBTyxFQUFFO0FBQVgsU0FBckIsQ0FBRCxDQUFWO0FBREY7O0FBRUEsWUFBTUMsSUFBSSxHQUFHQyxhQUFJQyxLQUFKLENBQVVWLFdBQVYsRUFBdUJRLElBQXBDOztBQUNBLFlBQU1HLFFBQVEsR0FBSSxXQUFVSCxJQUFLLGdDQUFqQztBQUNBLFlBQU1JLE1BQU0sR0FBRyxJQUFJQyxlQUFKLENBQ2I7QUFDRUMsUUFBQUEsUUFBUSxFQUFFYixXQUFXLENBQUNhLFFBRHhCO0FBRUVDLFFBQUFBLFFBQVEsRUFBRWQsV0FBVyxDQUFDYyxRQUZ4QjtBQUdFZixRQUFBQSxXQUFXLEVBQUVXLFFBSGY7QUFJRUssUUFBQUEsUUFBUSxFQUFFZixXQUFXLENBQUNlO0FBSnhCLE9BRGEsRUFPWixXQUFVUixJQUFLLEdBUEgsQ0FBZjtBQVNBSSxNQUFBQSxNQUFNLENBQ0hLLG1CQURILEdBRUdDLElBRkgsQ0FFUSxNQUFNO0FBQ1ZmLFFBQUFBLEdBQUcsQ0FBQ1MsTUFBRCxDQUFIO0FBQ0QsT0FKSCxFQUtHTyxLQUxILENBS1NmLEdBTFQ7QUFNRCxLQXBCTSxDQUFQO0FBcUJEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sV0FBU2dCLGFBQVQsQ0FBdUJDLE9BQXZCLEVBQW1FO0FBQ3hFLFdBQU8sSUFBSW5CLE9BQUosQ0FBWSxDQUFDQyxHQUFELEVBQU1tQixNQUFOLEtBQWlCO0FBQ2xDQyxvQkFBS1YsTUFBTCxDQUFZVyx1QkFBWixDQUNFLCtEQURGLEVBRUU7QUFDRUMsUUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFVBQUFBLEdBQUcsRUFBRSxzQ0FERztBQUVSQyxVQUFBQSxzQkFBc0IsRUFBRU47QUFGaEI7QUFEWixPQUZGLEVBU0dILElBVEgsQ0FTU1UsU0FBRCxJQUFlO0FBQ25CLFlBQUksQ0FBQ0EsU0FBRCxJQUFjLENBQUNBLFNBQVMsQ0FBQ0MsYUFBVixDQUF3QkMsYUFBeEIsQ0FBc0NDLFlBQXpEO0FBQXVFLGlCQUFPNUIsR0FBRyxDQUFDLEVBQUQsQ0FBVjtBQUF2RTs7QUFEbUIsaUJBR2pCeUIsU0FBUyxDQUFDQyxhQUFWLENBQXdCQyxhQUF4QixDQUFzQ0MsWUFIckI7O0FBQUEsaUJBR3VDQyxRQUFEO0FBQUEsaUJBQWU7QUFDcEVDLFlBQUFBLFlBQVksRUFBRUQsUUFBUSxDQUFDLFdBQUQsQ0FEOEM7QUFFcEVFLFlBQUFBLE9BQU8sRUFBRUYsUUFBUSxDQUFDLFdBQUQsQ0FGbUQ7QUFHcEVHLFlBQUFBLEVBQUUsRUFBRUgsUUFBUSxDQUFDLGNBQUQsQ0FId0Q7QUFJcEVJLFlBQUFBLElBQUksRUFBRUosUUFBUSxDQUFDLFFBQUQ7QUFKc0QsV0FBZjtBQUFBLFNBSHRDOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFFbkI3QixRQUFBQSxHQUFHLElBQUg7QUFRRCxPQW5CSCxFQW9CR2dCLEtBcEJILENBb0JTRyxNQXBCVDtBQXFCRCxLQXRCTSxDQUFQO0FBdUJEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2Nob29sRGlzdHJpY3QsIFVzZXJDcmVkZW50aWFscyB9IGZyb20gJy4vU3R1ZGVudFZ1ZS5pbnRlcmZhY2VzJztcclxuaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudC9DbGllbnQnO1xyXG5pbXBvcnQgc29hcCBmcm9tICcuLi91dGlscy9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgeyBEaXN0cmljdExpc3RYTUxPYmplY3QgfSBmcm9tICcuL1N0dWRlbnRWdWUueG1sJztcclxuaW1wb3J0IFJlcXVlc3RFeGNlcHRpb24gZnJvbSAnLi9SZXF1ZXN0RXhjZXB0aW9uL1JlcXVlc3RFeGNlcHRpb24nO1xyXG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XHJcblxyXG4vKiogQG1vZHVsZSBTdHVkZW50VnVlICovXHJcblxyXG4vKipcclxuICogTG9naW4gdG8gdGhlIFN0dWRlbnRWVUUgQVBJXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkaXN0cmljdFVybCBUaGUgVVJMIG9mIHRoZSBkaXN0cmljdCB3aGljaCBjYW4gYmUgZm91bmQgdXNpbmcgYGZpbmREaXN0cmljdHMoKWAgbWV0aG9kXHJcbiAqIEBwYXJhbSB7VXNlckNyZWRlbnRpYWxzfSBjcmVkZW50aWFscyBVc2VyIGNyZWRlbnRpYWxzIG9mIHRoZSBzdHVkZW50XHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPENsaWVudD59IFJldHVybnMgdGhlIGNsaWVudCBhbmQgdGhlIGluZm9ybWF0aW9uIG9mIHRoZSBzdHVkZW50IHVwb24gc3VjY2Vzc2Z1bCBsb2dpblxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2luKGRpc3RyaWN0VXJsOiBzdHJpbmcsIGNyZWRlbnRpYWxzOiBVc2VyQ3JlZGVudGlhbHMpOiBQcm9taXNlPENsaWVudD4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgIGlmIChkaXN0cmljdFVybC5sZW5ndGggPT09IDApXHJcbiAgICAgIHJldHVybiByZWoobmV3IFJlcXVlc3RFeGNlcHRpb24oeyBtZXNzYWdlOiAnRGlzdHJpY3QgVVJMIGNhbm5vdCBiZSBhbiBlbXB0eSBzdHJpbmcnIH0pKTtcclxuICAgIGNvbnN0IGhvc3QgPSB1cmwucGFyc2UoZGlzdHJpY3RVcmwpLmhvc3Q7XHJcbiAgICBjb25zdCBlbmRwb2ludCA9IGBodHRwczovLyR7aG9zdH0vU2VydmljZS9QWFBDb21tdW5pY2F0aW9uLmFzbXhgO1xyXG4gICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudChcclxuICAgICAge1xyXG4gICAgICAgIHVzZXJuYW1lOiBjcmVkZW50aWFscy51c2VybmFtZSxcclxuICAgICAgICBwYXNzd29yZDogY3JlZGVudGlhbHMucGFzc3dvcmQsXHJcbiAgICAgICAgZGlzdHJpY3RVcmw6IGVuZHBvaW50LFxyXG4gICAgICAgIGlzUGFyZW50OiBjcmVkZW50aWFscy5pc1BhcmVudCxcclxuICAgICAgfSxcclxuICAgICAgYGh0dHBzOi8vJHtob3N0fS9gXHJcbiAgICApO1xyXG4gICAgY2xpZW50XHJcbiAgICAgIC52YWxpZGF0ZUNyZWRlbnRpYWxzKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHJlcyhjbGllbnQpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2gocmVqKTtcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZpbmQgc2Nob29sIGRpc3RyaWN0cyB1c2luZyBhIHppcGNvZGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHppcENvZGUgVGhlIHppcGNvZGUgdG8gZ2V0IGEgbGlzdCBvZiBzY2hvb2xzIGZyb21cclxuICogQHJldHVybnMge1Byb21pc2U8U2Nob29sRGlzdHJpY3RbXT59IFJldHVybnMgYSBsaXN0IG9mIHNjaG9vbCBkaXN0cmljdHMgd2hpY2ggY2FuIGJlIHVzZWQgdG8gbG9naW4gdG8gdGhlIEFQSVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmREaXN0cmljdHMoemlwQ29kZTogc3RyaW5nKTogUHJvbWlzZTxTY2hvb2xEaXN0cmljdFtdPiB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlamVjdCkgPT4ge1xyXG4gICAgc29hcC5DbGllbnQucHJvY2Vzc0Fub255bW91c1JlcXVlc3Q8RGlzdHJpY3RMaXN0WE1MT2JqZWN0IHwgdW5kZWZpbmVkPihcclxuICAgICAgJ2h0dHBzOi8vc3VwcG9ydC5lZHVwb2ludC5jb20vU2VydmljZS9IREluZm9Db21tdW5pY2F0aW9uLmFzbXgnLFxyXG4gICAgICB7XHJcbiAgICAgICAgcGFyYW1TdHI6IHtcclxuICAgICAgICAgIEtleTogJzVFNEI3ODU5LUI4MDUtNDc0Qi1BODMzLUZEQjE1RDIwNUQ0MCcsXHJcbiAgICAgICAgICBNYXRjaFRvRGlzdHJpY3RaaXBDb2RlOiB6aXBDb2RlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH1cclxuICAgIClcclxuICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgIGlmICgheG1sT2JqZWN0IHx8ICF4bWxPYmplY3QuRGlzdHJpY3RMaXN0cy5EaXN0cmljdEluZm9zLkRpc3RyaWN0SW5mbykgcmV0dXJuIHJlcyhbXSk7XHJcbiAgICAgICAgcmVzKFxyXG4gICAgICAgICAgeG1sT2JqZWN0LkRpc3RyaWN0TGlzdHMuRGlzdHJpY3RJbmZvcy5EaXN0cmljdEluZm8ubWFwKChkaXN0cmljdCkgPT4gKHtcclxuICAgICAgICAgICAgcGFyZW50VnVlVXJsOiBkaXN0cmljdFsnQF9QdnVlVVJMJ10sXHJcbiAgICAgICAgICAgIGFkZHJlc3M6IGRpc3RyaWN0WydAX0FkZHJlc3MnXSxcclxuICAgICAgICAgICAgaWQ6IGRpc3RyaWN0WydAX0Rpc3RyaWN0SUQnXSxcclxuICAgICAgICAgICAgbmFtZTogZGlzdHJpY3RbJ0BfTmFtZSddLFxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKHJlamVjdCk7XHJcbiAgfSk7XHJcbn1cclxuIl19