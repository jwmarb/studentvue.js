import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import soap from '../../utils/soap/soap';
import Attachment from '../Attachment/Attachment';
import { MessageXMLObject } from './Message.xml';
import Icon from '../Icon/Icon';

/**
 * Message class
 * This is only returned as an array in `Client.messages()` method
 * @constructor
 * @extends {soap.Client}
 */
export default class Message extends soap.Client {
  private readonly hostUrl: string;

  public readonly icon: Icon;

  public readonly id: string;

  public readonly beginDate: Date;

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
    /**
     * The URL to create POST fetch requests to synergy servers
     * @type {string}
     * @private
     * @readonly
     */
    this.hostUrl = hostUrl;
    /**
     * The message icon
     * @type {Icon}
     * @public
     * @readonly
     */
    this.icon = new Icon(xmlObject['@_IconURL'][0], this.hostUrl);
    /**
     * The ID of the message
     * @type {string}
     * @public
     * @readonly
     */
    this.id = xmlObject['@_ID'][0];
    /**
     * The type of the message
     * @type {string}
     * @public
     * @readonly
     */
    this.type = xmlObject['@_Type'][0];
    /**
     * The date when the message was first posted
     * @type {Date}
     * @public
     * @readonly
     */
    this.beginDate = new Date(xmlObject['@_BeginDate'][0]);
    /**
     * The HTML content of the message
     * @type {string}
     * @public
     * @readonly
     */
    this.htmlContent = unescape(xmlObject['@_Content'][0]);
    /**
     * Whether the message has been read or not
     * @type {boolean}
     * @private
     */
    this.read = JSON.parse(xmlObject['@_Read'][0]);
    /**
     * Whether the message is deletable or not
     * @type {boolean}
     * @private
     */
    this.deletable = JSON.parse(xmlObject['@_Deletable'][0]);
    /**
     * The sender of the message
     * @public
     * @readonly
     * @type {object}
     * @property {string} name - The name of the sender
     * @property {string} staffGu - the staffGu of the sender
     * @property {string} email - The email of the sender
     * @property {string} smMsgPersonGu - The smMsgPersonGu of the sender. Don't know if this property has a real usage or not
     */
    this.from = {
      name: xmlObject['@_From'][0],
      staffGu: xmlObject['@_StaffGU'][0],
      smMsgPersonGu: xmlObject['@_SMMsgPersonGU'][0],
      email: xmlObject['@_Email'][0],
    };
    /**
     * The module of the sender
     * @type {string}
     * @public
     * @readonly
     */
    this.module = xmlObject['@_Module'][0];
    /**
     * The subject of the message
     * @public
     * @readonly
     * @type {object}
     * @property {string} html - The subject of the message with HTML
     * @property {string} raw - The subject of the message without HTML and formatting
     */
    this.subject = {
      html: xmlObject['@_Subject'][0],
      raw: xmlObject['@_SubjectNoHTML'][0],
    };
    /**
     * The attachments included in the message, if there are any.
     * @type {Attachment[]}
     * @public
     * @readonly
     */
    this.attachments =
      typeof xmlObject.AttachmentDatas[0] !== 'string'
        ? xmlObject.AttachmentDatas[0].AttachmentData.map(
            (data) => new Attachment(data['@_AttachmentName'][0], data['@_SmAttachmentGU'][0], credentials)
          )
        : [];
  }

  /**
   * Check if a message has been read
   * @returns {boolean} Returns a boolean declaring whether or not the message has been previously read
   */
  public isRead(): boolean {
    return this.read;
  }

  /**
   * Check if a message is deletable
   * @returns {boolean} Returns a boolean declaring whether or not the message is deletable
   */
  public isDeletable(): boolean {
    return this.deletable;
  }

  private setRead(read: boolean) {
    this.read = read;
  }

  private setDeletable(deletable: boolean) {
    this.deletable = deletable;
  }

  /**
   * Marks the message as read
   * @returns {true} Returns true to show that it has been marked as read
   * @description
   * ```js
   * const messages = await client.messages();
   * messages.every((msg) => msg.isRead()) // -> false
   * messages.forEach(async (msg) => !msg.isRead() && await msg.markAsRead());
   * messages.every((msg) => msg.isRead()) // -> true
   * const refetchedMessages = await client.messages(); // See if it updated on the server
   * messages.every((msg) => msg.isRead()) // -> true
   * ```
   * @description
   * ```tsx
   * // In a React project...
   * import React from 'react';
   *
   * const Message = (props) => {
   *  const { message } = props;
   *
   *  async function handleOnClick() {
   *    await message.markAsRead();
   *  }
   *
   *  return (
   *    <button onClick={handleOnClick} style={{ color: message.isRead() ? undefined : 'red' }}>
   *      <p>{message.subject.raw}</p>
   *    </button>
   *  )
   * }
   *
   * export default Message;
   * ```
   */
  public markAsRead(): Promise<true> {
    return new Promise<true>((res, rej) => {
      if (this.read) return res(true);
      super
        .processRequest({
          methodName: 'UpdatePXPMessage',
          paramStr: {
            childIntId: 0,
            MessageListing: {
              '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
              '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
              '@_ID': this.id,
              '@_Type': this.type,
              '@_MarkAsRead': 'true',
            },
          },
        })
        .then(() => {
          this.setRead(true);
          res(true);
        })
        .catch(rej);
    });
  }
}
