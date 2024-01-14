import { ParsedAnonymousRequestError, ParsedRequestError } from '../../utils/soap/Client/Client.interfaces';

/**
 * RequestException is a class used to parse errors from Synergy servers
 * @constructor
 */
export default class RequestException {
  public readonly message: string;

  public readonly stack: string | undefined;

  public constructor(obj: ParsedRequestError | { message: string; stack?: string } | ParsedAnonymousRequestError) {
    if ('message' in obj) {
      /**
       * The message of the exception
       * @public
       * @readonly
       */
      this.message = obj.message;
      /**
       * The stack trace of the exception. (java)
       * @public
       * @readonly
       */
      this.stack = obj.stack;
    } else if (Array.isArray(obj.RT_ERROR)) {
      const rtError = obj.RT_ERROR[0];
      /**
       * The message of the exception
       * @public
       * @readonly
       */
      this.message = rtError['@_ERROR_MESSAGE'][0];
      /**
       * The stack trace of the exception. (java)
       * @public
       * @readonly
       */
      this.stack = rtError.STACK_TRACE ? rtError.STACK_TRACE[0] : undefined;
    } else {
      /**
       * The message of the exception
       * @public
       * @readonly
       */
      this.message = obj.RT_ERROR['@_ERROR_MESSAGE'];
      /**
       * The stack trace of the exception. (java)
       * @public
       * @readonly
       */
      this.stack = obj.RT_ERROR.STACK_TRACE;
    }
  }
}
