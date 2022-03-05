import { ParsedAnonymousRequestError, ParsedRequestError } from '../../utils/soap/Client/Client.interfaces';
/**
 * RequestException is a class used to parse errors from Synergy servers
 * @constructor
 */
export default class RequestException {
    /**
     * The message of the exception
     * @public
     * @readonly
     */
    readonly message: string;
    /**
     * The stack trace of the exception. (java)
     * @public
     * @readonly
     */
    readonly stack: string | undefined;
    constructor(obj: ParsedRequestError | {
        message: string;
        stack?: string;
    } | ParsedAnonymousRequestError);
}
