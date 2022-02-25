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
    this.icon = new Icon(xmlObject['@_IconURL'][0], this.hostUrl);
    this.id = xmlObject['@_ID'][0];
    this.type = xmlObject['@_Type'][0];
    this.beginDate = xmlObject['@_BeginDate'][0];
    this.htmlContent = xmlObject['@_Content'][0];
    this.read = JSON.parse(xmlObject['@_Read'][0]);
    this.deletable = JSON.parse(xmlObject['@_Deletable'][0]);
    this.from = {
      name: xmlObject['@_From'][0],
      staffGu: xmlObject['@_StaffGU'][0],
      smMsgPersonGu: xmlObject['@_SMMsgPersonGU'][0],
      email: xmlObject['@_Email'][0],
    };
    this.module = xmlObject['@_Module'][0];
    this.subject = {
      html: xmlObject['@_Subject'][0],
      raw: xmlObject['@_SubjectNoHTML'][0],
    };
    this.attachments =
      typeof xmlObject.AttachmentDatas[0] !== 'string'
        ? xmlObject.AttachmentDatas[0].AttachmentData.map(
            (data) => new Attachment(data['@_AttachmentName'][0], data['@_SmAttachmentGU'][0], credentials)
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
              '@_ID': this.xmlObject['@_ID'][0],
              '@_Type': this.xmlObject['@_Type'][0],
              '@_MarkAsRead': 'true',
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
