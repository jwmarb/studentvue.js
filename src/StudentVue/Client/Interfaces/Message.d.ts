export declare interface Message {
  icon: unknown; // should be Icon class
  id: string;
  beginDate: string;
  type: string;
  htmlContent: string;
  isRead: boolean;
  isDeletable: boolean;
  from: {
    name: string;
    staffGu: string;
    email: string;
    smMsgPersonGu: string;
  };
  module: string;
  subject: {
    html: string;
    raw: string;
  };
  attachments: unknown[]; // should be Attachment class
}
