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
      return new Promise(async (res, rej) => {
        if (this.read) {
          return res(true);
        }

        try {
          await super.processRequest({
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
          });
          this.setRead(true);
          res(true);
        } catch (e) {
          rej(e);
        }
      });
    }

  }

  _exports.default = Message;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL01lc3NhZ2UvTWVzc2FnZS50cyJdLCJuYW1lcyI6WyJNZXNzYWdlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwieG1sT2JqZWN0IiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiaWNvbiIsIkljb24iLCJpZCIsInR5cGUiLCJiZWdpbkRhdGUiLCJodG1sQ29udGVudCIsImF0b2IiLCJyZWFkIiwiSlNPTiIsInBhcnNlIiwiZGVsZXRhYmxlIiwiZnJvbSIsIm5hbWUiLCJzdGFmZkd1Iiwic21Nc2dQZXJzb25HdSIsImVtYWlsIiwibW9kdWxlIiwic3ViamVjdCIsImh0bWwiLCJyYXciLCJhdHRhY2htZW50cyIsIkF0dGFjaG1lbnREYXRhcyIsIkF0dGFjaG1lbnREYXRhIiwibWFwIiwiZGF0YSIsIkF0dGFjaG1lbnQiLCJpc1JlYWQiLCJpc0RlbGV0YWJsZSIsInNldFJlYWQiLCJzZXREZWxldGFibGUiLCJtYXJrQXNSZWFkIiwiUHJvbWlzZSIsInJlcyIsInJlaiIsInByb2Nlc3NSZXF1ZXN0IiwibWV0aG9kTmFtZSIsInBhcmFtU3RyIiwiY2hpbGRJbnRJZCIsIk1lc3NhZ2VMaXN0aW5nIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLFFBQU1BLE9BQU4sU0FBc0JDLGNBQUtDLE1BQTNCLENBQWtDO0FBaUMvQ0MsSUFBQUEsV0FBVyxDQUNUQyxTQURTLEVBRVRDLFdBRlMsRUFHVEMsT0FIUyxFQUlUO0FBQ0EsWUFBTUQsV0FBTjtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBQ0ksV0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxXQUFLQyxJQUFMLEdBQVksSUFBSUMsYUFBSixDQUFTSixTQUFTLENBQUMsV0FBRCxDQUFULENBQXVCLENBQXZCLENBQVQsRUFB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LFNBQWpCO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ1NvQixJQUFBQSxVQUFVLEdBQWtCO0FBQ2pDLGFBQU8sSUFBSUMsT0FBSixDQUFrQixPQUFPQyxHQUFQLEVBQVlDLEdBQVosS0FBb0I7QUFDM0MsWUFBSSxLQUFLMUIsSUFBVDtBQUFlLGlCQUFPeUIsR0FBRyxDQUFDLElBQUQsQ0FBVjtBQUFmOztBQUNBLFlBQUk7QUFDRixnQkFBTSxNQUFNRSxjQUFOLENBQXFCO0FBQ3pCQyxZQUFBQSxVQUFVLEVBQUUsa0JBRGE7QUFFekJDLFlBQUFBLFFBQVEsRUFBRTtBQUNSQyxjQUFBQSxVQUFVLEVBQUUsQ0FESjtBQUVSQyxjQUFBQSxjQUFjLEVBQUU7QUFDZCwrQkFBZSwyQ0FERDtBQUVkLCtCQUFlLGtDQUZEO0FBR2Qsd0JBQVEsS0FBS3BDLEVBSEM7QUFJZCwwQkFBVSxLQUFLQyxJQUpEO0FBS2QsZ0NBQWdCO0FBTEY7QUFGUjtBQUZlLFdBQXJCLENBQU47QUFhQSxlQUFLeUIsT0FBTCxDQUFhLElBQWI7QUFFQUksVUFBQUEsR0FBRyxDQUFDLElBQUQsQ0FBSDtBQUNELFNBakJELENBaUJFLE9BQU9PLENBQVAsRUFBVTtBQUNWTixVQUFBQSxHQUFHLENBQUNNLENBQUQsQ0FBSDtBQUNEO0FBQ0YsT0F0Qk0sQ0FBUDtBQXVCRDs7QUFwTjhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscyB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHNvYXAgZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9zb2FwJztcclxuaW1wb3J0IEF0dGFjaG1lbnQgZnJvbSAnLi4vQXR0YWNobWVudC9BdHRhY2htZW50JztcclxuaW1wb3J0IHsgTWVzc2FnZVhNTE9iamVjdCB9IGZyb20gJy4vTWVzc2FnZS54bWwnO1xyXG5pbXBvcnQgSWNvbiBmcm9tICcuLi9JY29uL0ljb24nO1xyXG5cclxuLyoqXHJcbiAqIE1lc3NhZ2UgY2xhc3NcclxuICogVGhpcyBpcyBvbmx5IHJldHVybmVkIGFzIGFuIGFycmF5IGluIGBDbGllbnQubWVzc2FnZXMoKWAgbWV0aG9kXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlIGV4dGVuZHMgc29hcC5DbGllbnQge1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgaG9zdFVybDogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgaWNvbjogSWNvbjtcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IGlkOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBiZWdpbkRhdGU7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBodG1sQ29udGVudDogc3RyaW5nO1xyXG5cclxuICBwcml2YXRlIHJlYWQ6IGJvb2xlYW47XHJcblxyXG4gIHByaXZhdGUgZGVsZXRhYmxlOiBib29sZWFuO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgZnJvbToge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgc3RhZmZHdTogc3RyaW5nO1xyXG4gICAgZW1haWw6IHN0cmluZztcclxuICAgIHNtTXNnUGVyc29uR3U6IHN0cmluZztcclxuICB9O1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgbW9kdWxlOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBzdWJqZWN0OiB7XHJcbiAgICBodG1sOiBzdHJpbmc7XHJcbiAgICByYXc6IHN0cmluZztcclxuICB9O1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgYXR0YWNobWVudHM6IEF0dGFjaG1lbnRbXTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB4bWxPYmplY3Q6IE1lc3NhZ2VYTUxPYmplY3RbJ1BYUE1lc3NhZ2VzRGF0YSddWzBdWydNZXNzYWdlTGlzdGluZ3MnXVswXVsnTWVzc2FnZUxpc3RpbmcnXVswXSxcclxuICAgIGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzLFxyXG4gICAgaG9zdFVybDogc3RyaW5nXHJcbiAgKSB7XHJcbiAgICBzdXBlcihjcmVkZW50aWFscyk7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBVUkwgdG8gY3JlYXRlIFBPU1QgZmV0Y2ggcmVxdWVzdHMgdG8gc3luZXJneSBzZXJ2ZXJzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuaG9zdFVybCA9IGhvc3RVcmw7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBtZXNzYWdlIGljb25cclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLmljb24gPSBuZXcgSWNvbih4bWxPYmplY3RbJ0BfSWNvblVSTCddWzBdLCB0aGlzLmhvc3RVcmwpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgSUQgb2YgdGhlIG1lc3NhZ2VcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLmlkID0geG1sT2JqZWN0WydAX0lEJ11bMF07XHJcbiAgICAvKipcclxuICAgICAqIFRoZSB0eXBlIG9mIHRoZSBtZXNzYWdlXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdGhpcy50eXBlID0geG1sT2JqZWN0WydAX1R5cGUnXVswXTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRhdGUgd2hlbiB0aGUgbWVzc2FnZSB3YXMgZmlyc3QgcG9zdGVkXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdGhpcy5iZWdpbkRhdGUgPSB4bWxPYmplY3RbJ0BfQmVnaW5EYXRlJ11bMF07XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIG1lc3NhZ2VcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB0aGlzLmh0bWxDb250ZW50ID0gYXRvYih4bWxPYmplY3RbJ0BfQ29udGVudCddWzBdKTtcclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0aGUgbWVzc2FnZSBoYXMgYmVlbiByZWFkIG9yIG5vdFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgdGhpcy5yZWFkID0gSlNPTi5wYXJzZSh4bWxPYmplY3RbJ0BfUmVhZCddWzBdKTtcclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0aGUgbWVzc2FnZSBpcyBkZWxldGFibGUgb3Igbm90XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICB0aGlzLmRlbGV0YWJsZSA9IEpTT04ucGFyc2UoeG1sT2JqZWN0WydAX0RlbGV0YWJsZSddWzBdKTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzZW5kZXJcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzdGFmZkd1IC0gdGhlIHN0YWZmR3Ugb2YgdGhlIHNlbmRlclxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsIG9mIHRoZSBzZW5kZXJcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzbU1zZ1BlcnNvbkd1IC0gVGhlIHNtTXNnUGVyc29uR3Ugb2YgdGhlIHNlbmRlci4gRG9uJ3Qga25vdyBpZiB0aGlzIHByb3BlcnR5IGhhcyBhIHJlYWwgdXNhZ2Ugb3Igbm90XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZnJvbSA9IHtcclxuICAgICAgbmFtZTogeG1sT2JqZWN0WydAX0Zyb20nXVswXSxcclxuICAgICAgc3RhZmZHdTogeG1sT2JqZWN0WydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgc21Nc2dQZXJzb25HdTogeG1sT2JqZWN0WydAX1NNTXNnUGVyc29uR1UnXVswXSxcclxuICAgICAgZW1haWw6IHhtbE9iamVjdFsnQF9FbWFpbCddWzBdLFxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIG1vZHVsZSBvZiB0aGUgc2VuZGVyXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdGhpcy5tb2R1bGUgPSB4bWxPYmplY3RbJ0BfTW9kdWxlJ11bMF07XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBzdWJqZWN0IG9mIHRoZSBtZXNzYWdlXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBodG1sIC0gVGhlIHN1YmplY3Qgb2YgdGhlIG1lc3NhZ2Ugd2l0aCBIVE1MXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gcmF3IC0gVGhlIHN1YmplY3Qgb2YgdGhlIG1lc3NhZ2Ugd2l0aG91dCBIVE1MIGFuZCBmb3JtYXR0aW5nXHJcbiAgICAgKi9cclxuICAgIHRoaXMuc3ViamVjdCA9IHtcclxuICAgICAgaHRtbDogeG1sT2JqZWN0WydAX1N1YmplY3QnXVswXSxcclxuICAgICAgcmF3OiB4bWxPYmplY3RbJ0BfU3ViamVjdE5vSFRNTCddWzBdLFxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIGF0dGFjaG1lbnRzIGluY2x1ZGVkIGluIHRoZSBtZXNzYWdlLCBpZiB0aGVyZSBhcmUgYW55LlxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuYXR0YWNobWVudHMgPVxyXG4gICAgICB0eXBlb2YgeG1sT2JqZWN0LkF0dGFjaG1lbnREYXRhc1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICA/IHhtbE9iamVjdC5BdHRhY2htZW50RGF0YXNbMF0uQXR0YWNobWVudERhdGEubWFwKFxyXG4gICAgICAgICAgICAoZGF0YSkgPT4gbmV3IEF0dGFjaG1lbnQoZGF0YVsnQF9BdHRhY2htZW50TmFtZSddWzBdLCBkYXRhWydAX1NtQXR0YWNobWVudEdVJ11bMF0sIGNyZWRlbnRpYWxzKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIDogW107XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhIG1lc3NhZ2UgaGFzIGJlZW4gcmVhZFxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGEgYm9vbGVhbiBkZWNsYXJpbmcgd2hldGhlciBvciBub3QgdGhlIG1lc3NhZ2UgaGFzIGJlZW4gcHJldmlvdXNseSByZWFkXHJcbiAgICovXHJcbiAgcHVibGljIGlzUmVhZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhIG1lc3NhZ2UgaXMgZGVsZXRhYmxlXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYSBib29sZWFuIGRlY2xhcmluZyB3aGV0aGVyIG9yIG5vdCB0aGUgbWVzc2FnZSBpcyBkZWxldGFibGVcclxuICAgKi9cclxuICBwdWJsaWMgaXNEZWxldGFibGUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5kZWxldGFibGU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFJlYWQocmVhZDogYm9vbGVhbikge1xyXG4gICAgdGhpcy5yZWFkID0gcmVhZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0RGVsZXRhYmxlKGRlbGV0YWJsZTogYm9vbGVhbikge1xyXG4gICAgdGhpcy5kZWxldGFibGUgPSBkZWxldGFibGU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYXJrcyB0aGUgbWVzc2FnZSBhcyByZWFkXHJcbiAgICogQHJldHVybnMgUmV0dXJucyB0cnVlIHRvIHNob3cgdGhhdCBpdCBoYXMgYmVlbiBtYXJrZWQgYXMgcmVhZFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTtcclxuICAgKiBtZXNzYWdlcy5ldmVyeSgobXNnKSA9PiBtc2cuaXNSZWFkKCkpIC8vIC0+IGZhbHNlXHJcbiAgICogbWVzc2FnZXMuZm9yRWFjaChhc3luYyAobXNnKSA9PiAhbXNnLmlzUmVhZCgpICYmIGF3YWl0IG1zZy5tYXJrQXNSZWFkKCkpO1xyXG4gICAqIG1lc3NhZ2VzLmV2ZXJ5KChtc2cpID0+IG1zZy5pc1JlYWQoKSkgLy8gLT4gdHJ1ZVxyXG4gICAqIGNvbnN0IHJlZmV0Y2hlZE1lc3NhZ2VzID0gYXdhaXQgY2xpZW50Lm1lc3NhZ2VzKCk7IC8vIFNlZSBpZiBpdCB1cGRhdGVkIG9uIHRoZSBzZXJ2ZXJcclxuICAgKiBtZXNzYWdlcy5ldmVyeSgobXNnKSA9PiBtc2cuaXNSZWFkKCkpIC8vIC0+IHRydWVcclxuICAgKiBgYGBcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGB0c3hcclxuICAgKiAvLyBJbiBhIFJlYWN0IHByb2plY3QuLi5cclxuICAgKiBpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG4gICAqXHJcbiAgICogY29uc3QgTWVzc2FnZSA9IChwcm9wcykgPT4ge1xyXG4gICAqICBjb25zdCB7IG1lc3NhZ2UgfSA9IHByb3BzO1xyXG4gICAqXHJcbiAgICogIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZU9uQ2xpY2soKSB7XHJcbiAgICogICAgYXdhaXQgbWVzc2FnZS5tYXJrQXNSZWFkKCk7XHJcbiAgICogIH1cclxuICAgKlxyXG4gICAqICByZXR1cm4gKFxyXG4gICAqICAgIDxidXR0b24gb25DbGljaz17aGFuZGxlT25DbGlja30gc3R5bGU9e3sgY29sb3I6IG1lc3NhZ2UuaXNSZWFkKCkgPyB1bmRlZmluZWQgOiAncmVkJyB9fT5cclxuICAgKiAgICAgIDxwPnttZXNzYWdlLnN1YmplY3QucmF3fTwvcD5cclxuICAgKiAgICA8L2J1dHRvbj5cclxuICAgKiAgKVxyXG4gICAqIH1cclxuICAgKlxyXG4gICAqIGV4cG9ydCBkZWZhdWx0IE1lc3NhZ2U7XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIG1hcmtBc1JlYWQoKTogUHJvbWlzZTx0cnVlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dHJ1ZT4oYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnJlYWQpIHJldHVybiByZXModHJ1ZSk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgc3VwZXIucHJvY2Vzc1JlcXVlc3Qoe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1VwZGF0ZVBYUE1lc3NhZ2UnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHtcclxuICAgICAgICAgICAgY2hpbGRJbnRJZDogMCxcclxuICAgICAgICAgICAgTWVzc2FnZUxpc3Rpbmc6IHtcclxuICAgICAgICAgICAgICAnQF94bWxuczp4c2knOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnLFxyXG4gICAgICAgICAgICAgICdAX3htbG5zOnhzZCc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScsXHJcbiAgICAgICAgICAgICAgJ0BfSUQnOiB0aGlzLmlkLFxyXG4gICAgICAgICAgICAgICdAX1R5cGUnOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgICAgJ0BfTWFya0FzUmVhZCc6ICd0cnVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZXRSZWFkKHRydWUpO1xyXG5cclxuICAgICAgICByZXModHJ1ZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=