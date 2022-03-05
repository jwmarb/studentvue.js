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

      this.htmlContent = atob(xmlObject['@_Content'][0]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL01lc3NhZ2UvTWVzc2FnZS50cyJdLCJuYW1lcyI6WyJNZXNzYWdlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwieG1sT2JqZWN0IiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiaWNvbiIsIkljb24iLCJpZCIsInR5cGUiLCJiZWdpbkRhdGUiLCJEYXRlIiwiaHRtbENvbnRlbnQiLCJhdG9iIiwicmVhZCIsIkpTT04iLCJwYXJzZSIsImRlbGV0YWJsZSIsImZyb20iLCJuYW1lIiwic3RhZmZHdSIsInNtTXNnUGVyc29uR3UiLCJlbWFpbCIsIm1vZHVsZSIsInN1YmplY3QiLCJodG1sIiwicmF3IiwiYXR0YWNobWVudHMiLCJBdHRhY2htZW50RGF0YXMiLCJBdHRhY2htZW50RGF0YSIsIm1hcCIsImRhdGEiLCJBdHRhY2htZW50IiwiaXNSZWFkIiwiaXNEZWxldGFibGUiLCJzZXRSZWFkIiwic2V0RGVsZXRhYmxlIiwibWFya0FzUmVhZCIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJwcm9jZXNzUmVxdWVzdCIsIm1ldGhvZE5hbWUiLCJwYXJhbVN0ciIsImNoaWxkSW50SWQiLCJNZXNzYWdlTGlzdGluZyIsInRoZW4iLCJjYXRjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLFFBQU1BLE9BQU4sU0FBc0JDLGNBQUtDLE1BQTNCLENBQWtDO0FBaUMvQ0MsSUFBQUEsV0FBVyxDQUNUQyxTQURTLEVBRVRDLFdBRlMsRUFHVEMsT0FIUyxFQUlUO0FBQ0EsWUFBTUQsV0FBTjtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxXQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0ksV0FBS0MsSUFBTCxHQUFZLElBQUlDLGFBQUosQ0FBU0osU0FBUyxDQUFDLFdB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LEVBQWdCO0FBQzdCLFdBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUNEOztBQUVPc0IsSUFBQUEsWUFBWSxDQUFDbkIsU0FBRCxFQUFxQjtBQUN2QyxXQUFLQSxTQUFMLEdBQWlCQSxTQUFqQjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNTb0IsSUFBQUEsVUFBVSxHQUFrQjtBQUNqQyxhQUFPLElBQUlDLE9BQUosQ0FBa0IsQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEtBQWM7QUFDckMsWUFBSSxLQUFLMUIsSUFBVDtBQUFlLGlCQUFPeUIsR0FBRyxDQUFDLElBQUQsQ0FBVjtBQUFmOztBQUNBLGNBQ0dFLGNBREgsQ0FDa0I7QUFDZEMsVUFBQUEsVUFBVSxFQUFFLGtCQURFO0FBRWRDLFVBQUFBLFFBQVEsRUFBRTtBQUNSQyxZQUFBQSxVQUFVLEVBQUUsQ0FESjtBQUVSQyxZQUFBQSxjQUFjLEVBQUU7QUFDZCw2QkFBZSwyQ0FERDtBQUVkLDZCQUFlLGtDQUZEO0FBR2Qsc0JBQVEsS0FBS3JDLEVBSEM7QUFJZCx3QkFBVSxLQUFLQyxJQUpEO0FBS2QsOEJBQWdCO0FBTEY7QUFGUjtBQUZJLFNBRGxCLEVBY0dxQyxJQWRILENBY1EsTUFBTTtBQUNWLGVBQUtYLE9BQUwsQ0FBYSxJQUFiO0FBQ0FJLFVBQUFBLEdBQUcsQ0FBQyxJQUFELENBQUg7QUFDRCxTQWpCSCxFQWtCR1EsS0FsQkgsQ0FrQlNQLEdBbEJUO0FBbUJELE9BckJNLENBQVA7QUFzQkQ7O0FBL044QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XHJcbmltcG9ydCBBdHRhY2htZW50IGZyb20gJy4uL0F0dGFjaG1lbnQvQXR0YWNobWVudCc7XHJcbmltcG9ydCB7IE1lc3NhZ2VYTUxPYmplY3QgfSBmcm9tICcuL01lc3NhZ2UueG1sJztcclxuaW1wb3J0IEljb24gZnJvbSAnLi4vSWNvbi9JY29uJztcclxuXHJcbi8qKlxyXG4gKiBNZXNzYWdlIGNsYXNzXHJcbiAqIFRoaXMgaXMgb25seSByZXR1cm5lZCBhcyBhbiBhcnJheSBpbiBgQ2xpZW50Lm1lc3NhZ2VzKClgIG1ldGhvZFxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQGV4dGVuZHMge3NvYXAuQ2xpZW50fVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnZSBleHRlbmRzIHNvYXAuQ2xpZW50IHtcclxuICBwcml2YXRlIHJlYWRvbmx5IGhvc3RVcmw6IHN0cmluZztcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IGljb246IEljb247XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgYmVnaW5EYXRlOiBEYXRlO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgaHRtbENvbnRlbnQ6IHN0cmluZztcclxuXHJcbiAgcHJpdmF0ZSByZWFkOiBib29sZWFuO1xyXG5cclxuICBwcml2YXRlIGRlbGV0YWJsZTogYm9vbGVhbjtcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IGZyb206IHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHN0YWZmR3U6IHN0cmluZztcclxuICAgIGVtYWlsOiBzdHJpbmc7XHJcbiAgICBzbU1zZ1BlcnNvbkd1OiBzdHJpbmc7XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IG1vZHVsZTogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgc3ViamVjdDoge1xyXG4gICAgaHRtbDogc3RyaW5nO1xyXG4gICAgcmF3OiBzdHJpbmc7XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IGF0dGFjaG1lbnRzOiBBdHRhY2htZW50W107XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgeG1sT2JqZWN0OiBNZXNzYWdlWE1MT2JqZWN0WydQWFBNZXNzYWdlc0RhdGEnXVswXVsnTWVzc2FnZUxpc3RpbmdzJ11bMF1bJ01lc3NhZ2VMaXN0aW5nJ11bMF0sXHJcbiAgICBjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFscyxcclxuICAgIGhvc3RVcmw6IHN0cmluZ1xyXG4gICkge1xyXG4gICAgc3VwZXIoY3JlZGVudGlhbHMpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgVVJMIHRvIGNyZWF0ZSBQT1NUIGZldGNoIHJlcXVlc3RzIHRvIHN5bmVyZ3kgc2VydmVyc1xyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdGhpcy5ob3N0VXJsID0gaG9zdFVybDtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIG1lc3NhZ2UgaWNvblxyXG4gICAgICogQHR5cGUge0ljb259XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdGhpcy5pY29uID0gbmV3IEljb24oeG1sT2JqZWN0WydAX0ljb25VUkwnXVswXSwgdGhpcy5ob3N0VXJsKTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIElEIG9mIHRoZSBtZXNzYWdlXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuaWQgPSB4bWxPYmplY3RbJ0BfSUQnXVswXTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIG1lc3NhZ2VcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdGhpcy50eXBlID0geG1sT2JqZWN0WydAX1R5cGUnXVswXTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRhdGUgd2hlbiB0aGUgbWVzc2FnZSB3YXMgZmlyc3QgcG9zdGVkXHJcbiAgICAgKiBAdHlwZSB7RGF0ZX1cclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLmJlZ2luRGF0ZSA9IG5ldyBEYXRlKHhtbE9iamVjdFsnQF9CZWdpbkRhdGUnXVswXSk7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIG1lc3NhZ2VcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdGhpcy5odG1sQ29udGVudCA9IGF0b2IoeG1sT2JqZWN0WydAX0NvbnRlbnQnXVswXSk7XHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGhlIG1lc3NhZ2UgaGFzIGJlZW4gcmVhZCBvciBub3RcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgdGhpcy5yZWFkID0gSlNPTi5wYXJzZSh4bWxPYmplY3RbJ0BfUmVhZCddWzBdKTtcclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0aGUgbWVzc2FnZSBpcyBkZWxldGFibGUgb3Igbm90XHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuZGVsZXRhYmxlID0gSlNPTi5wYXJzZSh4bWxPYmplY3RbJ0BfRGVsZXRhYmxlJ11bMF0pO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgc2VuZGVyIG9mIHRoZSBtZXNzYWdlXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzZW5kZXJcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzdGFmZkd1IC0gdGhlIHN0YWZmR3Ugb2YgdGhlIHNlbmRlclxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsIG9mIHRoZSBzZW5kZXJcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzbU1zZ1BlcnNvbkd1IC0gVGhlIHNtTXNnUGVyc29uR3Ugb2YgdGhlIHNlbmRlci4gRG9uJ3Qga25vdyBpZiB0aGlzIHByb3BlcnR5IGhhcyBhIHJlYWwgdXNhZ2Ugb3Igbm90XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZnJvbSA9IHtcclxuICAgICAgbmFtZTogeG1sT2JqZWN0WydAX0Zyb20nXVswXSxcclxuICAgICAgc3RhZmZHdTogeG1sT2JqZWN0WydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgc21Nc2dQZXJzb25HdTogeG1sT2JqZWN0WydAX1NNTXNnUGVyc29uR1UnXVswXSxcclxuICAgICAgZW1haWw6IHhtbE9iamVjdFsnQF9FbWFpbCddWzBdLFxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIG1vZHVsZSBvZiB0aGUgc2VuZGVyXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHRoaXMubW9kdWxlID0geG1sT2JqZWN0WydAX01vZHVsZSddWzBdO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgc3ViamVjdCBvZiB0aGUgbWVzc2FnZVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGh0bWwgLSBUaGUgc3ViamVjdCBvZiB0aGUgbWVzc2FnZSB3aXRoIEhUTUxcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByYXcgLSBUaGUgc3ViamVjdCBvZiB0aGUgbWVzc2FnZSB3aXRob3V0IEhUTUwgYW5kIGZvcm1hdHRpbmdcclxuICAgICAqL1xyXG4gICAgdGhpcy5zdWJqZWN0ID0ge1xyXG4gICAgICBodG1sOiB4bWxPYmplY3RbJ0BfU3ViamVjdCddWzBdLFxyXG4gICAgICByYXc6IHhtbE9iamVjdFsnQF9TdWJqZWN0Tm9IVE1MJ11bMF0sXHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgYXR0YWNobWVudHMgaW5jbHVkZWQgaW4gdGhlIG1lc3NhZ2UsIGlmIHRoZXJlIGFyZSBhbnkuXHJcbiAgICAgKiBAdHlwZSB7QXR0YWNobWVudFtdfVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuYXR0YWNobWVudHMgPVxyXG4gICAgICB0eXBlb2YgeG1sT2JqZWN0LkF0dGFjaG1lbnREYXRhc1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICA/IHhtbE9iamVjdC5BdHRhY2htZW50RGF0YXNbMF0uQXR0YWNobWVudERhdGEubWFwKFxyXG4gICAgICAgICAgICAoZGF0YSkgPT4gbmV3IEF0dGFjaG1lbnQoZGF0YVsnQF9BdHRhY2htZW50TmFtZSddWzBdLCBkYXRhWydAX1NtQXR0YWNobWVudEdVJ11bMF0sIGNyZWRlbnRpYWxzKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIDogW107XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhIG1lc3NhZ2UgaGFzIGJlZW4gcmVhZFxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGEgYm9vbGVhbiBkZWNsYXJpbmcgd2hldGhlciBvciBub3QgdGhlIG1lc3NhZ2UgaGFzIGJlZW4gcHJldmlvdXNseSByZWFkXHJcbiAgICovXHJcbiAgcHVibGljIGlzUmVhZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhIG1lc3NhZ2UgaXMgZGVsZXRhYmxlXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYSBib29sZWFuIGRlY2xhcmluZyB3aGV0aGVyIG9yIG5vdCB0aGUgbWVzc2FnZSBpcyBkZWxldGFibGVcclxuICAgKi9cclxuICBwdWJsaWMgaXNEZWxldGFibGUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5kZWxldGFibGU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFJlYWQocmVhZDogYm9vbGVhbikge1xyXG4gICAgdGhpcy5yZWFkID0gcmVhZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0RGVsZXRhYmxlKGRlbGV0YWJsZTogYm9vbGVhbikge1xyXG4gICAgdGhpcy5kZWxldGFibGUgPSBkZWxldGFibGU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYXJrcyB0aGUgbWVzc2FnZSBhcyByZWFkXHJcbiAgICogQHJldHVybnMge3RydWV9IFJldHVybnMgdHJ1ZSB0byBzaG93IHRoYXQgaXQgaGFzIGJlZW4gbWFya2VkIGFzIHJlYWRcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgY2xpZW50Lm1lc3NhZ2VzKCk7XHJcbiAgICogbWVzc2FnZXMuZXZlcnkoKG1zZykgPT4gbXNnLmlzUmVhZCgpKSAvLyAtPiBmYWxzZVxyXG4gICAqIG1lc3NhZ2VzLmZvckVhY2goYXN5bmMgKG1zZykgPT4gIW1zZy5pc1JlYWQoKSAmJiBhd2FpdCBtc2cubWFya0FzUmVhZCgpKTtcclxuICAgKiBtZXNzYWdlcy5ldmVyeSgobXNnKSA9PiBtc2cuaXNSZWFkKCkpIC8vIC0+IHRydWVcclxuICAgKiBjb25zdCByZWZldGNoZWRNZXNzYWdlcyA9IGF3YWl0IGNsaWVudC5tZXNzYWdlcygpOyAvLyBTZWUgaWYgaXQgdXBkYXRlZCBvbiB0aGUgc2VydmVyXHJcbiAgICogbWVzc2FnZXMuZXZlcnkoKG1zZykgPT4gbXNnLmlzUmVhZCgpKSAvLyAtPiB0cnVlXHJcbiAgICogYGBgXHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBgdHN4XHJcbiAgICogLy8gSW4gYSBSZWFjdCBwcm9qZWN0Li4uXHJcbiAgICogaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuICAgKlxyXG4gICAqIGNvbnN0IE1lc3NhZ2UgPSAocHJvcHMpID0+IHtcclxuICAgKiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcclxuICAgKlxyXG4gICAqICBhc3luYyBmdW5jdGlvbiBoYW5kbGVPbkNsaWNrKCkge1xyXG4gICAqICAgIGF3YWl0IG1lc3NhZ2UubWFya0FzUmVhZCgpO1xyXG4gICAqICB9XHJcbiAgICpcclxuICAgKiAgcmV0dXJuIChcclxuICAgKiAgICA8YnV0dG9uIG9uQ2xpY2s9e2hhbmRsZU9uQ2xpY2t9IHN0eWxlPXt7IGNvbG9yOiBtZXNzYWdlLmlzUmVhZCgpID8gdW5kZWZpbmVkIDogJ3JlZCcgfX0+XHJcbiAgICogICAgICA8cD57bWVzc2FnZS5zdWJqZWN0LnJhd308L3A+XHJcbiAgICogICAgPC9idXR0b24+XHJcbiAgICogIClcclxuICAgKiB9XHJcbiAgICpcclxuICAgKiBleHBvcnQgZGVmYXVsdCBNZXNzYWdlO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBtYXJrQXNSZWFkKCk6IFByb21pc2U8dHJ1ZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHRydWU+KChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBpZiAodGhpcy5yZWFkKSByZXR1cm4gcmVzKHRydWUpO1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdCh7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnVXBkYXRlUFhQTWVzc2FnZScsXHJcbiAgICAgICAgICBwYXJhbVN0cjoge1xyXG4gICAgICAgICAgICBjaGlsZEludElkOiAwLFxyXG4gICAgICAgICAgICBNZXNzYWdlTGlzdGluZzoge1xyXG4gICAgICAgICAgICAgICdAX3htbG5zOnhzaSc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZScsXHJcbiAgICAgICAgICAgICAgJ0BfeG1sbnM6eHNkJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJyxcclxuICAgICAgICAgICAgICAnQF9JRCc6IHRoaXMuaWQsXHJcbiAgICAgICAgICAgICAgJ0BfVHlwZSc6IHRoaXMudHlwZSxcclxuICAgICAgICAgICAgICAnQF9NYXJrQXNSZWFkJzogJ3RydWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuc2V0UmVhZCh0cnVlKTtcclxuICAgICAgICAgIHJlcyh0cnVlKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==