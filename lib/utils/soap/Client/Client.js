(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "axios", "fast-xml-parser", "../../../StudentVue/RequestException/RequestException"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("axios"), require("fast-xml-parser"), require("../../../StudentVue/RequestException/RequestException"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.axios, global.fastXmlParser, global.RequestException);
    global.Client = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _axios, _fastXmlParser, _RequestException) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _axios = _interopRequireDefault(_axios);
  _RequestException = _interopRequireDefault(_RequestException);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  class Client {
    get district() {
      return this.__district__;
    }

    get username() {
      return this.__username__;
    }

    get password() {
      return this.__password__;
    }

    get credentials() {
      return {
        username: this.username,
        password: this.password,
        districtUrl: this.district
      };
    }

    constructor(credentials) {
      this.__username__ = credentials.username;
      this.__password__ = credentials.password;
      this.__district__ = credentials.districtUrl;
    }

    processRequest(options) {
      const defaultOptions = {
        skipLoginLog: 1,
        parent: 0,
        webServiceHandleName: 'PXPWebServices',
        paramStr: {},
        ...options
      };
      return new Promise(async (res, reject) => {
        const builder = new _fastXmlParser.XMLBuilder({
          ignoreAttributes: false,
          arrayNodeName: 'soap:Envelope',
          suppressEmptyNode: true
        });
        const xml = builder.build({
          'soap:Envelope': {
            '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
            '@_xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
            'soap:Body': {
              ProcessWebServiceRequest: {
                '@_xmlns': 'http://edupoint.com/webservices/',
                userID: this.username,
                password: this.password,
                ...defaultOptions,
                ...{
                  paramStr: Client.parseParamStr(defaultOptions.paramStr ?? {})
                }
              }
            }
          }
        });

        _axios.default.post(this.district, xml, {
          headers: {
            'Content-Type': 'text/xml'
          }
        }).then(({
          data
        }) => {
          const parser = new _fastXmlParser.XMLParser({});
          const result = parser.parse(data);
          const parserTwo = new _fastXmlParser.XMLParser({
            ignoreAttributes: false,
            isArray: () => {
              return true;
            }
          });
          const obj = parserTwo.parse(result['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult);

          if ('RT_ERROR' in obj) {
            return reject(new _RequestException.default(obj));
          }

          res(obj);
        }).catch(reject);
      });
    }

    static parseParamStr(input) {
      const builder = new _fastXmlParser.XMLBuilder({
        ignoreAttributes: false,
        arrayNodeName: 'Params',
        suppressEmptyNode: true,
        suppressBooleanAttributes: false
      });
      const xml = `<Parms>${builder.build(input)}</Parms>`;
      return xml;
    }

    static processAnonymousRequest(url, options = {}) {
      const defaultOptions = {
        skipLoginLog: 1,
        parent: 0,
        webServiceHandleName: 'HDInfoServices',
        methodName: 'GetMatchingDistrictList',
        paramStr: {},
        ...options
      };
      return new Promise(async (res, reject) => {
        const builder = new _fastXmlParser.XMLBuilder({
          ignoreAttributes: false,
          arrayNodeName: 'soap:Envelope',
          suppressEmptyNode: true
        });
        const xml = builder.build({
          'soap:Envelope': {
            '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
            '@_xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
            'soap:Body': {
              ProcessWebServiceRequest: {
                '@_xmlns': 'http://edupoint.com/webservices/',
                userID: 'EdupointDistrictInfo',
                password: 'Edup01nt',
                ...defaultOptions,
                ...{
                  paramStr: Client.parseParamStr(defaultOptions.paramStr ?? {})
                }
              }
            }
          }
        });

        try {
          const {
            data
          } = await _axios.default.post(url, xml, {
            headers: {
              'Content-Type': 'text/xml'
            }
          });
          const parser = new _fastXmlParser.XMLParser({});
          const result = parser.parse(data);
          const parserTwo = new _fastXmlParser.XMLParser({
            ignoreAttributes: false
          });
          const obj = parserTwo.parse(result['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult);

          if ('RT_ERROR' in obj) {
            return reject(new _RequestException.default(obj));
          }

          res(obj);
        } catch (e) {
          reject(e);
        }
      });
    }

  }

  _exports.default = Client;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9zb2FwL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50IiwiZGlzdHJpY3QiLCJfX2Rpc3RyaWN0X18iLCJ1c2VybmFtZSIsIl9fdXNlcm5hbWVfXyIsInBhc3N3b3JkIiwiX19wYXNzd29yZF9fIiwiY3JlZGVudGlhbHMiLCJkaXN0cmljdFVybCIsImNvbnN0cnVjdG9yIiwicHJvY2Vzc1JlcXVlc3QiLCJvcHRpb25zIiwiZGVmYXVsdE9wdGlvbnMiLCJza2lwTG9naW5Mb2ciLCJwYXJlbnQiLCJ3ZWJTZXJ2aWNlSGFuZGxlTmFtZSIsInBhcmFtU3RyIiwiUHJvbWlzZSIsInJlcyIsInJlamVjdCIsImJ1aWxkZXIiLCJYTUxCdWlsZGVyIiwiaWdub3JlQXR0cmlidXRlcyIsImFycmF5Tm9kZU5hbWUiLCJzdXBwcmVzc0VtcHR5Tm9kZSIsInhtbCIsImJ1aWxkIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0IiwidXNlcklEIiwicGFyc2VQYXJhbVN0ciIsImF4aW9zIiwicG9zdCIsImhlYWRlcnMiLCJ0aGVuIiwiZGF0YSIsInBhcnNlciIsIlhNTFBhcnNlciIsInJlc3VsdCIsInBhcnNlIiwicGFyc2VyVHdvIiwiaXNBcnJheSIsIm9iaiIsIlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3BvbnNlIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzdWx0IiwiUmVxdWVzdEV4Y2VwdGlvbiIsImNhdGNoIiwiaW5wdXQiLCJzdXBwcmVzc0Jvb2xlYW5BdHRyaWJ1dGVzIiwicHJvY2Vzc0Fub255bW91c1JlcXVlc3QiLCJ1cmwiLCJtZXRob2ROYW1lIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBV2UsUUFBTUEsTUFBTixDQUFhO0FBS04sUUFBUkMsUUFBUSxHQUFXO0FBQzdCLGFBQU8sS0FBS0MsWUFBWjtBQUNEOztBQUVtQixRQUFSQyxRQUFRLEdBQVc7QUFDN0IsYUFBTyxLQUFLQyxZQUFaO0FBQ0Q7O0FBRW1CLFFBQVJDLFFBQVEsR0FBVztBQUM3QixhQUFPLEtBQUtDLFlBQVo7QUFDRDs7QUFFd0IsUUFBWEMsV0FBVyxHQUFxQjtBQUM1QyxhQUFPO0FBQ0xKLFFBQUFBLFFBQVEsRUFBRSxLQUFLQSxRQURWO0FBRUxFLFFBQUFBLFFBQVEsRUFBRSxLQUFLQSxRQUZWO0FBR0xHLFFBQUFBLFdBQVcsRUFBRSxLQUFLUDtBQUhiLE9BQVA7QUFLRDs7QUFFRFEsSUFBQUEsV0FBVyxDQUFDRixXQUFELEVBQWdDO0FBQ3pDLFdBQUtILFlBQUwsR0FBb0JHLFdBQVcsQ0FBQ0osUUFBaEM7QUFDQSxXQUFLRyxZQUFMLEdBQW9CQyxXQUFXLENBQUNGLFFBQWhDO0FBQ0EsV0FBS0gsWUFBTCxHQUFvQkssV0FBVyxDQUFDQyxXQUFoQztBQUNEOztBQUVTRSxJQUFBQSxjQUFjLENBQUlDLE9BQUosRUFBeUM7QUFDL0QsWUFBTUMsY0FBOEIsR0FBRztBQUNyQ0MsUUFBQUEsWUFBWSxFQUFFLENBRHVCO0FBRXJDQyxRQUFBQSxNQUFNLEVBQUUsQ0FGNkI7QUFHckNDLFFBQUFBLG9CQUFvQixFQUFFLGdCQUhlO0FBSXJDQyxRQUFBQSxRQUFRLEVBQUUsRUFKMkI7QUFLckMsV0FBR0w7QUFMa0MsT0FBdkM7QUFPQSxhQUFPLElBQUlNLE9BQUosQ0FBWSxPQUFPQyxHQUFQLEVBQVlDLE1BQVosS0FBdUI7QUFDeEMsY0FBTUMsT0FBTyxHQUFHLElBQUlDLHlCQUFKLENBQWU7QUFDN0JDLFVBQUFBLGdCQUFnQixFQUFFLEtBRFc7QUFFN0JDLFVBQUFBLGFBQWEsRUFBRSxlQUZjO0FBRzdCQyxVQUFBQSxpQkFBaUIsRUFBRTtBQUhVLFNBQWYsQ0FBaEI7QUFLQSxjQUFNQyxHQUFHLEdBQUdMLE9BQU8sQ0FBQ00sS0FBUixDQUFjO0FBQ3hCLDJCQUFpQjtBQUNmLDJCQUFlLDJDQURBO0FBRWYsMkJBQWUsa0NBRkE7QUFHZiw0QkFBZ0IsMkNBSEQ7QUFJZix5QkFBYTtBQUNYQyxjQUFBQSx3QkFBd0IsRUFBRTtBQUN4QiwyQkFBVyxrQ0FEYTtBQUV4QkMsZ0JBQUFBLE1BQU0sRUFBRSxLQUFLekIsUUFGVztBQUd4QkUsZ0JBQUFBLFFBQVEsRUFBRSxLQUFLQSxRQUhTO0FBSXhCLG1CQUFHTyxjQUpxQjtBQUt4QixtQkFBRztBQUFFSSxrQkFBQUEsUUFBUSxFQUFFaEIsTUFBTSxDQUFDNkIsYUFBUCxDQUFxQmpCLGNBQWMsQ0FBQ0ksUUFBZixJQUEyQixFQUFoRDtBQUFaO0FBTHFCO0FBRGY7QUFKRTtBQURPLFNBQWQsQ0FBWjs7QUFpQkFjLHVCQUNHQyxJQURILENBQ2dCLEtBQUs5QixRQURyQixFQUMrQndCLEdBRC9CLEVBQ29DO0FBQUVPLFVBQUFBLE9BQU8sRUFBRTtBQUFFLDRCQUFnQjtBQUFsQjtBQUFYLFNBRHBDLEVBRUdDLElBRkgsQ0FFUSxDQUFDO0FBQUVDLFVBQUFBO0FBQUYsU0FBRCxLQUFjO0FBQ2xCLGdCQUFNQyxNQUFNLEdBQUcsSUFBSUMsd0JBQUosQ0FBYyxFQUFkLENBQWY7QUFDQSxnQkFBTUMsTUFBMkIsR0FBR0YsTUFBTSxDQUFDRyxLQUFQLENBQWFKLElBQWIsQ0FBcEM7QUFDQSxnQkFBTUssU0FBUyxHQUFHLElBQUlILHdCQUFKLENBQWM7QUFBRWQsWUFBQUEsZ0JBQWdCLEVBQUUsS0FBcEI7QUFBMkJrQixZQUFBQSxPQUFPLEVBQUU7QUFBQSxxQkFBTSxJQUFOO0FBQUE7QUFBcEMsV0FBZCxDQUFsQjtBQUVBLGdCQUFNQyxHQUEyQixHQUFHRixTQUFTLENBQUNELEtBQVYsQ0FDbENELE1BQU0sQ0FBQyxlQUFELENBQU4sQ0FBd0IsV0FBeEIsRUFBcUNLLGdDQUFyQyxDQUFzRUMsOEJBRHBDLENBQXBDOztBQUlBLGNBQUksY0FBY0YsR0FBbEI7QUFBdUIsbUJBQU90QixNQUFNLENBQUMsSUFBSXlCLHlCQUFKLENBQXFCSCxHQUFyQixDQUFELENBQWI7QUFBdkI7O0FBRUF2QixVQUFBQSxHQUFHLENBQUN1QixHQUFELENBQUg7QUFDRCxTQWRILEVBZUdJLEtBZkgsQ0FlUzFCLE1BZlQ7QUFnQkQsT0F2Q00sQ0FBUDtBQXdDRDs7QUFFMkIsV0FBYlUsYUFBYSxDQUFDaUIsS0FBRCxFQUF3QjtBQUNsRCxZQUFNMUIsT0FBTyxHQUFHLElBQUlDLHlCQUFKLENBQWU7QUFDN0JDLFFBQUFBLGdCQUFnQixFQUFFLEtBRFc7QUFFN0JDLFFBQUFBLGFBQWEsRUFBRSxRQUZjO0FBRzdCQyxRQUFBQSxpQkFBaUIsRUFBRSxJQUhVO0FBSTdCdUIsUUFBQUEseUJBQXlCLEVBQUU7QUFKRSxPQUFmLENBQWhCO0FBTUEsWUFBTXRCLEdBQUcsR0FBSSxVQUFTTCxPQUFPLENBQUNNLEtBQVIsQ0FBY29CLEtBQWQsQ0FBcUIsVUFBM0M7QUFDQSxhQUFPckIsR0FBUDtBQUNEOztBQUVvQyxXQUF2QnVCLHVCQUF1QixDQUFJQyxHQUFKLEVBQWlCdEMsT0FBZ0MsR0FBRyxFQUFwRCxFQUFvRTtBQUN2RyxZQUFNQyxjQUE4QixHQUFHO0FBQ3JDQyxRQUFBQSxZQUFZLEVBQUUsQ0FEdUI7QUFFckNDLFFBQUFBLE1BQU0sRUFBRSxDQUY2QjtBQUdyQ0MsUUFBQUEsb0JBQW9CLEVBQUUsZ0JBSGU7QUFJckNtQyxRQUFBQSxVQUFVLEVBQUUseUJBSnlCO0FBS3JDbEMsUUFBQUEsUUFBUSxFQUFFLEVBTDJCO0FBTXJDLFdBQUdMO0FBTmtDLE9BQXZDO0FBUUEsYUFBTyxJQUFJTSxPQUFKLENBQWUsT0FBT0MsR0FBUCxFQUFZQyxNQUFaLEtBQXVCO0FBQzNDLGNBQU1DLE9BQU8sR0FBRyxJQUFJQyx5QkFBSixDQUFlO0FBQzdCQyxVQUFBQSxnQkFBZ0IsRUFBRSxLQURXO0FBRTdCQyxVQUFBQSxhQUFhLEVBQUUsZUFGYztBQUc3QkMsVUFBQUEsaUJBQWlCLEVBQUU7QUFIVSxTQUFmLENBQWhCO0FBS0EsY0FBTUMsR0FBRyxHQUFHTCxPQUFPLENBQUNNLEtBQVIsQ0FBYztBQUN4QiwyQkFBaUI7QUFDZiwyQkFBZSwyQ0FEQTtBQUVmLDJCQUFlLGtDQUZBO0FBR2YsNEJBQWdCLDJDQUhEO0FBSWYseUJBQWE7QUFDWEMsY0FBQUEsd0JBQXdCLEVBQUU7QUFDeEIsMkJBQVcsa0NBRGE7QUFFeEJDLGdCQUFBQSxNQUFNLEVBQUUsc0JBRmdCO0FBR3hCdkIsZ0JBQUFBLFFBQVEsRUFBRSxVQUhjO0FBSXhCLG1CQUFHTyxjQUpxQjtBQUt4QixtQkFBRztBQUFFSSxrQkFBQUEsUUFBUSxFQUFFaEIsTUFBTSxDQUFDNkIsYUFBUCxDQUFxQmpCLGNBQWMsQ0FBQ0ksUUFBZixJQUEyQixFQUFoRDtBQUFaO0FBTHFCO0FBRGY7QUFKRTtBQURPLFNBQWQsQ0FBWjs7QUFpQkEsWUFBSTtBQUNGLGdCQUFNO0FBQUVrQixZQUFBQTtBQUFGLGNBQVcsTUFBTUosZUFBTUMsSUFBTixDQUFtQmtCLEdBQW5CLEVBQXdCeEIsR0FBeEIsRUFBNkI7QUFBRU8sWUFBQUEsT0FBTyxFQUFFO0FBQUUsOEJBQWdCO0FBQWxCO0FBQVgsV0FBN0IsQ0FBdkI7QUFFQSxnQkFBTUcsTUFBTSxHQUFHLElBQUlDLHdCQUFKLENBQWMsRUFBZCxDQUFmO0FBQ0EsZ0JBQU1DLE1BQTJCLEdBQUdGLE1BQU0sQ0FBQ0csS0FBUCxDQUFhSixJQUFiLENBQXBDO0FBQ0EsZ0JBQU1LLFNBQVMsR0FBRyxJQUFJSCx3QkFBSixDQUFjO0FBQUVkLFlBQUFBLGdCQUFnQixFQUFFO0FBQXBCLFdBQWQsQ0FBbEI7QUFFQSxnQkFBTW1CLEdBQW9DLEdBQUdGLFNBQVMsQ0FBQ0QsS0FBVixDQUMzQ0QsTUFBTSxDQUFDLGVBQUQsQ0FBTixDQUF3QixXQUF4QixFQUFxQ0ssZ0NBQXJDLENBQXNFQyw4QkFEM0IsQ0FBN0M7O0FBSUEsY0FBSSxjQUFjRixHQUFsQjtBQUF1QixtQkFBT3RCLE1BQU0sQ0FBQyxJQUFJeUIseUJBQUosQ0FBcUJILEdBQXJCLENBQUQsQ0FBYjtBQUF2Qjs7QUFFQXZCLFVBQUFBLEdBQUcsQ0FBQ3VCLEdBQUQsQ0FBSDtBQUNELFNBZEQsQ0FjRSxPQUFPVSxDQUFQLEVBQVU7QUFDVmhDLFVBQUFBLE1BQU0sQ0FBQ2dDLENBQUQsQ0FBTjtBQUNEO0FBQ0YsT0F4Q00sQ0FBUDtBQXlDRDs7QUE5SXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IHsgWE1MQnVpbGRlciwgWE1MUGFyc2VyIH0gZnJvbSAnZmFzdC14bWwtcGFyc2VyJztcclxuaW1wb3J0IHtcclxuICBQYXJzZWRSZXF1ZXN0RXJyb3IsXHJcbiAgUmVxdWVzdE9wdGlvbnMsXHJcbiAgUGFyc2VkUmVxdWVzdFJlc3VsdCxcclxuICBQYXJzZWRBbm9ueW1vdXNSZXF1ZXN0RXJyb3IsXHJcbiAgTG9naW5DcmVkZW50aWFscyxcclxufSBmcm9tICcuLi8uLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBSZXF1ZXN0RXhjZXB0aW9uIGZyb20gJy4uLy4uLy4uL1N0dWRlbnRWdWUvUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCB7XHJcbiAgcHJpdmF0ZSBfX3VzZXJuYW1lX186IHN0cmluZztcclxuICBwcml2YXRlIF9fcGFzc3dvcmRfXzogc3RyaW5nO1xyXG4gIHByaXZhdGUgX19kaXN0cmljdF9fOiBzdHJpbmc7XHJcblxyXG4gIHByaXZhdGUgZ2V0IGRpc3RyaWN0KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fX2Rpc3RyaWN0X187XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldCB1c2VybmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX191c2VybmFtZV9fO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXQgcGFzc3dvcmQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9fcGFzc3dvcmRfXztcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBnZXQgY3JlZGVudGlhbHMoKTogTG9naW5DcmVkZW50aWFscyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB1c2VybmFtZTogdGhpcy51c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQ6IHRoaXMucGFzc3dvcmQsXHJcbiAgICAgIGRpc3RyaWN0VXJsOiB0aGlzLmRpc3RyaWN0LFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzKSB7XHJcbiAgICB0aGlzLl9fdXNlcm5hbWVfXyA9IGNyZWRlbnRpYWxzLnVzZXJuYW1lO1xyXG4gICAgdGhpcy5fX3Bhc3N3b3JkX18gPSBjcmVkZW50aWFscy5wYXNzd29yZDtcclxuICAgIHRoaXMuX19kaXN0cmljdF9fID0gY3JlZGVudGlhbHMuZGlzdHJpY3RVcmw7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgcHJvY2Vzc1JlcXVlc3Q8VD4ob3B0aW9uczogUmVxdWVzdE9wdGlvbnMpOiBQcm9taXNlPFQ+IHtcclxuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBSZXF1ZXN0T3B0aW9ucyA9IHtcclxuICAgICAgc2tpcExvZ2luTG9nOiAxLFxyXG4gICAgICBwYXJlbnQ6IDAsXHJcbiAgICAgIHdlYlNlcnZpY2VIYW5kbGVOYW1lOiAnUFhQV2ViU2VydmljZXMnLFxyXG4gICAgICBwYXJhbVN0cjoge30sXHJcbiAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXMsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCBidWlsZGVyID0gbmV3IFhNTEJ1aWxkZXIoe1xyXG4gICAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgICAgIGFycmF5Tm9kZU5hbWU6ICdzb2FwOkVudmVsb3BlJyxcclxuICAgICAgICBzdXBwcmVzc0VtcHR5Tm9kZTogdHJ1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0IHhtbCA9IGJ1aWxkZXIuYnVpbGQoe1xyXG4gICAgICAgICdzb2FwOkVudmVsb3BlJzoge1xyXG4gICAgICAgICAgJ0BfeG1sbnM6eHNpJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlJyxcclxuICAgICAgICAgICdAX3htbG5zOnhzZCc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScsXHJcbiAgICAgICAgICAnQF94bWxuczpzb2FwJzogJ2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvJyxcclxuICAgICAgICAgICdzb2FwOkJvZHknOiB7XHJcbiAgICAgICAgICAgIFByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdDoge1xyXG4gICAgICAgICAgICAgICdAX3htbG5zJzogJ2h0dHA6Ly9lZHVwb2ludC5jb20vd2Vic2VydmljZXMvJyxcclxuICAgICAgICAgICAgICB1c2VySUQ6IHRoaXMudXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6IHRoaXMucGFzc3dvcmQsXHJcbiAgICAgICAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgLi4ueyBwYXJhbVN0cjogQ2xpZW50LnBhcnNlUGFyYW1TdHIoZGVmYXVsdE9wdGlvbnMucGFyYW1TdHIgPz8ge30pIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYXhpb3NcclxuICAgICAgICAucG9zdDxzdHJpbmc+KHRoaXMuZGlzdHJpY3QsIHhtbCwgeyBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAndGV4dC94bWwnIH0gfSlcclxuICAgICAgICAudGhlbigoeyBkYXRhIH0pID0+IHtcclxuICAgICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBYTUxQYXJzZXIoe30pO1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0OiBQYXJzZWRSZXF1ZXN0UmVzdWx0ID0gcGFyc2VyLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgY29uc3QgcGFyc2VyVHdvID0gbmV3IFhNTFBhcnNlcih7IGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLCBpc0FycmF5OiAoKSA9PiB0cnVlIH0pO1xyXG5cclxuICAgICAgICAgIGNvbnN0IG9iajogVCB8IFBhcnNlZFJlcXVlc3RFcnJvciA9IHBhcnNlclR3by5wYXJzZShcclxuICAgICAgICAgICAgcmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddLlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3BvbnNlLlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3VsdFxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBpZiAoJ1JUX0VSUk9SJyBpbiBvYmopIHJldHVybiByZWplY3QobmV3IFJlcXVlc3RFeGNlcHRpb24ob2JqKSk7XHJcblxyXG4gICAgICAgICAgcmVzKG9iaik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqZWN0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgcGFyc2VQYXJhbVN0cihpbnB1dDogb2JqZWN0KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgWE1MQnVpbGRlcih7XHJcbiAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgICBhcnJheU5vZGVOYW1lOiAnUGFyYW1zJyxcclxuICAgICAgc3VwcHJlc3NFbXB0eU5vZGU6IHRydWUsXHJcbiAgICAgIHN1cHByZXNzQm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCB4bWwgPSBgPFBhcm1zPiR7YnVpbGRlci5idWlsZChpbnB1dCl9PC9QYXJtcz5gO1xyXG4gICAgcmV0dXJuIHhtbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc0Fub255bW91c1JlcXVlc3Q8VD4odXJsOiBzdHJpbmcsIG9wdGlvbnM6IFBhcnRpYWw8UmVxdWVzdE9wdGlvbnM+ID0ge30pOiBQcm9taXNlPFQ+IHtcclxuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBSZXF1ZXN0T3B0aW9ucyA9IHtcclxuICAgICAgc2tpcExvZ2luTG9nOiAxLFxyXG4gICAgICBwYXJlbnQ6IDAsXHJcbiAgICAgIHdlYlNlcnZpY2VIYW5kbGVOYW1lOiAnSERJbmZvU2VydmljZXMnLFxyXG4gICAgICBtZXRob2ROYW1lOiAnR2V0TWF0Y2hpbmdEaXN0cmljdExpc3QnLFxyXG4gICAgICBwYXJhbVN0cjoge30sXHJcbiAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KGFzeW5jIChyZXMsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCBidWlsZGVyID0gbmV3IFhNTEJ1aWxkZXIoe1xyXG4gICAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgICAgIGFycmF5Tm9kZU5hbWU6ICdzb2FwOkVudmVsb3BlJyxcclxuICAgICAgICBzdXBwcmVzc0VtcHR5Tm9kZTogdHJ1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0IHhtbCA9IGJ1aWxkZXIuYnVpbGQoe1xyXG4gICAgICAgICdzb2FwOkVudmVsb3BlJzoge1xyXG4gICAgICAgICAgJ0BfeG1sbnM6eHNpJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlJyxcclxuICAgICAgICAgICdAX3htbG5zOnhzZCc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScsXHJcbiAgICAgICAgICAnQF94bWxuczpzb2FwJzogJ2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvJyxcclxuICAgICAgICAgICdzb2FwOkJvZHknOiB7XHJcbiAgICAgICAgICAgIFByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdDoge1xyXG4gICAgICAgICAgICAgICdAX3htbG5zJzogJ2h0dHA6Ly9lZHVwb2ludC5jb20vd2Vic2VydmljZXMvJyxcclxuICAgICAgICAgICAgICB1c2VySUQ6ICdFZHVwb2ludERpc3RyaWN0SW5mbycsXHJcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6ICdFZHVwMDFudCcsXHJcbiAgICAgICAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgLi4ueyBwYXJhbVN0cjogQ2xpZW50LnBhcnNlUGFyYW1TdHIoZGVmYXVsdE9wdGlvbnMucGFyYW1TdHIgPz8ge30pIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGF4aW9zLnBvc3Q8c3RyaW5nPih1cmwsIHhtbCwgeyBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAndGV4dC94bWwnIH0gfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBYTUxQYXJzZXIoe30pO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUGFyc2VkUmVxdWVzdFJlc3VsdCA9IHBhcnNlci5wYXJzZShkYXRhKTtcclxuICAgICAgICBjb25zdCBwYXJzZXJUd28gPSBuZXcgWE1MUGFyc2VyKHsgaWdub3JlQXR0cmlidXRlczogZmFsc2UgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9iajogVCB8IFBhcnNlZEFub255bW91c1JlcXVlc3RFcnJvciA9IHBhcnNlclR3by5wYXJzZShcclxuICAgICAgICAgIHJlc3VsdFsnc29hcDpFbnZlbG9wZSddWydzb2FwOkJvZHknXS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXNwb25zZS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoJ1JUX0VSUk9SJyBpbiBvYmopIHJldHVybiByZWplY3QobmV3IFJlcXVlc3RFeGNlcHRpb24ob2JqKSk7XHJcblxyXG4gICAgICAgIHJlcyhvYmopO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19