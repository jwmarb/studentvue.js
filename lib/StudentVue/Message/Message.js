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

  class Message extends _soap.default.Client {
    constructor(xmlObject, credentials, hostUrl) {
      console.log(xmlObject);
      super(credentials);
      this.hostUrl = hostUrl;
      this.icon = new _Icon.default(xmlObject['@_IconURL'][0], this.hostUrl);
      this.id = xmlObject['@_ID'][0];
      this.type = xmlObject['@_Type'][0];
      this.beginDate = xmlObject['@_BeginDate'][0];
      this.htmlContent = atob(xmlObject['@_Content'][0]);
      this.read = JSON.parse(xmlObject['@_Read'][0]);
      this.deletable = JSON.parse(xmlObject['@_Deletable'][0]);
      this.from = {
        name: xmlObject['@_From'][0],
        staffGu: xmlObject['@_StaffGU'][0],
        smMsgPersonGu: xmlObject['@_SMMsgPersonGU'][0],
        email: xmlObject['@_Email'][0]
      };
      this.module = xmlObject['@_Module'][0];
      this.subject = {
        html: xmlObject['@_Subject'][0],
        raw: xmlObject['@_SubjectNoHTML'][0]
      };
      this.attachments = typeof xmlObject.AttachmentDatas[0] !== 'string' ? xmlObject.AttachmentDatas[0].AttachmentData.map(data => {
        return new _Attachment.default(data['@_AttachmentName'][0], data['@_SmAttachmentGU'][0], credentials);
      }) : [];
    }
    /**
     * Check if a message has been read
     * @returns Returns a boolean declaring whether or not the message has been previously read
     */


    isRead() {
      return this.read;
    }
    /**
     * Check if a message is deletable
     * @returns Returns a boolean declaring whether or not the message is deletable
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
     * @example
     * ```js
     * const messages = await client.messages();
     * messages.every((msg) => msg.isRead()) // -> false
     * messages.forEach(async (msg) => !msg.isRead() && await msg.markAsRead());
     * messages.every((msg) => msg.isRead()) // -> true
     * const refetchedMessages = await client.messages(); // See if it updated on the server
     * messages.every((msg) => msg.isRead()) // -> true
     * ```
     * @example
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL01lc3NhZ2UvTWVzc2FnZS50cyJdLCJuYW1lcyI6WyJNZXNzYWdlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwieG1sT2JqZWN0IiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiY29uc29sZSIsImxvZyIsImljb24iLCJJY29uIiwiaWQiLCJ0eXBlIiwiYmVnaW5EYXRlIiwiaHRtbENvbnRlbnQiLCJhdG9iIiwicmVhZCIsIkpTT04iLCJwYXJzZSIsImRlbGV0YWJsZSIsImZyb20iLCJuYW1lIiwic3RhZmZHdSIsInNtTXNnUGVyc29uR3UiLCJlbWFpbCIsIm1vZHVsZSIsInN1YmplY3QiLCJodG1sIiwicmF3IiwiYXR0YWNobWVudHMiLCJBdHRhY2htZW50RGF0YXMiLCJBdHRhY2htZW50RGF0YSIsIm1hcCIsImRhdGEiLCJBdHRhY2htZW50IiwiaXNSZWFkIiwiaXNEZWxldGFibGUiLCJzZXRSZWFkIiwic2V0RGVsZXRhYmxlIiwibWFya0FzUmVhZCIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJwcm9jZXNzUmVxdWVzdCIsIm1ldGhvZE5hbWUiLCJwYXJhbVN0ciIsImNoaWxkSW50SWQiLCJNZXNzYWdlTGlzdGluZyIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNZSxRQUFNQSxPQUFOLFNBQXNCQyxjQUFLQyxNQUEzQixDQUFrQztBQXdCL0NDLElBQUFBLFdBQVcsQ0FDVEMsU0FEUyxFQUVUQyxXQUZTLEVBR1RDLE9BSFMsRUFJVDtBQUNBQyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUosU0FBWjtBQUNBLFlBQU1DLFdBQU47QUFDQSxXQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQSxXQUFLRyxJQUFMLEdBQVksSUFBSUMsYUFBSixDQUFTTixTQUFTLENBQUMsV0FBRCxDQUFULENBQXVCLENBQXZCLENBQVQsRUFBb0MsS0FBS0UsT0FBekMsQ0FBWjtBQUNBLFdB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Q0FBQyxJQUFELENBQVY7QUFBZjs7QUFDQSxZQUFJO0FBQ0YsZ0JBQU0sTUFBTUUsY0FBTixDQUFxQjtBQUN6QkMsWUFBQUEsVUFBVSxFQUFFLGtCQURhO0FBRXpCQyxZQUFBQSxRQUFRLEVBQUU7QUFDUkMsY0FBQUEsVUFBVSxFQUFFLENBREo7QUFFUkMsY0FBQUEsY0FBYyxFQUFFO0FBQ2QsK0JBQWUsMkNBREQ7QUFFZCwrQkFBZSxrQ0FGRDtBQUdkLHdCQUFRLEtBQUtwQyxFQUhDO0FBSWQsMEJBQVUsS0FBS0MsSUFKRDtBQUtkLGdDQUFnQjtBQUxGO0FBRlI7QUFGZSxXQUFyQixDQUFOO0FBYUEsZUFBS3lCLE9BQUwsQ0FBYSxJQUFiO0FBRUFJLFVBQUFBLEdBQUcsQ0FBQyxJQUFELENBQUg7QUFDRCxTQWpCRCxDQWlCRSxPQUFPTyxDQUFQLEVBQVU7QUFDVk4sVUFBQUEsR0FBRyxDQUFDTSxDQUFELENBQUg7QUFDRDtBQUNGLE9BdEJNLENBQVA7QUF1QkQ7O0FBNUk4QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XHJcbmltcG9ydCBBdHRhY2htZW50IGZyb20gJy4uL0F0dGFjaG1lbnQvQXR0YWNobWVudCc7XHJcbmltcG9ydCB7IE1lc3NhZ2VYTUxPYmplY3QgfSBmcm9tICcuL01lc3NhZ2UueG1sJztcclxuaW1wb3J0IEljb24gZnJvbSAnLi4vSWNvbi9JY29uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2UgZXh0ZW5kcyBzb2FwLkNsaWVudCB7XHJcbiAgcHJpdmF0ZSBob3N0VXJsOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBpY29uOiBJY29uO1xyXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBiZWdpbkRhdGU7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGh0bWxDb250ZW50OiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSByZWFkOiBib29sZWFuO1xyXG4gIHByaXZhdGUgZGVsZXRhYmxlOiBib29sZWFuO1xyXG4gIHB1YmxpYyByZWFkb25seSBmcm9tOiB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzdGFmZkd1OiBzdHJpbmc7XHJcbiAgICBlbWFpbDogc3RyaW5nO1xyXG4gICAgc21Nc2dQZXJzb25HdTogc3RyaW5nO1xyXG4gIH07XHJcbiAgcHVibGljIHJlYWRvbmx5IG1vZHVsZTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBzdWJqZWN0OiB7XHJcbiAgICBodG1sOiBzdHJpbmc7XHJcbiAgICByYXc6IHN0cmluZztcclxuICB9O1xyXG4gIHB1YmxpYyByZWFkb25seSBhdHRhY2htZW50czogQXR0YWNobWVudFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHhtbE9iamVjdDogTWVzc2FnZVhNTE9iamVjdFsnUFhQTWVzc2FnZXNEYXRhJ11bMF1bJ01lc3NhZ2VMaXN0aW5ncyddWzBdWydNZXNzYWdlTGlzdGluZyddWzBdLFxyXG4gICAgY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsXHJcbiAgICBob3N0VXJsOiBzdHJpbmdcclxuICApIHtcclxuICAgIGNvbnNvbGUubG9nKHhtbE9iamVjdCk7XHJcbiAgICBzdXBlcihjcmVkZW50aWFscyk7XHJcbiAgICB0aGlzLmhvc3RVcmwgPSBob3N0VXJsO1xyXG4gICAgdGhpcy5pY29uID0gbmV3IEljb24oeG1sT2JqZWN0WydAX0ljb25VUkwnXVswXSwgdGhpcy5ob3N0VXJsKTtcclxuICAgIHRoaXMuaWQgPSB4bWxPYmplY3RbJ0BfSUQnXVswXTtcclxuICAgIHRoaXMudHlwZSA9IHhtbE9iamVjdFsnQF9UeXBlJ11bMF07XHJcbiAgICB0aGlzLmJlZ2luRGF0ZSA9IHhtbE9iamVjdFsnQF9CZWdpbkRhdGUnXVswXTtcclxuICAgIHRoaXMuaHRtbENvbnRlbnQgPSBhdG9iKHhtbE9iamVjdFsnQF9Db250ZW50J11bMF0pO1xyXG4gICAgdGhpcy5yZWFkID0gSlNPTi5wYXJzZSh4bWxPYmplY3RbJ0BfUmVhZCddWzBdKTtcclxuICAgIHRoaXMuZGVsZXRhYmxlID0gSlNPTi5wYXJzZSh4bWxPYmplY3RbJ0BfRGVsZXRhYmxlJ11bMF0pO1xyXG4gICAgdGhpcy5mcm9tID0ge1xyXG4gICAgICBuYW1lOiB4bWxPYmplY3RbJ0BfRnJvbSddWzBdLFxyXG4gICAgICBzdGFmZkd1OiB4bWxPYmplY3RbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICBzbU1zZ1BlcnNvbkd1OiB4bWxPYmplY3RbJ0BfU01Nc2dQZXJzb25HVSddWzBdLFxyXG4gICAgICBlbWFpbDogeG1sT2JqZWN0WydAX0VtYWlsJ11bMF0sXHJcbiAgICB9O1xyXG4gICAgdGhpcy5tb2R1bGUgPSB4bWxPYmplY3RbJ0BfTW9kdWxlJ11bMF07XHJcbiAgICB0aGlzLnN1YmplY3QgPSB7XHJcbiAgICAgIGh0bWw6IHhtbE9iamVjdFsnQF9TdWJqZWN0J11bMF0sXHJcbiAgICAgIHJhdzogeG1sT2JqZWN0WydAX1N1YmplY3ROb0hUTUwnXVswXSxcclxuICAgIH07XHJcbiAgICB0aGlzLmF0dGFjaG1lbnRzID1cclxuICAgICAgdHlwZW9mIHhtbE9iamVjdC5BdHRhY2htZW50RGF0YXNbMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgPyB4bWxPYmplY3QuQXR0YWNobWVudERhdGFzWzBdLkF0dGFjaG1lbnREYXRhLm1hcChcclxuICAgICAgICAgICAgKGRhdGEpID0+IG5ldyBBdHRhY2htZW50KGRhdGFbJ0BfQXR0YWNobWVudE5hbWUnXVswXSwgZGF0YVsnQF9TbUF0dGFjaG1lbnRHVSddWzBdLCBjcmVkZW50aWFscylcclxuICAgICAgICAgIClcclxuICAgICAgICA6IFtdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaWYgYSBtZXNzYWdlIGhhcyBiZWVuIHJlYWRcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgYm9vbGVhbiBkZWNsYXJpbmcgd2hldGhlciBvciBub3QgdGhlIG1lc3NhZ2UgaGFzIGJlZW4gcHJldmlvdXNseSByZWFkXHJcbiAgICovXHJcbiAgcHVibGljIGlzUmVhZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhIG1lc3NhZ2UgaXMgZGVsZXRhYmxlXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIGJvb2xlYW4gZGVjbGFyaW5nIHdoZXRoZXIgb3Igbm90IHRoZSBtZXNzYWdlIGlzIGRlbGV0YWJsZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBpc0RlbGV0YWJsZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmRlbGV0YWJsZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0UmVhZChyZWFkOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLnJlYWQgPSByZWFkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXREZWxldGFibGUoZGVsZXRhYmxlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLmRlbGV0YWJsZSA9IGRlbGV0YWJsZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1hcmtzIHRoZSBtZXNzYWdlIGFzIHJlYWRcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIHRydWUgdG8gc2hvdyB0aGF0IGl0IGhhcyBiZWVuIG1hcmtlZCBhcyByZWFkXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgY2xpZW50Lm1lc3NhZ2VzKCk7XHJcbiAgICogbWVzc2FnZXMuZXZlcnkoKG1zZykgPT4gbXNnLmlzUmVhZCgpKSAvLyAtPiBmYWxzZVxyXG4gICAqIG1lc3NhZ2VzLmZvckVhY2goYXN5bmMgKG1zZykgPT4gIW1zZy5pc1JlYWQoKSAmJiBhd2FpdCBtc2cubWFya0FzUmVhZCgpKTtcclxuICAgKiBtZXNzYWdlcy5ldmVyeSgobXNnKSA9PiBtc2cuaXNSZWFkKCkpIC8vIC0+IHRydWVcclxuICAgKiBjb25zdCByZWZldGNoZWRNZXNzYWdlcyA9IGF3YWl0IGNsaWVudC5tZXNzYWdlcygpOyAvLyBTZWUgaWYgaXQgdXBkYXRlZCBvbiB0aGUgc2VydmVyXHJcbiAgICogbWVzc2FnZXMuZXZlcnkoKG1zZykgPT4gbXNnLmlzUmVhZCgpKSAvLyAtPiB0cnVlXHJcbiAgICogYGBgXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBgYGB0c3hcclxuICAgKiAvLyBJbiBhIFJlYWN0IHByb2plY3QuLi5cclxuICAgKiBpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG4gICAqXHJcbiAgICogY29uc3QgTWVzc2FnZSA9IChwcm9wcykgPT4ge1xyXG4gICAqICBjb25zdCB7IG1lc3NhZ2UgfSA9IHByb3BzO1xyXG4gICAqXHJcbiAgICogIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZU9uQ2xpY2soKSB7XHJcbiAgICogICAgYXdhaXQgbWVzc2FnZS5tYXJrQXNSZWFkKCk7XHJcbiAgICogIH1cclxuICAgKlxyXG4gICAqICByZXR1cm4gKFxyXG4gICAqICAgIDxidXR0b24gb25DbGljaz17aGFuZGxlT25DbGlja30gc3R5bGU9e3sgY29sb3I6IG1lc3NhZ2UuaXNSZWFkKCkgPyB1bmRlZmluZWQgOiAncmVkJyB9fT5cclxuICAgKiAgICAgIDxwPnttZXNzYWdlLnN1YmplY3QucmF3fTwvcD5cclxuICAgKiAgICA8L2J1dHRvbj5cclxuICAgKiAgKVxyXG4gICAqIH1cclxuICAgKlxyXG4gICAqIGV4cG9ydCBkZWZhdWx0IE1lc3NhZ2U7XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIG1hcmtBc1JlYWQoKTogUHJvbWlzZTx0cnVlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dHJ1ZT4oYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnJlYWQpIHJldHVybiByZXModHJ1ZSk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgc3VwZXIucHJvY2Vzc1JlcXVlc3Qoe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1VwZGF0ZVBYUE1lc3NhZ2UnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHtcclxuICAgICAgICAgICAgY2hpbGRJbnRJZDogMCxcclxuICAgICAgICAgICAgTWVzc2FnZUxpc3Rpbmc6IHtcclxuICAgICAgICAgICAgICAnQF94bWxuczp4c2knOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnLFxyXG4gICAgICAgICAgICAgICdAX3htbG5zOnhzZCc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScsXHJcbiAgICAgICAgICAgICAgJ0BfSUQnOiB0aGlzLmlkLFxyXG4gICAgICAgICAgICAgICdAX1R5cGUnOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgICAgJ0BfTWFya0FzUmVhZCc6ICd0cnVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZXRSZWFkKHRydWUpO1xyXG5cclxuICAgICAgICByZXModHJ1ZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=