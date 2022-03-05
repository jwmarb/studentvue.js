import { ParsedAnonymousRequestError, ParsedRequestError } from '../../utils/soap/Client/Client.interfaces';

/**
 * RequestException is a class used to parse errors from Synergy servers
 */
export default class RequestException {
  public readonly message: string;
  public readonly stack: string | undefined;

  public constructor(obj: ParsedRequestError | { message: string; stack?: string } | ParsedAnonymousRequestError) {
    if ('message' in obj) {
      this.message = obj.message;
      this.stack = obj.stack;
    } else if (Array.isArray(obj.RT_ERROR)) {
      this.message = obj.RT_ERROR[0]['@_ERROR_MESSAGE'][0];
      this.stack = obj.RT_ERROR[0].STACK_TRACE[0];
    } else {
      this.message = obj.RT_ERROR['@_ERROR_MESSAGE'];
      this.stack = obj.RT_ERROR.STACK_TRACE;
    }
  }
}
