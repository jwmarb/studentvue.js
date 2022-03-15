export declare interface GradebookXMLObject {
  Gradebook: [
    {
      '@_Type': [string];
      '@_ErrorMessage': [string];
      '@_HideStandardGraphInd': [string];
      '@_HideMarksColumnElementary': [string];
      '@_HidePointsColumnElementary': [string];
      '@_HidePercentSecondary': [string];
      '@_DisplayStandardsData': [string];
      '@_GBStandardsTabDefault': [string];
      ReportingPeriods: [
        {
          ReportPeriod: {
            '@_Index': [string];
            '@_GradePeriod': [string];
            '@_StartDate': [string];
            '@_EndDate': [string];
          }[];
        }
      ];
      ReportingPeriod: [{ '@_GradePeriod': [string]; '@_StartDate': [string]; '@_EndDate': [string] }];
      Courses: {
        Course: [
          {
            '@_UsesRichContent': [string];
            '@_Period': [string];
            '@_Title': [string];
            '@_Room': [string];
            '@_Staff': [string];
            '@_StaffEMail': [string];
            '@_StaffGU': [string];
            '@_HighlightPercentageCutOffForProgressBar': [string];
            Marks: {
              Mark: [
                {
                  '@_MarkName': [string];
                  '@_CalculatedScoreString': [string];
                  '@_CalculatedScoreRaw': [string];
                  StandardViews: [''];
                  GradeCalculationSummary:
                    | [
                        {
                          AssignmentGradeCalc: [
                            {
                              '@_Type': [string];
                              '@_Weight': [string];
                              '@_Points': [string];
                              '@_PointsPossible': [string];
                              '@_WeightedPct': [string];
                              '@_CalculatedMark': [string];
                            }
                          ];
                        }
                      ]
                    | [''];
                  Assignments:
                    | ['']
                    | [
                        {
                          Assignment: {
                            '@_GradebookID': [string];
                            '@_Measure': [string];
                            '@_Type': [string];
                            '@_Date': [string];
                            '@_DueDate': [string];
                            '@_Score': [string];
                            '@_ScoreType': [string];
                            '@_Points': [string];
                            '@_Notes': [string];
                            '@_TeacherID': [string];
                            '@_StudentID': [string];
                            '@_MeasureDescription': [string];
                            '@_HasDropBox': [string];
                            '@_DropStartDate': [string];
                            '@_DropEndDate': [string];
                            Resources:
                              | {
                                  Resource: [URLResourceXMLObject] | [FileResourceXMLObject];
                                }[]
                              | [''];
                            Standards: [''];
                          }[];
                        }
                      ];
                }
              ];
            }[];
          }
        ];
      }[];
    }
  ];
}

export declare type URLResourceXMLObject = {
  '@_ClassID': [string];
  '@_GradebookID': [string];
  '@_ResourceDate': [string];
  '@_ResourceDescription': [string];
  '@_ResourceID': [string];
  '@_ResourceName': [string];
  '@_Sequence': [string];
  '@_TeacherID': [string];
  '@_Type': ['URL'];
  '@_URL': [string];
  '@_ServerFileName': [string];
};

export declare type FileResourceXMLObject = {
  '@_ClassID': [string];
  '@_FileName': [string];
  '@_FileType': [string];
  '@_GradebookID': [string];
  '@_ResourceDate': [string];
  '@_ResourceID': [string];
  '@_ResourceName': [string];
  '@_Sequence': [string];
  '@_TeacherID': [string];
  '@_Type': ['File'];
  '@_URL': [string];
  '@_ServerFileName': [string];
};
