export declare interface DistrictListXMLObject {
  DistrictLists: {
    DistrictInfos: {
      DistrictInfo:
        | {
            '@_DistrictID': string;
            '@_Name': string;
            '@_Address': string;
            '@_PvueURL': string;
          }[]
        | '';
    };
  };
}

export declare interface StudentInfoXMLObject {
  StudentInfo: [
    {
      LockerInfoRecords: string[];
      FormattedName: string[];
      PermID: string[];
      Gender: string[];
      Grade: string[];
      Address: [
        {
          br: [string];
          LastNameGoesBy: [string];
          NickName: [string];
          BirthDate: [string];
          EMail: [string];
          Phone: [string];
          HomeLanguage: [string];
          CurrentSchool: [string];
          Track: [string];
          HomeRoomTch: [string];
          HomeRoomTchEMail: [string];
          HomeRoomTchStaffGU: [string];
          OrgYearGU: [string];
          HomeRoom: [string];
          CounselorName: [string];
          CounselorEmail: [string];
          CounselorStaffGU: [string];
          Photo: [string]; // base64
          EmergencyContacts: [
            {
              EmergencyContact: {
                '@_Name': [string];
                '@_Relationship': [string];
                '@_HomePhone': [string];
                '@_WorkPhone': [string];
                '@_OtherPhone': [string];
                '@_MobilePhone': [string];
              }[];
            }
          ];
          UserDefinedGroupBoxes: [
            {
              UserDefinedGroupBox: {
                '@_GroupBoxLabel': [string];
                '@_GroupBoxID': [string];
                '@_VCID': [string];
                UserDefinedItems: [
                  {
                    UserDefinedItem: {
                      '@_ItemLabel': [string];
                      '@_ItemType': [string];
                      '@_SourceObject': [string];
                      '@_SourceElement': [string];
                      '@_VCID': [string];
                      '@_Value': [string];
                    }[];
                  }
                ];
              }[];
            }
          ];
          Physician: [
            {
              '@_Name': [string];
              '@_Hospital': [string];
              '@_Phone': [string];
              '@_Extn': [string];
            }
          ];
          Dentist: [
            {
              '@_Name': [string];
              '@_Office': [string];
              '@_Phone': [string];
              '@_Extn': [string];
            }
          ];
        }
      ];
    }
  ];
}
