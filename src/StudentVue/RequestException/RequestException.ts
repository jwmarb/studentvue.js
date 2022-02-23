import { ParsedRequestError } from '../../utils/soap/Client/Client.interfaces';

export default class RequestException {
  private _message: string;
  private _stackTrace: string | undefined;

  public get message() {
    return this._message;
  }

  public get stack() {
    return this._stackTrace;
  }

  public constructor(obj: ParsedRequestError | { message: string; stack?: string }) {
    if ('message' in obj) {
      this._message = obj.message;
      this._stackTrace = obj.stack;
    } else {
      this._message = obj.RT_ERROR['@_ERROR_MESSAGE'];
      this._stackTrace = obj.RT_ERROR.STACK_TRACE;
    }
  }
}
