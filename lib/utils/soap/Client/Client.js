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
     * @description
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9zb2FwL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50IiwiZGlzdHJpY3QiLCJfX2Rpc3RyaWN0X18iLCJ1c2VybmFtZSIsIl9fdXNlcm5hbWVfXyIsInBhc3N3b3JkIiwiX19wYXNzd29yZF9fIiwiY3JlZGVudGlhbHMiLCJkaXN0cmljdFVybCIsImNvbnN0cnVjdG9yIiwicHJvY2Vzc1JlcXVlc3QiLCJvcHRpb25zIiwiZGVmYXVsdE9wdGlvbnMiLCJza2lwTG9naW5Mb2ciLCJwYXJlbnQiLCJ3ZWJTZXJ2aWNlSGFuZGxlTmFtZSIsInBhcmFtU3RyIiwiUHJvbWlzZSIsInJlcyIsInJlamVjdCIsImJ1aWxkZXIiLCJYTUxCdWlsZGVyIiwiaWdub3JlQXR0cmlidXRlcyIsImFycmF5Tm9kZU5hbWUiLCJzdXBwcmVzc0VtcHR5Tm9kZSIsInhtbCIsImJ1aWxkIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0IiwidXNlcklEIiwicGFyc2VQYXJhbVN0ciIsImF4aW9zIiwicG9zdCIsImhlYWRlcnMiLCJ0aGVuIiwiZGF0YSIsInBhcnNlciIsIlhNTFBhcnNlciIsInJlc3VsdCIsInBhcnNlIiwicGFyc2VyVHdvIiwiaXNBcnJheSIsInByb2Nlc3NFbnRpdGllcyIsInBhcnNlQXR0cmlidXRlVmFsdWUiLCJwYXJzZVRhZ1ZhbHVlIiwib2JqIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzcG9uc2UiLCJQcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHQiLCJyZXBsYWNlIiwiYnRvYSIsIlJlcXVlc3RFeGNlcHRpb24iLCJjYXRjaCIsImlucHV0Iiwic3VwcHJlc3NCb29sZWFuQXR0cmlidXRlcyIsInByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0IiwidXJsIiwibWV0aG9kTmFtZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVdlLFFBQU1BLE1BQU4sQ0FBYTtBQUtO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YztBQUFFZCxZQUFBQSxnQkFBZ0IsRUFBRTtBQUFwQixXQUFkLENBQWxCO0FBRUEsZ0JBQU1zQixHQUFvQyxHQUFHTCxTQUFTLENBQUNELEtBQVYsQ0FDM0NELE1BQU0sQ0FBQyxlQUFELENBQU4sQ0FBd0IsV0FBeEIsRUFBcUNRLGdDQUFyQyxDQUFzRUMsOEJBQXRFLENBQXFHQyxPQUFyRyxDQUNFLE9BREYsRUFFRSxHQUZGLEVBR0VBLE9BSEYsQ0FHVSxPQUhWLEVBR21CLEdBSG5CLENBRDJDLENBQTdDOztBQU9BLGNBQUksY0FBY0gsR0FBbEI7QUFBdUIsbUJBQU96QixNQUFNLENBQUMsSUFBSThCLHlCQUFKLENBQXFCTCxHQUFyQixDQUFELENBQWI7QUFBdkI7O0FBRUExQixVQUFBQSxHQUFHLENBQUMwQixHQUFELENBQUg7QUFDRCxTQWpCRCxDQWlCRSxPQUFPWSxDQUFQLEVBQVU7QUFDVnJDLFVBQUFBLE1BQU0sQ0FBQ3FDLENBQUQsQ0FBTjtBQUNEO0FBQ0YsT0EzQ00sQ0FBUDtBQTRDRDs7QUExTHlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IHsgWE1MQnVpbGRlciwgWE1MUGFyc2VyIH0gZnJvbSAnZmFzdC14bWwtcGFyc2VyJztcclxuaW1wb3J0IHtcclxuICBQYXJzZWRSZXF1ZXN0RXJyb3IsXHJcbiAgUmVxdWVzdE9wdGlvbnMsXHJcbiAgUGFyc2VkUmVxdWVzdFJlc3VsdCxcclxuICBQYXJzZWRBbm9ueW1vdXNSZXF1ZXN0RXJyb3IsXHJcbiAgTG9naW5DcmVkZW50aWFscyxcclxufSBmcm9tICcuLi8uLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBSZXF1ZXN0RXhjZXB0aW9uIGZyb20gJy4uLy4uLy4uL1N0dWRlbnRWdWUvUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCB7XHJcbiAgcHJpdmF0ZSBfX3VzZXJuYW1lX186IHN0cmluZztcclxuICBwcml2YXRlIF9fcGFzc3dvcmRfXzogc3RyaW5nO1xyXG4gIHByaXZhdGUgX19kaXN0cmljdF9fOiBzdHJpbmc7XHJcblxyXG4gIHByaXZhdGUgZ2V0IGRpc3RyaWN0KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fX2Rpc3RyaWN0X187XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldCB1c2VybmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX191c2VybmFtZV9fO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXQgcGFzc3dvcmQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9fcGFzc3dvcmRfXztcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBnZXQgY3JlZGVudGlhbHMoKTogTG9naW5DcmVkZW50aWFscyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB1c2VybmFtZTogdGhpcy51c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQ6IHRoaXMucGFzc3dvcmQsXHJcbiAgICAgIGRpc3RyaWN0VXJsOiB0aGlzLmRpc3RyaWN0LFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzKSB7XHJcbiAgICB0aGlzLl9fdXNlcm5hbWVfXyA9IGNyZWRlbnRpYWxzLnVzZXJuYW1lO1xyXG4gICAgdGhpcy5fX3Bhc3N3b3JkX18gPSBjcmVkZW50aWFscy5wYXNzd29yZDtcclxuICAgIHRoaXMuX19kaXN0cmljdF9fID0gY3JlZGVudGlhbHMuZGlzdHJpY3RVcmw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBQT1NUIHJlcXVlc3QgdG8gc3luZXJneSBzZXJ2ZXJzIHRvIGZldGNoIGRhdGFcclxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHByb3ZpZGUgd2hlbiBtYWtpbmcgYSBYTUwgcmVxdWVzdCB0byB0aGUgc2VydmVyc1xyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYW4gWE1MIG9iamVjdCB0aGF0IG11c3QgYmUgZGVmaW5lZCBpbiBhIHR5cGUgZGVjbGFyYXRpb24gZmlsZS5cclxuICAgKiBAbGluayBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1N0dWRlbnRWdWUvZG9jc1xyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogc3VwZXIucHJvY2Vzc1JlcXVlc3QoeyBtZXRob2ROYW1lOiAnUmVmZXIgdG8gU3R1ZGVudFZ1ZS9kb2NzJywgcGFyYW1TdHI6IHsgQW55dGhpbmdUaGF0Q2FuQmVQYXNzZWQ6IHRydWUsIEFzTG9uZ0FzSXRNYXRjaGVzVGhlRG9jdW1lbnRhdGlvbjogdHJ1ZSB9fSk7XHJcbiAgICogLy8gVGhpcyB3aWxsIG1ha2UgdGhlIFhNTCByZXF1ZXN0IGJlbG93OlxyXG4gICAqIGBgYFxyXG4gICAqIFxyXG4gICAqIGBgYHhtbFxyXG4gICAqIDxzb2FwOkVudmVsb3BlIHhtbG5zOnhzaT1cImh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlXCIgeG1sbnM6eHNkPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWFcIiB4bWxuczpzb2FwPVwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS9cIj5cclxuICAgICAgPHNvYXA6Qm9keT5cclxuICAgICAgICA8UHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0IHhtbG5zPVwiaHR0cDovL2VkdXBvaW50LmNvbS93ZWJzZXJ2aWNlcy9cIj5cclxuICAgICAgICAgICAgPHVzZXJJRD5TVFVERU5UX1VTRVJOQU1FPC91c2VySUQ+XHJcbiAgICAgICAgICAgIDxwYXNzd29yZD5TVFVERU5UX1BBU1NXT1JEPC9wYXNzd29yZD5cclxuICAgICAgICAgICAgPHNraXBMb2dpbkxvZz4xPC9za2lwTG9naW5Mb2c+XHJcbiAgICAgICAgICAgIDxwYXJlbnQ+MDwvcGFyZW50PlxyXG4gICAgICAgICAgICA8d2ViU2VydmljZUhhbmRsZU5hbWU+UFhQV2ViU2VydmljZXM8L3dlYlNlcnZpY2VIYW5kbGVOYW1lPlxyXG4gICAgICAgICAgICA8bWV0aG9kTmFtZT5SZWZlciB0byBTdHVkZW50VnVlL2RvY3M8L21ldGhvZE5hbWU+XHJcbiAgICAgICAgICAgIDxwYXJhbVN0cj5cclxuICAgICAgICAgICAgICA8QW55dGhpbmdUaGF0Q2FuQmVQYXNzZWQ+dHJ1ZTwvQW55dGhpbmdUaGF0Q2FuQmVQYXNzZWQ+XHJcbiAgICAgICAgICAgICAgPEFzTG9uZ0FzSXRNYXRjaGVzVGhlRG9jdW1lbnRhdGlvbj50cnVlPC9Bc0xvbmdBc0l0TWF0Y2hlc1RoZURvY3VtZW50YXRpb24+XHJcbiAgICAgICAgICAgIDwvcGFyYW1TdHI+XHJcbiAgICAgICAgPC9Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3Q+XHJcbiAgICAgIDwvc29hcDpCb2R5PlxyXG48L3NvYXA6RW52ZWxvcGU+XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHJvdGVjdGVkIHByb2Nlc3NSZXF1ZXN0PFQ+KG9wdGlvbnM6IFJlcXVlc3RPcHRpb25zKTogUHJvbWlzZTxUPiB7XHJcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogUmVxdWVzdE9wdGlvbnMgPSB7XHJcbiAgICAgIHNraXBMb2dpbkxvZzogMSxcclxuICAgICAgcGFyZW50OiAwLFxyXG4gICAgICB3ZWJTZXJ2aWNlSGFuZGxlTmFtZTogJ1BYUFdlYlNlcnZpY2VzJyxcclxuICAgICAgcGFyYW1TdHI6IHt9LFxyXG4gICAgICAuLi5vcHRpb25zLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgYnVpbGRlciA9IG5ldyBYTUxCdWlsZGVyKHtcclxuICAgICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgICAgICBhcnJheU5vZGVOYW1lOiAnc29hcDpFbnZlbG9wZScsXHJcbiAgICAgICAgc3VwcHJlc3NFbXB0eU5vZGU6IHRydWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zdCB4bWwgPSBidWlsZGVyLmJ1aWxkKHtcclxuICAgICAgICAnc29hcDpFbnZlbG9wZSc6IHtcclxuICAgICAgICAgICdAX3htbG5zOnhzaSc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZScsXHJcbiAgICAgICAgICAnQF94bWxuczp4c2QnOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEnLFxyXG4gICAgICAgICAgJ0BfeG1sbnM6c29hcCc6ICdodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlLycsXHJcbiAgICAgICAgICAnc29hcDpCb2R5Jzoge1xyXG4gICAgICAgICAgICBQcm9jZXNzV2ViU2VydmljZVJlcXVlc3Q6IHtcclxuICAgICAgICAgICAgICAnQF94bWxucyc6ICdodHRwOi8vZWR1cG9pbnQuY29tL3dlYnNlcnZpY2VzLycsXHJcbiAgICAgICAgICAgICAgdXNlcklEOiB0aGlzLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiB0aGlzLnBhc3N3b3JkLFxyXG4gICAgICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxyXG4gICAgICAgICAgICAgIC4uLnsgcGFyYW1TdHI6IENsaWVudC5wYXJzZVBhcmFtU3RyKGRlZmF1bHRPcHRpb25zLnBhcmFtU3RyID8/IHt9KSB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGF4aW9zXHJcbiAgICAgICAgLnBvc3Q8c3RyaW5nPih0aGlzLmRpc3RyaWN0LCB4bWwsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ3RleHQveG1sJyB9IH0pXHJcbiAgICAgICAgLnRoZW4oKHsgZGF0YSB9KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgWE1MUGFyc2VyKHt9KTtcclxuICAgICAgICAgIGNvbnN0IHJlc3VsdDogUGFyc2VkUmVxdWVzdFJlc3VsdCA9IHBhcnNlci5wYXJzZShkYXRhKTtcclxuICAgICAgICAgIGNvbnN0IHBhcnNlclR3byA9IG5ldyBYTUxQYXJzZXIoe1xyXG4gICAgICAgICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgICAgICAgICAgaXNBcnJheTogKCkgPT4gdHJ1ZSxcclxuICAgICAgICAgICAgcHJvY2Vzc0VudGl0aWVzOiBmYWxzZSxcclxuICAgICAgICAgICAgcGFyc2VBdHRyaWJ1dGVWYWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHBhcnNlVGFnVmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY29uc3Qgb2JqOiBUIHwgUGFyc2VkUmVxdWVzdEVycm9yID0gcGFyc2VyVHdvLnBhcnNlKFxyXG4gICAgICAgICAgICByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVtcclxuICAgICAgICAgICAgICAnc29hcDpCb2R5J1xyXG4gICAgICAgICAgICBdLlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3BvbnNlLlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3VsdC5yZXBsYWNlKFxyXG4gICAgICAgICAgICAgIC8oPzw9Q29udGVudD1cIikuKig/PVwiXFxzUmVhZCkvZyxcclxuICAgICAgICAgICAgICBidG9hXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgaWYgKCdSVF9FUlJPUicgaW4gb2JqKSByZXR1cm4gcmVqZWN0KG5ldyBSZXF1ZXN0RXhjZXB0aW9uKG9iaikpO1xyXG5cclxuICAgICAgICAgIHJlcyhvYmopO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlamVjdCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIHBhcnNlUGFyYW1TdHIoaW5wdXQ6IG9iamVjdCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBidWlsZGVyID0gbmV3IFhNTEJ1aWxkZXIoe1xyXG4gICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgICAgYXJyYXlOb2RlTmFtZTogJ1BhcmFtcycsXHJcbiAgICAgIHN1cHByZXNzRW1wdHlOb2RlOiB0cnVlLFxyXG4gICAgICBzdXBwcmVzc0Jvb2xlYW5BdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgIH0pO1xyXG4gICAgY29uc3QgeG1sID0gYDxQYXJtcz4ke2J1aWxkZXIuYnVpbGQoaW5wdXQpfTwvUGFybXM+YDtcclxuICAgIHJldHVybiB4bWw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0PFQ+KHVybDogc3RyaW5nLCBvcHRpb25zOiBQYXJ0aWFsPFJlcXVlc3RPcHRpb25zPiA9IHt9KTogUHJvbWlzZTxUPiB7XHJcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogUmVxdWVzdE9wdGlvbnMgPSB7XHJcbiAgICAgIHNraXBMb2dpbkxvZzogMSxcclxuICAgICAgcGFyZW50OiAwLFxyXG4gICAgICB3ZWJTZXJ2aWNlSGFuZGxlTmFtZTogJ0hESW5mb1NlcnZpY2VzJyxcclxuICAgICAgbWV0aG9kTmFtZTogJ0dldE1hdGNoaW5nRGlzdHJpY3RMaXN0JyxcclxuICAgICAgcGFyYW1TdHI6IHt9LFxyXG4gICAgICAuLi5vcHRpb25zLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxUPihhc3luYyAocmVzLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgYnVpbGRlciA9IG5ldyBYTUxCdWlsZGVyKHtcclxuICAgICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgICAgICBhcnJheU5vZGVOYW1lOiAnc29hcDpFbnZlbG9wZScsXHJcbiAgICAgICAgc3VwcHJlc3NFbXB0eU5vZGU6IHRydWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zdCB4bWwgPSBidWlsZGVyLmJ1aWxkKHtcclxuICAgICAgICAnc29hcDpFbnZlbG9wZSc6IHtcclxuICAgICAgICAgICdAX3htbG5zOnhzaSc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZScsXHJcbiAgICAgICAgICAnQF94bWxuczp4c2QnOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEnLFxyXG4gICAgICAgICAgJ0BfeG1sbnM6c29hcCc6ICdodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlLycsXHJcbiAgICAgICAgICAnc29hcDpCb2R5Jzoge1xyXG4gICAgICAgICAgICBQcm9jZXNzV2ViU2VydmljZVJlcXVlc3Q6IHtcclxuICAgICAgICAgICAgICAnQF94bWxucyc6ICdodHRwOi8vZWR1cG9pbnQuY29tL3dlYnNlcnZpY2VzLycsXHJcbiAgICAgICAgICAgICAgdXNlcklEOiAnRWR1cG9pbnREaXN0cmljdEluZm8nLFxyXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiAnRWR1cDAxbnQnLFxyXG4gICAgICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxyXG4gICAgICAgICAgICAgIC4uLnsgcGFyYW1TdHI6IENsaWVudC5wYXJzZVBhcmFtU3RyKGRlZmF1bHRPcHRpb25zLnBhcmFtU3RyID8/IHt9KSB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBheGlvcy5wb3N0PHN0cmluZz4odXJsLCB4bWwsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ3RleHQveG1sJyB9IH0pO1xyXG5cclxuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgWE1MUGFyc2VyKHt9KTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFBhcnNlZFJlcXVlc3RSZXN1bHQgPSBwYXJzZXIucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgY29uc3QgcGFyc2VyVHdvID0gbmV3IFhNTFBhcnNlcih7IGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBvYmo6IFQgfCBQYXJzZWRBbm9ueW1vdXNSZXF1ZXN0RXJyb3IgPSBwYXJzZXJUd28ucGFyc2UoXHJcbiAgICAgICAgICByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzcG9uc2UuUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzdWx0LnJlcGxhY2UoXHJcbiAgICAgICAgICAgIC8mZ3Q7L2csXHJcbiAgICAgICAgICAgICc+J1xyXG4gICAgICAgICAgKS5yZXBsYWNlKC8mbHQ7L2csICc8JylcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoJ1JUX0VSUk9SJyBpbiBvYmopIHJldHVybiByZWplY3QobmV3IFJlcXVlc3RFeGNlcHRpb24ob2JqKSk7XHJcblxyXG4gICAgICAgIHJlcyhvYmopO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19