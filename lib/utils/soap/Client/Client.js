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

        try {
          const {
            data
          } = await _axios.default.post(this.district, xml, {
            headers: {
              'Content-Type': 'text/xml'
            }
          });
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
        } catch (e) {
          reject(e);
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9zb2FwL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50IiwiZGlzdHJpY3QiLCJfX2Rpc3RyaWN0X18iLCJ1c2VybmFtZSIsIl9fdXNlcm5hbWVfXyIsInBhc3N3b3JkIiwiX19wYXNzd29yZF9fIiwiY3JlZGVudGlhbHMiLCJkaXN0cmljdFVybCIsImNvbnN0cnVjdG9yIiwicHJvY2Vzc1JlcXVlc3QiLCJvcHRpb25zIiwiZGVmYXVsdE9wdGlvbnMiLCJza2lwTG9naW5Mb2ciLCJwYXJlbnQiLCJ3ZWJTZXJ2aWNlSGFuZGxlTmFtZSIsInBhcmFtU3RyIiwiUHJvbWlzZSIsInJlcyIsInJlamVjdCIsImJ1aWxkZXIiLCJYTUxCdWlsZGVyIiwiaWdub3JlQXR0cmlidXRlcyIsImFycmF5Tm9kZU5hbWUiLCJzdXBwcmVzc0VtcHR5Tm9kZSIsInhtbCIsImJ1aWxkIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0IiwidXNlcklEIiwicGFyc2VQYXJhbVN0ciIsImRhdGEiLCJheGlvcyIsInBvc3QiLCJoZWFkZXJzIiwicGFyc2VyIiwiWE1MUGFyc2VyIiwicmVzdWx0IiwicGFyc2UiLCJwYXJzZXJUd28iLCJpc0FycmF5Iiwib2JqIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzcG9uc2UiLCJQcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHQiLCJSZXF1ZXN0RXhjZXB0aW9uIiwiZSIsImlucHV0Iiwic3VwcHJlc3NCb29sZWFuQXR0cmlidXRlcyIsInByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0IiwidXJsIiwibWV0aG9kTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBV2UsUUFBTUEsTUFBTixDQUFhO0FBS04sUUFBUkMsUUFBUSxHQUFXO0FBQzdCLGFBQU8sS0FBS0MsWUFBWjtBQUNEOztBQUVtQixRQUFSQyxRQUFRLEdBQVc7QUFDN0IsYUFBTyxLQUFLQyxZQUFaO0FBQ0Q7O0FBRW1CLFFBQVJDLFFBQVEsR0FBVztBQUM3QixhQUFPLEtBQUtDLFlBQVo7QUFDRDs7QUFFd0IsUUFBWEMsV0FBVyxHQUFxQjtBQUM1QyxhQUFPO0FBQ0xKLFFBQUFBLFFBQVEsRUFBRSxLQUFLQSxRQURWO0FBRUxFLFFBQUFBLFFBQVEsRUFBRSxLQUFLQSxRQUZWO0FBR0xHLFFBQUFBLFdBQVcsRUFBRSxLQUFLUDtBQUhiLE9BQVA7QUFLRDs7QUFFRFEsSUFBQUEsV0FBVyxDQUFDRixXQUFELEVBQWdDO0FBQ3pDLFdBQUtILFlBQUwsR0FBb0JHLFdBQVcsQ0FBQ0osUUFBaEM7QUFDQSxXQUFLRyxZQUFMLEdBQW9CQyxXQUFXLENBQUNGLFFBQWhDO0FBQ0EsV0FBS0gsWUFBTCxHQUFvQkssV0FBVyxDQUFDQyxXQUFoQztBQUNEOztBQUVTRSxJQUFBQSxjQUFjLENBQUlDLE9BQUosRUFBeUM7QUFDL0QsWUFBTUMsY0FBOEIsR0FBRztBQUNyQ0MsUUFBQUEsWUFBWSxFQUFFLENBRHVCO0FBRXJDQyxRQUFBQSxNQUFNLEVBQUUsQ0FGNkI7QUFHckNDLFFBQUFBLG9CQUFvQixFQUFFLGdCQUhlO0FBSXJDQyxRQUFBQSxRQUFRLEVBQUUsRUFKMkI7QUFLckMsV0FBR0w7QUFMa0MsT0FBdkM7QUFPQSxhQUFPLElBQUlNLE9BQUosQ0FBWSxPQUFPQyxHQUFQLEVBQVlDLE1BQVosS0FBdUI7QUFDeEMsY0FBTUMsT0FBTyxHQUFHLElBQUlDLHlCQUFKLENBQWU7QUFDN0JDLFVBQUFBLGdCQUFnQixFQUFFLEtBRFc7QUFFN0JDLFVBQUFBLGFBQWEsRUFBRSxlQUZjO0FBRzdCQyxVQUFBQSxpQkFBaUIsRUFBRTtBQUhVLFNBQWYsQ0FBaEI7QUFLQSxjQUFNQyxHQUFHLEdBQUdMLE9BQU8sQ0FBQ00sS0FBUixDQUFjO0FBQ3hCLDJCQUFpQjtBQUNmLDJCQUFlLDJDQURBO0FBRWYsMkJBQWUsa0NBRkE7QUFHZiw0QkFBZ0IsMkNBSEQ7QUFJZix5QkFBYTtBQUNYQyxjQUFBQSx3QkFBd0IsRUFBRTtBQUN4QiwyQkFBVyxrQ0FEYTtBQUV4QkMsZ0JBQUFBLE1BQU0sRUFBRSxLQUFLekIsUUFGVztBQUd4QkUsZ0JBQUFBLFFBQVEsRUFBRSxLQUFLQSxRQUhTO0FBSXhCLG1CQUFHTyxjQUpxQjtBQUt4QixtQkFBRztBQUFFSSxrQkFBQUEsUUFBUSxFQUFFaEIsTUFBTSxDQUFDNkIsYUFBUCxDQUFxQmpCLGNBQWMsQ0FBQ0ksUUFBZixJQUEyQixFQUFoRDtBQUFaO0FBTHFCO0FBRGY7QUFKRTtBQURPLFNBQWQsQ0FBWjs7QUFpQkEsWUFBSTtBQUNGLGdCQUFNO0FBQUVjLFlBQUFBO0FBQUYsY0FBVyxNQUFNQyxlQUFNQyxJQUFOLENBQW1CLEtBQUsvQixRQUF4QixFQUFrQ3dCLEdBQWxDLEVBQXVDO0FBQUVRLFlBQUFBLE9BQU8sRUFBRTtBQUFFLDhCQUFnQjtBQUFsQjtBQUFYLFdBQXZDLENBQXZCO0FBRUEsZ0JBQU1DLE1BQU0sR0FBRyxJQUFJQyx3QkFBSixDQUFjLEVBQWQsQ0FBZjtBQUNBLGdCQUFNQyxNQUEyQixHQUFHRixNQUFNLENBQUNHLEtBQVAsQ0FBYVAsSUFBYixDQUFwQztBQUNBLGdCQUFNUSxTQUFTLEdBQUcsSUFBSUgsd0JBQUosQ0FBYztBQUFFYixZQUFBQSxnQkFBZ0IsRUFBRSxLQUFwQjtBQUEyQmlCLFlBQUFBLE9BQU8sRUFBRTtBQUFBLHFCQUFNLElBQU47QUFBQTtBQUFwQyxXQUFkLENBQWxCO0FBQ0EsZ0JBQU1DLEdBQTJCLEdBQUdGLFNBQVMsQ0FBQ0QsS0FBVixDQUNsQ0QsTUFBTSxDQUFDLGVBQUQsQ0FBTixDQUF3QixXQUF4QixFQUFxQ0ssZ0NBQXJDLENBQXNFQyw4QkFEcEMsQ0FBcEM7O0FBSUEsY0FBSSxjQUFjRixHQUFsQjtBQUF1QixtQkFBT3JCLE1BQU0sQ0FBQyxJQUFJd0IseUJBQUosQ0FBcUJILEdBQXJCLENBQUQsQ0FBYjtBQUF2Qjs7QUFFQXRCLFVBQUFBLEdBQUcsQ0FBQ3NCLEdBQUQsQ0FBSDtBQUNELFNBYkQsQ0FhRSxPQUFPSSxDQUFQLEVBQVU7QUFDVnpCLFVBQUFBLE1BQU0sQ0FBQ3lCLENBQUQsQ0FBTjtBQUNEO0FBQ0YsT0F2Q00sQ0FBUDtBQXdDRDs7QUFFMkIsV0FBYmYsYUFBYSxDQUFDZ0IsS0FBRCxFQUF3QjtBQUNsRCxZQUFNekIsT0FBTyxHQUFHLElBQUlDLHlCQUFKLENBQWU7QUFDN0JDLFFBQUFBLGdCQUFnQixFQUFFLEtBRFc7QUFFN0JDLFFBQUFBLGFBQWEsRUFBRSxRQUZjO0FBRzdCQyxRQUFBQSxpQkFBaUIsRUFBRSxJQUhVO0FBSTdCc0IsUUFBQUEseUJBQXlCLEVBQUU7QUFKRSxPQUFmLENBQWhCO0FBTUEsWUFBTXJCLEdBQUcsR0FBSSxVQUFTTCxPQUFPLENBQUNNLEtBQVIsQ0FBY21CLEtBQWQsQ0FBcUIsVUFBM0M7QUFDQSxhQUFPcEIsR0FBUDtBQUNEOztBQUVvQyxXQUF2QnNCLHVCQUF1QixDQUFJQyxHQUFKLEVBQWlCckMsT0FBZ0MsR0FBRyxFQUFwRCxFQUFvRTtBQUN2RyxZQUFNQyxjQUE4QixHQUFHO0FBQ3JDQyxRQUFBQSxZQUFZLEVBQUUsQ0FEdUI7QUFFckNDLFFBQUFBLE1BQU0sRUFBRSxDQUY2QjtBQUdyQ0MsUUFBQUEsb0JBQW9CLEVBQUUsZ0JBSGU7QUFJckNrQyxRQUFBQSxVQUFVLEVBQUUseUJBSnlCO0FBS3JDakMsUUFBQUEsUUFBUSxFQUFFLEVBTDJCO0FBTXJDLFdBQUdMO0FBTmtDLE9BQXZDO0FBUUEsYUFBTyxJQUFJTSxPQUFKLENBQWUsT0FBT0MsR0FBUCxFQUFZQyxNQUFaLEtBQXVCO0FBQzNDLGNBQU1DLE9BQU8sR0FBRyxJQUFJQyx5QkFBSixDQUFlO0FBQzdCQyxVQUFBQSxnQkFBZ0IsRUFBRSxLQURXO0FBRTdCQyxVQUFBQSxhQUFhLEVBQUUsZUFGYztBQUc3QkMsVUFBQUEsaUJBQWlCLEVBQUU7QUFIVSxTQUFmLENBQWhCO0FBS0EsY0FBTUMsR0FBRyxHQUFHTCxPQUFPLENBQUNNLEtBQVIsQ0FBYztBQUN4QiwyQkFBaUI7QUFDZiwyQkFBZSwyQ0FEQTtBQUVmLDJCQUFlLGtDQUZBO0FBR2YsNEJBQWdCLDJDQUhEO0FBSWYseUJBQWE7QUFDWEMsY0FBQUEsd0JBQXdCLEVBQUU7QUFDeEIsMkJBQVcsa0NBRGE7QUFFeEJDLGdCQUFBQSxNQUFNLEVBQUUsc0JBRmdCO0FBR3hCdkIsZ0JBQUFBLFFBQVEsRUFBRSxVQUhjO0FBSXhCLG1CQUFHTyxjQUpxQjtBQUt4QixtQkFBRztBQUFFSSxrQkFBQUEsUUFBUSxFQUFFaEIsTUFBTSxDQUFDNkIsYUFBUCxDQUFxQmpCLGNBQWMsQ0FBQ0ksUUFBZixJQUEyQixFQUFoRDtBQUFaO0FBTHFCO0FBRGY7QUFKRTtBQURPLFNBQWQsQ0FBWjs7QUFpQkEsWUFBSTtBQUNGLGdCQUFNO0FBQUVjLFlBQUFBO0FBQUYsY0FBVyxNQUFNQyxlQUFNQyxJQUFOLENBQW1CZ0IsR0FBbkIsRUFBd0J2QixHQUF4QixFQUE2QjtBQUFFUSxZQUFBQSxPQUFPLEVBQUU7QUFBRSw4QkFBZ0I7QUFBbEI7QUFBWCxXQUE3QixDQUF2QjtBQUVBLGdCQUFNQyxNQUFNLEdBQUcsSUFBSUMsd0JBQUosQ0FBYyxFQUFkLENBQWY7QUFDQSxnQkFBTUMsTUFBMkIsR0FBR0YsTUFBTSxDQUFDRyxLQUFQLENBQWFQLElBQWIsQ0FBcEM7QUFDQSxnQkFBTVEsU0FBUyxHQUFHLElBQUlILHdCQUFKLENBQWM7QUFBRWIsWUFBQUEsZ0JBQWdCLEVBQUU7QUFBcEIsV0FBZCxDQUFsQjtBQUNBLGdCQUFNa0IsR0FBb0MsR0FBR0YsU0FBUyxDQUFDRCxLQUFWLENBQzNDRCxNQUFNLENBQUMsZUFBRCxDQUFOLENBQXdCLFdBQXhCLEVBQXFDSyxnQ0FBckMsQ0FBc0VDLDhCQUQzQixDQUE3Qzs7QUFJQSxjQUFJLGNBQWNGLEdBQWxCO0FBQXVCLG1CQUFPckIsTUFBTSxDQUFDLElBQUl3Qix5QkFBSixDQUFxQkgsR0FBckIsQ0FBRCxDQUFiO0FBQXZCOztBQUVBdEIsVUFBQUEsR0FBRyxDQUFDc0IsR0FBRCxDQUFIO0FBQ0QsU0FiRCxDQWFFLE9BQU9JLENBQVAsRUFBVTtBQUNWekIsVUFBQUEsTUFBTSxDQUFDeUIsQ0FBRCxDQUFOO0FBQ0Q7QUFDRixPQXZDTSxDQUFQO0FBd0NEOztBQTdJeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgeyBYTUxCdWlsZGVyLCBYTUxQYXJzZXIgfSBmcm9tICdmYXN0LXhtbC1wYXJzZXInO1xyXG5pbXBvcnQge1xyXG4gIFBhcnNlZFJlcXVlc3RFcnJvcixcclxuICBSZXF1ZXN0T3B0aW9ucyxcclxuICBQYXJzZWRSZXF1ZXN0UmVzdWx0LFxyXG4gIFBhcnNlZEFub255bW91c1JlcXVlc3RFcnJvcixcclxuICBMb2dpbkNyZWRlbnRpYWxzLFxyXG59IGZyb20gJy4uLy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IFJlcXVlc3RFeGNlcHRpb24gZnJvbSAnLi4vLi4vLi4vU3R1ZGVudFZ1ZS9SZXF1ZXN0RXhjZXB0aW9uL1JlcXVlc3RFeGNlcHRpb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IHtcclxuICBwcml2YXRlIF9fdXNlcm5hbWVfXzogc3RyaW5nO1xyXG4gIHByaXZhdGUgX19wYXNzd29yZF9fOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfX2Rpc3RyaWN0X186IHN0cmluZztcclxuXHJcbiAgcHJpdmF0ZSBnZXQgZGlzdHJpY3QoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9fZGlzdHJpY3RfXztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0IHVzZXJuYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fX3VzZXJuYW1lX187XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldCBwYXNzd29yZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX19wYXNzd29yZF9fO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGdldCBjcmVkZW50aWFscygpOiBMb2dpbkNyZWRlbnRpYWxzIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZDogdGhpcy5wYXNzd29yZCxcclxuICAgICAgZGlzdHJpY3RVcmw6IHRoaXMuZGlzdHJpY3QsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMpIHtcclxuICAgIHRoaXMuX191c2VybmFtZV9fID0gY3JlZGVudGlhbHMudXNlcm5hbWU7XHJcbiAgICB0aGlzLl9fcGFzc3dvcmRfXyA9IGNyZWRlbnRpYWxzLnBhc3N3b3JkO1xyXG4gICAgdGhpcy5fX2Rpc3RyaWN0X18gPSBjcmVkZW50aWFscy5kaXN0cmljdFVybDtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBwcm9jZXNzUmVxdWVzdDxUPihvcHRpb25zOiBSZXF1ZXN0T3B0aW9ucyk6IFByb21pc2U8VD4ge1xyXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IFJlcXVlc3RPcHRpb25zID0ge1xyXG4gICAgICBza2lwTG9naW5Mb2c6IDEsXHJcbiAgICAgIHBhcmVudDogMCxcclxuICAgICAgd2ViU2VydmljZUhhbmRsZU5hbWU6ICdQWFBXZWJTZXJ2aWNlcycsXHJcbiAgICAgIHBhcmFtU3RyOiB7fSxcclxuICAgICAgLi4ub3B0aW9ucyxcclxuICAgIH07XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcywgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgWE1MQnVpbGRlcih7XHJcbiAgICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXHJcbiAgICAgICAgYXJyYXlOb2RlTmFtZTogJ3NvYXA6RW52ZWxvcGUnLFxyXG4gICAgICAgIHN1cHByZXNzRW1wdHlOb2RlOiB0cnVlLFxyXG4gICAgICB9KTtcclxuICAgICAgY29uc3QgeG1sID0gYnVpbGRlci5idWlsZCh7XHJcbiAgICAgICAgJ3NvYXA6RW52ZWxvcGUnOiB7XHJcbiAgICAgICAgICAnQF94bWxuczp4c2knOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnLFxyXG4gICAgICAgICAgJ0BfeG1sbnM6eHNkJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJyxcclxuICAgICAgICAgICdAX3htbG5zOnNvYXAnOiAnaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nLFxyXG4gICAgICAgICAgJ3NvYXA6Qm9keSc6IHtcclxuICAgICAgICAgICAgUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0OiB7XHJcbiAgICAgICAgICAgICAgJ0BfeG1sbnMnOiAnaHR0cDovL2VkdXBvaW50LmNvbS93ZWJzZXJ2aWNlcy8nLFxyXG4gICAgICAgICAgICAgIHVzZXJJRDogdGhpcy51c2VybmFtZSxcclxuICAgICAgICAgICAgICBwYXNzd29yZDogdGhpcy5wYXNzd29yZCxcclxuICAgICAgICAgICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcclxuICAgICAgICAgICAgICAuLi57IHBhcmFtU3RyOiBDbGllbnQucGFyc2VQYXJhbVN0cihkZWZhdWx0T3B0aW9ucy5wYXJhbVN0ciA/PyB7fSkgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgYXhpb3MucG9zdDxzdHJpbmc+KHRoaXMuZGlzdHJpY3QsIHhtbCwgeyBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAndGV4dC94bWwnIH0gfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBYTUxQYXJzZXIoe30pO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUGFyc2VkUmVxdWVzdFJlc3VsdCA9IHBhcnNlci5wYXJzZShkYXRhKTtcclxuICAgICAgICBjb25zdCBwYXJzZXJUd28gPSBuZXcgWE1MUGFyc2VyKHsgaWdub3JlQXR0cmlidXRlczogZmFsc2UsIGlzQXJyYXk6ICgpID0+IHRydWUgfSk7XHJcbiAgICAgICAgY29uc3Qgb2JqOiBUIHwgUGFyc2VkUmVxdWVzdEVycm9yID0gcGFyc2VyVHdvLnBhcnNlKFxyXG4gICAgICAgICAgcmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddLlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3BvbnNlLlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3VsdFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICgnUlRfRVJST1InIGluIG9iaikgcmV0dXJuIHJlamVjdChuZXcgUmVxdWVzdEV4Y2VwdGlvbihvYmopKTtcclxuXHJcbiAgICAgICAgcmVzKG9iaik7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgcGFyc2VQYXJhbVN0cihpbnB1dDogb2JqZWN0KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgWE1MQnVpbGRlcih7XHJcbiAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgICBhcnJheU5vZGVOYW1lOiAnUGFyYW1zJyxcclxuICAgICAgc3VwcHJlc3NFbXB0eU5vZGU6IHRydWUsXHJcbiAgICAgIHN1cHByZXNzQm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCB4bWwgPSBgPFBhcm1zPiR7YnVpbGRlci5idWlsZChpbnB1dCl9PC9QYXJtcz5gO1xyXG4gICAgcmV0dXJuIHhtbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc0Fub255bW91c1JlcXVlc3Q8VD4odXJsOiBzdHJpbmcsIG9wdGlvbnM6IFBhcnRpYWw8UmVxdWVzdE9wdGlvbnM+ID0ge30pOiBQcm9taXNlPFQ+IHtcclxuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBSZXF1ZXN0T3B0aW9ucyA9IHtcclxuICAgICAgc2tpcExvZ2luTG9nOiAxLFxyXG4gICAgICBwYXJlbnQ6IDAsXHJcbiAgICAgIHdlYlNlcnZpY2VIYW5kbGVOYW1lOiAnSERJbmZvU2VydmljZXMnLFxyXG4gICAgICBtZXRob2ROYW1lOiAnR2V0TWF0Y2hpbmdEaXN0cmljdExpc3QnLFxyXG4gICAgICBwYXJhbVN0cjoge30sXHJcbiAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KGFzeW5jIChyZXMsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCBidWlsZGVyID0gbmV3IFhNTEJ1aWxkZXIoe1xyXG4gICAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgICAgIGFycmF5Tm9kZU5hbWU6ICdzb2FwOkVudmVsb3BlJyxcclxuICAgICAgICBzdXBwcmVzc0VtcHR5Tm9kZTogdHJ1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0IHhtbCA9IGJ1aWxkZXIuYnVpbGQoe1xyXG4gICAgICAgICdzb2FwOkVudmVsb3BlJzoge1xyXG4gICAgICAgICAgJ0BfeG1sbnM6eHNpJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlJyxcclxuICAgICAgICAgICdAX3htbG5zOnhzZCc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScsXHJcbiAgICAgICAgICAnQF94bWxuczpzb2FwJzogJ2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvJyxcclxuICAgICAgICAgICdzb2FwOkJvZHknOiB7XHJcbiAgICAgICAgICAgIFByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdDoge1xyXG4gICAgICAgICAgICAgICdAX3htbG5zJzogJ2h0dHA6Ly9lZHVwb2ludC5jb20vd2Vic2VydmljZXMvJyxcclxuICAgICAgICAgICAgICB1c2VySUQ6ICdFZHVwb2ludERpc3RyaWN0SW5mbycsXHJcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6ICdFZHVwMDFudCcsXHJcbiAgICAgICAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgLi4ueyBwYXJhbVN0cjogQ2xpZW50LnBhcnNlUGFyYW1TdHIoZGVmYXVsdE9wdGlvbnMucGFyYW1TdHIgPz8ge30pIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGF4aW9zLnBvc3Q8c3RyaW5nPih1cmwsIHhtbCwgeyBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAndGV4dC94bWwnIH0gfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBYTUxQYXJzZXIoe30pO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUGFyc2VkUmVxdWVzdFJlc3VsdCA9IHBhcnNlci5wYXJzZShkYXRhKTtcclxuICAgICAgICBjb25zdCBwYXJzZXJUd28gPSBuZXcgWE1MUGFyc2VyKHsgaWdub3JlQXR0cmlidXRlczogZmFsc2UgfSk7XHJcbiAgICAgICAgY29uc3Qgb2JqOiBUIHwgUGFyc2VkQW5vbnltb3VzUmVxdWVzdEVycm9yID0gcGFyc2VyVHdvLnBhcnNlKFxyXG4gICAgICAgICAgcmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddLlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3BvbnNlLlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3VsdFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICgnUlRfRVJST1InIGluIG9iaikgcmV0dXJuIHJlamVjdChuZXcgUmVxdWVzdEV4Y2VwdGlvbihvYmopKTtcclxuXHJcbiAgICAgICAgcmVzKG9iaik7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=