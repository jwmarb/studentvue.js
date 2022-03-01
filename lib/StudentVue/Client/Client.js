(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/soap/soap", "../Message/Message", "date-fns", "../../Constants/EventType", "lodash", "tiny-async-pool", "../../Constants/ResourceType"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/soap/soap"), require("../Message/Message"), require("date-fns"), require("../../Constants/EventType"), require("lodash"), require("tiny-async-pool"), require("../../Constants/ResourceType"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.soap, global.Message, global.dateFns, global.EventType, global.lodash, global.tinyAsyncPool, global.ResourceType);
    global.Client = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _soap, _Message, _dateFns, _EventType, _lodash, _tinyAsyncPool, _ResourceType) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _soap = _interopRequireDefault(_soap);
  _Message = _interopRequireDefault(_Message);
  _EventType = _interopRequireDefault(_EventType);
  _lodash = _interopRequireDefault(_lodash);
  _tinyAsyncPool = _interopRequireDefault(_tinyAsyncPool);
  _ResourceType = _interopRequireDefault(_ResourceType);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  class Client extends _soap.default.Client {
    constructor(credentials, hostUrl) {
      super(credentials);
      this.hostUrl = hostUrl;
    }
    /**
     * Returns the attendance of the student
     * @returns Returns an Attendance object
     * @example
     * ```js
     * client.attendance()
     *  .then(console.log); // -> { type: 'Period', period: {...}, schoolName: 'University High School', absences: [...], periodInfos: [...] }
     * ```
     */


    attendance() {
      return new Promise(async (res, rej) => {
        try {
          const attendanceXMLObject = await super.processRequest({
            methodName: 'Attendance',
            paramStr: {
              childIntId: 0
            }
          });
          const xmlObject = attendanceXMLObject.Attendance[0];
          var _a = xmlObject.Absences[0].Absence;

          var _f = absence => {
            var _a3 = absence.Periods[0].Period;

            var _f3 = period => {
              return {
                period: Number(period['@_Number'][0]),
                name: period['@_Name'][0],
                reason: period['@_Reason'][0],
                course: period['@_Course'][0],
                staff: {
                  name: period['@_Staff'][0],
                  staffGu: period['@_StaffGU'][0],
                  email: period['@_StaffEMail'][0]
                },
                orgYearGu: period['@_OrgYearGU'][0]
              };
            };

            var _r3 = [];

            for (var _i3 = 0; _i3 < _a3.length; _i3++) {
              _r3.push(_f3(_a3[_i3], _i3, _a3));
            }

            return {
              date: new Date(absence['@_AbsenceDate'][0]),
              reason: absence['@_Reason'][0],
              note: absence['@_Note'][0],
              description: absence['@_CodeAllDayDescription'][0],
              periods: _r3
            };
          };

          var _r = [];

          for (var _i = 0; _i < _a.length; _i++) {
            _r.push(_f(_a[_i], _i, _a));
          }

          var _a2 = xmlObject.TotalActivities[0].PeriodTotal;

          var _f2 = (pd, i) => {
            return {
              period: Number(pd['@_Number'][0]),
              total: {
                excused: Number(xmlObject.TotalExcused[0].PeriodTotal[i]['@_Total'][0]),
                tardies: Number(xmlObject.TotalTardies[0].PeriodTotal[i]['@_Total'][0]),
                unexcused: Number(xmlObject.TotalUnexcused[0].PeriodTotal[i]['@_Total'][0]),
                activities: Number(xmlObject.TotalActivities[0].PeriodTotal[i]['@_Total'][0]),
                unexcusedTardies: Number(xmlObject.TotalUnexcusedTardies[0].PeriodTotal[i]['@_Total'][0])
              }
            };
          };

          var _r2 = [];

          for (var _i2 = 0; _i2 < _a2.length; _i2++) {
            _r2.push(_f2(_a2[_i2], _i2, _a2));
          }

          res({
            type: xmlObject['@_Type'][0],
            period: {
              total: Number(xmlObject['@_PeriodCount'][0]),
              start: Number(xmlObject['@_StartPeriod'][0]),
              end: Number(xmlObject['@_EndPeriod'][0])
            },
            schoolName: xmlObject['@_SchoolName'][0],
            absences: _r,
            periodInfos: _r2
          });
        } catch (e) {
          rej(e);
        }
      });
    }
    /**
     * Returns the gradebook of the student
     * @param reportingPeriodIndex The timeframe that the gradebook should return
     * @returns Returns a Gradebook object
     * @example
     * ```js
     * const gradebook = await client.gradebook();
     * console.log(gradebook); // { error: '', type: 'Traditional', reportingPeriod: {...}, courses: [...] };
     *
     * await client.gradebook(0) // Some schools will have ReportingPeriodIndex 0 as "1st Quarter Progress"
     * await client.gradebook(7) // Some schools will have ReportingPeriodIndex 7 as "4th Quarter"
     * ```
     */


    gradebook(reportingPeriodIndex) {
      return new Promise(async (res, rej) => {
        try {
          const xmlObject = await super.processRequest({
            methodName: 'Gradebook',
            paramStr: {
              childIntId: 0,
              ...(reportingPeriodIndex ? {
                ReportingPeriod: reportingPeriodIndex
              } : {})
            }
          });
          var _a4 = xmlObject.Gradebook[0].ReportingPeriods[0].ReportPeriod;

          var _f4 = period => {
            return {
              date: {
                start: new Date(period['@_StartDate'][0]),
                end: new Date(period['@_EndDate'][0])
              },
              name: period['@_GradePeriod'][0],
              index: Number(period['@_Index'][0])
            };
          };

          var _r4 = [];

          for (var _i4 = 0; _i4 < _a4.length; _i4++) {
            _r4.push(_f4(_a4[_i4], _i4, _a4));
          }

          var _a5 = xmlObject.Gradebook[0].Courses[0].Course;

          var _f5 = course => {
            var _a6 = course.Marks[0].Mark;

            var _f6 = mark => {
              var _a7 = mark.Assignments[0].Assignment;

              var _f7 = assignment => {
                return {
                  gradebookId: assignment['@_GradebookID'][0],
                  name: assignment['@_Measure'][0],
                  type: assignment['@_Type'][0],
                  date: {
                    start: new Date(assignment['@_Date'][0]),
                    due: new Date(assignment['@_DueDate'][0])
                  },
                  score: {
                    type: assignment['@_ScoreType'][0],
                    value: assignment['@_Score'][0]
                  },
                  points: assignment['@_Points'][0],
                  notes: assignment['@_Notes'][0],
                  teacherId: assignment['@_TeacherID'][0],
                  description: assignment['@_MeasureDescription'][0],
                  hasDropbox: JSON.parse(assignment['@_HasDropBox'][0]),
                  studentId: assignment['@_StudentID'][0],
                  dropboxDate: {
                    start: new Date(assignment['@_DropStartDate'][0]),
                    end: new Date(assignment['@_DropEndDate'][0])
                  },
                  resources: typeof assignment.Resources[0] !== 'string' ? assignment.Resources[0].Resource.map(rsrc => {
                    switch (rsrc['@_Type'][0]) {
                      case 'File':
                        const fileRsrc = rsrc;
                        return {
                          type: _ResourceType.default.FILE,
                          file: {
                            type: fileRsrc['@_FileType'][0],
                            name: fileRsrc['@_FileName'][0],
                            uri: this.hostUrl + fileRsrc['@_ServerFileName'][0]
                          },
                          resource: {
                            date: new Date(fileRsrc['@_ResourceDate'][0]),
                            id: fileRsrc['@_ResourceID'][0],
                            name: fileRsrc['@_ResourceName'][0]
                          }
                        };

                      case 'URL':
                        const urlRsrc = rsrc;
                        return {
                          url: urlRsrc['@_URL'][0],
                          type: _ResourceType.default.URL,
                          resource: {
                            date: new Date(urlRsrc['@_ResourceDate'][0]),
                            id: urlRsrc['@_ResourceID'][0],
                            name: urlRsrc['@_ResourceName'][0],
                            description: urlRsrc['@_ResourceDescription'][0]
                          },
                          path: urlRsrc['@_ServerFileName'][0]
                        };

                      default:
                        rej(`Type ${rsrc['@_Type'][0]} does not exist as a type. Add it to type declarations.`);
                    }
                  }) : []
                };
              };

              var _r7 = [];

              for (var _i7 = 0; _i7 < _a7.length; _i7++) {
                _r7.push(_f7(_a7[_i7], _i7, _a7));
              }

              return {
                name: mark['@_MarkName'][0],
                calculatedScore: {
                  string: mark['@_CalculatedScoreString'][0],
                  raw: Number(mark['@_CalculatedScoreRaw'][0])
                },
                weightedCategories: typeof mark['GradeCalculationSummary'][0] !== 'string' ? mark['GradeCalculationSummary'][0].AssignmentGradeCalc.map(weighted => {
                  return {
                    type: weighted['@_Type'][0],
                    calculatedMark: weighted['@_CalculatedMark'][0],
                    weight: {
                      evaluated: weighted['@_WeightedPct'][0],
                      standard: weighted['@_Weight'][0]
                    },
                    points: {
                      current: Number(weighted['@_Points'][0]),
                      possible: Number(weighted['@_PointsPossible'][0])
                    }
                  };
                }) : [],
                assignments: _r7
              };
            };

            var _r6 = [];

            for (var _i6 = 0; _i6 < _a6.length; _i6++) {
              _r6.push(_f6(_a6[_i6], _i6, _a6));
            }

            return {
              period: Number(course['@_Period'][0]),
              title: course['@_Title'][0],
              room: course['@_Room'][0],
              staff: {
                name: course['@_Staff'][0],
                email: course['@_StaffEMail'][0],
                staffGu: course['@_StaffGU'][0]
              },
              marks: _r6
            };
          };

          var _r5 = [];

          for (var _i5 = 0; _i5 < _a5.length; _i5++) {
            _r5.push(_f5(_a5[_i5], _i5, _a5));
          }

          res({
            error: xmlObject.Gradebook[0]['@_ErrorMessage'][0],
            type: xmlObject.Gradebook[0]['@_Type'][0],
            reportingPeriod: {
              current: {
                index: reportingPeriodIndex ?? Number(xmlObject.Gradebook[0].ReportingPeriods[0].ReportPeriod.find(x => {
                  return x['@_GradePeriod'][0] === xmlObject.Gradebook[0].ReportingPeriod[0]['@_GradePeriod'][0];
                })?.['@_Index'][0]),
                date: {
                  start: new Date(xmlObject.Gradebook[0].ReportingPeriod[0]['@_StartDate'][0]),
                  end: new Date(xmlObject.Gradebook[0].ReportingPeriod[0]['@_EndDate'][0])
                },
                name: xmlObject.Gradebook[0].ReportingPeriod[0]['@_GradePeriod'][0]
              },
              available: _r4
            },
            courses: _r5
          });
        } catch (e) {
          rej(e);
        }
      });
    }

    messages() {
      return new Promise(async (res, rej) => {
        try {
          const xmlObject = await super.processRequest({
            methodName: 'GetPXPMessages',
            paramStr: {
              childIntId: 0
            }
          });
          var _a8 = xmlObject.PXPMessagesData[0].MessageListings[0].MessageListing;

          var _f8 = message => {
            return new _Message.default(message, super.credentials, this.hostUrl);
          };

          var _r8 = [];

          for (var _i8 = 0; _i8 < _a8.length; _i8++) {
            _r8.push(_f8(_a8[_i8], _i8, _a8));
          }

          res(_r8);
        } catch (e) {
          rej(e);
        }
      });
    }
    /**
     * Gets the info of a student
     * @returns StudentInfo object
     * @example
     * ```js
     * studentInfo().then(console.log) // -> { student: { name: 'Evan Davis', nickname: '', lastName: 'Davis' }, ...}
     * ```
     */


    studentInfo() {
      return new Promise(async (res, rej) => {
        try {
          const xmlObjectData = await super.processRequest({
            methodName: 'StudentInfo',
            paramStr: {
              childIntId: 0
            }
          });
          var _a9 = xmlObjectData.StudentInfo[0].Address[0].EmergencyContacts[0].EmergencyContact;

          var _f9 = contact => {
            return {
              name: contact['@_Name'][0],
              phone: {
                home: contact['@_HomePhone'][0],
                mobile: contact['@_MobilePhone'][0],
                other: contact['@_OtherPhone'][0],
                work: contact['@_WorkPhone'][0]
              },
              relationship: contact['@_Relationship'][0]
            };
          };

          var _r9 = [];

          for (var _i9 = 0; _i9 < _a9.length; _i9++) {
            _r9.push(_f9(_a9[_i9], _i9, _a9));
          }

          var _a10 = xmlObjectData.StudentInfo[0].Address[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox;

          var _f10 = definedBox => {
            var _a11 = definedBox.UserDefinedItems[0].UserDefinedItem;

            var _f11 = item => {
              return {
                source: {
                  element: item['@_SourceElement'][0],
                  object: item['@_SourceObject'][0]
                },
                vcId: item['@_VCID'][0],
                value: item['@_Value'][0],
                type: item['@_ItemType'][0]
              };
            };

            var _r11 = [];

            for (var _i11 = 0; _i11 < _a11.length; _i11++) {
              _r11.push(_f11(_a11[_i11], _i11, _a11));
            }

            return {
              id: definedBox['@_GroupBoxID'][0],
              type: definedBox['@_GroupBoxLabel'][0],
              vcId: definedBox['@_VCID'][0],
              items: _r11
            };
          };

          var _r10 = [];

          for (var _i10 = 0; _i10 < _a10.length; _i10++) {
            _r10.push(_f10(_a10[_i10], _i10, _a10));
          }

          res({
            student: {
              name: xmlObjectData.StudentInfo[0].FormattedName[0],
              lastName: xmlObjectData.StudentInfo[0].Address[0].LastNameGoesBy[0],
              nickname: xmlObjectData.StudentInfo[0].Address[0].NickName[0]
            },
            birthDate: xmlObjectData.StudentInfo[0].Address[0].BirthDate[0],
            track: xmlObjectData.StudentInfo[0].Address[0].Track[0],
            address: xmlObjectData.StudentInfo[0].Address[0].br[0],
            counselor: {
              name: xmlObjectData.StudentInfo[0].Address[0].CounselorName[0],
              email: xmlObjectData.StudentInfo[0].Address[0].CounselorEmail[0],
              staffGu: xmlObjectData.StudentInfo[0].Address[0].CounselorStaffGU[0]
            },
            currentSchool: xmlObjectData.StudentInfo[0].Address[0].CurrentSchool[0],
            dentist: {
              name: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Name'][0],
              phone: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Phone'][0],
              extn: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Extn'][0],
              office: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Office'][0]
            },
            physician: {
              name: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Name'][0],
              phone: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Phone'][0],
              extn: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Extn'][0],
              hospital: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Hospital'][0]
            },
            email: xmlObjectData.StudentInfo[0].Address[0].EMail[0],
            emergencyContacts: _r9,
            gender: xmlObjectData.StudentInfo[0].Gender[0],
            grade: xmlObjectData.StudentInfo[0].Grade[0],
            lockerInfoRecords: xmlObjectData.StudentInfo[0].LockerInfoRecords[0],
            homeLanguage: xmlObjectData.StudentInfo[0].Address[0].HomeLanguage[0],
            homeRoom: xmlObjectData.StudentInfo[0].Address[0].HomeRoom[0],
            homeRoomTeacher: {
              email: xmlObjectData.StudentInfo[0].Address[0].HomeRoomTchEMail[0],
              name: xmlObjectData.StudentInfo[0].Address[0].HomeRoomTch[0],
              staffGu: xmlObjectData.StudentInfo[0].Address[0].HomeRoomTchStaffGU[0]
            },
            additionalInfo: _r10
          });
        } catch (e) {
          rej(e);
        }
      });
    }

    fetchEventsWithinInterval(date) {
      return super.processRequest({
        methodName: 'StudentCalendar',
        paramStr: {
          childIntId: 0,
          RequestDate: date.toISOString()
        }
      });
    }
    /**
     *
     * @param options Options to provide for calendar method. This is optional
     * @returns Returns a Calendar object
     * @example
     * ```js
     * client.calendar({ interval: { start: new Date('5/1/2022'), end: new Date('8/1/2021') }, concurrency: null }); // -> Limitless concurrency (not recommended)
     *
     * const calendar = await client.calendar();
     * console.log(calendar); // -> { schoolDate: {...}, outputRange: {...}, events: [...] }
     * ```
     */


    calendar(options) {
      const defaultOptions = {
        concurrency: 7,
        ...options
      };
      return new Promise(async (res, rej) => {
        try {
          let schoolStartDate = options.interval.start;
          let schoolEndDate = options.interval.end;
          const monthsWithinSchoolYear = (0, _dateFns.eachMonthOfInterval)({
            start: schoolStartDate,
            end: schoolEndDate
          });
          const allEventsWithinSchoolYear = defaultOptions.concurrency == null ? await Promise.all(monthsWithinSchoolYear.map(date => {
            return this.fetchEventsWithinInterval(date);
          })) : await (0, _tinyAsyncPool.default)(defaultOptions.concurrency, monthsWithinSchoolYear, date => {
            return this.fetchEventsWithinInterval(date);
          });
          let memo = null;
          const events = allEventsWithinSchoolYear.reduce((prev, events) => {
            if (memo == null) {
              memo = {
                schoolDate: {
                  start: new Date(events.CalendarListing[0]['@_SchoolBegDate'][0]),
                  end: new Date(events.CalendarListing[0]['@_SchoolEndDate'][0])
                },
                outputRange: {
                  start: schoolStartDate,
                  end: schoolEndDate
                },
                events: []
              };
            }

            var _a12 = events.CalendarListing[0].EventLists[0].EventList;

            var _f12 = event => {
              switch (event['@_DayType'][0]) {
                case _EventType.default.ASSIGNMENT:
                  {
                    const assignmentEvent = event;
                    return {
                      title: assignmentEvent['@_Title'][0],
                      addLinkData: assignmentEvent['@_AddLinkData'][0],
                      agu: assignmentEvent['@_AGU'][0],
                      date: new Date(assignmentEvent['@_Date'][0]),
                      dgu: assignmentEvent['@_DGU'][0],
                      link: assignmentEvent['@_Link'][0],
                      startTime: assignmentEvent['@_StartTime'][0],
                      type: _EventType.default.ASSIGNMENT,
                      viewType: assignmentEvent['@_ViewType'][0]
                    };
                  }

                case _EventType.default.HOLIDAY:
                  {
                    return {
                      title: event['@_Title'][0],
                      type: _EventType.default.HOLIDAY,
                      startTime: event['@_StartTime'][0],
                      date: new Date(event['@_Date'][0])
                    };
                  }

                case _EventType.default.REGULAR:
                  {
                    const regularEvent = event;
                    return {
                      title: regularEvent['@_Title'][0],
                      agu: regularEvent['@_AGU'] ? regularEvent['@_AGU'] : undefined,
                      date: new Date(regularEvent['@_Date'][0]),
                      description: regularEvent['@_EvtDescription'] ? regularEvent['@_EvtDescription'][0] : undefined,
                      dgu: regularEvent['@_DGU'] ? regularEvent['@_DGU'][0] : undefined,
                      link: regularEvent['@_Link'] ? regularEvent['@_Link'][0] : undefined,
                      startTime: regularEvent['@_StartTime'][0],
                      type: _EventType.default.REGULAR,
                      viewType: regularEvent['@_ViewType'] ? regularEvent['@_ViewType'][0] : undefined,
                      addLinkData: regularEvent['@_AddLinkData'] ? regularEvent['@_AddLinkData'][0] : undefined
                    };
                  }
              }
            };

            var _r12 = [];

            for (var _i12 = 0; _i12 < _a12.length; _i12++) {
              _r12.push(_f12(_a12[_i12], _i12, _a12));
            }

            let rest = { ...memo,
              // This is to prevent re-initializing Date objects in order to improve performance
              events: [...(prev.events ? prev.events : []), ..._r12]
            };
            return rest;
          }, {});
          res({ ...events,
            events: _lodash.default.uniqBy(events.events, item => {
              return item.title;
            })
          }); // res(allEventsWithinSchoolYear);
        } catch (e) {
          rej(e);
        }
      });
    }

  }

  _exports.default = Client;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50Iiwic29hcCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiYXR0ZW5kYW5jZSIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJhdHRlbmRhbmNlWE1MT2JqZWN0IiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwieG1sT2JqZWN0IiwiQXR0ZW5kYW5jZSIsIkFic2VuY2VzIiwiQWJzZW5jZSIsImFic2VuY2UiLCJQZXJpb2RzIiwiUGVyaW9kIiwicGVyaW9kIiwiTnVtYmVyIiwibmFtZSIsInJlYXNvbiIsImNvdXJzZSIsInN0YWZmIiwic3RhZmZHdSIsImVtYWlsIiwib3JnWWVhckd1IiwiZGF0ZSIsIkRhdGUiLCJub3RlIiwiZGVzY3JpcHRpb24iLCJwZXJpb2RzIiwiVG90YWxBY3Rpdml0aWVzIiwiUGVyaW9kVG90YWwiLCJwZCIsImkiLCJ0b3RhbCIsImV4Y3VzZWQiLCJUb3RhbEV4Y3VzZWQiLCJ0YXJkaWVzIiwiVG90YWxUYXJkaWVzIiwidW5leGN1c2VkIiwiVG90YWxVbmV4Y3VzZWQiLCJhY3Rpdml0aWVzIiwidW5leGN1c2VkVGFyZGllcyIsIlRvdGFsVW5leGN1c2VkVGFyZGllcyIsInR5cGUiLCJzdGFydCIsImVuZCIsInNjaG9vbE5hbWUiLCJhYnNlbmNlcyIsInBlcmlvZEluZm9zIiwiZSIsImdyYWRlYm9vayIsInJlcG9ydGluZ1BlcmlvZEluZGV4IiwiUmVwb3J0aW5nUGVyaW9kIiwiR3JhZGVib29rIiwiUmVwb3J0aW5nUGVyaW9kcyIsIlJlcG9ydFBlcmlvZCIsImluZGV4IiwiQ291cnNlcyIsIkNvdXJzZSIsIk1hcmtzIiwiTWFyayIsIm1hcmsiLCJBc3NpZ25tZW50cyIsIkFzc2lnbm1lbnQiLCJhc3NpZ25tZW50IiwiZ3JhZGVib29rSWQiLCJkdWUiLCJzY29yZSIsInZhbHVlIiwicG9pbnRzIiwibm90ZXMiLCJ0ZWFjaGVySWQiLCJoYXNEcm9wYm94IiwiSlNPTiIsInBhcnNlIiwic3R1ZGVudElkIiwiZHJvcGJveERhdGUiLCJyZXNvdXJjZXMiLCJSZXNvdXJjZXMiLCJSZXNvdXJjZSIsIm1hcCIsInJzcmMiLCJmaWxlUnNyYyIsIlJlc291cmNlVHlwZSIsIkZJTEUiLCJmaWxlIiwidXJpIiwicmVzb3VyY2UiLCJpZCIsInVybFJzcmMiLCJ1cmwiLCJVUkwiLCJwYXRoIiwiY2FsY3VsYXRlZFNjb3JlIiwic3RyaW5nIiwicmF3Iiwid2VpZ2h0ZWRDYXRlZ29yaWVzIiwiQXNzaWdubWVudEdyYWRlQ2FsYyIsIndlaWdodGVkIiwiY2FsY3VsYXRlZE1hcmsiLCJ3ZWlnaHQiLCJldmFsdWF0ZWQiLCJzdGFuZGFyZCIsImN1cnJlbnQiLCJwb3NzaWJsZSIsImFzc2lnbm1lbnRzIiwidGl0bGUiLCJyb29tIiwibWFya3MiLCJlcnJvciIsInJlcG9ydGluZ1BlcmlvZCIsImZpbmQiLCJ4IiwiYXZhaWxhYmxlIiwiY291cnNlcyIsIm1lc3NhZ2VzIiwiUFhQTWVzc2FnZXNEYXRhIiwiTWVzc2FnZUxpc3RpbmdzIiwiTWVzc2FnZUxpc3RpbmciLCJtZXNzYWdlIiwiTWVzc2FnZSIsInN0dWRlbnRJbmZvIiwieG1sT2JqZWN0RGF0YSIsIlN0dWRlbnRJbmZvIiwiQWRkcmVzcyIsIkVtZXJnZW5jeUNvbnRhY3RzIiwiRW1lcmdlbmN5Q29udGFjdCIsImNvbnRhY3QiLCJwaG9uZSIsImhvbWUiLCJtb2JpbGUiLCJvdGhlciIsIndvcmsiLCJyZWxhdGlvbnNoaXAiLCJVc2VyRGVmaW5lZEdyb3VwQm94ZXMiLCJVc2VyRGVmaW5lZEdyb3VwQm94IiwiZGVmaW5lZEJveCIsIlVzZXJEZWZpbmVkSXRlbXMiLCJVc2VyRGVmaW5lZEl0ZW0iLCJpdGVtIiwic291cmNlIiwiZWxlbWVudCIsIm9iamVjdCIsInZjSWQiLCJpdGVtcyIsInN0dWRlbnQiLCJGb3JtYXR0ZWROYW1lIiwibGFzdE5hbWUiLCJMYXN0TmFtZUdvZXNCeSIsIm5pY2tuYW1lIiwiTmlja05hbWUiLCJiaXJ0aERhdGUiLCJCaXJ0aERhdGUiLCJ0cmFjayIsIlRyYWNrIiwiYWRkcmVzcyIsImJyIiwiY291bnNlbG9yIiwiQ291bnNlbG9yTmFtZSIsIkNvdW5zZWxvckVtYWlsIiwiQ291bnNlbG9yU3RhZmZHVSIsImN1cnJlbnRTY2hvb2wiLCJDdXJyZW50U2Nob29sIiwiZGVudGlzdCIsIkRlbnRpc3QiLCJleHRuIiwib2ZmaWNlIiwicGh5c2ljaWFuIiwiUGh5c2ljaWFuIiwiaG9zcGl0YWwiLCJFTWFpbCIsImVtZXJnZW5jeUNvbnRhY3RzIiwiZ2VuZGVyIiwiR2VuZGVyIiwiZ3JhZGUiLCJHcmFkZSIsImxvY2tlckluZm9SZWNvcmRzIiwiTG9ja2VySW5mb1JlY29yZHMiLCJob21lTGFuZ3VhZ2UiLCJIb21lTGFuZ3VhZ2UiLCJob21lUm9vbSIsIkhvbWVSb29tIiwiaG9tZVJvb21UZWFjaGVyIiwiSG9tZVJvb21UY2hFTWFpbCIsIkhvbWVSb29tVGNoIiwiSG9tZVJvb21UY2hTdGFmZkdVIiwiYWRkaXRpb25hbEluZm8iLCJmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsIiwiUmVxdWVzdERhdGUiLCJ0b0lTT1N0cmluZyIsImNhbGVuZGFyIiwib3B0aW9ucyIsImRlZmF1bHRPcHRpb25zIiwiY29uY3VycmVuY3kiLCJzY2hvb2xTdGFydERhdGUiLCJpbnRlcnZhbCIsInNjaG9vbEVuZERhdGUiLCJtb250aHNXaXRoaW5TY2hvb2xZZWFyIiwiYWxsRXZlbnRzV2l0aGluU2Nob29sWWVhciIsImFsbCIsIm1lbW8iLCJldmVudHMiLCJyZWR1Y2UiLCJwcmV2Iiwic2Nob29sRGF0ZSIsIkNhbGVuZGFyTGlzdGluZyIsIm91dHB1dFJhbmdlIiwiRXZlbnRMaXN0cyIsIkV2ZW50TGlzdCIsImV2ZW50IiwiRXZlbnRUeXBlIiwiQVNTSUdOTUVOVCIsImFzc2lnbm1lbnRFdmVudCIsImFkZExpbmtEYXRhIiwiYWd1IiwiZGd1IiwibGluayIsInN0YXJ0VGltZSIsInZpZXdUeXBlIiwiSE9MSURBWSIsIlJFR1VMQVIiLCJyZWd1bGFyRXZlbnQiLCJ1bmRlZmluZWQiLCJyZXN0IiwiXyIsInVuaXFCeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCZSxRQUFNQSxNQUFOLFNBQXFCQyxjQUFLRCxNQUExQixDQUFpQztBQUU5Q0UsSUFBQUEsV0FBVyxDQUFDQyxXQUFELEVBQWdDQyxPQUFoQyxFQUFpRDtBQUMxRCxZQUFNRCxXQUFOO0FBQ0EsV0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNTQyxJQUFBQSxVQUFVLEdBQXdCO0FBQ3ZDLGFBQU8sSUFBSUMsT0FBSixDQUFZLE9BQU9DLEdBQVAsRUFBWUMsR0FBWixLQUFvQjtBQUNyQyxZQUFJO0FBQ0YsZ0JBQU1DLG1CQUF3QyxHQUFHLE1BQU0sTUFBTUMsY0FBTixDQUFxQjtBQUMxRUMsWUFBQUEsVUFBVSxFQUFFLFlBRDhEO0FBRTFFQyxZQUFBQSxRQUFRLEVBQUU7QUFDUkMsY0FBQUEsVUFBVSxFQUFFO0FBREo7QUFGZ0UsV0FBckIsQ0FBdkQ7QUFPQSxnQkFBTUMsU0FBUyxHQUFHTCxtQkFBbUIsQ0FBQ00sVUFBcEIsQ0FBK0IsQ0FBL0IsQ0FBbEI7QUFSRSxtQkFrQlVELFNBQVMsQ0FBQ0UsUUFBVixDQUFtQixDQUFuQixFQUFzQkMsT0FsQmhDOztBQUFBLG1CQWtCNkNDLE9BQUQ7QUFBQSxzQkFLakNBLE9BQU8sQ0FBQ0MsT0FBUixDQUFnQixDQUFoQixFQUFtQkMsTUFMYzs7QUFBQSxzQkFNdkNDLE1BQUQ7QUFBQSxxQkFDRztBQUNDQSxnQkFBQUEsTUFBTSxFQUFFQyxNQUFNLENBQUNELE1BQU0sQ0FBQyxVQUFELENBQU4sQ0FBbUIsQ0FBbkIsQ0FBRCxDQURmO0FBRUNFLGdCQUFBQSxJQUFJLEVBQUVGLE1BQU0sQ0FBQyxRQUFELENB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RUE5RFksQ0FBZjtBQWdFQTlOLFVBQUFBLEdBQUcsQ0FBQyxFQUFFLEdBQUd3TSxNQUFMO0FBQWFBLFlBQUFBLE1BQU0sRUFBRXVCLGdCQUFFQyxNQUFGLENBQVN4QixNQUFNLENBQUNBLE1BQWhCLEVBQXlCOUQsSUFBRDtBQUFBLHFCQUFVQSxJQUFJLENBQUNqQyxLQUFmO0FBQUEsYUFBeEI7QUFBckIsV0FBRCxDQUFILENBNUVFLENBNkVGO0FBQ0QsU0E5RUQsQ0E4RUUsT0FBT3pELENBQVAsRUFBVTtBQUNWL0MsVUFBQUEsR0FBRyxDQUFDK0MsQ0FBRCxDQUFIO0FBQ0Q7QUFDRixPQWxGTSxDQUFQO0FBbUZEOztBQWxiNkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgc29hcCBmcm9tICcuLi8uLi91dGlscy9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgeyBBZGRpdGlvbmFsSW5mbywgQWRkaXRpb25hbEluZm9JdGVtLCBTdHVkZW50SW5mbyB9IGZyb20gJy4vQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBTdHVkZW50SW5mb1hNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU3R1ZGVudEluZm8nO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuLi9NZXNzYWdlL01lc3NhZ2UnO1xyXG5pbXBvcnQgeyBNZXNzYWdlWE1MT2JqZWN0IH0gZnJvbSAnLi4vTWVzc2FnZS9NZXNzYWdlLnhtbCc7XHJcbmltcG9ydCB7IEFzc2lnbm1lbnRFdmVudFhNTE9iamVjdCwgQ2FsZW5kYXJYTUxPYmplY3QsIFJlZ3VsYXJFdmVudFhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvQ2FsZW5kYXInO1xyXG5pbXBvcnQgeyBBc3NpZ25tZW50RXZlbnQsIENhbGVuZGFyLCBDYWxlbmRhck9wdGlvbnMsIEV2ZW50LCBIb2xpZGF5RXZlbnQsIFJlZ3VsYXJFdmVudCB9IGZyb20gJy4vSW50ZXJmYWNlcy9DYWxlbmRhcic7XHJcbmltcG9ydCB7IGVhY2hNb250aE9mSW50ZXJ2YWwsIGlzQWZ0ZXIsIGlzQmVmb3JlLCBpc1RoaXNNb250aCB9IGZyb20gJ2RhdGUtZm5zJztcclxuaW1wb3J0IHsgRmlsZVJlc291cmNlWE1MT2JqZWN0LCBHcmFkZWJvb2tYTUxPYmplY3QsIFVSTFJlc291cmNlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9HcmFkZWJvb2snO1xyXG5pbXBvcnQgeyBBdHRlbmRhbmNlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9BdHRlbmRhbmNlJztcclxuaW1wb3J0IEV2ZW50VHlwZSBmcm9tICcuLi8uLi9Db25zdGFudHMvRXZlbnRUeXBlJztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgQXNzaWdubWVudCwgRmlsZVJlc291cmNlLCBHcmFkZWJvb2ssIE1hcmssIFVSTFJlc291cmNlLCBXZWlnaHRlZENhdGVnb3J5IH0gZnJvbSAnLi9JbnRlcmZhY2VzL0dyYWRlYm9vayc7XHJcbmltcG9ydCBhc3luY1Bvb2wgZnJvbSAndGlueS1hc3luYy1wb29sJztcclxuaW1wb3J0IFJlc291cmNlVHlwZSBmcm9tICcuLi8uLi9Db25zdGFudHMvUmVzb3VyY2VUeXBlJztcclxuaW1wb3J0IHsgQWJzZW50UGVyaW9kLCBBdHRlbmRhbmNlLCBQZXJpb2RJbmZvIH0gZnJvbSAnLi9JbnRlcmZhY2VzL0F0dGVuZGFuY2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IGV4dGVuZHMgc29hcC5DbGllbnQge1xyXG4gIHByaXZhdGUgaG9zdFVybDogc3RyaW5nO1xyXG4gIGNvbnN0cnVjdG9yKGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzLCBob3N0VXJsOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGNyZWRlbnRpYWxzKTtcclxuICAgIHRoaXMuaG9zdFVybCA9IGhvc3RVcmw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBhdHRlbmRhbmNlIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhbiBBdHRlbmRhbmNlIG9iamVjdFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBjbGllbnQuYXR0ZW5kYW5jZSgpXHJcbiAgICogIC50aGVuKGNvbnNvbGUubG9nKTsgLy8gLT4geyB0eXBlOiAnUGVyaW9kJywgcGVyaW9kOiB7Li4ufSwgc2Nob29sTmFtZTogJ1VuaXZlcnNpdHkgSGlnaCBTY2hvb2wnLCBhYnNlbmNlczogWy4uLl0sIHBlcmlvZEluZm9zOiBbLi4uXSB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGF0dGVuZGFuY2UoKTogUHJvbWlzZTxBdHRlbmRhbmNlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgYXR0ZW5kYW5jZVhNTE9iamVjdDogQXR0ZW5kYW5jZVhNTE9iamVjdCA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdBdHRlbmRhbmNlJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7XHJcbiAgICAgICAgICAgIGNoaWxkSW50SWQ6IDAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCB4bWxPYmplY3QgPSBhdHRlbmRhbmNlWE1MT2JqZWN0LkF0dGVuZGFuY2VbMF07XHJcblxyXG4gICAgICAgIHJlcyh7XHJcbiAgICAgICAgICB0eXBlOiB4bWxPYmplY3RbJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgcGVyaW9kOiB7XHJcbiAgICAgICAgICAgIHRvdGFsOiBOdW1iZXIoeG1sT2JqZWN0WydAX1BlcmlvZENvdW50J11bMF0pLFxyXG4gICAgICAgICAgICBzdGFydDogTnVtYmVyKHhtbE9iamVjdFsnQF9TdGFydFBlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgZW5kOiBOdW1iZXIoeG1sT2JqZWN0WydAX0VuZFBlcmlvZCddWzBdKSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzY2hvb2xOYW1lOiB4bWxPYmplY3RbJ0BfU2Nob29sTmFtZSddWzBdLFxyXG4gICAgICAgICAgYWJzZW5jZXM6IHhtbE9iamVjdC5BYnNlbmNlc1swXS5BYnNlbmNlLm1hcCgoYWJzZW5jZSkgPT4gKHtcclxuICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoYWJzZW5jZVsnQF9BYnNlbmNlRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgcmVhc29uOiBhYnNlbmNlWydAX1JlYXNvbiddWzBdLFxyXG4gICAgICAgICAgICBub3RlOiBhYnNlbmNlWydAX05vdGUnXVswXSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGFic2VuY2VbJ0BfQ29kZUFsbERheURlc2NyaXB0aW9uJ11bMF0sXHJcbiAgICAgICAgICAgIHBlcmlvZHM6IGFic2VuY2UuUGVyaW9kc1swXS5QZXJpb2QubWFwKFxyXG4gICAgICAgICAgICAgIChwZXJpb2QpID0+XHJcbiAgICAgICAgICAgICAgICAoe1xyXG4gICAgICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihwZXJpb2RbJ0BfTnVtYmVyJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICByZWFzb246IHBlcmlvZFsnQF9SZWFzb24nXVswXSxcclxuICAgICAgICAgICAgICAgICAgY291cnNlOiBwZXJpb2RbJ0BfQ291cnNlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHN0YWZmOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogcGVyaW9kWydAX1N0YWZmJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhZmZHdTogcGVyaW9kWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogcGVyaW9kWydAX1N0YWZmRU1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgb3JnWWVhckd1OiBwZXJpb2RbJ0BfT3JnWWVhckdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB9IGFzIEFic2VudFBlcmlvZClcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgIH0pKSxcclxuICAgICAgICAgIHBlcmlvZEluZm9zOiB4bWxPYmplY3QuVG90YWxBY3Rpdml0aWVzWzBdLlBlcmlvZFRvdGFsLm1hcCgocGQsIGkpID0+ICh7XHJcbiAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKHBkWydAX051bWJlciddWzBdKSxcclxuICAgICAgICAgICAgdG90YWw6IHtcclxuICAgICAgICAgICAgICBleGN1c2VkOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsRXhjdXNlZFswXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICB0YXJkaWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVGFyZGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICB1bmV4Y3VzZWQ6IE51bWJlcih4bWxPYmplY3QuVG90YWxVbmV4Y3VzZWRbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgYWN0aXZpdGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbEFjdGl2aXRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgdW5leGN1c2VkVGFyZGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbFVuZXhjdXNlZFRhcmRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9KSkgYXMgUGVyaW9kSW5mb1tdLFxyXG4gICAgICAgIH0gYXMgQXR0ZW5kYW5jZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgZ3JhZGVib29rIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQHBhcmFtIHJlcG9ydGluZ1BlcmlvZEluZGV4IFRoZSB0aW1lZnJhbWUgdGhhdCB0aGUgZ3JhZGVib29rIHNob3VsZCByZXR1cm5cclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgR3JhZGVib29rIG9iamVjdFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBncmFkZWJvb2sgPSBhd2FpdCBjbGllbnQuZ3JhZGVib29rKCk7XHJcbiAgICogY29uc29sZS5sb2coZ3JhZGVib29rKTsgLy8geyBlcnJvcjogJycsIHR5cGU6ICdUcmFkaXRpb25hbCcsIHJlcG9ydGluZ1BlcmlvZDogey4uLn0sIGNvdXJzZXM6IFsuLi5dIH07XHJcbiAgICpcclxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDApIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggMCBhcyBcIjFzdCBRdWFydGVyIFByb2dyZXNzXCJcclxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDcpIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggNyBhcyBcIjR0aCBRdWFydGVyXCJcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgZ3JhZGVib29rKHJlcG9ydGluZ1BlcmlvZEluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxHcmFkZWJvb2s+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB4bWxPYmplY3Q6IEdyYWRlYm9va1hNTE9iamVjdCA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdHcmFkZWJvb2snLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgLi4uKHJlcG9ydGluZ1BlcmlvZEluZGV4ID8geyBSZXBvcnRpbmdQZXJpb2Q6IHJlcG9ydGluZ1BlcmlvZEluZGV4IH0gOiB7fSkgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXMoe1xyXG4gICAgICAgICAgZXJyb3I6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfRXJyb3JNZXNzYWdlJ11bMF0sXHJcbiAgICAgICAgICB0eXBlOiB4bWxPYmplY3QuR3JhZGVib29rWzBdWydAX1R5cGUnXVswXSxcclxuICAgICAgICAgIHJlcG9ydGluZ1BlcmlvZDoge1xyXG4gICAgICAgICAgICBjdXJyZW50OiB7XHJcbiAgICAgICAgICAgICAgaW5kZXg6XHJcbiAgICAgICAgICAgICAgICByZXBvcnRpbmdQZXJpb2RJbmRleCA/P1xyXG4gICAgICAgICAgICAgICAgTnVtYmVyKFxyXG4gICAgICAgICAgICAgICAgICB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZHNbMF0uUmVwb3J0UGVyaW9kLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAgICAgKHgpID0+IHhbJ0BfR3JhZGVQZXJpb2QnXVswXSA9PT0geG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfR3JhZGVQZXJpb2QnXVswXVxyXG4gICAgICAgICAgICAgICAgICApPy5bJ0BfSW5kZXgnXVswXVxyXG4gICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZSh4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfR3JhZGVQZXJpb2QnXVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYXZhaWxhYmxlOiB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZHNbMF0uUmVwb3J0UGVyaW9kLm1hcCgocGVyaW9kKSA9PiAoe1xyXG4gICAgICAgICAgICAgIGRhdGU6IHsgc3RhcnQ6IG5ldyBEYXRlKHBlcmlvZFsnQF9TdGFydERhdGUnXVswXSksIGVuZDogbmV3IERhdGUocGVyaW9kWydAX0VuZERhdGUnXVswXSkgfSxcclxuICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfR3JhZGVQZXJpb2QnXVswXSxcclxuICAgICAgICAgICAgICBpbmRleDogTnVtYmVyKHBlcmlvZFsnQF9JbmRleCddWzBdKSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNvdXJzZXM6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uQ291cnNlc1swXS5Db3Vyc2UubWFwKChjb3Vyc2UpID0+ICh7XHJcbiAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKGNvdXJzZVsnQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgIHRpdGxlOiBjb3Vyc2VbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgcm9vbTogY291cnNlWydAX1Jvb20nXVswXSxcclxuICAgICAgICAgICAgc3RhZmY6IHtcclxuICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfU3RhZmYnXVswXSxcclxuICAgICAgICAgICAgICBlbWFpbDogY291cnNlWydAX1N0YWZmRU1haWwnXVswXSxcclxuICAgICAgICAgICAgICBzdGFmZkd1OiBjb3Vyc2VbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtYXJrczogY291cnNlLk1hcmtzWzBdLk1hcmsubWFwKChtYXJrKSA9PiAoe1xyXG4gICAgICAgICAgICAgIG5hbWU6IG1hcmtbJ0BfTWFya05hbWUnXVswXSxcclxuICAgICAgICAgICAgICBjYWxjdWxhdGVkU2NvcmU6IHtcclxuICAgICAgICAgICAgICAgIHN0cmluZzogbWFya1snQF9DYWxjdWxhdGVkU2NvcmVTdHJpbmcnXVswXSxcclxuICAgICAgICAgICAgICAgIHJhdzogTnVtYmVyKG1hcmtbJ0BfQ2FsY3VsYXRlZFNjb3JlUmF3J11bMF0pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgd2VpZ2h0ZWRDYXRlZ29yaWVzOlxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG1hcmtbJ0dyYWRlQ2FsY3VsYXRpb25TdW1tYXJ5J11bMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgID8gbWFya1snR3JhZGVDYWxjdWxhdGlvblN1bW1hcnknXVswXS5Bc3NpZ25tZW50R3JhZGVDYWxjLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICh3ZWlnaHRlZCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB3ZWlnaHRlZFsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXRlZE1hcms6IHdlaWdodGVkWydAX0NhbGN1bGF0ZWRNYXJrJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmFsdWF0ZWQ6IHdlaWdodGVkWydAX1dlaWdodGVkUGN0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFuZGFyZDogd2VpZ2h0ZWRbJ0BfV2VpZ2h0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IE51bWJlcih3ZWlnaHRlZFsnQF9Qb2ludHMnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NzaWJsZTogTnVtYmVyKHdlaWdodGVkWydAX1BvaW50c1Bvc3NpYmxlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgV2VpZ2h0ZWRDYXRlZ29yeSlcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgYXNzaWdubWVudHM6IG1hcmsuQXNzaWdubWVudHNbMF0uQXNzaWdubWVudC5tYXAoKGFzc2lnbm1lbnQpID0+ICh7XHJcbiAgICAgICAgICAgICAgICBncmFkZWJvb2tJZDogYXNzaWdubWVudFsnQF9HcmFkZWJvb2tJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogYXNzaWdubWVudFsnQF9NZWFzdXJlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBhc3NpZ25tZW50WydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgZHVlOiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0R1ZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2NvcmU6IHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogYXNzaWdubWVudFsnQF9TY29yZVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgdmFsdWU6IGFzc2lnbm1lbnRbJ0BfU2NvcmUnXVswXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwb2ludHM6IGFzc2lnbm1lbnRbJ0BfUG9pbnRzJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBub3RlczogYXNzaWdubWVudFsnQF9Ob3RlcyddWzBdLFxyXG4gICAgICAgICAgICAgICAgdGVhY2hlcklkOiBhc3NpZ25tZW50WydAX1RlYWNoZXJJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGFzc2lnbm1lbnRbJ0BfTWVhc3VyZURlc2NyaXB0aW9uJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBoYXNEcm9wYm94OiBKU09OLnBhcnNlKGFzc2lnbm1lbnRbJ0BfSGFzRHJvcEJveCddWzBdKSxcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRJZDogYXNzaWdubWVudFsnQF9TdHVkZW50SUQnXVswXSxcclxuICAgICAgICAgICAgICAgIGRyb3Bib3hEYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0Ryb3BTdGFydERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9Ecm9wRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6XHJcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiBhc3NpZ25tZW50LlJlc291cmNlc1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICA/IChhc3NpZ25tZW50LlJlc291cmNlc1swXS5SZXNvdXJjZS5tYXAoKHJzcmMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyc3JjWydAX1R5cGUnXVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ0ZpbGUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZVJzcmMgPSByc3JjIGFzIEZpbGVSZXNvdXJjZVhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFJlc291cmNlVHlwZS5GSUxFLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlsZVJzcmNbJ0BfRmlsZVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBmaWxlUnNyY1snQF9GaWxlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVyaTogdGhpcy5ob3N0VXJsICsgZmlsZVJzcmNbJ0BfU2VydmVyRmlsZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShmaWxlUnNyY1snQF9SZXNvdXJjZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGZpbGVSc3JjWydAX1Jlc291cmNlSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBmaWxlUnNyY1snQF9SZXNvdXJjZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgRmlsZVJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ1VSTCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmxSc3JjID0gcnNyYyBhcyBVUkxSZXNvdXJjZVhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdXJsUnNyY1snQF9VUkwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUmVzb3VyY2VUeXBlLlVSTCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSh1cmxSc3JjWydAX1Jlc291cmNlRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdXJsUnNyY1snQF9SZXNvdXJjZUlEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdXJsUnNyY1snQF9SZXNvdXJjZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdXJsUnNyY1snQF9SZXNvdXJjZURlc2NyaXB0aW9uJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHVybFJzcmNbJ0BfU2VydmVyRmlsZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgVVJMUmVzb3VyY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlaihgVHlwZSAke3JzcmNbJ0BfVHlwZSddWzBdfSBkb2VzIG5vdCBleGlzdCBhcyBhIHR5cGUuIEFkZCBpdCB0byB0eXBlIGRlY2xhcmF0aW9ucy5gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfSkgYXMgKEZpbGVSZXNvdXJjZSB8IFVSTFJlc291cmNlKVtdKVxyXG4gICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgfSkpIGFzIEFzc2lnbm1lbnRbXSxcclxuICAgICAgICAgICAgfSkpIGFzIE1hcmtbXSxcclxuICAgICAgICAgIH0pKSxcclxuICAgICAgICB9IGFzIEdyYWRlYm9vayk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG1lc3NhZ2VzKCk6IFByb21pc2U8TWVzc2FnZVtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeG1sT2JqZWN0OiBNZXNzYWdlWE1MT2JqZWN0ID0gYXdhaXQgc3VwZXIucHJvY2Vzc1JlcXVlc3Qoe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0dldFBYUE1lc3NhZ2VzJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXMoXHJcbiAgICAgICAgICB4bWxPYmplY3QuUFhQTWVzc2FnZXNEYXRhWzBdLk1lc3NhZ2VMaXN0aW5nc1swXS5NZXNzYWdlTGlzdGluZy5tYXAoXHJcbiAgICAgICAgICAgIChtZXNzYWdlKSA9PiBuZXcgTWVzc2FnZShtZXNzYWdlLCBzdXBlci5jcmVkZW50aWFscywgdGhpcy5ob3N0VXJsKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgaW5mbyBvZiBhIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyBTdHVkZW50SW5mbyBvYmplY3RcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYGpzXHJcbiAgICogc3R1ZGVudEluZm8oKS50aGVuKGNvbnNvbGUubG9nKSAvLyAtPiB7IHN0dWRlbnQ6IHsgbmFtZTogJ0V2YW4gRGF2aXMnLCBuaWNrbmFtZTogJycsIGxhc3ROYW1lOiAnRGF2aXMnIH0sIC4uLn1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc3R1ZGVudEluZm8oKTogUHJvbWlzZTxTdHVkZW50SW5mbz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFN0dWRlbnRJbmZvPihhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB4bWxPYmplY3REYXRhOiBTdHVkZW50SW5mb1hNTE9iamVjdCA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50SW5mbycsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJlcyh7XHJcbiAgICAgICAgICBzdHVkZW50OiB7XHJcbiAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRm9ybWF0dGVkTmFtZVswXSxcclxuICAgICAgICAgICAgbGFzdE5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5MYXN0TmFtZUdvZXNCeVswXSxcclxuICAgICAgICAgICAgbmlja25hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5OaWNrTmFtZVswXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBiaXJ0aERhdGU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5CaXJ0aERhdGVbMF0sXHJcbiAgICAgICAgICB0cmFjazogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlRyYWNrWzBdLFxyXG4gICAgICAgICAgYWRkcmVzczogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLmJyWzBdLFxyXG4gICAgICAgICAgY291bnNlbG9yOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Db3Vuc2Vsb3JOYW1lWzBdLFxyXG4gICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvckVtYWlsWzBdLFxyXG4gICAgICAgICAgICBzdGFmZkd1OiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ291bnNlbG9yU3RhZmZHVVswXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjdXJyZW50U2Nob29sOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ3VycmVudFNjaG9vbFswXSxcclxuICAgICAgICAgIGRlbnRpc3Q6IHtcclxuICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfRXh0biddWzBdLFxyXG4gICAgICAgICAgICBvZmZpY2U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5EZW50aXN0WzBdWydAX09mZmljZSddWzBdLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHBoeXNpY2lhbjoge1xyXG4gICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGh5c2ljaWFuWzBdWydAX05hbWUnXVswXSxcclxuICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5bMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9FeHRuJ11bMF0sXHJcbiAgICAgICAgICAgIGhvc3BpdGFsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGh5c2ljaWFuWzBdWydAX0hvc3BpdGFsJ11bMF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZW1haWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5FTWFpbFswXSxcclxuICAgICAgICAgIGVtZXJnZW5jeUNvbnRhY3RzOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uRW1lcmdlbmN5Q29udGFjdHNbMF0uRW1lcmdlbmN5Q29udGFjdC5tYXAoXHJcbiAgICAgICAgICAgIChjb250YWN0KSA9PiAoe1xyXG4gICAgICAgICAgICAgIG5hbWU6IGNvbnRhY3RbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICAgICAgICBob21lOiBjb250YWN0WydAX0hvbWVQaG9uZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgbW9iaWxlOiBjb250YWN0WydAX01vYmlsZVBob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBvdGhlcjogY29udGFjdFsnQF9PdGhlclBob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB3b3JrOiBjb250YWN0WydAX1dvcmtQaG9uZSddWzBdLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgcmVsYXRpb25zaGlwOiBjb250YWN0WydAX1JlbGF0aW9uc2hpcCddWzBdLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKSxcclxuICAgICAgICAgIGdlbmRlcjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HZW5kZXJbMF0sXHJcbiAgICAgICAgICBncmFkZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HcmFkZVswXSxcclxuICAgICAgICAgIGxvY2tlckluZm9SZWNvcmRzOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkxvY2tlckluZm9SZWNvcmRzWzBdLFxyXG4gICAgICAgICAgaG9tZUxhbmd1YWdlOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZUxhbmd1YWdlWzBdLFxyXG4gICAgICAgICAgaG9tZVJvb206IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lUm9vbVswXSxcclxuICAgICAgICAgIGhvbWVSb29tVGVhY2hlcjoge1xyXG4gICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoRU1haWxbMF0sXHJcbiAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lUm9vbVRjaFswXSxcclxuICAgICAgICAgICAgc3RhZmZHdTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoU3RhZmZHVVswXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhZGRpdGlvbmFsSW5mbzogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlVzZXJEZWZpbmVkR3JvdXBCb3hlc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94Lm1hcChcclxuICAgICAgICAgICAgKGRlZmluZWRCb3gpID0+ICh7XHJcbiAgICAgICAgICAgICAgaWQ6IGRlZmluZWRCb3hbJ0BfR3JvdXBCb3hJRCddWzBdLFxyXG4gICAgICAgICAgICAgIHR5cGU6IGRlZmluZWRCb3hbJ0BfR3JvdXBCb3hMYWJlbCddWzBdLFxyXG4gICAgICAgICAgICAgIHZjSWQ6IGRlZmluZWRCb3hbJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgIGl0ZW1zOiBkZWZpbmVkQm94LlVzZXJEZWZpbmVkSXRlbXNbMF0uVXNlckRlZmluZWRJdGVtLm1hcCgoaXRlbSkgPT4gKHtcclxuICAgICAgICAgICAgICAgIHNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICBlbGVtZW50OiBpdGVtWydAX1NvdXJjZUVsZW1lbnQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgb2JqZWN0OiBpdGVtWydAX1NvdXJjZU9iamVjdCddWzBdLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZjSWQ6IGl0ZW1bJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1bJ0BfVmFsdWUnXVswXSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IGl0ZW1bJ0BfSXRlbVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICB9KSkgYXMgQWRkaXRpb25hbEluZm9JdGVtW10sXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICApIGFzIEFkZGl0aW9uYWxJbmZvW10sXHJcbiAgICAgICAgfSBhcyBTdHVkZW50SW5mbyk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGU6IERhdGUpIHtcclxuICAgIHJldHVybiBzdXBlci5wcm9jZXNzUmVxdWVzdDxDYWxlbmRhclhNTE9iamVjdD4oe1xyXG4gICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudENhbGVuZGFyJyxcclxuICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgUmVxdWVzdERhdGU6IGRhdGUudG9JU09TdHJpbmcoKSB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcHJvdmlkZSBmb3IgY2FsZW5kYXIgbWV0aG9kLiBUaGlzIGlzIG9wdGlvbmFsXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIENhbGVuZGFyIG9iamVjdFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBjbGllbnQuY2FsZW5kYXIoeyBpbnRlcnZhbDogeyBzdGFydDogbmV3IERhdGUoJzUvMS8yMDIyJyksIGVuZDogbmV3IERhdGUoJzgvMS8yMDIxJykgfSwgY29uY3VycmVuY3k6IG51bGwgfSk7IC8vIC0+IExpbWl0bGVzcyBjb25jdXJyZW5jeSAobm90IHJlY29tbWVuZGVkKVxyXG4gICAqXHJcbiAgICogY29uc3QgY2FsZW5kYXIgPSBhd2FpdCBjbGllbnQuY2FsZW5kYXIoKTtcclxuICAgKiBjb25zb2xlLmxvZyhjYWxlbmRhcik7IC8vIC0+IHsgc2Nob29sRGF0ZTogey4uLn0sIG91dHB1dFJhbmdlOiB7Li4ufSwgZXZlbnRzOiBbLi4uXSB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGNhbGVuZGFyKG9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyk6IFByb21pc2U8Q2FsZW5kYXI+IHtcclxuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBDYWxlbmRhck9wdGlvbnMgPSB7XHJcbiAgICAgIGNvbmN1cnJlbmN5OiA3LFxyXG4gICAgICAuLi5vcHRpb25zLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgc2Nob29sU3RhcnREYXRlOiBEYXRlIHwgbnVtYmVyID0gb3B0aW9ucy5pbnRlcnZhbC5zdGFydDtcclxuICAgICAgICBsZXQgc2Nob29sRW5kRGF0ZTogRGF0ZSB8IG51bWJlciA9IG9wdGlvbnMuaW50ZXJ2YWwuZW5kO1xyXG5cclxuICAgICAgICBjb25zdCBtb250aHNXaXRoaW5TY2hvb2xZZWFyID0gZWFjaE1vbnRoT2ZJbnRlcnZhbCh7IHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsIGVuZDogc2Nob29sRW5kRGF0ZSB9KTtcclxuICAgICAgICBjb25zdCBhbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyOiBDYWxlbmRhclhNTE9iamVjdFtdID1cclxuICAgICAgICAgIGRlZmF1bHRPcHRpb25zLmNvbmN1cnJlbmN5ID09IG51bGxcclxuICAgICAgICAgICAgPyBhd2FpdCBQcm9taXNlLmFsbChtb250aHNXaXRoaW5TY2hvb2xZZWFyLm1hcCgoZGF0ZSkgPT4gdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpKSlcclxuICAgICAgICAgICAgOiBhd2FpdCBhc3luY1Bvb2woZGVmYXVsdE9wdGlvbnMuY29uY3VycmVuY3ksIG1vbnRoc1dpdGhpblNjaG9vbFllYXIsIChkYXRlKSA9PlxyXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICBsZXQgbWVtbzogQ2FsZW5kYXIgfCBudWxsID0gbnVsbDtcclxuICAgICAgICBjb25zdCBldmVudHMgPSBhbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyLnJlZHVjZSgocHJldiwgZXZlbnRzKSA9PiB7XHJcbiAgICAgICAgICBpZiAobWVtbyA9PSBudWxsKVxyXG4gICAgICAgICAgICBtZW1vID0ge1xyXG4gICAgICAgICAgICAgIHNjaG9vbERhdGU6IHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF1bJ0BfU2Nob29sRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIG91dHB1dFJhbmdlOiB7XHJcbiAgICAgICAgICAgICAgICBzdGFydDogc2Nob29sU3RhcnREYXRlLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBzY2hvb2xFbmREYXRlLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZXZlbnRzOiBbXSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIGxldCByZXN0OiBDYWxlbmRhciA9IHtcclxuICAgICAgICAgICAgLi4ubWVtbywgLy8gVGhpcyBpcyB0byBwcmV2ZW50IHJlLWluaXRpYWxpemluZyBEYXRlIG9iamVjdHMgaW4gb3JkZXIgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxyXG4gICAgICAgICAgICBldmVudHM6IFtcclxuICAgICAgICAgICAgICAuLi4ocHJldi5ldmVudHMgPyBwcmV2LmV2ZW50cyA6IFtdKSxcclxuICAgICAgICAgICAgICAuLi4oZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXS5FdmVudExpc3RzWzBdLkV2ZW50TGlzdC5tYXAoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50WydAX0RheVR5cGUnXVswXSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5BU1NJR05NRU5UOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNzaWdubWVudEV2ZW50ID0gZXZlbnQgYXMgQXNzaWdubWVudEV2ZW50WE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogYXNzaWdubWVudEV2ZW50WydAX1RpdGxlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBhZGRMaW5rRGF0YTogYXNzaWdubWVudEV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBhZ3U6IGFzc2lnbm1lbnRFdmVudFsnQF9BR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGFzc2lnbm1lbnRFdmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGd1OiBhc3NpZ25tZW50RXZlbnRbJ0BfREdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBhc3NpZ25tZW50RXZlbnRbJ0BfTGluayddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBhc3NpZ25tZW50RXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuQVNTSUdOTUVOVCxcclxuICAgICAgICAgICAgICAgICAgICAgIHZpZXdUeXBlOiBhc3NpZ25tZW50RXZlbnRbJ0BfVmlld1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICB9IGFzIEFzc2lnbm1lbnRFdmVudDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5IT0xJREFZOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBldmVudFsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLkhPTElEQVksXHJcbiAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IGV2ZW50WydAX1N0YXJ0VGltZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICB9IGFzIEhvbGlkYXlFdmVudDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5SRUdVTEFSOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVndWxhckV2ZW50ID0gZXZlbnQgYXMgUmVndWxhckV2ZW50WE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogcmVndWxhckV2ZW50WydAX1RpdGxlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBhZ3U6IHJlZ3VsYXJFdmVudFsnQF9BR1UnXSA/IHJlZ3VsYXJFdmVudFsnQF9BR1UnXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKHJlZ3VsYXJFdmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHJlZ3VsYXJFdmVudFsnQF9FdnREZXNjcmlwdGlvbiddID8gcmVndWxhckV2ZW50WydAX0V2dERlc2NyaXB0aW9uJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBkZ3U6IHJlZ3VsYXJFdmVudFsnQF9ER1UnXSA/IHJlZ3VsYXJFdmVudFsnQF9ER1UnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IHJlZ3VsYXJFdmVudFsnQF9MaW5rJ10gPyByZWd1bGFyRXZlbnRbJ0BfTGluayddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiByZWd1bGFyRXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuUkVHVUxBUixcclxuICAgICAgICAgICAgICAgICAgICAgIHZpZXdUeXBlOiByZWd1bGFyRXZlbnRbJ0BfVmlld1R5cGUnXSA/IHJlZ3VsYXJFdmVudFsnQF9WaWV3VHlwZSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYWRkTGlua0RhdGE6IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddID8gcmVndWxhckV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgfSBhcyBSZWd1bGFyRXZlbnQ7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KSBhcyBFdmVudFtdKSxcclxuICAgICAgICAgICAgXSBhcyBFdmVudFtdLFxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gcmVzdDtcclxuICAgICAgICB9LCB7fSBhcyBDYWxlbmRhcik7XHJcblxyXG4gICAgICAgIHJlcyh7IC4uLmV2ZW50cywgZXZlbnRzOiBfLnVuaXFCeShldmVudHMuZXZlbnRzLCAoaXRlbSkgPT4gaXRlbS50aXRsZSkgfSBhcyBDYWxlbmRhcik7XHJcbiAgICAgICAgLy8gcmVzKGFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqKGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19