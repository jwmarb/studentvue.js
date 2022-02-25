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
    protected processRequest<T>(options: RequestOptions): Promise<T>;
    private static parseParamStr;
    static processAnonymousRequest<T>(url: string, options?: Partial<RequestOptions>): Promise<T>;
}
