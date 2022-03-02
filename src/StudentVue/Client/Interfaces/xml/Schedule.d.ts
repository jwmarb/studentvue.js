export declare interface ScheduleXMLObject {
  StudentClassSchedule: [
    {
      '@_TermIndex': [string];
      '@_TermIndexName': [string];
      '@_ErrorMessage': [string];
      '@_IncludeAdditionalStaffWhenEmailingTeachers': [string];
      TodayScheduleInfoData: [
        {
          '@_Date': [string];
          SchoolInfos: [
            {
              SchoolInfo: {
                '@_SchoolName': [string];
                '@_BellSchedName': [string];
                Classes: [
                  {
                    ClassInfo: {
                      '@_Period': [string];
                      '@_ClassName': [string];
                      '@_ClassURL': [string];
                      '@_StartTime': [string];
                      '@_EndTime': [string];
                      '@_TeacherName': [string];
                      '@_TeacherURL': [string];
                      '@_RoomName': [string];
                      '@_TeacherEmail': [string];
                      '@_EmailSubject': [string];
                      '@_StaffGU': [string];
                      '@_EndDate': [string];
                      '@_StartDate': [string];
                      '@_SectionGU': [string];
                      '@_HideClassStartEndTime': [string];
                      AttendanceCode: [string];
                    }[];
                  }
                ];
              }[];
            }
          ];
        }
      ];
      ClassLists: [
        {
          ClassListing: {
            '@_Period': [string];
            '@_CourseTitle': [string];
            '@_RoomName': [string];
            '@_Teacher': [string];
            '@_TeacherEmail': [string];
            '@_SectionGU': [string];
            '@_TeacherStaffGU': [string];
          }[];
        }
      ];
      TermLists: [
        {
          TermListing: {
            '@_TermIndex': [string];
            '@_TermName': [string];
            '@_BeginDate': [string];
            '@_EndDate': [string];
            '@_SchoolYearTrmCodeGU': [string];
            TermDefCodes: [
              {
                TermDefCode: {
                  TermDefName: [string];
                }[];
              }
            ];
          }[];
        }
      ];
    }
  ];
}
