import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import File from '../File/File';
import { ReportCardFile } from './ReportCard.interfaces';
import { ReportCardBase64XMLObject, ReportCardsXMLObject } from './ReportCard.xml';

/**
 * ReportCard class
 * @class
 * @extends {File<ReportCardFile>}
 */
export default class ReportCard extends File<ReportCardFile | undefined> {
  public readonly date: Date;

  public readonly periodName: string;

  protected parseXMLObject(xmlObject: ReportCardBase64XMLObject): ReportCardFile | undefined {
    if ('DocumentData' in xmlObject)
      return {
        document: {
          name: xmlObject.DocumentData[0]['@_DocFileName'][0],
          type: xmlObject.DocumentData[0]['@_DocType'][0],
        },
        name: xmlObject.DocumentData[0]['@_FileName'][0],
        base64: xmlObject.DocumentData[0].Base64Code[0],
      };
    return undefined;
  }
  public constructor(
    xmlObj: ReportCardsXMLObject['RCReportingPeriodData'][0]['RCReportingPeriods'][0]['RCReportingPeriod'][0],
    credentials: LoginCredentials
  ) {
    super(credentials, xmlObj['@_DocumentGU'][0], 'GetReportCardDocumentData');
    /**
     * The date of the report card
     * @public
     * @readonly
     * @type {Date}
     */
    this.date = new Date(xmlObj['@_EndDate'][0]);
    /**
     * The time period of the report card
     * @public
     * @readonly
     * @type {string}
     */
    this.periodName = xmlObj['@_ReportingPeriodName'][0];
  }
}
