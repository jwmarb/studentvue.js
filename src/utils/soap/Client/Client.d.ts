import { RequestOptions, LoginCredentials } from '../../../utils/soap/Client/Client.interfaces';
export default class Client {
    private __username__;
    private __password__;
    private __district__;
    private get district();
    private get username();
    private get password();
    protected get credentials(): LoginCredentials;
    constructor(credentials: LoginCredentials);
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
    protected processRequest<T>(options: RequestOptions): Promise<T>;
    private static parseParamStr;
    static processAnonymousRequest<T>(url: string, options?: Partial<RequestOptions>): Promise<T>;
}
