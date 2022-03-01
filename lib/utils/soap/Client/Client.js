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
            parseAttributeValue: false
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9zb2FwL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50IiwiZGlzdHJpY3QiLCJfX2Rpc3RyaWN0X18iLCJ1c2VybmFtZSIsIl9fdXNlcm5hbWVfXyIsInBhc3N3b3JkIiwiX19wYXNzd29yZF9fIiwiY3JlZGVudGlhbHMiLCJkaXN0cmljdFVybCIsImNvbnN0cnVjdG9yIiwicHJvY2Vzc1JlcXVlc3QiLCJvcHRpb25zIiwiZGVmYXVsdE9wdGlvbnMiLCJza2lwTG9naW5Mb2ciLCJwYXJlbnQiLCJ3ZWJTZXJ2aWNlSGFuZGxlTmFtZSIsInBhcmFtU3RyIiwiUHJvbWlzZSIsInJlcyIsInJlamVjdCIsImJ1aWxkZXIiLCJYTUxCdWlsZGVyIiwiaWdub3JlQXR0cmlidXRlcyIsImFycmF5Tm9kZU5hbWUiLCJzdXBwcmVzc0VtcHR5Tm9kZSIsInhtbCIsImJ1aWxkIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0IiwidXNlcklEIiwicGFyc2VQYXJhbVN0ciIsImF4aW9zIiwicG9zdCIsImhlYWRlcnMiLCJ0aGVuIiwiZGF0YSIsInBhcnNlciIsIlhNTFBhcnNlciIsInJlc3VsdCIsInBhcnNlIiwicGFyc2VyVHdvIiwiaXNBcnJheSIsInByb2Nlc3NFbnRpdGllcyIsInBhcnNlQXR0cmlidXRlVmFsdWUiLCJvYmoiLCJQcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXNwb25zZSIsIlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3VsdCIsIlJlcXVlc3RFeGNlcHRpb24iLCJjYXRjaCIsImlucHV0Iiwic3VwcHJlc3NCb29sZWFuQXR0cmlidXRlcyIsInByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0IiwidXJsIiwibWV0aG9kTmFtZSIsInJlcGxhY2UiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXZSxRQUFNQSxNQUFOLENBQWE7QUFLTixRQUFSQyxRQUFRLEdBQVc7QUFDN0Is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Q0QsTUFBTSxDQUFDLGVBQUQsQ0FBTixDQUF3QixXQUF4QixFQUFxQ08sZ0NBQXJDLENBQXNFQyw4QkFBdEUsQ0FBcUdRLE9BQXJHLENBQ0UsT0FERixFQUVFLEdBRkYsRUFHRUEsT0FIRixDQUdVLE9BSFYsRUFHbUIsR0FIbkIsQ0FEMkMsQ0FBN0M7O0FBT0EsY0FBSSxjQUFjVixHQUFsQjtBQUF1QixtQkFBT3hCLE1BQU0sQ0FBQyxJQUFJMkIseUJBQUosQ0FBcUJILEdBQXJCLENBQUQsQ0FBYjtBQUF2Qjs7QUFFQXpCLFVBQUFBLEdBQUcsQ0FBQ3lCLEdBQUQsQ0FBSDtBQUNELFNBakJELENBaUJFLE9BQU9XLENBQVAsRUFBVTtBQUNWbkMsVUFBQUEsTUFBTSxDQUFDbUMsQ0FBRCxDQUFOO0FBQ0Q7QUFDRixPQTNDTSxDQUFQO0FBNENEOztBQXBMeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgeyBYTUxCdWlsZGVyLCBYTUxQYXJzZXIgfSBmcm9tICdmYXN0LXhtbC1wYXJzZXInO1xyXG5pbXBvcnQge1xyXG4gIFBhcnNlZFJlcXVlc3RFcnJvcixcclxuICBSZXF1ZXN0T3B0aW9ucyxcclxuICBQYXJzZWRSZXF1ZXN0UmVzdWx0LFxyXG4gIFBhcnNlZEFub255bW91c1JlcXVlc3RFcnJvcixcclxuICBMb2dpbkNyZWRlbnRpYWxzLFxyXG59IGZyb20gJy4uLy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IFJlcXVlc3RFeGNlcHRpb24gZnJvbSAnLi4vLi4vLi4vU3R1ZGVudFZ1ZS9SZXF1ZXN0RXhjZXB0aW9uL1JlcXVlc3RFeGNlcHRpb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IHtcclxuICBwcml2YXRlIF9fdXNlcm5hbWVfXzogc3RyaW5nO1xyXG4gIHByaXZhdGUgX19wYXNzd29yZF9fOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfX2Rpc3RyaWN0X186IHN0cmluZztcclxuXHJcbiAgcHJpdmF0ZSBnZXQgZGlzdHJpY3QoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9fZGlzdHJpY3RfXztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0IHVzZXJuYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fX3VzZXJuYW1lX187XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldCBwYXNzd29yZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX19wYXNzd29yZF9fO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGdldCBjcmVkZW50aWFscygpOiBMb2dpbkNyZWRlbnRpYWxzIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZDogdGhpcy5wYXNzd29yZCxcclxuICAgICAgZGlzdHJpY3RVcmw6IHRoaXMuZGlzdHJpY3QsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMpIHtcclxuICAgIHRoaXMuX191c2VybmFtZV9fID0gY3JlZGVudGlhbHMudXNlcm5hbWU7XHJcbiAgICB0aGlzLl9fcGFzc3dvcmRfXyA9IGNyZWRlbnRpYWxzLnBhc3N3b3JkO1xyXG4gICAgdGhpcy5fX2Rpc3RyaWN0X18gPSBjcmVkZW50aWFscy5kaXN0cmljdFVybDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIFBPU1QgcmVxdWVzdCB0byBzeW5lcmd5IHNlcnZlcnMgdG8gZmV0Y2ggZGF0YVxyXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcHJvdmlkZSB3aGVuIG1ha2luZyBhIFhNTCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJzXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhbiBYTUwgb2JqZWN0IHRoYXQgbXVzdCBiZSBkZWZpbmVkIGluIGEgdHlwZSBkZWNsYXJhdGlvbiBmaWxlLlxyXG4gICAqIEBsaW5rIFNlZSBodHRwczovL2dpdGh1Yi5jb20vU3R1ZGVudFZ1ZS9kb2NzXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBgYGBqc1xyXG4gICAqIHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHsgbWV0aG9kTmFtZTogJ1JlZmVyIHRvIFN0dWRlbnRWdWUvZG9jcycsIHBhcmFtU3RyOiB7IEFueXRoaW5nVGhhdENhbkJlUGFzc2VkOiB0cnVlLCBBc0xvbmdBc0l0TWF0Y2hlc1RoZURvY3VtZW50YXRpb246IHRydWUgfX0pO1xyXG4gICAqIC8vIFRoaXMgd2lsbCBtYWtlIHRoZSBYTUwgcmVxdWVzdCBiZWxvdzpcclxuICAgKiBgYGBcclxuICAgKiBcclxuICAgKiBgYGB4bWxcclxuICAgKiA8c29hcDpFbnZlbG9wZSB4bWxuczp4c2k9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZVwiIHhtbG5zOnhzZD1cImh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hXCIgeG1sbnM6c29hcD1cImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvXCI+XHJcbiAgICA8c29hcDpCb2R5PlxyXG4gICAgICAgIDxQcm9jZXNzV2ViU2VydmljZVJlcXVlc3QgeG1sbnM9XCJodHRwOi8vZWR1cG9pbnQuY29tL3dlYnNlcnZpY2VzL1wiPlxyXG4gICAgICAgICAgICA8dXNlcklEPlNUVURFTlRfVVNFUk5BTUU8L3VzZXJJRD5cclxuICAgICAgICAgICAgPHBhc3N3b3JkPlNUVURFTlRfUEFTU1dPUkQ8L3Bhc3N3b3JkPlxyXG4gICAgICAgICAgICA8c2tpcExvZ2luTG9nPjE8L3NraXBMb2dpbkxvZz5cclxuICAgICAgICAgICAgPHBhcmVudD4wPC9wYXJlbnQ+XHJcbiAgICAgICAgICAgIDx3ZWJTZXJ2aWNlSGFuZGxlTmFtZT5QWFBXZWJTZXJ2aWNlczwvd2ViU2VydmljZUhhbmRsZU5hbWU+XHJcbiAgICAgICAgICAgIDxtZXRob2ROYW1lPlJlZmVyIHRvIFN0dWRlbnRWdWUvZG9jczwvbWV0aG9kTmFtZT5cclxuICAgICAgICAgICAgPHBhcmFtU3RyPlxyXG4gICAgICAgICAgICAgIDxBbnl0aGluZ1RoYXRDYW5CZVBhc3NlZD50cnVlPC9Bbnl0aGluZ1RoYXRDYW5CZVBhc3NlZD5cclxuICAgICAgICAgICAgICA8QXNMb25nQXNJdE1hdGNoZXNUaGVEb2N1bWVudGF0aW9uPnRydWU8L0FzTG9uZ0FzSXRNYXRjaGVzVGhlRG9jdW1lbnRhdGlvbj5cclxuICAgICAgICAgICAgPC9wYXJhbVN0cj5cclxuICAgICAgICA8L1Byb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdD5cclxuICAgIDwvc29hcDpCb2R5PlxyXG48L3NvYXA6RW52ZWxvcGU+XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHJvdGVjdGVkIHByb2Nlc3NSZXF1ZXN0PFQ+KG9wdGlvbnM6IFJlcXVlc3RPcHRpb25zKTogUHJvbWlzZTxUPiB7XHJcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogUmVxdWVzdE9wdGlvbnMgPSB7XHJcbiAgICAgIHNraXBMb2dpbkxvZzogMSxcclxuICAgICAgcGFyZW50OiAwLFxyXG4gICAgICB3ZWJTZXJ2aWNlSGFuZGxlTmFtZTogJ1BYUFdlYlNlcnZpY2VzJyxcclxuICAgICAgcGFyYW1TdHI6IHt9LFxyXG4gICAgICAuLi5vcHRpb25zLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgYnVpbGRlciA9IG5ldyBYTUxCdWlsZGVyKHtcclxuICAgICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgICAgICBhcnJheU5vZGVOYW1lOiAnc29hcDpFbnZlbG9wZScsXHJcbiAgICAgICAgc3VwcHJlc3NFbXB0eU5vZGU6IHRydWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zdCB4bWwgPSBidWlsZGVyLmJ1aWxkKHtcclxuICAgICAgICAnc29hcDpFbnZlbG9wZSc6IHtcclxuICAgICAgICAgICdAX3htbG5zOnhzaSc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZScsXHJcbiAgICAgICAgICAnQF94bWxuczp4c2QnOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEnLFxyXG4gICAgICAgICAgJ0BfeG1sbnM6c29hcCc6ICdodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlLycsXHJcbiAgICAgICAgICAnc29hcDpCb2R5Jzoge1xyXG4gICAgICAgICAgICBQcm9jZXNzV2ViU2VydmljZVJlcXVlc3Q6IHtcclxuICAgICAgICAgICAgICAnQF94bWxucyc6ICdodHRwOi8vZWR1cG9pbnQuY29tL3dlYnNlcnZpY2VzLycsXHJcbiAgICAgICAgICAgICAgdXNlcklEOiB0aGlzLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiB0aGlzLnBhc3N3b3JkLFxyXG4gICAgICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxyXG4gICAgICAgICAgICAgIC4uLnsgcGFyYW1TdHI6IENsaWVudC5wYXJzZVBhcmFtU3RyKGRlZmF1bHRPcHRpb25zLnBhcmFtU3RyID8/IHt9KSB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGF4aW9zXHJcbiAgICAgICAgLnBvc3Q8c3RyaW5nPih0aGlzLmRpc3RyaWN0LCB4bWwsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ3RleHQveG1sJyB9IH0pXHJcbiAgICAgICAgLnRoZW4oKHsgZGF0YSB9KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgWE1MUGFyc2VyKHt9KTtcclxuICAgICAgICAgIGNvbnN0IHJlc3VsdDogUGFyc2VkUmVxdWVzdFJlc3VsdCA9IHBhcnNlci5wYXJzZShkYXRhKTtcclxuICAgICAgICAgIGNvbnN0IHBhcnNlclR3byA9IG5ldyBYTUxQYXJzZXIoe1xyXG4gICAgICAgICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgICAgICAgICAgaXNBcnJheTogKCkgPT4gdHJ1ZSxcclxuICAgICAgICAgICAgcHJvY2Vzc0VudGl0aWVzOiBmYWxzZSxcclxuICAgICAgICAgICAgcGFyc2VBdHRyaWJ1dGVWYWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBjb25zdCBvYmo6IFQgfCBQYXJzZWRSZXF1ZXN0RXJyb3IgPSBwYXJzZXJUd28ucGFyc2UoXHJcbiAgICAgICAgICAgIHJlc3VsdFsnc29hcDpFbnZlbG9wZSddWydzb2FwOkJvZHknXS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXNwb25zZS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHRcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgaWYgKCdSVF9FUlJPUicgaW4gb2JqKSByZXR1cm4gcmVqZWN0KG5ldyBSZXF1ZXN0RXhjZXB0aW9uKG9iaikpO1xyXG5cclxuICAgICAgICAgIHJlcyhvYmopO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlamVjdCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIHBhcnNlUGFyYW1TdHIoaW5wdXQ6IG9iamVjdCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBidWlsZGVyID0gbmV3IFhNTEJ1aWxkZXIoe1xyXG4gICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgICAgYXJyYXlOb2RlTmFtZTogJ1BhcmFtcycsXHJcbiAgICAgIHN1cHByZXNzRW1wdHlOb2RlOiB0cnVlLFxyXG4gICAgICBzdXBwcmVzc0Jvb2xlYW5BdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgIH0pO1xyXG4gICAgY29uc3QgeG1sID0gYDxQYXJtcz4ke2J1aWxkZXIuYnVpbGQoaW5wdXQpfTwvUGFybXM+YDtcclxuICAgIHJldHVybiB4bWw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0PFQ+KHVybDogc3RyaW5nLCBvcHRpb25zOiBQYXJ0aWFsPFJlcXVlc3RPcHRpb25zPiA9IHt9KTogUHJvbWlzZTxUPiB7XHJcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogUmVxdWVzdE9wdGlvbnMgPSB7XHJcbiAgICAgIHNraXBMb2dpbkxvZzogMSxcclxuICAgICAgcGFyZW50OiAwLFxyXG4gICAgICB3ZWJTZXJ2aWNlSGFuZGxlTmFtZTogJ0hESW5mb1NlcnZpY2VzJyxcclxuICAgICAgbWV0aG9kTmFtZTogJ0dldE1hdGNoaW5nRGlzdHJpY3RMaXN0JyxcclxuICAgICAgcGFyYW1TdHI6IHt9LFxyXG4gICAgICAuLi5vcHRpb25zLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxUPihhc3luYyAocmVzLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgYnVpbGRlciA9IG5ldyBYTUxCdWlsZGVyKHtcclxuICAgICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgICAgICBhcnJheU5vZGVOYW1lOiAnc29hcDpFbnZlbG9wZScsXHJcbiAgICAgICAgc3VwcHJlc3NFbXB0eU5vZGU6IHRydWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zdCB4bWwgPSBidWlsZGVyLmJ1aWxkKHtcclxuICAgICAgICAnc29hcDpFbnZlbG9wZSc6IHtcclxuICAgICAgICAgICdAX3htbG5zOnhzaSc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZScsXHJcbiAgICAgICAgICAnQF94bWxuczp4c2QnOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEnLFxyXG4gICAgICAgICAgJ0BfeG1sbnM6c29hcCc6ICdodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlLycsXHJcbiAgICAgICAgICAnc29hcDpCb2R5Jzoge1xyXG4gICAgICAgICAgICBQcm9jZXNzV2ViU2VydmljZVJlcXVlc3Q6IHtcclxuICAgICAgICAgICAgICAnQF94bWxucyc6ICdodHRwOi8vZWR1cG9pbnQuY29tL3dlYnNlcnZpY2VzLycsXHJcbiAgICAgICAgICAgICAgdXNlcklEOiAnRWR1cG9pbnREaXN0cmljdEluZm8nLFxyXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiAnRWR1cDAxbnQnLFxyXG4gICAgICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxyXG4gICAgICAgICAgICAgIC4uLnsgcGFyYW1TdHI6IENsaWVudC5wYXJzZVBhcmFtU3RyKGRlZmF1bHRPcHRpb25zLnBhcmFtU3RyID8/IHt9KSB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBheGlvcy5wb3N0PHN0cmluZz4odXJsLCB4bWwsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ3RleHQveG1sJyB9IH0pO1xyXG5cclxuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgWE1MUGFyc2VyKHt9KTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFBhcnNlZFJlcXVlc3RSZXN1bHQgPSBwYXJzZXIucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgY29uc3QgcGFyc2VyVHdvID0gbmV3IFhNTFBhcnNlcih7IGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBvYmo6IFQgfCBQYXJzZWRBbm9ueW1vdXNSZXF1ZXN0RXJyb3IgPSBwYXJzZXJUd28ucGFyc2UoXHJcbiAgICAgICAgICByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzcG9uc2UuUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzdWx0LnJlcGxhY2UoXHJcbiAgICAgICAgICAgIC8mZ3Q7L2csXHJcbiAgICAgICAgICAgICc+J1xyXG4gICAgICAgICAgKS5yZXBsYWNlKC8mbHQ7L2csICc8JylcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoJ1JUX0VSUk9SJyBpbiBvYmopIHJldHVybiByZWplY3QobmV3IFJlcXVlc3RFeGNlcHRpb24ob2JqKSk7XHJcblxyXG4gICAgICAgIHJlcyhvYmopO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19