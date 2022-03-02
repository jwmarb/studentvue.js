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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9zb2FwL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50IiwiZGlzdHJpY3QiLCJfX2Rpc3RyaWN0X18iLCJ1c2VybmFtZSIsIl9fdXNlcm5hbWVfXyIsInBhc3N3b3JkIiwiX19wYXNzd29yZF9fIiwiY3JlZGVudGlhbHMiLCJkaXN0cmljdFVybCIsImNvbnN0cnVjdG9yIiwicHJvY2Vzc1JlcXVlc3QiLCJvcHRpb25zIiwiZGVmYXVsdE9wdGlvbnMiLCJza2lwTG9naW5Mb2ciLCJwYXJlbnQiLCJ3ZWJTZXJ2aWNlSGFuZGxlTmFtZSIsInBhcmFtU3RyIiwiUHJvbWlzZSIsInJlcyIsInJlamVjdCIsImJ1aWxkZXIiLCJYTUxCdWlsZGVyIiwiaWdub3JlQXR0cmlidXRlcyIsImFycmF5Tm9kZU5hbWUiLCJzdXBwcmVzc0VtcHR5Tm9kZSIsInhtbCIsImJ1aWxkIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0IiwidXNlcklEIiwicGFyc2VQYXJhbVN0ciIsImF4aW9zIiwicG9zdCIsImhlYWRlcnMiLCJ0aGVuIiwiZGF0YSIsInBhcnNlciIsIlhNTFBhcnNlciIsInJlc3VsdCIsInBhcnNlIiwicGFyc2VyVHdvIiwiaXNBcnJheSIsInByb2Nlc3NFbnRpdGllcyIsInBhcnNlQXR0cmlidXRlVmFsdWUiLCJwYXJzZVRhZ1ZhbHVlIiwib2JqIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzcG9uc2UiLCJQcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHQiLCJyZXBsYWNlIiwiYnRvYSIsIlJlcXVlc3RFeGNlcHRpb24iLCJjYXRjaCIsImlucHV0Iiwic3VwcHJlc3NCb29sZWFuQXR0cmlidXRlcyIsInByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0IiwidXJsIiwibWV0aG9kTmFtZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVdlLFFBQU1BLE1BQU4sQ0FBYTtBQUtO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YztBQUFFZCxZQUFBQSxnQkFBZ0IsRUFBRTtBQUFwQixXQUFkLENBQWxCO0FBRUEsZ0JBQU1zQixHQUFvQyxHQUFHTCxTQUFTLENBQUNELEtBQVYsQ0FDM0NELE1BQU0sQ0FBQyxlQUFELENBQU4sQ0FBd0IsV0FBeEIsRUFBcUNRLGdDQUFyQyxDQUFzRUMsOEJBQXRFLENBQXFHQyxPQUFyRyxDQUNFLE9BREYsRUFFRSxHQUZGLEVBR0VBLE9BSEYsQ0FHVSxPQUhWLEVBR21CLEdBSG5CLENBRDJDLENBQTdDOztBQU9BLGNBQUksY0FBY0gsR0FBbEI7QUFBdUIsbUJBQU96QixNQUFNLENBQUMsSUFBSThCLHlCQUFKLENBQXFCTCxHQUFyQixDQUFELENBQWI7QUFBdkI7O0FBRUExQixVQUFBQSxHQUFHLENBQUMwQixHQUFELENBQUg7QUFDRCxTQWpCRCxDQWlCRSxPQUFPWSxDQUFQLEVBQVU7QUFDVnJDLFVBQUFBLE1BQU0sQ0FBQ3FDLENBQUQsQ0FBTjtBQUNEO0FBQ0YsT0EzQ00sQ0FBUDtBQTRDRDs7QUExTHlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IHsgWE1MQnVpbGRlciwgWE1MUGFyc2VyIH0gZnJvbSAnZmFzdC14bWwtcGFyc2VyJztcclxuaW1wb3J0IHtcclxuICBQYXJzZWRSZXF1ZXN0RXJyb3IsXHJcbiAgUmVxdWVzdE9wdGlvbnMsXHJcbiAgUGFyc2VkUmVxdWVzdFJlc3VsdCxcclxuICBQYXJzZWRBbm9ueW1vdXNSZXF1ZXN0RXJyb3IsXHJcbiAgTG9naW5DcmVkZW50aWFscyxcclxufSBmcm9tICcuLi8uLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBSZXF1ZXN0RXhjZXB0aW9uIGZyb20gJy4uLy4uLy4uL1N0dWRlbnRWdWUvUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCB7XHJcbiAgcHJpdmF0ZSBfX3VzZXJuYW1lX186IHN0cmluZztcclxuICBwcml2YXRlIF9fcGFzc3dvcmRfXzogc3RyaW5nO1xyXG4gIHByaXZhdGUgX19kaXN0cmljdF9fOiBzdHJpbmc7XHJcblxyXG4gIHByaXZhdGUgZ2V0IGRpc3RyaWN0KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fX2Rpc3RyaWN0X187XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldCB1c2VybmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX191c2VybmFtZV9fO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXQgcGFzc3dvcmQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9fcGFzc3dvcmRfXztcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBnZXQgY3JlZGVudGlhbHMoKTogTG9naW5DcmVkZW50aWFscyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB1c2VybmFtZTogdGhpcy51c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQ6IHRoaXMucGFzc3dvcmQsXHJcbiAgICAgIGRpc3RyaWN0VXJsOiB0aGlzLmRpc3RyaWN0LFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzKSB7XHJcbiAgICB0aGlzLl9fdXNlcm5hbWVfXyA9IGNyZWRlbnRpYWxzLnVzZXJuYW1lO1xyXG4gICAgdGhpcy5fX3Bhc3N3b3JkX18gPSBjcmVkZW50aWFscy5wYXNzd29yZDtcclxuICAgIHRoaXMuX19kaXN0cmljdF9fID0gY3JlZGVudGlhbHMuZGlzdHJpY3RVcmw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBQT1NUIHJlcXVlc3QgdG8gc3luZXJneSBzZXJ2ZXJzIHRvIGZldGNoIGRhdGFcclxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHByb3ZpZGUgd2hlbiBtYWtpbmcgYSBYTUwgcmVxdWVzdCB0byB0aGUgc2VydmVyc1xyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYW4gWE1MIG9iamVjdCB0aGF0IG11c3QgYmUgZGVmaW5lZCBpbiBhIHR5cGUgZGVjbGFyYXRpb24gZmlsZS5cclxuICAgKiBAbGluayBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1N0dWRlbnRWdWUvZG9jc1xyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBzdXBlci5wcm9jZXNzUmVxdWVzdCh7IG1ldGhvZE5hbWU6ICdSZWZlciB0byBTdHVkZW50VnVlL2RvY3MnLCBwYXJhbVN0cjogeyBBbnl0aGluZ1RoYXRDYW5CZVBhc3NlZDogdHJ1ZSwgQXNMb25nQXNJdE1hdGNoZXNUaGVEb2N1bWVudGF0aW9uOiB0cnVlIH19KTtcclxuICAgKiAvLyBUaGlzIHdpbGwgbWFrZSB0aGUgWE1MIHJlcXVlc3QgYmVsb3c6XHJcbiAgICogYGBgXHJcbiAgICogXHJcbiAgICogYGBgeG1sXHJcbiAgICogPHNvYXA6RW52ZWxvcGUgeG1sbnM6eHNpPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2VcIiB4bWxuczp4c2Q9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYVwiIHhtbG5zOnNvYXA9XCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlL1wiPlxyXG4gICAgPHNvYXA6Qm9keT5cclxuICAgICAgICA8UHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0IHhtbG5zPVwiaHR0cDovL2VkdXBvaW50LmNvbS93ZWJzZXJ2aWNlcy9cIj5cclxuICAgICAgICAgICAgPHVzZXJJRD5TVFVERU5UX1VTRVJOQU1FPC91c2VySUQ+XHJcbiAgICAgICAgICAgIDxwYXNzd29yZD5TVFVERU5UX1BBU1NXT1JEPC9wYXNzd29yZD5cclxuICAgICAgICAgICAgPHNraXBMb2dpbkxvZz4xPC9za2lwTG9naW5Mb2c+XHJcbiAgICAgICAgICAgIDxwYXJlbnQ+MDwvcGFyZW50PlxyXG4gICAgICAgICAgICA8d2ViU2VydmljZUhhbmRsZU5hbWU+UFhQV2ViU2VydmljZXM8L3dlYlNlcnZpY2VIYW5kbGVOYW1lPlxyXG4gICAgICAgICAgICA8bWV0aG9kTmFtZT5SZWZlciB0byBTdHVkZW50VnVlL2RvY3M8L21ldGhvZE5hbWU+XHJcbiAgICAgICAgICAgIDxwYXJhbVN0cj5cclxuICAgICAgICAgICAgICA8QW55dGhpbmdUaGF0Q2FuQmVQYXNzZWQ+dHJ1ZTwvQW55dGhpbmdUaGF0Q2FuQmVQYXNzZWQ+XHJcbiAgICAgICAgICAgICAgPEFzTG9uZ0FzSXRNYXRjaGVzVGhlRG9jdW1lbnRhdGlvbj50cnVlPC9Bc0xvbmdBc0l0TWF0Y2hlc1RoZURvY3VtZW50YXRpb24+XHJcbiAgICAgICAgICAgIDwvcGFyYW1TdHI+XHJcbiAgICAgICAgPC9Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3Q+XHJcbiAgICA8L3NvYXA6Qm9keT5cclxuPC9zb2FwOkVudmVsb3BlPlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHByb3RlY3RlZCBwcm9jZXNzUmVxdWVzdDxUPihvcHRpb25zOiBSZXF1ZXN0T3B0aW9ucyk6IFByb21pc2U8VD4ge1xyXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IFJlcXVlc3RPcHRpb25zID0ge1xyXG4gICAgICBza2lwTG9naW5Mb2c6IDEsXHJcbiAgICAgIHBhcmVudDogMCxcclxuICAgICAgd2ViU2VydmljZUhhbmRsZU5hbWU6ICdQWFBXZWJTZXJ2aWNlcycsXHJcbiAgICAgIHBhcmFtU3RyOiB7fSxcclxuICAgICAgLi4ub3B0aW9ucyxcclxuICAgIH07XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcywgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgWE1MQnVpbGRlcih7XHJcbiAgICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXHJcbiAgICAgICAgYXJyYXlOb2RlTmFtZTogJ3NvYXA6RW52ZWxvcGUnLFxyXG4gICAgICAgIHN1cHByZXNzRW1wdHlOb2RlOiB0cnVlLFxyXG4gICAgICB9KTtcclxuICAgICAgY29uc3QgeG1sID0gYnVpbGRlci5idWlsZCh7XHJcbiAgICAgICAgJ3NvYXA6RW52ZWxvcGUnOiB7XHJcbiAgICAgICAgICAnQF94bWxuczp4c2knOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnLFxyXG4gICAgICAgICAgJ0BfeG1sbnM6eHNkJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJyxcclxuICAgICAgICAgICdAX3htbG5zOnNvYXAnOiAnaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nLFxyXG4gICAgICAgICAgJ3NvYXA6Qm9keSc6IHtcclxuICAgICAgICAgICAgUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0OiB7XHJcbiAgICAgICAgICAgICAgJ0BfeG1sbnMnOiAnaHR0cDovL2VkdXBvaW50LmNvbS93ZWJzZXJ2aWNlcy8nLFxyXG4gICAgICAgICAgICAgIHVzZXJJRDogdGhpcy51c2VybmFtZSxcclxuICAgICAgICAgICAgICBwYXNzd29yZDogdGhpcy5wYXNzd29yZCxcclxuICAgICAgICAgICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcclxuICAgICAgICAgICAgICAuLi57IHBhcmFtU3RyOiBDbGllbnQucGFyc2VQYXJhbVN0cihkZWZhdWx0T3B0aW9ucy5wYXJhbVN0ciA/PyB7fSkgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBheGlvc1xyXG4gICAgICAgIC5wb3N0PHN0cmluZz4odGhpcy5kaXN0cmljdCwgeG1sLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbCcgfSB9KVxyXG4gICAgICAgIC50aGVuKCh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IFhNTFBhcnNlcih7fSk7XHJcbiAgICAgICAgICBjb25zdCByZXN1bHQ6IFBhcnNlZFJlcXVlc3RSZXN1bHQgPSBwYXJzZXIucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgICBjb25zdCBwYXJzZXJUd28gPSBuZXcgWE1MUGFyc2VyKHtcclxuICAgICAgICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXHJcbiAgICAgICAgICAgIGlzQXJyYXk6ICgpID0+IHRydWUsXHJcbiAgICAgICAgICAgIHByb2Nlc3NFbnRpdGllczogZmFsc2UsXHJcbiAgICAgICAgICAgIHBhcnNlQXR0cmlidXRlVmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICBwYXJzZVRhZ1ZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNvbnN0IG9iajogVCB8IFBhcnNlZFJlcXVlc3RFcnJvciA9IHBhcnNlclR3by5wYXJzZShcclxuICAgICAgICAgICAgcmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bXHJcbiAgICAgICAgICAgICAgJ3NvYXA6Qm9keSdcclxuICAgICAgICAgICAgXS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXNwb25zZS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHQucmVwbGFjZShcclxuICAgICAgICAgICAgICAvKD88PUNvbnRlbnQ9XCIpLiooPz1cIlxcc1JlYWQpL2csXHJcbiAgICAgICAgICAgICAgYnRvYVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIGlmICgnUlRfRVJST1InIGluIG9iaikgcmV0dXJuIHJlamVjdChuZXcgUmVxdWVzdEV4Y2VwdGlvbihvYmopKTtcclxuXHJcbiAgICAgICAgICByZXMob2JqKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWplY3QpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN0YXRpYyBwYXJzZVBhcmFtU3RyKGlucHV0OiBvYmplY3QpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgYnVpbGRlciA9IG5ldyBYTUxCdWlsZGVyKHtcclxuICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXHJcbiAgICAgIGFycmF5Tm9kZU5hbWU6ICdQYXJhbXMnLFxyXG4gICAgICBzdXBwcmVzc0VtcHR5Tm9kZTogdHJ1ZSxcclxuICAgICAgc3VwcHJlc3NCb29sZWFuQXR0cmlidXRlczogZmFsc2UsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHhtbCA9IGA8UGFybXM+JHtidWlsZGVyLmJ1aWxkKGlucHV0KX08L1Bhcm1zPmA7XHJcbiAgICByZXR1cm4geG1sO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBwcm9jZXNzQW5vbnltb3VzUmVxdWVzdDxUPih1cmw6IHN0cmluZywgb3B0aW9uczogUGFydGlhbDxSZXF1ZXN0T3B0aW9ucz4gPSB7fSk6IFByb21pc2U8VD4ge1xyXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IFJlcXVlc3RPcHRpb25zID0ge1xyXG4gICAgICBza2lwTG9naW5Mb2c6IDEsXHJcbiAgICAgIHBhcmVudDogMCxcclxuICAgICAgd2ViU2VydmljZUhhbmRsZU5hbWU6ICdIREluZm9TZXJ2aWNlcycsXHJcbiAgICAgIG1ldGhvZE5hbWU6ICdHZXRNYXRjaGluZ0Rpc3RyaWN0TGlzdCcsXHJcbiAgICAgIHBhcmFtU3RyOiB7fSxcclxuICAgICAgLi4ub3B0aW9ucyxcclxuICAgIH07XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8VD4oYXN5bmMgKHJlcywgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgWE1MQnVpbGRlcih7XHJcbiAgICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXHJcbiAgICAgICAgYXJyYXlOb2RlTmFtZTogJ3NvYXA6RW52ZWxvcGUnLFxyXG4gICAgICAgIHN1cHByZXNzRW1wdHlOb2RlOiB0cnVlLFxyXG4gICAgICB9KTtcclxuICAgICAgY29uc3QgeG1sID0gYnVpbGRlci5idWlsZCh7XHJcbiAgICAgICAgJ3NvYXA6RW52ZWxvcGUnOiB7XHJcbiAgICAgICAgICAnQF94bWxuczp4c2knOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnLFxyXG4gICAgICAgICAgJ0BfeG1sbnM6eHNkJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJyxcclxuICAgICAgICAgICdAX3htbG5zOnNvYXAnOiAnaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nLFxyXG4gICAgICAgICAgJ3NvYXA6Qm9keSc6IHtcclxuICAgICAgICAgICAgUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0OiB7XHJcbiAgICAgICAgICAgICAgJ0BfeG1sbnMnOiAnaHR0cDovL2VkdXBvaW50LmNvbS93ZWJzZXJ2aWNlcy8nLFxyXG4gICAgICAgICAgICAgIHVzZXJJRDogJ0VkdXBvaW50RGlzdHJpY3RJbmZvJyxcclxuICAgICAgICAgICAgICBwYXNzd29yZDogJ0VkdXAwMW50JyxcclxuICAgICAgICAgICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcclxuICAgICAgICAgICAgICAuLi57IHBhcmFtU3RyOiBDbGllbnQucGFyc2VQYXJhbVN0cihkZWZhdWx0T3B0aW9ucy5wYXJhbVN0ciA/PyB7fSkgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgYXhpb3MucG9zdDxzdHJpbmc+KHVybCwgeG1sLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbCcgfSB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IFhNTFBhcnNlcih7fSk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBQYXJzZWRSZXF1ZXN0UmVzdWx0ID0gcGFyc2VyLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIGNvbnN0IHBhcnNlclR3byA9IG5ldyBYTUxQYXJzZXIoeyBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSB9KTtcclxuXHJcbiAgICAgICAgY29uc3Qgb2JqOiBUIHwgUGFyc2VkQW5vbnltb3VzUmVxdWVzdEVycm9yID0gcGFyc2VyVHdvLnBhcnNlKFxyXG4gICAgICAgICAgcmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddLlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3BvbnNlLlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3VsdC5yZXBsYWNlKFxyXG4gICAgICAgICAgICAvJmd0Oy9nLFxyXG4gICAgICAgICAgICAnPidcclxuICAgICAgICAgICkucmVwbGFjZSgvJmx0Oy9nLCAnPCcpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCdSVF9FUlJPUicgaW4gb2JqKSByZXR1cm4gcmVqZWN0KG5ldyBSZXF1ZXN0RXhjZXB0aW9uKG9iaikpO1xyXG5cclxuICAgICAgICByZXMob2JqKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlamVjdChlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==