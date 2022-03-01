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
      this.xmlObject = xmlObject;
      this.icon = new _Icon.default(xmlObject['@_IconURL'][0], this.hostUrl);
      this.id = xmlObject['@_ID'][0];
      this.type = xmlObject['@_Type'][0];
      this.beginDate = xmlObject['@_BeginDate'][0];
      this.htmlContent = xmlObject['@_Content'][0];
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
                '@_ID': this.xmlObject['@_ID'][0],
                '@_Type': this.xmlObject['@_Type'][0],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL01lc3NhZ2UvTWVzc2FnZS50cyJdLCJuYW1lcyI6WyJNZXNzYWdlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwieG1sT2JqZWN0IiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiaWNvbiIsIkljb24iLCJpZCIsInR5cGUiLCJiZWdpbkRhdGUiLCJodG1sQ29udGVudCIsInJlYWQiLCJKU09OIiwicGFyc2UiLCJkZWxldGFibGUiLCJmcm9tIiwibmFtZSIsInN0YWZmR3UiLCJzbU1zZ1BlcnNvbkd1IiwiZW1haWwiLCJtb2R1bGUiLCJzdWJqZWN0IiwiaHRtbCIsInJhdyIsImF0dGFjaG1lbnRzIiwiQXR0YWNobWVudERhdGFzIiwiQXR0YWNobWVudERhdGEiLCJtYXAiLCJkYXRhIiwiQXR0YWNobWVudCIsImlzUmVhZCIsImlzRGVsZXRhYmxlIiwic2V0UmVhZCIsInNldERlbGV0YWJsZSIsIm1hcmtBc1JlYWQiLCJQcm9taXNlIiwicmVzIiwicmVqIiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwiTWVzc2FnZUxpc3RpbmciLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTWUsUUFBTUEsT0FBTixTQUFzQkMsY0FBS0MsTUFBM0IsQ0FBa0M7QUF5Qi9DQyxJQUFBQSxXQUFXLENBQ1RDLFNBRFMsRUFFVEMsV0FGUyxFQUdUQyxPQUhTLEVBSVQ7QUFDQSxZQUFNRCxXQUFOO0FBQ0EsV0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsV0FBS0YsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxXQUFLRyxJQUFMLEdBQVksSUFBSUMsYUFBSixDQUFTSixTQUFTLENBQUMsV0FBRCxDQUFULENBQXVCLENBQXZCLENBQVQsRUFBb0MsS0FBS0UsT0FBekMsQ0FBWjtBQUNBLFdBQUtHLEVBQUwsR0FBVUwsU0FBUyxDQUFDLE1BQUQsQ0FB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Q0FBcUI7QUFDekJDLFlBQUFBLFVBQVUsRUFBRSxrQkFEYTtBQUV6QkMsWUFBQUEsUUFBUSxFQUFFO0FBQ1JDLGNBQUFBLFVBQVUsRUFBRSxDQURKO0FBRVJDLGNBQUFBLGNBQWMsRUFBRTtBQUNkLCtCQUFlLDJDQUREO0FBRWQsK0JBQWUsa0NBRkQ7QUFHZCx3QkFBUSxLQUFLeEMsU0FBTCxDQUFlLE1BQWYsRUFBdUIsQ0FBdkIsQ0FITTtBQUlkLDBCQUFVLEtBQUtBLFNBQUwsQ0FBZSxRQUFmLEVBQXlCLENBQXpCLENBSkk7QUFLZCxnQ0FBZ0I7QUFMRjtBQUZSO0FBRmUsV0FBckIsQ0FBTjtBQWFBLGVBQUs4QixPQUFMLENBQWEsSUFBYjtBQUVBSSxVQUFBQSxHQUFHLENBQUMsSUFBRCxDQUFIO0FBQ0QsU0FqQkQsQ0FpQkUsT0FBT08sQ0FBUCxFQUFVO0FBQ1ZOLFVBQUFBLEdBQUcsQ0FBQ00sQ0FBRCxDQUFIO0FBQ0Q7QUFDRixPQXRCTSxDQUFQO0FBdUJEOztBQTdJOEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgc29hcCBmcm9tICcuLi8uLi91dGlscy9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgQXR0YWNobWVudCBmcm9tICcuLi9BdHRhY2htZW50L0F0dGFjaG1lbnQnO1xyXG5pbXBvcnQgeyBNZXNzYWdlWE1MT2JqZWN0IH0gZnJvbSAnLi9NZXNzYWdlLnhtbCc7XHJcbmltcG9ydCBJY29uIGZyb20gJy4uL0ljb24vSWNvbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlIGV4dGVuZHMgc29hcC5DbGllbnQge1xyXG4gIHByaXZhdGUgeG1sT2JqZWN0OiBNZXNzYWdlWE1MT2JqZWN0WydQWFBNZXNzYWdlc0RhdGEnXVswXVsnTWVzc2FnZUxpc3RpbmdzJ11bMF1bJ01lc3NhZ2VMaXN0aW5nJ11bMF07XHJcbiAgcHJpdmF0ZSBob3N0VXJsOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBpY29uOiBJY29uO1xyXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBiZWdpbkRhdGU7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGh0bWxDb250ZW50OiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSByZWFkOiBib29sZWFuO1xyXG4gIHByaXZhdGUgZGVsZXRhYmxlOiBib29sZWFuO1xyXG4gIHB1YmxpYyByZWFkb25seSBmcm9tOiB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzdGFmZkd1OiBzdHJpbmc7XHJcbiAgICBlbWFpbDogc3RyaW5nO1xyXG4gICAgc21Nc2dQZXJzb25HdTogc3RyaW5nO1xyXG4gIH07XHJcbiAgcHVibGljIHJlYWRvbmx5IG1vZHVsZTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBzdWJqZWN0OiB7XHJcbiAgICBodG1sOiBzdHJpbmc7XHJcbiAgICByYXc6IHN0cmluZztcclxuICB9O1xyXG4gIHB1YmxpYyByZWFkb25seSBhdHRhY2htZW50czogQXR0YWNobWVudFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHhtbE9iamVjdDogTWVzc2FnZVhNTE9iamVjdFsnUFhQTWVzc2FnZXNEYXRhJ11bMF1bJ01lc3NhZ2VMaXN0aW5ncyddWzBdWydNZXNzYWdlTGlzdGluZyddWzBdLFxyXG4gICAgY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsXHJcbiAgICBob3N0VXJsOiBzdHJpbmdcclxuICApIHtcclxuICAgIHN1cGVyKGNyZWRlbnRpYWxzKTtcclxuICAgIHRoaXMuaG9zdFVybCA9IGhvc3RVcmw7XHJcbiAgICB0aGlzLnhtbE9iamVjdCA9IHhtbE9iamVjdDtcclxuICAgIHRoaXMuaWNvbiA9IG5ldyBJY29uKHhtbE9iamVjdFsnQF9JY29uVVJMJ11bMF0sIHRoaXMuaG9zdFVybCk7XHJcbiAgICB0aGlzLmlkID0geG1sT2JqZWN0WydAX0lEJ11bMF07XHJcbiAgICB0aGlzLnR5cGUgPSB4bWxPYmplY3RbJ0BfVHlwZSddWzBdO1xyXG4gICAgdGhpcy5iZWdpbkRhdGUgPSB4bWxPYmplY3RbJ0BfQmVnaW5EYXRlJ11bMF07XHJcbiAgICB0aGlzLmh0bWxDb250ZW50ID0geG1sT2JqZWN0WydAX0NvbnRlbnQnXVswXTtcclxuICAgIHRoaXMucmVhZCA9IEpTT04ucGFyc2UoeG1sT2JqZWN0WydAX1JlYWQnXVswXSk7XHJcbiAgICB0aGlzLmRlbGV0YWJsZSA9IEpTT04ucGFyc2UoeG1sT2JqZWN0WydAX0RlbGV0YWJsZSddWzBdKTtcclxuICAgIHRoaXMuZnJvbSA9IHtcclxuICAgICAgbmFtZTogeG1sT2JqZWN0WydAX0Zyb20nXVswXSxcclxuICAgICAgc3RhZmZHdTogeG1sT2JqZWN0WydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgc21Nc2dQZXJzb25HdTogeG1sT2JqZWN0WydAX1NNTXNnUGVyc29uR1UnXVswXSxcclxuICAgICAgZW1haWw6IHhtbE9iamVjdFsnQF9FbWFpbCddWzBdLFxyXG4gICAgfTtcclxuICAgIHRoaXMubW9kdWxlID0geG1sT2JqZWN0WydAX01vZHVsZSddWzBdO1xyXG4gICAgdGhpcy5zdWJqZWN0ID0ge1xyXG4gICAgICBodG1sOiB4bWxPYmplY3RbJ0BfU3ViamVjdCddWzBdLFxyXG4gICAgICByYXc6IHhtbE9iamVjdFsnQF9TdWJqZWN0Tm9IVE1MJ11bMF0sXHJcbiAgICB9O1xyXG4gICAgdGhpcy5hdHRhY2htZW50cyA9XHJcbiAgICAgIHR5cGVvZiB4bWxPYmplY3QuQXR0YWNobWVudERhdGFzWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgID8geG1sT2JqZWN0LkF0dGFjaG1lbnREYXRhc1swXS5BdHRhY2htZW50RGF0YS5tYXAoXHJcbiAgICAgICAgICAgIChkYXRhKSA9PiBuZXcgQXR0YWNobWVudChkYXRhWydAX0F0dGFjaG1lbnROYW1lJ11bMF0sIGRhdGFbJ0BfU21BdHRhY2htZW50R1UnXVswXSwgY3JlZGVudGlhbHMpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgOiBbXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIGEgbWVzc2FnZSBoYXMgYmVlbiByZWFkXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIGJvb2xlYW4gZGVjbGFyaW5nIHdoZXRoZXIgb3Igbm90IHRoZSBtZXNzYWdlIGhhcyBiZWVuIHByZXZpb3VzbHkgcmVhZFxyXG4gICAqL1xyXG4gIHB1YmxpYyBpc1JlYWQoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaWYgYSBtZXNzYWdlIGlzIGRlbGV0YWJsZVxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBib29sZWFuIGRlY2xhcmluZyB3aGV0aGVyIG9yIG5vdCB0aGUgbWVzc2FnZSBpcyBkZWxldGFibGVcclxuICAgKi9cclxuICBwdWJsaWMgaXNEZWxldGFibGUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5kZWxldGFibGU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFJlYWQocmVhZDogYm9vbGVhbikge1xyXG4gICAgdGhpcy5yZWFkID0gcmVhZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0RGVsZXRhYmxlKGRlbGV0YWJsZTogYm9vbGVhbikge1xyXG4gICAgdGhpcy5kZWxldGFibGUgPSBkZWxldGFibGU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYXJrcyB0aGUgbWVzc2FnZSBhcyByZWFkXHJcbiAgICogQHJldHVybnMgUmV0dXJucyB0cnVlIHRvIHNob3cgdGhhdCBpdCBoYXMgYmVlbiBtYXJrZWQgYXMgcmVhZFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGNsaWVudC5tZXNzYWdlcygpO1xyXG4gICAqIG1lc3NhZ2VzLmV2ZXJ5KChtc2cpID0+IG1zZy5pc1JlYWQoKSkgLy8gLT4gZmFsc2VcclxuICAgKiBtZXNzYWdlcy5mb3JFYWNoKGFzeW5jIChtc2cpID0+ICFtc2cuaXNSZWFkKCkgJiYgYXdhaXQgbXNnLm1hcmtBc1JlYWQoKSk7XHJcbiAgICogbWVzc2FnZXMuZXZlcnkoKG1zZykgPT4gbXNnLmlzUmVhZCgpKSAvLyAtPiB0cnVlXHJcbiAgICogY29uc3QgcmVmZXRjaGVkTWVzc2FnZXMgPSBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTsgLy8gU2VlIGlmIGl0IHVwZGF0ZWQgb24gdGhlIHNlcnZlclxyXG4gICAqIG1lc3NhZ2VzLmV2ZXJ5KChtc2cpID0+IG1zZy5pc1JlYWQoKSkgLy8gLT4gdHJ1ZVxyXG4gICAqIGBgYFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBgdHN4XHJcbiAgICogLy8gSW4gYSBSZWFjdCBwcm9qZWN0Li4uXHJcbiAgICogaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuICAgKlxyXG4gICAqIGNvbnN0IE1lc3NhZ2UgPSAocHJvcHMpID0+IHtcclxuICAgKiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcclxuICAgKlxyXG4gICAqICBhc3luYyBmdW5jdGlvbiBoYW5kbGVPbkNsaWNrKCkge1xyXG4gICAqICAgIGF3YWl0IG1lc3NhZ2UubWFya0FzUmVhZCgpO1xyXG4gICAqICB9XHJcbiAgICpcclxuICAgKiAgcmV0dXJuIChcclxuICAgKiAgICA8YnV0dG9uIG9uQ2xpY2s9e2hhbmRsZU9uQ2xpY2t9IHN0eWxlPXt7IGNvbG9yOiBtZXNzYWdlLmlzUmVhZCgpID8gdW5kZWZpbmVkIDogJ3JlZCcgfX0+XHJcbiAgICogICAgICA8cD57bWVzc2FnZS5zdWJqZWN0LnJhd308L3A+XHJcbiAgICogICAgPC9idXR0b24+XHJcbiAgICogIClcclxuICAgKiB9XHJcbiAgICpcclxuICAgKiBleHBvcnQgZGVmYXVsdCBNZXNzYWdlO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBtYXJrQXNSZWFkKCk6IFByb21pc2U8dHJ1ZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHRydWU+KGFzeW5jIChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBpZiAodGhpcy5yZWFkKSByZXR1cm4gcmVzKHRydWUpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdVcGRhdGVQWFBNZXNzYWdlJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7XHJcbiAgICAgICAgICAgIGNoaWxkSW50SWQ6IDAsXHJcbiAgICAgICAgICAgIE1lc3NhZ2VMaXN0aW5nOiB7XHJcbiAgICAgICAgICAgICAgJ0BfeG1sbnM6eHNpJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlJyxcclxuICAgICAgICAgICAgICAnQF94bWxuczp4c2QnOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEnLFxyXG4gICAgICAgICAgICAgICdAX0lEJzogdGhpcy54bWxPYmplY3RbJ0BfSUQnXVswXSxcclxuICAgICAgICAgICAgICAnQF9UeXBlJzogdGhpcy54bWxPYmplY3RbJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICdAX01hcmtBc1JlYWQnOiAndHJ1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2V0UmVhZCh0cnVlKTtcclxuXHJcbiAgICAgICAgcmVzKHRydWUpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqKGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19