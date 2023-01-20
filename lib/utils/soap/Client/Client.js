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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDbGllbnQiLCJkaXN0cmljdCIsIl9fZGlzdHJpY3RfXyIsInVzZXJuYW1lIiwiX191c2VybmFtZV9fIiwicGFzc3dvcmQiLCJfX3Bhc3N3b3JkX18iLCJjcmVkZW50aWFscyIsImRpc3RyaWN0VXJsIiwiY29uc3RydWN0b3IiLCJpc1BhcmVudCIsInByb2Nlc3NSZXF1ZXN0Iiwib3B0aW9ucyIsInByZXBhcnNlIiwieG1sIiwiZGVmYXVsdE9wdGlvbnMiLCJ2YWxpZGF0ZUVycm9ycyIsInNraXBMb2dpbkxvZyIsInBhcmVudCIsIndlYlNlcnZpY2VIYW5kbGVOYW1lIiwicGFyYW1TdHIiLCJQcm9taXNlIiwicmVzIiwicmVqZWN0IiwiYnVpbGRlciIsIlhNTEJ1aWxkZXIiLCJpZ25vcmVBdHRyaWJ1dGVzIiwiYXJyYXlOb2RlTmFtZSIsInN1cHByZXNzRW1wdHlOb2RlIiwiYnVpbGQiLCJQcm9jZXNzV2ViU2VydmljZVJlcXVlc3QiLCJ1c2VySUQiLCJwYXJzZVBhcmFtU3RyIiwiYXhpb3MiLCJwb3N0IiwiaGVhZGVycyIsInRoZW4iLCJkYXRhIiwicGFyc2VyIiwiWE1MUGFyc2VyIiwicmVzdWx0IiwicGFyc2UiLCJwYXJzZXJUd28iLCJpc0FycmF5IiwicHJvY2Vzc0VudGl0aWVzIiwicGFyc2VBdHRyaWJ1dGVWYWx1ZSIsInBhcnNlVGFnVmFsdWUiLCJvYmoiLCJQcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXNwb25zZSIsIlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3VsdCIsIlJlcXVlc3RFeGNlcHRpb24iLCJjYXRjaCIsImlucHV0Iiwic3VwcHJlc3NCb29sZWFuQXR0cmlidXRlcyIsInByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0IiwidXJsIiwiZCIsInJlcGxhY2UiLCJtZXRob2ROYW1lIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHsgWE1MQnVpbGRlciwgWE1MUGFyc2VyIH0gZnJvbSAnZmFzdC14bWwtcGFyc2VyJztcbmltcG9ydCB7XG4gIFBhcnNlZFJlcXVlc3RFcnJvcixcbiAgUmVxdWVzdE9wdGlvbnMsXG4gIFBhcnNlZFJlcXVlc3RSZXN1bHQsXG4gIFBhcnNlZEFub255bW91c1JlcXVlc3RFcnJvcixcbiAgTG9naW5DcmVkZW50aWFscyxcbn0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xuaW1wb3J0IFJlcXVlc3RFeGNlcHRpb24gZnJvbSAnLi4vLi4vLi4vU3R1ZGVudFZ1ZS9SZXF1ZXN0RXhjZXB0aW9uL1JlcXVlc3RFeGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQge1xuICBwcml2YXRlIF9fdXNlcm5hbWVfXzogc3RyaW5nO1xuICBwcml2YXRlIF9fcGFzc3dvcmRfXzogc3RyaW5nO1xuICBwcml2YXRlIF9fZGlzdHJpY3RfXzogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IGlzUGFyZW50OiBudW1iZXI7XG5cbiAgcHJpdmF0ZSBnZXQgZGlzdHJpY3QoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fX2Rpc3RyaWN0X187XG4gIH1cblxuICBwcml2YXRlIGdldCB1c2VybmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9fdXNlcm5hbWVfXztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IHBhc3N3b3JkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX19wYXNzd29yZF9fO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBjcmVkZW50aWFscygpOiBMb2dpbkNyZWRlbnRpYWxzIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXNlcm5hbWU6IHRoaXMudXNlcm5hbWUsXG4gICAgICBwYXNzd29yZDogdGhpcy5wYXNzd29yZCxcbiAgICAgIGRpc3RyaWN0VXJsOiB0aGlzLmRpc3RyaWN0LFxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFscykge1xuICAgIHRoaXMuX191c2VybmFtZV9fID0gY3JlZGVudGlhbHMudXNlcm5hbWU7XG4gICAgdGhpcy5fX3Bhc3N3b3JkX18gPSBjcmVkZW50aWFscy5wYXNzd29yZDtcbiAgICB0aGlzLl9fZGlzdHJpY3RfXyA9IGNyZWRlbnRpYWxzLmRpc3RyaWN0VXJsO1xuICAgIHRoaXMuaXNQYXJlbnQgPSBjcmVkZW50aWFscy5pc1BhcmVudCA/IDEgOiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFBPU1QgcmVxdWVzdCB0byBzeW5lcmd5IHNlcnZlcnMgdG8gZmV0Y2ggZGF0YVxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHByb3ZpZGUgd2hlbiBtYWtpbmcgYSBYTUwgcmVxdWVzdCB0byB0aGUgc2VydmVyc1xuICAgKiBAcGFyYW0gcHJlcGFyc2UgUnVucyBiZWZvcmUgcGFyc2luZyB0aGUgeG1sIHN0cmluZyBpbnRvIGFuIG9iamVjdC4gVXNlZnVsIGZvciBtdXRhdGluZyB4bWwgdGhhdCBjb3VsZCBiZSBwYXJzZWQgaW5jb3JyZWN0bHkgYnkgYGZhc3QteG1sLXBhcnNlcmBcbiAgICogQHJldHVybnMgUmV0dXJucyBhbiBYTUwgb2JqZWN0IHRoYXQgbXVzdCBiZSBkZWZpbmVkIGluIGEgdHlwZSBkZWNsYXJhdGlvbiBmaWxlLlxuICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TdHVkZW50VnVlL2RvY3NcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHsgbWV0aG9kTmFtZTogJ1JlZmVyIHRvIFN0dWRlbnRWdWUvZG9jcycsIHBhcmFtU3RyOiB7IEFueXRoaW5nVGhhdENhbkJlUGFzc2VkOiB0cnVlLCBBc0xvbmdBc0l0TWF0Y2hlc1RoZURvY3VtZW50YXRpb246IHRydWUgfX0pO1xuICAgKiAvLyBUaGlzIHdpbGwgbWFrZSB0aGUgWE1MIHJlcXVlc3QgYmVsb3c6XG4gICAqIGBgYFxuICAgKiBcbiAgICogYGBgeG1sXG4gICAqIDxzb2FwOkVudmVsb3BlIHhtbG5zOnhzaT1cImh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlXCIgeG1sbnM6eHNkPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWFcIiB4bWxuczpzb2FwPVwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS9cIj5cbiAgICAgIDxzb2FwOkJvZHk+XG4gICAgICAgIDxQcm9jZXNzV2ViU2VydmljZVJlcXVlc3QgeG1sbnM9XCJodHRwOi8vZWR1cG9pbnQuY29tL3dlYnNlcnZpY2VzL1wiPlxuICAgICAgICAgICAgPHVzZXJJRD5TVFVERU5UX1VTRVJOQU1FPC91c2VySUQ+XG4gICAgICAgICAgICA8cGFzc3dvcmQ+U1RVREVOVF9QQVNTV09SRDwvcGFzc3dvcmQ+XG4gICAgICAgICAgICA8c2tpcExvZ2luTG9nPjE8L3NraXBMb2dpbkxvZz5cbiAgICAgICAgICAgIDxwYXJlbnQ+MDwvcGFyZW50PlxuICAgICAgICAgICAgPHdlYlNlcnZpY2VIYW5kbGVOYW1lPlBYUFdlYlNlcnZpY2VzPC93ZWJTZXJ2aWNlSGFuZGxlTmFtZT5cbiAgICAgICAgICAgIDxtZXRob2ROYW1lPlJlZmVyIHRvIFN0dWRlbnRWdWUvZG9jczwvbWV0aG9kTmFtZT5cbiAgICAgICAgICAgIDxwYXJhbVN0cj5cbiAgICAgICAgICAgICAgPEFueXRoaW5nVGhhdENhbkJlUGFzc2VkPnRydWU8L0FueXRoaW5nVGhhdENhbkJlUGFzc2VkPlxuICAgICAgICAgICAgICA8QXNMb25nQXNJdE1hdGNoZXNUaGVEb2N1bWVudGF0aW9uPnRydWU8L0FzTG9uZ0FzSXRNYXRjaGVzVGhlRG9jdW1lbnRhdGlvbj5cbiAgICAgICAgICAgIDwvcGFyYW1TdHI+XG4gICAgICAgIDwvUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0PlxuICAgICAgPC9zb2FwOkJvZHk+XG48L3NvYXA6RW52ZWxvcGU+XG4gICAqIGBgYFxuICAgKi9cbiAgcHJvdGVjdGVkIHByb2Nlc3NSZXF1ZXN0PFQgZXh0ZW5kcyBvYmplY3QgfCB1bmRlZmluZWQ+KFxuICAgIG9wdGlvbnM6IFJlcXVlc3RPcHRpb25zLFxuICAgIHByZXBhcnNlOiAoeG1sOiBzdHJpbmcpID0+IHN0cmluZyA9ICh4bWwpID0+IHhtbFxuICApOiBQcm9taXNlPFQ+IHtcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogUmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICB2YWxpZGF0ZUVycm9yczogdHJ1ZSxcbiAgICAgIHNraXBMb2dpbkxvZzogMCxcbiAgICAgIHBhcmVudDogdGhpcy5pc1BhcmVudCxcbiAgICAgIHdlYlNlcnZpY2VIYW5kbGVOYW1lOiAnUFhQV2ViU2VydmljZXMnLFxuICAgICAgcGFyYW1TdHI6IHt9LFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgWE1MQnVpbGRlcih7XG4gICAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxuICAgICAgICBhcnJheU5vZGVOYW1lOiAnc29hcDpFbnZlbG9wZScsXG4gICAgICAgIHN1cHByZXNzRW1wdHlOb2RlOiB0cnVlLFxuICAgICAgfSk7XG4gICAgICBjb25zdCB4bWwgPSBidWlsZGVyLmJ1aWxkKHtcbiAgICAgICAgJ3NvYXA6RW52ZWxvcGUnOiB7XG4gICAgICAgICAgJ0BfeG1sbnM6eHNpJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlJyxcbiAgICAgICAgICAnQF94bWxuczp4c2QnOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEnLFxuICAgICAgICAgICdAX3htbG5zOnNvYXAnOiAnaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nLFxuICAgICAgICAgICdzb2FwOkJvZHknOiB7XG4gICAgICAgICAgICBQcm9jZXNzV2ViU2VydmljZVJlcXVlc3Q6IHtcbiAgICAgICAgICAgICAgJ0BfeG1sbnMnOiAnaHR0cDovL2VkdXBvaW50LmNvbS93ZWJzZXJ2aWNlcy8nLFxuICAgICAgICAgICAgICB1c2VySUQ6IHRoaXMudXNlcm5hbWUsXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiB0aGlzLnBhc3N3b3JkLFxuICAgICAgICAgICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAgICAgICAgICAgLi4ueyBwYXJhbVN0cjogQ2xpZW50LnBhcnNlUGFyYW1TdHIoZGVmYXVsdE9wdGlvbnMucGFyYW1TdHIgPz8ge30pIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgYXhpb3NcbiAgICAgICAgLnBvc3Q8c3RyaW5nPih0aGlzLmRpc3RyaWN0LCB4bWwsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ3RleHQveG1sJyB9IH0pXG4gICAgICAgIC50aGVuKCh7IGRhdGEgfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBYTUxQYXJzZXIoe30pO1xuICAgICAgICAgIGNvbnN0IHJlc3VsdDogUGFyc2VkUmVxdWVzdFJlc3VsdCA9IHBhcnNlci5wYXJzZShkYXRhKTtcbiAgICAgICAgICBjb25zdCBwYXJzZXJUd28gPSBuZXcgWE1MUGFyc2VyKHtcbiAgICAgICAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxuICAgICAgICAgICAgaXNBcnJheTogKCkgPT4gdHJ1ZSxcbiAgICAgICAgICAgIHByb2Nlc3NFbnRpdGllczogZmFsc2UsXG4gICAgICAgICAgICBwYXJzZUF0dHJpYnV0ZVZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgIHBhcnNlVGFnVmFsdWU6IGZhbHNlLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29uc3Qgb2JqOiBUIHwgUGFyc2VkUmVxdWVzdEVycm9yID0gcGFyc2VyVHdvLnBhcnNlKFxuICAgICAgICAgICAgcHJlcGFyc2UoXG4gICAgICAgICAgICAgIHJlc3VsdFsnc29hcDpFbnZlbG9wZSddWydzb2FwOkJvZHknXS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXNwb25zZS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHRcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKGRlZmF1bHRPcHRpb25zLnZhbGlkYXRlRXJyb3JzICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmICdSVF9FUlJPUicgaW4gb2JqKVxuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgUmVxdWVzdEV4Y2VwdGlvbihvYmopKTtcblxuICAgICAgICAgIHJlcyhvYmogYXMgVCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcGFyc2VQYXJhbVN0cihpbnB1dDogb2JqZWN0KTogc3RyaW5nIHtcbiAgICBjb25zdCBidWlsZGVyID0gbmV3IFhNTEJ1aWxkZXIoe1xuICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXG4gICAgICBhcnJheU5vZGVOYW1lOiAnUGFyYW1zJyxcbiAgICAgIHN1cHByZXNzRW1wdHlOb2RlOiB0cnVlLFxuICAgICAgc3VwcHJlc3NCb29sZWFuQXR0cmlidXRlczogZmFsc2UsXG4gICAgfSk7XG4gICAgY29uc3QgeG1sID0gYDxQYXJtcz4ke2J1aWxkZXIuYnVpbGQoaW5wdXQpfTwvUGFybXM+YDtcbiAgICByZXR1cm4geG1sO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBwcm9jZXNzQW5vbnltb3VzUmVxdWVzdDxUIGV4dGVuZHMgb2JqZWN0IHwgdW5kZWZpbmVkPihcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiBQYXJ0aWFsPFJlcXVlc3RPcHRpb25zPiA9IHt9LFxuICAgIHByZXBhcnNlOiAoeG1sOiBzdHJpbmcpID0+IHN0cmluZyA9IChkKSA9PiBkLnJlcGxhY2UoLyZndDsvZywgJz4nKS5yZXBsYWNlKC8mbHQ7L2csICc8JylcbiAgKTogUHJvbWlzZTxUPiB7XG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IFJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgc2tpcExvZ2luTG9nOiAwLFxuICAgICAgdmFsaWRhdGVFcnJvcnM6IHRydWUsXG4gICAgICBwYXJlbnQ6IDAsXG4gICAgICB3ZWJTZXJ2aWNlSGFuZGxlTmFtZTogJ0hESW5mb1NlcnZpY2VzJyxcbiAgICAgIG1ldGhvZE5hbWU6ICdHZXRNYXRjaGluZ0Rpc3RyaWN0TGlzdCcsXG4gICAgICBwYXJhbVN0cjoge30sXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KChyZXMsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgYnVpbGRlciA9IG5ldyBYTUxCdWlsZGVyKHtcbiAgICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXG4gICAgICAgIGFycmF5Tm9kZU5hbWU6ICdzb2FwOkVudmVsb3BlJyxcbiAgICAgICAgc3VwcHJlc3NFbXB0eU5vZGU6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHhtbCA9IGJ1aWxkZXIuYnVpbGQoe1xuICAgICAgICAnc29hcDpFbnZlbG9wZSc6IHtcbiAgICAgICAgICAnQF94bWxuczp4c2knOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnLFxuICAgICAgICAgICdAX3htbG5zOnhzZCc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScsXG4gICAgICAgICAgJ0BfeG1sbnM6c29hcCc6ICdodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlLycsXG4gICAgICAgICAgJ3NvYXA6Qm9keSc6IHtcbiAgICAgICAgICAgIFByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdDoge1xuICAgICAgICAgICAgICAnQF94bWxucyc6ICdodHRwOi8vZWR1cG9pbnQuY29tL3dlYnNlcnZpY2VzLycsXG4gICAgICAgICAgICAgIHVzZXJJRDogJ0VkdXBvaW50RGlzdHJpY3RJbmZvJyxcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6ICdFZHVwMDFudCcsXG4gICAgICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgICAgICAgICAgICAuLi57IHBhcmFtU3RyOiBDbGllbnQucGFyc2VQYXJhbVN0cihkZWZhdWx0T3B0aW9ucy5wYXJhbVN0ciA/PyB7fSkgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBheGlvc1xuICAgICAgICAucG9zdDxzdHJpbmc+KHVybCwgeG1sLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbCcgfSB9KVxuICAgICAgICAudGhlbigoeyBkYXRhIH0pID0+IHtcbiAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgWE1MUGFyc2VyKHt9KTtcbiAgICAgICAgICBjb25zdCByZXN1bHQ6IFBhcnNlZFJlcXVlc3RSZXN1bHQgPSBwYXJzZXIucGFyc2UoZGF0YSk7XG4gICAgICAgICAgY29uc3QgcGFyc2VyVHdvID0gbmV3IFhNTFBhcnNlcih7IGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlIH0pO1xuXG4gICAgICAgICAgY29uc3Qgb2JqOiBUIHwgUGFyc2VkQW5vbnltb3VzUmVxdWVzdEVycm9yID0gcGFyc2VyVHdvLnBhcnNlKFxuICAgICAgICAgICAgcHJlcGFyc2UoXG4gICAgICAgICAgICAgIHJlc3VsdFsnc29hcDpFbnZlbG9wZSddWydzb2FwOkJvZHknXS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXNwb25zZS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHRcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKGRlZmF1bHRPcHRpb25zLnZhbGlkYXRlRXJyb3JzICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmICdSVF9FUlJPUicgaW4gb2JqKVxuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgUmVxdWVzdEV4Y2VwdGlvbihvYmopKTtcblxuICAgICAgICAgIHJlcyhvYmogYXMgVCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgIH0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFXZSxNQUFNQSxNQUFNLENBQUM7SUFNMUIsSUFBWUMsUUFBUSxHQUFXO01BQzdCLE9BQU8sSUFBSSxDQUFDQyxZQUFZO0lBQzFCO0lBRUEsSUFBWUMsUUFBUSxHQUFXO01BQzdCLE9BQU8sSUFBSSxDQUFDQyxZQUFZO0lBQzFCO0lBRUEsSUFBWUMsUUFBUSxHQUFXO01BQzdCLE9BQU8sSUFBSSxDQUFDQyxZQUFZO0lBQzFCO0lBRUEsSUFBY0MsV0FBVyxHQUFxQjtNQUM1QyxPQUFPO1FBQ0xKLFFBQVEsRUFBRSxJQUFJLENBQUNBLFFBQVE7UUFDdkJFLFFBQVEsRUFBRSxJQUFJLENBQUNBLFFBQVE7UUFDdkJHLFdBQVcsRUFBRSxJQUFJLENBQUNQO01BQ3BCLENBQUM7SUFDSDtJQUVBUSxXQUFXLENBQUNGLFdBQTZCLEVBQUU7TUFDekMsSUFBSSxDQUFDSCxZQUFZLEdBQUdHLFdBQVcsQ0FBQ0osUUFBUTtNQUN4QyxJQUFJLENBQUNHLFlBQVksR0FBR0MsV0FBVyxDQUFDRixRQUFRO01BQ3hDLElBQUksQ0FBQ0gsWUFBWSxHQUFHSyxXQUFXLENBQUNDLFdBQVc7TUFDM0MsSUFBSSxDQUFDRSxRQUFRLEdBQUdILFdBQVcsQ0FBQ0csUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQzlDOztJQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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