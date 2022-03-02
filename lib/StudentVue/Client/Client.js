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
     * @param {number} reportingPeriodIndex The timeframe that the gradebook should return
     * @returns {Promise<Gradebook>} Returns a Gradebook object
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
    /**
     * Get a list of messages of the student
     * @returns {Promise<Message[]>} Returns an array of messages of the student
     * @example
     * ```js
     * await client.messages(); // -> [Message]
     * ```
     */


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50Iiwic29hcCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiYXR0ZW5kYW5jZSIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJhdHRlbmRhbmNlWE1MT2JqZWN0IiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwieG1sT2JqZWN0IiwiQXR0ZW5kYW5jZSIsIkFic2VuY2VzIiwiQWJzZW5jZSIsImFic2VuY2UiLCJQZXJpb2RzIiwiUGVyaW9kIiwicGVyaW9kIiwiTnVtYmVyIiwibmFtZSIsInJlYXNvbiIsImNvdXJzZSIsInN0YWZmIiwic3RhZmZHdSIsImVtYWlsIiwib3JnWWVhckd1IiwiZGF0ZSIsIkRhdGUiLCJub3RlIiwiZGVzY3JpcHRpb24iLCJwZXJpb2RzIiwiVG90YWxBY3Rpdml0aWVzIiwiUGVyaW9kVG90YWwiLCJwZCIsImkiLCJ0b3RhbCIsImV4Y3VzZWQiLCJUb3RhbEV4Y3VzZWQiLCJ0YXJkaWVzIiwiVG90YWxUYXJkaWVzIiwidW5leGN1c2VkIiwiVG90YWxVbmV4Y3VzZWQiLCJhY3Rpdml0aWVzIiwidW5leGN1c2VkVGFyZGllcyIsIlRvdGFsVW5leGN1c2VkVGFyZGllcyIsInR5cGUiLCJzdGFydCIsImVuZCIsInNjaG9vbE5hbWUiLCJhYnNlbmNlcyIsInBlcmlvZEluZm9zIiwiZSIsImdyYWRlYm9vayIsInJlcG9ydGluZ1BlcmlvZEluZGV4IiwiUmVwb3J0aW5nUGVyaW9kIiwiR3JhZGVib29rIiwiUmVwb3J0aW5nUGVyaW9kcyIsIlJlcG9ydFBlcmlvZCIsImluZGV4IiwiQ291cnNlcyIsIkNvdXJzZSIsIk1hcmtzIiwiTWFyayIsIm1hcmsiLCJBc3NpZ25tZW50cyIsIkFzc2lnbm1lbnQiLCJhc3NpZ25tZW50IiwiZ3JhZGVib29rSWQiLCJkdWUiLCJzY29yZSIsInZhbHVlIiwicG9pbnRzIiwibm90ZXMiLCJ0ZWFjaGVySWQiLCJoYXNEcm9wYm94IiwiSlNPTiIsInBhcnNlIiwic3R1ZGVudElkIiwiZHJvcGJveERhdGUiLCJyZXNvdXJjZXMiLCJSZXNvdXJjZXMiLCJSZXNvdXJjZSIsIm1hcCIsInJzcmMiLCJmaWxlUnNyYyIsIlJlc291cmNlVHlwZSIsIkZJTEUiLCJmaWxlIiwidXJpIiwicmVzb3VyY2UiLCJpZCIsInVybFJzcmMiLCJ1cmwiLCJVUkwiLCJwYXRoIiwiY2FsY3VsYXRlZFNjb3JlIiwic3RyaW5nIiwicmF3Iiwid2VpZ2h0ZWRDYXRlZ29yaWVzIiwiQXNzaWdubWVudEdyYWRlQ2FsYyIsIndlaWdodGVkIiwiY2FsY3VsYXRlZE1hcmsiLCJ3ZWlnaHQiLCJldmFsdWF0ZWQiLCJzdGFuZGFyZCIsImN1cnJlbnQiLCJwb3NzaWJsZSIsImFzc2lnbm1lbnRzIiwidGl0bGUiLCJyb29tIiwibWFya3MiLCJlcnJvciIsInJlcG9ydGluZ1BlcmlvZCIsImZpbmQiLCJ4IiwiYXZhaWxhYmxlIiwiY291cnNlcyIsIm1lc3NhZ2VzIiwiUFhQTWVzc2FnZXNEYXRhIiwiTWVzc2FnZUxpc3RpbmdzIiwiTWVzc2FnZUxpc3RpbmciLCJtZXNzYWdlIiwiTWVzc2FnZSIsInN0dWRlbnRJbmZvIiwieG1sT2JqZWN0RGF0YSIsIlN0dWRlbnRJbmZvIiwiQWRkcmVzcyIsIkVtZXJnZW5jeUNvbnRhY3RzIiwiRW1lcmdlbmN5Q29udGFjdCIsImNvbnRhY3QiLCJwaG9uZSIsImhvbWUiLCJtb2JpbGUiLCJvdGhlciIsIndvcmsiLCJyZWxhdGlvbnNoaXAiLCJVc2VyRGVmaW5lZEdyb3VwQm94ZXMiLCJVc2VyRGVmaW5lZEdyb3VwQm94IiwiZGVmaW5lZEJveCIsIlVzZXJEZWZpbmVkSXRlbXMiLCJVc2VyRGVmaW5lZEl0ZW0iLCJpdGVtIiwic291cmNlIiwiZWxlbWVudCIsIm9iamVjdCIsInZjSWQiLCJpdGVtcyIsInN0dWRlbnQiLCJGb3JtYXR0ZWROYW1lIiwibGFzdE5hbWUiLCJMYXN0TmFtZUdvZXNCeSIsIm5pY2tuYW1lIiwiTmlja05hbWUiLCJiaXJ0aERhdGUiLCJCaXJ0aERhdGUiLCJ0cmFjayIsIlRyYWNrIiwiYWRkcmVzcyIsImJyIiwiY291bnNlbG9yIiwiQ291bnNlbG9yTmFtZSIsIkNvdW5zZWxvckVtYWlsIiwiQ291bnNlbG9yU3RhZmZHVSIsImN1cnJlbnRTY2hvb2wiLCJDdXJyZW50U2Nob29sIiwiZGVudGlzdCIsIkRlbnRpc3QiLCJleHRuIiwib2ZmaWNlIiwicGh5c2ljaWFuIiwiUGh5c2ljaWFuIiwiaG9zcGl0YWwiLCJFTWFpbCIsImVtZXJnZW5jeUNvbnRhY3RzIiwiZ2VuZGVyIiwiR2VuZGVyIiwiZ3JhZGUiLCJHcmFkZSIsImxvY2tlckluZm9SZWNvcmRzIiwiTG9ja2VySW5mb1JlY29yZHMiLCJob21lTGFuZ3VhZ2UiLCJIb21lTGFuZ3VhZ2UiLCJob21lUm9vbSIsIkhvbWVSb29tIiwiaG9tZVJvb21UZWFjaGVyIiwiSG9tZVJvb21UY2hFTWFpbCIsIkhvbWVSb29tVGNoIiwiSG9tZVJvb21UY2hTdGFmZkdVIiwiYWRkaXRpb25hbEluZm8iLCJmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsIiwiUmVxdWVzdERhdGUiLCJ0b0lTT1N0cmluZyIsImNhbGVuZGFyIiwib3B0aW9ucyIsImRlZmF1bHRPcHRpb25zIiwiY29uY3VycmVuY3kiLCJzY2hvb2xTdGFydERhdGUiLCJpbnRlcnZhbCIsInNjaG9vbEVuZERhdGUiLCJtb250aHNXaXRoaW5TY2hvb2xZZWFyIiwiYWxsRXZlbnRzV2l0aGluU2Nob29sWWVhciIsImFsbCIsIm1lbW8iLCJldmVudHMiLCJyZWR1Y2UiLCJwcmV2Iiwic2Nob29sRGF0ZSIsIkNhbGVuZGFyTGlzdGluZyIsIm91dHB1dFJhbmdlIiwiRXZlbnRMaXN0cyIsIkV2ZW50TGlzdCIsImV2ZW50IiwiRXZlbnRUeXBlIiwiQVNTSUdOTUVOVCIsImFzc2lnbm1lbnRFdmVudCIsImFkZExpbmtEYXRhIiwiYWd1IiwiZGd1IiwibGluayIsInN0YXJ0VGltZSIsInZpZXdUeXBlIiwiSE9MSURBWSIsIlJFR1VMQVIiLCJyZWd1bGFyRXZlbnQiLCJ1bmRlZmluZWQiLCJyZXN0IiwiXyIsInVuaXFCeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCZSxRQUFNQSxNQUFOLFNBQXFCQyxjQUFLRCxNQUExQixDQUFpQztBQUU5Q0UsSUFBQUEsV0FBVyxDQUFDQyxXQUFELEVBQWdDQyxPQUFoQyxFQUFpRDtBQUMxRCxZQUFNRCxXQUFOO0FBQ0EsV0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNTQyxJQUFBQSxVQUFVLEdBQXdCO0FBQ3ZDLGFBQU8sSUFBSUMsT0FBSixDQUFZLE9BQU9DLEdBQVAsRUFBWUMsR0FBWixLQUFvQjtBQUNyQyxZQUFJO0FBQ0YsZ0JBQU1DLG1CQUF3QyxHQUFHLE1BQU0sTUFBTUMsY0FBTixDQUFxQjtBQUMxRUMsWUFBQUEsVUFBVSxFQUFFLFlBRDhEO0FBRTFFQyxZQUFBQSxRQUFRLEVBQUU7QUFDUkMsY0FBQUEsVUFBVSxFQUFFO0FBREo7QUFGZ0UsV0FBckIsQ0FBdkQ7QUFPQSxnQkFBTUMsU0FBUyxHQUFHTCxtQkFBbUIsQ0FBQ00sVUFBcEIsQ0FBK0IsQ0FBL0IsQ0FBbEI7QUFSRSxtQkFrQlVELFNBQVMsQ0FBQ0UsUUFBVixDQUFtQixDQUFuQixFQUFzQkMsT0FsQmhDOztBQUFBLG1CQWtCNkNDLE9BQUQ7QUFBQSxzQkFLakNBLE9BQU8sQ0FBQ0MsT0FBUixDQUFnQixDQUFoQixFQUFtQkMsTUFMYzs7QUFBQSxzQkFNdkNDLE1BQUQ7QUFBQSxxQkFDRztBQUNDQSxnQkFBQUEsTUFBTSxFQUFFQyxNQUFNLENBQUNELE1BQU0sQ0FBQyxVQUFELENBQU4sQ0FBbUIsQ0FBbkIsQ0FBRCxDQURmO0FBRUNFLGdCQUFBQSxJQUFJLEVBQUVGLE1BQU0sQ0FBQyxRQUFELENB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QUFyQjtBQWdEQSxtQkFBT3NCLElBQVA7QUFDRCxXQTlEYyxFQThEWixFQTlEWSxDQUFmO0FBZ0VBOU4sVUFBQUEsR0FBRyxDQUFDLEVBQUUsR0FBR3dNLE1BQUw7QUFBYUEsWUFBQUEsTUFBTSxFQUFFdUIsZ0JBQUVDLE1BQUYsQ0FBU3hCLE1BQU0sQ0FBQ0EsTUFBaEIsRUFBeUI5RCxJQUFEO0FBQUEscUJBQVVBLElBQUksQ0FBQ2pDLEtBQWY7QUFBQSxhQUF4QjtBQUFyQixXQUFELENBQUgsQ0E1RUUsQ0E2RUY7QUFDRCxTQTlFRCxDQThFRSxPQUFPekQsQ0FBUCxFQUFVO0FBQ1YvQyxVQUFBQSxHQUFHLENBQUMrQyxDQUFELENBQUg7QUFDRDtBQUNGLE9BbEZNLENBQVA7QUFtRkQ7O0FBMWI2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XHJcbmltcG9ydCB7IEFkZGl0aW9uYWxJbmZvLCBBZGRpdGlvbmFsSW5mb0l0ZW0sIFN0dWRlbnRJbmZvIH0gZnJvbSAnLi9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFN0dWRlbnRJbmZvWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9TdHVkZW50SW5mbyc7XHJcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4uL01lc3NhZ2UvTWVzc2FnZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VYTUxPYmplY3QgfSBmcm9tICcuLi9NZXNzYWdlL01lc3NhZ2UueG1sJztcclxuaW1wb3J0IHsgQXNzaWdubWVudEV2ZW50WE1MT2JqZWN0LCBDYWxlbmRhclhNTE9iamVjdCwgUmVndWxhckV2ZW50WE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9DYWxlbmRhcic7XHJcbmltcG9ydCB7IEFzc2lnbm1lbnRFdmVudCwgQ2FsZW5kYXIsIENhbGVuZGFyT3B0aW9ucywgRXZlbnQsIEhvbGlkYXlFdmVudCwgUmVndWxhckV2ZW50IH0gZnJvbSAnLi9JbnRlcmZhY2VzL0NhbGVuZGFyJztcclxuaW1wb3J0IHsgZWFjaE1vbnRoT2ZJbnRlcnZhbCwgaXNBZnRlciwgaXNCZWZvcmUsIGlzVGhpc01vbnRoIH0gZnJvbSAnZGF0ZS1mbnMnO1xyXG5pbXBvcnQgeyBGaWxlUmVzb3VyY2VYTUxPYmplY3QsIEdyYWRlYm9va1hNTE9iamVjdCwgVVJMUmVzb3VyY2VYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0dyYWRlYm9vayc7XHJcbmltcG9ydCB7IEF0dGVuZGFuY2VYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0F0dGVuZGFuY2UnO1xyXG5pbXBvcnQgRXZlbnRUeXBlIGZyb20gJy4uLy4uL0NvbnN0YW50cy9FdmVudFR5cGUnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBBc3NpZ25tZW50LCBGaWxlUmVzb3VyY2UsIEdyYWRlYm9vaywgTWFyaywgVVJMUmVzb3VyY2UsIFdlaWdodGVkQ2F0ZWdvcnkgfSBmcm9tICcuL0ludGVyZmFjZXMvR3JhZGVib29rJztcclxuaW1wb3J0IGFzeW5jUG9vbCBmcm9tICd0aW55LWFzeW5jLXBvb2wnO1xyXG5pbXBvcnQgUmVzb3VyY2VUeXBlIGZyb20gJy4uLy4uL0NvbnN0YW50cy9SZXNvdXJjZVR5cGUnO1xyXG5pbXBvcnQgeyBBYnNlbnRQZXJpb2QsIEF0dGVuZGFuY2UsIFBlcmlvZEluZm8gfSBmcm9tICcuL0ludGVyZmFjZXMvQXR0ZW5kYW5jZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQgZXh0ZW5kcyBzb2FwLkNsaWVudCB7XHJcbiAgcHJpdmF0ZSBob3N0VXJsOiBzdHJpbmc7XHJcbiAgY29uc3RydWN0b3IoY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsIGhvc3RVcmw6IHN0cmluZykge1xyXG4gICAgc3VwZXIoY3JlZGVudGlhbHMpO1xyXG4gICAgdGhpcy5ob3N0VXJsID0gaG9zdFVybDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGF0dGVuZGFuY2Ugb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGFuIEF0dGVuZGFuY2Ugb2JqZWN0XHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBgYGBqc1xyXG4gICAqIGNsaWVudC5hdHRlbmRhbmNlKClcclxuICAgKiAgLnRoZW4oY29uc29sZS5sb2cpOyAvLyAtPiB7IHR5cGU6ICdQZXJpb2QnLCBwZXJpb2Q6IHsuLi59LCBzY2hvb2xOYW1lOiAnVW5pdmVyc2l0eSBIaWdoIFNjaG9vbCcsIGFic2VuY2VzOiBbLi4uXSwgcGVyaW9kSW5mb3M6IFsuLi5dIH1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgYXR0ZW5kYW5jZSgpOiBQcm9taXNlPEF0dGVuZGFuY2U+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBhdHRlbmRhbmNlWE1MT2JqZWN0OiBBdHRlbmRhbmNlWE1MT2JqZWN0ID0gYXdhaXQgc3VwZXIucHJvY2Vzc1JlcXVlc3Qoe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0F0dGVuZGFuY2UnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHtcclxuICAgICAgICAgICAgY2hpbGRJbnRJZDogMCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHhtbE9iamVjdCA9IGF0dGVuZGFuY2VYTUxPYmplY3QuQXR0ZW5kYW5jZVswXTtcclxuXHJcbiAgICAgICAgcmVzKHtcclxuICAgICAgICAgIHR5cGU6IHhtbE9iamVjdFsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICBwZXJpb2Q6IHtcclxuICAgICAgICAgICAgdG90YWw6IE51bWJlcih4bWxPYmplY3RbJ0BfUGVyaW9kQ291bnQnXVswXSksXHJcbiAgICAgICAgICAgIHN0YXJ0OiBOdW1iZXIoeG1sT2JqZWN0WydAX1N0YXJ0UGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICBlbmQ6IE51bWJlcih4bWxPYmplY3RbJ0BfRW5kUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNjaG9vbE5hbWU6IHhtbE9iamVjdFsnQF9TY2hvb2xOYW1lJ11bMF0sXHJcbiAgICAgICAgICBhYnNlbmNlczogeG1sT2JqZWN0LkFic2VuY2VzWzBdLkFic2VuY2UubWFwKChhYnNlbmNlKSA9PiAoe1xyXG4gICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShhYnNlbmNlWydAX0Fic2VuY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICByZWFzb246IGFic2VuY2VbJ0BfUmVhc29uJ11bMF0sXHJcbiAgICAgICAgICAgIG5vdGU6IGFic2VuY2VbJ0BfTm90ZSddWzBdLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogYWJzZW5jZVsnQF9Db2RlQWxsRGF5RGVzY3JpcHRpb24nXVswXSxcclxuICAgICAgICAgICAgcGVyaW9kczogYWJzZW5jZS5QZXJpb2RzWzBdLlBlcmlvZC5tYXAoXHJcbiAgICAgICAgICAgICAgKHBlcmlvZCkgPT5cclxuICAgICAgICAgICAgICAgICh7XHJcbiAgICAgICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKHBlcmlvZFsnQF9OdW1iZXInXVswXSksXHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHJlYXNvbjogcGVyaW9kWydAX1JlYXNvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBjb3Vyc2U6IHBlcmlvZFsnQF9Db3Vyc2UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgc3RhZmY6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfU3RhZmYnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBwZXJpb2RbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBwZXJpb2RbJ0BfU3RhZmZFTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBvcmdZZWFyR3U6IHBlcmlvZFsnQF9PcmdZZWFyR1UnXVswXSxcclxuICAgICAgICAgICAgICAgIH0gYXMgQWJzZW50UGVyaW9kKVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgcGVyaW9kSW5mb3M6IHhtbE9iamVjdC5Ub3RhbEFjdGl2aXRpZXNbMF0uUGVyaW9kVG90YWwubWFwKChwZCwgaSkgPT4gKHtcclxuICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIocGRbJ0BfTnVtYmVyJ11bMF0pLFxyXG4gICAgICAgICAgICB0b3RhbDoge1xyXG4gICAgICAgICAgICAgIGV4Y3VzZWQ6IE51bWJlcih4bWxPYmplY3QuVG90YWxFeGN1c2VkWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHRhcmRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxUYXJkaWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHVuZXhjdXNlZDogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbFVuZXhjdXNlZFswXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsQWN0aXZpdGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICB1bmV4Y3VzZWRUYXJkaWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVW5leGN1c2VkVGFyZGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0pKSBhcyBQZXJpb2RJbmZvW10sXHJcbiAgICAgICAgfSBhcyBBdHRlbmRhbmNlKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlaihlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBncmFkZWJvb2sgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcGFyYW0ge251bWJlcn0gcmVwb3J0aW5nUGVyaW9kSW5kZXggVGhlIHRpbWVmcmFtZSB0aGF0IHRoZSBncmFkZWJvb2sgc2hvdWxkIHJldHVyblxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEdyYWRlYm9vaz59IFJldHVybnMgYSBHcmFkZWJvb2sgb2JqZWN0XHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IGdyYWRlYm9vayA9IGF3YWl0IGNsaWVudC5ncmFkZWJvb2soKTtcclxuICAgKiBjb25zb2xlLmxvZyhncmFkZWJvb2spOyAvLyB7IGVycm9yOiAnJywgdHlwZTogJ1RyYWRpdGlvbmFsJywgcmVwb3J0aW5nUGVyaW9kOiB7Li4ufSwgY291cnNlczogWy4uLl0gfTtcclxuICAgKlxyXG4gICAqIGF3YWl0IGNsaWVudC5ncmFkZWJvb2soMCkgLy8gU29tZSBzY2hvb2xzIHdpbGwgaGF2ZSBSZXBvcnRpbmdQZXJpb2RJbmRleCAwIGFzIFwiMXN0IFF1YXJ0ZXIgUHJvZ3Jlc3NcIlxyXG4gICAqIGF3YWl0IGNsaWVudC5ncmFkZWJvb2soNykgLy8gU29tZSBzY2hvb2xzIHdpbGwgaGF2ZSBSZXBvcnRpbmdQZXJpb2RJbmRleCA3IGFzIFwiNHRoIFF1YXJ0ZXJcIlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBncmFkZWJvb2socmVwb3J0aW5nUGVyaW9kSW5kZXg/OiBudW1iZXIpOiBQcm9taXNlPEdyYWRlYm9vaz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXMsIHJlaikgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHhtbE9iamVjdDogR3JhZGVib29rWE1MT2JqZWN0ID0gYXdhaXQgc3VwZXIucHJvY2Vzc1JlcXVlc3Qoe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0dyYWRlYm9vaycsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwLCAuLi4ocmVwb3J0aW5nUGVyaW9kSW5kZXggPyB7IFJlcG9ydGluZ1BlcmlvZDogcmVwb3J0aW5nUGVyaW9kSW5kZXggfSA6IHt9KSB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJlcyh7XHJcbiAgICAgICAgICBlcnJvcjogeG1sT2JqZWN0LkdyYWRlYm9va1swXVsnQF9FcnJvck1lc3NhZ2UnXVswXSxcclxuICAgICAgICAgIHR5cGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgcmVwb3J0aW5nUGVyaW9kOiB7XHJcbiAgICAgICAgICAgIGN1cnJlbnQ6IHtcclxuICAgICAgICAgICAgICBpbmRleDpcclxuICAgICAgICAgICAgICAgIHJlcG9ydGluZ1BlcmlvZEluZGV4ID8/XHJcbiAgICAgICAgICAgICAgICBOdW1iZXIoXHJcbiAgICAgICAgICAgICAgICAgIHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QuZmluZChcclxuICAgICAgICAgICAgICAgICAgICAoeCkgPT4geFsnQF9HcmFkZVBlcmlvZCddWzBdID09PSB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9HcmFkZVBlcmlvZCddWzBdXHJcbiAgICAgICAgICAgICAgICAgICk/LlsnQF9JbmRleCddWzBdXHJcbiAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9TdGFydERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0VuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9HcmFkZVBlcmlvZCddWzBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhdmFpbGFibGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QubWFwKChwZXJpb2QpID0+ICh7XHJcbiAgICAgICAgICAgICAgZGF0ZTogeyBzdGFydDogbmV3IERhdGUocGVyaW9kWydAX1N0YXJ0RGF0ZSddWzBdKSwgZW5kOiBuZXcgRGF0ZShwZXJpb2RbJ0BfRW5kRGF0ZSddWzBdKSB9LFxyXG4gICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9HcmFkZVBlcmlvZCddWzBdLFxyXG4gICAgICAgICAgICAgIGluZGV4OiBOdW1iZXIocGVyaW9kWydAX0luZGV4J11bMF0pLFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY291cnNlczogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5Db3Vyc2VzWzBdLkNvdXJzZS5tYXAoKGNvdXJzZSkgPT4gKHtcclxuICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIoY291cnNlWydAX1BlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgdGl0bGU6IGNvdXJzZVsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICByb29tOiBjb3Vyc2VbJ0BfUm9vbSddWzBdLFxyXG4gICAgICAgICAgICBzdGFmZjoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9TdGFmZiddWzBdLFxyXG4gICAgICAgICAgICAgIGVtYWlsOiBjb3Vyc2VbJ0BfU3RhZmZFTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgIHN0YWZmR3U6IGNvdXJzZVsnQF9TdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1hcmtzOiBjb3Vyc2UuTWFya3NbMF0uTWFyay5tYXAoKG1hcmspID0+ICh7XHJcbiAgICAgICAgICAgICAgbmFtZTogbWFya1snQF9NYXJrTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIGNhbGN1bGF0ZWRTY29yZToge1xyXG4gICAgICAgICAgICAgICAgc3RyaW5nOiBtYXJrWydAX0NhbGN1bGF0ZWRTY29yZVN0cmluZyddWzBdLFxyXG4gICAgICAgICAgICAgICAgcmF3OiBOdW1iZXIobWFya1snQF9DYWxjdWxhdGVkU2NvcmVSYXcnXVswXSksXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB3ZWlnaHRlZENhdGVnb3JpZXM6XHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgbWFya1snR3JhZGVDYWxjdWxhdGlvblN1bW1hcnknXVswXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgPyBtYXJrWydHcmFkZUNhbGN1bGF0aW9uU3VtbWFyeSddWzBdLkFzc2lnbm1lbnRHcmFkZUNhbGMubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgKHdlaWdodGVkKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHdlaWdodGVkWydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkTWFyazogd2VpZ2h0ZWRbJ0BfQ2FsY3VsYXRlZE1hcmsnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2YWx1YXRlZDogd2VpZ2h0ZWRbJ0BfV2VpZ2h0ZWRQY3QnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkOiB3ZWlnaHRlZFsnQF9XZWlnaHQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDogTnVtYmVyKHdlaWdodGVkWydAX1BvaW50cyddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3NpYmxlOiBOdW1iZXIod2VpZ2h0ZWRbJ0BfUG9pbnRzUG9zc2libGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBXZWlnaHRlZENhdGVnb3J5KVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgICBhc3NpZ25tZW50czogbWFyay5Bc3NpZ25tZW50c1swXS5Bc3NpZ25tZW50Lm1hcCgoYXNzaWdubWVudCkgPT4gKHtcclxuICAgICAgICAgICAgICAgIGdyYWRlYm9va0lkOiBhc3NpZ25tZW50WydAX0dyYWRlYm9va0lEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBhc3NpZ25tZW50WydAX01lYXN1cmUnXVswXSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IGFzc2lnbm1lbnRbJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICBkdWU6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRHVlRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzY29yZToge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiBhc3NpZ25tZW50WydAX1Njb3JlVHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogYXNzaWdubWVudFsnQF9TY29yZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHBvaW50czogYXNzaWdubWVudFsnQF9Qb2ludHMnXVswXSxcclxuICAgICAgICAgICAgICAgIG5vdGVzOiBhc3NpZ25tZW50WydAX05vdGVzJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB0ZWFjaGVySWQ6IGFzc2lnbm1lbnRbJ0BfVGVhY2hlcklEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYXNzaWdubWVudFsnQF9NZWFzdXJlRGVzY3JpcHRpb24nXVswXSxcclxuICAgICAgICAgICAgICAgIGhhc0Ryb3Bib3g6IEpTT04ucGFyc2UoYXNzaWdubWVudFsnQF9IYXNEcm9wQm94J11bMF0pLFxyXG4gICAgICAgICAgICAgICAgc3R1ZGVudElkOiBhc3NpZ25tZW50WydAX1N0dWRlbnRJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgZHJvcGJveERhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRHJvcFN0YXJ0RGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0Ryb3BFbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlc291cmNlczpcclxuICAgICAgICAgICAgICAgICAgdHlwZW9mIGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgID8gKGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdLlJlc291cmNlLm1hcCgocnNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJzcmNbJ0BfVHlwZSddWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnRmlsZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlUnNyYyA9IHJzcmMgYXMgRmlsZVJlc291cmNlWE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUmVzb3VyY2VUeXBlLkZJTEUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaWxlUnNyY1snQF9GaWxlVHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVSc3JjWydAX0ZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJpOiB0aGlzLmhvc3RVcmwgKyBmaWxlUnNyY1snQF9TZXJ2ZXJGaWxlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGZpbGVSc3JjWydAX1Jlc291cmNlRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZmlsZVJzcmNbJ0BfUmVzb3VyY2VJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVSc3JjWydAX1Jlc291cmNlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBGaWxlUmVzb3VyY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnVVJMJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybFJzcmMgPSByc3JjIGFzIFVSTFJlc291cmNlWE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmxSc3JjWydAX1VSTCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBSZXNvdXJjZVR5cGUuVVJMLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKHVybFJzcmNbJ0BfUmVzb3VyY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB1cmxSc3JjWydAX1Jlc291cmNlSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB1cmxSc3JjWydAX1Jlc291cmNlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1cmxSc3JjWydAX1Jlc291cmNlRGVzY3JpcHRpb24nXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogdXJsUnNyY1snQF9TZXJ2ZXJGaWxlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBVUkxSZXNvdXJjZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqKGBUeXBlICR7cnNyY1snQF9UeXBlJ11bMF19IGRvZXMgbm90IGV4aXN0IGFzIGEgdHlwZS4gQWRkIGl0IHRvIHR5cGUgZGVjbGFyYXRpb25zLmApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9KSBhcyAoRmlsZVJlc291cmNlIHwgVVJMUmVzb3VyY2UpW10pXHJcbiAgICAgICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgICB9KSkgYXMgQXNzaWdubWVudFtdLFxyXG4gICAgICAgICAgICB9KSkgYXMgTWFya1tdLFxyXG4gICAgICAgICAgfSkpLFxyXG4gICAgICAgIH0gYXMgR3JhZGVib29rKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlaihlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYSBsaXN0IG9mIG1lc3NhZ2VzIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQHJldHVybnMge1Byb21pc2U8TWVzc2FnZVtdPn0gUmV0dXJucyBhbiBhcnJheSBvZiBtZXNzYWdlcyBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTsgLy8gLT4gW01lc3NhZ2VdXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIG1lc3NhZ2VzKCk6IFByb21pc2U8TWVzc2FnZVtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeG1sT2JqZWN0OiBNZXNzYWdlWE1MT2JqZWN0ID0gYXdhaXQgc3VwZXIucHJvY2Vzc1JlcXVlc3Qoe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0dldFBYUE1lc3NhZ2VzJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXMoXHJcbiAgICAgICAgICB4bWxPYmplY3QuUFhQTWVzc2FnZXNEYXRhWzBdLk1lc3NhZ2VMaXN0aW5nc1swXS5NZXNzYWdlTGlzdGluZy5tYXAoXHJcbiAgICAgICAgICAgIChtZXNzYWdlKSA9PiBuZXcgTWVzc2FnZShtZXNzYWdlLCBzdXBlci5jcmVkZW50aWFscywgdGhpcy5ob3N0VXJsKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgaW5mbyBvZiBhIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyBTdHVkZW50SW5mbyBvYmplY3RcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYGpzXHJcbiAgICogc3R1ZGVudEluZm8oKS50aGVuKGNvbnNvbGUubG9nKSAvLyAtPiB7IHN0dWRlbnQ6IHsgbmFtZTogJ0V2YW4gRGF2aXMnLCBuaWNrbmFtZTogJycsIGxhc3ROYW1lOiAnRGF2aXMnIH0sIC4uLn1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc3R1ZGVudEluZm8oKTogUHJvbWlzZTxTdHVkZW50SW5mbz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFN0dWRlbnRJbmZvPihhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB4bWxPYmplY3REYXRhOiBTdHVkZW50SW5mb1hNTE9iamVjdCA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50SW5mbycsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJlcyh7XHJcbiAgICAgICAgICBzdHVkZW50OiB7XHJcbiAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRm9ybWF0dGVkTmFtZVswXSxcclxuICAgICAgICAgICAgbGFzdE5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5MYXN0TmFtZUdvZXNCeVswXSxcclxuICAgICAgICAgICAgbmlja25hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5OaWNrTmFtZVswXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBiaXJ0aERhdGU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5CaXJ0aERhdGVbMF0sXHJcbiAgICAgICAgICB0cmFjazogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlRyYWNrWzBdLFxyXG4gICAgICAgICAgYWRkcmVzczogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLmJyWzBdLFxyXG4gICAgICAgICAgY291bnNlbG9yOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Db3Vuc2Vsb3JOYW1lWzBdLFxyXG4gICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvckVtYWlsWzBdLFxyXG4gICAgICAgICAgICBzdGFmZkd1OiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ291bnNlbG9yU3RhZmZHVVswXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjdXJyZW50U2Nob29sOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ3VycmVudFNjaG9vbFswXSxcclxuICAgICAgICAgIGRlbnRpc3Q6IHtcclxuICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfRXh0biddWzBdLFxyXG4gICAgICAgICAgICBvZmZpY2U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5EZW50aXN0WzBdWydAX09mZmljZSddWzBdLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHBoeXNpY2lhbjoge1xyXG4gICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGh5c2ljaWFuWzBdWydAX05hbWUnXVswXSxcclxuICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5bMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9FeHRuJ11bMF0sXHJcbiAgICAgICAgICAgIGhvc3BpdGFsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGh5c2ljaWFuWzBdWydAX0hvc3BpdGFsJ11bMF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZW1haWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5FTWFpbFswXSxcclxuICAgICAgICAgIGVtZXJnZW5jeUNvbnRhY3RzOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uRW1lcmdlbmN5Q29udGFjdHNbMF0uRW1lcmdlbmN5Q29udGFjdC5tYXAoXHJcbiAgICAgICAgICAgIChjb250YWN0KSA9PiAoe1xyXG4gICAgICAgICAgICAgIG5hbWU6IGNvbnRhY3RbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICAgICAgICBob21lOiBjb250YWN0WydAX0hvbWVQaG9uZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgbW9iaWxlOiBjb250YWN0WydAX01vYmlsZVBob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBvdGhlcjogY29udGFjdFsnQF9PdGhlclBob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB3b3JrOiBjb250YWN0WydAX1dvcmtQaG9uZSddWzBdLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgcmVsYXRpb25zaGlwOiBjb250YWN0WydAX1JlbGF0aW9uc2hpcCddWzBdLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKSxcclxuICAgICAgICAgIGdlbmRlcjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HZW5kZXJbMF0sXHJcbiAgICAgICAgICBncmFkZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HcmFkZVswXSxcclxuICAgICAgICAgIGxvY2tlckluZm9SZWNvcmRzOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkxvY2tlckluZm9SZWNvcmRzWzBdLFxyXG4gICAgICAgICAgaG9tZUxhbmd1YWdlOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZUxhbmd1YWdlWzBdLFxyXG4gICAgICAgICAgaG9tZVJvb206IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lUm9vbVswXSxcclxuICAgICAgICAgIGhvbWVSb29tVGVhY2hlcjoge1xyXG4gICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoRU1haWxbMF0sXHJcbiAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lUm9vbVRjaFswXSxcclxuICAgICAgICAgICAgc3RhZmZHdTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoU3RhZmZHVVswXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhZGRpdGlvbmFsSW5mbzogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlVzZXJEZWZpbmVkR3JvdXBCb3hlc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94Lm1hcChcclxuICAgICAgICAgICAgKGRlZmluZWRCb3gpID0+ICh7XHJcbiAgICAgICAgICAgICAgaWQ6IGRlZmluZWRCb3hbJ0BfR3JvdXBCb3hJRCddWzBdLFxyXG4gICAgICAgICAgICAgIHR5cGU6IGRlZmluZWRCb3hbJ0BfR3JvdXBCb3hMYWJlbCddWzBdLFxyXG4gICAgICAgICAgICAgIHZjSWQ6IGRlZmluZWRCb3hbJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgIGl0ZW1zOiBkZWZpbmVkQm94LlVzZXJEZWZpbmVkSXRlbXNbMF0uVXNlckRlZmluZWRJdGVtLm1hcCgoaXRlbSkgPT4gKHtcclxuICAgICAgICAgICAgICAgIHNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICBlbGVtZW50OiBpdGVtWydAX1NvdXJjZUVsZW1lbnQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgb2JqZWN0OiBpdGVtWydAX1NvdXJjZU9iamVjdCddWzBdLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZjSWQ6IGl0ZW1bJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1bJ0BfVmFsdWUnXVswXSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IGl0ZW1bJ0BfSXRlbVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICB9KSkgYXMgQWRkaXRpb25hbEluZm9JdGVtW10sXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICApIGFzIEFkZGl0aW9uYWxJbmZvW10sXHJcbiAgICAgICAgfSBhcyBTdHVkZW50SW5mbyk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGU6IERhdGUpIHtcclxuICAgIHJldHVybiBzdXBlci5wcm9jZXNzUmVxdWVzdDxDYWxlbmRhclhNTE9iamVjdD4oe1xyXG4gICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudENhbGVuZGFyJyxcclxuICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgUmVxdWVzdERhdGU6IGRhdGUudG9JU09TdHJpbmcoKSB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcHJvdmlkZSBmb3IgY2FsZW5kYXIgbWV0aG9kLiBUaGlzIGlzIG9wdGlvbmFsXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIENhbGVuZGFyIG9iamVjdFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBjbGllbnQuY2FsZW5kYXIoeyBpbnRlcnZhbDogeyBzdGFydDogbmV3IERhdGUoJzUvMS8yMDIyJyksIGVuZDogbmV3IERhdGUoJzgvMS8yMDIxJykgfSwgY29uY3VycmVuY3k6IG51bGwgfSk7IC8vIC0+IExpbWl0bGVzcyBjb25jdXJyZW5jeSAobm90IHJlY29tbWVuZGVkKVxyXG4gICAqXHJcbiAgICogY29uc3QgY2FsZW5kYXIgPSBhd2FpdCBjbGllbnQuY2FsZW5kYXIoKTtcclxuICAgKiBjb25zb2xlLmxvZyhjYWxlbmRhcik7IC8vIC0+IHsgc2Nob29sRGF0ZTogey4uLn0sIG91dHB1dFJhbmdlOiB7Li4ufSwgZXZlbnRzOiBbLi4uXSB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGNhbGVuZGFyKG9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyk6IFByb21pc2U8Q2FsZW5kYXI+IHtcclxuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBDYWxlbmRhck9wdGlvbnMgPSB7XHJcbiAgICAgIGNvbmN1cnJlbmN5OiA3LFxyXG4gICAgICAuLi5vcHRpb25zLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgc2Nob29sU3RhcnREYXRlOiBEYXRlIHwgbnVtYmVyID0gb3B0aW9ucy5pbnRlcnZhbC5zdGFydDtcclxuICAgICAgICBsZXQgc2Nob29sRW5kRGF0ZTogRGF0ZSB8IG51bWJlciA9IG9wdGlvbnMuaW50ZXJ2YWwuZW5kO1xyXG5cclxuICAgICAgICBjb25zdCBtb250aHNXaXRoaW5TY2hvb2xZZWFyID0gZWFjaE1vbnRoT2ZJbnRlcnZhbCh7IHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsIGVuZDogc2Nob29sRW5kRGF0ZSB9KTtcclxuICAgICAgICBjb25zdCBhbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyOiBDYWxlbmRhclhNTE9iamVjdFtdID1cclxuICAgICAgICAgIGRlZmF1bHRPcHRpb25zLmNvbmN1cnJlbmN5ID09IG51bGxcclxuICAgICAgICAgICAgPyBhd2FpdCBQcm9taXNlLmFsbChtb250aHNXaXRoaW5TY2hvb2xZZWFyLm1hcCgoZGF0ZSkgPT4gdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpKSlcclxuICAgICAgICAgICAgOiBhd2FpdCBhc3luY1Bvb2woZGVmYXVsdE9wdGlvbnMuY29uY3VycmVuY3ksIG1vbnRoc1dpdGhpblNjaG9vbFllYXIsIChkYXRlKSA9PlxyXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICBsZXQgbWVtbzogQ2FsZW5kYXIgfCBudWxsID0gbnVsbDtcclxuICAgICAgICBjb25zdCBldmVudHMgPSBhbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyLnJlZHVjZSgocHJldiwgZXZlbnRzKSA9PiB7XHJcbiAgICAgICAgICBpZiAobWVtbyA9PSBudWxsKVxyXG4gICAgICAgICAgICBtZW1vID0ge1xyXG4gICAgICAgICAgICAgIHNjaG9vbERhdGU6IHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF1bJ0BfU2Nob29sRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIG91dHB1dFJhbmdlOiB7XHJcbiAgICAgICAgICAgICAgICBzdGFydDogc2Nob29sU3RhcnREYXRlLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBzY2hvb2xFbmREYXRlLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZXZlbnRzOiBbXSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIGxldCByZXN0OiBDYWxlbmRhciA9IHtcclxuICAgICAgICAgICAgLi4ubWVtbywgLy8gVGhpcyBpcyB0byBwcmV2ZW50IHJlLWluaXRpYWxpemluZyBEYXRlIG9iamVjdHMgaW4gb3JkZXIgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxyXG4gICAgICAgICAgICBldmVudHM6IFtcclxuICAgICAgICAgICAgICAuLi4ocHJldi5ldmVudHMgPyBwcmV2LmV2ZW50cyA6IFtdKSxcclxuICAgICAgICAgICAgICAuLi4oZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXS5FdmVudExpc3RzWzBdLkV2ZW50TGlzdC5tYXAoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50WydAX0RheVR5cGUnXVswXSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5BU1NJR05NRU5UOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNzaWdubWVudEV2ZW50ID0gZXZlbnQgYXMgQXNzaWdubWVudEV2ZW50WE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogYXNzaWdubWVudEV2ZW50WydAX1RpdGxlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBhZGRMaW5rRGF0YTogYXNzaWdubWVudEV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBhZ3U6IGFzc2lnbm1lbnRFdmVudFsnQF9BR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGFzc2lnbm1lbnRFdmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGd1OiBhc3NpZ25tZW50RXZlbnRbJ0BfREdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBhc3NpZ25tZW50RXZlbnRbJ0BfTGluayddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBhc3NpZ25tZW50RXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuQVNTSUdOTUVOVCxcclxuICAgICAgICAgICAgICAgICAgICAgIHZpZXdUeXBlOiBhc3NpZ25tZW50RXZlbnRbJ0BfVmlld1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICB9IGFzIEFzc2lnbm1lbnRFdmVudDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5IT0xJREFZOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBldmVudFsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLkhPTElEQVksXHJcbiAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IGV2ZW50WydAX1N0YXJ0VGltZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICB9IGFzIEhvbGlkYXlFdmVudDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5SRUdVTEFSOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVndWxhckV2ZW50ID0gZXZlbnQgYXMgUmVndWxhckV2ZW50WE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogcmVndWxhckV2ZW50WydAX1RpdGxlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBhZ3U6IHJlZ3VsYXJFdmVudFsnQF9BR1UnXSA/IHJlZ3VsYXJFdmVudFsnQF9BR1UnXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKHJlZ3VsYXJFdmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHJlZ3VsYXJFdmVudFsnQF9FdnREZXNjcmlwdGlvbiddID8gcmVndWxhckV2ZW50WydAX0V2dERlc2NyaXB0aW9uJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBkZ3U6IHJlZ3VsYXJFdmVudFsnQF9ER1UnXSA/IHJlZ3VsYXJFdmVudFsnQF9ER1UnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IHJlZ3VsYXJFdmVudFsnQF9MaW5rJ10gPyByZWd1bGFyRXZlbnRbJ0BfTGluayddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiByZWd1bGFyRXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuUkVHVUxBUixcclxuICAgICAgICAgICAgICAgICAgICAgIHZpZXdUeXBlOiByZWd1bGFyRXZlbnRbJ0BfVmlld1R5cGUnXSA/IHJlZ3VsYXJFdmVudFsnQF9WaWV3VHlwZSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYWRkTGlua0RhdGE6IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddID8gcmVndWxhckV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgfSBhcyBSZWd1bGFyRXZlbnQ7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KSBhcyBFdmVudFtdKSxcclxuICAgICAgICAgICAgXSBhcyBFdmVudFtdLFxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gcmVzdDtcclxuICAgICAgICB9LCB7fSBhcyBDYWxlbmRhcik7XHJcblxyXG4gICAgICAgIHJlcyh7IC4uLmV2ZW50cywgZXZlbnRzOiBfLnVuaXFCeShldmVudHMuZXZlbnRzLCAoaXRlbSkgPT4gaXRlbS50aXRsZSkgfSBhcyBDYWxlbmRhcik7XHJcbiAgICAgICAgLy8gcmVzKGFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqKGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19