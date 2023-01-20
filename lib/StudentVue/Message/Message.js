(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/soap/soap", "../Attachment/Attachment", "../Icon/Icon"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/soap/soap"), require("../Attachment/Attachment"), require("../Icon/Icon"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.soap, global.Attachment, global.Icon);
    global.Message = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _soap, _Attachment, _Icon) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _soap = _interopRequireDefault(_soap);
  _Attachment = _interopRequireDefault(_Attachment);
  _Icon = _interopRequireDefault(_Icon);
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  /**
   * Message class
   * This is only returned as an array in `Client.messages()` method
   * @constructor
   * @extends {soap.Client}
   */
  class Message extends _soap.default.Client {
    constructor(xmlObject, credentials, hostUrl) {
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
      this.icon = new _Icon.default(xmlObject['@_IconURL'][0], this.hostUrl);
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
        email: xmlObject['@_Email'][0]
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
        raw: xmlObject['@_SubjectNoHTML'][0]
      };
      /**
       * The attachments included in the message, if there are any.
       * @type {Attachment[]}
       * @public
       * @readonly
       */
      this.attachments = typeof xmlObject.AttachmentDatas[0] !== 'string' ? xmlObject.AttachmentDatas[0].AttachmentData.map(data => {
        return new _Attachment.default(data['@_AttachmentName'][0], data['@_SmAttachmentGU'][0], credentials);
      }) : [];
    }

    /**
     * Check if a message has been read
     * @returns {boolean} Returns a boolean declaring whether or not the message has been previously read
     */
    isRead() {
      return this.read;
    }

    /**
     * Check if a message is deletable
     * @returns {boolean} Returns a boolean declaring whether or not the message is deletable
     */
    isDeletable() {
      return this.deletable;
    }
    setRead(read) {
      this.read = read;
    }
    setDeletable(deletable) {
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
    markAsRead() {
      return new Promise((res, rej) => {
        if (this.read) {
          return res(true);
        }
        super.processRequest({
          methodName: 'UpdatePXPMessage',
          paramStr: {
            childIntId: 0,
            MessageListing: {
              '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
              '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
              '@_ID': this.id,
              '@_Type': this.type,
              '@_MarkAsRead': 'true'
            }
          }
        }).then(() => {
          this.setRead(true);
          res(true);
        }).catch(rej);
      });
    }
  }
  _exports.default = Message;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNZXNzYWdlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwieG1sT2JqZWN0IiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiaWNvbiIsIkljb24iLCJpZCIsInR5cGUiLCJiZWdpbkRhdGUiLCJEYXRlIiwiaHRtbENvbnRlbnQiLCJ1bmVzY2FwZSIsInJlYWQiLCJKU09OIiwicGFyc2UiLCJkZWxldGFibGUiLCJmcm9tIiwibmFtZSIsInN0YWZmR3UiLCJzbU1zZ1BlcnNvbkd1IiwiZW1haWwiLCJtb2R1bGUiLCJzdWJqZWN0IiwiaHRtbCIsInJhdyIsImF0dGFjaG1lbnRzIiwiQXR0YWNobWVudERhdGFzIiwiQXR0YWNobWVudERhdGEiLCJtYXAiLCJkYXRhIiwiQXR0YWNobWVudCIsImlzUmVhZCIsImlzRGVsZXRhYmxlIiwic2V0UmVhZCIsInNldERlbGV0YWJsZSIsIm1hcmtBc1JlYWQiLCJQcm9taXNlIiwicmVzIiwicmVqIiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwiTWVzc2FnZUxpc3RpbmciLCJ0aGVuIiwiY2F0Y2giXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvU3R1ZGVudFZ1ZS9NZXNzYWdlL01lc3NhZ2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscyB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XG5pbXBvcnQgQXR0YWNobWVudCBmcm9tICcuLi9BdHRhY2htZW50L0F0dGFjaG1lbnQnO1xuaW1wb3J0IHsgTWVzc2FnZVhNTE9iamVjdCB9IGZyb20gJy4vTWVzc2FnZS54bWwnO1xuaW1wb3J0IEljb24gZnJvbSAnLi4vSWNvbi9JY29uJztcblxuLyoqXG4gKiBNZXNzYWdlIGNsYXNzXG4gKiBUaGlzIGlzIG9ubHkgcmV0dXJuZWQgYXMgYW4gYXJyYXkgaW4gYENsaWVudC5tZXNzYWdlcygpYCBtZXRob2RcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMge3NvYXAuQ2xpZW50fVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlIGV4dGVuZHMgc29hcC5DbGllbnQge1xuICBwcml2YXRlIHJlYWRvbmx5IGhvc3RVcmw6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgaWNvbjogSWNvbjtcblxuICBwdWJsaWMgcmVhZG9ubHkgaWQ6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgYmVnaW5EYXRlOiBEYXRlO1xuXG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGh0bWxDb250ZW50OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkOiBib29sZWFuO1xuXG4gIHByaXZhdGUgZGVsZXRhYmxlOiBib29sZWFuO1xuXG4gIHB1YmxpYyByZWFkb25seSBmcm9tOiB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHN0YWZmR3U6IHN0cmluZztcbiAgICBlbWFpbDogc3RyaW5nO1xuICAgIHNtTXNnUGVyc29uR3U6IHN0cmluZztcbiAgfTtcblxuICBwdWJsaWMgcmVhZG9ubHkgbW9kdWxlOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IHN1YmplY3Q6IHtcbiAgICBodG1sOiBzdHJpbmc7XG4gICAgcmF3OiBzdHJpbmc7XG4gIH07XG5cbiAgcHVibGljIHJlYWRvbmx5IGF0dGFjaG1lbnRzOiBBdHRhY2htZW50W107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgeG1sT2JqZWN0OiBNZXNzYWdlWE1MT2JqZWN0WydQWFBNZXNzYWdlc0RhdGEnXVswXVsnTWVzc2FnZUxpc3RpbmdzJ11bMF1bJ01lc3NhZ2VMaXN0aW5nJ11bMF0sXG4gICAgY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsXG4gICAgaG9zdFVybDogc3RyaW5nXG4gICkge1xuICAgIHN1cGVyKGNyZWRlbnRpYWxzKTtcbiAgICAvKipcbiAgICAgKiBUaGUgVVJMIHRvIGNyZWF0ZSBQT1NUIGZldGNoIHJlcXVlc3RzIHRvIHN5bmVyZ3kgc2VydmVyc1xuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmhvc3RVcmwgPSBob3N0VXJsO1xuICAgIC8qKlxuICAgICAqIFRoZSBtZXNzYWdlIGljb25cbiAgICAgKiBAdHlwZSB7SWNvbn1cbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy5pY29uID0gbmV3IEljb24oeG1sT2JqZWN0WydAX0ljb25VUkwnXVswXSwgdGhpcy5ob3N0VXJsKTtcbiAgICAvKipcbiAgICAgKiBUaGUgSUQgb2YgdGhlIG1lc3NhZ2VcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmlkID0geG1sT2JqZWN0WydAX0lEJ11bMF07XG4gICAgLyoqXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIG1lc3NhZ2VcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLnR5cGUgPSB4bWxPYmplY3RbJ0BfVHlwZSddWzBdO1xuICAgIC8qKlxuICAgICAqIFRoZSBkYXRlIHdoZW4gdGhlIG1lc3NhZ2Ugd2FzIGZpcnN0IHBvc3RlZFxuICAgICAqIEB0eXBlIHtEYXRlfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmJlZ2luRGF0ZSA9IG5ldyBEYXRlKHhtbE9iamVjdFsnQF9CZWdpbkRhdGUnXVswXSk7XG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgY29udGVudCBvZiB0aGUgbWVzc2FnZVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuaHRtbENvbnRlbnQgPSB1bmVzY2FwZSh4bWxPYmplY3RbJ0BfQ29udGVudCddWzBdKTtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBtZXNzYWdlIGhhcyBiZWVuIHJlYWQgb3Igbm90XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnJlYWQgPSBKU09OLnBhcnNlKHhtbE9iamVjdFsnQF9SZWFkJ11bMF0pO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIG1lc3NhZ2UgaXMgZGVsZXRhYmxlIG9yIG5vdFxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZWxldGFibGUgPSBKU09OLnBhcnNlKHhtbE9iamVjdFsnQF9EZWxldGFibGUnXVswXSk7XG4gICAgLyoqXG4gICAgICogVGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNlbmRlclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzdGFmZkd1IC0gdGhlIHN0YWZmR3Ugb2YgdGhlIHNlbmRlclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBlbWFpbCAtIFRoZSBlbWFpbCBvZiB0aGUgc2VuZGVyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHNtTXNnUGVyc29uR3UgLSBUaGUgc21Nc2dQZXJzb25HdSBvZiB0aGUgc2VuZGVyLiBEb24ndCBrbm93IGlmIHRoaXMgcHJvcGVydHkgaGFzIGEgcmVhbCB1c2FnZSBvciBub3RcbiAgICAgKi9cbiAgICB0aGlzLmZyb20gPSB7XG4gICAgICBuYW1lOiB4bWxPYmplY3RbJ0BfRnJvbSddWzBdLFxuICAgICAgc3RhZmZHdTogeG1sT2JqZWN0WydAX1N0YWZmR1UnXVswXSxcbiAgICAgIHNtTXNnUGVyc29uR3U6IHhtbE9iamVjdFsnQF9TTU1zZ1BlcnNvbkdVJ11bMF0sXG4gICAgICBlbWFpbDogeG1sT2JqZWN0WydAX0VtYWlsJ11bMF0sXG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgbW9kdWxlIG9mIHRoZSBzZW5kZXJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLm1vZHVsZSA9IHhtbE9iamVjdFsnQF9Nb2R1bGUnXVswXTtcbiAgICAvKipcbiAgICAgKiBUaGUgc3ViamVjdCBvZiB0aGUgbWVzc2FnZVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBodG1sIC0gVGhlIHN1YmplY3Qgb2YgdGhlIG1lc3NhZ2Ugd2l0aCBIVE1MXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHJhdyAtIFRoZSBzdWJqZWN0IG9mIHRoZSBtZXNzYWdlIHdpdGhvdXQgSFRNTCBhbmQgZm9ybWF0dGluZ1xuICAgICAqL1xuICAgIHRoaXMuc3ViamVjdCA9IHtcbiAgICAgIGh0bWw6IHhtbE9iamVjdFsnQF9TdWJqZWN0J11bMF0sXG4gICAgICByYXc6IHhtbE9iamVjdFsnQF9TdWJqZWN0Tm9IVE1MJ11bMF0sXG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgYXR0YWNobWVudHMgaW5jbHVkZWQgaW4gdGhlIG1lc3NhZ2UsIGlmIHRoZXJlIGFyZSBhbnkuXG4gICAgICogQHR5cGUge0F0dGFjaG1lbnRbXX1cbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy5hdHRhY2htZW50cyA9XG4gICAgICB0eXBlb2YgeG1sT2JqZWN0LkF0dGFjaG1lbnREYXRhc1swXSAhPT0gJ3N0cmluZydcbiAgICAgICAgPyB4bWxPYmplY3QuQXR0YWNobWVudERhdGFzWzBdLkF0dGFjaG1lbnREYXRhLm1hcChcbiAgICAgICAgICAgIChkYXRhKSA9PiBuZXcgQXR0YWNobWVudChkYXRhWydAX0F0dGFjaG1lbnROYW1lJ11bMF0sIGRhdGFbJ0BfU21BdHRhY2htZW50R1UnXVswXSwgY3JlZGVudGlhbHMpXG4gICAgICAgICAgKVxuICAgICAgICA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgbWVzc2FnZSBoYXMgYmVlbiByZWFkXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGEgYm9vbGVhbiBkZWNsYXJpbmcgd2hldGhlciBvciBub3QgdGhlIG1lc3NhZ2UgaGFzIGJlZW4gcHJldmlvdXNseSByZWFkXG4gICAqL1xuICBwdWJsaWMgaXNSZWFkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnJlYWQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBtZXNzYWdlIGlzIGRlbGV0YWJsZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBhIGJvb2xlYW4gZGVjbGFyaW5nIHdoZXRoZXIgb3Igbm90IHRoZSBtZXNzYWdlIGlzIGRlbGV0YWJsZVxuICAgKi9cbiAgcHVibGljIGlzRGVsZXRhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRlbGV0YWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0UmVhZChyZWFkOiBib29sZWFuKSB7XG4gICAgdGhpcy5yZWFkID0gcmVhZDtcbiAgfVxuXG4gIHByaXZhdGUgc2V0RGVsZXRhYmxlKGRlbGV0YWJsZTogYm9vbGVhbikge1xuICAgIHRoaXMuZGVsZXRhYmxlID0gZGVsZXRhYmxlO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBtZXNzYWdlIGFzIHJlYWRcbiAgICogQHJldHVybnMge3RydWV9IFJldHVybnMgdHJ1ZSB0byBzaG93IHRoYXQgaXQgaGFzIGJlZW4gbWFya2VkIGFzIHJlYWRcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgY2xpZW50Lm1lc3NhZ2VzKCk7XG4gICAqIG1lc3NhZ2VzLmV2ZXJ5KChtc2cpID0+IG1zZy5pc1JlYWQoKSkgLy8gLT4gZmFsc2VcbiAgICogbWVzc2FnZXMuZm9yRWFjaChhc3luYyAobXNnKSA9PiAhbXNnLmlzUmVhZCgpICYmIGF3YWl0IG1zZy5tYXJrQXNSZWFkKCkpO1xuICAgKiBtZXNzYWdlcy5ldmVyeSgobXNnKSA9PiBtc2cuaXNSZWFkKCkpIC8vIC0+IHRydWVcbiAgICogY29uc3QgcmVmZXRjaGVkTWVzc2FnZXMgPSBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTsgLy8gU2VlIGlmIGl0IHVwZGF0ZWQgb24gdGhlIHNlcnZlclxuICAgKiBtZXNzYWdlcy5ldmVyeSgobXNnKSA9PiBtc2cuaXNSZWFkKCkpIC8vIC0+IHRydWVcbiAgICogYGBgXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGB0c3hcbiAgICogLy8gSW4gYSBSZWFjdCBwcm9qZWN0Li4uXG4gICAqIGltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG4gICAqXG4gICAqIGNvbnN0IE1lc3NhZ2UgPSAocHJvcHMpID0+IHtcbiAgICogIGNvbnN0IHsgbWVzc2FnZSB9ID0gcHJvcHM7XG4gICAqXG4gICAqICBhc3luYyBmdW5jdGlvbiBoYW5kbGVPbkNsaWNrKCkge1xuICAgKiAgICBhd2FpdCBtZXNzYWdlLm1hcmtBc1JlYWQoKTtcbiAgICogIH1cbiAgICpcbiAgICogIHJldHVybiAoXG4gICAqICAgIDxidXR0b24gb25DbGljaz17aGFuZGxlT25DbGlja30gc3R5bGU9e3sgY29sb3I6IG1lc3NhZ2UuaXNSZWFkKCkgPyB1bmRlZmluZWQgOiAncmVkJyB9fT5cbiAgICogICAgICA8cD57bWVzc2FnZS5zdWJqZWN0LnJhd308L3A+XG4gICAqICAgIDwvYnV0dG9uPlxuICAgKiAgKVxuICAgKiB9XG4gICAqXG4gICAqIGV4cG9ydCBkZWZhdWx0IE1lc3NhZ2U7XG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIG1hcmtBc1JlYWQoKTogUHJvbWlzZTx0cnVlPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHRydWU+KChyZXMsIHJlaikgPT4ge1xuICAgICAgaWYgKHRoaXMucmVhZCkgcmV0dXJuIHJlcyh0cnVlKTtcbiAgICAgIHN1cGVyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdCh7XG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1VwZGF0ZVBYUE1lc3NhZ2UnLFxuICAgICAgICAgIHBhcmFtU3RyOiB7XG4gICAgICAgICAgICBjaGlsZEludElkOiAwLFxuICAgICAgICAgICAgTWVzc2FnZUxpc3Rpbmc6IHtcbiAgICAgICAgICAgICAgJ0BfeG1sbnM6eHNpJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlJyxcbiAgICAgICAgICAgICAgJ0BfeG1sbnM6eHNkJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJyxcbiAgICAgICAgICAgICAgJ0BfSUQnOiB0aGlzLmlkLFxuICAgICAgICAgICAgICAnQF9UeXBlJzogdGhpcy50eXBlLFxuICAgICAgICAgICAgICAnQF9NYXJrQXNSZWFkJzogJ3RydWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRSZWFkKHRydWUpO1xuICAgICAgICAgIHJlcyh0cnVlKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlaik7XG4gICAgfSk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDZSxNQUFNQSxPQUFPLFNBQVNDLGFBQUksQ0FBQ0MsTUFBTSxDQUFDO0lBaUMvQ0MsV0FBVyxD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