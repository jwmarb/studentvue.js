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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNZXNzYWdlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwieG1sT2JqZWN0IiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiaWNvbiIsIkljb24iLCJpZCIsInR5cGUiLCJiZWdpbkRhdGUiLCJEYXRlIiwiaHRtbENvbnRlbnQiLCJ1bmVzY2FwZSIsInJlYWQiLCJKU09OIiwicGFyc2UiLCJkZWxldGFibGUiLCJmcm9tIiwibmFtZSIsInN0YWZmR3UiLCJzbU1zZ1BlcnNvbkd1IiwiZW1haWwiLCJtb2R1bGUiLCJzdWJqZWN0IiwiaHRtbCIsInJhdyIsImF0dGFjaG1lbnRzIiwiQXR0YWNobWVudERhdGFzIiwiQXR0YWNobWVudERhdGEiLCJtYXAiLCJkYXRhIiwiQXR0YWNobWVudCIsImlzUmVhZCIsImlzRGVsZXRhYmxlIiwic2V0UmVhZCIsInNldERlbGV0YWJsZSIsIm1hcmtBc1JlYWQiLCJQcm9taXNlIiwicmVzIiwicmVqIiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwiTWVzc2FnZUxpc3RpbmciLCJ0aGVuIiwiY2F0Y2giXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvU3R1ZGVudFZ1ZS9NZXNzYWdlL01lc3NhZ2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscyB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHNvYXAgZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9zb2FwJztcclxuaW1wb3J0IEF0dGFjaG1lbnQgZnJvbSAnLi4vQXR0YWNobWVudC9BdHRhY2htZW50JztcclxuaW1wb3J0IHsgTWVzc2FnZVhNTE9iamVjdCB9IGZyb20gJy4vTWVzc2FnZS54bWwnO1xyXG5pbXBvcnQgSWNvbiBmcm9tICcuLi9JY29uL0ljb24nO1xyXG5cclxuLyoqXHJcbiAqIE1lc3NhZ2UgY2xhc3NcclxuICogVGhpcyBpcyBvbmx5IHJldHVybmVkIGFzIGFuIGFycmF5IGluIGBDbGllbnQubWVzc2FnZXMoKWAgbWV0aG9kXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlIGV4dGVuZHMgc29hcC5DbGllbnQge1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgaG9zdFVybDogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgaWNvbjogSWNvbjtcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IGlkOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBiZWdpbkRhdGU6IERhdGU7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBodG1sQ29udGVudDogc3RyaW5nO1xyXG5cclxuICBwcml2YXRlIHJlYWQ6IGJvb2xlYW47XHJcblxyXG4gIHByaXZhdGUgZGVsZXRhYmxlOiBib29sZWFuO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgZnJvbToge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgc3RhZmZHdTogc3RyaW5nO1xyXG4gICAgZW1haWw6IHN0cmluZztcclxuICAgIHNtTXNnUGVyc29uR3U6IHN0cmluZztcclxuICB9O1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgbW9kdWxlOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBzdWJqZWN0OiB7XHJcbiAgICBodG1sOiBzdHJpbmc7XHJcbiAgICByYXc6IHN0cmluZztcclxuICB9O1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgYXR0YWNobWVudHM6IEF0dGFjaG1lbnRbXTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB4bWxPYmplY3Q6IE1lc3NhZ2VYTUxPYmplY3RbJ1BYUE1lc3NhZ2VzRGF0YSddWzBdWydNZXNzYWdlTGlzdGluZ3MnXVswXVsnTWVzc2FnZUxpc3RpbmcnXVswXSxcclxuICAgIGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzLFxyXG4gICAgaG9zdFVybDogc3RyaW5nXHJcbiAgKSB7XHJcbiAgICBzdXBlcihjcmVkZW50aWFscyk7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBVUkwgdG8gY3JlYXRlIFBPU1QgZmV0Y2ggcmVxdWVzdHMgdG8gc3luZXJneSBzZXJ2ZXJzXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLmhvc3RVcmwgPSBob3N0VXJsO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbWVzc2FnZSBpY29uXHJcbiAgICAgKiBAdHlwZSB7SWNvbn1cclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLmljb24gPSBuZXcgSWNvbih4bWxPYmplY3RbJ0BfSWNvblVSTCddWzBdLCB0aGlzLmhvc3RVcmwpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgSUQgb2YgdGhlIG1lc3NhZ2VcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdGhpcy5pZCA9IHhtbE9iamVjdFsnQF9JRCddWzBdO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgbWVzc2FnZVxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLnR5cGUgPSB4bWxPYmplY3RbJ0BfVHlwZSddWzBdO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGF0ZSB3aGVuIHRoZSBtZXNzYWdlIHdhcyBmaXJzdCBwb3N0ZWRcclxuICAgICAqIEB0eXBlIHtEYXRlfVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuYmVnaW5EYXRlID0gbmV3IERhdGUoeG1sT2JqZWN0WydAX0JlZ2luRGF0ZSddWzBdKTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIEhUTUwgY29udGVudCBvZiB0aGUgbWVzc2FnZVxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLmh0bWxDb250ZW50ID0gdW5lc2NhcGUoeG1sT2JqZWN0WydAX0NvbnRlbnQnXVswXSk7XHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGhlIG1lc3NhZ2UgaGFzIGJlZW4gcmVhZCBvciBub3RcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgdGhpcy5yZWFkID0gSlNPTi5wYXJzZSh4bWxPYmplY3RbJ0BfUmVhZCddWzBdKTtcclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0aGUgbWVzc2FnZSBpcyBkZWxldGFibGUgb3Igbm90XHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuZGVsZXRhYmxlID0gSlNPTi5wYXJzZSh4bWxPYmplY3RbJ0BfRGVsZXRhYmxlJ11bMF0pO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgc2VuZGVyIG9mIHRoZSBtZXNzYWdlXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzZW5kZXJcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzdGFmZkd1IC0gdGhlIHN0YWZmR3Ugb2YgdGhlIHNlbmRlclxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsIG9mIHRoZSBzZW5kZXJcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzbU1zZ1BlcnNvbkd1IC0gVGhlIHNtTXNnUGVyc29uR3Ugb2YgdGhlIHNlbmRlci4gRG9uJ3Qga25vdyBpZiB0aGlzIHByb3BlcnR5IGhhcyBhIHJlYWwgdXNhZ2Ugb3Igbm90XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZnJvbSA9IHtcclxuICAgICAgbmFtZTogeG1sT2JqZWN0WydAX0Zyb20nXVswXSxcclxuICAgICAgc3RhZmZHdTogeG1sT2JqZWN0WydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgc21Nc2dQZXJzb25HdTogeG1sT2JqZWN0WydAX1NNTXNnUGVyc29uR1UnXVswXSxcclxuICAgICAgZW1haWw6IHhtbE9iamVjdFsnQF9FbWFpbCddWzBdLFxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIG1vZHVsZSBvZiB0aGUgc2VuZGVyXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHRoaXMubW9kdWxlID0geG1sT2JqZWN0WydAX01vZHVsZSddWzBdO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgc3ViamVjdCBvZiB0aGUgbWVzc2FnZVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGh0bWwgLSBUaGUgc3ViamVjdCBvZiB0aGUgbWVzc2FnZSB3aXRoIEhUTUxcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByYXcgLSBUaGUgc3ViamVjdCBvZiB0aGUgbWVzc2FnZSB3aXRob3V0IEhUTUwgYW5kIGZvcm1hdHRpbmdcclxuICAgICAqL1xyXG4gICAgdGhpcy5zdWJqZWN0ID0ge1xyXG4gICAgICBodG1sOiB4bWxPYmplY3RbJ0BfU3ViamVjdCddWzBdLFxyXG4gICAgICByYXc6IHhtbE9iamVjdFsnQF9TdWJqZWN0Tm9IVE1MJ11bMF0sXHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgYXR0YWNobWVudHMgaW5jbHVkZWQgaW4gdGhlIG1lc3NhZ2UsIGlmIHRoZXJlIGFyZSBhbnkuXHJcbiAgICAgKiBAdHlwZSB7QXR0YWNobWVudFtdfVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuYXR0YWNobWVudHMgPVxyXG4gICAgICB0eXBlb2YgeG1sT2JqZWN0LkF0dGFjaG1lbnREYXRhc1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICA/IHhtbE9iamVjdC5BdHRhY2htZW50RGF0YXNbMF0uQXR0YWNobWVudERhdGEubWFwKFxyXG4gICAgICAgICAgICAoZGF0YSkgPT4gbmV3IEF0dGFjaG1lbnQoZGF0YVsnQF9BdHRhY2htZW50TmFtZSddWzBdLCBkYXRhWydAX1NtQXR0YWNobWVudEdVJ11bMF0sIGNyZWRlbnRpYWxzKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIDogW107XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhIG1lc3NhZ2UgaGFzIGJlZW4gcmVhZFxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGEgYm9vbGVhbiBkZWNsYXJpbmcgd2hldGhlciBvciBub3QgdGhlIG1lc3NhZ2UgaGFzIGJlZW4gcHJldmlvdXNseSByZWFkXHJcbiAgICovXHJcbiAgcHVibGljIGlzUmVhZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhIG1lc3NhZ2UgaXMgZGVsZXRhYmxlXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYSBib29sZWFuIGRlY2xhcmluZyB3aGV0aGVyIG9yIG5vdCB0aGUgbWVzc2FnZSBpcyBkZWxldGFibGVcclxuICAgKi9cclxuICBwdWJsaWMgaXNEZWxldGFibGUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5kZWxldGFibGU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFJlYWQocmVhZDogYm9vbGVhbikge1xyXG4gICAgdGhpcy5yZWFkID0gcmVhZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0RGVsZXRhYmxlKGRlbGV0YWJsZTogYm9vbGVhbikge1xyXG4gICAgdGhpcy5kZWxldGFibGUgPSBkZWxldGFibGU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYXJrcyB0aGUgbWVzc2FnZSBhcyByZWFkXHJcbiAgICogQHJldHVybnMge3RydWV9IFJldHVybnMgdHJ1ZSB0byBzaG93IHRoYXQgaXQgaGFzIGJlZW4gbWFya2VkIGFzIHJlYWRcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgY2xpZW50Lm1lc3NhZ2VzKCk7XHJcbiAgICogbWVzc2FnZXMuZXZlcnkoKG1zZykgPT4gbXNnLmlzUmVhZCgpKSAvLyAtPiBmYWxzZVxyXG4gICAqIG1lc3NhZ2VzLmZvckVhY2goYXN5bmMgKG1zZykgPT4gIW1zZy5pc1JlYWQoKSAmJiBhd2FpdCBtc2cubWFya0FzUmVhZCgpKTtcclxuICAgKiBtZXNzYWdlcy5ldmVyeSgobXNnKSA9PiBtc2cuaXNSZWFkKCkpIC8vIC0+IHRydWVcclxuICAgKiBjb25zdCByZWZldGNoZWRNZXNzYWdlcyA9IGF3YWl0IGNsaWVudC5tZXNzYWdlcygpOyAvLyBTZWUgaWYgaXQgdXBkYXRlZCBvbiB0aGUgc2VydmVyXHJcbiAgICogbWVzc2FnZXMuZXZlcnkoKG1zZykgPT4gbXNnLmlzUmVhZCgpKSAvLyAtPiB0cnVlXHJcbiAgICogYGBgXHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBgdHN4XHJcbiAgICogLy8gSW4gYSBSZWFjdCBwcm9qZWN0Li4uXHJcbiAgICogaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuICAgKlxyXG4gICAqIGNvbnN0IE1lc3NhZ2UgPSAocHJvcHMpID0+IHtcclxuICAgKiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcclxuICAgKlxyXG4gICAqICBhc3luYyBmdW5jdGlvbiBoYW5kbGVPbkNsaWNrKCkge1xyXG4gICAqICAgIGF3YWl0IG1lc3NhZ2UubWFya0FzUmVhZCgpO1xyXG4gICAqICB9XHJcbiAgICpcclxuICAgKiAgcmV0dXJuIChcclxuICAgKiAgICA8YnV0dG9uIG9uQ2xpY2s9e2hhbmRsZU9uQ2xpY2t9IHN0eWxlPXt7IGNvbG9yOiBtZXNzYWdlLmlzUmVhZCgpID8gdW5kZWZpbmVkIDogJ3JlZCcgfX0+XHJcbiAgICogICAgICA8cD57bWVzc2FnZS5zdWJqZWN0LnJhd308L3A+XHJcbiAgICogICAgPC9idXR0b24+XHJcbiAgICogIClcclxuICAgKiB9XHJcbiAgICpcclxuICAgKiBleHBvcnQgZGVmYXVsdCBNZXNzYWdlO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBtYXJrQXNSZWFkKCk6IFByb21pc2U8dHJ1ZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHRydWU+KChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBpZiAodGhpcy5yZWFkKSByZXR1cm4gcmVzKHRydWUpO1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdCh7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnVXBkYXRlUFhQTWVzc2FnZScsXHJcbiAgICAgICAgICBwYXJhbVN0cjoge1xyXG4gICAgICAgICAgICBjaGlsZEludElkOiAwLFxyXG4gICAgICAgICAgICBNZXNzYWdlTGlzdGluZzoge1xyXG4gICAgICAgICAgICAgICdAX3htbG5zOnhzaSc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZScsXHJcbiAgICAgICAgICAgICAgJ0BfeG1sbnM6eHNkJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJyxcclxuICAgICAgICAgICAgICAnQF9JRCc6IHRoaXMuaWQsXHJcbiAgICAgICAgICAgICAgJ0BfVHlwZSc6IHRoaXMudHlwZSxcclxuICAgICAgICAgICAgICAnQF9NYXJrQXNSZWFkJzogJ3RydWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuc2V0UmVhZCh0cnVlKTtcclxuICAgICAgICAgIHJlcyh0cnVlKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDZSxNQUFNQSxPQUFPLFNBQVNDLGFBQUksQ0FBQ0MsTUFBTSxDQUFDO0lBaUMvQ0MsV0FBVyxDQUNUQyxTQUE0RixFQUM1RkMsV0FBNkIsRUFDN0JDLE9BQWUsRUFDZjtNQUNBLEtBQUssQ0FBQ0QsV0FBVyxDQUFDO01BQ2xCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUNJLElBQUksQ0FBQ0MsT0FBTyxHQUFHQSxPQUFPO01BQ3RCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUNJLElBQUksQ0FBQ0MsSUFBSSxHQUFHLElBQUlDLGFBQUksQ0FBQ0osU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQ0UsT0FBTyxDQUFDO01BQzdEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUNJLElBQUksQ0FBQ0csRUFBRSxHQUFHTCxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzlCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUNJLElBQUksQ0FBQ00sSUFBSSxHQUFHTixTQUFTLENBQUMs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