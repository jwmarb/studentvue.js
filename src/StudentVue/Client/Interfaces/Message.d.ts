import Attachment from '../../Attachment/Attachment';
import Icon from '../../Icon/Icon';

export declare interface Message {
  icon: Icon; // should be Icon class
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
  attachments: Attachment[]; // should be Attachment class
}
