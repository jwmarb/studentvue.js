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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9zb2FwL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50IiwiZGlzdHJpY3QiLCJfX2Rpc3RyaWN0X18iLCJ1c2VybmFtZSIsIl9fdXNlcm5hbWVfXyIsInBhc3N3b3JkIiwiX19wYXNzd29yZF9fIiwiY3JlZGVudGlhbHMiLCJkaXN0cmljdFVybCIsImNvbnN0cnVjdG9yIiwiaXNQYXJlbnQiLCJwcm9jZXNzUmVxdWVzdCIsIm9wdGlvbnMiLCJwcmVwYXJzZSIsInhtbCIsImRlZmF1bHRPcHRpb25zIiwidmFsaWRhdGVFcnJvcnMiLCJza2lwTG9naW5Mb2ciLCJwYXJlbnQiLCJ3ZWJTZXJ2aWNlSGFuZGxlTmFtZSIsInBhcmFtU3RyIiwiUHJvbWlzZSIsInJlcyIsInJlamVjdCIsImJ1aWxkZXIiLCJYTUxCdWlsZGVyIiwiaWdub3JlQXR0cmlidXRlcyIsImFycmF5Tm9kZU5hbWUiLCJzdXBwcmVzc0VtcHR5Tm9kZSIsImJ1aWxkIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0IiwidXNlcklEIiwicGFyc2VQYXJhbVN0ciIsImF4aW9zIiwicG9zdCIsImhlYWRlcnMiLCJ0aGVuIiwiZGF0YSIsInBhcnNlciIsIlhNTFBhcnNlciIsInJlc3VsdCIsInBhcnNlIiwicGFyc2VyVHdvIiwiaXNBcnJheSIsInByb2Nlc3NFbnRpdGllcyIsInBhcnNlQXR0cmlidXRlVmFsdWUiLCJwYXJzZVRhZ1ZhbHVlIiwib2JqIiwiUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzcG9uc2UiLCJQcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHQiLCJSZXF1ZXN0RXhjZXB0aW9uIiwiY2F0Y2giLCJpbnB1dCIsInN1cHByZXNzQm9vbGVhbkF0dHJpYnV0ZXMiLCJwcm9jZXNzQW5vbnltb3VzUmVxdWVzdCIsInVybCIsImQiLCJyZXBsYWNlIiwibWV0aG9kTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUFmLElBQTJCLEVBQWhEO0FBQVo7QUFMcUI7QUFEZjtBQUpFO0FBRE8sU0FBZCxDQUFaOztBQWlCQWEsdUJBQ0dDLElBREgsQ0FDZ0JxQixHQURoQixFQUNxQnpDLEdBRHJCLEVBQzBCO0FBQUVxQixVQUFBQSxPQUFPLEVBQUU7QUFBRSw0QkFBZ0I7QUFBbEI7QUFBWCxTQUQxQixFQUVHQyxJQUZILENBRVEsQ0FBQztBQUFFQyxVQUFBQTtBQUFGLFNBQUQsS0FBYztBQUNsQixnQkFBTUMsTUFBTSxHQUFHLElBQUlDLHdCQUFKLENBQWMsRUFBZCxDQUFmO0FBQ0EsZ0JBQU1DLE1BQTJCLEdBQUdGLE1BQU0sQ0FBQ0csS0FBUCxDQUFhSixJQUFiLENBQXBDO0FBQ0EsZ0JBQU1LLFNBQVMsR0FBRyxJQUFJSCx3QkFBSixDQUFjO0FBQUViLFlBQUFBLGdCQUFnQixFQUFFO0FBQXBCLFdBQWQsQ0FBbEI7QUFFQSxnQkFBTXFCLEdBQW9DLEdBQUdMLFNBQVMsQ0FBQ0QsS0FBVixDQUMzQzVCLFFBQVEsQ0FDTjJCLE1BQU0sQ0FBQyxlQUFELENBQU4sQ0FBd0IsV0FBeEIsRUFBcUNRLGdDQUFyQyxDQUFzRUMsOEJBRGhFLENBRG1DLENBQTdDOztBQU1BLGNBQUlsQyxjQUFjLENBQUNDLGNBQWYsSUFBaUMsY0FBYytCLEdBQW5EO0FBQXdELG1CQUFPeEIsTUFBTSxDQUFDLElBQUkyQix5QkFBSixDQUFxQkgsR0FBckIsQ0FBRCxDQUFiO0FBQXhEOztBQUVBekIsVUFBQUEsR0FBRyxDQUFDeUIsR0FBRCxDQUFIO0FBQ0QsU0FoQkgsRUFpQkdJLEtBakJILENBaUJTNUIsTUFqQlQ7QUFrQkQsT0F6Q00sQ0FBUDtBQTBDRDs7QUE5THlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCB7IFhNTEJ1aWxkZXIsIFhNTFBhcnNlciB9IGZyb20gJ2Zhc3QteG1sLXBhcnNlcic7XG5pbXBvcnQge1xuICBQYXJzZWRSZXF1ZXN0RXJyb3IsXG4gIFJlcXVlc3RPcHRpb25zLFxuICBQYXJzZWRSZXF1ZXN0UmVzdWx0LFxuICBQYXJzZWRBbm9ueW1vdXNSZXF1ZXN0RXJyb3IsXG4gIExvZ2luQ3JlZGVudGlhbHMsXG59IGZyb20gJy4uLy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcbmltcG9ydCBSZXF1ZXN0RXhjZXB0aW9uIGZyb20gJy4uLy4uLy4uL1N0dWRlbnRWdWUvUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IHtcbiAgcHJpdmF0ZSBfX3VzZXJuYW1lX186IHN0cmluZztcbiAgcHJpdmF0ZSBfX3Bhc3N3b3JkX186IHN0cmluZztcbiAgcHJpdmF0ZSBfX2Rpc3RyaWN0X186IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBpc1BhcmVudDogbnVtYmVyO1xuXG4gIHByaXZhdGUgZ2V0IGRpc3RyaWN0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX19kaXN0cmljdF9fO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgdXNlcm5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fX3VzZXJuYW1lX187XG4gIH1cblxuICBwcml2YXRlIGdldCBwYXNzd29yZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9fcGFzc3dvcmRfXztcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgY3JlZGVudGlhbHMoKTogTG9naW5DcmVkZW50aWFscyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQ6IHRoaXMucGFzc3dvcmQsXG4gICAgICBkaXN0cmljdFVybDogdGhpcy5kaXN0cmljdCxcbiAgICB9O1xuICB9XG5cbiAgY29uc3RydWN0b3IoY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMpIHtcbiAgICB0aGlzLl9fdXNlcm5hbWVfXyA9IGNyZWRlbnRpYWxzLnVzZXJuYW1lO1xuICAgIHRoaXMuX19wYXNzd29yZF9fID0gY3JlZGVudGlhbHMucGFzc3dvcmQ7XG4gICAgdGhpcy5fX2Rpc3RyaWN0X18gPSBjcmVkZW50aWFscy5kaXN0cmljdFVybDtcbiAgICB0aGlzLmlzUGFyZW50ID0gY3JlZGVudGlhbHMuaXNQYXJlbnQgPyAxIDogMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBQT1NUIHJlcXVlc3QgdG8gc3luZXJneSBzZXJ2ZXJzIHRvIGZldGNoIGRhdGFcbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBwcm92aWRlIHdoZW4gbWFraW5nIGEgWE1MIHJlcXVlc3QgdG8gdGhlIHNlcnZlcnNcbiAgICogQHBhcmFtIHByZXBhcnNlIFJ1bnMgYmVmb3JlIHBhcnNpbmcgdGhlIHhtbCBzdHJpbmcgaW50byBhbiBvYmplY3QuIFVzZWZ1bCBmb3IgbXV0YXRpbmcgeG1sIHRoYXQgY291bGQgYmUgcGFyc2VkIGluY29ycmVjdGx5IGJ5IGBmYXN0LXhtbC1wYXJzZXJgXG4gICAqIEByZXR1cm5zIFJldHVybnMgYW4gWE1MIG9iamVjdCB0aGF0IG11c3QgYmUgZGVmaW5lZCBpbiBhIHR5cGUgZGVjbGFyYXRpb24gZmlsZS5cbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3R1ZGVudFZ1ZS9kb2NzXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBzdXBlci5wcm9jZXNzUmVxdWVzdCh7IG1ldGhvZE5hbWU6ICdSZWZlciB0byBTdHVkZW50VnVlL2RvY3MnLCBwYXJhbVN0cjogeyBBbnl0aGluZ1RoYXRDYW5CZVBhc3NlZDogdHJ1ZSwgQXNMb25nQXNJdE1hdGNoZXNUaGVEb2N1bWVudGF0aW9uOiB0cnVlIH19KTtcbiAgICogLy8gVGhpcyB3aWxsIG1ha2UgdGhlIFhNTCByZXF1ZXN0IGJlbG93OlxuICAgKiBgYGBcbiAgICogXG4gICAqIGBgYHhtbFxuICAgKiA8c29hcDpFbnZlbG9wZSB4bWxuczp4c2k9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZVwiIHhtbG5zOnhzZD1cImh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hXCIgeG1sbnM6c29hcD1cImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvXCI+XG4gICAgICA8c29hcDpCb2R5PlxuICAgICAgICA8UHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0IHhtbG5zPVwiaHR0cDovL2VkdXBvaW50LmNvbS93ZWJzZXJ2aWNlcy9cIj5cbiAgICAgICAgICAgIDx1c2VySUQ+U1RVREVOVF9VU0VSTkFNRTwvdXNlcklEPlxuICAgICAgICAgICAgPHBhc3N3b3JkPlNUVURFTlRfUEFTU1dPUkQ8L3Bhc3N3b3JkPlxuICAgICAgICAgICAgPHNraXBMb2dpbkxvZz4xPC9za2lwTG9naW5Mb2c+XG4gICAgICAgICAgICA8cGFyZW50PjA8L3BhcmVudD5cbiAgICAgICAgICAgIDx3ZWJTZXJ2aWNlSGFuZGxlTmFtZT5QWFBXZWJTZXJ2aWNlczwvd2ViU2VydmljZUhhbmRsZU5hbWU+XG4gICAgICAgICAgICA8bWV0aG9kTmFtZT5SZWZlciB0byBTdHVkZW50VnVlL2RvY3M8L21ldGhvZE5hbWU+XG4gICAgICAgICAgICA8cGFyYW1TdHI+XG4gICAgICAgICAgICAgIDxBbnl0aGluZ1RoYXRDYW5CZVBhc3NlZD50cnVlPC9Bbnl0aGluZ1RoYXRDYW5CZVBhc3NlZD5cbiAgICAgICAgICAgICAgPEFzTG9uZ0FzSXRNYXRjaGVzVGhlRG9jdW1lbnRhdGlvbj50cnVlPC9Bc0xvbmdBc0l0TWF0Y2hlc1RoZURvY3VtZW50YXRpb24+XG4gICAgICAgICAgICA8L3BhcmFtU3RyPlxuICAgICAgICA8L1Byb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdD5cbiAgICAgIDwvc29hcDpCb2R5PlxuPC9zb2FwOkVudmVsb3BlPlxuICAgKiBgYGBcbiAgICovXG4gIHByb3RlY3RlZCBwcm9jZXNzUmVxdWVzdDxUPihvcHRpb25zOiBSZXF1ZXN0T3B0aW9ucywgcHJlcGFyc2U6ICh4bWw6IHN0cmluZykgPT4gc3RyaW5nID0gKHhtbCkgPT4geG1sKTogUHJvbWlzZTxUPiB7XG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IFJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgdmFsaWRhdGVFcnJvcnM6IHRydWUsXG4gICAgICBza2lwTG9naW5Mb2c6IDAsXG4gICAgICBwYXJlbnQ6IHRoaXMuaXNQYXJlbnQsXG4gICAgICB3ZWJTZXJ2aWNlSGFuZGxlTmFtZTogJ1BYUFdlYlNlcnZpY2VzJyxcbiAgICAgIHBhcmFtU3RyOiB7fSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBidWlsZGVyID0gbmV3IFhNTEJ1aWxkZXIoe1xuICAgICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcbiAgICAgICAgYXJyYXlOb2RlTmFtZTogJ3NvYXA6RW52ZWxvcGUnLFxuICAgICAgICBzdXBwcmVzc0VtcHR5Tm9kZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgeG1sID0gYnVpbGRlci5idWlsZCh7XG4gICAgICAgICdzb2FwOkVudmVsb3BlJzoge1xuICAgICAgICAgICdAX3htbG5zOnhzaSc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZScsXG4gICAgICAgICAgJ0BfeG1sbnM6eHNkJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJyxcbiAgICAgICAgICAnQF94bWxuczpzb2FwJzogJ2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvJyxcbiAgICAgICAgICAnc29hcDpCb2R5Jzoge1xuICAgICAgICAgICAgUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0OiB7XG4gICAgICAgICAgICAgICdAX3htbG5zJzogJ2h0dHA6Ly9lZHVwb2ludC5jb20vd2Vic2VydmljZXMvJyxcbiAgICAgICAgICAgICAgdXNlcklEOiB0aGlzLnVzZXJuYW1lLFxuICAgICAgICAgICAgICBwYXNzd29yZDogdGhpcy5wYXNzd29yZCxcbiAgICAgICAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgICAgICAgICAgIC4uLnsgcGFyYW1TdHI6IENsaWVudC5wYXJzZVBhcmFtU3RyKGRlZmF1bHRPcHRpb25zLnBhcmFtU3RyID8/IHt9KSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGF4aW9zXG4gICAgICAgIC5wb3N0PHN0cmluZz4odGhpcy5kaXN0cmljdCwgeG1sLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbCcgfSB9KVxuICAgICAgICAudGhlbigoeyBkYXRhIH0pID0+IHtcbiAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgWE1MUGFyc2VyKHt9KTtcbiAgICAgICAgICBjb25zdCByZXN1bHQ6IFBhcnNlZFJlcXVlc3RSZXN1bHQgPSBwYXJzZXIucGFyc2UoZGF0YSk7XG4gICAgICAgICAgY29uc3QgcGFyc2VyVHdvID0gbmV3IFhNTFBhcnNlcih7XG4gICAgICAgICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcbiAgICAgICAgICAgIGlzQXJyYXk6ICgpID0+IHRydWUsXG4gICAgICAgICAgICBwcm9jZXNzRW50aXRpZXM6IGZhbHNlLFxuICAgICAgICAgICAgcGFyc2VBdHRyaWJ1dGVWYWx1ZTogZmFsc2UsXG4gICAgICAgICAgICBwYXJzZVRhZ1ZhbHVlOiBmYWxzZSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvbnN0IG9iajogVCB8IFBhcnNlZFJlcXVlc3RFcnJvciA9IHBhcnNlclR3by5wYXJzZShcbiAgICAgICAgICAgIHByZXBhcnNlKFxuICAgICAgICAgICAgICByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzcG9uc2UuUHJvY2Vzc1dlYlNlcnZpY2VSZXF1ZXN0UmVzdWx0XG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChkZWZhdWx0T3B0aW9ucy52YWxpZGF0ZUVycm9ycyAmJiAnUlRfRVJST1InIGluIG9iaikgcmV0dXJuIHJlamVjdChuZXcgUmVxdWVzdEV4Y2VwdGlvbihvYmopKTtcblxuICAgICAgICAgIHJlcyhvYmogYXMgVCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcGFyc2VQYXJhbVN0cihpbnB1dDogb2JqZWN0KTogc3RyaW5nIHtcbiAgICBjb25zdCBidWlsZGVyID0gbmV3IFhNTEJ1aWxkZXIoe1xuICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXG4gICAgICBhcnJheU5vZGVOYW1lOiAnUGFyYW1zJyxcbiAgICAgIHN1cHByZXNzRW1wdHlOb2RlOiB0cnVlLFxuICAgICAgc3VwcHJlc3NCb29sZWFuQXR0cmlidXRlczogZmFsc2UsXG4gICAgfSk7XG4gICAgY29uc3QgeG1sID0gYDxQYXJtcz4ke2J1aWxkZXIuYnVpbGQoaW5wdXQpfTwvUGFybXM+YDtcbiAgICByZXR1cm4geG1sO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBwcm9jZXNzQW5vbnltb3VzUmVxdWVzdDxUPihcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiBQYXJ0aWFsPFJlcXVlc3RPcHRpb25zPiA9IHt9LFxuICAgIHByZXBhcnNlOiAoeG1sOiBzdHJpbmcpID0+IHN0cmluZyA9IChkKSA9PiBkLnJlcGxhY2UoLyZndDsvZywgJz4nKS5yZXBsYWNlKC8mbHQ7L2csICc8JylcbiAgKTogUHJvbWlzZTxUPiB7XG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IFJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgc2tpcExvZ2luTG9nOiAwLFxuICAgICAgdmFsaWRhdGVFcnJvcnM6IHRydWUsXG4gICAgICBwYXJlbnQ6IDAsXG4gICAgICB3ZWJTZXJ2aWNlSGFuZGxlTmFtZTogJ0hESW5mb1NlcnZpY2VzJyxcbiAgICAgIG1ldGhvZE5hbWU6ICdHZXRNYXRjaGluZ0Rpc3RyaWN0TGlzdCcsXG4gICAgICBwYXJhbVN0cjoge30sXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KChyZXMsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgYnVpbGRlciA9IG5ldyBYTUxCdWlsZGVyKHtcbiAgICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXG4gICAgICAgIGFycmF5Tm9kZU5hbWU6ICdzb2FwOkVudmVsb3BlJyxcbiAgICAgICAgc3VwcHJlc3NFbXB0eU5vZGU6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHhtbCA9IGJ1aWxkZXIuYnVpbGQoe1xuICAgICAgICAnc29hcDpFbnZlbG9wZSc6IHtcbiAgICAgICAgICAnQF94bWxuczp4c2knOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnLFxuICAgICAgICAgICdAX3htbG5zOnhzZCc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScsXG4gICAgICAgICAgJ0BfeG1sbnM6c29hcCc6ICdodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlLycsXG4gICAgICAgICAgJ3NvYXA6Qm9keSc6IHtcbiAgICAgICAgICAgIFByb2Nlc3NXZWJTZXJ2aWNlUmVxdWVzdDoge1xuICAgICAgICAgICAgICAnQF94bWxucyc6ICdodHRwOi8vZWR1cG9pbnQuY29tL3dlYnNlcnZpY2VzLycsXG4gICAgICAgICAgICAgIHVzZXJJRDogJ0VkdXBvaW50RGlzdHJpY3RJbmZvJyxcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6ICdFZHVwMDFudCcsXG4gICAgICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgICAgICAgICAgICAuLi57IHBhcmFtU3RyOiBDbGllbnQucGFyc2VQYXJhbVN0cihkZWZhdWx0T3B0aW9ucy5wYXJhbVN0ciA/PyB7fSkgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBheGlvc1xuICAgICAgICAucG9zdDxzdHJpbmc+KHVybCwgeG1sLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbCcgfSB9KVxuICAgICAgICAudGhlbigoeyBkYXRhIH0pID0+IHtcbiAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgWE1MUGFyc2VyKHt9KTtcbiAgICAgICAgICBjb25zdCByZXN1bHQ6IFBhcnNlZFJlcXVlc3RSZXN1bHQgPSBwYXJzZXIucGFyc2UoZGF0YSk7XG4gICAgICAgICAgY29uc3QgcGFyc2VyVHdvID0gbmV3IFhNTFBhcnNlcih7IGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlIH0pO1xuXG4gICAgICAgICAgY29uc3Qgb2JqOiBUIHwgUGFyc2VkQW5vbnltb3VzUmVxdWVzdEVycm9yID0gcGFyc2VyVHdvLnBhcnNlKFxuICAgICAgICAgICAgcHJlcGFyc2UoXG4gICAgICAgICAgICAgIHJlc3VsdFsnc29hcDpFbnZlbG9wZSddWydzb2FwOkJvZHknXS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXNwb25zZS5Qcm9jZXNzV2ViU2VydmljZVJlcXVlc3RSZXN1bHRcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKGRlZmF1bHRPcHRpb25zLnZhbGlkYXRlRXJyb3JzICYmICdSVF9FUlJPUicgaW4gb2JqKSByZXR1cm4gcmVqZWN0KG5ldyBSZXF1ZXN0RXhjZXB0aW9uKG9iaikpO1xuXG4gICAgICAgICAgcmVzKG9iaiBhcyBUKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==