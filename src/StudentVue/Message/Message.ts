import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import soap from '../../utils/soap/soap';
import Attachment from '../Attachment/Attachment';
import { MessageXMLObject } from './Message.xml';
import Icon from '../Icon/Icon';

export default class Message extends soap.Client {
  private xmlObject: MessageXMLObject['MessageListings'][0]['MessageListing'][0];
  private hostUrl: string;
  private credentials: LoginCredentials;
  public get icon(): Icon {
    return new Icon(this.xmlObject['@_IconURL'], this.hostUrl);
  }

  public get id(): string {
    return this.xmlObject['@_ID'];
  }
  public get beginDate(): string {
    return this.xmlObject['@_BeginDate'];
  }

  public get type(): string {
    return this.xmlObject['@_Type'];
  }
  public get htmlContent(): string {
    return this.xmlObject['@_Content'];
  }
  public get isRead(): boolean {
    return JSON.parse(this.xmlObject['@_Read']);
  }
  public get isDeletable(): boolean {
    return JSON.parse(this.xmlObject['@_Deletable']);
  }
  public get from(): {
    name: string;
    staffGu: string;
    email: string;
    smMsgPersonGu: string;
  } {
    return {
      name: this.xmlObject['@_From'],
      staffGu: this.xmlObject['@_StaffGU'],
      smMsgPersonGu: this.xmlObject['@_SMMsgPersonGU'],
      email: this.xmlObject['@_Email'],
    };
  }
  public get module(): string {
    return this.xmlObject['@_Module'];
  }
  public get subject(): {
    html: string;
    raw: string;
  } {
    return {
      html: this.xmlObject['@_Subject'],
      raw: this.xmlObject['@_SubjectNoHTML'],
    };
  }
  public get attachments(): Attachment[] {
    return this.xmlObject.AttachmentDatas[0].AttachmentData.map(
      (data) => new Attachment(data['@_AttachmentName'], data['@_SmAttachmentGU'], this.credentials)
    );
  }

  constructor(
    xmlObject: MessageXMLObject['MessageListings'][0]['MessageListing'][0],
    credentials: LoginCredentials,
    hostUrl: string
  ) {
    super(credentials);
    this.hostUrl = hostUrl;
    this.xmlObject = xmlObject;
    this.credentials = credentials;
  }
}
