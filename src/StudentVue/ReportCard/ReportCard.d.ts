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
    /**
     * The date of the report card
     * @public
     * @readonly
     */
    readonly date: Date;
    /**
     * The time period of the report card
     * @public
     * @readonly
     */
    readonly periodName: string;
    protected parseXMLObject(xmlObject: ReportCardBase64XMLObject): ReportCardFile;
    constructor(xmlObj: ReportCardsXMLObject['RCReportingPeriodData'][0]['RCReportingPeriods'][0]['RCReportingPeriod'][0], credentials: LoginCredentials);
}
