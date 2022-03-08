import axios from 'axios';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import {
  ParsedRequestError,
  RequestOptions,
  ParsedRequestResult,
  ParsedAnonymousRequestError,
  LoginCredentials,
} from '../../../utils/soap/Client/Client.interfaces';
import RequestException from '../../../StudentVue/RequestException/RequestException';

export default class Client {
  private __username__: string;
  private __password__: string;
  private __district__: string;
  private readonly isParent: number;

  private get district(): string {
    return this.__district__;
  }

  private get username(): string {
    return this.__username__;
  }

  private get password(): string {
    return this.__password__;
  }

  protected get credentials(): LoginCredentials {
    return {
      username: this.username,
      password: this.password,
      districtUrl: this.district,
    };
  }

  constructor(credentials: LoginCredentials) {
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
  protected processRequest<T>(options: RequestOptions, preparse: (xml: string) => string = (xml) => xml): Promise<T> {
    const defaultOptions: RequestOptions = {
      validateErrors: true,
      skipLoginLog: 0,
      parent: this.isParent,
      webServiceHandleName: 'PXPWebServices',
      paramStr: {},
      ...options,
    };
    return new Promise((res, reject) => {
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        arrayNodeName: 'soap:Envelope',
        suppressEmptyNode: true,
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
              ...{ paramStr: Client.parseParamStr(defaultOptions.paramStr ?? {}) },
            },
          },
        },
      });

      axios
        .post<string>(this.district, xml, { headers: { 'Content-Type': 'text/xml' } })
        .then(({ data }) => {
          const parser = new XMLParser({});
          const result: ParsedRequestResult = parser.parse(data);
          const parserTwo = new XMLParser({
            ignoreAttributes: false,
            isArray: () => true,
            processEntities: false,
            parseAttributeValue: false,
            parseTagValue: false,
          });

          const obj: T | ParsedRequestError = parserTwo.parse(
            preparse(
              result['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult
            )
          );

          if (defaultOptions.validateErrors && 'RT_ERROR' in obj) return reject(new RequestException(obj));

          res(obj as T);
        })
        .catch(reject);
    });
  }

  private static parseParamStr(input: object): string {
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      arrayNodeName: 'Params',
      suppressEmptyNode: true,
      suppressBooleanAttributes: false,
    });
    const xml = `<Parms>${builder.build(input)}</Parms>`;
    return xml;
  }

  public static processAnonymousRequest<T>(
    url: string,
    options: Partial<RequestOptions> = {},
    preparse: (xml: string) => string = (d) => d.replace(/&gt;/g, '>').replace(/&lt;/g, '<')
  ): Promise<T> {
    const defaultOptions: RequestOptions = {
      skipLoginLog: 0,
      validateErrors: true,
      parent: 0,
      webServiceHandleName: 'HDInfoServices',
      methodName: 'GetMatchingDistrictList',
      paramStr: {},
      ...options,
    };
    return new Promise<T>((res, reject) => {
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        arrayNodeName: 'soap:Envelope',
        suppressEmptyNode: true,
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
              ...{ paramStr: Client.parseParamStr(defaultOptions.paramStr ?? {}) },
            },
          },
        },
      });

      axios
        .post<string>(url, xml, { headers: { 'Content-Type': 'text/xml' } })
        .then(({ data }) => {
          const parser = new XMLParser({});
          const result: ParsedRequestResult = parser.parse(data);
          const parserTwo = new XMLParser({ ignoreAttributes: false });

          const obj: T | ParsedAnonymousRequestError = parserTwo.parse(
            preparse(
              result['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult
            )
          );

          if (defaultOptions.validateErrors && 'RT_ERROR' in obj) return reject(new RequestException(obj));

          res(obj as T);
        })
        .catch(reject);
    });
  }
}
