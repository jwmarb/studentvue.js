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
      this.isParent = credentials.isParent ? 1 : 0;
    }

    /**
     * Create a POST request to synergy servers to fetch data
     * @param options Options to provide when making a XML request to the servers
     * @param preparse Runs before parsing the xml string into an object. Useful for mutating xml that could be parsed incorrectly by `fast-xml-parser`
     * @returns Returns an XML object that must be defined in a type declaration file.
     * @see https://github.com/StudentVue/docs
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
    processRequest(options, preparse = xml => {
      return xml;
    }) {
      const defaultOptions = {
        validateErrors: true,
        skipLoginLog: 0,
        parent: this.isParent,
        webServiceHandleName: 'PXPWebServices',
        paramStr: {},
        ...options
      };
      return new Promise((res, reject) => {
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
          const obj = parserTwo.parse(preparse(result['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult));
          if (defaultOptions.validateErrors && typeof obj === 'object' && 'RT_ERROR' in obj) {
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
    static processAnonymousRequest(url, options = {}, preparse = d => {
      return d.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
    }) {
      const defaultOptions = {
        skipLoginLog: 0,
        validateErrors: true,
        parent: 0,
        webServiceHandleName: 'HDInfoServices',
        methodName: 'GetMatchingDistrictList',
        paramStr: {},
        ...options
      };
      return new Promise((res, reject) => {
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
        _axios.default.post(url, xml, {
          headers: {
            'Content-Type': 'text/xml'
          }
        }).then(({
          data
        }) => {
          const parser = new _fastXmlParser.XMLParser({});
          const result = parser.parse(data);
          const parserTwo = new _fastXmlParser.XMLParser({
            ignoreAttributes: false
          });
          const obj = parserTwo.parse(preparse(result['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult));
          if (defaultOptions.validateErrors && typeof obj === 'object' && 'RT_ERROR' in obj) {
            return reject(new _RequestException.default(obj));
          }
          res(obj);
        }).catch(reject);
      });
    }
  }
  _exports.default = Client;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDbGllbnQiLCJkaXN0cmljdCIsIl9fZGlzdHJpY3RfXyIsInVzZXJuYW1lIiwiX191c2VybmFtZV9fIiwicGFzc3dvcmQiLCJfX3Bhc3N3b3JkX18iLCJjcmVkZW50aWFscyIsImRpc3RyaWN0VXJsIiwiY29uc3RydWN0b3IiLCJpc1BhcmVudCIsInByb2Nlc3NSZXF1ZXN0Iiwib3B0aW9ucyIsInByZXBhcnNlIiwieG1sIiwiZGVmYXVsdE9wdGlvbnMiLCJ2YWxpZGF0ZUVycm9ycyIsInNraXBMb2dpbkxvZyIsInBhcmVudCIsIndlYlNlcnZpY2VIYW5kbGVOYW1lIiwicGFyYW1TdHIiLCJQcm9taXNlIiwicmVzIiwicmVqZWN0IiwiYnVpbGRlciIsIlhNTEJ1aWxkZXIiLCJpZ25vcmVBdHRyaWJ1dGVzIiwiYXJyYXlOb2RlTmFtZSIsInN1cHByZXNzRW1wdHlOb2RlIiwiYnVpbGQiLCJQcm9jZXNzV2ViU2VydmljZVJlcXVlc3QiLCJ1c2VySUQiLCJwYXJzZVBhcmFtU3RyIiwiYXhpb3MiLCJwb3N0IiwiaGVhZGVycyIsInRoZW4iLCJkYXRhIiwicGFyc2VyIiwiWE1MUGFyc2VyIiwicmVzdWx0IiwicGFyc2UiLCJwYXJzZXJUd28iLCJpc0FycmF5IiwicHJvY2Vzc0VudGl0aWVzIiwicGFyc2VBdHRyaWJ1dGVWYWx1ZSIsInBhcnNlVGFnVmFsdWUiLCJvYmoiLCJQcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXNwb25zZSIsIlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3VsdCIsIlJlcXVlc3RFeGNlcHRpb24iLCJjYXRjaCIsImlucHV0Iiwic3VwcHJlc3NCb29sZWFuQXR0cmlidXRlcyIsInByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0IiwidXJsIiwiZCIsInJlcGxhY2UiLCJtZXRob2ROYW1lIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgeyBYTUxCdWlsZGVyLCBYTUxQYXJzZXIgfSBmcm9tICdmYXN0LXhtbC1wYXJzZXInO1xyXG5pbXBvcnQge1xyXG4gIFBhcnNlZFJlcXVlc3RFcnJvcixcclxuICBSZXF1ZXN0T3B0aW9ucyxcclxuICBQYXJzZWRSZXF1ZXN0UmVzdWx0LFxyXG4gIFBhcnNlZEFub255bW91c1JlcXVlc3RFcnJvcixcclxuICBMb2dpbkNyZWRlbnRpYWxzLFxyXG59IGZyb20gJy4uLy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IFJlcXVlc3RFeGNlcHRpb24gZnJvbSAnLi4vLi4vLi4vU3R1ZGVudFZ1ZS9SZXF1ZXN0RXhjZXB0aW9uL1JlcXVlc3RFeGNlcHRpb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IHtcclxuICBwcml2YXRlIF9fdXNlcm5hbWVfXzogc3RyaW5nO1xyXG4gIHByaXZhdGUgX19wYXNzd29yZF9fOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfX2Rpc3RyaWN0X186IHN0cmluZztcclxuICBwcml2YXRlIHJlYWRvbmx5IGlzUGFyZW50OiBudW1iZXI7XHJcblxyXG4gIHByaXZhdGUgZ2V0IGRpc3RyaWN0KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fX2Rpc3RyaWN0X187XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldCB1c2VybmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX191c2VybmFtZV9fO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXQgcGFzc3dvcmQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9fcGFzc3dvcmRfXztcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBnZXQgY3JlZGVudGlhbHMoKTogTG9naW5DcmVkZW50aWFscyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB1c2VybmFtZTogdGhpcy51c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQ6IHRoaXMucGFzc3dvcmQsXHJcbiAgICAgIGRpc3RyaWN0VXJsOiB0aGlzLmRpc3RyaWN0LFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzKSB7XHJcbiAgICB0aGlzLl9fdXNlcm5hbWVfXyA9IGNyZWRlbnRpYWxzLnVzZXJuYW1lO1xyXG4gICAgdGhpcy5fX3Bhc3N3b3JkX18gPSBjcmVkZW50aWFscy5wYXNzd29yZDtcclxuICAgIHRoaXMuX19kaXN0cmljdF9fID0gY3JlZGVudGlhbHMuZGlzdHJpY3RVcmw7XHJcbiAgICB0aGlzLmlzUGFyZW50ID0gY3JlZGVudGlhbHMuaXNQYXJlbnQgPyAxIDogMDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIFBPU1QgcmVxdWVzdCB0byBzeW5lcmd5IHNlcnZlcnMgdG8gZmV0Y2ggZGF0YVxyXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcHJvdmlkZSB3aGVuIG1ha2luZyBhIFhNTCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJzXHJcbiAgICogQHBhcmFtIHByZXBhcnNlIFJ1bnMgYmVmb3JlIHBhcnNpbmcgdGhlIHhtbCBzdHJpbmcgaW50byBhbiBvYmplY3QuIFVzZWZ1bCBmb3IgbXV0YXRpbmcgeG1sIHRoYXQgY291bGQgYmUgcGFyc2VkIGluY29ycmVjdGx5IGJ5IGBmYXN0LXhtbC1wYXJzZXJgXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhbiBYTUwgb2JqZWN0IHRoYXQgbXVzdCBiZSBkZWZpbmVkIGluIGEgdHlwZSBkZWNsYXJhdGlvbiBmaWxlLlxyXG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1N0dWRlbnRWdWUvZG9jc1xyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogc3VwZXIucHJvY2Vzc1JlcXVlc3QoeyBtZXRob2ROYW1lOiAnUmVmZXIgdG8gU3R1ZGVudFZ1ZS9kb2NzJywgcGFyYW1TdHI6IHsgQW55dGhpbmdUaGF0Q2FuQmVQYXNzZWQ6IHRydWUsIEFzTG9uZ0FzSXRNYXRjaGVzVGhlRG9jdW1lbnRhdGlvbjogdHJ1ZSB9fSk7XHJcbiAgICogLy8gVGhpcyB3aWxsIG1ha2UgdGhlIFhNTCByZXF1ZXN0IGJlbG93OlxyXG4gICAqIGBgYFxyXG4gICAqIFxyXG4gICAqIGBgYHhtbFxyXG4gICAqIDxzb2FwOkVudmVsb3BlIHhtbG5zOnhzaT1cImh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlXCIgeG1sbnM6eHNkPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWFcIiB4bWxuczpzb2FwPVwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS9cIj5cclxuICAgICAgPHNvYXA6Qm9keT5cclxuICAgICAgICA8UHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0IHhtbG5zPVwiaHR0cDovL2VkdXBvaW50LmNvbS93ZWJzZXJ2aWNlcy9cIj5cclxuICAgICAgICAgICAgPHVzZXJJRD5TVFVERU5UX1VTRVJOQU1FPC91c2VySUQ+XHJcbiAgICAgICAgICAgIDxwYXNzd29yZD5TVFVERU5UX1BBU1NXT1JEPC9wYXNzd29yZD5cclxuICAgICAgICAgICAgPHNraXBMb2dpbkxvZz4xPC9za2lwTG9naW5Mb2c+XHJcbiAgICAgICAgICAgIDxwYXJlbnQ+MDwvcGFyZW50PlxyXG4gICAgICAgICAgICA8d2ViU2VydmljZUhhbmRsZU5hbWU+UFhQV2ViU2VydmljZXM8L3dlYlNlcnZpY2VIYW5kbGVOYW1lPlxyXG4gICAgICAgICAgICA8bWV0aG9kTmFtZT5SZWZlciB0byBTdHVkZW50VnVlL2RvY3M8L21ldGhvZE5hbWU+XHJcbiAgICAgICAgICAgIDxwYXJhbVN0cj5cclxuICAgICAgICAgICAgICA8QW55dGhpbmdUaGF0Q2FuQmVQYXNzZWQ+dHJ1ZTwvQW55dGhpbmdUaGF0Q2FuQmVQYXNzZWQ+XHJcbiAgICAgICAgICAgICAgPEFzTG9uZ0FzSXRNYXRjaGVzVGhlRG9jdW1lbnRhdGlvbj50cnVlPC9Bc0xvbmdBc0l0TWF0Y2hlc1RoZURvY3VtZW50YXRpb24+XHJcbiAgICAgICAgICAgIDwvcGFyYW1TdHI+XHJcbiAgICAgICAgPC9Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3Q+XHJcbiAgICAgIDwvc29hcDpCb2R5PlxyXG48L3NvYXA6RW52ZWxvcGU+XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHJvdGVjdGVkIHByb2Nlc3NSZXF1ZXN0PFQgZXh0ZW5kcyBvYmplY3QgfCB1bmRlZmluZWQ+KFxyXG4gICAgb3B0aW9uczogUmVxdWVzdE9wdGlvbnMsXHJcbiAgICBwcmVwYXJzZTogKHhtbDogc3RyaW5nKSA9PiBzdHJpbmcgPSAoeG1sKSA9PiB4bWxcclxuICApOiBQcm9taXNlPFQ+IHtcclxuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBSZXF1ZXN0T3B0aW9ucyA9IHtcclxuICAgICAgdmFsaWRhdGVFcnJvcnM6IHRydWUsXHJcbiAgICAgIHNraXBMb2dpbkxvZzogMCxcclxuICAgICAgcGFyZW50OiB0aGlzLmlzUGFyZW50LFxyXG4gICAgICB3ZWJTZXJ2aWNlSGFuZGxlTmFtZTogJ1BYUFdlYlNlcnZpY2VzJyxcclxuICAgICAgcGFyYW1TdHI6IHt9LFxyXG4gICAgICAuLi5vcHRpb25zLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgYnVpbGRlciA9IG5ldyBYTUxCdWlsZGVyKHtcclxuICAgICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgICAgICBhcnJheU5vZGVOYW1lOiAnc29hcDpFbnZlbG9wZScsXHJcbiAgICAgICAgc3VwcHJlc3NFbXB0eU5vZGU6IHRydWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zdCB4bWwgPSBidWlsZGVyLmJ1aWxkKHtcclxuICAgICAgICAnc29hcDpFbnZlbG9wZSc6IHtcclxuICAgICAgICAgICdAX3htbG5zOnhzaSc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZScsXHJcbiAgICAgICAgICAnQF94bWxuczp4c2QnOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEnLFxyXG4gICAgICAgICAgJ0BfeG1sbnM6c29hcCc6ICdodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlLycsXHJcbiAgICAgICAgICAnc29hcDpCb2R5Jzoge1xyXG4gICAgICAgICAgICBQcm9jZXNzV2ViU2VydmljZVJlcXVlc3Q6IHtcclxuICAgICAgICAgICAgICAnQF94bWxucyc6ICdodHRwOi8vZWR1cG9pbnQuY29tL3dlYnNlcnZpY2VzLycsXHJcbiAgICAgICAgICAgICAgdXNlcklEOiB0aGlzLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiB0aGlzLnBhc3N3b3JkLFxyXG4gICAgICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxyXG4gICAgICAgICAgICAgIC4uLnsgcGFyYW1TdHI6IENsaWVudC5wYXJzZVBhcmFtU3RyKGRlZmF1bHRPcHRpb25zLnBhcmFtU3RyID8/IHt9KSB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGF4aW9zXHJcbiAgICAgICAgLnBvc3Q8c3RyaW5nPih0aGlzLmRpc3RyaWN0LCB4bWwsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ3RleHQveG1sJyB9IH0pXHJcbiAgICAgICAgLnRoZW4oKHsgZGF0YSB9KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgWE1MUGFyc2VyKHt9KTtcclxuICAgICAgICAgIGNvbnN0IHJlc3VsdDogUGFyc2VkUmVxdWVzdFJlc3VsdCA9IHBhcnNlci5wYXJzZShkYXRhKTtcclxuICAgICAgICAgIGNvbnN0IHBhcnNlclR3byA9IG5ldyBYTUxQYXJzZXIoe1xyXG4gICAgICAgICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgICAgICAgICAgaXNBcnJheTogKCkgPT4gdHJ1ZSxcclxuICAgICAgICAgICAgcHJvY2Vzc0VudGl0aWVzOiBmYWxzZSxcclxuICAgICAgICAgICAgcGFyc2VBdHRyaWJ1dGVWYWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHBhcnNlVGFnVmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY29uc3Qgb2JqOiBUIHwgUGFyc2VkUmVxdWVzdEVycm9yID0gcGFyc2VyVHdvLnBhcnNlKFxyXG4gICAgICAgICAgICBwcmVwYXJzZShcclxuICAgICAgICAgICAgICByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzcG9uc2UuUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzdWx0XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgaWYgKGRlZmF1bHRPcHRpb25zLnZhbGlkYXRlRXJyb3JzICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmICdSVF9FUlJPUicgaW4gb2JqKVxyXG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBSZXF1ZXN0RXhjZXB0aW9uKG9iaikpO1xyXG5cclxuICAgICAgICAgIHJlcyhvYmogYXMgVCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqZWN0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgcGFyc2VQYXJhbVN0cihpbnB1dDogb2JqZWN0KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgWE1MQnVpbGRlcih7XHJcbiAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgICBhcnJheU5vZGVOYW1lOiAnUGFyYW1zJyxcclxuICAgICAgc3VwcHJlc3NFbXB0eU5vZGU6IHRydWUsXHJcbiAgICAgIHN1cHByZXNzQm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCB4bWwgPSBgPFBhcm1zPiR7YnVpbGRlci5idWlsZChpbnB1dCl9PC9QYXJtcz5gO1xyXG4gICAgcmV0dXJuIHhtbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc0Fub255bW91c1JlcXVlc3Q8VCBleHRlbmRzIG9iamVjdCB8IHVuZGVmaW5lZD4oXHJcbiAgICB1cmw6IHN0cmluZyxcclxuICAgIG9wdGlvbnM6IFBhcnRpYWw8UmVxdWVzdE9wdGlvbnM+ID0ge30sXHJcbiAgICBwcmVwYXJzZTogKHhtbDogc3RyaW5nKSA9PiBzdHJpbmcgPSAoZCkgPT4gZC5yZXBsYWNlKC8mZ3Q7L2csICc+JykucmVwbGFjZSgvJmx0Oy9nLCAnPCcpXHJcbiAgKTogUHJvbWlzZTxUPiB7XHJcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogUmVxdWVzdE9wdGlvbnMgPSB7XHJcbiAgICAgIHNraXBMb2dpbkxvZzogMCxcclxuICAgICAgdmFsaWRhdGVFcnJvcnM6IHRydWUsXHJcbiAgICAgIHBhcmVudDogMCxcclxuICAgICAgd2ViU2VydmljZUhhbmRsZU5hbWU6ICdIREluZm9TZXJ2aWNlcycsXHJcbiAgICAgIG1ldGhvZE5hbWU6ICdHZXRNYXRjaGluZ0Rpc3RyaWN0TGlzdCcsXHJcbiAgICAgIHBhcmFtU3RyOiB7fSxcclxuICAgICAgLi4ub3B0aW9ucyxcclxuICAgIH07XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8VD4oKHJlcywgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgWE1MQnVpbGRlcih7XHJcbiAgICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXHJcbiAgICAgICAgYXJyYXlOb2RlTmFtZTogJ3NvYXA6RW52ZWxvcGUnLFxyXG4gICAgICAgIHN1cHByZXNzRW1wdHlOb2RlOiB0cnVlLFxyXG4gICAgICB9KTtcclxuICAgICAgY29uc3QgeG1sID0gYnVpbGRlci5idWlsZCh7XHJcbiAgICAgICAgJ3NvYXA6RW52ZWxvcGUnOiB7XHJcbiAgICAgICAgICAnQF94bWxuczp4c2knOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnLFxyXG4gICAgICAgICAgJ0BfeG1sbnM6eHNkJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJyxcclxuICAgICAgICAgICdAX3htbG5zOnNvYXAnOiAnaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nLFxyXG4gICAgICAgICAgJ3NvYXA6Qm9keSc6IHtcclxuICAgICAgICAgICAgUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0OiB7XHJcbiAgICAgICAgICAgICAgJ0BfeG1sbnMnOiAnaHR0cDovL2VkdXBvaW50LmNvbS93ZWJzZXJ2aWNlcy8nLFxyXG4gICAgICAgICAgICAgIHVzZXJJRDogJ0VkdXBvaW50RGlzdHJpY3RJbmZvJyxcclxuICAgICAgICAgICAgICBwYXNzd29yZDogJ0VkdXAwMW50JyxcclxuICAgICAgICAgICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcclxuICAgICAgICAgICAgICAuLi57IHBhcmFtU3RyOiBDbGllbnQucGFyc2VQYXJhbVN0cihkZWZhdWx0T3B0aW9ucy5wYXJhbVN0ciA/PyB7fSkgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBheGlvc1xyXG4gICAgICAgIC5wb3N0PHN0cmluZz4odXJsLCB4bWwsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ3RleHQveG1sJyB9IH0pXHJcbiAgICAgICAgLnRoZW4oKHsgZGF0YSB9KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgWE1MUGFyc2VyKHt9KTtcclxuICAgICAgICAgIGNvbnN0IHJlc3VsdDogUGFyc2VkUmVxdWVzdFJlc3VsdCA9IHBhcnNlci5wYXJzZShkYXRhKTtcclxuICAgICAgICAgIGNvbnN0IHBhcnNlclR3byA9IG5ldyBYTUxQYXJzZXIoeyBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSB9KTtcclxuXHJcbiAgICAgICAgICBjb25zdCBvYmo6IFQgfCBQYXJzZWRBbm9ueW1vdXNSZXF1ZXN0RXJyb3IgPSBwYXJzZXJUd28ucGFyc2UoXHJcbiAgICAgICAgICAgIHByZXBhcnNlKFxyXG4gICAgICAgICAgICAgIHJlc3VsdFsnc29hcDpFbnZlbG9wZSddWydzb2FwOkJvZHknXS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXNwb25zZS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHRcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBpZiAoZGVmYXVsdE9wdGlvbnMudmFsaWRhdGVFcnJvcnMgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgJ1JUX0VSUk9SJyBpbiBvYmopXHJcbiAgICAgICAgICAgIHJldHVybiByZWplY3QobmV3IFJlcXVlc3RFeGNlcHRpb24ob2JqKSk7XHJcblxyXG4gICAgICAgICAgcmVzKG9iaiBhcyBUKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWplY3QpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQVdlLE1BQU1BLE1BQU0sQ0FBQztJQU0xQixJQUFZQyxRQUFRLEdBQVc7TUFDN0IsT0FBTyxJQUFJLENBQUNDLFlBQVk7SUFDMUI7SUFFQSxJQUFZQyxRQUFRLEdBQVc7TUFDN0IsT0FBTyxJQUFJLENBQUNDLFlBQVk7SUFDMUI7SUFFQSxJQUFZQyxRQUFRLEdBQVc7TUFDN0IsT0FBTyxJQUFJLENBQUNDLFlBQVk7SUFDMUI7SUFFQSxJQUFjQyxXQUFXLEdBQXFCO01BQzVDLE9BQU87UUFD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