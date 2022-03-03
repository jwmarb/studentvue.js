export declare interface SchoolInfoXMLObject {
  StudentSchoolInfoListing: [
    {
      '@_School': [string];
      '@_Principal': [string];
      '@_SchoolAddress': [string];
      '@_SchoolAddress2': [string];
      '@_SchoolCity': [string];
      '@_SchoolZip': [string];
      '@_Phone': [string];
      '@_Phone2': [string];
      '@_URL': [string];
      '@_PrincipalEmail': [string];
      '@_PrincipalGu': [string];
      StaffLists: [
        {
          StaffList: {
            '@_Name': [string];
            '@_EMail': [string];
            '@_Title': [string];
            '@_Phone': [string];
            '@_Extn': [string];
            '@_StaffGU': [string];
          }[];
        }
      ];
    }
  ];
}
