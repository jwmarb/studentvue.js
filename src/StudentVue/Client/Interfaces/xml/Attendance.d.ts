export declare interface AttendanceXMLObject {
  Attendance: [
    {
      '@_Type': [string];
      '@_StartPeriod': [string];
      '@_EndPeriod': [string];
      '@_PeriodCount': [string];
      '@_SchoolName': [string];
      Absences: [
        {
          Absence: {
            '@_AbsenceDate': [string];
            '@_Reason': [string];
            '@_Note': [string];
            '@_DailyIconName': [string];
            '@_CodeAllDayReasonType': [string];
            '@_CodeAllDayDescription': [string];
            Periods: [
              {
                Period: {
                  '@_Number': [string];
                  '@_Name': [string];
                  '@_Reason': [string];
                  '@_Course': [string];
                  '@_Staff': [string];
                  '@_StaffEMail': [string];
                  '@_IconName': [string];
                  '@_SchoolName': [string];
                  '@_StaffGU': [string];
                  '@_OrgYearGU': [string];
                }[];
              }
            ];
          }[];
        }
      ];
      TotalExcused: [
        {
          PeriodTotal: {
            '@_Number': [string];
            '@_Total': [string];
          }[];
        }
      ];
      TotalTardies: [
        {
          PeriodTotal: {
            '@_Number': [string];
            '@_Total': [string];
          }[];
        }
      ];
      TotalUnexcused: [
        {
          PeriodTotal: {
            '@_Number': [string];
            '@_Total': [string];
          }[];
        }
      ];
      TotalActivities: [
        {
          PeriodTotal: {
            '@_Number': [string];
            '@_Total': [string];
          }[];
        }
      ];
      TotalUnexcusedTardies: [
        {
          PeriodTotal: {
            '@_Number': [string];
            '@_Total': [string];
          }[];
        }
      ];
      ConcurrentSchoolsLists: [''];
    }
  ];
}
