export declare interface MessageXMLObject {
  MessageListings: [
    {
      MessageListing: {
        '@_IconURL': string;
        '@_ID': string;
        '@_BeginDate': string;
        '@_Type': string;
        '@_Subject': string;
        '@_Content': string; // This is a long html in a string
        '@_Read': string;
        '@_Deletable': string;
        '@_From': string;
        '@_SubjectNoHTML': string;
        '@_Module': string;
        '@_Email': string;
        '@_StaffGU': string;
        '@_SMMsgPersonGU': string;
        AttachmentDatas: [
          {
            AttachmentData: {
              '@_AttachmentName': string;
              '@_SmAttachmentGU': string;
            }[];
          }
        ];
      }[];
    }
  ];
}
