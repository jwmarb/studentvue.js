import { ParsedAnonymousRequestError, ParsedRequestError } from '../../utils/soap/Client/Client.interfaces';
export default class RequestException {
    private _message;
    private _stackTrace;
    get message(): string;
    get stack(): string | undefined;
    constructor(obj: ParsedRequestError | {
        message: string;
        stack?: string;
    } | ParsedAnonymousRequestError);
}
