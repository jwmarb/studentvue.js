import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import File from '../File/File';
import { DocumentFile } from './Document.interfaces';
import { DocumentFileXMLObject, DocumentXMLObject } from './Document.xml';
export default class Document extends File<DocumentFile[]> {
    readonly file: {
        name: string;
        date: Date;
        type: string;
    };
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
