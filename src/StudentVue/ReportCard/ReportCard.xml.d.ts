export declare interface ReportCardsXMLObject {
  RCReportingPeriodData: [
    {
      RCReportingPeriods: [
        {
          RCReportingPeriod: {
            '@_ReportingPeriodGU': [string];
            '@_ReportingPeriodName': [string];
            '@_EndDate': [string];
            '@_DocumentGU': [string];
          }[];
        }
      ];
    }
  ];
}

export declare interface ReportCardBase64XMLObject {
  DocumentData: [
    {
      '@_FileName': [string];
      '@_DocFileName': [string];
      '@_DocType': [string];
      Base64Code: [string];
    }
  ];
}
