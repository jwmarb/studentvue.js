import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import File from '../File/File';
import { DocumentFile } from './Document.interface';
import { DocumentFileXMLObject, DocumentXMLObject } from './Document.xml';
export default class Document extends File<DocumentFile[]> {
    /**
     * The properties of the file
     * @public
     * @readonly
     */
    readonly file: {
        name: string;
        date: Date;
        type: string;
    };
    /**
     * The comment included in the document
     * @public
     * @readonly
     */
    readonly comment: string;
    protected parseXMLObject(xmlObject: DocumentFileXMLObject): {
        file: {
            name: string;
            type: string;
            date: Date;
        };
        category: string;
        notes: string;
        base64: string;
    }[];
    constructor(xmlObj: DocumentXMLObject['StudentDocuments'][0]['StudentDocumentDatas'][0]['StudentDocumentData'][0], credentials: LoginCredentials);
}
