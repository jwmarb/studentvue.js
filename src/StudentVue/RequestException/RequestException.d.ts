import { ParsedAnonymousRequestError, ParsedRequestError } from '../../utils/soap/Client/Client.interfaces';
/**
 * RequestException is a class used to parse errors from Synergy servers
 * @constructor
 */
export default class RequestException {
    readonly message: string;
    readonly stack: string | undefined;
    constructor(obj: ParsedRequestError | {
        message: string;
        stack?: string;
    } | ParsedAnonymousRequestError);
}
