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
    /**
     * Create a POST request to synergy servers to fetch data
     * @param options Options to provide when making a XML request to the servers
     * @returns Returns an XML object that must be defined in a type declaration file.
     * @link See https://github.com/StudentVue/docs
     * @example
     * ```js
     * super.processRequest({ methodName: 'Refer to StudentVue/docs', paramStr: { AnythingThatCanBePassed: true, AsLongAsItMatchesTheDocumentation: true }});
     * // This will make the XML request below:
     * ```
     * 
     * ```xml
     * <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <ProcessWebServiceRequest xmlns="http://edupoint.com/webservices/">
              <userID>STUDENT_USERNAME</userID>
              <password>STUDENT_PASSWORD</password>
              <skipLoginLog>1</skipLoginLog>
              <parent>0</parent>
              <webServiceHandleName>PXPWebServices</webServiceHandleName>
              <methodName>Refer to StudentVue/docs</methodName>
              <paramStr>
                <AnythingThatCanBePassed>true</AnythingThatCanBePassed>
                <AsLongAsItMatchesTheDocumentation>true</AsLongAsItMatchesTheDocumentation>
              </paramStr>
          </ProcessWebServiceRequest>
        </soap:Body>
    </soap:Envelope>
     * ```
     */


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
            },
            processEntities: false,
            parseAttributeValue: false,
            parseTagValue: false
          });
          const obj = parserTwo.parse(result['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult.replace(/(?<=Content=").*(?="\sRead)/g, btoa));

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
          const obj = parserTwo.parse(result['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult.replace(/&gt;/g, '>').replace(/&lt;/g, '<'));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9zb2FwL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50IiwiZGlzdHJpY3QiLCJfX2Rpc3RyaWN0X18iLCJ1c2VybmFtZSIsIl9fdXNlcm5hbWVfXyIsInBhc3N3b3JkIiwiX19wYXNzd29yZF9fIiwiY3JlZGVudGlhbHMiLCJkaXN0cmljdFVybCIsImNvbnN0cnVjdG9yIiwicHJvY2Vzc1JlcXVlc3QiLCJvcHRpb25zIiwiZGVmYXVsdE9wdGlvbnMiLCJza2lwTG9naW5Mb2ciLCJwYXJlbnQiLCJ3ZWJTZXJ2aWNlSGFuZGxlTmFtZSIsInBhcmFtU3RyIiwiUHJvbWlzZSIsInJlcyIsInJlamVjdCIsImJ1aWxkZXIiLCJYTUxCdWlsZGVyIiwiaWdub3JlQXR0cmlidXRlcyIsImFycmF5Tm9kZU5hbWUiLCJzdXBwcmVzc0VtcHR5Tm9kZSIsInhtbCIsImJ1aWxkIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0IiwidXNlcklEIiwicGFyc2VQYXJhbVN0ciIsImF4aW9zIiwicG9zdCIsImhlYWRlcnMiLCJ0aGVuIiwiZGF0YSIsInBhcnNlciIsIlhNTFBhcnNlciIsInJlc3VsdCIsInBhcnNlIiwicGFyc2VyVHdvIiwiaXNBcnJheSIsInByb2Nlc3NFbnRpdGllcyIsInBhcnNlQXR0cmlidXRlVmFsdWUiLCJwYXJzZVRhZ1ZhbHVlIiwib2JqIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzcG9uc2UiLCJQcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHQiLCJyZXBsYWNlIiwiYnRvYSIsIlJlcXVlc3RFeGNlcHRpb24iLCJjYXRjaCIsImlucHV0Iiwic3VwcHJlc3NCb29sZWFuQXR0cmlidXRlcyIsInByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0IiwidXJsIiwibWV0aG9kTmFtZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVdlLFFBQU1BLE1BQU4sQ0FBYTtBQUtO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YztBQUFFZCxZQUFBQSxnQkFBZ0IsRUFBRTtBQUFwQixXQUFkLENBQWxCO0FBRUEsZ0JBQU1zQixHQUFvQyxHQUFHTCxTQUFTLENBQUNELEtBQVYsQ0FDM0NELE1BQU0sQ0FBQyxlQUFELENBQU4sQ0FBd0IsV0FBeEIsRUFBcUNRLGdDQUFyQyxDQUFzRUMsOEJBQXRFLENBQXFHQyxPQUFyRyxDQUNFLE9BREYsRUFFRSxHQUZGLEVBR0VBLE9BSEYsQ0FHVSxPQUhWLEVBR21CLEdBSG5CLENBRDJDLENBQTdDOztBQU9BLGNBQUksY0FBY0gsR0FBbEI7QUFBdUIsbUJBQU96QixNQUFNLENBQUMsSUFBSThCLHlCQUFKLENBQXFCTCxHQUFyQixDQUFELENBQWI7QUFBdkI7O0FBRUExQixVQUFBQSxHQUFHLENBQUMwQixHQUFELENBQUg7QUFDRCxTQWpCRCxDQWlCRSxPQUFPWSxDQUFQLEVBQVU7QUFDVnJDLFVBQUFBLE1BQU0sQ0FBQ3FDLENBQUQsQ0FBTjtBQUNEO0FBQ0YsT0EzQ00sQ0FBUDtBQTRDRDs7QUExTHlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IHsgWE1MQnVpbGRlciwgWE1MUGFyc2VyIH0gZnJvbSAnZmFzdC14bWwtcGFyc2VyJztcclxuaW1wb3J0IHtcclxuICBQYXJzZWRSZXF1ZXN0RXJyb3IsXHJcbiAgUmVxdWVzdE9wdGlvbnMsXHJcbiAgUGFyc2VkUmVxdWVzdFJlc3VsdCxcclxuICBQYXJzZWRBbm9ueW1vdXNSZXF1ZXN0RXJyb3IsXHJcbiAgTG9naW5DcmVkZW50aWFscyxcclxufSBmcm9tICcuLi8uLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBSZXF1ZXN0RXhjZXB0aW9uIGZyb20gJy4uLy4uLy4uL1N0dWRlbnRWdWUvUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCB7XHJcbiAgcHJpdmF0ZSBfX3VzZXJuYW1lX186IHN0cmluZztcclxuICBwcml2YXRlIF9fcGFzc3dvcmRfXzogc3RyaW5nO1xyXG4gIHByaXZhdGUgX19kaXN0cmljdF9fOiBzdHJpbmc7XHJcblxyXG4gIHByaXZhdGUgZ2V0IGRpc3RyaWN0KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fX2Rpc3RyaWN0X187XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldCB1c2VybmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX191c2VybmFtZV9fO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXQgcGFzc3dvcmQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9fcGFzc3dvcmRfXztcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBnZXQgY3JlZGVudGlhbHMoKTogTG9naW5DcmVkZW50aWFscyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB1c2VybmFtZTogdGhpcy51c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQ6IHRoaXMucGFzc3dvcmQsXHJcbiAgICAgIGRpc3RyaWN0VXJsOiB0aGlzLmRpc3RyaWN0LFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzKSB7XHJcbiAgICB0aGlzLl9fdXNlcm5hbWVfXyA9IGNyZWRlbnRpYWxzLnVzZXJuYW1lO1xyXG4gICAgdGhpcy5fX3Bhc3N3b3JkX18gPSBjcmVkZW50aWFscy5wYXNzd29yZDtcclxuICAgIHRoaXMuX19kaXN0cmljdF9fID0gY3JlZGVudGlhbHMuZGlzdHJpY3RVcmw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBQT1NUIHJlcXVlc3QgdG8gc3luZXJneSBzZXJ2ZXJzIHRvIGZldGNoIGRhdGFcclxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHByb3ZpZGUgd2hlbiBtYWtpbmcgYSBYTUwgcmVxdWVzdCB0byB0aGUgc2VydmVyc1xyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYW4gWE1MIG9iamVjdCB0aGF0IG11c3QgYmUgZGVmaW5lZCBpbiBhIHR5cGUgZGVjbGFyYXRpb24gZmlsZS5cclxuICAgKiBAbGluayBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1N0dWRlbnRWdWUvZG9jc1xyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBzdXBlci5wcm9jZXNzUmVxdWVzdCh7IG1ldGhvZE5hbWU6ICdSZWZlciB0byBTdHVkZW50VnVlL2RvY3MnLCBwYXJhbVN0cjogeyBBbnl0aGluZ1RoYXRDYW5CZVBhc3NlZDogdHJ1ZSwgQXNMb25nQXNJdE1hdGNoZXNUaGVEb2N1bWVudGF0aW9uOiB0cnVlIH19KTtcclxuICAgKiAvLyBUaGlzIHdpbGwgbWFrZSB0aGUgWE1MIHJlcXVlc3QgYmVsb3c6XHJcbiAgICogYGBgXHJcbiAgICogXHJcbiAgICogYGBgeG1sXHJcbiAgICogPHNvYXA6RW52ZWxvcGUgeG1sbnM6eHNpPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2VcIiB4bWxuczp4c2Q9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYVwiIHhtbG5zOnNvYXA9XCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlL1wiPlxyXG4gICAgICA8c29hcDpCb2R5PlxyXG4gICAgICAgIDxQcm9jZXNzV2ViU2VydmljZVJlcXVlc3QgeG1sbnM9XCJodHRwOi8vZWR1cG9pbnQuY29tL3dlYnNlcnZpY2VzL1wiPlxyXG4gICAgICAgICAgICA8dXNlcklEPlNUVURFTlRfVVNFUk5BTUU8L3VzZXJJRD5cclxuICAgICAgICAgICAgPHBhc3N3b3JkPlNUVURFTlRfUEFTU1dPUkQ8L3Bhc3N3b3JkPlxyXG4gICAgICAgICAgICA8c2tpcExvZ2luTG9nPjE8L3NraXBMb2dpbkxvZz5cclxuICAgICAgICAgICAgPHBhcmVudD4wPC9wYXJlbnQ+XHJcbiAgICAgICAgICAgIDx3ZWJTZXJ2aWNlSGFuZGxlTmFtZT5QWFBXZWJTZXJ2aWNlczwvd2ViU2VydmljZUhhbmRsZU5hbWU+XHJcbiAgICAgICAgICAgIDxtZXRob2ROYW1lPlJlZmVyIHRvIFN0dWRlbnRWdWUvZG9jczwvbWV0aG9kTmFtZT5cclxuICAgICAgICAgICAgPHBhcmFtU3RyPlxyXG4gICAgICAgICAgICAgIDxBbnl0aGluZ1RoYXRDYW5CZVBhc3NlZD50cnVlPC9Bbnl0aGluZ1RoYXRDYW5CZVBhc3NlZD5cclxuICAgICAgICAgICAgICA8QXNMb25nQXNJdE1hdGNoZXNUaGVEb2N1bWVudGF0aW9uPnRydWU8L0FzTG9uZ0FzSXRNYXRjaGVzVGhlRG9jdW1lbnRhdGlvbj5cclxuICAgICAgICAgICAgPC9wYXJhbVN0cj5cclxuICAgICAgICA8L1Byb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdD5cclxuICAgICAgPC9zb2FwOkJvZHk+XHJcbjwvc29hcDpFbnZlbG9wZT5cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwcm90ZWN0ZWQgcHJvY2Vzc1JlcXVlc3Q8VD4ob3B0aW9uczogUmVxdWVzdE9wdGlvbnMpOiBQcm9taXNlPFQ+IHtcclxuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBSZXF1ZXN0T3B0aW9ucyA9IHtcclxuICAgICAgc2tpcExvZ2luTG9nOiAxLFxyXG4gICAgICBwYXJlbnQ6IDAsXHJcbiAgICAgIHdlYlNlcnZpY2VIYW5kbGVOYW1lOiAnUFhQV2ViU2VydmljZXMnLFxyXG4gICAgICBwYXJhbVN0cjoge30sXHJcbiAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXMsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCBidWlsZGVyID0gbmV3IFhNTEJ1aWxkZXIoe1xyXG4gICAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgICAgIGFycmF5Tm9kZU5hbWU6ICdzb2FwOkVudmVsb3BlJyxcclxuICAgICAgICBzdXBwcmVzc0VtcHR5Tm9kZTogdHJ1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0IHhtbCA9IGJ1aWxkZXIuYnVpbGQoe1xyXG4gICAgICAgICdzb2FwOkVudmVsb3BlJzoge1xyXG4gICAgICAgICAgJ0BfeG1sbnM6eHNpJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlJyxcclxuICAgICAgICAgICdAX3htbG5zOnhzZCc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScsXHJcbiAgICAgICAgICAnQF94bWxuczpzb2FwJzogJ2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvJyxcclxuICAgICAgICAgICdzb2FwOkJvZHknOiB7XHJcbiAgICAgICAgICAgIFByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdDoge1xyXG4gICAgICAgICAgICAgICdAX3htbG5zJzogJ2h0dHA6Ly9lZHVwb2ludC5jb20vd2Vic2VydmljZXMvJyxcclxuICAgICAgICAgICAgICB1c2VySUQ6IHRoaXMudXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6IHRoaXMucGFzc3dvcmQsXHJcbiAgICAgICAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgLi4ueyBwYXJhbVN0cjogQ2xpZW50LnBhcnNlUGFyYW1TdHIoZGVmYXVsdE9wdGlvbnMucGFyYW1TdHIgPz8ge30pIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYXhpb3NcclxuICAgICAgICAucG9zdDxzdHJpbmc+KHRoaXMuZGlzdHJpY3QsIHhtbCwgeyBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAndGV4dC94bWwnIH0gfSlcclxuICAgICAgICAudGhlbigoeyBkYXRhIH0pID0+IHtcclxuICAgICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBYTUxQYXJzZXIoe30pO1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0OiBQYXJzZWRSZXF1ZXN0UmVzdWx0ID0gcGFyc2VyLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgY29uc3QgcGFyc2VyVHdvID0gbmV3IFhNTFBhcnNlcih7XHJcbiAgICAgICAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgICAgICAgICBpc0FycmF5OiAoKSA9PiB0cnVlLFxyXG4gICAgICAgICAgICBwcm9jZXNzRW50aXRpZXM6IGZhbHNlLFxyXG4gICAgICAgICAgICBwYXJzZUF0dHJpYnV0ZVZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgcGFyc2VUYWdWYWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBjb25zdCBvYmo6IFQgfCBQYXJzZWRSZXF1ZXN0RXJyb3IgPSBwYXJzZXJUd28ucGFyc2UoXHJcbiAgICAgICAgICAgIHJlc3VsdFsnc29hcDpFbnZlbG9wZSddW1xyXG4gICAgICAgICAgICAgICdzb2FwOkJvZHknXHJcbiAgICAgICAgICAgIF0uUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzcG9uc2UuUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzdWx0LnJlcGxhY2UoXHJcbiAgICAgICAgICAgICAgLyg/PD1Db250ZW50PVwiKS4qKD89XCJcXHNSZWFkKS9nLFxyXG4gICAgICAgICAgICAgIGJ0b2FcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBpZiAoJ1JUX0VSUk9SJyBpbiBvYmopIHJldHVybiByZWplY3QobmV3IFJlcXVlc3RFeGNlcHRpb24ob2JqKSk7XHJcblxyXG4gICAgICAgICAgcmVzKG9iaik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqZWN0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgcGFyc2VQYXJhbVN0cihpbnB1dDogb2JqZWN0KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgWE1MQnVpbGRlcih7XHJcbiAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgICBhcnJheU5vZGVOYW1lOiAnUGFyYW1zJyxcclxuICAgICAgc3VwcHJlc3NFbXB0eU5vZGU6IHRydWUsXHJcbiAgICAgIHN1cHByZXNzQm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCB4bWwgPSBgPFBhcm1zPiR7YnVpbGRlci5idWlsZChpbnB1dCl9PC9QYXJtcz5gO1xyXG4gICAgcmV0dXJuIHhtbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc0Fub255bW91c1JlcXVlc3Q8VD4odXJsOiBzdHJpbmcsIG9wdGlvbnM6IFBhcnRpYWw8UmVxdWVzdE9wdGlvbnM+ID0ge30pOiBQcm9taXNlPFQ+IHtcclxuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBSZXF1ZXN0T3B0aW9ucyA9IHtcclxuICAgICAgc2tpcExvZ2luTG9nOiAxLFxyXG4gICAgICBwYXJlbnQ6IDAsXHJcbiAgICAgIHdlYlNlcnZpY2VIYW5kbGVOYW1lOiAnSERJbmZvU2VydmljZXMnLFxyXG4gICAgICBtZXRob2ROYW1lOiAnR2V0TWF0Y2hpbmdEaXN0cmljdExpc3QnLFxyXG4gICAgICBwYXJhbVN0cjoge30sXHJcbiAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KGFzeW5jIChyZXMsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCBidWlsZGVyID0gbmV3IFhNTEJ1aWxkZXIoe1xyXG4gICAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgICAgIGFycmF5Tm9kZU5hbWU6ICdzb2FwOkVudmVsb3BlJyxcclxuICAgICAgICBzdXBwcmVzc0VtcHR5Tm9kZTogdHJ1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0IHhtbCA9IGJ1aWxkZXIuYnVpbGQoe1xyXG4gICAgICAgICdzb2FwOkVudmVsb3BlJzoge1xyXG4gICAgICAgICAgJ0BfeG1sbnM6eHNpJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlJyxcclxuICAgICAgICAgICdAX3htbG5zOnhzZCc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScsXHJcbiAgICAgICAgICAnQF94bWxuczpzb2FwJzogJ2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvJyxcclxuICAgICAgICAgICdzb2FwOkJvZHknOiB7XHJcbiAgICAgICAgICAgIFByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdDoge1xyXG4gICAgICAgICAgICAgICdAX3htbG5zJzogJ2h0dHA6Ly9lZHVwb2ludC5jb20vd2Vic2VydmljZXMvJyxcclxuICAgICAgICAgICAgICB1c2VySUQ6ICdFZHVwb2ludERpc3RyaWN0SW5mbycsXHJcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6ICdFZHVwMDFudCcsXHJcbiAgICAgICAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgLi4ueyBwYXJhbVN0cjogQ2xpZW50LnBhcnNlUGFyYW1TdHIoZGVmYXVsdE9wdGlvbnMucGFyYW1TdHIgPz8ge30pIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGF4aW9zLnBvc3Q8c3RyaW5nPih1cmwsIHhtbCwgeyBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAndGV4dC94bWwnIH0gfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBYTUxQYXJzZXIoe30pO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUGFyc2VkUmVxdWVzdFJlc3VsdCA9IHBhcnNlci5wYXJzZShkYXRhKTtcclxuICAgICAgICBjb25zdCBwYXJzZXJUd28gPSBuZXcgWE1MUGFyc2VyKHsgaWdub3JlQXR0cmlidXRlczogZmFsc2UgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9iajogVCB8IFBhcnNlZEFub255bW91c1JlcXVlc3RFcnJvciA9IHBhcnNlclR3by5wYXJzZShcclxuICAgICAgICAgIHJlc3VsdFsnc29hcDpFbnZlbG9wZSddWydzb2FwOkJvZHknXS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXNwb25zZS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHQucmVwbGFjZShcclxuICAgICAgICAgICAgLyZndDsvZyxcclxuICAgICAgICAgICAgJz4nXHJcbiAgICAgICAgICApLnJlcGxhY2UoLyZsdDsvZywgJzwnKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICgnUlRfRVJST1InIGluIG9iaikgcmV0dXJuIHJlamVjdChuZXcgUmVxdWVzdEV4Y2VwdGlvbihvYmopKTtcclxuXHJcbiAgICAgICAgcmVzKG9iaik7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=