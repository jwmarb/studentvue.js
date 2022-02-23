export declare interface RequestOptions {
  skipLoginLog?: number;
  parent?: number;
  webServiceHandleName?: string;
  methodName: string;
  paramStr?: Record<string, unknown>;
}

export declare interface ParsedRequestResult {
  '?xml': string;
  'soap:Envelope': {
    'soap:Body': {
      ProcessWebServiceRequestResponse: {
        ProcessWebServiceRequestResult: string;
      };
    };
  };
}

export declare interface ParsedRequestError {
  RT_ERROR: {
    '@_ERROR_MESSAGE': string;
    STACK_TRACE: string;
  };
}
