import axios from 'axios';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import {
  ParsedRequestError,
  RequestOptions,
  ParsedRequestResult,
  ParsedAnonymousRequestError,
} from '../../../utils/soap/Client/Client.interfaces';
import RequestException from '../../../StudentVue/RequestException/RequestException';

export default class Client {
  private __username__: string;
  private __password__: string;
  private __district__: string;

  private get district(): string {
    return this.__district__;
  }

  protected get username(): string {
    return this.__username__;
  }

  protected get password(): string {
    return this.__password__;
  }

  constructor(username: string, password: string, district: string) {
    this.__username__ = username;
    this.__password__ = password;
    this.__district__ = district;
  }

  protected processRequest<T>(options: RequestOptions): Promise<T> {
    const defaultOptions: RequestOptions = {
      skipLoginLog: 1,
      parent: 0,
      webServiceHandleName: 'PXPWebServices',
      paramStr: {},
      ...options,
    };
    return new Promise(async (res, reject) => {
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

      try {
        const { data } = await axios.post<string>(this.district, xml, { headers: { 'Content-Type': 'text/xml' } });

        const parser = new XMLParser({});
        const result: ParsedRequestResult = parser.parse(data);
        const parserTwo = new XMLParser({ ignoreAttributes: false, isArray: () => true });
        const obj: T | ParsedRequestError = parserTwo.parse(
          result['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult
        );

        if ('RT_ERROR' in obj) return reject(new RequestException(obj));

        res(obj);
      } catch (e) {
        reject(e);
      }
    });
  }

  private static parseParamStr(input: object): string {
    let paramStr = '<Parms>';
    Object.entries(input).forEach(([key, value]) => {
      paramStr += '<' + key + '>';
      paramStr += value;
      paramStr += '</' + key + '>';
    });
    paramStr += '</Parms>';

    return paramStr;
  }

  public static processAnonymousRequest<T>(url: string, options: Partial<RequestOptions> = {}): Promise<T> {
    const defaultOptions: RequestOptions = {
      skipLoginLog: 1,
      parent: 0,
      webServiceHandleName: 'HDInfoServices',
      methodName: 'GetMatchingDistrictList',
      paramStr: {},
      ...options,
    };
    return new Promise<T>(async (res, reject) => {
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

      try {
        const { data } = await axios.post<string>(url, xml, { headers: { 'Content-Type': 'text/xml' } });

        const parser = new XMLParser({});
        const result: ParsedRequestResult = parser.parse(data);
        const parserTwo = new XMLParser({ ignoreAttributes: false });
        const obj: T | ParsedAnonymousRequestError = parserTwo.parse(
          result['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult
        );

        if ('RT_ERROR' in obj) return reject(new RequestException(obj));

        res(obj);
      } catch (e) {
        reject(e);
      }
    });
  }
}
