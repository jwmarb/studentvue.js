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
       * @private
       * @readonly
       */

      this.hostUrl = hostUrl;
      /**
       * The message icon
       * @public
       * @readonly
       */

      this.icon = new _Icon.default(xmlObject['@_IconURL'][0], this.hostUrl);
      /**
       * The ID of the message
       * @public
       * @readonly
       */

      this.id = xmlObject['@_ID'][0];
      /**
       * The type of the message
       * @public
       * @readonly
       */

      this.type = xmlObject['@_Type'][0];
      /**
       * The date when the message was first posted
       * @public
       * @readonly
       */

      this.beginDate = xmlObject['@_BeginDate'][0];
      /**
       * The HTML content of the message
       * @public
       * @readonly
       */

      this.htmlContent = atob(xmlObject['@_Content'][0]);
      /**
       * Whether the message has been read or not
       * @private
       */

      this.read = JSON.parse(xmlObject['@_Read'][0]);
      /**
       * Whether the message is deletable or not
       * @private
       */

      this.deletable = JSON.parse(xmlObject['@_Deletable'][0]);
      /**
       * The sender of the message
       * @public
       * @readonly
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
       * @public
       * @readonly
       */

      this.module = xmlObject['@_Module'][0];
      /**
       * The subject of the message
       * @public
       * @readonly
       * @property {string} html - The subject of the message with HTML
       * @property {string} raw - The subject of the message without HTML and formatting
       */

      this.subject = {
        html: xmlObject['@_Subject'][0],
        raw: xmlObject['@_SubjectNoHTML'][0]
      };
      /**
       * The attachments included in the message, if there are any.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL01lc3NhZ2UvTWVzc2FnZS50cyJdLCJuYW1lcyI6WyJNZXNzYWdlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwieG1sT2JqZWN0IiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiaWNvbiIsIkljb24iLCJpZCIsInR5cGUiLCJiZWdpbkRhdGUiLCJodG1sQ29udGVudCIsImF0b2IiLCJyZWFkIiwiSlNPTiIsInBhcnNlIiwiZGVsZXRhYmxlIiwiZnJvbSIsIm5hbWUiLCJzdGFmZkd1Iiwic21Nc2dQZXJzb25HdSIsImVtYWlsIiwibW9kdWxlIiwic3ViamVjdCIsImh0bWwiLCJyYXciLCJhdHRhY2htZW50cyIsIkF0dGFjaG1lbnREYXRhcyIsIkF0dGFjaG1lbnREYXRhIiwibWFwIiwiZGF0YSIsIkF0dGFjaG1lbnQiLCJpc1JlYWQiLCJpc0RlbGV0YWJsZSIsInNldFJlYWQiLCJzZXREZWxldGFibGUiLCJtYXJrQXNSZWFkIiwiUHJvbWlzZSIsInJlcyIsInJlaiIsInByb2Nlc3NSZXF1ZXN0IiwibWV0aG9kTmFtZSIsInBhcmFtU3RyIiwiY2hpbGRJbnRJZCIsIk1lc3NhZ2VMaXN0aW5nIiwidGhlbiIsImNhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsUUFBTUEsT0FBTixTQUFzQkMsY0FBS0MsTUFBM0IsQ0FBa0M7QUFpQy9DQyxJQUFBQSxXQUFXLENBQ1RDLFNBRFMsRUFFVEMsV0FGUyxFQUdUQyxPQUhTLEVBSVQ7QUFDQSxZQUFNRCxXQUFOO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxXQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUNJLFdBQUtDLElBQUwsR0FBWSxJQUFJQyxhQUFKLENBQVNKLFNBQVMsQ0FBQyxXQUFELENBQVQsQ0FBdUIsQ0FB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U0FBTCxHQUFpQkEsU0FBakI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU29CLElBQUFBLFVBQVUsR0FBa0I7QUFDakMsYUFBTyxJQUFJQyxPQUFKLENBQWtCLENBQUNDLEdBQUQsRUFBTUMsR0FBTixLQUFjO0FBQ3JDLFlBQUksS0FBSzFCLElBQVQ7QUFBZSxpQkFBT3lCLEdBQUcsQ0FBQyxJQUFELENBQVY7QUFBZjs7QUFDQSxjQUNHRSxjQURILENBQ2tCO0FBQ2RDLFVBQUFBLFVBQVUsRUFBRSxrQkFERTtBQUVkQyxVQUFBQSxRQUFRLEVBQUU7QUFDUkMsWUFBQUEsVUFBVSxFQUFFLENBREo7QUFFUkMsWUFBQUEsY0FBYyxFQUFFO0FBQ2QsNkJBQWUsMkNBREQ7QUFFZCw2QkFBZSxrQ0FGRDtBQUdkLHNCQUFRLEtBQUtwQyxFQUhDO0FBSWQsd0JBQVUsS0FBS0MsSUFKRDtBQUtkLDhCQUFnQjtBQUxGO0FBRlI7QUFGSSxTQURsQixFQWNHb0MsSUFkSCxDQWNRLE1BQU07QUFDVixlQUFLWCxPQUFMLENBQWEsSUFBYjtBQUNBSSxVQUFBQSxHQUFHLENBQUMsSUFBRCxDQUFIO0FBQ0QsU0FqQkgsRUFrQkdRLEtBbEJILENBa0JTUCxHQWxCVDtBQW1CRCxPQXJCTSxDQUFQO0FBc0JEOztBQW5OOEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgc29hcCBmcm9tICcuLi8uLi91dGlscy9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgQXR0YWNobWVudCBmcm9tICcuLi9BdHRhY2htZW50L0F0dGFjaG1lbnQnO1xyXG5pbXBvcnQgeyBNZXNzYWdlWE1MT2JqZWN0IH0gZnJvbSAnLi9NZXNzYWdlLnhtbCc7XHJcbmltcG9ydCBJY29uIGZyb20gJy4uL0ljb24vSWNvbic7XHJcblxyXG4vKipcclxuICogTWVzc2FnZSBjbGFzc1xyXG4gKiBUaGlzIGlzIG9ubHkgcmV0dXJuZWQgYXMgYW4gYXJyYXkgaW4gYENsaWVudC5tZXNzYWdlcygpYCBtZXRob2RcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBleHRlbmRzIHtzb2FwLkNsaWVudH1cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2UgZXh0ZW5kcyBzb2FwLkNsaWVudCB7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBob3N0VXJsOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBpY29uOiBJY29uO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgaWQ6IHN0cmluZztcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IGJlZ2luRGF0ZTtcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IGh0bWxDb250ZW50OiBzdHJpbmc7XHJcblxyXG4gIHByaXZhdGUgcmVhZDogYm9vbGVhbjtcclxuXHJcbiAgcHJpdmF0ZSBkZWxldGFibGU6IGJvb2xlYW47XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBmcm9tOiB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzdGFmZkd1OiBzdHJpbmc7XHJcbiAgICBlbWFpbDogc3RyaW5nO1xyXG4gICAgc21Nc2dQZXJzb25HdTogc3RyaW5nO1xyXG4gIH07XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBtb2R1bGU6IHN0cmluZztcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IHN1YmplY3Q6IHtcclxuICAgIGh0bWw6IHN0cmluZztcclxuICAgIHJhdzogc3RyaW5nO1xyXG4gIH07XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBhdHRhY2htZW50czogQXR0YWNobWVudFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHhtbE9iamVjdDogTWVzc2FnZVhNTE9iamVjdFsnUFhQTWVzc2FnZXNEYXRhJ11bMF1bJ01lc3NhZ2VMaXN0aW5ncyddWzBdWydNZXNzYWdlTGlzdGluZyddWzBdLFxyXG4gICAgY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsXHJcbiAgICBob3N0VXJsOiBzdHJpbmdcclxuICApIHtcclxuICAgIHN1cGVyKGNyZWRlbnRpYWxzKTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIFVSTCB0byBjcmVhdGUgUE9TVCBmZXRjaCByZXF1ZXN0cyB0byBzeW5lcmd5IHNlcnZlcnNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdGhpcy5ob3N0VXJsID0gaG9zdFVybDtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIG1lc3NhZ2UgaWNvblxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuaWNvbiA9IG5ldyBJY29uKHhtbE9iamVjdFsnQF9JY29uVVJMJ11bMF0sIHRoaXMuaG9zdFVybCk7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBJRCBvZiB0aGUgbWVzc2FnZVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuaWQgPSB4bWxPYmplY3RbJ0BfSUQnXVswXTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIG1lc3NhZ2VcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLnR5cGUgPSB4bWxPYmplY3RbJ0BfVHlwZSddWzBdO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGF0ZSB3aGVuIHRoZSBtZXNzYWdlIHdhcyBmaXJzdCBwb3N0ZWRcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLmJlZ2luRGF0ZSA9IHhtbE9iamVjdFsnQF9CZWdpbkRhdGUnXVswXTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIEhUTUwgY29udGVudCBvZiB0aGUgbWVzc2FnZVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuaHRtbENvbnRlbnQgPSBhdG9iKHhtbE9iamVjdFsnQF9Db250ZW50J11bMF0pO1xyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRoZSBtZXNzYWdlIGhhcyBiZWVuIHJlYWQgb3Igbm90XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICB0aGlzLnJlYWQgPSBKU09OLnBhcnNlKHhtbE9iamVjdFsnQF9SZWFkJ11bMF0pO1xyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRoZSBtZXNzYWdlIGlzIGRlbGV0YWJsZSBvciBub3RcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuZGVsZXRhYmxlID0gSlNPTi5wYXJzZSh4bWxPYmplY3RbJ0BfRGVsZXRhYmxlJ11bMF0pO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgc2VuZGVyIG9mIHRoZSBtZXNzYWdlXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNlbmRlclxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHN0YWZmR3UgLSB0aGUgc3RhZmZHdSBvZiB0aGUgc2VuZGVyXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwgb2YgdGhlIHNlbmRlclxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHNtTXNnUGVyc29uR3UgLSBUaGUgc21Nc2dQZXJzb25HdSBvZiB0aGUgc2VuZGVyLiBEb24ndCBrbm93IGlmIHRoaXMgcHJvcGVydHkgaGFzIGEgcmVhbCB1c2FnZSBvciBub3RcclxuICAgICAqL1xyXG4gICAgdGhpcy5mcm9tID0ge1xyXG4gICAgICBuYW1lOiB4bWxPYmplY3RbJ0BfRnJvbSddWzBdLFxyXG4gICAgICBzdGFmZkd1OiB4bWxPYmplY3RbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICBzbU1zZ1BlcnNvbkd1OiB4bWxPYmplY3RbJ0BfU01Nc2dQZXJzb25HVSddWzBdLFxyXG4gICAgICBlbWFpbDogeG1sT2JqZWN0WydAX0VtYWlsJ11bMF0sXHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbW9kdWxlIG9mIHRoZSBzZW5kZXJcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLm1vZHVsZSA9IHhtbE9iamVjdFsnQF9Nb2R1bGUnXVswXTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIHN1YmplY3Qgb2YgdGhlIG1lc3NhZ2VcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGh0bWwgLSBUaGUgc3ViamVjdCBvZiB0aGUgbWVzc2FnZSB3aXRoIEhUTUxcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByYXcgLSBUaGUgc3ViamVjdCBvZiB0aGUgbWVzc2FnZSB3aXRob3V0IEhUTUwgYW5kIGZvcm1hdHRpbmdcclxuICAgICAqL1xyXG4gICAgdGhpcy5zdWJqZWN0ID0ge1xyXG4gICAgICBodG1sOiB4bWxPYmplY3RbJ0BfU3ViamVjdCddWzBdLFxyXG4gICAgICByYXc6IHhtbE9iamVjdFsnQF9TdWJqZWN0Tm9IVE1MJ11bMF0sXHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgYXR0YWNobWVudHMgaW5jbHVkZWQgaW4gdGhlIG1lc3NhZ2UsIGlmIHRoZXJlIGFyZSBhbnkuXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdGhpcy5hdHRhY2htZW50cyA9XHJcbiAgICAgIHR5cGVvZiB4bWxPYmplY3QuQXR0YWNobWVudERhdGFzWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgID8geG1sT2JqZWN0LkF0dGFjaG1lbnREYXRhc1swXS5BdHRhY2htZW50RGF0YS5tYXAoXHJcbiAgICAgICAgICAgIChkYXRhKSA9PiBuZXcgQXR0YWNobWVudChkYXRhWydAX0F0dGFjaG1lbnROYW1lJ11bMF0sIGRhdGFbJ0BfU21BdHRhY2htZW50R1UnXVswXSwgY3JlZGVudGlhbHMpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgOiBbXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIGEgbWVzc2FnZSBoYXMgYmVlbiByZWFkXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYSBib29sZWFuIGRlY2xhcmluZyB3aGV0aGVyIG9yIG5vdCB0aGUgbWVzc2FnZSBoYXMgYmVlbiBwcmV2aW91c2x5IHJlYWRcclxuICAgKi9cclxuICBwdWJsaWMgaXNSZWFkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIGEgbWVzc2FnZSBpcyBkZWxldGFibGVcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBhIGJvb2xlYW4gZGVjbGFyaW5nIHdoZXRoZXIgb3Igbm90IHRoZSBtZXNzYWdlIGlzIGRlbGV0YWJsZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBpc0RlbGV0YWJsZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmRlbGV0YWJsZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0UmVhZChyZWFkOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLnJlYWQgPSByZWFkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXREZWxldGFibGUoZGVsZXRhYmxlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLmRlbGV0YWJsZSA9IGRlbGV0YWJsZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1hcmtzIHRoZSBtZXNzYWdlIGFzIHJlYWRcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIHRydWUgdG8gc2hvdyB0aGF0IGl0IGhhcyBiZWVuIG1hcmtlZCBhcyByZWFkXHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGNsaWVudC5tZXNzYWdlcygpO1xyXG4gICAqIG1lc3NhZ2VzLmV2ZXJ5KChtc2cpID0+IG1zZy5pc1JlYWQoKSkgLy8gLT4gZmFsc2VcclxuICAgKiBtZXNzYWdlcy5mb3JFYWNoKGFzeW5jIChtc2cpID0+ICFtc2cuaXNSZWFkKCkgJiYgYXdhaXQgbXNnLm1hcmtBc1JlYWQoKSk7XHJcbiAgICogbWVzc2FnZXMuZXZlcnkoKG1zZykgPT4gbXNnLmlzUmVhZCgpKSAvLyAtPiB0cnVlXHJcbiAgICogY29uc3QgcmVmZXRjaGVkTWVzc2FnZXMgPSBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTsgLy8gU2VlIGlmIGl0IHVwZGF0ZWQgb24gdGhlIHNlcnZlclxyXG4gICAqIG1lc3NhZ2VzLmV2ZXJ5KChtc2cpID0+IG1zZy5pc1JlYWQoKSkgLy8gLT4gdHJ1ZVxyXG4gICAqIGBgYFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYHRzeFxyXG4gICAqIC8vIEluIGEgUmVhY3QgcHJvamVjdC4uLlxyXG4gICAqIGltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbiAgICpcclxuICAgKiBjb25zdCBNZXNzYWdlID0gKHByb3BzKSA9PiB7XHJcbiAgICogIGNvbnN0IHsgbWVzc2FnZSB9ID0gcHJvcHM7XHJcbiAgICpcclxuICAgKiAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlT25DbGljaygpIHtcclxuICAgKiAgICBhd2FpdCBtZXNzYWdlLm1hcmtBc1JlYWQoKTtcclxuICAgKiAgfVxyXG4gICAqXHJcbiAgICogIHJldHVybiAoXHJcbiAgICogICAgPGJ1dHRvbiBvbkNsaWNrPXtoYW5kbGVPbkNsaWNrfSBzdHlsZT17eyBjb2xvcjogbWVzc2FnZS5pc1JlYWQoKSA/IHVuZGVmaW5lZCA6ICdyZWQnIH19PlxyXG4gICAqICAgICAgPHA+e21lc3NhZ2Uuc3ViamVjdC5yYXd9PC9wPlxyXG4gICAqICAgIDwvYnV0dG9uPlxyXG4gICAqICApXHJcbiAgICogfVxyXG4gICAqXHJcbiAgICogZXhwb3J0IGRlZmF1bHQgTWVzc2FnZTtcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgbWFya0FzUmVhZCgpOiBQcm9taXNlPHRydWU+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTx0cnVlPigocmVzLCByZWopID0+IHtcclxuICAgICAgaWYgKHRoaXMucmVhZCkgcmV0dXJuIHJlcyh0cnVlKTtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Qoe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1VwZGF0ZVBYUE1lc3NhZ2UnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHtcclxuICAgICAgICAgICAgY2hpbGRJbnRJZDogMCxcclxuICAgICAgICAgICAgTWVzc2FnZUxpc3Rpbmc6IHtcclxuICAgICAgICAgICAgICAnQF94bWxuczp4c2knOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnLFxyXG4gICAgICAgICAgICAgICdAX3htbG5zOnhzZCc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScsXHJcbiAgICAgICAgICAgICAgJ0BfSUQnOiB0aGlzLmlkLFxyXG4gICAgICAgICAgICAgICdAX1R5cGUnOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgICAgJ0BfTWFya0FzUmVhZCc6ICd0cnVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnNldFJlYWQodHJ1ZSk7XHJcbiAgICAgICAgICByZXModHJ1ZSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=