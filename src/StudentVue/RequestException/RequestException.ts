import { ParsedAnonymousRequestError, ParsedRequestError } from '../../utils/soap/Client/Client.interfaces';

export default class RequestException {
  private _message: string;
  private _stackTrace: string | undefined;

  public get message() {
    return this._message;
  }

  public get stack() {
    return this._stackTrace;
  }

  public constructor(obj: ParsedRequestError | { message: string; stack?: string } | ParsedAnonymousRequestError) {
    if ('message' in obj) {
      this._message = obj.message;
      this._stackTrace = obj.stack;
    } else if (Array.isArray(obj.RT_ERROR)) {
      this._message = obj.RT_ERROR[0]['@_ERROR_MESSAGE'][0];
      this._stackTrace = obj.RT_ERROR[0].STACK_TRACE[0];
    } else {
      this._message = obj.RT_ERROR['@_ERROR_MESSAGE'];
      this._stackTrace = obj.RT_ERROR.STACK_TRACE;
    }
  }
}
