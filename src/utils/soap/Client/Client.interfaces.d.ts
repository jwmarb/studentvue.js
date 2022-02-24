export declare interface RequestOptions {
  skipLoginLog?: number;
  parent?: number;
  webServiceHandleName?: string;
  methodName: string;
  paramStr?: Record<string, unknown>;
}

export declare interface LoginCredentials {
  username: string;
  password: string;
  districtUrl: string;
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
  RT_ERROR: [
    {
      '@_ERROR_MESSAGE': [string];
      STACK_TRACE: [string];
    }
  ];
}

export declare interface ParsedAnonymousRequestError {
  RT_ERROR: {
    '@_ERROR_MESSAGE': string;
    STACK_TRACE: string;
  };
}
