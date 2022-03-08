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

          if (defaultOptions.validateErrors && 'RT_ERROR' in obj) {
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

          if (defaultOptions.validateErrors && 'RT_ERROR' in obj) {
            return reject(new _RequestException.default(obj));
          }

          res(obj);
        }).catch(reject);
      });
    }

  }

  _exports.default = Client;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9zb2FwL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50IiwiZGlzdHJpY3QiLCJfX2Rpc3RyaWN0X18iLCJ1c2VybmFtZSIsIl9fdXNlcm5hbWVfXyIsInBhc3N3b3JkIiwiX19wYXNzd29yZF9fIiwiY3JlZGVudGlhbHMiLCJkaXN0cmljdFVybCIsImNvbnN0cnVjdG9yIiwiaXNQYXJlbnQiLCJwcm9jZXNzUmVxdWVzdCIsIm9wdGlvbnMiLCJwcmVwYXJzZSIsInhtbCIsImRlZmF1bHRPcHRpb25zIiwidmFsaWRhdGVFcnJvcnMiLCJza2lwTG9naW5Mb2ciLCJwYXJlbnQiLCJ3ZWJTZXJ2aWNlSGFuZGxlTmFtZSIsInBhcmFtU3RyIiwiUHJvbWlzZSIsInJlcyIsInJlamVjdCIsImJ1aWxkZXIiLCJYTUxCdWlsZGVyIiwiaWdub3JlQXR0cmlidXRlcyIsImFycmF5Tm9kZU5hbWUiLCJzdXBwcmVzc0VtcHR5Tm9kZSIsImJ1aWxkIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0IiwidXNlcklEIiwicGFyc2VQYXJhbVN0ciIsImF4aW9zIiwicG9zdCIsImhlYWRlcnMiLCJ0aGVuIiwiZGF0YSIsInBhcnNlciIsIlhNTFBhcnNlciIsInJlc3VsdCIsInBhcnNlIiwicGFyc2VyVHdvIiwiaXNBcnJheSIsInByb2Nlc3NFbnRpdGllcyIsInBhcnNlQXR0cmlidXRlVmFsdWUiLCJwYXJzZVRhZ1ZhbHVlIiwib2JqIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzcG9uc2UiLCJQcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHQiLCJSZXF1ZXN0RXhjZXB0aW9uIiwiY2F0Y2giLCJpbnB1dCIsInN1cHByZXNzQm9vbGVhbkF0dHJpYnV0ZXMiLCJwcm9jZXNzQW5vbnltb3VzUmVxdWVzdCIsInVybCIsImQiLCJyZXBsYWNlIiwibWV0aG9kTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUFmLElBQTJCLEVBQWhEO0FBQVo7QUFMcUI7QUFEZjtBQUpFO0FBRE8sU0FBZCxDQUFaOztBQWlCQWEsdUJBQ0dDLElBREgsQ0FDZ0JxQixHQURoQixFQUNxQnpDLEdBRHJCLEVBQzBCO0FBQUVxQixVQUFBQSxPQUFPLEVBQUU7QUFBRSw0QkFBZ0I7QUFBbEI7QUFBWCxTQUQxQixFQUVHQyxJQUZILENBRVEsQ0FBQztBQUFFQyxVQUFBQTtBQUFGLFNBQUQsS0FBYztBQUNsQixnQkFBTUMsTUFBTSxHQUFHLElBQUlDLHdCQUFKLENBQWMsRUFBZCxDQUFmO0FBQ0EsZ0JBQU1DLE1BQTJCLEdBQUdGLE1BQU0sQ0FBQ0csS0FBUCxDQUFhSixJQUFiLENBQXBDO0FBQ0EsZ0JBQU1LLFNBQVMsR0FBRyxJQUFJSCx3QkFBSixDQUFjO0FBQUViLFlBQUFBLGdCQUFnQixFQUFFO0FBQXBCLFdBQWQsQ0FBbEI7QUFFQSxnQkFBTXFCLEdBQW9DLEdBQUdMLFNBQVMsQ0FBQ0QsS0FBVixDQUMzQzVCLFFBQVEsQ0FDTjJCLE1BQU0sQ0FBQyxlQUFELENBQU4sQ0FBd0IsV0FBeEIsRUFBcUNRLGdDQUFyQyxDQUFzRUMsOEJBRGhFLENBRG1DLENBQTdDOztBQU1BLGNBQUlsQyxjQUFjLENBQUNDLGNBQWYsSUFBaUMsY0FBYytCLEdBQW5EO0FBQXdELG1CQUFPeEIsTUFBTSxDQUFDLElBQUkyQix5QkFBSixDQUFxQkgsR0FBckIsQ0FBRCxDQUFiO0FBQXhEOztBQUVBekIsVUFBQUEsR0FBRyxDQUFDeUIsR0FBRCxDQUFIO0FBQ0QsU0FoQkgsRUFpQkdJLEtBakJILENBaUJTNUIsTUFqQlQ7QUFrQkQsT0F6Q00sQ0FBUDtBQTBDRDs7QUE5THlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IHsgWE1MQnVpbGRlciwgWE1MUGFyc2VyIH0gZnJvbSAnZmFzdC14bWwtcGFyc2VyJztcclxuaW1wb3J0IHtcclxuICBQYXJzZWRSZXF1ZXN0RXJyb3IsXHJcbiAgUmVxdWVzdE9wdGlvbnMsXHJcbiAgUGFyc2VkUmVxdWVzdFJlc3VsdCxcclxuICBQYXJzZWRBbm9ueW1vdXNSZXF1ZXN0RXJyb3IsXHJcbiAgTG9naW5DcmVkZW50aWFscyxcclxufSBmcm9tICcuLi8uLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBSZXF1ZXN0RXhjZXB0aW9uIGZyb20gJy4uLy4uLy4uL1N0dWRlbnRWdWUvUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCB7XHJcbiAgcHJpdmF0ZSBfX3VzZXJuYW1lX186IHN0cmluZztcclxuICBwcml2YXRlIF9fcGFzc3dvcmRfXzogc3RyaW5nO1xyXG4gIHByaXZhdGUgX19kaXN0cmljdF9fOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBpc1BhcmVudDogbnVtYmVyO1xyXG5cclxuICBwcml2YXRlIGdldCBkaXN0cmljdCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX19kaXN0cmljdF9fO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXQgdXNlcm5hbWUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9fdXNlcm5hbWVfXztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0IHBhc3N3b3JkKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fX3Bhc3N3b3JkX187XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgZ2V0IGNyZWRlbnRpYWxzKCk6IExvZ2luQ3JlZGVudGlhbHMge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdXNlcm5hbWU6IHRoaXMudXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkOiB0aGlzLnBhc3N3b3JkLFxyXG4gICAgICBkaXN0cmljdFVybDogdGhpcy5kaXN0cmljdCxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFscykge1xyXG4gICAgdGhpcy5fX3VzZXJuYW1lX18gPSBjcmVkZW50aWFscy51c2VybmFtZTtcclxuICAgIHRoaXMuX19wYXNzd29yZF9fID0gY3JlZGVudGlhbHMucGFzc3dvcmQ7XHJcbiAgICB0aGlzLl9fZGlzdHJpY3RfXyA9IGNyZWRlbnRpYWxzLmRpc3RyaWN0VXJsO1xyXG4gICAgdGhpcy5pc1BhcmVudCA9IGNyZWRlbnRpYWxzLmlzUGFyZW50ID8gMSA6IDA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBQT1NUIHJlcXVlc3QgdG8gc3luZXJneSBzZXJ2ZXJzIHRvIGZldGNoIGRhdGFcclxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHByb3ZpZGUgd2hlbiBtYWtpbmcgYSBYTUwgcmVxdWVzdCB0byB0aGUgc2VydmVyc1xyXG4gICAqIEBwYXJhbSBwcmVwYXJzZSBSdW5zIGJlZm9yZSBwYXJzaW5nIHRoZSB4bWwgc3RyaW5nIGludG8gYW4gb2JqZWN0LiBVc2VmdWwgZm9yIG11dGF0aW5nIHhtbCB0aGF0IGNvdWxkIGJlIHBhcnNlZCBpbmNvcnJlY3RseSBieSBgZmFzdC14bWwtcGFyc2VyYFxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYW4gWE1MIG9iamVjdCB0aGF0IG11c3QgYmUgZGVmaW5lZCBpbiBhIHR5cGUgZGVjbGFyYXRpb24gZmlsZS5cclxuICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TdHVkZW50VnVlL2RvY3NcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHsgbWV0aG9kTmFtZTogJ1JlZmVyIHRvIFN0dWRlbnRWdWUvZG9jcycsIHBhcmFtU3RyOiB7IEFueXRoaW5nVGhhdENhbkJlUGFzc2VkOiB0cnVlLCBBc0xvbmdBc0l0TWF0Y2hlc1RoZURvY3VtZW50YXRpb246IHRydWUgfX0pO1xyXG4gICAqIC8vIFRoaXMgd2lsbCBtYWtlIHRoZSBYTUwgcmVxdWVzdCBiZWxvdzpcclxuICAgKiBgYGBcclxuICAgKiBcclxuICAgKiBgYGB4bWxcclxuICAgKiA8c29hcDpFbnZlbG9wZSB4bWxuczp4c2k9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZVwiIHhtbG5zOnhzZD1cImh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hXCIgeG1sbnM6c29hcD1cImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvXCI+XHJcbiAgICAgIDxzb2FwOkJvZHk+XHJcbiAgICAgICAgPFByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdCB4bWxucz1cImh0dHA6Ly9lZHVwb2ludC5jb20vd2Vic2VydmljZXMvXCI+XHJcbiAgICAgICAgICAgIDx1c2VySUQ+U1RVREVOVF9VU0VSTkFNRTwvdXNlcklEPlxyXG4gICAgICAgICAgICA8cGFzc3dvcmQ+U1RVREVOVF9QQVNTV09SRDwvcGFzc3dvcmQ+XHJcbiAgICAgICAgICAgIDxza2lwTG9naW5Mb2c+MTwvc2tpcExvZ2luTG9nPlxyXG4gICAgICAgICAgICA8cGFyZW50PjA8L3BhcmVudD5cclxuICAgICAgICAgICAgPHdlYlNlcnZpY2VIYW5kbGVOYW1lPlBYUFdlYlNlcnZpY2VzPC93ZWJTZXJ2aWNlSGFuZGxlTmFtZT5cclxuICAgICAgICAgICAgPG1ldGhvZE5hbWU+UmVmZXIgdG8gU3R1ZGVudFZ1ZS9kb2NzPC9tZXRob2ROYW1lPlxyXG4gICAgICAgICAgICA8cGFyYW1TdHI+XHJcbiAgICAgICAgICAgICAgPEFueXRoaW5nVGhhdENhbkJlUGFzc2VkPnRydWU8L0FueXRoaW5nVGhhdENhbkJlUGFzc2VkPlxyXG4gICAgICAgICAgICAgIDxBc0xvbmdBc0l0TWF0Y2hlc1RoZURvY3VtZW50YXRpb24+dHJ1ZTwvQXNMb25nQXNJdE1hdGNoZXNUaGVEb2N1bWVudGF0aW9uPlxyXG4gICAgICAgICAgICA8L3BhcmFtU3RyPlxyXG4gICAgICAgIDwvUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0PlxyXG4gICAgICA8L3NvYXA6Qm9keT5cclxuPC9zb2FwOkVudmVsb3BlPlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHByb3RlY3RlZCBwcm9jZXNzUmVxdWVzdDxUPihvcHRpb25zOiBSZXF1ZXN0T3B0aW9ucywgcHJlcGFyc2U6ICh4bWw6IHN0cmluZykgPT4gc3RyaW5nID0gKHhtbCkgPT4geG1sKTogUHJvbWlzZTxUPiB7XHJcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogUmVxdWVzdE9wdGlvbnMgPSB7XHJcbiAgICAgIHZhbGlkYXRlRXJyb3JzOiB0cnVlLFxyXG4gICAgICBza2lwTG9naW5Mb2c6IDAsXHJcbiAgICAgIHBhcmVudDogdGhpcy5pc1BhcmVudCxcclxuICAgICAgd2ViU2VydmljZUhhbmRsZU5hbWU6ICdQWFBXZWJTZXJ2aWNlcycsXHJcbiAgICAgIHBhcmFtU3RyOiB7fSxcclxuICAgICAgLi4ub3B0aW9ucyxcclxuICAgIH07XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgWE1MQnVpbGRlcih7XHJcbiAgICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXHJcbiAgICAgICAgYXJyYXlOb2RlTmFtZTogJ3NvYXA6RW52ZWxvcGUnLFxyXG4gICAgICAgIHN1cHByZXNzRW1wdHlOb2RlOiB0cnVlLFxyXG4gICAgICB9KTtcclxuICAgICAgY29uc3QgeG1sID0gYnVpbGRlci5idWlsZCh7XHJcbiAgICAgICAgJ3NvYXA6RW52ZWxvcGUnOiB7XHJcbiAgICAgICAgICAnQF94bWxuczp4c2knOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnLFxyXG4gICAgICAgICAgJ0BfeG1sbnM6eHNkJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJyxcclxuICAgICAgICAgICdAX3htbG5zOnNvYXAnOiAnaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nLFxyXG4gICAgICAgICAgJ3NvYXA6Qm9keSc6IHtcclxuICAgICAgICAgICAgUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0OiB7XHJcbiAgICAgICAgICAgICAgJ0BfeG1sbnMnOiAnaHR0cDovL2VkdXBvaW50LmNvbS93ZWJzZXJ2aWNlcy8nLFxyXG4gICAgICAgICAgICAgIHVzZXJJRDogdGhpcy51c2VybmFtZSxcclxuICAgICAgICAgICAgICBwYXNzd29yZDogdGhpcy5wYXNzd29yZCxcclxuICAgICAgICAgICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcclxuICAgICAgICAgICAgICAuLi57IHBhcmFtU3RyOiBDbGllbnQucGFyc2VQYXJhbVN0cihkZWZhdWx0T3B0aW9ucy5wYXJhbVN0ciA/PyB7fSkgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBheGlvc1xyXG4gICAgICAgIC5wb3N0PHN0cmluZz4odGhpcy5kaXN0cmljdCwgeG1sLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbCcgfSB9KVxyXG4gICAgICAgIC50aGVuKCh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IFhNTFBhcnNlcih7fSk7XHJcbiAgICAgICAgICBjb25zdCByZXN1bHQ6IFBhcnNlZFJlcXVlc3RSZXN1bHQgPSBwYXJzZXIucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgICBjb25zdCBwYXJzZXJUd28gPSBuZXcgWE1MUGFyc2VyKHtcclxuICAgICAgICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXHJcbiAgICAgICAgICAgIGlzQXJyYXk6ICgpID0+IHRydWUsXHJcbiAgICAgICAgICAgIHByb2Nlc3NFbnRpdGllczogZmFsc2UsXHJcbiAgICAgICAgICAgIHBhcnNlQXR0cmlidXRlVmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICBwYXJzZVRhZ1ZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNvbnN0IG9iajogVCB8IFBhcnNlZFJlcXVlc3RFcnJvciA9IHBhcnNlclR3by5wYXJzZShcclxuICAgICAgICAgICAgcHJlcGFyc2UoXHJcbiAgICAgICAgICAgICAgcmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddLlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3BvbnNlLlByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdFJlc3VsdFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIGlmIChkZWZhdWx0T3B0aW9ucy52YWxpZGF0ZUVycm9ycyAmJiAnUlRfRVJST1InIGluIG9iaikgcmV0dXJuIHJlamVjdChuZXcgUmVxdWVzdEV4Y2VwdGlvbihvYmopKTtcclxuXHJcbiAgICAgICAgICByZXMob2JqIGFzIFQpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlamVjdCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIHBhcnNlUGFyYW1TdHIoaW5wdXQ6IG9iamVjdCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBidWlsZGVyID0gbmV3IFhNTEJ1aWxkZXIoe1xyXG4gICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgICAgYXJyYXlOb2RlTmFtZTogJ1BhcmFtcycsXHJcbiAgICAgIHN1cHByZXNzRW1wdHlOb2RlOiB0cnVlLFxyXG4gICAgICBzdXBwcmVzc0Jvb2xlYW5BdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgIH0pO1xyXG4gICAgY29uc3QgeG1sID0gYDxQYXJtcz4ke2J1aWxkZXIuYnVpbGQoaW5wdXQpfTwvUGFybXM+YDtcclxuICAgIHJldHVybiB4bWw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHByb2Nlc3NBbm9ueW1vdXNSZXF1ZXN0PFQ+KFxyXG4gICAgdXJsOiBzdHJpbmcsXHJcbiAgICBvcHRpb25zOiBQYXJ0aWFsPFJlcXVlc3RPcHRpb25zPiA9IHt9LFxyXG4gICAgcHJlcGFyc2U6ICh4bWw6IHN0cmluZykgPT4gc3RyaW5nID0gKGQpID0+IGQucmVwbGFjZSgvJmd0Oy9nLCAnPicpLnJlcGxhY2UoLyZsdDsvZywgJzwnKVxyXG4gICk6IFByb21pc2U8VD4ge1xyXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IFJlcXVlc3RPcHRpb25zID0ge1xyXG4gICAgICBza2lwTG9naW5Mb2c6IDAsXHJcbiAgICAgIHZhbGlkYXRlRXJyb3JzOiB0cnVlLFxyXG4gICAgICBwYXJlbnQ6IDAsXHJcbiAgICAgIHdlYlNlcnZpY2VIYW5kbGVOYW1lOiAnSERJbmZvU2VydmljZXMnLFxyXG4gICAgICBtZXRob2ROYW1lOiAnR2V0TWF0Y2hpbmdEaXN0cmljdExpc3QnLFxyXG4gICAgICBwYXJhbVN0cjoge30sXHJcbiAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KChyZXMsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCBidWlsZGVyID0gbmV3IFhNTEJ1aWxkZXIoe1xyXG4gICAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgICAgIGFycmF5Tm9kZU5hbWU6ICdzb2FwOkVudmVsb3BlJyxcclxuICAgICAgICBzdXBwcmVzc0VtcHR5Tm9kZTogdHJ1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0IHhtbCA9IGJ1aWxkZXIuYnVpbGQoe1xyXG4gICAgICAgICdzb2FwOkVudmVsb3BlJzoge1xyXG4gICAgICAgICAgJ0BfeG1sbnM6eHNpJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlJyxcclxuICAgICAgICAgICdAX3htbG5zOnhzZCc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScsXHJcbiAgICAgICAgICAnQF94bWxuczpzb2FwJzogJ2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvJyxcclxuICAgICAgICAgICdzb2FwOkJvZHknOiB7XHJcbiAgICAgICAgICAgIFByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdDoge1xyXG4gICAgICAgICAgICAgICdAX3htbG5zJzogJ2h0dHA6Ly9lZHVwb2ludC5jb20vd2Vic2VydmljZXMvJyxcclxuICAgICAgICAgICAgICB1c2VySUQ6ICdFZHVwb2ludERpc3RyaWN0SW5mbycsXHJcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6ICdFZHVwMDFudCcsXHJcbiAgICAgICAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgLi4ueyBwYXJhbVN0cjogQ2xpZW50LnBhcnNlUGFyYW1TdHIoZGVmYXVsdE9wdGlvbnMucGFyYW1TdHIgPz8ge30pIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYXhpb3NcclxuICAgICAgICAucG9zdDxzdHJpbmc+KHVybCwgeG1sLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbCcgfSB9KVxyXG4gICAgICAgIC50aGVuKCh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IFhNTFBhcnNlcih7fSk7XHJcbiAgICAgICAgICBjb25zdCByZXN1bHQ6IFBhcnNlZFJlcXVlc3RSZXN1bHQgPSBwYXJzZXIucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgICBjb25zdCBwYXJzZXJUd28gPSBuZXcgWE1MUGFyc2VyKHsgaWdub3JlQXR0cmlidXRlczogZmFsc2UgfSk7XHJcblxyXG4gICAgICAgICAgY29uc3Qgb2JqOiBUIHwgUGFyc2VkQW5vbnltb3VzUmVxdWVzdEVycm9yID0gcGFyc2VyVHdvLnBhcnNlKFxyXG4gICAgICAgICAgICBwcmVwYXJzZShcclxuICAgICAgICAgICAgICByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzcG9uc2UuUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzdWx0XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgaWYgKGRlZmF1bHRPcHRpb25zLnZhbGlkYXRlRXJyb3JzICYmICdSVF9FUlJPUicgaW4gb2JqKSByZXR1cm4gcmVqZWN0KG5ldyBSZXF1ZXN0RXhjZXB0aW9uKG9iaikpO1xyXG5cclxuICAgICAgICAgIHJlcyhvYmogYXMgVCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqZWN0KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=