import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import soap from '../../utils/soap/soap';
import Attachment from '../Attachment/Attachment';
import { MessageXMLObject } from './Message.xml';
import Icon from '../Icon/Icon';

export default class Message extends soap.Client {
  private xmlObject: MessageXMLObject['PXPMessagesData'][0]['MessageListings'][0]['MessageListing'][0];
  private hostUrl: string;

  public readonly icon: Icon;
  public readonly id: string;
  public readonly beginDate;

  public readonly type: string;
  public readonly htmlContent: string;
  private read: boolean;
  private deletable: boolean;
  public readonly from: {
    name: string;
    staffGu: string;
    email: string;
    smMsgPersonGu: string;
  };
  public readonly module: string;
  public readonly subject: {
    html: string;
    raw: string;
  };
  public readonly attachments: Attachment[];

  constructor(
    xmlObject: MessageXMLObject['PXPMessagesData'][0]['MessageListings'][0]['MessageListing'][0],
    credentials: LoginCredentials,
    hostUrl: string
  ) {
    super(credentials);
    this.hostUrl = hostUrl;
    this.xmlObject = xmlObject;
    this.icon = new Icon(xmlObject['@_IconURL'], this.hostUrl);
    this.id = xmlObject['@_ID'];
    this.type = xmlObject['@_Type'];
    this.beginDate = xmlObject['@_BeginDate'];
    this.htmlContent = xmlObject['@_Content'];
    this.read = JSON.parse(xmlObject['@_Read']);
    this.deletable = JSON.parse(xmlObject['@_Deletable']);
    this.from = {
      name: xmlObject['@_From'],
      staffGu: xmlObject['@_StaffGU'],
      smMsgPersonGu: xmlObject['@_SMMsgPersonGU'],
      email: xmlObject['@_Email'],
    };
    this.module = xmlObject['@_Module'];
    this.subject = {
      html: xmlObject['@_Subject'],
      raw: xmlObject['@_SubjectNoHTML'],
    };
    this.attachments =
      typeof xmlObject.AttachmentDatas[0] !== 'string'
        ? xmlObject.AttachmentDatas[0].AttachmentData.map(
            (data) => new Attachment(data['@_AttachmentName'], data['@_SmAttachmentGU'], credentials)
          )
        : [];
  }

  public isRead(): boolean {
    return this.read;
  }

  public isDeletable(): boolean {
    return this.deletable;
  }

  private setRead(read: boolean) {
    this.read = read;
  }

  private setDeletable(deletable: boolean) {
    this.deletable = deletable;
  }

  public markAsRead(): Promise<true> {
    return new Promise<true>(async (res, rej) => {
      if (this.read) return res(true);
      try {
        await super.processRequest({
          methodName: 'UpdatePXPMessage',
          paramStr: {
            childIntId: 0,
            MessageListing: {
              '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
              '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
              '@_MarkAsRead': 'true',
              '@_Type': this.xmlObject['@_Type'],
              '@_ID': this.xmlObject['@_ID'],
            },
          },
        });
        this.setRead(true);

        res(true);
      } catch (e) {
        rej(e);
      }
    });
  }
}
