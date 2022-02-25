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

    isRead() {
      return this.read;
    }

    isDeletable() {
      return this.deletable;
    }

    setRead(read) {
      this.read = read;
    }

    setDeletable(deletable) {
      this.deletable = deletable;
    }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL01lc3NhZ2UvTWVzc2FnZS50cyJdLCJuYW1lcyI6WyJNZXNzYWdlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwieG1sT2JqZWN0IiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiaWNvbiIsIkljb24iLCJpZCIsInR5cGUiLCJiZWdpbkRhdGUiLCJodG1sQ29udGVudCIsInJlYWQiLCJKU09OIiwicGFyc2UiLCJkZWxldGFibGUiLCJmcm9tIiwibmFtZSIsInN0YWZmR3UiLCJzbU1zZ1BlcnNvbkd1IiwiZW1haWwiLCJtb2R1bGUiLCJzdWJqZWN0IiwiaHRtbCIsInJhdyIsImF0dGFjaG1lbnRzIiwiQXR0YWNobWVudERhdGFzIiwiQXR0YWNobWVudERhdGEiLCJtYXAiLCJkYXRhIiwiQXR0YWNobWVudCIsImlzUmVhZCIsImlzRGVsZXRhYmxlIiwic2V0UmVhZCIsInNldERlbGV0YWJsZSIsIm1hcmtBc1JlYWQiLCJQcm9taXNlIiwicmVzIiwicmVqIiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwiTWVzc2FnZUxpc3RpbmciLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTWUsUUFBTUEsT0FBTixTQUFzQkMsY0FBS0MsTUFBM0IsQ0FBa0M7QUF5Qi9DQyxJQUFBQSxXQUFXLENBQ1RDLFNBRFMsRUFFVEMsV0FGUyxFQUdUQyxPQUhTLEVBSVQ7QUFDQSxZQUFNRCxXQUFOO0FBQ0EsV0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsV0FBS0YsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxXQUFLRyxJQUFMLEdBQVksSUFBSUMsYUFBSixDQUFTSixTQUFTLENBQUMsV0FBRCxDQUFULENBQXVCLENBQXZCLENBQVQsRUFBb0MsS0FBS0UsT0FBekMsQ0FBWjtBQUNBLFdBQUtHLEVBQUwsR0FBVUwsU0FBUyxDQUFDLE1BQUQsQ0FB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Q0FBZSxRQUFmLEVBQXlCLENBQXpCLENBSkk7QUFLZCxnQ0FBZ0I7QUFMRjtBQUZSO0FBRmUsV0FBckIsQ0FBTjtBQWFBLGVBQUs4QixPQUFMLENBQWEsSUFBYjtBQUVBSSxVQUFBQSxHQUFHLENBQUMsSUFBRCxDQUFIO0FBQ0QsU0FqQkQsQ0FpQkUsT0FBT08sQ0FBUCxFQUFVO0FBQ1ZOLFVBQUFBLEdBQUcsQ0FBQ00sQ0FBRCxDQUFIO0FBQ0Q7QUFDRixPQXRCTSxDQUFQO0FBdUJEOztBQW5HOEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgc29hcCBmcm9tICcuLi8uLi91dGlscy9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgQXR0YWNobWVudCBmcm9tICcuLi9BdHRhY2htZW50L0F0dGFjaG1lbnQnO1xyXG5pbXBvcnQgeyBNZXNzYWdlWE1MT2JqZWN0IH0gZnJvbSAnLi9NZXNzYWdlLnhtbCc7XHJcbmltcG9ydCBJY29uIGZyb20gJy4uL0ljb24vSWNvbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlIGV4dGVuZHMgc29hcC5DbGllbnQge1xyXG4gIHByaXZhdGUgeG1sT2JqZWN0OiBNZXNzYWdlWE1MT2JqZWN0WydQWFBNZXNzYWdlc0RhdGEnXVswXVsnTWVzc2FnZUxpc3RpbmdzJ11bMF1bJ01lc3NhZ2VMaXN0aW5nJ11bMF07XHJcbiAgcHJpdmF0ZSBob3N0VXJsOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBpY29uOiBJY29uO1xyXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBiZWdpbkRhdGU7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGh0bWxDb250ZW50OiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSByZWFkOiBib29sZWFuO1xyXG4gIHByaXZhdGUgZGVsZXRhYmxlOiBib29sZWFuO1xyXG4gIHB1YmxpYyByZWFkb25seSBmcm9tOiB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzdGFmZkd1OiBzdHJpbmc7XHJcbiAgICBlbWFpbDogc3RyaW5nO1xyXG4gICAgc21Nc2dQZXJzb25HdTogc3RyaW5nO1xyXG4gIH07XHJcbiAgcHVibGljIHJlYWRvbmx5IG1vZHVsZTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBzdWJqZWN0OiB7XHJcbiAgICBodG1sOiBzdHJpbmc7XHJcbiAgICByYXc6IHN0cmluZztcclxuICB9O1xyXG4gIHB1YmxpYyByZWFkb25seSBhdHRhY2htZW50czogQXR0YWNobWVudFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHhtbE9iamVjdDogTWVzc2FnZVhNTE9iamVjdFsnUFhQTWVzc2FnZXNEYXRhJ11bMF1bJ01lc3NhZ2VMaXN0aW5ncyddWzBdWydNZXNzYWdlTGlzdGluZyddWzBdLFxyXG4gICAgY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsXHJcbiAgICBob3N0VXJsOiBzdHJpbmdcclxuICApIHtcclxuICAgIHN1cGVyKGNyZWRlbnRpYWxzKTtcclxuICAgIHRoaXMuaG9zdFVybCA9IGhvc3RVcmw7XHJcbiAgICB0aGlzLnhtbE9iamVjdCA9IHhtbE9iamVjdDtcclxuICAgIHRoaXMuaWNvbiA9IG5ldyBJY29uKHhtbE9iamVjdFsnQF9JY29uVVJMJ11bMF0sIHRoaXMuaG9zdFVybCk7XHJcbiAgICB0aGlzLmlkID0geG1sT2JqZWN0WydAX0lEJ11bMF07XHJcbiAgICB0aGlzLnR5cGUgPSB4bWxPYmplY3RbJ0BfVHlwZSddWzBdO1xyXG4gICAgdGhpcy5iZWdpbkRhdGUgPSB4bWxPYmplY3RbJ0BfQmVnaW5EYXRlJ11bMF07XHJcbiAgICB0aGlzLmh0bWxDb250ZW50ID0geG1sT2JqZWN0WydAX0NvbnRlbnQnXVswXTtcclxuICAgIHRoaXMucmVhZCA9IEpTT04ucGFyc2UoeG1sT2JqZWN0WydAX1JlYWQnXVswXSk7XHJcbiAgICB0aGlzLmRlbGV0YWJsZSA9IEpTT04ucGFyc2UoeG1sT2JqZWN0WydAX0RlbGV0YWJsZSddWzBdKTtcclxuICAgIHRoaXMuZnJvbSA9IHtcclxuICAgICAgbmFtZTogeG1sT2JqZWN0WydAX0Zyb20nXVswXSxcclxuICAgICAgc3RhZmZHdTogeG1sT2JqZWN0WydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgc21Nc2dQZXJzb25HdTogeG1sT2JqZWN0WydAX1NNTXNnUGVyc29uR1UnXVswXSxcclxuICAgICAgZW1haWw6IHhtbE9iamVjdFsnQF9FbWFpbCddWzBdLFxyXG4gICAgfTtcclxuICAgIHRoaXMubW9kdWxlID0geG1sT2JqZWN0WydAX01vZHVsZSddWzBdO1xyXG4gICAgdGhpcy5zdWJqZWN0ID0ge1xyXG4gICAgICBodG1sOiB4bWxPYmplY3RbJ0BfU3ViamVjdCddWzBdLFxyXG4gICAgICByYXc6IHhtbE9iamVjdFsnQF9TdWJqZWN0Tm9IVE1MJ11bMF0sXHJcbiAgICB9O1xyXG4gICAgdGhpcy5hdHRhY2htZW50cyA9XHJcbiAgICAgIHR5cGVvZiB4bWxPYmplY3QuQXR0YWNobWVudERhdGFzWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgID8geG1sT2JqZWN0LkF0dGFjaG1lbnREYXRhc1swXS5BdHRhY2htZW50RGF0YS5tYXAoXHJcbiAgICAgICAgICAgIChkYXRhKSA9PiBuZXcgQXR0YWNobWVudChkYXRhWydAX0F0dGFjaG1lbnROYW1lJ11bMF0sIGRhdGFbJ0BfU21BdHRhY2htZW50R1UnXVswXSwgY3JlZGVudGlhbHMpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgOiBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpc1JlYWQoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGlzRGVsZXRhYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZGVsZXRhYmxlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRSZWFkKHJlYWQ6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMucmVhZCA9IHJlYWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldERlbGV0YWJsZShkZWxldGFibGU6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuZGVsZXRhYmxlID0gZGVsZXRhYmxlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG1hcmtBc1JlYWQoKTogUHJvbWlzZTx0cnVlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dHJ1ZT4oYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnJlYWQpIHJldHVybiByZXModHJ1ZSk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgc3VwZXIucHJvY2Vzc1JlcXVlc3Qoe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1VwZGF0ZVBYUE1lc3NhZ2UnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHtcclxuICAgICAgICAgICAgY2hpbGRJbnRJZDogMCxcclxuICAgICAgICAgICAgTWVzc2FnZUxpc3Rpbmc6IHtcclxuICAgICAgICAgICAgICAnQF94bWxuczp4c2knOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnLFxyXG4gICAgICAgICAgICAgICdAX3htbG5zOnhzZCc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScsXHJcbiAgICAgICAgICAgICAgJ0BfSUQnOiB0aGlzLnhtbE9iamVjdFsnQF9JRCddWzBdLFxyXG4gICAgICAgICAgICAgICdAX1R5cGUnOiB0aGlzLnhtbE9iamVjdFsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgJ0BfTWFya0FzUmVhZCc6ICd0cnVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZXRSZWFkKHRydWUpO1xyXG5cclxuICAgICAgICByZXModHJ1ZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=