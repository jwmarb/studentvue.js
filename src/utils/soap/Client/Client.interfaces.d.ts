/**
 * Options to provide when processing a fetch POST request to synergy servers
 */
export declare interface RequestOptions {
  /**
   * Skip the login process. If set to 1, this will save a server-sided HTTPOnly cookie, but it is recommended to set it to 0 since there is no way to log out using this API yet.
   * @see https://github.com/StudentVue/docs
   */
  skipLoginLog?: number;

  /**
   * Whether the user is a parent or not. Set to 1 if the user is a parent
   * @see https://github.com/StudentVue/docs
   */
  parent?: number;

  /**
   * The service handle name sent to synergy servers to process the request. For handling requests for the student, it will be `PXPWebServices`
   * @see https://github.com/StudentVue/docs
   */
  webServiceHandleName?: string;

  /**
   * The method name to provide to synergy when processing the request.
   * @see https://github.com/StudentVue/docs
   */
  methodName: string;

  /**
   * The parameters to provide in the method
   * @see https://github.com/StudentVue/docs
   */
  paramStr?: Record<string, unknown>;
}

/**
 * The login information of the student that includes the district url
 */
export declare interface LoginCredentials {
  /**
   * The student's username
   */
  username: string;

  /**
   * The student's password
   */
  password: string;

  /**
   * The student's district URL
   */
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
