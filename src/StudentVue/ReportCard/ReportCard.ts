import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import File from '../File/File';
import { ReportCardFile } from './ReportCard.interfaces';
import { ReportCardBase64XMLObject, ReportCardsXMLObject } from './ReportCard.xml';

export default class ReportCard extends File<ReportCardFile> {
  public readonly date: Date;
  public readonly periodName: string;

  protected parseXMLObject(xmlObject: ReportCardBase64XMLObject): ReportCardFile {
    return {
      document: {
        name: xmlObject.DocumentData[0]['@_DocFileName'][0],
        type: xmlObject.DocumentData[0]['@_DocType'][0],
      },
      name: xmlObject.DocumentData[0]['@_FileName'][0],
      base64: xmlObject.DocumentData[0].Base64Code[0],
    };
  }
  public constructor(
    xmlObj: ReportCardsXMLObject['RCReportingPeriodData'][0]['RCReportingPeriods'][0]['RCReportingPeriod'][0],
    credentials: LoginCredentials
  ) {
    super(credentials, xmlObj['@_DocumentGU'][0], 'GetReportCardDocumentData');
    this.date = new Date(xmlObj['@_EndDate'][0]);
    this.periodName = xmlObj['@_ReportingPeriodName'][0];
  }
}
