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
    /**
     * The URL to create POST fetch requests to synergy servers
     * @private
     * @readonly
     */
    private readonly hostUrl;
    /**
     * The message icon
     * @public
     * @readonly
     */
    readonly icon: Icon;
    /**
     * The ID of the message
     * @public
     * @readonly
     */
    readonly id: string;
    /**
     * The date when the message was first posted
     * @public
     * @readonly
     */
    readonly beginDate: string;
    /**
     * The type of the message
     * @public
     * @readonly
     */
    readonly type: string;
    /**
     * The HTML content of the message
     * @public
     * @readonly
     */
    readonly htmlContent: string;
    /**
     * Whether the message has been read or not
     * @private
     */
    private read;
    /**
     * Whether the message is deletable or not
     * @private
     */
    private deletable;
    /**
     * The sender of the message
     * @public
     * @readonly
     * @property {string} name - The name of the sender
     * @property {string} staffGu - the staffGu of the sender
     * @property {string} email - The email of the sender
     * @property {string} smMsgPersonGu - The smMsgPersonGu of the sender. Don't know if this property has a real usage or not
     */
    readonly from: {
        name: string;
        staffGu: string;
        email: string;
        smMsgPersonGu: string;
    };
    /**
     * The module of the sender
     * @public
     * @readonly
     */
    readonly module: string;
    /**
     * The subject of the message
     * @public
     * @readonly
     * @property {string} html - The subject of the message with HTML
     * @property {string} raw - The subject of the message without HTML and formatting
     */
    readonly subject: {
        html: string;
        raw: string;
    };
    /**
     * The attachments included in the message, if there are any.
     * @public
     * @readonly
     */
    readonly attachments: Attachment[];
    constructor(xmlObject: MessageXMLObject['PXPMessagesData'][0]['MessageListings'][0]['MessageListing'][0], credentials: LoginCredentials, hostUrl: string);
    /**
     * Check if a message has been read
     * @returns {boolean} Returns a boolean declaring whether or not the message has been previously read
     */
    isRead(): boolean;
    /**
     * Check if a message is deletable
     * @returns {boolean} Returns a boolean declaring whether or not the message is deletable
     */
    isDeletable(): boolean;
    private setRead;
    private setDeletable;
    /**
     * Marks the message as read
     * @returns Returns true to show that it has been marked as read
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
    markAsRead(): Promise<true>;
}
