import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import File from '../File/File';
import { ReportCardFile } from './ReportCard.interfaces';
import { ReportCardBase64XMLObject, ReportCardsXMLObject } from './ReportCard.xml';
/**
 * ReportCard class
 * @class
 * @extends {File<ReportCardFile>}
 */
export default class ReportCard extends File<ReportCardFile> {
    readonly date: Date;
    readonly periodName: string;
    protected parseXMLObject(xmlObject: ReportCardBase64XMLObject): ReportCardFile;
    constructor(xmlObj: ReportCardsXMLObject['RCReportingPeriodData'][0]['RCReportingPeriods'][0]['RCReportingPeriod'][0], credentials: LoginCredentials);
}
