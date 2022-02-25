import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import soap from '../../utils/soap/soap';
import Attachment from '../Attachment/Attachment';
import { MessageXMLObject } from './Message.xml';
import Icon from '../Icon/Icon';
export default class Message extends soap.Client {
    private xmlObject;
    private hostUrl;
    readonly icon: Icon;
    readonly id: string;
    readonly beginDate: string;
    readonly type: string;
    readonly htmlContent: string;
    private read;
    private deletable;
    readonly from: {
        name: string;
        staffGu: string;
        email: string;
        smMsgPersonGu: string;
    };
    readonly module: string;
    readonly subject: {
        html: string;
        raw: string;
    };
    readonly attachments: Attachment[];
    constructor(xmlObject: MessageXMLObject['PXPMessagesData'][0]['MessageListings'][0]['MessageListing'][0], credentials: LoginCredentials, hostUrl: string);
    isRead(): boolean;
    isDeletable(): boolean;
    private setRead;
    private setDeletable;
    markAsRead(): Promise<true>;
}
