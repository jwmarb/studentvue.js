import { RequestOptions } from '../../../utils/soap/Client/Client.interfaces';
export default class Client {
    private __username__;
    private __password__;
    protected get username(): string;
    protected get password(): string;
    constructor(username: string, password: string);
    protected processRequest<T>(): Promise<T>;
    protected processAnonymousRequest<T>(options?: RequestOptions): Promise<T>;
}
