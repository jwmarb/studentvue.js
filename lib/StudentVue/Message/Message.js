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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL01lc3NhZ2UvTWVzc2FnZS50cyJdLCJuYW1lcyI6WyJNZXNzYWdlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwieG1sT2JqZWN0IiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiaWNvbiIsIkljb24iLCJpZCIsInR5cGUiLCJiZWdpbkRhdGUiLCJodG1sQ29udGVudCIsImF0b2IiLCJyZWFkIiwiSlNPTiIsInBhcnNlIiwiZGVsZXRhYmxlIiwiZnJvbSIsIm5hbWUiLCJzdGFmZkd1Iiwic21Nc2dQZXJzb25HdSIsImVtYWlsIiwibW9kdWxlIiwic3ViamVjdCIsImh0bWwiLCJyYXciLCJhdHRhY2htZW50cyIsIkF0dGFjaG1lbnREYXRhcyIsIkF0dGFjaG1lbnREYXRhIiwibWFwIiwiZGF0YSIsIkF0dGFjaG1lbnQiLCJpc1JlYWQiLCJpc0RlbGV0YWJsZSIsInNldFJlYWQiLCJzZXREZWxldGFibGUiLCJtYXJrQXNSZWFkIiwiUHJvbWlzZSIsInJlcyIsInJlaiIsInByb2Nlc3NSZXF1ZXN0IiwibWV0aG9kTmFtZSIsInBhcmFtU3RyIiwiY2hpbGRJbnRJZCIsIk1lc3NhZ2VMaXN0aW5nIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1lLFFBQU1BLE9BQU4sU0FBc0JDLGNBQUtDLE1BQTNCLENBQWtDO0FBd0IvQ0MsSUFBQUEsV0FBVyxDQUNUQyxTQURTLEVBRVRDLFdBRlMsRUFHVEMsT0FIUyxFQUlUO0FBQ0EsWUFBTUQsV0FBTjtBQUNBLFdBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFdBQUtDLElBQUwsR0FBWSxJQUFJQyxhQUFKLENBQVNKLFNBQVMsQ0FBQyxXQUFELENBQVQsQ0FBdUIsQ0FBdkIsQ0FBVCxFQUFvQyxLQUFLRSxPQUF6QyxDQUFaO0FBQ0EsV0FBS0csRUFBTCxHQUFVTCxTQUFTLENBQUMsTUFBRCxDQUFULENBQWtCLENBQWxCLENBQVY7QUFDQSxXQUFLTSxJQUFMLEdBQVlOLFNBQVMsQ0FBQyxRQUFELENBQVQsQ0FBb0IsQ0FBcEIsQ0FBWjtBQUNBLFdBQUtPLFNBQUwsR0FBaUJQLFNBQVMsQ0FBQyxhQUFELENBQVQsQ0FBeUIsQ0FBekIsQ0FBakI7QUFDQSxXQUFLUSxXQUFMLEdBQW1CQyxJQUFJLENBQUNULFNBQVMsQ0FBQyxXQUFELENBQVQsQ0FBdUIsQ0FBdkIsQ0FBRCxDQUF2QjtBQUNBLFdBQUtVLElBQUwsR0FBWUMsSUFBSSxDQUFDQyxLQUFMLENBQVdaLFNBQVMsQ0FBQyxRQUFELENBQVQsQ0FBb0IsQ0FBcEIsQ0FBWCxDQUFaO0FBQ0EsV0FBS2EsU0FBTCxHQUFpQkYsSUFBSSxDQUFDQyxLQUFMLENBQVdaLFNBQVMsQ0FBQyxhQUFELENBQVQsQ0FBeUIsQ0FBekIsQ0FBWCxDQUFqQjtBQUNBLFdBQUtjLElBQUwsR0FBWTtBQUNWQyxRQUFBQSxJQUFJLEVBQUVmLFNBQVMsQ0FBQyxRQUFELENBQVQsQ0FBb0IsQ0FBcEIsQ0FESTtBQUVWZ0IsUUFBQUEsT0FBTyxFQUFFaEIsU0FBUyxDQUFDLFdBQUQsQ0FBVCxDQUF1QixDQUF2QixDQUZDO0FBR1ZpQixRQUFBQSxhQUFhLEVBQUVqQixTQUFTLENBQUMsaUJBQUQsQ0FBVCxDQUE2QixDQUE3QixDQUhMO0FBSVZrQixRQUFBQSxLQUFLLEVBQUVsQixTQUFTLENBQUMsU0FBRCxDQUFULENBQXFCLENBQXJCO0FBSkcsT0FBWjtBQU1BLFdBQUttQixNQUFMLEdBQWNuQixTQUFTLENBQUMsVUFBRCxDQUFULENBQXNCLENBQXRCLENBQWQ7QUFDQSxXQUFLb0IsT0FBTCxHQUFlO0FBQ2JDLFFBQUFBLElBQUksRUFBRXJCLFNBQVMsQ0FBQyxXQUFELENBQVQsQ0FBdUIsQ0FBdkIsQ0FETztBQUVic0IsUUFBQUEsR0FBRyxFQUFFdEIsU0FBUyxDQUFDLGlCQUFELENBQVQsQ0FBNkIsQ0FBN0I7QUFGUSxPQUFmO0FBSUEsV0FBS3VCLFdBQUwsR0FDRSxPQUFPdkIsU0FBUyxDQUFDd0IsZUFBVixDQUEwQixDQUExQixDQUFQLEtBQXdDLFFBQXhDLEdBQ0l4QixTQUFTLENBQUN3QixlQUFWLENBQTBCLENBQTFCLEVBQTZCQyxjQUE3QixDQUE0Q0MsR0FBNUMsQ0FDR0MsSUFBRDtBQUFBLGVBQVUsSUFBSUMsbUJBQUosQ0FBZUQsSUFBSSxDQUFDLGtCQUFELENBQUosQ0FBeUIsQ0FBekIsQ0FBZixFQUE0Q0EsSUFBSSxDQUFDLGtCQUFELENBQUosQ0FBeUIsQ0FBekIsQ0FBNUMsRUFBeUUxQixXQUF6RSxDQUFWO0FBQUEsT0FERixDQURKLEdBSUksRUFMTjtBQU1EO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztBQUNTNEIsSUFBQUEsTUFBTSxHQUFZO0FBQ3ZCLGFBQU8sS0FBS25CLElBQVo7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7QUFDU29CLElBQUFBLFdBQVcsR0FBWTtBQUM1QixhQUFPLEtBQUtqQixTQUFaO0FBQ0Q7O0FBRU9rQixJQUFBQSxPQUFPLENBQUNyQixJQUFELEVBQWdCO0FBQzdCLFdBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUNEOztBQUVPc0IsSUFBQUEsWUFBWSxDQUFDbkIsU0FBRCxFQUFxQjtBQUN2QyxXQUFLQSxTQUFMLEdBQWlCQSxTQUFqQjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNTb0IsSUFBQUEsVUFBVSxHQUFrQjtBQUNqQyxhQUFPLElBQUlDLE9BQUosQ0FBa0IsT0FBT0MsR0FBUCxFQUFZQyxHQUFaLEtBQW9CO0FBQzNDLFlBQUksS0FBSzFCLElBQVQ7QUFBZSxpQkFBT3lCLEdBQUcsQ0FBQyxJQUFELENBQVY7QUFBZjs7QUFDQSxZQUFJO0FBQ0YsZ0JBQU0sTUFBTUUsY0FBTixDQUFxQjtBQUN6QkMsWUFBQUEsVUFBVSxFQUFFLGtCQURhO0FBRXpCQyxZQUFBQSxRQUFRLEVBQUU7QUFDUkMsY0FBQUEsVUFBVSxFQUFFLENBREo7QUFFUkMsY0FBQUEsY0FBYyxFQUFFO0FBQ2QsK0JBQWUsMkNBREQ7QUFFZCwrQkFBZSxrQ0FGRDtBQUdkLHdCQUFRLEtBQUtwQyxFQUhDO0FBSWQsMEJBQVUsS0FBS0MsSUFKRDtBQUtkLGdDQUFnQjtBQUxGO0FBRlI7QUFGZSxXQUFyQixDQUFOO0FBYUEsZUFBS3lCLE9BQUwsQ0FBYSxJQUFiO0FBRUFJLFVBQUFBLEdBQUcsQ0FBQyxJQUFELENBQUg7QUFDRCxTQWpCRCxDQWlCRSxPQUFPTyxDQUFQLEVBQVU7QUFDVk4sVUFBQUEsR0FBRyxDQUFDTSxDQUFELENBQUg7QUFDRDtBQUNGLE9BdEJNLENBQVA7QUF1QkQ7O0FBM0k4QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XHJcbmltcG9ydCBBdHRhY2htZW50IGZyb20gJy4uL0F0dGFjaG1lbnQvQXR0YWNobWVudCc7XHJcbmltcG9ydCB7IE1lc3NhZ2VYTUxPYmplY3QgfSBmcm9tICcuL01lc3NhZ2UueG1sJztcclxuaW1wb3J0IEljb24gZnJvbSAnLi4vSWNvbi9JY29uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2UgZXh0ZW5kcyBzb2FwLkNsaWVudCB7XHJcbiAgcHJpdmF0ZSBob3N0VXJsOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBpY29uOiBJY29uO1xyXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBiZWdpbkRhdGU7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGh0bWxDb250ZW50OiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSByZWFkOiBib29sZWFuO1xyXG4gIHByaXZhdGUgZGVsZXRhYmxlOiBib29sZWFuO1xyXG4gIHB1YmxpYyByZWFkb25seSBmcm9tOiB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzdGFmZkd1OiBzdHJpbmc7XHJcbiAgICBlbWFpbDogc3RyaW5nO1xyXG4gICAgc21Nc2dQZXJzb25HdTogc3RyaW5nO1xyXG4gIH07XHJcbiAgcHVibGljIHJlYWRvbmx5IG1vZHVsZTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBzdWJqZWN0OiB7XHJcbiAgICBodG1sOiBzdHJpbmc7XHJcbiAgICByYXc6IHN0cmluZztcclxuICB9O1xyXG4gIHB1YmxpYyByZWFkb25seSBhdHRhY2htZW50czogQXR0YWNobWVudFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHhtbE9iamVjdDogTWVzc2FnZVhNTE9iamVjdFsnUFhQTWVzc2FnZXNEYXRhJ11bMF1bJ01lc3NhZ2VMaXN0aW5ncyddWzBdWydNZXNzYWdlTGlzdGluZyddWzBdLFxyXG4gICAgY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsXHJcbiAgICBob3N0VXJsOiBzdHJpbmdcclxuICApIHtcclxuICAgIHN1cGVyKGNyZWRlbnRpYWxzKTtcclxuICAgIHRoaXMuaG9zdFVybCA9IGhvc3RVcmw7XHJcbiAgICB0aGlzLmljb24gPSBuZXcgSWNvbih4bWxPYmplY3RbJ0BfSWNvblVSTCddWzBdLCB0aGlzLmhvc3RVcmwpO1xyXG4gICAgdGhpcy5pZCA9IHhtbE9iamVjdFsnQF9JRCddWzBdO1xyXG4gICAgdGhpcy50eXBlID0geG1sT2JqZWN0WydAX1R5cGUnXVswXTtcclxuICAgIHRoaXMuYmVnaW5EYXRlID0geG1sT2JqZWN0WydAX0JlZ2luRGF0ZSddWzBdO1xyXG4gICAgdGhpcy5odG1sQ29udGVudCA9IGF0b2IoeG1sT2JqZWN0WydAX0NvbnRlbnQnXVswXSk7XHJcbiAgICB0aGlzLnJlYWQgPSBKU09OLnBhcnNlKHhtbE9iamVjdFsnQF9SZWFkJ11bMF0pO1xyXG4gICAgdGhpcy5kZWxldGFibGUgPSBKU09OLnBhcnNlKHhtbE9iamVjdFsnQF9EZWxldGFibGUnXVswXSk7XHJcbiAgICB0aGlzLmZyb20gPSB7XHJcbiAgICAgIG5hbWU6IHhtbE9iamVjdFsnQF9Gcm9tJ11bMF0sXHJcbiAgICAgIHN0YWZmR3U6IHhtbE9iamVjdFsnQF9TdGFmZkdVJ11bMF0sXHJcbiAgICAgIHNtTXNnUGVyc29uR3U6IHhtbE9iamVjdFsnQF9TTU1zZ1BlcnNvbkdVJ11bMF0sXHJcbiAgICAgIGVtYWlsOiB4bWxPYmplY3RbJ0BfRW1haWwnXVswXSxcclxuICAgIH07XHJcbiAgICB0aGlzLm1vZHVsZSA9IHhtbE9iamVjdFsnQF9Nb2R1bGUnXVswXTtcclxuICAgIHRoaXMuc3ViamVjdCA9IHtcclxuICAgICAgaHRtbDogeG1sT2JqZWN0WydAX1N1YmplY3QnXVswXSxcclxuICAgICAgcmF3OiB4bWxPYmplY3RbJ0BfU3ViamVjdE5vSFRNTCddWzBdLFxyXG4gICAgfTtcclxuICAgIHRoaXMuYXR0YWNobWVudHMgPVxyXG4gICAgICB0eXBlb2YgeG1sT2JqZWN0LkF0dGFjaG1lbnREYXRhc1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICA/IHhtbE9iamVjdC5BdHRhY2htZW50RGF0YXNbMF0uQXR0YWNobWVudERhdGEubWFwKFxyXG4gICAgICAgICAgICAoZGF0YSkgPT4gbmV3IEF0dGFjaG1lbnQoZGF0YVsnQF9BdHRhY2htZW50TmFtZSddWzBdLCBkYXRhWydAX1NtQXR0YWNobWVudEdVJ11bMF0sIGNyZWRlbnRpYWxzKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIDogW107XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhIG1lc3NhZ2UgaGFzIGJlZW4gcmVhZFxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBib29sZWFuIGRlY2xhcmluZyB3aGV0aGVyIG9yIG5vdCB0aGUgbWVzc2FnZSBoYXMgYmVlbiBwcmV2aW91c2x5IHJlYWRcclxuICAgKi9cclxuICBwdWJsaWMgaXNSZWFkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIGEgbWVzc2FnZSBpcyBkZWxldGFibGVcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgYm9vbGVhbiBkZWNsYXJpbmcgd2hldGhlciBvciBub3QgdGhlIG1lc3NhZ2UgaXMgZGVsZXRhYmxlXHJcbiAgICovXHJcbiAgcHVibGljIGlzRGVsZXRhYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZGVsZXRhYmxlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRSZWFkKHJlYWQ6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMucmVhZCA9IHJlYWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldERlbGV0YWJsZShkZWxldGFibGU6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuZGVsZXRhYmxlID0gZGVsZXRhYmxlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFya3MgdGhlIG1lc3NhZ2UgYXMgcmVhZFxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgdHJ1ZSB0byBzaG93IHRoYXQgaXQgaGFzIGJlZW4gbWFya2VkIGFzIHJlYWRcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTtcclxuICAgKiBtZXNzYWdlcy5ldmVyeSgobXNnKSA9PiBtc2cuaXNSZWFkKCkpIC8vIC0+IGZhbHNlXHJcbiAgICogbWVzc2FnZXMuZm9yRWFjaChhc3luYyAobXNnKSA9PiAhbXNnLmlzUmVhZCgpICYmIGF3YWl0IG1zZy5tYXJrQXNSZWFkKCkpO1xyXG4gICAqIG1lc3NhZ2VzLmV2ZXJ5KChtc2cpID0+IG1zZy5pc1JlYWQoKSkgLy8gLT4gdHJ1ZVxyXG4gICAqIGNvbnN0IHJlZmV0Y2hlZE1lc3NhZ2VzID0gYXdhaXQgY2xpZW50Lm1lc3NhZ2VzKCk7IC8vIFNlZSBpZiBpdCB1cGRhdGVkIG9uIHRoZSBzZXJ2ZXJcclxuICAgKiBtZXNzYWdlcy5ldmVyeSgobXNnKSA9PiBtc2cuaXNSZWFkKCkpIC8vIC0+IHRydWVcclxuICAgKiBgYGBcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYHRzeFxyXG4gICAqIC8vIEluIGEgUmVhY3QgcHJvamVjdC4uLlxyXG4gICAqIGltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbiAgICpcclxuICAgKiBjb25zdCBNZXNzYWdlID0gKHByb3BzKSA9PiB7XHJcbiAgICogIGNvbnN0IHsgbWVzc2FnZSB9ID0gcHJvcHM7XHJcbiAgICpcclxuICAgKiAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlT25DbGljaygpIHtcclxuICAgKiAgICBhd2FpdCBtZXNzYWdlLm1hcmtBc1JlYWQoKTtcclxuICAgKiAgfVxyXG4gICAqXHJcbiAgICogIHJldHVybiAoXHJcbiAgICogICAgPGJ1dHRvbiBvbkNsaWNrPXtoYW5kbGVPbkNsaWNrfSBzdHlsZT17eyBjb2xvcjogbWVzc2FnZS5pc1JlYWQoKSA/IHVuZGVmaW5lZCA6ICdyZWQnIH19PlxyXG4gICAqICAgICAgPHA+e21lc3NhZ2Uuc3ViamVjdC5yYXd9PC9wPlxyXG4gICAqICAgIDwvYnV0dG9uPlxyXG4gICAqICApXHJcbiAgICogfVxyXG4gICAqXHJcbiAgICogZXhwb3J0IGRlZmF1bHQgTWVzc2FnZTtcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgbWFya0FzUmVhZCgpOiBQcm9taXNlPHRydWU+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTx0cnVlPihhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgaWYgKHRoaXMucmVhZCkgcmV0dXJuIHJlcyh0cnVlKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBzdXBlci5wcm9jZXNzUmVxdWVzdCh7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnVXBkYXRlUFhQTWVzc2FnZScsXHJcbiAgICAgICAgICBwYXJhbVN0cjoge1xyXG4gICAgICAgICAgICBjaGlsZEludElkOiAwLFxyXG4gICAgICAgICAgICBNZXNzYWdlTGlzdGluZzoge1xyXG4gICAgICAgICAgICAgICdAX3htbG5zOnhzaSc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZScsXHJcbiAgICAgICAgICAgICAgJ0BfeG1sbnM6eHNkJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJyxcclxuICAgICAgICAgICAgICAnQF9JRCc6IHRoaXMuaWQsXHJcbiAgICAgICAgICAgICAgJ0BfVHlwZSc6IHRoaXMudHlwZSxcclxuICAgICAgICAgICAgICAnQF9NYXJrQXNSZWFkJzogJ3RydWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNldFJlYWQodHJ1ZSk7XHJcblxyXG4gICAgICAgIHJlcyh0cnVlKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlaihlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==