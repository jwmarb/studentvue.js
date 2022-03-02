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
     * Gets the schedule of the student
     * @param {number} termIndex The index of the term.
     * @returns {Promise<Schedule>} Returns the schedule of the student
     * @example
     * ```js
     * await schedule(0) // -> { term: { index: 0, name: '1st Qtr Progress' }, ... }
     * ```
     */


    schedule(termIndex) {
      return new Promise(async (res, rej) => {
        try {
          const xmlObject = await super.processRequest({
            methodName: 'StudentClassList',
            paramStr: {
              childIntId: 0,
              ...(termIndex != null ? {
                TermIndex: termIndex
              } : {})
            }
          });
          var _a = xmlObject.StudentClassSchedule[0].TodayScheduleInfoData[0].SchoolInfos[0].SchoolInfo;

          var _f = school => {
            var _a4 = school.Classes[0].ClassInfo;

            var _f4 = course => {
              return {
                period: Number(course['@_Period'][0]),
                attendanceCode: course.AttendanceCode[0],
                date: {
                  start: new Date(course['@_StartDate'][0]),
                  end: new Date(course['@_EndDate'][0])
                },
                name: course['@_ClassName'][0],
                sectionGu: course['@_SectionGU'][0],
                teacher: {
                  email: course['@_TeacherEmail'][0],
                  emailSubject: course['@_EmailSubject'][0],
                  name: course['@_TeacherName'][0],
                  staffGu: course['@_StaffGU'][0],
                  url: course['@_TeacherURL'][0]
                }
              };
            };

            var _r4 = [];

            for (var _i4 = 0; _i4 < _a4.length; _i4++) {
              _r4.push(_f4(_a4[_i4], _i4, _a4));
            }

            return {
              name: school['@_SchoolName'][0],
              bellScheduleName: school['@_BellSchedName'][0],
              classes: _r4
            };
          };

          var _r = [];

          for (var _i = 0; _i < _a.length; _i++) {
            _r.push(_f(_a[_i], _i, _a));
          }

          var _a2 = xmlObject.StudentClassSchedule[0].ClassLists[0].ClassListing;

          var _f2 = studentClass => {
            return {
              name: studentClass['@_CourseTitle'][0],
              period: Number(studentClass['@_Period'][0]),
              room: studentClass['@_RoomName'][0],
              sectionGu: studentClass['@_SectionGU'][0],
              teacher: {
                name: studentClass['@_Teacher'][0],
                email: studentClass['@_TeacherEmail'][0],
                staffGu: studentClass['@_TeacherStaffGU'][0]
              }
            };
          };

          var _r2 = [];

          for (var _i2 = 0; _i2 < _a2.length; _i2++) {
            _r2.push(_f2(_a2[_i2], _i2, _a2));
          }

          var _a3 = xmlObject.StudentClassSchedule[0].TermLists[0].TermListing;

          var _f3 = term => {
            return {
              date: {
                start: new Date(term['@_BeginDate'][0]),
                end: new Date(term['@_EndDate'][0])
              },
              index: Number(term['@_TermIndex'][0]),
              name: term['@_TermName'][0],
              schoolYearTermCodeGu: term['@_SchoolYearTrmCodeGU'][0]
            };
          };

          var _r3 = [];

          for (var _i3 = 0; _i3 < _a3.length; _i3++) {
            _r3.push(_f3(_a3[_i3], _i3, _a3));
          }

          res({
            term: {
              index: Number(xmlObject.StudentClassSchedule[0]['@_TermIndex'][0]),
              name: xmlObject.StudentClassSchedule[0]['@_TermIndexName'][0]
            },
            error: xmlObject.StudentClassSchedule[0]['@_ErrorMessage'][0],
            today: _r,
            classes: _r2,
            terms: _r3
          });
        } catch (e) {
          rej(e);
        }
      });
    }
    /**
     * Returns the attendance of the student
     * @returns {Promise<Attendance>} Returns an Attendance object
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
          var _a5 = xmlObject.Absences[0].Absence;

          var _f5 = absence => {
            var _a7 = absence.Periods[0].Period;

            var _f7 = period => {
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

            var _r7 = [];

            for (var _i7 = 0; _i7 < _a7.length; _i7++) {
              _r7.push(_f7(_a7[_i7], _i7, _a7));
            }

            return {
              date: new Date(absence['@_AbsenceDate'][0]),
              reason: absence['@_Reason'][0],
              note: absence['@_Note'][0],
              description: absence['@_CodeAllDayDescription'][0],
              periods: _r7
            };
          };

          var _r5 = [];

          for (var _i5 = 0; _i5 < _a5.length; _i5++) {
            _r5.push(_f5(_a5[_i5], _i5, _a5));
          }

          var _a6 = xmlObject.TotalActivities[0].PeriodTotal;

          var _f6 = (pd, i) => {
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

          var _r6 = [];

          for (var _i6 = 0; _i6 < _a6.length; _i6++) {
            _r6.push(_f6(_a6[_i6], _i6, _a6));
          }

          res({
            type: xmlObject['@_Type'][0],
            period: {
              total: Number(xmlObject['@_PeriodCount'][0]),
              start: Number(xmlObject['@_StartPeriod'][0]),
              end: Number(xmlObject['@_EndPeriod'][0])
            },
            schoolName: xmlObject['@_SchoolName'][0],
            absences: _r5,
            periodInfos: _r6
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
          var _a8 = xmlObject.Gradebook[0].ReportingPeriods[0].ReportPeriod;

          var _f8 = period => {
            return {
              date: {
                start: new Date(period['@_StartDate'][0]),
                end: new Date(period['@_EndDate'][0])
              },
              name: period['@_GradePeriod'][0],
              index: Number(period['@_Index'][0])
            };
          };

          var _r8 = [];

          for (var _i8 = 0; _i8 < _a8.length; _i8++) {
            _r8.push(_f8(_a8[_i8], _i8, _a8));
          }

          var _a9 = xmlObject.Gradebook[0].Courses[0].Course;

          var _f9 = course => {
            var _a10 = course.Marks[0].Mark;

            var _f10 = mark => {
              var _a11 = mark.Assignments[0].Assignment;

              var _f11 = assignment => {
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

              var _r11 = [];

              for (var _i11 = 0; _i11 < _a11.length; _i11++) {
                _r11.push(_f11(_a11[_i11], _i11, _a11));
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
                assignments: _r11
              };
            };

            var _r10 = [];

            for (var _i10 = 0; _i10 < _a10.length; _i10++) {
              _r10.push(_f10(_a10[_i10], _i10, _a10));
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
              marks: _r10
            };
          };

          var _r9 = [];

          for (var _i9 = 0; _i9 < _a9.length; _i9++) {
            _r9.push(_f9(_a9[_i9], _i9, _a9));
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
              available: _r8
            },
            courses: _r9
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
     * await client.messages(); // -> [{ id: 'E972F1BC-99A0-4CD0-8D15-B18968B43E08', type: 'StudentActivity', ... }, { id: '86FDA11D-42C7-4249-B003-94B15EB2C8D4', type: 'StudentActivity', ... }]
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
          var _a12 = xmlObject.PXPMessagesData[0].MessageListings[0].MessageListing;

          var _f12 = message => {
            return new _Message.default(message, super.credentials, this.hostUrl);
          };

          var _r12 = [];

          for (var _i12 = 0; _i12 < _a12.length; _i12++) {
            _r12.push(_f12(_a12[_i12], _i12, _a12));
          }

          res(_r12);
        } catch (e) {
          rej(e);
        }
      });
    }
    /**
     * Gets the info of a student
     * @returns {Promise<StudentInfo>} StudentInfo object
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
          var _a13 = xmlObjectData.StudentInfo[0].Address[0].EmergencyContacts[0].EmergencyContact;

          var _f13 = contact => {
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

          var _r13 = [];

          for (var _i13 = 0; _i13 < _a13.length; _i13++) {
            _r13.push(_f13(_a13[_i13], _i13, _a13));
          }

          var _a14 = xmlObjectData.StudentInfo[0].Address[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox;

          var _f14 = definedBox => {
            var _a15 = definedBox.UserDefinedItems[0].UserDefinedItem;

            var _f15 = item => {
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

            var _r15 = [];

            for (var _i15 = 0; _i15 < _a15.length; _i15++) {
              _r15.push(_f15(_a15[_i15], _i15, _a15));
            }

            return {
              id: definedBox['@_GroupBoxID'][0],
              type: definedBox['@_GroupBoxLabel'][0],
              vcId: definedBox['@_VCID'][0],
              items: _r15
            };
          };

          var _r14 = [];

          for (var _i14 = 0; _i14 < _a14.length; _i14++) {
            _r14.push(_f14(_a14[_i14], _i14, _a14));
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
            emergencyContacts: _r13,
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
            additionalInfo: _r14
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
     * @param {CalendarOptions} options Options to provide for calendar method. An interval is required.
     * @returns {Promise<Calendar>} Returns a Calendar object
     * @example
     * ```js
     * client.calendar({ interval: { start: new Date('5/1/2022'), end: new Date('8/1/2021') }, concurrency: null }); // -> Limitless concurrency (not recommended)
     *
     * const calendar = await client.calendar({ interval: { ... }});
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

            var _a16 = events.CalendarListing[0].EventLists[0].EventList;

            var _f16 = event => {
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

            var _r16 = [];

            for (var _i16 = 0; _i16 < _a16.length; _i16++) {
              _r16.push(_f16(_a16[_i16], _i16, _a16));
            }

            let rest = { ...memo,
              // This is to prevent re-initializing Date objects in order to improve performance
              events: [...(prev.events ? prev.events : []), ..._r16]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50Iiwic29hcCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwic2NoZWR1bGUiLCJ0ZXJtSW5kZXgiLCJQcm9taXNlIiwicmVzIiwicmVqIiwieG1sT2JqZWN0IiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwiVGVybUluZGV4IiwiU3R1ZGVudENsYXNzU2NoZWR1bGUiLCJUb2RheVNjaGVkdWxlSW5mb0RhdGEiLCJTY2hvb2xJbmZvcyIsIlNjaG9vbEluZm8iLCJzY2hvb2wiLCJDbGFzc2VzIiwiQ2xhc3NJbmZvIiwiY291cnNlIiwicGVyaW9kIiwiTnVtYmVyIiwiYXR0ZW5kYW5jZUNvZGUiLCJBdHRlbmRhbmNlQ29kZSIsImRhdGUiLCJzdGFydCIsIkRhdGUiLCJlbmQiLCJuYW1lIiwic2VjdGlvbkd1IiwidGVhY2hlciIsImVtYWlsIiwiZW1haWxTdWJqZWN0Iiwic3RhZmZHdSIsInVybCIsImJlbGxTY2hlZHVsZU5hbWUiLCJjbGFzc2VzIiwiQ2xhc3NMaXN0cyIsIkNsYXNzTGlzdGluZyIsInN0dWRlbnRDbGFzcyIsInJvb20iLCJUZXJtTGlzdHMiLCJUZXJtTGlzdGluZyIsInRlcm0iLCJpbmRleCIsInNjaG9vbFllYXJUZXJtQ29kZUd1IiwiZXJyb3IiLCJ0b2RheSIsInRlcm1zIiwiZSIsImF0dGVuZGFuY2UiLCJhdHRlbmRhbmNlWE1MT2JqZWN0IiwiQXR0ZW5kYW5jZSIsIkFic2VuY2VzIiwiQWJzZW5jZSIsImFic2VuY2UiLCJQZXJpb2RzIiwiUGVyaW9kIiwicmVhc29uIiwic3RhZmYiLCJvcmdZZWFyR3UiLCJub3RlIiwiZGVzY3JpcHRpb24iLCJwZXJpb2RzIiwiVG90YWxBY3Rpdml0aWVzIiwiUGVyaW9kVG90YWwiLCJwZCIsImkiLCJ0b3RhbCIsImV4Y3VzZWQiLCJUb3RhbEV4Y3VzZWQiLCJ0YXJkaWVzIiwiVG90YWxUYXJkaWVzIiwidW5leGN1c2VkIiwiVG90YWxVbmV4Y3VzZWQiLCJhY3Rpdml0aWVzIiwidW5leGN1c2VkVGFyZGllcyIsIlRvdGFsVW5leGN1c2VkVGFyZGllcyIsInR5cGUiLCJzY2hvb2xOYW1lIiwiYWJzZW5jZXMiLCJwZXJpb2RJbmZvcyIsImdyYWRlYm9vayIsInJlcG9ydGluZ1BlcmlvZEluZGV4IiwiUmVwb3J0aW5nUGVyaW9kIiwiR3JhZGVib29rIiwiUmVwb3J0aW5nUGVyaW9kcyIsIlJlcG9ydFBlcmlvZCIsIkNvdXJzZXMiLCJDb3Vyc2UiLCJNYXJrcyIsIk1hcmsiLCJtYXJrIiwiQXNzaWdubWVudHMiLCJBc3NpZ25tZW50IiwiYXNzaWdubWVudCIsImdyYWRlYm9va0lkIiwiZHVlIiwic2NvcmUiLCJ2YWx1ZSIsInBvaW50cyIsIm5vdGVzIiwidGVhY2hlcklkIiwiaGFzRHJvcGJveCIsIkpTT04iLCJwYXJzZSIsInN0dWRlbnRJZCIsImRyb3Bib3hEYXRlIiwicmVzb3VyY2VzIiwiUmVzb3VyY2VzIiwiUmVzb3VyY2UiLCJtYXAiLCJyc3JjIiwiZmlsZVJzcmMiLCJSZXNvdXJjZVR5cGUiLCJGSUxFIiwiZmlsZSIsInVyaSIsInJlc291cmNlIiwiaWQiLCJ1cmxSc3JjIiwiVVJMIiwicGF0aCIsImNhbGN1bGF0ZWRTY29yZSIsInN0cmluZyIsInJhdyIsIndlaWdodGVkQ2F0ZWdvcmllcyIsIkFzc2lnbm1lbnRHcmFkZUNhbGMiLCJ3ZWlnaHRlZCIsImNhbGN1bGF0ZWRNYXJrIiwid2VpZ2h0IiwiZXZhbHVhdGVkIiwic3RhbmRhcmQiLCJjdXJyZW50IiwicG9zc2libGUiLCJhc3NpZ25tZW50cyIsInRpdGxlIiwibWFya3MiLCJyZXBvcnRpbmdQZXJpb2QiLCJmaW5kIiwieCIsImF2YWlsYWJsZSIsImNvdXJzZXMiLCJtZXNzYWdlcyIsIlBYUE1lc3NhZ2VzRGF0YSIsIk1lc3NhZ2VMaXN0aW5ncyIsIk1lc3NhZ2VMaXN0aW5nIiwibWVzc2FnZSIsIk1lc3NhZ2UiLCJzdHVkZW50SW5mbyIsInhtbE9iamVjdERhdGEiLCJTdHVkZW50SW5mbyIsIkFkZHJlc3MiLCJFbWVyZ2VuY3lDb250YWN0cyIsIkVtZXJnZW5jeUNvbnRhY3QiLCJjb250YWN0IiwicGhvbmUiLCJob21lIiwibW9iaWxlIiwib3RoZXIiLCJ3b3JrIiwicmVsYXRpb25zaGlwIiwiVXNlckRlZmluZWRHcm91cEJveGVzIiwiVXNlckRlZmluZWRHcm91cEJveCIsImRlZmluZWRCb3giLCJVc2VyRGVmaW5lZEl0ZW1zIiwiVXNlckRlZmluZWRJdGVtIiwiaXRlbSIsInNvdXJjZSIsImVsZW1lbnQiLCJvYmplY3QiLCJ2Y0lkIiwiaXRlbXMiLCJzdHVkZW50IiwiRm9ybWF0dGVkTmFtZSIsImxhc3ROYW1lIiwiTGFzdE5hbWVHb2VzQnkiLCJuaWNrbmFtZSIsIk5pY2tOYW1lIiwiYmlydGhEYXRlIiwiQmlydGhEYXRlIiwidHJhY2siLCJUcmFjayIsImFkZHJlc3MiLCJiciIsImNvdW5zZWxvciIsIkNvdW5zZWxvck5hbWUiLCJDb3Vuc2Vsb3JFbWFpbCIsIkNvdW5zZWxvclN0YWZmR1UiLCJjdXJyZW50U2Nob29sIiwiQ3VycmVudFNjaG9vbCIsImRlbnRpc3QiLCJEZW50aXN0IiwiZXh0biIsIm9mZmljZSIsInBoeXNpY2lhbiIsIlBoeXNpY2lhbiIsImhvc3BpdGFsIiwiRU1haWwiLCJlbWVyZ2VuY3lDb250YWN0cyIsImdlbmRlciIsIkdlbmRlciIsImdyYWRlIiwiR3JhZGUiLCJsb2NrZXJJbmZvUmVjb3JkcyIsIkxvY2tlckluZm9SZWNvcmRzIiwiaG9tZUxhbmd1YWdlIiwiSG9tZUxhbmd1YWdlIiwiaG9tZVJvb20iLCJIb21lUm9vbSIsImhvbWVSb29tVGVhY2hlciIsIkhvbWVSb29tVGNoRU1haWwiLCJIb21lUm9vbVRjaCIsIkhvbWVSb29tVGNoU3RhZmZHVSIsImFkZGl0aW9uYWxJbmZvIiwiZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbCIsIlJlcXVlc3REYXRlIiwidG9JU09TdHJpbmciLCJjYWxlbmRhciIsIm9wdGlvbnMiLCJkZWZhdWx0T3B0aW9ucyIsImNvbmN1cnJlbmN5Iiwic2Nob29sU3RhcnREYXRlIiwiaW50ZXJ2YWwiLCJzY2hvb2xFbmREYXRlIiwibW9udGhzV2l0aGluU2Nob29sWWVhciIsImFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIiLCJhbGwiLCJtZW1vIiwiZXZlbnRzIiwicmVkdWNlIiwicHJldiIsInNjaG9vbERhdGUiLCJDYWxlbmRhckxpc3RpbmciLCJvdXRwdXRSYW5nZSIsIkV2ZW50TGlzdHMiLCJFdmVudExpc3QiLCJldmVudCIsIkV2ZW50VHlwZSIsIkFTU0lHTk1FTlQiLCJhc3NpZ25tZW50RXZlbnQiLCJhZGRMaW5rRGF0YSIsImFndSIsImRndSIsImxpbmsiLCJzdGFydFRpbWUiLCJ2aWV3VHlwZSIsIkhPTElEQVkiLCJSRUdVTEFSIiwicmVndWxhckV2ZW50IiwidW5kZWZpbmVkIiwicmVzdCIsIl8iLCJ1bmlxQnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQmUsUUFBTUEsTUFBTixTQUFxQkMsY0FBS0QsTUFBMUIsQ0FBaUM7QUFFOUNFLElBQUFBLFdBQVcsQ0FBQ0MsV0FBRCxFQUFnQ0MsT0FBaEMsRUFBaUQ7QUFDMUQsWUFBTUQsV0FBTjtBQUNBLFdBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU0MsSUFBQUEsUUFBUSxDQUFDQyxTQUFELEVBQXdDO0FBQ3JELGFBQU8sSUFBSUMsT0FBSixDQUFZLE9BQU9DLEdBQVAsRUFBWUMsR0FBWixLQUFvQjtBQUNyQyxZQUFJO0FBQ0YsZ0JBQU1DLFNBQTRCLEdBQUcsTUFBTSxNQUFNQyxjQUFOLENBQXFCO0FBQzlEQyxZQUFBQSxVQUFVLEVBQUUsa0JBRGtEO0FBRTlEQyxZQUFBQSxRQUFRLEVBQUU7QUFBRUMsY0FBQUEsVUFBVSxFQUFFLENBQWQ7QUFBaUIsa0JBQUlSLFNBQVMsSUFBSSxJQUFiLEdBQW9CO0FBQUVTLGdCQUFBQSxTQUFTLEVBQUVUO0FBQWIsZUFBcEIsR0FBK0MsRUFBbkQ7QUFBakI7QUFGb0QsV0FBckIsQ0FBM0M7QUFERSxtQkFZT0ksU0FBUyxDQUFDTSxvQkFBVixDQUErQixDQUEvQixFQUFrQ0MscUJBQWxDLENBQXdELENBQXhELEVBQTJEQyxXQUEzRCxDQUF1RSxDQUF2RSxFQUEwRUMsVUFaakY7O0FBQUEsbUJBWWlHQyxNQUFEO0FBQUEsc0JBR3JGQSxNQUFNLENBQUNDLE9BQVAsQ0FBZSxDQUFmLEVBQWtCQyxTQUhtRTs7QUFBQSxzQkFJM0ZDLE1BQUQ7QUFBQSxxQkFDRztBQUNDQyxnQkFBQUEsTUFBTSxFQUFFQyxNQUFNLENBQUNGLE1BQU0sQ0FBQyxVQUFELENBQU4sQ0FBbUIsQ0FBbkIsQ0FBRCxDQURmO0FBRUNHLGdCQUFBQSxjQUFjLEVBQUVILE1BQU0sQ0FBQ0ksY0FBUCxDQUFzQixDQUF0QixDQUZqQjtBQUdDQyxnQkFBQUEsSUFBSSxFQUFFO0FBQ0pDLGtCQUFBQSxLQUFLLEVBQUUsSUFBSUMsSUFBSixDQUFTUCxNQUFNLENBQUMsYUFBRCxDQUFOLENBQXNCLENBQXRCLENBQVQsQ0FESDtBQUVKUSxrQkFBQUEsR0FBRyxFQUFFLElBQUlELElBQUosQ0FBU1AsTUFBTSxDQUFDLFdBQUQsQ0FBTixDQUFvQixDQUFwQixDQUFUO0FBRkQsaUJBSFA7QUFPQ1MsZ0JBQUFBLElBQUksRUFBRVQsTUFBTSxDQUFDLGFBQUQsQ0FBTixDQUFzQixDQUF0QixDQVBQO0FBUUNVLGdCQUFBQSxTQUFTLEVBQUVWLE1BQU0sQ0FBQyxhQUFELENBQU4sQ0FBc0IsQ0FBdEIsQ0FSWjtBQVNDVyxnQkFBQUEsT0FBTyxFQUFFO0FBQ1BDLGtCQUFBQSxLQUFLLEVBQUVaLE1BQU0sQ0FBQyxnQkFBRCxDQUFOLENBQXlCLENBQXpCLENBREE7QUFFUGEsa0JBQUFBLFlBQVksRUFBRWIsTUFBTSxDQUFDLGdCQUFELENBQU4sQ0FBeUIsQ0FBekIsQ0FGUDtBQUdQUyxrQkFBQUEsSUFBSSxFQUFFVCxNQUFNLENBQUMsZUFBRCxDQUFOLENBQXdCLENBQXhCLENBSEM7QUFJUGMsa0JBQUFBLE9BQU8sRUFBRWQsTUFBTSxDQUFDLFdBQUQsQ0FBTixDQUFvQixDQUFwQixDQUpGO0FBS1BlLGtCQUFBQSxHQUFHLEVBQUVmLE1BQU0sQ0FBQyxjQUFELENBQU4sQ0FBdUIsQ0FBdkI7QUFMRTtBQVRWLGVBREg7QUFBQSxhQUo0Rjs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUEsbUJBQWE7QUFDM0dTLGNBQUFBLElBQUksRUFBRVosTUFBTSxDQUFDLGNBQUQsQ0FBTixDQUF1QixDQUF2QixDQURxRztBQUUzR21CLGNBQUFBLGdCQUFnQixFQUFFbkIsTUFBTSxDQUFDLGlCQUFELENBQU4sQ0FBMEIsQ0FBMUIsQ0FGeUY7QUFHM0dvQixjQUFBQSxPQUFPO0FBSG9HLGFBQWI7QUFBQSxXQVpoRzs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUEsb0JBb0NTOUIsU0FBUyxDQUFDTSxvQkFBVixDQUErQixDQUEvQixFQUFrQ3lCLFVBQWxDLENBQTZDLENBQTdDLEVBQWdEQyxZQXBDekQ7O0FBQUEsb0JBb0MyRUMsWUFBRDtBQUFBLG1CQUFtQjtBQUMzRlgsY0FBQUEsSUFBSSxFQUFFVyxZQUFZLENBQUMsZUFBRCxDQUFaLENBQThCLENBQTlCLENBRHFGO0FBRTNGbkIsY0FBQUEsTUFBTSxFQUFFQyxNQUFNLENBQUNrQixZQUFZLENBQUMsVUFBRCxDQUFaLENBQXlCLENBQXpCLENBQUQsQ0FGNkU7QUFHM0ZDLGNBQUFBLElBQUksRUFBRUQsWUFBWSxDQUFDLFlBQUQsQ0FBWixDQUEyQixDQUEzQixDQUhxRjtBQUkzRlYsY0FBQUEsU0FBUyxFQUFFVSxZQUFZLENBQUMsYUFBRCxDQUFaLENBQTRCLENBQTVCLENBSmdGO0FBSzNGVCxjQUFBQSxPQUFPLEVBQUU7QUFDUEYsZ0JBQUFBLElBQUksRUFBRVcsWUFBWSxDQUFDLFdBQUQsQ0FBWixDQUEwQixDQUExQixDQURDO0FBRVBSLGdCQUFBQSxLQUFLLEVBQUVRLFlBQVksQ0FBQyxnQkFBRCxDQUFaLENBQStCLENBQS9CLENBRkE7QUFHUE4sZ0JBQUFBLE9BQU8sRUFBRU0sWUFBWSxDQUFDLGtCQUFELENBQVosQ0FBaUMsQ0FBakM7QUFIRjtBQUxrRixhQUFuQjtBQUFBLFdBcEMxRTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUEsb0JBK0NPakMsU0FBUyxDQUFDTSxvQkFBVixDQUErQixDQUEvQixFQUFrQzZCLFNBQWxDLENBQTRDLENBQTVDLEVBQStDQyxXQS9DdEQ7O0FBQUEsb0JBK0N1RUMsSUFBRDtBQUFBLG1CQUFXO0FBQy9FbkIsY0FBQUEsSUFBSSxFQUFFO0FBQ0pDLGdCQUFBQSxLQUFLLEVBQUUsSUFBSUMsSUFBSixDQUFTaUIsSUFBSSxDQUFDLGFBQUQsQ0FBSixDQUFvQixDQUFwQixDQUFULENBREg7QUFFSmhCLGdCQUFBQSxHQUFHLEVBQUUsSUFBSUQsSUFBSixDQUFTaUIsSUFBSSxDQUFDLFdBQUQsQ0FBSixDQUFrQixDQUFsQixDQUFUO0FBRkQsZUFEeUU7QUFLL0VDLGNBQUFBLEtBQUssRUFBRXZCLE1BQU0sQ0FBQ3NCLElBQUksQ0FBQyxhQUFELENBQUosQ0FBb0IsQ0FBcEIsQ0FBRCxDQUxrRTtBQU0vRWYsY0FBQUEsSUFBSSxFQUFFZSxJQUFJLENBQUMsWUFBRCxDQUFKLENBQW1CLENBQW5CLENBTnlFO0FBTy9FRSxjQUFBQSxvQkFBb0IsRUFBRUYsSUFBSSxDQUFDLHVCQUFELENBQUosQ0FBOEIsQ0FBOUI7QUFQeUQsYUFBWDtBQUFBLFdBL0N0RTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBTUZ2QyxVQUFBQSxHQUFHLENBQUM7QUFDRnVDLFlBQUFBLElBQUksRUFBRTtBQUNKQyxjQUFBQSxLQUFLLEVBQUV2QixNQUFNLENBQUNmLFNBQVMsQ0FBQ00sb0JBQVYsQ0FBK0IsQ0FBL0IsRUFBa0MsYUFBbEMsRUFBaUQsQ0FBakQsQ0FBRCxDQURUO0FBRUpnQixjQUFBQSxJQUFJLEVBQUV0QixTQUFTLENBQUNNLG9CQUFWLENBQStCLENBQS9CLEVBQWtDLGlCQUFsQyxFQUFxRCxDQUFyRDtBQUZGLGFBREo7QUFLRmtDLFlBQUFBLEtBQUssRUFBRXhDLFNBQVMsQ0FBQ00sb0JBQVYsQ0FBK0IsQ0FBL0IsRUFBa0MsZ0JBQWxDLEVBQW9ELENBQXBELENBTEw7QUFNRm1DLFlBQUFBLEtBQUssSUFOSDtBQThCRlgsWUFBQUEsT0FBTyxLQTlCTDtBQXlDRlksWUFBQUEsS0FBSztBQXpDSCxXQUFELENBQUg7QUFtREQsU0F6REQsQ0F5REUsT0FBT0MsQ0FBUCxFQUFVO0FBQ1Y1QyxVQUFBQSxHQUFHLENBQUM0QyxDQUFELENBQUg7QUFDRDtBQUNGLE9BN0RNLENBQVA7QUE4REQ7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNTQyxJQUFBQSxVQUFVLEdBQXdCO0FBQ3ZDLGFBQU8sSUFBSS9DLE9BQUosQ0FBWSxPQUFPQyxHQUFQLEVBQVlDLEdBQVosS0FBb0I7QUFDckMsWUFBSTtBQUNGLGdCQUFNOEMsbUJBQXdDLEdBQUcsTUFBTSxNQUFNNUMsY0FBTixDQUFxQjtBQUMxRUMsWUFBQUEsVUFBVSxFQUFFLFlBRDhEO0FBRTFFQyxZQUFBQSxRQUFRLEVBQUU7QUFDUkMsY0FBQUEsVUFBVSxFQUFFO0FBREo7QUFGZ0UsV0FBckIsQ0FBdkQ7QUFPQSxnQkFBTUosU0FBUyxHQUFHNkMsbUJBQW1CLENBQUNDLFVBQXBCLENBQStCLENBQS9CLENBQWxCO0FBUkUsb0JBa0JVOUMsU0FBUyxDQUFDK0MsUUFBVixDQUFtQixDQUFuQixFQUFzQkMsT0FsQmhDOztBQUFBLG9CQWtCNkNDLE9BQUQ7QUFBQSxzQkFLakNBLE9BQU8sQ0FBQ0MsT0FBUixDQUFnQixDQUFoQixFQUFtQkMsTUFMYzs7QUFBQSxzQkFNdkNyQyxNQUFEO0FBQUEscUJBQ0c7QUFDQ0EsZ0JBQUFBLE1BQU0sRUFBRUMsTUFBTSxDQUFDRCxNQUFNLENBQUMsVUFBRCxDQUFOLENBQW1CLENBQW5CLENBQUQsQ0FEZjtBQUVDUSxnQkFBQUEsSUFBSSxFQUFFUixNQUFNLENBQUMsUUFBRCxDQUFOLENBQWlCLENBQWpCLENBRlA7QUFHQ3NDLGdCQUFBQSxNQUFNLEVBQUV0QyxNQUFNLENBQUMsVUFBRCxDQUFOLENBQW1CLENBQW5CLENBSFQ7QUFJQ0QsZ0JBQUFBLE1BQU0sRUFBRUMsTUFBTSxDQUFDLFVBQUQsQ0FBTixDQUFtQixDQUFuQixDQUpUO0FBS0N1QyxnQkFBQUEsS0FBSyxFQUFFO0FBQ0wvQixrQkFBQUEsSUFBSSxFQUFFUixNQUFNLENBQUMsU0FBRCxDQUFOLENBQWtCLENBQWxCLENBREQ7QUFFTGEsa0JBQUFBLE9BQU8sRUFBRWIsTUFBTSxDQUFDLFdBQUQsQ0FBTixDQUFvQixDQUFwQixDQUZKO0FBR0xXLGtCQUFBQSxLQUFLLEVBQUVYLE1BQU0sQ0FBQyxjQUFELENBQU4sQ0FBdUIsQ0FBdkI7QUFIRixpQkFMUjtBQVVDd0MsZ0JBQUFBLFNBQVMsRUFBRXhDLE1BQU0sQ0FBQyxhQUFELENBQU4sQ0FBc0IsQ0FBdEI7QUFWWixlQURIO0FBQUEsYUFOd0M7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBLG1CQUFjO0FBQ3hESSxjQUFBQSxJQUFJLEVBQUUsSUFBSUUsSUFBSixDQUFTNkIsT0FBTyxDQUFDLGVBQUQsQ0FBUCxDQUF5QixDQUF6QixDQUFULENBRGtEO0FBRXhERyxjQUFBQSxNQUFNLEVBQUVILE9BQU8sQ0FBQyxVQUFELENBQVAsQ0FBb0IsQ0FBcEIsQ0FGZ0Q7QUFHeERNLGNBQUFBLElBQUksRUFBRU4sT0FBTyxDQUFDLFFBQUQsQ0FBUCxDQUFrQixDQUFsQixDQUhrRDtBQUl4RE8sY0FBQUEsV0FBVyxFQUFFUCxPQUFPLENBQUMseUJBQUQsQ0FBUCxDQUFtQyxDQUFuQyxDQUoyQztBQUt4RFEsY0FBQUEsT0FBTztBQUxpRCxhQUFkO0FBQUEsV0FsQjVDOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQSxvQkF1Q2F6RCxTQUFTLENBQUMwRCxlQUFWLENBQTBCLENBQTFCLEVBQTZCQyxXQXZDMUM7O0FBQUEsb0JBdUMwRCxDQUFDQyxFQUFELEVBQUtDLENBQUw7QUFBQSxtQkFBWTtBQUNwRS9DLGNBQUFBLE1BQU0sRUFBRUMsTUFBTSxDQUFDNkMsRUFBRSxDQUFDLFVBQUQsQ0FBRixDQUFlLENBQWYsQ0FBRCxDQURzRDtBQUVwRUUsY0FBQUEsS0FBSyxFQUFFO0FBQ0xDLGdCQUFBQSxPQUFPLEVBQUVoRCxNQUFNLENBQUNmLFNBQVMsQ0FBQ2dFLFlBQVYsQ0FBdUIsQ0FBdkIsRUFBMEJMLFdBQTFCLENBQXNDRSxDQUF0QyxFQUF5QyxTQUF6QyxFQUFvRCxDQUFwRCxDQUFELENBRFY7QUFFTEksZ0JBQUFBLE9BQU8sRUFBRWxELE1BQU0sQ0FBQ2YsU0FBUyxDQUFDa0UsWUFBVixDQUF1QixDQUF2QixFQUEwQlAsV0FBMUIsQ0FBc0NFLENBQXRDLEVBQXlDLFNBQXpDLEVBQW9ELENBQXBELENBQUQsQ0FGVjtBQUdMTSxnQkFBQUEsU0FBUyxFQUFFcEQsTUFBTSxDQUFDZixTQUFTLENBQUNvRSxjQUFWLENBQXlCLENBQXpCLEVBQTRCVCxXQUE1QixDQUF3Q0UsQ0FBeEMsRUFBMkMsU0FBM0MsRUFBc0QsQ0FBdEQsQ0FBRCxDQUhaO0FBSUxRLGdCQUFBQSxVQUFVLEVBQUV0RCxNQUFNLENBQUNmLFNBQVMsQ0FBQzBELGVBQVYsQ0FBMEIsQ0FBMUIsRUFBNkJDLFdBQTdCLENBQXlDRSxDQUF6QyxFQUE0QyxTQUE1QyxFQUF1RCxDQUF2RCxDQUFELENBSmI7QUFLTFMsZ0JBQUFBLGdCQUFnQixFQUFFdkQsTUFBTSxDQUFDZixTQUFTLENBQUN1RSxxQkFBVixDQUFnQyxDQUFoQyxFQUFtQ1osV0FBbkMsQ0FBK0NFLENBQS9DLEVBQWtELFNBQWxELEVBQTZELENBQTdELENBQUQ7QUFMbkI7QUFGNkQsYUFBWjtBQUFBLFdBdkMxRDs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBVUYvRCxVQUFBQSxHQUFHLENBQUM7QUFDRjBFLFlBQUFBLElBQUksRUFBRXhFLFNBQVMsQ0FBQyxRQUFELENBQVQsQ0FBb0IsQ0FBcEIsQ0FESjtBQUVGYyxZQUFBQSxNQUFNLEVBQUU7QUFDTmdELGNBQUFBLEtBQUssRUFBRS9DLE1BQU0sQ0FBQ2YsU0FBUyxDQUFDLGVBQUQsQ0FBVCxDQUEyQixDQUEzQixDQUFELENBRFA7QUFFTm1CLGNBQUFBLEtBQUssRUFBRUosTUFBTSxDQUFDZixTQUFTLENBQUMsZUFBRCxDQUFULENBQTJCLENBQTNCLENBQUQsQ0FGUDtBQUdOcUIsY0FBQUEsR0FBRyxFQUFFTixNQUFNLENBQUNmLFNBQVMsQ0FBQyxhQUFELENBQVQsQ0FBeUIsQ0FBekIsQ0FBRDtBQUhMLGFBRk47QUFPRnlFLFlBQUFBLFVBQVUsRUFBRXpFLFNBQVMsQ0FBQyxjQUFELENBQVQsQ0FBMEIsQ0FBMUIsQ0FQVjtBQVFGMEUsWUFBQUEsUUFBUSxLQVJOO0FBNkJGQyxZQUFBQSxXQUFXO0FBN0JULFdBQUQsQ0FBSDtBQXdDRCxTQWxERCxDQWtERSxPQUFPaEMsQ0FBUCxFQUFVO0FBQ1Y1QyxVQUFBQSxHQUFHLENBQUM0QyxDQUFELENBQUg7QUFDRDtBQUNGLE9BdERNLENBQVA7QUF1REQ7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ1NpQyxJQUFBQSxTQUFTLENBQUNDLG9CQUFELEVBQW9EO0FBQ2xFLGFBQU8sSUFBSWhGLE9BQUosQ0FBWSxPQUFPQyxHQUFQLEVBQVlDLEdBQVosS0FBb0I7QUFDckMsWUFBSTtBQUNGLGdCQUFNQyxTQUE2QixHQUFHLE1BQU0sTUFBTUMsY0FBTixDQUFxQjtBQUMvREMsWUFBQUEsVUFBVSxFQUFFLFdBRG1EO0FBRS9EQyxZQUFBQSxRQUFRLEVBQUU7QUFBRUMsY0FBQUEsVUFBVSxFQUFFLENBQWQ7QUFBaUIsa0JBQUl5RSxvQkFBb0IsR0FBRztBQUFFQyxnQkFBQUEsZUFBZSxFQUFFRDtBQUFuQixlQUFILEdBQStDLEVBQXZFO0FBQWpCO0FBRnFELFdBQXJCLENBQTVDO0FBREUsb0JBdUJhN0UsU0FBUyxDQUFDK0UsU0FBVixDQUFvQixDQUFwQixFQUF1QkMsZ0JBQXZCLENBQXdDLENBQXhDLEVBQTJDQyxZQXZCeEQ7O0FBQUEsb0JBdUIwRW5FLE1BQUQ7QUFBQSxtQkFBYTtBQUNsRkksY0FBQUEsSUFBSSxFQUFFO0FBQUVDLGdCQUFBQSxLQUFLLEVBQUUsSUFBSUMsSUFBSixDQUFTTixNQUFNLENBQUMsYUFBRCxDQUFOLENBQXNCLENBQXRCLENBQVQsQ0FBVDtBQUE2Q08sZ0JBQUFBLEdBQUcsRUFBRSxJQUFJRCxJQUFKLENBQVNOLE1BQU0sQ0FBQyxXQUFELENBQU4sQ0FBb0IsQ0FBcEIsQ0FBVDtBQUFsRCxlQUQ0RTtBQUVsRlEsY0FBQUEsSUFBSSxFQUFFUixNQUFNLENBQUMsZUFBRCxDQUFOLENBQXdCLENBQXhCLENBRjRFO0FBR2xGd0IsY0FBQUEsS0FBSyxFQUFFdkIsTUFBTSxDQUFDRCxNQUFNLENBQUMsU0FBRCxDQUFOLENBQWtCLENBQWxCLENBQUQ7QUFIcUUsYUFBYjtBQUFBLFdBdkJ6RTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUEsb0JBNkJTZCxTQUFTLENBQUMrRSxTQUFWLENBQW9CLENBQXBCLEVBQXVCRyxPQUF2QixDQUErQixDQUEvQixFQUFrQ0MsTUE3QjNDOztBQUFBLG9CQTZCdUR0RSxNQUFEO0FBQUEsdUJBUzdDQSxNQUFNLENBQUN1RSxLQUFQLENBQWEsQ0FBYixFQUFnQkMsSUFUNkI7O0FBQUEsdUJBU25CQyxJQUFEO0FBQUEseUJBd0JqQkEsSUFBSSxDQUFDQyxXQUFMLENBQWlCLENBQWpCLEVBQW9CQyxVQXhCSDs7QUFBQSx5QkF3Qm1CQyxVQUFEO0FBQUEsdUJBQWlCO0FBQy9EQyxrQkFBQUEsV0FBVyxFQUFFRCxVQUFVLENBQUMsZUFBRCxDQUFWLENBQTRCLENBQTVCLENBRGtEO0FBRS9EbkUsa0JBQUFBLElBQUksRUFBRW1FLFVBQVUsQ0FBQyxXQUFELENBQVYsQ0FBd0IsQ0FBeEIsQ0FGeUQ7QUFHL0RqQixrQkFBQUEsSUFBSSxFQUFFaUIsVUFBVSxDQUFDLFFBQUQsQ0FBVixDQUFxQixDQUFyQixDQUh5RDtBQUkvRHZFLGtCQUFBQSxJQUFJLEVBQUU7QUFDSkMsb0JBQUFBLEtBQUssRUFBRSxJQUFJQyxJQUFKLENBQVNxRSxVQUFVLENBQUMsUUFBRCxDQUFWLENBQXFCLENBQXJCLENBQVQsQ0FESDtBQUVKRSxvQkFBQUEsR0FBRyxFQUFFLElBQUl2RSxJQUFKLENBQVNxRSxVQUFVLENBQUMsV0FBRCxDQUFWLENBQXdCLENBQXhCLENBQVQ7QUFGRCxtQkFKeUQ7QUFRL0RHLGtCQUFBQSxLQUFLLEVBQUU7QUFDTHBCLG9CQUFBQSxJQUFJLEVBQUVpQixVQUFVLENBQUMsYUFBRCxDQUFWLENBQTBCLENBQTFCLENBREQ7QUFFTEksb0JBQUFBLEtBQUssRUFBRUosVUFBVSxDQUFDLFNBQUQsQ0FBVixDQUFzQixDQUF0QjtBQUZGLG1CQVJ3RDtBQVkvREssa0JBQUFBLE1BQU0sRUFBRUwsVUFBVSxDQUFDLFVBQUQsQ0FBVixDQUF1QixDQUF2QixDQVp1RDtBQWEvRE0sa0JBQUFBLEtBQUssRUFBRU4sVUFBVSxDQUFDLFNBQUQsQ0FBVixDQUFzQixDQUF0QixDQWJ3RDtBQWMvRE8sa0JBQUFBLFNBQVMsRUFBRVAsVUFBVSxDQUFDLGFBQUQsQ0FBVixDQUEwQixDQUExQixDQWRvRDtBQWUvRGpDLGtCQUFBQSxXQUFXLEVBQUVpQyxVQUFVLENBQUMsc0JBQUQsQ0FBVixDQUFtQyxDQUFuQyxDQWZrRDtBQWdCL0RRLGtCQUFBQSxVQUFVLEVBQUVDLElBQUksQ0FBQ0MsS0FBTCxDQUFXVixVQUFVLENBQUMsY0FBRCxDQUFWLENBQTJCLENBQTNCLENBQVgsQ0FoQm1EO0FBaUIvRFcsa0JBQUFBLFNBQVMsRUFBRVgsVUFBVSxDQUFDLGFBQUQsQ0FBVixDQUEwQixDQUExQixDQWpCb0Q7QUFrQi9EWSxrQkFBQUEsV0FBVyxFQUFFO0FBQ1hsRixvQkFBQUEsS0FBSyxFQUFFLElBQUlDLElBQUosQ0FBU3FFLFVBQVUsQ0FBQyxpQkFBRCxDQUFWLENBQThCLENBQTlCLENBQVQsQ0FESTtBQUVYcEUsb0JBQUFBLEdBQUcsRUFBRSxJQUFJRCxJQUFKLENBQVNxRSxVQUFVLENBQUMsZUFBRCxDQUFWLENBQTRCLENBQTVCLENBQVQ7QUFGTSxtQkFsQmtEO0FBc0IvRGEsa0JBQUFBLFNBQVMsRUFDUCxPQUFPYixVQUFVLENBQUNjLFNBQVgsQ0FBcUIsQ0FBckIsQ0FBUCxLQUFtQyxRQUFuQyxHQUNLZCxVQUFVLENBQUNjLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0JDLFFBQXhCLENBQWlDQyxHQUFqQyxDQUFzQ0MsSUFBRCxJQUFVO0FBQzlDLDRCQUFRQSxJQUFJLENBQUMsUUFBRCxDQUFKLENBQWUsQ0FBZixDQUFSO0FBQ0UsMkJBQUssTUFBTDtBQUNFLDhCQUFNQyxRQUFRLEdBQUdELElBQWpCO0FBQ0EsK0JBQU87QUFDTGxDLDBCQUFBQSxJQUFJLEVBQUVvQyxzQkFBYUMsSUFEZDtBQUVMQywwQkFBQUEsSUFBSSxFQUFFO0FBQ0p0Qyw0QkFBQUEsSUFBSSxFQUFFbUMsUUFBUSxDQUFDLFlBQUQsQ0FBUixDQUF1QixDQUF2QixDQURGO0FBRUpyRiw0QkFBQUEsSUFBSSxFQUFFcUYsUUFBUSxDQUFDLFlBQUQsQ0FBUixDQUF1QixDQUF2QixDQUZGO0FBR0pJLDRCQUFBQSxHQUFHLEVBQUUsS0FBS3JILE9BQUwsR0FBZWlILFFBQVEsQ0FBQyxrQkFBRCxDQUFSLENBQTZCLENBQTdCO0FBSGhCLDJCQUZEO0FBT0xLLDBCQUFBQSxRQUFRLEVBQUU7QUFDUjlGLDRCQUFBQSxJQUFJLEVBQUUsSUFBSUUsSUFBSixDQUFTdUYsUUFBUSxDQUFDLGdCQUFELENBQVIsQ0FBMkIsQ0FBM0IsQ0FBVCxDQURFO0FBRVJNLDRCQUFBQSxFQUFFLEVBQUVOLFFBQVEsQ0FBQyxjQUFELENBQVIsQ0FBeUIsQ0FBekIsQ0FGSTtBQUdSckYsNEJBQUFBLElBQUksRUFBRXFGLFFBQVEsQ0FBQyxnQkFBRCxDQUFSLENBQTJCLENBQTNCO0FBSEU7QUFQTCx5QkFBUDs7QUFhRiwyQkFBSyxLQUFMO0FBQ0UsOEJBQU1PLE9BQU8sR0FBR1IsSUFBaEI7QUFDQSwrQkFBTztBQUNMOUUsMEJBQUFBLEdBQUcsRUFBRXNGLE9BQU8sQ0FBQyxPQUFELENBQVAsQ0FBaUIsQ0FBakIsQ0FEQTtBQUVMMUMsMEJBQUFBLElBQUksRUFBRW9DLHNCQUFhTyxHQUZkO0FBR0xILDBCQUFBQSxRQUFRLEVBQUU7QUFDUjlGLDRCQUFBQSxJQUFJLEVBQUUsSUFBSUUsSUFBSixDQUFTOEYsT0FBTyxDQUFDLGdCQUFELENBQVAsQ0FBMEIsQ0FBMUIsQ0FBVCxDQURFO0FBRVJELDRCQUFBQSxFQUFFLEVBQUVDLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0IsQ0FBeEIsQ0FGSTtBQUdSNUYsNEJBQUFBLElBQUksRUFBRTRGLE9BQU8sQ0FBQyxnQkFBRCxDQUFQLENBQTBCLENBQTFCLENBSEU7QUFJUjFELDRCQUFBQSxXQUFXLEVBQUUwRCxPQUFPLENBQUMsdUJBQUQsQ0FBUCxDQUFpQyxDQUFqQztBQUpMLDJCQUhMO0FBU0xFLDBCQUFBQSxJQUFJLEVBQUVGLE9BQU8sQ0FBQyxrQkFBRCxDQUFQLENBQTRCLENBQTVCO0FBVEQseUJBQVA7O0FBV0Y7QUFDRW5ILHdCQUFBQSxHQUFHLENBQUUsUUFBTzJHLElBQUksQ0FBQyxRQUFELENBQUosQ0FBZSxDQUFmLENBQWtCLHlEQUEzQixDQUFIO0FBOUJKO0FBZ0NELG1CQWpDQSxDQURMLEdBbUNJO0FBMUR5RCxpQkFBakI7QUFBQSxlQXhCbEI7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBLHFCQUFXO0FBQ3pDcEYsZ0JBQUFBLElBQUksRUFBRWdFLElBQUksQ0FBQyxZQUFELENBQUosQ0FBbUIsQ0FBbkIsQ0FEbUM7QUFFekMrQixnQkFBQUEsZUFBZSxFQUFFO0FBQ2ZDLGtCQUFBQSxNQUFNLEVBQUVoQyxJQUFJLENBQUMseUJBQUQsQ0FBSixDQUFnQyxDQUFoQyxDQURPO0FBRWZpQyxrQkFBQUEsR0FBRyxFQUFFeEcsTUFBTSxDQUFDdUUsSUFBSSxDQUFDLHNCQUFELENBQUosQ0FBNkIsQ0FBN0IsQ0FBRDtBQUZJLGlCQUZ3QjtBQU16Q2tDLGdCQUFBQSxrQkFBa0IsRUFDaEIsT0FBT2xDLElBQUksQ0FBQyx5QkFBRCxDQUFKLENBQWdDLENBQWhDLENBQVAsS0FBOEMsUUFBOUMsR0FDSUEsSUFBSSxDQUFDLHlCQUFELENBQUosQ0FBZ0MsQ0FBaEMsRUFBbUNtQyxtQkFBbkMsQ0FBdURoQixHQUF2RCxDQUNHaUIsUUFBRDtBQUFBLHlCQUNHO0FBQ0NsRCxvQkFBQUEsSUFBSSxFQUFFa0QsUUFBUSxDQUFDLFFBQUQsQ0FBUixDQUFtQixDQUFuQixDQURQO0FBRUNDLG9CQUFBQSxjQUFjLEVBQUVELFFBQVEsQ0FBQyxrQkFBRCxDQUFSLENBQTZCLENBQTdCLENBRmpCO0FBR0NFLG9CQUFBQSxNQUFNLEVBQUU7QUFDTkMsc0JBQUFBLFNBQVMsRUFBRUgsUUFBUSxDQUFDLGVBQUQsQ0FBUixDQUEwQixDQUExQixDQURMO0FBRU5JLHNCQUFBQSxRQUFRLEVBQUVKLFFBQVEsQ0FBQyxVQUFELENBQVIsQ0FBcUIsQ0FBckI7QUFGSixxQkFIVDtBQU9DNUIsb0JBQUFBLE1BQU0sRUFBRTtBQUNOaUMsc0JBQUFBLE9BQU8sRUFBRWhILE1BQU0sQ0FBQzJHLFFBQVEsQ0FBQyxVQUFELENBQVIsQ0FBcUIsQ0FBckIsQ0FBRCxDQURUO0FBRU5NLHNCQUFBQSxRQUFRLEVBQUVqSCxNQUFNLENBQUMyRyxRQUFRLENBQUMsa0JBQUQsQ0FBUixDQUE2QixDQUE3QixDQUFEO0FBRlY7QUFQVCxtQkFESDtBQUFBLGlCQURGLENBREosR0FnQkksRUF2Qm1DO0FBd0J6Q08sZ0JBQUFBLFdBQVc7QUF4QjhCLGVBQVg7QUFBQSxhQVRvQjs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUEsbUJBQWE7QUFDakVuSCxjQUFBQSxNQUFNLEVBQUVDLE1BQU0sQ0FBQ0YsTUFBTSxDQUFDLFVBQUQsQ0FBTixDQUFtQixDQUFuQixDQUFELENBRG1EO0FBRWpFcUgsY0FBQUEsS0FBSyxFQUFFckgsTUFBTSxDQUFDLFNBQUQsQ0FBTixDQUFrQixDQUFsQixDQUYwRDtBQUdqRXFCLGNBQUFBLElBQUksRUFBRXJCLE1BQU0sQ0FBQyxRQUFELENBQU4sQ0FBaUIsQ0FBakIsQ0FIMkQ7QUFJakV3QyxjQUFBQSxLQUFLLEVBQUU7QUFDTC9CLGdCQUFBQSxJQUFJLEVBQUVULE1BQU0sQ0FBQyxTQUFELENBQU4sQ0FBa0IsQ0FBbEIsQ0FERDtBQUVMWSxnQkFBQUEsS0FBSyxFQUFFWixNQUFNLENBQUMsY0FBRCxDQUFOLENBQXVCLENBQXZCLENBRkY7QUFHTGMsZ0JBQUFBLE9BQU8sRUFBRWQsTUFBTSxDQUFDLFdBQUQsQ0FBTixDQUFvQixDQUFwQjtBQUhKLGVBSjBEO0FBU2pFc0gsY0FBQUEsS0FBSztBQVQ0RCxhQUFiO0FBQUEsV0E3QnREOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFLRnJJLFVBQUFBLEdBQUcsQ0FBQztBQUNGMEMsWUFBQUEsS0FBSyxFQUFFeEMsU0FBUyxDQUFDK0UsU0FBVixDQUFvQixDQUFwQixFQUF1QixnQkFBdkIsRUFBeUMsQ0FBekMsQ0FETDtBQUVGUCxZQUFBQSxJQUFJLEVBQUV4RSxTQUFTLENBQUMrRSxTQUFWLENBQW9CLENBQXBCLEVBQXVCLFFBQXZCLEVBQWlDLENBQWpDLENBRko7QUFHRnFELFlBQUFBLGVBQWUsRUFBRTtBQUNmTCxjQUFBQSxPQUFPLEVBQUU7QUFDUHpGLGdCQUFBQSxLQUFLLEVBQ0h1QyxvQkFBb0IsSUFDcEI5RCxNQUFNLENBQ0pmLFNBQVMsQ0FBQytFLFNBQVYsQ0FBb0IsQ0FBcEIsRUFBdUJDLGdCQUF2QixDQUF3QyxDQUF4QyxFQUEyQ0MsWUFBM0MsQ0FBd0RvRCxJQUF4RCxDQUNHQyxDQUFEO0FBQUEseUJBQU9BLENBQUMsQ0FBQyxlQUFELENBQUQsQ0FBbUIsQ0FBbkIsTUFBMEJ0SSxTQUFTLENBQUMrRSxTQUFWLENBQW9CLENBQXBCLEVBQXVCRCxlQUF2QixDQUF1QyxDQUF2QyxFQUEwQyxlQUExQyxFQUEyRCxDQUEzRCxDQUFqQztBQUFBLGlCQURGLElBRUksU0FGSixFQUVlLENBRmYsQ0FESSxDQUhEO0FBUVA1RCxnQkFBQUEsSUFBSSxFQUFFO0FBQ0pDLGtCQUFBQSxLQUFLLEVBQUUsSUFBSUMsSUFBSixDQUFTcEIsU0FBUyxDQUFDK0UsU0FBVixDQUFvQixDQUFwQixFQUF1QkQsZUFBdkIsQ0FBdUMsQ0FBdkMsRUFBMEMsYUFBMUMsRUFBeUQsQ0FBekQsQ0FBVCxDQURIO0FBRUp6RCxrQkFBQUEsR0FBRyxFQUFFLElBQUlELElBQUosQ0FBU3BCLFNBQVMsQ0FBQytFLFNBQVYsQ0FBb0IsQ0FBcEIsRUFBdUJELGVBQXZCLENBQXVDLENBQXZDLEVBQTBDLFdBQTFDLEVBQXVELENBQXZELENBQVQ7QUFGRCxpQkFSQztBQVlQeEQsZ0JBQUFBLElBQUksRUFBRXRCLFNBQVMsQ0FBQytFLFNBQVYsQ0FBb0IsQ0FBcEIsRUFBdUJELGVBQXZCLENBQXVDLENBQXZDLEVBQTBDLGVBQTFDLEVBQTJELENBQTNEO0FBWkMsZUFETTtBQWVmeUQsY0FBQUEsU0FBUztBQWZNLGFBSGY7QUF3QkZDLFlBQUFBLE9BQU87QUF4QkwsV0FBRCxDQUFIO0FBd0hELFNBN0hELENBNkhFLE9BQU83RixDQUFQLEVBQVU7QUFDVjVDLFVBQUFBLEdBQUcsQ0FBQzRDLENBQUQsQ0FBSDtBQUNEO0FBQ0YsT0FqSU0sQ0FBUDtBQWtJRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNTOEYsSUFBQUEsUUFBUSxHQUF1QjtBQUNwQyxhQUFPLElBQUk1SSxPQUFKLENBQVksT0FBT0MsR0FBUCxFQUFZQyxHQUFaLEtBQW9CO0FBQ3JDLFlBQUk7QUFDRixnQkFBTUMsU0FBMkIsR0FBRyxNQUFNLE1BQU1DLGNBQU4sQ0FBcUI7QUFDN0RDLFlBQUFBLFVBQVUsRUFBRSxnQkFEaUQ7QUFFN0RDLFlBQUFBLFFBQVEsRUFBRTtBQUFFQyxjQUFBQSxVQUFVLEVBQUU7QUFBZDtBQUZtRCxXQUFyQixDQUExQztBQURFLHFCQU1BSixTQUFTLENBQUMwSSxlQUFWLENBQTBCLENBQTFCLEVBQTZCQyxlQUE3QixDQUE2QyxDQUE3QyxFQUFnREMsY0FOaEQ7O0FBQUEscUJBT0dDLE9BQUQ7QUFBQSxtQkFBYSxJQUFJQyxnQkFBSixDQUFZRCxPQUFaLEVBQXFCLE1BQU1wSixXQUEzQixFQUF3QyxLQUFLQyxPQUE3QyxDQUFiO0FBQUEsV0FQRjs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBS0ZJLFVBQUFBLEdBQUcsTUFBSDtBQUtELFNBVkQsQ0FVRSxPQUFPNkMsQ0FBUCxFQUFVO0FBQ1Y1QyxVQUFBQSxHQUFHLENBQUM0QyxDQUFELENBQUg7QUFDRDtBQUNGLE9BZE0sQ0FBUDtBQWVEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ1NvRyxJQUFBQSxXQUFXLEdBQXlCO0FBQ3pDLGFBQU8sSUFBSWxKLE9BQUosQ0FBeUIsT0FBT0MsR0FBUCxFQUFZQyxHQUFaLEtBQW9CO0FBQ2xELFlBQUk7QUFDRixnQkFBTWlKLGFBQW1DLEdBQUcsTUFBTSxNQUFNL0ksY0FBTixDQUFxQjtBQUNyRUMsWUFBQUEsVUFBVSxFQUFFLGFBRHlEO0FBRXJFQyxZQUFBQSxRQUFRLEVBQUU7QUFBRUMsY0FBQUEsVUFBVSxFQUFFO0FBQWQ7QUFGMkQsV0FBckIsQ0FBbEQ7QUFERSxxQkFrQ21CNEksYUFBYSxDQUFDQyxXQUFkLENBQTBCLENBQTFCLEVBQTZCQyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q0MsaUJBQXhDLENBQTBELENBQTFELEVBQTZEQyxnQkFsQ2hGOztBQUFBLHFCQW1DR0MsT0FBRDtBQUFBLG1CQUFjO0FBQ1ovSCxjQUFBQSxJQUFJLEVBQUUrSCxPQUFPLENBQUMsUUFBRCxDQUFQLENBQWtCLENBQWxCLENBRE07QUFFWkMsY0FBQUEsS0FBSyxFQUFFO0FBQ0xDLGdCQUFBQSxJQUFJLEVBQUVGLE9BQU8sQ0FBQyxhQUFELENBQVAsQ0FBdUIsQ0FBdkIsQ0FERDtBQUVMRyxnQkFBQUEsTUFBTSxFQUFFSCxPQUFPLENBQUMsZUFBRCxDQUFQLENBQXlCLENBQXpCLENBRkg7QUFHTEksZ0JBQUFBLEtBQUssRUFBRUosT0FBTyxDQUFDLGNBQUQsQ0FBUCxDQUF3QixDQUF4QixDQUhGO0FBSUxLLGdCQUFBQSxJQUFJLEVBQUVMLE9BQU8sQ0FBQyxhQUFELENBQVAsQ0FBdUIsQ0FBdkI7QUFKRCxlQUZLO0FBUVpNLGNBQUFBLFlBQVksRUFBRU4sT0FBTyxDQUFDLGdCQUFELENBQVAsQ0FBMEIsQ0FBMUI7QUFSRixhQUFkO0FBQUEsV0FuQ0Y7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBLHFCQXdEZ0JMLGFBQWEsQ0FBQ0MsV0FBZCxDQUEwQixDQUExQixFQUE2QkMsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0NVLHFCQUF4QyxDQUE4RCxDQUE5RCxFQUFpRUMsbUJBeERqRjs7QUFBQSxxQkF5REdDLFVBQUQ7QUFBQSx1QkFJU0EsVUFBVSxDQUFDQyxnQkFBWCxDQUE0QixDQUE1QixFQUErQkMsZUFKeEM7O0FBQUEsdUJBSTZEQyxJQUFEO0FBQUEscUJBQVc7QUFDbkVDLGdCQUFBQSxNQUFNLEVBQUU7QUFDTkMsa0JBQUFBLE9BQU8sRUFBRUYsSUFBSSxDQUFDLGlCQUFELENBQUosQ0FBd0IsQ0FBeEIsQ0FESDtBQUVORyxrQkFBQUEsTUFBTSxFQUFFSCxJQUFJLENBQUMsZ0JBQUQsQ0FBSixDQUF1QixDQUF2QjtBQUZGLGlCQUQyRDtBQUtuRUksZ0JBQUFBLElBQUksRUFBRUosSUFBSSxDQUFDLFFBQUQsQ0FBSixDQUFlLENBQWYsQ0FMNkQ7QUFNbkVwRSxnQkFBQUEsS0FBSyxFQUFFb0UsSUFBSSxDQUFDLFNBQUQsQ0FBSixDQUFnQixDQUFoQixDQU40RDtBQU9uRXpGLGdCQUFBQSxJQUFJLEVBQUV5RixJQUFJLENBQUMsWUFBRCxDQUFKLENBQW1CLENBQW5CO0FBUDZELGVBQVg7QUFBQSxhQUo1RDs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUEsbUJBQWlCO0FBQ2ZoRCxjQUFBQSxFQUFFLEVBQUU2QyxVQUFVLENBQUMsY0FBRCxDQUFWLENBQTJCLENBQTNCLENBRFc7QUFFZnRGLGNBQUFBLElBQUksRUFBRXNGLFVBQVUsQ0FBQyxpQkFBRCxDQUFWLENBQThCLENBQTlCLENBRlM7QUFHZk8sY0FBQUEsSUFBSSxFQUFFUCxVQUFVLENBQUMsUUFBRCxDQUFWLENBQXFCLENBQXJCLENBSFM7QUFJZlEsY0FBQUEsS0FBSztBQUpVLGFBQWpCO0FBQUEsV0F6REY7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQU1GeEssVUFBQUEsR0FBRyxDQUFDO0FBQ0Z5SyxZQUFBQSxPQUFPLEVBQUU7QUFDUGpKLGNBQUFBLElBQUksRUFBRTBILGFBQWEsQ0FBQ0MsV0FBZCxDQUEwQixDQUExQixFQUE2QnVCLGFBQTdCLENBQTJDLENBQTNDLENBREM7QUFFUEMsY0FBQUEsUUFBUSxFQUFFekIsYUFBYSxDQUFDQyxXQUFkLENBQTBCLENBQTFCLEVBQTZCQyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q3dCLGNBQXhDLENBQXVELENBQXZELENBRkg7QUFHUEMsY0FBQUEsUUFBUSxFQUFFM0IsYUFBYSxDQUFDQyxXQUFkLENBQTBCLENBQTFCLEVBQTZCQyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3QzBCLFFBQXhDLENBQWlELENBQWpEO0FBSEgsYUFEUDtBQU1GQyxZQUFBQSxTQUFTLEVBQUU3QixhQUFhLENBQUNDLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJDLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDNEIsU0FBeEMsQ0FBa0QsQ0FBbEQsQ0FOVDtBQU9GQyxZQUFBQSxLQUFLLEVBQUUvQixhQUFhLENBQUNDLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJDLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDOEIsS0FBeEMsQ0FBOEMsQ0FBOUMsQ0FQTDtBQVFGQyxZQUFBQSxPQUFPLEVBQUVqQyxhQUFhLENBQUNDLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJDLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDZ0MsRUFBeEMsQ0FBMkMsQ0FBM0MsQ0FSUDtBQVNGQyxZQUFBQSxTQUFTLEVBQUU7QUFDVDdKLGNBQUFBLElBQUksRUFBRTBILGFBQWEsQ0FBQ0MsV0FBZCxDQUEwQixDQUExQixFQUE2QkMsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0NrQyxhQUF4QyxDQUFzRCxDQUF0RCxDQURHO0FBRVQzSixjQUFBQSxLQUFLLEVBQUV1SCxhQUFhLENBQUNDLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJDLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDbUMsY0FBeEMsQ0FBdUQsQ0FBdkQsQ0FGRTtBQUdUMUosY0FBQUEsT0FBTyxFQUFFcUgsYUFBYSxDQUFDQyxXQUFkLENBQTBCLENBQTFCLEVBQTZCQyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q29DLGdCQUF4QyxDQUF5RCxDQUF6RDtBQUhBLGFBVFQ7QUFjRkMsWUFBQUEsYUFBYSxFQUFFdkMsYUFBYSxDQUFDQyxXQUFkLENBQTBCLENBQTFCLEVBQTZCQyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q3NDLGFBQXhDLENBQXNELENBQXRELENBZGI7QUFlRkMsWUFBQUEsT0FBTyxFQUFFO0FBQ1BuSyxjQUFBQSxJQUFJLEVBQUUwSCxhQUFhLENBQUNDLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJDLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDd0MsT0FBeEMsQ0FBZ0QsQ0FBaEQsRUFBbUQsUUFBbkQsRUFBNkQsQ0FBN0QsQ0FEQztBQUVQcEMsY0FBQUEsS0FBSyxFQUFFTixhQUFhLENBQUNDLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJDLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDd0MsT0FBeEMsQ0FBZ0QsQ0FBaEQsRUFBbUQsU0FBbkQsRUFBOEQsQ0FBOUQsQ0FGQTtBQUdQQyxjQUFBQSxJQUFJLEVBQUUzQyxhQUFhLENBQUNDLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJDLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDd0MsT0FBeEMsQ0FBZ0QsQ0FBaEQsRUFBbUQsUUFBbkQsRUFBNkQsQ0FBN0QsQ0FIQztBQUlQRSxjQUFBQSxNQUFNLEVBQUU1QyxhQUFhLENBQUNDLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJDLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDd0MsT0FBeEMsQ0FBZ0QsQ0FBaEQsRUFBbUQsVUFBbkQsRUFBK0QsQ0FBL0Q7QUFKRCxhQWZQO0FBcUJGRyxZQUFBQSxTQUFTLEVBQUU7QUFDVHZLLGNBQUFBLElBQUksRUFBRTBILGFBQWEsQ0FBQ0MsV0FBZCxDQUEwQixDQUExQixFQUE2QkMsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0M0QyxTQUF4QyxDQUFrRCxDQUFsRCxFQUFxRCxRQUFyRCxFQUErRCxDQUEvRCxDQURHO0FBRVR4QyxjQUFBQSxLQUFLLEVBQUVOLGFBQWEsQ0FBQ0MsV0FBZCxDQUEwQixDQUExQixFQUE2QkMsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0M0QyxTQUF4QyxDQUFrRCxDQUFsRCxFQUFxRCxTQUFyRCxFQUFnRSxDQUFoRSxDQUZFO0FBR1RILGNBQUFBLElBQUksRUFBRTNDLGFBQWEsQ0FBQ0MsV0FBZCxDQUEwQixDQUExQixFQUE2QkMsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0M0QyxTQUF4QyxDQUFrRCxDQUFsRCxFQUFxRCxRQUFyRCxFQUErRCxDQUEvRCxDQUhHO0FBSVRDLGNBQUFBLFFBQVEsRUFBRS9DLGFBQWEsQ0FBQ0MsV0FBZCxDQUEwQixDQUExQixFQUE2QkMsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0M0QyxTQUF4QyxDQUFrRCxDQUFsRCxFQUFxRCxZQUFyRCxFQUFtRSxDQUFuRTtBQUpELGFBckJUO0FBMkJGckssWUFBQUEsS0FBSyxFQUFFdUgsYUFBYSxDQUFDQyxXQUFkLENBQTBCLENBQTFCLEVBQTZCQyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3QzhDLEtBQXhDLENBQThDLENBQTlDLENBM0JMO0FBNEJGQyxZQUFBQSxpQkFBaUIsTUE1QmY7QUF3Q0ZDLFlBQUFBLE1BQU0sRUFBRWxELGFBQWEsQ0FBQ0MsV0FBZCxDQUEwQixDQUExQixFQUE2QmtELE1BQTdCLENBQW9DLENBQXBDLENBeENOO0FBeUNGQyxZQUFBQSxLQUFLLEVBQUVwRCxhQUFhLENBQUNDLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJvRCxLQUE3QixDQUFtQyxDQUFuQyxDQXpDTDtBQTBDRkMsWUFBQUEsaUJBQWlCLEVBQUV0RCxhQUFhLENBQUNDLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJzRCxpQkFBN0IsQ0FBK0MsQ0FBL0MsQ0ExQ2pCO0FBMkNGQyxZQUFBQSxZQUFZLEVBQUV4RCxhQUFhLENBQUNDLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJDLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDdUQsWUFBeEMsQ0FBcUQsQ0FBckQsQ0EzQ1o7QUE0Q0ZDLFlBQUFBLFFBQVEsRUFBRTFELGFBQWEsQ0FBQ0MsV0FBZCxDQUEwQixDQUExQixFQUE2QkMsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0N5RCxRQUF4QyxDQUFpRCxDQUFqRCxDQTVDUjtBQTZDRkMsWUFBQUEsZUFBZSxFQUFFO0FBQ2ZuTCxjQUFBQSxLQUFLLEVBQUV1SCxhQUFhLENBQUNDLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJDLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDMkQsZ0JBQXhDLENBQXlELENBQXpELENBRFE7QUFFZnZMLGNBQUFBLElBQUksRUFBRTBILGFBQWEsQ0FBQ0MsV0FBZCxDQUEwQixDQUExQixFQUE2QkMsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0M0RCxXQUF4QyxDQUFvRCxDQUFwRCxDQUZTO0FBR2ZuTCxjQUFBQSxPQUFPLEVBQUVxSCxhQUFhLENBQUNDLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJDLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDNkQsa0JBQXhDLENBQTJELENBQTNEO0FBSE0sYUE3Q2Y7QUFrREZDLFlBQUFBLGNBQWM7QUFsRFosV0FBRCxDQUFIO0FBbUVELFNBekVELENBeUVFLE9BQU9ySyxDQUFQLEVBQVU7QUFDVjVDLFVBQUFBLEdBQUcsQ0FBQzRDLENBQUQsQ0FBSDtBQUNEO0FBQ0YsT0E3RU0sQ0FBUDtBQThFRDs7QUFFT3NLLElBQUFBLHlCQUF5QixDQUFDL0wsSUFBRCxFQUFhO0FBQzVDLGFBQU8sTUFBTWpCLGNBQU4sQ0FBd0M7QUFDN0NDLFFBQUFBLFVBQVUsRUFBRSxpQkFEaUM7QUFFN0NDLFFBQUFBLFFBQVEsRUFBRTtBQUFFQyxVQUFBQSxVQUFVLEVBQUUsQ0FBZDtBQUFpQjhNLFVBQUFBLFdBQVcsRUFBRWhNLElBQUksQ0FBQ2lNLFdBQUw7QUFBOUI7QUFGbUMsT0FBeEMsQ0FBUDtBQUlEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU0MsSUFBQUEsUUFBUSxDQUFDQyxPQUFELEVBQThDO0FBQzNELFlBQU1DLGNBQStCLEdBQUc7QUFDdENDLFFBQUFBLFdBQVcsRUFBRSxDQUR5QjtBQUV0QyxXQUFHRjtBQUZtQyxPQUF4QztBQUlBLGFBQU8sSUFBSXhOLE9BQUosQ0FBWSxPQUFPQyxHQUFQLEVBQVlDLEdBQVosS0FBb0I7QUFDckMsWUFBSTtBQUNGLGNBQUl5TixlQUE4QixHQUFHSCxPQUFPLENBQUNJLFFBQVIsQ0FBaUJ0TSxLQUF0RDtBQUNBLGNBQUl1TSxhQUE0QixHQUFHTCxPQUFPLENBQUNJLFFBQVIsQ0FBaUJwTSxHQUFwRDtBQUVBLGdCQUFNc00sc0JBQXNCLEdBQUcsa0NBQW9CO0FBQUV4TSxZQUFBQSxLQUFLLEVBQUVxTSxlQUFUO0FBQTBCbk0sWUFBQUEsR0FBRyxFQUFFcU07QUFBL0IsV0FBcEIsQ0FBL0I7QUFDQSxnQkFBTUUseUJBQThDLEdBQ2xETixjQUFjLENBQUNDLFdBQWYsSUFBOEIsSUFBOUIsR0FDSSxNQUFNMU4sT0FBTyxDQUFDZ08sR0FBUixDQUFZRixzQkFBc0IsQ0FBQ2xILEdBQXZCLENBQTRCdkYsSUFBRDtBQUFBLG1CQUFVLEtBQUsrTCx5QkFBTCxDQUErQi9MLElBQS9CLENBQVY7QUFBQSxXQUEzQixDQUFaLENBRFYsR0FFSSxNQUFNLDRCQUFVb00sY0FBYyxDQUFDQyxXQUF6QixFQUFzQ0ksc0JBQXRDLEVBQStEek0sSUFBRDtBQUFBLG1CQUNsRSxLQUFLK0wseUJBQUwsQ0FBK0IvTCxJQUEvQixDQURrRTtBQUFBLFdBQTlELENBSFo7QUFNQSxjQUFJNE0sSUFBcUIsR0FBRyxJQUE1QjtBQUNBLGdCQUFNQyxNQUFNLEdBQUdILHlCQUF5QixDQUFDSSxNQUExQixDQUFpQyxDQUFDQyxJQUFELEVBQU9GLE1BQVAsS0FBa0I7QUFDaEUsZ0JBQUlELElBQUksSUFBSSxJQUFaO0FBQ0VBLGNBQUFBLElBQUksR0FBRztBQUNMSSxnQkFBQUEsVUFBVSxFQUFFO0FBQ1YvTSxrQkFBQUEsS0FBSyxFQUFFLElBQUlDLElBQUosQ0FBUzJNLE1BQU0sQ0FBQ0ksZUFBUCxDQUF1QixDQUF2QixFQUEwQixpQkFBMUIsRUFBNkMsQ0FBN0MsQ0FBVCxDQURHO0FBRVY5TSxrQkFBQUEsR0FBRyxFQUFFLElBQUlELElBQUosQ0FBUzJNLE1BQU0sQ0FBQ0ksZUFBUCxDQUF1QixDQUF2QixFQUEwQixpQkFBMUIsRUFBNkMsQ0FBN0MsQ0FBVDtBQUZLLGlCQURQO0FBS0xDLGdCQUFBQSxXQUFXLEVBQUU7QUFDWGpOLGtCQUFBQSxLQUFLLEVBQUVxTSxlQURJO0FBRVhuTSxrQkFBQUEsR0FBRyxFQUFFcU07QUFGTSxpQkFMUjtBQVNMSyxnQkFBQUEsTUFBTSxFQUFFO0FBVEgsZUFBUDtBQURGOztBQURnRSx1QkFpQnhEQSxNQUFNLENBQUNJLGVBQVAsQ0FBdUIsQ0FBdkIsRUFBMEJFLFVBQTFCLENBQXFDLENBQXJDLEVBQXdDQyxTQWpCZ0I7O0FBQUEsdUJBaUJEQyxLQUFELElBQVc7QUFDbkUsc0JBQVFBLEtBQUssQ0FBQyxXQUFELENBQUwsQ0FBbUIsQ0FBbkIsQ0FBUjtBQUNFLHFCQUFLQyxtQkFBVUMsVUFBZjtBQUEyQjtBQUN6QiwwQkFBTUMsZUFBZSxHQUFHSCxLQUF4QjtBQUNBLDJCQUFPO0FBQ0xyRyxzQkFBQUEsS0FBSyxFQUFFd0csZUFBZSxDQUFDLFNBQUQsQ0FBZixDQUEyQixDQUEzQixDQURGO0FBRUxDLHNCQUFBQSxXQUFXLEVBQUVELGVBQWUsQ0FBQyxlQUFELENBQWYsQ0FBaUMsQ0FBakMsQ0FGUjtBQUdMRSxzQkFBQUEsR0FBRyxFQUFFRixlQUFlLENBQUMsT0FBRCxDQUFmLENBQXlCLENBQXpCLENBSEE7QUFJTHhOLHNCQUFBQSxJQUFJLEVBQUUsSUFBSUUsSUFBSixDQUFTc04sZUFBZSxDQUFDLFFBQUQsQ0FBZixDQUEwQixDQUExQixDQUFULENBSkQ7QUFLTEcsc0JBQUFBLEdBQUcsRUFBRUgsZUFBZSxDQUFDLE9BQUQsQ0FBZixDQUF5QixDQUF6QixDQUxBO0FBTUxJLHNCQUFBQSxJQUFJLEVBQUVKLGVBQWUsQ0FBQyxRQUFELENBQWYsQ0FBMEIsQ0FBMUIsQ0FORDtBQU9MSyxzQkFBQUEsU0FBUyxFQUFFTCxlQUFlLENBQUMsYUFBRCxDQUFmLENBQStCLENBQS9CLENBUE47QUFRTGxLLHNCQUFBQSxJQUFJLEVBQUVnSyxtQkFBVUMsVUFSWDtBQVNMTyxzQkFBQUEsUUFBUSxFQUFFTixlQUFlLENBQUMsWUFBRCxDQUFmLENBQThCLENBQTlCO0FBVEwscUJBQVA7QUFXRDs7QUFDRCxxQkFBS0YsbUJBQVVTLE9BQWY7QUFBd0I7QUFDdEIsMkJBQU87QUFDTC9HLHNCQUFBQSxLQUFLLEVBQUVxRyxLQUFLLENBQUMsU0FBRCxDQUFMLENBQWlCLENBQWpCLENBREY7QUFFTC9KLHNCQUFBQSxJQUFJLEVBQUVnSyxtQkFBVVMsT0FGWDtBQUdMRixzQkFBQUEsU0FBUyxFQUFFUixLQUFLLENBQUMsYUFBRCxDQUFMLENBQXFCLENBQXJCLENBSE47QUFJTHJOLHNCQUFBQSxJQUFJLEVBQUUsSUFBSUUsSUFBSixDQUFTbU4sS0FBSyxDQUFDLFFBQUQsQ0FBTCxDQUFnQixDQUFoQixDQUFUO0FBSkQscUJBQVA7QUFNRDs7QUFDRCxxQkFBS0MsbUJBQVVVLE9BQWY7QUFBd0I7QUFDdEIsMEJBQU1DLFlBQVksR0FBR1osS0FBckI7QUFDQSwyQkFBTztBQUNMckcsc0JBQUFBLEtBQUssRUFBRWlILFlBQVksQ0FBQyxTQUFELENBQVosQ0FBd0IsQ0FBeEIsQ0FERjtBQUVMUCxzQkFBQUEsR0FBRyxFQUFFTyxZQUFZLENBQUMsT0FBRCxDQUFaLEdBQXdCQSxZQUFZLENBQUMsT0FBRCxDQUFwQyxHQUFnREMsU0FGaEQ7QUFHTGxPLHNCQUFBQSxJQUFJLEVBQUUsSUFBSUUsSUFBSixDQUFTK04sWUFBWSxDQUFDLFFBQUQsQ0FBWixDQUF1QixDQUF2QixDQUFULENBSEQ7QUFJTDNMLHNCQUFBQSxXQUFXLEVBQUUyTCxZQUFZLENBQUMsa0JBQUQsQ0FBWixHQUFtQ0EsWUFBWSxDQUFDLGtCQUFELENBQVosQ0FBaUMsQ0FBakMsQ0FBbkMsR0FBeUVDLFNBSmpGO0FBS0xQLHNCQUFBQSxHQUFHLEVBQUVNLFlBQVksQ0FBQyxPQUFELENBQVosR0FBd0JBLFlBQVksQ0FBQyxPQUFELENBQVosQ0FBc0IsQ0FBdEIsQ0FBeEIsR0FBbURDLFNBTG5EO0FBTUxOLHNCQUFBQSxJQUFJLEVBQUVLLFlBQVksQ0FBQyxRQUFELENBQVosR0FBeUJBLFlBQVksQ0FBQyxRQUFELENBQVosQ0FBdUIsQ0FBdkIsQ0FBekIsR0FBcURDLFNBTnREO0FBT0xMLHNCQUFBQSxTQUFTLEVBQUVJLFlBQVksQ0FBQyxhQUFELENBQVosQ0FBNEIsQ0FBNUIsQ0FQTjtBQVFMM0ssc0JBQUFBLElBQUksRUFBRWdLLG1CQUFVVSxPQVJYO0FBU0xGLHNCQUFBQSxRQUFRLEVBQUVHLFlBQVksQ0FBQyxZQUFELENBQVosR0FBNkJBLFlBQVksQ0FBQyxZQUFELENBQVosQ0FBMkIsQ0FBM0IsQ0FBN0IsR0FBNkRDLFNBVGxFO0FBVUxULHNCQUFBQSxXQUFXLEVBQUVRLFlBQVksQ0FBQyxlQUFELENBQVosR0FBZ0NBLFlBQVksQ0FBQyxlQUFELENBQVosQ0FBOEIsQ0FBOUIsQ0FBaEMsR0FBbUVDO0FBVjNFLHFCQUFQO0FBWUQ7QUFyQ0g7QUF1Q0QsYUF6RDJEOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFhaEUsZ0JBQUlDLElBQWMsR0FBRyxFQUNuQixHQUFHdkIsSUFEZ0I7QUFDVjtBQUNUQyxjQUFBQSxNQUFNLEVBQUUsQ0FDTixJQUFJRSxJQUFJLENBQUNGLE1BQUwsR0FBY0UsSUFBSSxDQUFDRixNQUFuQixHQUE0QixFQUFoQyxDQURNLEVBRU4sT0FGTTtBQUZXLGFBQXJCO0FBZ0RBLG1CQUFPc0IsSUFBUDtBQUNELFdBOURjLEVBOERaLEVBOURZLENBQWY7QUFnRUF2UCxVQUFBQSxHQUFHLENBQUMsRUFBRSxHQUFHaU8sTUFBTDtBQUFhQSxZQUFBQSxNQUFNLEVBQUV1QixnQkFBRUMsTUFBRixDQUFTeEIsTUFBTSxDQUFDQSxNQUFoQixFQUF5QjlELElBQUQ7QUFBQSxxQkFBVUEsSUFBSSxDQUFDL0IsS0FBZjtBQUFBLGFBQXhCO0FBQXJCLFdBQUQsQ0FBSCxDQTVFRSxDQTZFRjtBQUNELFNBOUVELENBOEVFLE9BQU92RixDQUFQLEVBQVU7QUFDVjVDLFVBQUFBLEdBQUcsQ0FBQzRDLENBQUQsQ0FBSDtBQUNEO0FBQ0YsT0FsRk0sQ0FBUDtBQW1GRDs7QUFwZ0I2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XHJcbmltcG9ydCB7IEFkZGl0aW9uYWxJbmZvLCBBZGRpdGlvbmFsSW5mb0l0ZW0sIENsYXNzU2NoZWR1bGVJbmZvLCBTdHVkZW50SW5mbyB9IGZyb20gJy4vQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBTdHVkZW50SW5mb1hNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU3R1ZGVudEluZm8nO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuLi9NZXNzYWdlL01lc3NhZ2UnO1xyXG5pbXBvcnQgeyBNZXNzYWdlWE1MT2JqZWN0IH0gZnJvbSAnLi4vTWVzc2FnZS9NZXNzYWdlLnhtbCc7XHJcbmltcG9ydCB7IEFzc2lnbm1lbnRFdmVudFhNTE9iamVjdCwgQ2FsZW5kYXJYTUxPYmplY3QsIFJlZ3VsYXJFdmVudFhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvQ2FsZW5kYXInO1xyXG5pbXBvcnQgeyBBc3NpZ25tZW50RXZlbnQsIENhbGVuZGFyLCBDYWxlbmRhck9wdGlvbnMsIEV2ZW50LCBIb2xpZGF5RXZlbnQsIFJlZ3VsYXJFdmVudCB9IGZyb20gJy4vSW50ZXJmYWNlcy9DYWxlbmRhcic7XHJcbmltcG9ydCB7IGVhY2hNb250aE9mSW50ZXJ2YWwsIGlzQWZ0ZXIsIGlzQmVmb3JlLCBpc1RoaXNNb250aCB9IGZyb20gJ2RhdGUtZm5zJztcclxuaW1wb3J0IHsgRmlsZVJlc291cmNlWE1MT2JqZWN0LCBHcmFkZWJvb2tYTUxPYmplY3QsIFVSTFJlc291cmNlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9HcmFkZWJvb2snO1xyXG5pbXBvcnQgeyBBdHRlbmRhbmNlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9BdHRlbmRhbmNlJztcclxuaW1wb3J0IEV2ZW50VHlwZSBmcm9tICcuLi8uLi9Db25zdGFudHMvRXZlbnRUeXBlJztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgQXNzaWdubWVudCwgRmlsZVJlc291cmNlLCBHcmFkZWJvb2ssIE1hcmssIFVSTFJlc291cmNlLCBXZWlnaHRlZENhdGVnb3J5IH0gZnJvbSAnLi9JbnRlcmZhY2VzL0dyYWRlYm9vayc7XHJcbmltcG9ydCBhc3luY1Bvb2wgZnJvbSAndGlueS1hc3luYy1wb29sJztcclxuaW1wb3J0IFJlc291cmNlVHlwZSBmcm9tICcuLi8uLi9Db25zdGFudHMvUmVzb3VyY2VUeXBlJztcclxuaW1wb3J0IHsgQWJzZW50UGVyaW9kLCBBdHRlbmRhbmNlLCBQZXJpb2RJbmZvIH0gZnJvbSAnLi9JbnRlcmZhY2VzL0F0dGVuZGFuY2UnO1xyXG5pbXBvcnQgeyBTY2hlZHVsZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU2NoZWR1bGUnO1xyXG5pbXBvcnQgeyBTY2hlZHVsZSB9IGZyb20gJy4vQ2xpZW50LmludGVyZmFjZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IGV4dGVuZHMgc29hcC5DbGllbnQge1xyXG4gIHByaXZhdGUgaG9zdFVybDogc3RyaW5nO1xyXG4gIGNvbnN0cnVjdG9yKGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzLCBob3N0VXJsOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGNyZWRlbnRpYWxzKTtcclxuICAgIHRoaXMuaG9zdFVybCA9IGhvc3RVcmw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBzY2hlZHVsZSBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0ZXJtSW5kZXggVGhlIGluZGV4IG9mIHRoZSB0ZXJtLlxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFNjaGVkdWxlPn0gUmV0dXJucyB0aGUgc2NoZWR1bGUgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYGpzXHJcbiAgICogYXdhaXQgc2NoZWR1bGUoMCkgLy8gLT4geyB0ZXJtOiB7IGluZGV4OiAwLCBuYW1lOiAnMXN0IFF0ciBQcm9ncmVzcycgfSwgLi4uIH1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc2NoZWR1bGUodGVybUluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxTY2hlZHVsZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXMsIHJlaikgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHhtbE9iamVjdDogU2NoZWR1bGVYTUxPYmplY3QgPSBhd2FpdCBzdXBlci5wcm9jZXNzUmVxdWVzdCh7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudENsYXNzTGlzdCcsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwLCAuLi4odGVybUluZGV4ICE9IG51bGwgPyB7IFRlcm1JbmRleDogdGVybUluZGV4IH0gOiB7fSkgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVzKHtcclxuICAgICAgICAgIHRlcm06IHtcclxuICAgICAgICAgICAgaW5kZXg6IE51bWJlcih4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfVGVybUluZGV4J11bMF0pLFxyXG4gICAgICAgICAgICBuYW1lOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfVGVybUluZGV4TmFtZSddWzBdLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVycm9yOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfRXJyb3JNZXNzYWdlJ11bMF0sXHJcbiAgICAgICAgICB0b2RheTogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLlRvZGF5U2NoZWR1bGVJbmZvRGF0YVswXS5TY2hvb2xJbmZvc1swXS5TY2hvb2xJbmZvLm1hcCgoc2Nob29sKSA9PiAoe1xyXG4gICAgICAgICAgICBuYW1lOiBzY2hvb2xbJ0BfU2Nob29sTmFtZSddWzBdLFxyXG4gICAgICAgICAgICBiZWxsU2NoZWR1bGVOYW1lOiBzY2hvb2xbJ0BfQmVsbFNjaGVkTmFtZSddWzBdLFxyXG4gICAgICAgICAgICBjbGFzc2VzOiBzY2hvb2wuQ2xhc3Nlc1swXS5DbGFzc0luZm8ubWFwKFxyXG4gICAgICAgICAgICAgIChjb3Vyc2UpID0+XHJcbiAgICAgICAgICAgICAgICAoe1xyXG4gICAgICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihjb3Vyc2VbJ0BfUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICBhdHRlbmRhbmNlQ29kZTogY291cnNlLkF0dGVuZGFuY2VDb2RlWzBdLFxyXG4gICAgICAgICAgICAgICAgICBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGNvdXJzZVsnQF9TdGFydERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShjb3Vyc2VbJ0BfRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgbmFtZTogY291cnNlWydAX0NsYXNzTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBzZWN0aW9uR3U6IGNvdXJzZVsnQF9TZWN0aW9uR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgdGVhY2hlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBjb3Vyc2VbJ0BfVGVhY2hlckVtYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW1haWxTdWJqZWN0OiBjb3Vyc2VbJ0BfRW1haWxTdWJqZWN0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogY291cnNlWydAX1RlYWNoZXJOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhZmZHdTogY291cnNlWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IGNvdXJzZVsnQF9UZWFjaGVyVVJMJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9IGFzIENsYXNzU2NoZWR1bGVJbmZvKVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgY2xhc3NlczogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLkNsYXNzTGlzdHNbMF0uQ2xhc3NMaXN0aW5nLm1hcCgoc3R1ZGVudENsYXNzKSA9PiAoe1xyXG4gICAgICAgICAgICBuYW1lOiBzdHVkZW50Q2xhc3NbJ0BfQ291cnNlVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIoc3R1ZGVudENsYXNzWydAX1BlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgcm9vbTogc3R1ZGVudENsYXNzWydAX1Jvb21OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgIHNlY3Rpb25HdTogc3R1ZGVudENsYXNzWydAX1NlY3Rpb25HVSddWzBdLFxyXG4gICAgICAgICAgICB0ZWFjaGVyOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogc3R1ZGVudENsYXNzWydAX1RlYWNoZXInXVswXSxcclxuICAgICAgICAgICAgICBlbWFpbDogc3R1ZGVudENsYXNzWydAX1RlYWNoZXJFbWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgIHN0YWZmR3U6IHN0dWRlbnRDbGFzc1snQF9UZWFjaGVyU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgdGVybXM6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5UZXJtTGlzdHNbMF0uVGVybUxpc3RpbmcubWFwKCh0ZXJtKSA9PiAoe1xyXG4gICAgICAgICAgICBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHRlcm1bJ0BfQmVnaW5EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgIGVuZDogbmV3IERhdGUodGVybVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpbmRleDogTnVtYmVyKHRlcm1bJ0BfVGVybUluZGV4J11bMF0pLFxyXG4gICAgICAgICAgICBuYW1lOiB0ZXJtWydAX1Rlcm1OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgIHNjaG9vbFllYXJUZXJtQ29kZUd1OiB0ZXJtWydAX1NjaG9vbFllYXJUcm1Db2RlR1UnXVswXSxcclxuICAgICAgICAgIH0pKSxcclxuICAgICAgICB9KTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlaihlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBhdHRlbmRhbmNlIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQHJldHVybnMge1Byb21pc2U8QXR0ZW5kYW5jZT59IFJldHVybnMgYW4gQXR0ZW5kYW5jZSBvYmplY3RcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYGpzXHJcbiAgICogY2xpZW50LmF0dGVuZGFuY2UoKVxyXG4gICAqICAudGhlbihjb25zb2xlLmxvZyk7IC8vIC0+IHsgdHlwZTogJ1BlcmlvZCcsIHBlcmlvZDogey4uLn0sIHNjaG9vbE5hbWU6ICdVbml2ZXJzaXR5IEhpZ2ggU2Nob29sJywgYWJzZW5jZXM6IFsuLi5dLCBwZXJpb2RJbmZvczogWy4uLl0gfVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBhdHRlbmRhbmNlKCk6IFByb21pc2U8QXR0ZW5kYW5jZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXMsIHJlaikgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGF0dGVuZGFuY2VYTUxPYmplY3Q6IEF0dGVuZGFuY2VYTUxPYmplY3QgPSBhd2FpdCBzdXBlci5wcm9jZXNzUmVxdWVzdCh7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnQXR0ZW5kYW5jZScsXHJcbiAgICAgICAgICBwYXJhbVN0cjoge1xyXG4gICAgICAgICAgICBjaGlsZEludElkOiAwLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgeG1sT2JqZWN0ID0gYXR0ZW5kYW5jZVhNTE9iamVjdC5BdHRlbmRhbmNlWzBdO1xyXG5cclxuICAgICAgICByZXMoe1xyXG4gICAgICAgICAgdHlwZTogeG1sT2JqZWN0WydAX1R5cGUnXVswXSxcclxuICAgICAgICAgIHBlcmlvZDoge1xyXG4gICAgICAgICAgICB0b3RhbDogTnVtYmVyKHhtbE9iamVjdFsnQF9QZXJpb2RDb3VudCddWzBdKSxcclxuICAgICAgICAgICAgc3RhcnQ6IE51bWJlcih4bWxPYmplY3RbJ0BfU3RhcnRQZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgIGVuZDogTnVtYmVyKHhtbE9iamVjdFsnQF9FbmRQZXJpb2QnXVswXSksXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2Nob29sTmFtZTogeG1sT2JqZWN0WydAX1NjaG9vbE5hbWUnXVswXSxcclxuICAgICAgICAgIGFic2VuY2VzOiB4bWxPYmplY3QuQWJzZW5jZXNbMF0uQWJzZW5jZS5tYXAoKGFic2VuY2UpID0+ICh7XHJcbiAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGFic2VuY2VbJ0BfQWJzZW5jZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgIHJlYXNvbjogYWJzZW5jZVsnQF9SZWFzb24nXVswXSxcclxuICAgICAgICAgICAgbm90ZTogYWJzZW5jZVsnQF9Ob3RlJ11bMF0sXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBhYnNlbmNlWydAX0NvZGVBbGxEYXlEZXNjcmlwdGlvbiddWzBdLFxyXG4gICAgICAgICAgICBwZXJpb2RzOiBhYnNlbmNlLlBlcmlvZHNbMF0uUGVyaW9kLm1hcChcclxuICAgICAgICAgICAgICAocGVyaW9kKSA9PlxyXG4gICAgICAgICAgICAgICAgKHtcclxuICAgICAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIocGVyaW9kWydAX051bWJlciddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgbmFtZTogcGVyaW9kWydAX05hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgcmVhc29uOiBwZXJpb2RbJ0BfUmVhc29uJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIGNvdXJzZTogcGVyaW9kWydAX0NvdXJzZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBzdGFmZjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9TdGFmZiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IHBlcmlvZFsnQF9TdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IHBlcmlvZFsnQF9TdGFmZkVNYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIG9yZ1llYXJHdTogcGVyaW9kWydAX09yZ1llYXJHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgfSBhcyBBYnNlbnRQZXJpb2QpXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICB9KSksXHJcbiAgICAgICAgICBwZXJpb2RJbmZvczogeG1sT2JqZWN0LlRvdGFsQWN0aXZpdGllc1swXS5QZXJpb2RUb3RhbC5tYXAoKHBkLCBpKSA9PiAoe1xyXG4gICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihwZFsnQF9OdW1iZXInXVswXSksXHJcbiAgICAgICAgICAgIHRvdGFsOiB7XHJcbiAgICAgICAgICAgICAgZXhjdXNlZDogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbEV4Y3VzZWRbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgdGFyZGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbFRhcmRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgdW5leGN1c2VkOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVW5leGN1c2VkWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgIGFjdGl2aXRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxBY3Rpdml0aWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHVuZXhjdXNlZFRhcmRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxVbmV4Y3VzZWRUYXJkaWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSkpIGFzIFBlcmlvZEluZm9bXSxcclxuICAgICAgICB9IGFzIEF0dGVuZGFuY2UpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqKGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGdyYWRlYm9vayBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByZXBvcnRpbmdQZXJpb2RJbmRleCBUaGUgdGltZWZyYW1lIHRoYXQgdGhlIGdyYWRlYm9vayBzaG91bGQgcmV0dXJuXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8R3JhZGVib29rPn0gUmV0dXJucyBhIEdyYWRlYm9vayBvYmplY3RcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgZ3JhZGVib29rID0gYXdhaXQgY2xpZW50LmdyYWRlYm9vaygpO1xyXG4gICAqIGNvbnNvbGUubG9nKGdyYWRlYm9vayk7IC8vIHsgZXJyb3I6ICcnLCB0eXBlOiAnVHJhZGl0aW9uYWwnLCByZXBvcnRpbmdQZXJpb2Q6IHsuLi59LCBjb3Vyc2VzOiBbLi4uXSB9O1xyXG4gICAqXHJcbiAgICogYXdhaXQgY2xpZW50LmdyYWRlYm9vaygwKSAvLyBTb21lIHNjaG9vbHMgd2lsbCBoYXZlIFJlcG9ydGluZ1BlcmlvZEluZGV4IDAgYXMgXCIxc3QgUXVhcnRlciBQcm9ncmVzc1wiXHJcbiAgICogYXdhaXQgY2xpZW50LmdyYWRlYm9vayg3KSAvLyBTb21lIHNjaG9vbHMgd2lsbCBoYXZlIFJlcG9ydGluZ1BlcmlvZEluZGV4IDcgYXMgXCI0dGggUXVhcnRlclwiXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGdyYWRlYm9vayhyZXBvcnRpbmdQZXJpb2RJbmRleD86IG51bWJlcik6IFByb21pc2U8R3JhZGVib29rPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeG1sT2JqZWN0OiBHcmFkZWJvb2tYTUxPYmplY3QgPSBhd2FpdCBzdXBlci5wcm9jZXNzUmVxdWVzdCh7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnR3JhZGVib29rJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIC4uLihyZXBvcnRpbmdQZXJpb2RJbmRleCA/IHsgUmVwb3J0aW5nUGVyaW9kOiByZXBvcnRpbmdQZXJpb2RJbmRleCB9IDoge30pIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVzKHtcclxuICAgICAgICAgIGVycm9yOiB4bWxPYmplY3QuR3JhZGVib29rWzBdWydAX0Vycm9yTWVzc2FnZSddWzBdLFxyXG4gICAgICAgICAgdHlwZTogeG1sT2JqZWN0LkdyYWRlYm9va1swXVsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICByZXBvcnRpbmdQZXJpb2Q6IHtcclxuICAgICAgICAgICAgY3VycmVudDoge1xyXG4gICAgICAgICAgICAgIGluZGV4OlxyXG4gICAgICAgICAgICAgICAgcmVwb3J0aW5nUGVyaW9kSW5kZXggPz9cclxuICAgICAgICAgICAgICAgIE51bWJlcihcclxuICAgICAgICAgICAgICAgICAgeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RzWzBdLlJlcG9ydFBlcmlvZC5maW5kKFxyXG4gICAgICAgICAgICAgICAgICAgICh4KSA9PiB4WydAX0dyYWRlUGVyaW9kJ11bMF0gPT09IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0dyYWRlUGVyaW9kJ11bMF1cclxuICAgICAgICAgICAgICAgICAgKT8uWydAX0luZGV4J11bMF1cclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX1N0YXJ0RGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0dyYWRlUGVyaW9kJ11bMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGF2YWlsYWJsZTogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RzWzBdLlJlcG9ydFBlcmlvZC5tYXAoKHBlcmlvZCkgPT4gKHtcclxuICAgICAgICAgICAgICBkYXRlOiB7IHN0YXJ0OiBuZXcgRGF0ZShwZXJpb2RbJ0BfU3RhcnREYXRlJ11bMF0pLCBlbmQ6IG5ldyBEYXRlKHBlcmlvZFsnQF9FbmREYXRlJ11bMF0pIH0sXHJcbiAgICAgICAgICAgICAgbmFtZTogcGVyaW9kWydAX0dyYWRlUGVyaW9kJ11bMF0sXHJcbiAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcihwZXJpb2RbJ0BfSW5kZXgnXVswXSksXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjb3Vyc2VzOiB4bWxPYmplY3QuR3JhZGVib29rWzBdLkNvdXJzZXNbMF0uQ291cnNlLm1hcCgoY291cnNlKSA9PiAoe1xyXG4gICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihjb3Vyc2VbJ0BfUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICB0aXRsZTogY291cnNlWydAX1RpdGxlJ11bMF0sXHJcbiAgICAgICAgICAgIHJvb206IGNvdXJzZVsnQF9Sb29tJ11bMF0sXHJcbiAgICAgICAgICAgIHN0YWZmOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogY291cnNlWydAX1N0YWZmJ11bMF0sXHJcbiAgICAgICAgICAgICAgZW1haWw6IGNvdXJzZVsnQF9TdGFmZkVNYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgc3RhZmZHdTogY291cnNlWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWFya3M6IGNvdXJzZS5NYXJrc1swXS5NYXJrLm1hcCgobWFyaykgPT4gKHtcclxuICAgICAgICAgICAgICBuYW1lOiBtYXJrWydAX01hcmtOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgY2FsY3VsYXRlZFNjb3JlOiB7XHJcbiAgICAgICAgICAgICAgICBzdHJpbmc6IG1hcmtbJ0BfQ2FsY3VsYXRlZFNjb3JlU3RyaW5nJ11bMF0sXHJcbiAgICAgICAgICAgICAgICByYXc6IE51bWJlcihtYXJrWydAX0NhbGN1bGF0ZWRTY29yZVJhdyddWzBdKSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHdlaWdodGVkQ2F0ZWdvcmllczpcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBtYXJrWydHcmFkZUNhbGN1bGF0aW9uU3VtbWFyeSddWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgICA/IG1hcmtbJ0dyYWRlQ2FsY3VsYXRpb25TdW1tYXJ5J11bMF0uQXNzaWdubWVudEdyYWRlQ2FsYy5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAod2VpZ2h0ZWQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogd2VpZ2h0ZWRbJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRNYXJrOiB3ZWlnaHRlZFsnQF9DYWxjdWxhdGVkTWFyayddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZhbHVhdGVkOiB3ZWlnaHRlZFsnQF9XZWlnaHRlZFBjdCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmQ6IHdlaWdodGVkWydAX1dlaWdodCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBOdW1iZXIod2VpZ2h0ZWRbJ0BfUG9pbnRzJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zc2libGU6IE51bWJlcih3ZWlnaHRlZFsnQF9Qb2ludHNQb3NzaWJsZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFdlaWdodGVkQ2F0ZWdvcnkpXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICA6IFtdLFxyXG4gICAgICAgICAgICAgIGFzc2lnbm1lbnRzOiBtYXJrLkFzc2lnbm1lbnRzWzBdLkFzc2lnbm1lbnQubWFwKChhc3NpZ25tZW50KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgZ3JhZGVib29rSWQ6IGFzc2lnbm1lbnRbJ0BfR3JhZGVib29rSUQnXVswXSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IGFzc2lnbm1lbnRbJ0BfTWVhc3VyZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogYXNzaWdubWVudFsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgIGR1ZTogbmV3IERhdGUoYXNzaWdubWVudFsnQF9EdWVEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNjb3JlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6IGFzc2lnbm1lbnRbJ0BfU2NvcmVUeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiBhc3NpZ25tZW50WydAX1Njb3JlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcG9pbnRzOiBhc3NpZ25tZW50WydAX1BvaW50cyddWzBdLFxyXG4gICAgICAgICAgICAgICAgbm90ZXM6IGFzc2lnbm1lbnRbJ0BfTm90ZXMnXVswXSxcclxuICAgICAgICAgICAgICAgIHRlYWNoZXJJZDogYXNzaWdubWVudFsnQF9UZWFjaGVySUQnXVswXSxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBhc3NpZ25tZW50WydAX01lYXN1cmVEZXNjcmlwdGlvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgaGFzRHJvcGJveDogSlNPTi5wYXJzZShhc3NpZ25tZW50WydAX0hhc0Ryb3BCb3gnXVswXSksXHJcbiAgICAgICAgICAgICAgICBzdHVkZW50SWQ6IGFzc2lnbm1lbnRbJ0BfU3R1ZGVudElEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBkcm9wYm94RGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9Ecm9wU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRHJvcEVuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzOlxyXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgYXNzaWdubWVudC5SZXNvdXJjZXNbMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgPyAoYXNzaWdubWVudC5SZXNvdXJjZXNbMF0uUmVzb3VyY2UubWFwKChyc3JjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocnNyY1snQF9UeXBlJ11bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdGaWxlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVSc3JjID0gcnNyYyBhcyBGaWxlUmVzb3VyY2VYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBSZXNvdXJjZVR5cGUuRklMRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpbGVSc3JjWydAX0ZpbGVUeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZVJzcmNbJ0BfRmlsZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmk6IHRoaXMuaG9zdFVybCArIGZpbGVSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZmlsZVJzcmNbJ0BfUmVzb3VyY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBmaWxlUnNyY1snQF9SZXNvdXJjZUlEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZVJzcmNbJ0BfUmVzb3VyY2VOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIEZpbGVSZXNvdXJjZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdVUkwnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsUnNyYyA9IHJzcmMgYXMgVVJMUmVzb3VyY2VYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybFJzcmNbJ0BfVVJMJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFJlc291cmNlVHlwZS5VUkwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUodXJsUnNyY1snQF9SZXNvdXJjZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHVybFJzcmNbJ0BfUmVzb3VyY2VJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHVybFJzcmNbJ0BfUmVzb3VyY2VOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVybFJzcmNbJ0BfUmVzb3VyY2VEZXNjcmlwdGlvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiB1cmxSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFVSTFJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWooYFR5cGUgJHtyc3JjWydAX1R5cGUnXVswXX0gZG9lcyBub3QgZXhpc3QgYXMgYSB0eXBlLiBBZGQgaXQgdG8gdHlwZSBkZWNsYXJhdGlvbnMuYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH0pIGFzIChGaWxlUmVzb3VyY2UgfCBVUkxSZXNvdXJjZSlbXSlcclxuICAgICAgICAgICAgICAgICAgICA6IFtdLFxyXG4gICAgICAgICAgICAgIH0pKSBhcyBBc3NpZ25tZW50W10sXHJcbiAgICAgICAgICAgIH0pKSBhcyBNYXJrW10sXHJcbiAgICAgICAgICB9KSksXHJcbiAgICAgICAgfSBhcyBHcmFkZWJvb2spO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqKGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhIGxpc3Qgb2YgbWVzc2FnZXMgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxNZXNzYWdlW10+fSBSZXR1cm5zIGFuIGFycmF5IG9mIG1lc3NhZ2VzIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBgYGBqc1xyXG4gICAqIGF3YWl0IGNsaWVudC5tZXNzYWdlcygpOyAvLyAtPiBbeyBpZDogJ0U5NzJGMUJDLTk5QTAtNENEMC04RDE1LUIxODk2OEI0M0UwOCcsIHR5cGU6ICdTdHVkZW50QWN0aXZpdHknLCAuLi4gfSwgeyBpZDogJzg2RkRBMTFELTQyQzctNDI0OS1CMDAzLTk0QjE1RUIyQzhENCcsIHR5cGU6ICdTdHVkZW50QWN0aXZpdHknLCAuLi4gfV1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgbWVzc2FnZXMoKTogUHJvbWlzZTxNZXNzYWdlW10+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB4bWxPYmplY3Q6IE1lc3NhZ2VYTUxPYmplY3QgPSBhd2FpdCBzdXBlci5wcm9jZXNzUmVxdWVzdCh7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnR2V0UFhQTWVzc2FnZXMnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJlcyhcclxuICAgICAgICAgIHhtbE9iamVjdC5QWFBNZXNzYWdlc0RhdGFbMF0uTWVzc2FnZUxpc3RpbmdzWzBdLk1lc3NhZ2VMaXN0aW5nLm1hcChcclxuICAgICAgICAgICAgKG1lc3NhZ2UpID0+IG5ldyBNZXNzYWdlKG1lc3NhZ2UsIHN1cGVyLmNyZWRlbnRpYWxzLCB0aGlzLmhvc3RVcmwpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlaihlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBpbmZvIG9mIGEgc3R1ZGVudFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN0dWRlbnRJbmZvPn0gU3R1ZGVudEluZm8gb2JqZWN0XHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBgYGBqc1xyXG4gICAqIHN0dWRlbnRJbmZvKCkudGhlbihjb25zb2xlLmxvZykgLy8gLT4geyBzdHVkZW50OiB7IG5hbWU6ICdFdmFuIERhdmlzJywgbmlja25hbWU6ICcnLCBsYXN0TmFtZTogJ0RhdmlzJyB9LCAuLi59XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIHN0dWRlbnRJbmZvKCk6IFByb21pc2U8U3R1ZGVudEluZm8+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxTdHVkZW50SW5mbz4oYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeG1sT2JqZWN0RGF0YTogU3R1ZGVudEluZm9YTUxPYmplY3QgPSBhd2FpdCBzdXBlci5wcm9jZXNzUmVxdWVzdCh7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudEluZm8nLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXMoe1xyXG4gICAgICAgICAgc3R1ZGVudDoge1xyXG4gICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkZvcm1hdHRlZE5hbWVbMF0sXHJcbiAgICAgICAgICAgIGxhc3ROYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uTGFzdE5hbWVHb2VzQnlbMF0sXHJcbiAgICAgICAgICAgIG5pY2tuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uTmlja05hbWVbMF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYmlydGhEYXRlOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQmlydGhEYXRlWzBdLFxyXG4gICAgICAgICAgdHJhY2s6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5UcmFja1swXSxcclxuICAgICAgICAgIGFkZHJlc3M6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5iclswXSxcclxuICAgICAgICAgIGNvdW5zZWxvcjoge1xyXG4gICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ291bnNlbG9yTmFtZVswXSxcclxuICAgICAgICAgICAgZW1haWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Db3Vuc2Vsb3JFbWFpbFswXSxcclxuICAgICAgICAgICAgc3RhZmZHdTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvclN0YWZmR1VbMF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY3VycmVudFNjaG9vbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkN1cnJlbnRTY2hvb2xbMF0sXHJcbiAgICAgICAgICBkZW50aXN0OiB7XHJcbiAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5EZW50aXN0WzBdWydAX05hbWUnXVswXSxcclxuICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5EZW50aXN0WzBdWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgIGV4dG46IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5EZW50aXN0WzBdWydAX0V4dG4nXVswXSxcclxuICAgICAgICAgICAgb2ZmaWNlOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uRGVudGlzdFswXVsnQF9PZmZpY2UnXVswXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBwaHlzaWNpYW46IHtcclxuICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgIHBob25lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGh5c2ljaWFuWzBdWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgIGV4dG46IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5bMF1bJ0BfRXh0biddWzBdLFxyXG4gICAgICAgICAgICBob3NwaXRhbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9Ib3NwaXRhbCddWzBdLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVtYWlsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uRU1haWxbMF0sXHJcbiAgICAgICAgICBlbWVyZ2VuY3lDb250YWN0czogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkVtZXJnZW5jeUNvbnRhY3RzWzBdLkVtZXJnZW5jeUNvbnRhY3QubWFwKFxyXG4gICAgICAgICAgICAoY29udGFjdCkgPT4gKHtcclxuICAgICAgICAgICAgICBuYW1lOiBjb250YWN0WydAX05hbWUnXVswXSxcclxuICAgICAgICAgICAgICBwaG9uZToge1xyXG4gICAgICAgICAgICAgICAgaG9tZTogY29udGFjdFsnQF9Ib21lUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgIG1vYmlsZTogY29udGFjdFsnQF9Nb2JpbGVQaG9uZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgb3RoZXI6IGNvbnRhY3RbJ0BfT3RoZXJQaG9uZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgd29yazogY29udGFjdFsnQF9Xb3JrUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHJlbGF0aW9uc2hpcDogY29udGFjdFsnQF9SZWxhdGlvbnNoaXAnXVswXSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICksXHJcbiAgICAgICAgICBnZW5kZXI6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uR2VuZGVyWzBdLFxyXG4gICAgICAgICAgZ3JhZGU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uR3JhZGVbMF0sXHJcbiAgICAgICAgICBsb2NrZXJJbmZvUmVjb3JkczogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Mb2NrZXJJbmZvUmVjb3Jkc1swXSxcclxuICAgICAgICAgIGhvbWVMYW5ndWFnZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVMYW5ndWFnZVswXSxcclxuICAgICAgICAgIGhvbWVSb29tOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZVJvb21bMF0sXHJcbiAgICAgICAgICBob21lUm9vbVRlYWNoZXI6IHtcclxuICAgICAgICAgICAgZW1haWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lUm9vbVRjaEVNYWlsWzBdLFxyXG4gICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZVJvb21UY2hbMF0sXHJcbiAgICAgICAgICAgIHN0YWZmR3U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lUm9vbVRjaFN0YWZmR1VbMF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWRkaXRpb25hbEluZm86IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94ZXNbMF0uVXNlckRlZmluZWRHcm91cEJveC5tYXAoXHJcbiAgICAgICAgICAgIChkZWZpbmVkQm94KSA9PiAoe1xyXG4gICAgICAgICAgICAgIGlkOiBkZWZpbmVkQm94WydAX0dyb3VwQm94SUQnXVswXSxcclxuICAgICAgICAgICAgICB0eXBlOiBkZWZpbmVkQm94WydAX0dyb3VwQm94TGFiZWwnXVswXSxcclxuICAgICAgICAgICAgICB2Y0lkOiBkZWZpbmVkQm94WydAX1ZDSUQnXVswXSxcclxuICAgICAgICAgICAgICBpdGVtczogZGVmaW5lZEJveC5Vc2VyRGVmaW5lZEl0ZW1zWzBdLlVzZXJEZWZpbmVkSXRlbS5tYXAoKGl0ZW0pID0+ICh7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgICAgZWxlbWVudDogaXRlbVsnQF9Tb3VyY2VFbGVtZW50J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIG9iamVjdDogaXRlbVsnQF9Tb3VyY2VPYmplY3QnXVswXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2Y0lkOiBpdGVtWydAX1ZDSUQnXVswXSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBpdGVtWydAX1ZhbHVlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBpdGVtWydAX0l0ZW1UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgfSkpIGFzIEFkZGl0aW9uYWxJbmZvSXRlbVtdLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKSBhcyBBZGRpdGlvbmFsSW5mb1tdLFxyXG4gICAgICAgIH0gYXMgU3R1ZGVudEluZm8pO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqKGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlOiBEYXRlKSB7XHJcbiAgICByZXR1cm4gc3VwZXIucHJvY2Vzc1JlcXVlc3Q8Q2FsZW5kYXJYTUxPYmplY3Q+KHtcclxuICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRDYWxlbmRhcicsXHJcbiAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIFJlcXVlc3REYXRlOiBkYXRlLnRvSVNPU3RyaW5nKCkgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0NhbGVuZGFyT3B0aW9uc30gb3B0aW9ucyBPcHRpb25zIHRvIHByb3ZpZGUgZm9yIGNhbGVuZGFyIG1ldGhvZC4gQW4gaW50ZXJ2YWwgaXMgcmVxdWlyZWQuXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8Q2FsZW5kYXI+fSBSZXR1cm5zIGEgQ2FsZW5kYXIgb2JqZWN0XHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBgYGBqc1xyXG4gICAqIGNsaWVudC5jYWxlbmRhcih7IGludGVydmFsOiB7IHN0YXJ0OiBuZXcgRGF0ZSgnNS8xLzIwMjInKSwgZW5kOiBuZXcgRGF0ZSgnOC8xLzIwMjEnKSB9LCBjb25jdXJyZW5jeTogbnVsbCB9KTsgLy8gLT4gTGltaXRsZXNzIGNvbmN1cnJlbmN5IChub3QgcmVjb21tZW5kZWQpXHJcbiAgICpcclxuICAgKiBjb25zdCBjYWxlbmRhciA9IGF3YWl0IGNsaWVudC5jYWxlbmRhcih7IGludGVydmFsOiB7IC4uLiB9fSk7XHJcbiAgICogY29uc29sZS5sb2coY2FsZW5kYXIpOyAvLyAtPiB7IHNjaG9vbERhdGU6IHsuLi59LCBvdXRwdXRSYW5nZTogey4uLn0sIGV2ZW50czogWy4uLl0gfVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBjYWxlbmRhcihvcHRpb25zOiBDYWxlbmRhck9wdGlvbnMpOiBQcm9taXNlPENhbGVuZGFyPiB7XHJcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogQ2FsZW5kYXJPcHRpb25zID0ge1xyXG4gICAgICBjb25jdXJyZW5jeTogNyxcclxuICAgICAgLi4ub3B0aW9ucyxcclxuICAgIH07XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHNjaG9vbFN0YXJ0RGF0ZTogRGF0ZSB8IG51bWJlciA9IG9wdGlvbnMuaW50ZXJ2YWwuc3RhcnQ7XHJcbiAgICAgICAgbGV0IHNjaG9vbEVuZERhdGU6IERhdGUgfCBudW1iZXIgPSBvcHRpb25zLmludGVydmFsLmVuZDtcclxuXHJcbiAgICAgICAgY29uc3QgbW9udGhzV2l0aGluU2Nob29sWWVhciA9IGVhY2hNb250aE9mSW50ZXJ2YWwoeyBzdGFydDogc2Nob29sU3RhcnREYXRlLCBlbmQ6IHNjaG9vbEVuZERhdGUgfSk7XHJcbiAgICAgICAgY29uc3QgYWxsRXZlbnRzV2l0aGluU2Nob29sWWVhcjogQ2FsZW5kYXJYTUxPYmplY3RbXSA9XHJcbiAgICAgICAgICBkZWZhdWx0T3B0aW9ucy5jb25jdXJyZW5jeSA9PSBudWxsXHJcbiAgICAgICAgICAgID8gYXdhaXQgUHJvbWlzZS5hbGwobW9udGhzV2l0aGluU2Nob29sWWVhci5tYXAoKGRhdGUpID0+IHRoaXMuZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlKSkpXHJcbiAgICAgICAgICAgIDogYXdhaXQgYXN5bmNQb29sKGRlZmF1bHRPcHRpb25zLmNvbmN1cnJlbmN5LCBtb250aHNXaXRoaW5TY2hvb2xZZWFyLCAoZGF0ZSkgPT5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlKVxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgbGV0IG1lbW86IENhbGVuZGFyIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgY29uc3QgZXZlbnRzID0gYWxsRXZlbnRzV2l0aGluU2Nob29sWWVhci5yZWR1Y2UoKHByZXYsIGV2ZW50cykgPT4ge1xyXG4gICAgICAgICAgaWYgKG1lbW8gPT0gbnVsbClcclxuICAgICAgICAgICAgbWVtbyA9IHtcclxuICAgICAgICAgICAgICBzY2hvb2xEYXRlOiB7XHJcbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXVsnQF9TY2hvb2xCZWdEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEVuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBvdXRwdXRSYW5nZToge1xyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IHNjaG9vbFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICAgIGVuZDogc2Nob29sRW5kRGF0ZSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGV2ZW50czogW10sXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICBsZXQgcmVzdDogQ2FsZW5kYXIgPSB7XHJcbiAgICAgICAgICAgIC4uLm1lbW8sIC8vIFRoaXMgaXMgdG8gcHJldmVudCByZS1pbml0aWFsaXppbmcgRGF0ZSBvYmplY3RzIGluIG9yZGVyIHRvIGltcHJvdmUgcGVyZm9ybWFuY2VcclxuICAgICAgICAgICAgZXZlbnRzOiBbXHJcbiAgICAgICAgICAgICAgLi4uKHByZXYuZXZlbnRzID8gcHJldi5ldmVudHMgOiBbXSksXHJcbiAgICAgICAgICAgICAgLi4uKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF0uRXZlbnRMaXN0c1swXS5FdmVudExpc3QubWFwKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChldmVudFsnQF9EYXlUeXBlJ11bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuQVNTSUdOTUVOVDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzc2lnbm1lbnRFdmVudCA9IGV2ZW50IGFzIEFzc2lnbm1lbnRFdmVudFhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGFzc2lnbm1lbnRFdmVudFsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYWRkTGlua0RhdGE6IGFzc2lnbm1lbnRFdmVudFsnQF9BZGRMaW5rRGF0YSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYWd1OiBhc3NpZ25tZW50RXZlbnRbJ0BfQUdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShhc3NpZ25tZW50RXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgIGRndTogYXNzaWdubWVudEV2ZW50WydAX0RHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogYXNzaWdubWVudEV2ZW50WydAX0xpbmsnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogYXNzaWdubWVudEV2ZW50WydAX1N0YXJ0VGltZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLkFTU0lHTk1FTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgICB2aWV3VHlwZTogYXNzaWdubWVudEV2ZW50WydAX1ZpZXdUeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSBhcyBBc3NpZ25tZW50RXZlbnQ7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuSE9MSURBWToge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZXZlbnRbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEV2ZW50VHlwZS5IT0xJREFZLFxyXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBldmVudFsnQF9TdGFydFRpbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGV2ZW50WydAX0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgfSBhcyBIb2xpZGF5RXZlbnQ7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuUkVHVUxBUjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlZ3VsYXJFdmVudCA9IGV2ZW50IGFzIFJlZ3VsYXJFdmVudFhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHJlZ3VsYXJFdmVudFsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYWd1OiByZWd1bGFyRXZlbnRbJ0BfQUdVJ10gPyByZWd1bGFyRXZlbnRbJ0BfQUdVJ10gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShyZWd1bGFyRXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiByZWd1bGFyRXZlbnRbJ0BfRXZ0RGVzY3JpcHRpb24nXSA/IHJlZ3VsYXJFdmVudFsnQF9FdnREZXNjcmlwdGlvbiddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGd1OiByZWd1bGFyRXZlbnRbJ0BfREdVJ10gPyByZWd1bGFyRXZlbnRbJ0BfREdVJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiByZWd1bGFyRXZlbnRbJ0BfTGluayddID8gcmVndWxhckV2ZW50WydAX0xpbmsnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogcmVndWxhckV2ZW50WydAX1N0YXJ0VGltZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLlJFR1VMQVIsXHJcbiAgICAgICAgICAgICAgICAgICAgICB2aWV3VHlwZTogcmVndWxhckV2ZW50WydAX1ZpZXdUeXBlJ10gPyByZWd1bGFyRXZlbnRbJ0BfVmlld1R5cGUnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgIGFkZExpbmtEYXRhOiByZWd1bGFyRXZlbnRbJ0BfQWRkTGlua0RhdGEnXSA/IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgIH0gYXMgUmVndWxhckV2ZW50O1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSkgYXMgRXZlbnRbXSksXHJcbiAgICAgICAgICAgIF0gYXMgRXZlbnRbXSxcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHJlc3Q7XHJcbiAgICAgICAgfSwge30gYXMgQ2FsZW5kYXIpO1xyXG5cclxuICAgICAgICByZXMoeyAuLi5ldmVudHMsIGV2ZW50czogXy51bmlxQnkoZXZlbnRzLmV2ZW50cywgKGl0ZW0pID0+IGl0ZW0udGl0bGUpIH0gYXMgQ2FsZW5kYXIpO1xyXG4gICAgICAgIC8vIHJlcyhhbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlaihlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==