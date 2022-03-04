(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/soap/soap", "../Message/Message", "date-fns", "../../Constants/EventType", "lodash", "tiny-async-pool", "../../Constants/ResourceType", "../ReportCard/ReportCard", "../Document/Document"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/soap/soap"), require("../Message/Message"), require("date-fns"), require("../../Constants/EventType"), require("lodash"), require("tiny-async-pool"), require("../../Constants/ResourceType"), require("../ReportCard/ReportCard"), require("../Document/Document"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.soap, global.Message, global.dateFns, global.EventType, global.lodash, global.tinyAsyncPool, global.ResourceType, global.ReportCard, global.Document);
    global.Client = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _soap, _Message, _dateFns, _EventType, _lodash, _tinyAsyncPool, _ResourceType, _ReportCard, _Document) {
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
  _ReportCard = _interopRequireDefault(_ReportCard);
  _Document = _interopRequireDefault(_Document);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  class Client extends _soap.default.Client {
    constructor(credentials, hostUrl) {
      super(credentials);
      this.hostUrl = hostUrl;
    }
    /**
     * Gets the student's documents from synergy servers
     * @returns {Promise<Document[]}> Returns a list of student documents
     * @example
     * ```js
     * const documents = await client.documents();
     * const document = documents[0];
     * const files = await document.get();
     * const base64collection = files.map((file) => file.base64);
     * ```
     */


    documents() {
      return new Promise(async (res, rej) => {
        try {
          const xmlObject = await super.processRequest({
            methodName: 'GetStudentDocumentInitialData',
            paramStr: {
              childIntId: 0
            }
          });
          var _a = xmlObject['StudentDocuments'][0].StudentDocumentDatas[0].StudentDocumentData;

          var _f = xml => {
            return new _Document.default(xml, super.credentials);
          };

          var _r = [];

          for (var _i = 0; _i < _a.length; _i++) {
            _r.push(_f(_a[_i], _i, _a));
          }

          res(_r);
        } catch (e) {
          rej(e);
        }
      });
    }
    /**
     * Gets a list of report cards
     * @returns {Promise<ReportCard[]>} Returns a list of report cards that can fetch a file
     * @example
     * ```js
     * const reportCards = await client.reportCards();
     * const files = await Promise.all(reportCards.map((card) => card.get()));
     * const base64arr = files.map((file) => file.base64); // ["JVBERi0...", "dUIoa1...", ...];
     * ```
     */


    reportCards() {
      return new Promise(async (res, rej) => {
        try {
          const xmlObject = await super.processRequest({
            methodName: 'GetReportCardInitialData',
            paramStr: {
              childIntId: 0
            }
          });
          var _a2 = xmlObject.RCReportingPeriodData[0].RCReportingPeriods[0].RCReportingPeriod;

          var _f2 = xml => {
            return new _ReportCard.default(xml, super.credentials);
          };

          var _r2 = [];

          for (var _i2 = 0; _i2 < _a2.length; _i2++) {
            _r2.push(_f2(_a2[_i2], _i2, _a2));
          }

          res(_r2);
        } catch (e) {
          rej(e);
        }
      });
    }
    /**
     * Gets the student's school's information
     * @returns {Promise<SchoolInfo>} Returns the information of the student's school
     * @example
     * ```js
     * await client.schoolInfo();
     *
     * client.schoolInfo().then((schoolInfo) => {
     *  console.log(_.uniq(schoolInfo.staff.map((staff) => staff.name))); // List all staff positions using lodash
     * })
     * ```
     */


    schoolInfo() {
      return new Promise(async (res, rej) => {
        try {
          const {
            StudentSchoolInfoListing: [xmlObject]
          } = await super.processRequest({
            methodName: 'StudentSchoolInfo',
            paramStr: {
              childIntID: 0
            }
          });
          var _a3 = xmlObject.StaffLists[0].StaffList;

          var _f3 = staff => {
            return {
              name: staff['@_Name'][0],
              email: staff['@_EMail'][0],
              staffGu: staff['@_StaffGU'][0],
              jobTitle: staff['@_Title'][0],
              extn: staff['@_Extn'][0],
              phone: staff['@_Phone'][0]
            };
          };

          var _r3 = [];

          for (var _i3 = 0; _i3 < _a3.length; _i3++) {
            _r3.push(_f3(_a3[_i3], _i3, _a3));
          }

          res({
            school: {
              address: xmlObject['@_SchoolAddress'][0],
              addressAlt: xmlObject['@_SchoolAddress2'][0],
              city: xmlObject['@_SchoolCity'][0],
              zipCode: xmlObject['@_SchoolZip'][0],
              phone: xmlObject['@_Phone'][0],
              altPhone: xmlObject['@_Phone2'][0],
              principal: {
                name: xmlObject['@_Principal'][0],
                email: xmlObject['@_PrincipalEmail'][0],
                staffGu: xmlObject['@_PrincipalGu'][0]
              }
            },
            staff: _r3
          });
        } catch (e) {
          rej(e);
        }
      });
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
          var _a4 = xmlObject.StudentClassSchedule[0].TodayScheduleInfoData[0].SchoolInfos[0].SchoolInfo;

          var _f4 = school => {
            var _a7 = school.Classes[0].ClassInfo;

            var _f7 = course => {
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

            var _r7 = [];

            for (var _i7 = 0; _i7 < _a7.length; _i7++) {
              _r7.push(_f7(_a7[_i7], _i7, _a7));
            }

            return {
              name: school['@_SchoolName'][0],
              bellScheduleName: school['@_BellSchedName'][0],
              classes: _r7
            };
          };

          var _r4 = [];

          for (var _i4 = 0; _i4 < _a4.length; _i4++) {
            _r4.push(_f4(_a4[_i4], _i4, _a4));
          }

          var _a5 = xmlObject.StudentClassSchedule[0].ClassLists[0].ClassListing;

          var _f5 = studentClass => {
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

          var _r5 = [];

          for (var _i5 = 0; _i5 < _a5.length; _i5++) {
            _r5.push(_f5(_a5[_i5], _i5, _a5));
          }

          var _a6 = xmlObject.StudentClassSchedule[0].TermLists[0].TermListing;

          var _f6 = term => {
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

          var _r6 = [];

          for (var _i6 = 0; _i6 < _a6.length; _i6++) {
            _r6.push(_f6(_a6[_i6], _i6, _a6));
          }

          res({
            term: {
              index: Number(xmlObject.StudentClassSchedule[0]['@_TermIndex'][0]),
              name: xmlObject.StudentClassSchedule[0]['@_TermIndexName'][0]
            },
            error: xmlObject.StudentClassSchedule[0]['@_ErrorMessage'][0],
            today: _r4,
            classes: _r5,
            terms: _r6
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
          var _a8 = xmlObject.Absences[0].Absence;

          var _f8 = absence => {
            var _a10 = absence.Periods[0].Period;

            var _f10 = period => {
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

            var _r10 = [];

            for (var _i10 = 0; _i10 < _a10.length; _i10++) {
              _r10.push(_f10(_a10[_i10], _i10, _a10));
            }

            return {
              date: new Date(absence['@_AbsenceDate'][0]),
              reason: absence['@_Reason'][0],
              note: absence['@_Note'][0],
              description: absence['@_CodeAllDayDescription'][0],
              periods: _r10
            };
          };

          var _r8 = [];

          for (var _i8 = 0; _i8 < _a8.length; _i8++) {
            _r8.push(_f8(_a8[_i8], _i8, _a8));
          }

          var _a9 = xmlObject.TotalActivities[0].PeriodTotal;

          var _f9 = (pd, i) => {
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

          var _r9 = [];

          for (var _i9 = 0; _i9 < _a9.length; _i9++) {
            _r9.push(_f9(_a9[_i9], _i9, _a9));
          }

          res({
            type: xmlObject['@_Type'][0],
            period: {
              total: Number(xmlObject['@_PeriodCount'][0]),
              start: Number(xmlObject['@_StartPeriod'][0]),
              end: Number(xmlObject['@_EndPeriod'][0])
            },
            schoolName: xmlObject['@_SchoolName'][0],
            absences: _r8,
            periodInfos: _r9
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
          var _a11 = xmlObject.Gradebook[0].ReportingPeriods[0].ReportPeriod;

          var _f11 = period => {
            return {
              date: {
                start: new Date(period['@_StartDate'][0]),
                end: new Date(period['@_EndDate'][0])
              },
              name: period['@_GradePeriod'][0],
              index: Number(period['@_Index'][0])
            };
          };

          var _r11 = [];

          for (var _i11 = 0; _i11 < _a11.length; _i11++) {
            _r11.push(_f11(_a11[_i11], _i11, _a11));
          }

          var _a12 = xmlObject.Gradebook[0].Courses[0].Course;

          var _f12 = course => {
            var _a13 = course.Marks[0].Mark;

            var _f13 = mark => {
              var _a14 = mark.Assignments[0].Assignment;

              var _f14 = assignment => {
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

              var _r14 = [];

              for (var _i14 = 0; _i14 < _a14.length; _i14++) {
                _r14.push(_f14(_a14[_i14], _i14, _a14));
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
                assignments: _r14
              };
            };

            var _r13 = [];

            for (var _i13 = 0; _i13 < _a13.length; _i13++) {
              _r13.push(_f13(_a13[_i13], _i13, _a13));
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
              marks: _r13
            };
          };

          var _r12 = [];

          for (var _i12 = 0; _i12 < _a12.length; _i12++) {
            _r12.push(_f12(_a12[_i12], _i12, _a12));
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
              available: _r11
            },
            courses: _r12
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
          var _a15 = xmlObject.PXPMessagesData[0].MessageListings[0].MessageListing;

          var _f15 = message => {
            return new _Message.default(message, super.credentials, this.hostUrl);
          };

          var _r15 = [];

          for (var _i15 = 0; _i15 < _a15.length; _i15++) {
            _r15.push(_f15(_a15[_i15], _i15, _a15));
          }

          res(_r15);
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
          var _a16 = xmlObjectData.StudentInfo[0].Address[0].EmergencyContacts[0].EmergencyContact;

          var _f16 = contact => {
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

          var _r16 = [];

          for (var _i16 = 0; _i16 < _a16.length; _i16++) {
            _r16.push(_f16(_a16[_i16], _i16, _a16));
          }

          var _a17 = xmlObjectData.StudentInfo[0].Address[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox;

          var _f17 = definedBox => {
            var _a18 = definedBox.UserDefinedItems[0].UserDefinedItem;

            var _f18 = item => {
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

            var _r18 = [];

            for (var _i18 = 0; _i18 < _a18.length; _i18++) {
              _r18.push(_f18(_a18[_i18], _i18, _a18));
            }

            return {
              id: definedBox['@_GroupBoxID'][0],
              type: definedBox['@_GroupBoxLabel'][0],
              vcId: definedBox['@_VCID'][0],
              items: _r18
            };
          };

          var _r17 = [];

          for (var _i17 = 0; _i17 < _a17.length; _i17++) {
            _r17.push(_f17(_a17[_i17], _i17, _a17));
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
            emergencyContacts: _r16,
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
            additionalInfo: _r17
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

            var _a19 = events.CalendarListing[0].EventLists[0].EventList;

            var _f19 = event => {
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

            var _r19 = [];

            for (var _i19 = 0; _i19 < _a19.length; _i19++) {
              _r19.push(_f19(_a19[_i19], _i19, _a19));
            }

            let rest = { ...memo,
              // This is to prevent re-initializing Date objects in order to improve performance
              events: [...(prev.events ? prev.events : []), ..._r19]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50Iiwic29hcCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiZG9jdW1lbnRzIiwiUHJvbWlzZSIsInJlcyIsInJlaiIsInhtbE9iamVjdCIsInByb2Nlc3NSZXF1ZXN0IiwibWV0aG9kTmFtZSIsInBhcmFtU3RyIiwiY2hpbGRJbnRJZCIsIlN0dWRlbnREb2N1bWVudERhdGFzIiwiU3R1ZGVudERvY3VtZW50RGF0YSIsInhtbCIsIkRvY3VtZW50IiwiZSIsInJlcG9ydENhcmRzIiwiUkNSZXBvcnRpbmdQZXJpb2REYXRhIiwiUkNSZXBvcnRpbmdQZXJpb2RzIiwiUkNSZXBvcnRpbmdQZXJpb2QiLCJSZXBvcnRDYXJkIiwic2Nob29sSW5mbyIsIlN0dWRlbnRTY2hvb2xJbmZvTGlzdGluZyIsImNoaWxkSW50SUQiLCJTdGFmZkxpc3RzIiwiU3RhZmZMaXN0Iiwic3RhZmYiLCJuYW1lIiwiZW1haWwiLCJzdGFmZkd1Iiwiam9iVGl0bGUiLCJleHRuIiwicGhvbmUiLCJzY2hvb2wiLCJhZGRyZXNzIiwiYWRkcmVzc0FsdCIsImNpdHkiLCJ6aXBDb2RlIiwiYWx0UGhvbmUiLCJwcmluY2lwYWwiLCJzY2hlZHVsZSIsInRlcm1JbmRleCIsIlRlcm1JbmRleCIsIlN0dWRlbnRDbGFzc1NjaGVkdWxlIiwiVG9kYXlTY2hlZHVsZUluZm9EYXRhIiwiU2Nob29sSW5mb3MiLCJTY2hvb2xJbmZvIiwiQ2xhc3NlcyIsIkNsYXNzSW5mbyIsImNvdXJzZSIsInBlcmlvZCIsIk51bWJlciIsImF0dGVuZGFuY2VDb2RlIiwiQXR0ZW5kYW5jZUNvZGUiLCJkYXRlIiwic3RhcnQiLCJEYXRlIiwiZW5kIiwic2VjdGlvbkd1IiwidGVhY2hlciIsImVtYWlsU3ViamVjdCIsInVybCIsImJlbGxTY2hlZHVsZU5hbWUiLCJjbGFzc2VzIiwiQ2xhc3NMaXN0cyIsIkNsYXNzTGlzdGluZyIsInN0dWRlbnRDbGFzcyIsInJvb20iLCJUZXJtTGlzdHMiLCJUZXJtTGlzdGluZyIsInRlcm0iLCJpbmRleCIsInNjaG9vbFllYXJUZXJtQ29kZUd1IiwiZXJyb3IiLCJ0b2RheSIsInRlcm1zIiwiYXR0ZW5kYW5jZSIsImF0dGVuZGFuY2VYTUxPYmplY3QiLCJBdHRlbmRhbmNlIiwiQWJzZW5jZXMiLCJBYnNlbmNlIiwiYWJzZW5jZSIsIlBlcmlvZHMiLCJQZXJpb2QiLCJyZWFzb24iLCJvcmdZZWFyR3UiLCJub3RlIiwiZGVzY3JpcHRpb24iLCJwZXJpb2RzIiwiVG90YWxBY3Rpdml0aWVzIiwiUGVyaW9kVG90YWwiLCJwZCIsImkiLCJ0b3RhbCIsImV4Y3VzZWQiLCJUb3RhbEV4Y3VzZWQiLCJ0YXJkaWVzIiwiVG90YWxUYXJkaWVzIiwidW5leGN1c2VkIiwiVG90YWxVbmV4Y3VzZWQiLCJhY3Rpdml0aWVzIiwidW5leGN1c2VkVGFyZGllcyIsIlRvdGFsVW5leGN1c2VkVGFyZGllcyIsInR5cGUiLCJzY2hvb2xOYW1lIiwiYWJzZW5jZXMiLCJwZXJpb2RJbmZvcyIsImdyYWRlYm9vayIsInJlcG9ydGluZ1BlcmlvZEluZGV4IiwiUmVwb3J0aW5nUGVyaW9kIiwiR3JhZGVib29rIiwiUmVwb3J0aW5nUGVyaW9kcyIsIlJlcG9ydFBlcmlvZCIsIkNvdXJzZXMiLCJDb3Vyc2UiLCJNYXJrcyIsIk1hcmsiLCJtYXJrIiwiQXNzaWdubWVudHMiLCJBc3NpZ25tZW50IiwiYXNzaWdubWVudCIsImdyYWRlYm9va0lkIiwiZHVlIiwic2NvcmUiLCJ2YWx1ZSIsInBvaW50cyIsIm5vdGVzIiwidGVhY2hlcklkIiwiaGFzRHJvcGJveCIsIkpTT04iLCJwYXJzZSIsInN0dWRlbnRJZCIsImRyb3Bib3hEYXRlIiwicmVzb3VyY2VzIiwiUmVzb3VyY2VzIiwiUmVzb3VyY2UiLCJtYXAiLCJyc3JjIiwiZmlsZVJzcmMiLCJSZXNvdXJjZVR5cGUiLCJGSUxFIiwiZmlsZSIsInVyaSIsInJlc291cmNlIiwiaWQiLCJ1cmxSc3JjIiwiVVJMIiwicGF0aCIsImNhbGN1bGF0ZWRTY29yZSIsInN0cmluZyIsInJhdyIsIndlaWdodGVkQ2F0ZWdvcmllcyIsIkFzc2lnbm1lbnRHcmFkZUNhbGMiLCJ3ZWlnaHRlZCIsImNhbGN1bGF0ZWRNYXJrIiwid2VpZ2h0IiwiZXZhbHVhdGVkIiwic3RhbmRhcmQiLCJjdXJyZW50IiwicG9zc2libGUiLCJhc3NpZ25tZW50cyIsInRpdGxlIiwibWFya3MiLCJyZXBvcnRpbmdQZXJpb2QiLCJmaW5kIiwieCIsImF2YWlsYWJsZSIsImNvdXJzZXMiLCJtZXNzYWdlcyIsIlBYUE1lc3NhZ2VzRGF0YSIsIk1lc3NhZ2VMaXN0aW5ncyIsIk1lc3NhZ2VMaXN0aW5nIiwibWVzc2FnZSIsIk1lc3NhZ2UiLCJzdHVkZW50SW5mbyIsInhtbE9iamVjdERhdGEiLCJTdHVkZW50SW5mbyIsIkFkZHJlc3MiLCJFbWVyZ2VuY3lDb250YWN0cyIsIkVtZXJnZW5jeUNvbnRhY3QiLCJjb250YWN0IiwiaG9tZSIsIm1vYmlsZSIsIm90aGVyIiwid29yayIsInJlbGF0aW9uc2hpcCIsIlVzZXJEZWZpbmVkR3JvdXBCb3hlcyIsIlVzZXJEZWZpbmVkR3JvdXBCb3giLCJkZWZpbmVkQm94IiwiVXNlckRlZmluZWRJdGVtcyIsIlVzZXJEZWZpbmVkSXRlbSIsIml0ZW0iLCJzb3VyY2UiLCJlbGVtZW50Iiwib2JqZWN0IiwidmNJZCIsIml0ZW1zIiwic3R1ZGVudCIsIkZvcm1hdHRlZE5hbWUiLCJsYXN0TmFtZSIsIkxhc3ROYW1lR29lc0J5Iiwibmlja25hbWUiLCJOaWNrTmFtZSIsImJpcnRoRGF0ZSIsIkJpcnRoRGF0ZSIsInRyYWNrIiwiVHJhY2siLCJiciIsImNvdW5zZWxvciIsIkNvdW5zZWxvck5hbWUiLCJDb3Vuc2Vsb3JFbWFpbCIsIkNvdW5zZWxvclN0YWZmR1UiLCJjdXJyZW50U2Nob29sIiwiQ3VycmVudFNjaG9vbCIsImRlbnRpc3QiLCJEZW50aXN0Iiwib2ZmaWNlIiwicGh5c2ljaWFuIiwiUGh5c2ljaWFuIiwiaG9zcGl0YWwiLCJFTWFpbCIsImVtZXJnZW5jeUNvbnRhY3RzIiwiZ2VuZGVyIiwiR2VuZGVyIiwiZ3JhZGUiLCJHcmFkZSIsImxvY2tlckluZm9SZWNvcmRzIiwiTG9ja2VySW5mb1JlY29yZHMiLCJob21lTGFuZ3VhZ2UiLCJIb21lTGFuZ3VhZ2UiLCJob21lUm9vbSIsIkhvbWVSb29tIiwiaG9tZVJvb21UZWFjaGVyIiwiSG9tZVJvb21UY2hFTWFpbCIsIkhvbWVSb29tVGNoIiwiSG9tZVJvb21UY2hTdGFmZkdVIiwiYWRkaXRpb25hbEluZm8iLCJmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsIiwiUmVxdWVzdERhdGUiLCJ0b0lTT1N0cmluZyIsImNhbGVuZGFyIiwib3B0aW9ucyIsImRlZmF1bHRPcHRpb25zIiwiY29uY3VycmVuY3kiLCJzY2hvb2xTdGFydERhdGUiLCJpbnRlcnZhbCIsInNjaG9vbEVuZERhdGUiLCJtb250aHNXaXRoaW5TY2hvb2xZZWFyIiwiYWxsRXZlbnRzV2l0aGluU2Nob29sWWVhciIsImFsbCIsIm1lbW8iLCJldmVudHMiLCJyZWR1Y2UiLCJwcmV2Iiwic2Nob29sRGF0ZSIsIkNhbGVuZGFyTGlzdGluZyIsIm91dHB1dFJhbmdlIiwiRXZlbnRMaXN0cyIsIkV2ZW50TGlzdCIsImV2ZW50IiwiRXZlbnRUeXBlIiwiQVNTSUdOTUVOVCIsImFzc2lnbm1lbnRFdmVudCIsImFkZExpbmtEYXRhIiwiYWd1IiwiZGd1IiwibGluayIsInN0YXJ0VGltZSIsInZpZXdUeXBlIiwiSE9MSURBWSIsIlJFR1VMQVIiLCJyZWd1bGFyRXZlbnQiLCJ1bmRlZmluZWQiLCJyZXN0IiwiXyIsInVuaXFCeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJlLFFBQU1BLE1BQU4sU0FBcUJDLGNBQUtELE1BQTFCLENBQWlDO0FBRTlDRSxJQUFBQSxXQUFXLENBQUNDLFdBQUQsRUFBZ0NDLE9BQWhDLEVBQWlE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c29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgc29hcCBmcm9tICcuLi8uLi91dGlscy9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgeyBBZGRpdGlvbmFsSW5mbywgQWRkaXRpb25hbEluZm9JdGVtLCBDbGFzc1NjaGVkdWxlSW5mbywgU2Nob29sSW5mbywgU3R1ZGVudEluZm8gfSBmcm9tICcuL0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgU3R1ZGVudEluZm9YTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1N0dWRlbnRJbmZvJztcclxuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi4vTWVzc2FnZS9NZXNzYWdlJztcclxuaW1wb3J0IHsgTWVzc2FnZVhNTE9iamVjdCB9IGZyb20gJy4uL01lc3NhZ2UvTWVzc2FnZS54bWwnO1xyXG5pbXBvcnQgeyBBc3NpZ25tZW50RXZlbnRYTUxPYmplY3QsIENhbGVuZGFyWE1MT2JqZWN0LCBSZWd1bGFyRXZlbnRYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0NhbGVuZGFyJztcclxuaW1wb3J0IHsgQXNzaWdubWVudEV2ZW50LCBDYWxlbmRhciwgQ2FsZW5kYXJPcHRpb25zLCBFdmVudCwgSG9saWRheUV2ZW50LCBSZWd1bGFyRXZlbnQgfSBmcm9tICcuL0ludGVyZmFjZXMvQ2FsZW5kYXInO1xyXG5pbXBvcnQgeyBlYWNoTW9udGhPZkludGVydmFsLCBpc0FmdGVyLCBpc0JlZm9yZSwgaXNUaGlzTW9udGggfSBmcm9tICdkYXRlLWZucyc7XHJcbmltcG9ydCB7IEZpbGVSZXNvdXJjZVhNTE9iamVjdCwgR3JhZGVib29rWE1MT2JqZWN0LCBVUkxSZXNvdXJjZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvR3JhZGVib29rJztcclxuaW1wb3J0IHsgQXR0ZW5kYW5jZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvQXR0ZW5kYW5jZSc7XHJcbmltcG9ydCBFdmVudFR5cGUgZnJvbSAnLi4vLi4vQ29uc3RhbnRzL0V2ZW50VHlwZSc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IEFzc2lnbm1lbnQsIEZpbGVSZXNvdXJjZSwgR3JhZGVib29rLCBNYXJrLCBVUkxSZXNvdXJjZSwgV2VpZ2h0ZWRDYXRlZ29yeSB9IGZyb20gJy4vSW50ZXJmYWNlcy9HcmFkZWJvb2snO1xyXG5pbXBvcnQgYXN5bmNQb29sIGZyb20gJ3RpbnktYXN5bmMtcG9vbCc7XHJcbmltcG9ydCBSZXNvdXJjZVR5cGUgZnJvbSAnLi4vLi4vQ29uc3RhbnRzL1Jlc291cmNlVHlwZSc7XHJcbmltcG9ydCB7IEFic2VudFBlcmlvZCwgQXR0ZW5kYW5jZSwgUGVyaW9kSW5mbyB9IGZyb20gJy4vSW50ZXJmYWNlcy9BdHRlbmRhbmNlJztcclxuaW1wb3J0IHsgU2NoZWR1bGVYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1NjaGVkdWxlJztcclxuaW1wb3J0IHsgU2NoZWR1bGUgfSBmcm9tICcuL0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgU2Nob29sSW5mb1hNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU2Nob29sSW5mbyc7XHJcbmltcG9ydCB7IFJlcG9ydENhcmRzWE1MT2JqZWN0IH0gZnJvbSAnLi4vUmVwb3J0Q2FyZC9SZXBvcnRDYXJkLnhtbCc7XHJcbmltcG9ydCB7IERvY3VtZW50WE1MT2JqZWN0IH0gZnJvbSAnLi4vRG9jdW1lbnQvRG9jdW1lbnQueG1sJztcclxuaW1wb3J0IFJlcG9ydENhcmQgZnJvbSAnLi4vUmVwb3J0Q2FyZC9SZXBvcnRDYXJkJztcclxuaW1wb3J0IERvY3VtZW50IGZyb20gJy4uL0RvY3VtZW50L0RvY3VtZW50JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCBleHRlbmRzIHNvYXAuQ2xpZW50IHtcclxuICBwcml2YXRlIGhvc3RVcmw6IHN0cmluZztcclxuICBjb25zdHJ1Y3RvcihjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFscywgaG9zdFVybDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihjcmVkZW50aWFscyk7XHJcbiAgICB0aGlzLmhvc3RVcmwgPSBob3N0VXJsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgc3R1ZGVudCdzIGRvY3VtZW50cyBmcm9tIHN5bmVyZ3kgc2VydmVyc1xyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPERvY3VtZW50W119PiBSZXR1cm5zIGEgbGlzdCBvZiBzdHVkZW50IGRvY3VtZW50c1xyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBkb2N1bWVudHMgPSBhd2FpdCBjbGllbnQuZG9jdW1lbnRzKCk7XHJcbiAgICogY29uc3QgZG9jdW1lbnQgPSBkb2N1bWVudHNbMF07XHJcbiAgICogY29uc3QgZmlsZXMgPSBhd2FpdCBkb2N1bWVudC5nZXQoKTtcclxuICAgKiBjb25zdCBiYXNlNjRjb2xsZWN0aW9uID0gZmlsZXMubWFwKChmaWxlKSA9PiBmaWxlLmJhc2U2NCk7XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGRvY3VtZW50cygpOiBQcm9taXNlPERvY3VtZW50W10+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB4bWxPYmplY3Q6IERvY3VtZW50WE1MT2JqZWN0ID0gYXdhaXQgc3VwZXIucHJvY2Vzc1JlcXVlc3Qoe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0dldFN0dWRlbnREb2N1bWVudEluaXRpYWxEYXRhJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVzKFxyXG4gICAgICAgICAgeG1sT2JqZWN0WydTdHVkZW50RG9jdW1lbnRzJ11bMF0uU3R1ZGVudERvY3VtZW50RGF0YXNbMF0uU3R1ZGVudERvY3VtZW50RGF0YS5tYXAoXHJcbiAgICAgICAgICAgICh4bWwpID0+IG5ldyBEb2N1bWVudCh4bWwsIHN1cGVyLmNyZWRlbnRpYWxzKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyBhIGxpc3Qgb2YgcmVwb3J0IGNhcmRzXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8UmVwb3J0Q2FyZFtdPn0gUmV0dXJucyBhIGxpc3Qgb2YgcmVwb3J0IGNhcmRzIHRoYXQgY2FuIGZldGNoIGEgZmlsZVxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCByZXBvcnRDYXJkcyA9IGF3YWl0IGNsaWVudC5yZXBvcnRDYXJkcygpO1xyXG4gICAqIGNvbnN0IGZpbGVzID0gYXdhaXQgUHJvbWlzZS5hbGwocmVwb3J0Q2FyZHMubWFwKChjYXJkKSA9PiBjYXJkLmdldCgpKSk7XHJcbiAgICogY29uc3QgYmFzZTY0YXJyID0gZmlsZXMubWFwKChmaWxlKSA9PiBmaWxlLmJhc2U2NCk7IC8vIFtcIkpWQkVSaTAuLi5cIiwgXCJkVUlvYTEuLi5cIiwgLi4uXTtcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgcmVwb3J0Q2FyZHMoKTogUHJvbWlzZTxSZXBvcnRDYXJkW10+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB4bWxPYmplY3Q6IFJlcG9ydENhcmRzWE1MT2JqZWN0ID0gYXdhaXQgc3VwZXIucHJvY2Vzc1JlcXVlc3Qoe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0dldFJlcG9ydENhcmRJbml0aWFsRGF0YScsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVzKFxyXG4gICAgICAgICAgeG1sT2JqZWN0LlJDUmVwb3J0aW5nUGVyaW9kRGF0YVswXS5SQ1JlcG9ydGluZ1BlcmlvZHNbMF0uUkNSZXBvcnRpbmdQZXJpb2QubWFwKFxyXG4gICAgICAgICAgICAoeG1sKSA9PiBuZXcgUmVwb3J0Q2FyZCh4bWwsIHN1cGVyLmNyZWRlbnRpYWxzKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgc3R1ZGVudCdzIHNjaG9vbCdzIGluZm9ybWF0aW9uXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8U2Nob29sSW5mbz59IFJldHVybnMgdGhlIGluZm9ybWF0aW9uIG9mIHRoZSBzdHVkZW50J3Mgc2Nob29sXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBgYGBqc1xyXG4gICAqIGF3YWl0IGNsaWVudC5zY2hvb2xJbmZvKCk7XHJcbiAgICpcclxuICAgKiBjbGllbnQuc2Nob29sSW5mbygpLnRoZW4oKHNjaG9vbEluZm8pID0+IHtcclxuICAgKiAgY29uc29sZS5sb2coXy51bmlxKHNjaG9vbEluZm8uc3RhZmYubWFwKChzdGFmZikgPT4gc3RhZmYubmFtZSkpKTsgLy8gTGlzdCBhbGwgc3RhZmYgcG9zaXRpb25zIHVzaW5nIGxvZGFzaFxyXG4gICAqIH0pXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIHNjaG9vbEluZm8oKTogUHJvbWlzZTxTY2hvb2xJbmZvPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgU3R1ZGVudFNjaG9vbEluZm9MaXN0aW5nOiBbeG1sT2JqZWN0XSxcclxuICAgICAgICB9OiBTY2hvb2xJbmZvWE1MT2JqZWN0ID0gYXdhaXQgc3VwZXIucHJvY2Vzc1JlcXVlc3Qoe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRTY2hvb2xJbmZvJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SUQ6IDAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVzKHtcclxuICAgICAgICAgIHNjaG9vbDoge1xyXG4gICAgICAgICAgICBhZGRyZXNzOiB4bWxPYmplY3RbJ0BfU2Nob29sQWRkcmVzcyddWzBdLFxyXG4gICAgICAgICAgICBhZGRyZXNzQWx0OiB4bWxPYmplY3RbJ0BfU2Nob29sQWRkcmVzczInXVswXSxcclxuICAgICAgICAgICAgY2l0eTogeG1sT2JqZWN0WydAX1NjaG9vbENpdHknXVswXSxcclxuICAgICAgICAgICAgemlwQ29kZTogeG1sT2JqZWN0WydAX1NjaG9vbFppcCddWzBdLFxyXG4gICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0WydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgIGFsdFBob25lOiB4bWxPYmplY3RbJ0BfUGhvbmUyJ11bMF0sXHJcbiAgICAgICAgICAgIHByaW5jaXBhbDoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdFsnQF9QcmluY2lwYWwnXVswXSxcclxuICAgICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0WydAX1ByaW5jaXBhbEVtYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgc3RhZmZHdTogeG1sT2JqZWN0WydAX1ByaW5jaXBhbEd1J11bMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc3RhZmY6IHhtbE9iamVjdC5TdGFmZkxpc3RzWzBdLlN0YWZmTGlzdC5tYXAoKHN0YWZmKSA9PiAoe1xyXG4gICAgICAgICAgICBuYW1lOiBzdGFmZlsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgIGVtYWlsOiBzdGFmZlsnQF9FTWFpbCddWzBdLFxyXG4gICAgICAgICAgICBzdGFmZkd1OiBzdGFmZlsnQF9TdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgIGpvYlRpdGxlOiBzdGFmZlsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICBleHRuOiBzdGFmZlsnQF9FeHRuJ11bMF0sXHJcbiAgICAgICAgICAgIHBob25lOiBzdGFmZlsnQF9QaG9uZSddWzBdLFxyXG4gICAgICAgICAgfSkpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqKGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHNjaGVkdWxlIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRlcm1JbmRleCBUaGUgaW5kZXggb2YgdGhlIHRlcm0uXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8U2NoZWR1bGU+fSBSZXR1cm5zIHRoZSBzY2hlZHVsZSBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBhd2FpdCBzY2hlZHVsZSgwKSAvLyAtPiB7IHRlcm06IHsgaW5kZXg6IDAsIG5hbWU6ICcxc3QgUXRyIFByb2dyZXNzJyB9LCAuLi4gfVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzY2hlZHVsZSh0ZXJtSW5kZXg/OiBudW1iZXIpOiBQcm9taXNlPFNjaGVkdWxlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeG1sT2JqZWN0OiBTY2hlZHVsZVhNTE9iamVjdCA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50Q2xhc3NMaXN0JyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIC4uLih0ZXJtSW5kZXggIT0gbnVsbCA/IHsgVGVybUluZGV4OiB0ZXJtSW5kZXggfSA6IHt9KSB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXMoe1xyXG4gICAgICAgICAgdGVybToge1xyXG4gICAgICAgICAgICBpbmRleDogTnVtYmVyKHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9UZXJtSW5kZXgnXVswXSksXHJcbiAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9UZXJtSW5kZXhOYW1lJ11bMF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZXJyb3I6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9FcnJvck1lc3NhZ2UnXVswXSxcclxuICAgICAgICAgIHRvZGF5OiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVG9kYXlTY2hlZHVsZUluZm9EYXRhWzBdLlNjaG9vbEluZm9zWzBdLlNjaG9vbEluZm8ubWFwKChzY2hvb2wpID0+ICh7XHJcbiAgICAgICAgICAgIG5hbWU6IHNjaG9vbFsnQF9TY2hvb2xOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgIGJlbGxTY2hlZHVsZU5hbWU6IHNjaG9vbFsnQF9CZWxsU2NoZWROYW1lJ11bMF0sXHJcbiAgICAgICAgICAgIGNsYXNzZXM6IHNjaG9vbC5DbGFzc2VzWzBdLkNsYXNzSW5mby5tYXAoXHJcbiAgICAgICAgICAgICAgKGNvdXJzZSkgPT5cclxuICAgICAgICAgICAgICAgICh7XHJcbiAgICAgICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKGNvdXJzZVsnQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgIGF0dGVuZGFuY2VDb2RlOiBjb3Vyc2UuQXR0ZW5kYW5jZUNvZGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoY291cnNlWydAX1N0YXJ0RGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKGNvdXJzZVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfQ2xhc3NOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHNlY3Rpb25HdTogY291cnNlWydAX1NlY3Rpb25HVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICB0ZWFjaGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGNvdXJzZVsnQF9UZWFjaGVyRW1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbFN1YmplY3Q6IGNvdXJzZVsnQF9FbWFpbFN1YmplY3QnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfVGVhY2hlck5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBjb3Vyc2VbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogY291cnNlWydAX1RlYWNoZXJVUkwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0gYXMgQ2xhc3NTY2hlZHVsZUluZm8pXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICB9KSksXHJcbiAgICAgICAgICBjbGFzc2VzOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uQ2xhc3NMaXN0c1swXS5DbGFzc0xpc3RpbmcubWFwKChzdHVkZW50Q2xhc3MpID0+ICh7XHJcbiAgICAgICAgICAgIG5hbWU6IHN0dWRlbnRDbGFzc1snQF9Db3Vyc2VUaXRsZSddWzBdLFxyXG4gICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihzdHVkZW50Q2xhc3NbJ0BfUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICByb29tOiBzdHVkZW50Q2xhc3NbJ0BfUm9vbU5hbWUnXVswXSxcclxuICAgICAgICAgICAgc2VjdGlvbkd1OiBzdHVkZW50Q2xhc3NbJ0BfU2VjdGlvbkdVJ11bMF0sXHJcbiAgICAgICAgICAgIHRlYWNoZXI6IHtcclxuICAgICAgICAgICAgICBuYW1lOiBzdHVkZW50Q2xhc3NbJ0BfVGVhY2hlciddWzBdLFxyXG4gICAgICAgICAgICAgIGVtYWlsOiBzdHVkZW50Q2xhc3NbJ0BfVGVhY2hlckVtYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgc3RhZmZHdTogc3R1ZGVudENsYXNzWydAX1RlYWNoZXJTdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9KSksXHJcbiAgICAgICAgICB0ZXJtczogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLlRlcm1MaXN0c1swXS5UZXJtTGlzdGluZy5tYXAoKHRlcm0pID0+ICh7XHJcbiAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUodGVybVsnQF9CZWdpbkRhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZSh0ZXJtWydAX0VuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGluZGV4OiBOdW1iZXIodGVybVsnQF9UZXJtSW5kZXgnXVswXSksXHJcbiAgICAgICAgICAgIG5hbWU6IHRlcm1bJ0BfVGVybU5hbWUnXVswXSxcclxuICAgICAgICAgICAgc2Nob29sWWVhclRlcm1Db2RlR3U6IHRlcm1bJ0BfU2Nob29sWWVhclRybUNvZGVHVSddWzBdLFxyXG4gICAgICAgICAgfSkpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqKGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGF0dGVuZGFuY2Ugb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBdHRlbmRhbmNlPn0gUmV0dXJucyBhbiBBdHRlbmRhbmNlIG9iamVjdFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBjbGllbnQuYXR0ZW5kYW5jZSgpXHJcbiAgICogIC50aGVuKGNvbnNvbGUubG9nKTsgLy8gLT4geyB0eXBlOiAnUGVyaW9kJywgcGVyaW9kOiB7Li4ufSwgc2Nob29sTmFtZTogJ1VuaXZlcnNpdHkgSGlnaCBTY2hvb2wnLCBhYnNlbmNlczogWy4uLl0sIHBlcmlvZEluZm9zOiBbLi4uXSB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGF0dGVuZGFuY2UoKTogUHJvbWlzZTxBdHRlbmRhbmNlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgYXR0ZW5kYW5jZVhNTE9iamVjdDogQXR0ZW5kYW5jZVhNTE9iamVjdCA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdBdHRlbmRhbmNlJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7XHJcbiAgICAgICAgICAgIGNoaWxkSW50SWQ6IDAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCB4bWxPYmplY3QgPSBhdHRlbmRhbmNlWE1MT2JqZWN0LkF0dGVuZGFuY2VbMF07XHJcblxyXG4gICAgICAgIHJlcyh7XHJcbiAgICAgICAgICB0eXBlOiB4bWxPYmplY3RbJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgcGVyaW9kOiB7XHJcbiAgICAgICAgICAgIHRvdGFsOiBOdW1iZXIoeG1sT2JqZWN0WydAX1BlcmlvZENvdW50J11bMF0pLFxyXG4gICAgICAgICAgICBzdGFydDogTnVtYmVyKHhtbE9iamVjdFsnQF9TdGFydFBlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgZW5kOiBOdW1iZXIoeG1sT2JqZWN0WydAX0VuZFBlcmlvZCddWzBdKSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzY2hvb2xOYW1lOiB4bWxPYmplY3RbJ0BfU2Nob29sTmFtZSddWzBdLFxyXG4gICAgICAgICAgYWJzZW5jZXM6IHhtbE9iamVjdC5BYnNlbmNlc1swXS5BYnNlbmNlLm1hcCgoYWJzZW5jZSkgPT4gKHtcclxuICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoYWJzZW5jZVsnQF9BYnNlbmNlRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgcmVhc29uOiBhYnNlbmNlWydAX1JlYXNvbiddWzBdLFxyXG4gICAgICAgICAgICBub3RlOiBhYnNlbmNlWydAX05vdGUnXVswXSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGFic2VuY2VbJ0BfQ29kZUFsbERheURlc2NyaXB0aW9uJ11bMF0sXHJcbiAgICAgICAgICAgIHBlcmlvZHM6IGFic2VuY2UuUGVyaW9kc1swXS5QZXJpb2QubWFwKFxyXG4gICAgICAgICAgICAgIChwZXJpb2QpID0+XHJcbiAgICAgICAgICAgICAgICAoe1xyXG4gICAgICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihwZXJpb2RbJ0BfTnVtYmVyJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICByZWFzb246IHBlcmlvZFsnQF9SZWFzb24nXVswXSxcclxuICAgICAgICAgICAgICAgICAgY291cnNlOiBwZXJpb2RbJ0BfQ291cnNlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHN0YWZmOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogcGVyaW9kWydAX1N0YWZmJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhZmZHdTogcGVyaW9kWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogcGVyaW9kWydAX1N0YWZmRU1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgb3JnWWVhckd1OiBwZXJpb2RbJ0BfT3JnWWVhckdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB9IGFzIEFic2VudFBlcmlvZClcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgIH0pKSxcclxuICAgICAgICAgIHBlcmlvZEluZm9zOiB4bWxPYmplY3QuVG90YWxBY3Rpdml0aWVzWzBdLlBlcmlvZFRvdGFsLm1hcCgocGQsIGkpID0+ICh7XHJcbiAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKHBkWydAX051bWJlciddWzBdKSxcclxuICAgICAgICAgICAgdG90YWw6IHtcclxuICAgICAgICAgICAgICBleGN1c2VkOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsRXhjdXNlZFswXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICB0YXJkaWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVGFyZGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICB1bmV4Y3VzZWQ6IE51bWJlcih4bWxPYmplY3QuVG90YWxVbmV4Y3VzZWRbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgYWN0aXZpdGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbEFjdGl2aXRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgdW5leGN1c2VkVGFyZGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbFVuZXhjdXNlZFRhcmRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9KSkgYXMgUGVyaW9kSW5mb1tdLFxyXG4gICAgICAgIH0gYXMgQXR0ZW5kYW5jZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgZ3JhZGVib29rIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHJlcG9ydGluZ1BlcmlvZEluZGV4IFRoZSB0aW1lZnJhbWUgdGhhdCB0aGUgZ3JhZGVib29rIHNob3VsZCByZXR1cm5cclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxHcmFkZWJvb2s+fSBSZXR1cm5zIGEgR3JhZGVib29rIG9iamVjdFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBncmFkZWJvb2sgPSBhd2FpdCBjbGllbnQuZ3JhZGVib29rKCk7XHJcbiAgICogY29uc29sZS5sb2coZ3JhZGVib29rKTsgLy8geyBlcnJvcjogJycsIHR5cGU6ICdUcmFkaXRpb25hbCcsIHJlcG9ydGluZ1BlcmlvZDogey4uLn0sIGNvdXJzZXM6IFsuLi5dIH07XHJcbiAgICpcclxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDApIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggMCBhcyBcIjFzdCBRdWFydGVyIFByb2dyZXNzXCJcclxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDcpIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggNyBhcyBcIjR0aCBRdWFydGVyXCJcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgZ3JhZGVib29rKHJlcG9ydGluZ1BlcmlvZEluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxHcmFkZWJvb2s+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB4bWxPYmplY3Q6IEdyYWRlYm9va1hNTE9iamVjdCA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdHcmFkZWJvb2snLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgLi4uKHJlcG9ydGluZ1BlcmlvZEluZGV4ID8geyBSZXBvcnRpbmdQZXJpb2Q6IHJlcG9ydGluZ1BlcmlvZEluZGV4IH0gOiB7fSkgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXMoe1xyXG4gICAgICAgICAgZXJyb3I6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfRXJyb3JNZXNzYWdlJ11bMF0sXHJcbiAgICAgICAgICB0eXBlOiB4bWxPYmplY3QuR3JhZGVib29rWzBdWydAX1R5cGUnXVswXSxcclxuICAgICAgICAgIHJlcG9ydGluZ1BlcmlvZDoge1xyXG4gICAgICAgICAgICBjdXJyZW50OiB7XHJcbiAgICAgICAgICAgICAgaW5kZXg6XHJcbiAgICAgICAgICAgICAgICByZXBvcnRpbmdQZXJpb2RJbmRleCA/P1xyXG4gICAgICAgICAgICAgICAgTnVtYmVyKFxyXG4gICAgICAgICAgICAgICAgICB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZHNbMF0uUmVwb3J0UGVyaW9kLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAgICAgKHgpID0+IHhbJ0BfR3JhZGVQZXJpb2QnXVswXSA9PT0geG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfR3JhZGVQZXJpb2QnXVswXVxyXG4gICAgICAgICAgICAgICAgICApPy5bJ0BfSW5kZXgnXVswXVxyXG4gICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZSh4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfR3JhZGVQZXJpb2QnXVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYXZhaWxhYmxlOiB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZHNbMF0uUmVwb3J0UGVyaW9kLm1hcCgocGVyaW9kKSA9PiAoe1xyXG4gICAgICAgICAgICAgIGRhdGU6IHsgc3RhcnQ6IG5ldyBEYXRlKHBlcmlvZFsnQF9TdGFydERhdGUnXVswXSksIGVuZDogbmV3IERhdGUocGVyaW9kWydAX0VuZERhdGUnXVswXSkgfSxcclxuICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfR3JhZGVQZXJpb2QnXVswXSxcclxuICAgICAgICAgICAgICBpbmRleDogTnVtYmVyKHBlcmlvZFsnQF9JbmRleCddWzBdKSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNvdXJzZXM6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uQ291cnNlc1swXS5Db3Vyc2UubWFwKChjb3Vyc2UpID0+ICh7XHJcbiAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKGNvdXJzZVsnQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgIHRpdGxlOiBjb3Vyc2VbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgcm9vbTogY291cnNlWydAX1Jvb20nXVswXSxcclxuICAgICAgICAgICAgc3RhZmY6IHtcclxuICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfU3RhZmYnXVswXSxcclxuICAgICAgICAgICAgICBlbWFpbDogY291cnNlWydAX1N0YWZmRU1haWwnXVswXSxcclxuICAgICAgICAgICAgICBzdGFmZkd1OiBjb3Vyc2VbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtYXJrczogY291cnNlLk1hcmtzWzBdLk1hcmsubWFwKChtYXJrKSA9PiAoe1xyXG4gICAgICAgICAgICAgIG5hbWU6IG1hcmtbJ0BfTWFya05hbWUnXVswXSxcclxuICAgICAgICAgICAgICBjYWxjdWxhdGVkU2NvcmU6IHtcclxuICAgICAgICAgICAgICAgIHN0cmluZzogbWFya1snQF9DYWxjdWxhdGVkU2NvcmVTdHJpbmcnXVswXSxcclxuICAgICAgICAgICAgICAgIHJhdzogTnVtYmVyKG1hcmtbJ0BfQ2FsY3VsYXRlZFNjb3JlUmF3J11bMF0pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgd2VpZ2h0ZWRDYXRlZ29yaWVzOlxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG1hcmtbJ0dyYWRlQ2FsY3VsYXRpb25TdW1tYXJ5J11bMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgID8gbWFya1snR3JhZGVDYWxjdWxhdGlvblN1bW1hcnknXVswXS5Bc3NpZ25tZW50R3JhZGVDYWxjLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICh3ZWlnaHRlZCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB3ZWlnaHRlZFsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXRlZE1hcms6IHdlaWdodGVkWydAX0NhbGN1bGF0ZWRNYXJrJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmFsdWF0ZWQ6IHdlaWdodGVkWydAX1dlaWdodGVkUGN0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFuZGFyZDogd2VpZ2h0ZWRbJ0BfV2VpZ2h0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IE51bWJlcih3ZWlnaHRlZFsnQF9Qb2ludHMnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NzaWJsZTogTnVtYmVyKHdlaWdodGVkWydAX1BvaW50c1Bvc3NpYmxlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgV2VpZ2h0ZWRDYXRlZ29yeSlcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgYXNzaWdubWVudHM6IG1hcmsuQXNzaWdubWVudHNbMF0uQXNzaWdubWVudC5tYXAoKGFzc2lnbm1lbnQpID0+ICh7XHJcbiAgICAgICAgICAgICAgICBncmFkZWJvb2tJZDogYXNzaWdubWVudFsnQF9HcmFkZWJvb2tJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogYXNzaWdubWVudFsnQF9NZWFzdXJlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBhc3NpZ25tZW50WydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgZHVlOiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0R1ZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2NvcmU6IHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogYXNzaWdubWVudFsnQF9TY29yZVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgdmFsdWU6IGFzc2lnbm1lbnRbJ0BfU2NvcmUnXVswXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwb2ludHM6IGFzc2lnbm1lbnRbJ0BfUG9pbnRzJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBub3RlczogYXNzaWdubWVudFsnQF9Ob3RlcyddWzBdLFxyXG4gICAgICAgICAgICAgICAgdGVhY2hlcklkOiBhc3NpZ25tZW50WydAX1RlYWNoZXJJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGFzc2lnbm1lbnRbJ0BfTWVhc3VyZURlc2NyaXB0aW9uJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBoYXNEcm9wYm94OiBKU09OLnBhcnNlKGFzc2lnbm1lbnRbJ0BfSGFzRHJvcEJveCddWzBdKSxcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRJZDogYXNzaWdubWVudFsnQF9TdHVkZW50SUQnXVswXSxcclxuICAgICAgICAgICAgICAgIGRyb3Bib3hEYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0Ryb3BTdGFydERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9Ecm9wRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6XHJcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiBhc3NpZ25tZW50LlJlc291cmNlc1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICA/IChhc3NpZ25tZW50LlJlc291cmNlc1swXS5SZXNvdXJjZS5tYXAoKHJzcmMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyc3JjWydAX1R5cGUnXVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ0ZpbGUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZVJzcmMgPSByc3JjIGFzIEZpbGVSZXNvdXJjZVhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFJlc291cmNlVHlwZS5GSUxFLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlsZVJzcmNbJ0BfRmlsZVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBmaWxlUnNyY1snQF9GaWxlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVyaTogdGhpcy5ob3N0VXJsICsgZmlsZVJzcmNbJ0BfU2VydmVyRmlsZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShmaWxlUnNyY1snQF9SZXNvdXJjZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGZpbGVSc3JjWydAX1Jlc291cmNlSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBmaWxlUnNyY1snQF9SZXNvdXJjZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgRmlsZVJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ1VSTCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmxSc3JjID0gcnNyYyBhcyBVUkxSZXNvdXJjZVhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdXJsUnNyY1snQF9VUkwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUmVzb3VyY2VUeXBlLlVSTCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSh1cmxSc3JjWydAX1Jlc291cmNlRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdXJsUnNyY1snQF9SZXNvdXJjZUlEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdXJsUnNyY1snQF9SZXNvdXJjZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdXJsUnNyY1snQF9SZXNvdXJjZURlc2NyaXB0aW9uJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHVybFJzcmNbJ0BfU2VydmVyRmlsZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgVVJMUmVzb3VyY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlaihgVHlwZSAke3JzcmNbJ0BfVHlwZSddWzBdfSBkb2VzIG5vdCBleGlzdCBhcyBhIHR5cGUuIEFkZCBpdCB0byB0eXBlIGRlY2xhcmF0aW9ucy5gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfSkgYXMgKEZpbGVSZXNvdXJjZSB8IFVSTFJlc291cmNlKVtdKVxyXG4gICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgfSkpIGFzIEFzc2lnbm1lbnRbXSxcclxuICAgICAgICAgICAgfSkpIGFzIE1hcmtbXSxcclxuICAgICAgICAgIH0pKSxcclxuICAgICAgICB9IGFzIEdyYWRlYm9vayk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGEgbGlzdCBvZiBtZXNzYWdlcyBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPE1lc3NhZ2VbXT59IFJldHVybnMgYW4gYXJyYXkgb2YgbWVzc2FnZXMgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYGpzXHJcbiAgICogYXdhaXQgY2xpZW50Lm1lc3NhZ2VzKCk7IC8vIC0+IFt7IGlkOiAnRTk3MkYxQkMtOTlBMC00Q0QwLThEMTUtQjE4OTY4QjQzRTA4JywgdHlwZTogJ1N0dWRlbnRBY3Rpdml0eScsIC4uLiB9LCB7IGlkOiAnODZGREExMUQtNDJDNy00MjQ5LUIwMDMtOTRCMTVFQjJDOEQ0JywgdHlwZTogJ1N0dWRlbnRBY3Rpdml0eScsIC4uLiB9XVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBtZXNzYWdlcygpOiBQcm9taXNlPE1lc3NhZ2VbXT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXMsIHJlaikgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHhtbE9iamVjdDogTWVzc2FnZVhNTE9iamVjdCA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRQWFBNZXNzYWdlcycsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVzKFxyXG4gICAgICAgICAgeG1sT2JqZWN0LlBYUE1lc3NhZ2VzRGF0YVswXS5NZXNzYWdlTGlzdGluZ3NbMF0uTWVzc2FnZUxpc3RpbmcubWFwKFxyXG4gICAgICAgICAgICAobWVzc2FnZSkgPT4gbmV3IE1lc3NhZ2UobWVzc2FnZSwgc3VwZXIuY3JlZGVudGlhbHMsIHRoaXMuaG9zdFVybClcclxuICAgICAgICAgIClcclxuICAgICAgICApO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqKGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGluZm8gb2YgYSBzdHVkZW50XHJcbiAgICogQHJldHVybnMge1Byb21pc2U8U3R1ZGVudEluZm8+fSBTdHVkZW50SW5mbyBvYmplY3RcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYGpzXHJcbiAgICogc3R1ZGVudEluZm8oKS50aGVuKGNvbnNvbGUubG9nKSAvLyAtPiB7IHN0dWRlbnQ6IHsgbmFtZTogJ0V2YW4gRGF2aXMnLCBuaWNrbmFtZTogJycsIGxhc3ROYW1lOiAnRGF2aXMnIH0sIC4uLn1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc3R1ZGVudEluZm8oKTogUHJvbWlzZTxTdHVkZW50SW5mbz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFN0dWRlbnRJbmZvPihhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB4bWxPYmplY3REYXRhOiBTdHVkZW50SW5mb1hNTE9iamVjdCA9IGF3YWl0IHN1cGVyLnByb2Nlc3NSZXF1ZXN0KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50SW5mbycsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJlcyh7XHJcbiAgICAgICAgICBzdHVkZW50OiB7XHJcbiAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRm9ybWF0dGVkTmFtZVswXSxcclxuICAgICAgICAgICAgbGFzdE5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5MYXN0TmFtZUdvZXNCeVswXSxcclxuICAgICAgICAgICAgbmlja25hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5OaWNrTmFtZVswXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBiaXJ0aERhdGU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5CaXJ0aERhdGVbMF0sXHJcbiAgICAgICAgICB0cmFjazogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlRyYWNrWzBdLFxyXG4gICAgICAgICAgYWRkcmVzczogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLmJyWzBdLFxyXG4gICAgICAgICAgY291bnNlbG9yOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Db3Vuc2Vsb3JOYW1lWzBdLFxyXG4gICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvckVtYWlsWzBdLFxyXG4gICAgICAgICAgICBzdGFmZkd1OiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ291bnNlbG9yU3RhZmZHVVswXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjdXJyZW50U2Nob29sOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ3VycmVudFNjaG9vbFswXSxcclxuICAgICAgICAgIGRlbnRpc3Q6IHtcclxuICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfRXh0biddWzBdLFxyXG4gICAgICAgICAgICBvZmZpY2U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5EZW50aXN0WzBdWydAX09mZmljZSddWzBdLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHBoeXNpY2lhbjoge1xyXG4gICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGh5c2ljaWFuWzBdWydAX05hbWUnXVswXSxcclxuICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5bMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9FeHRuJ11bMF0sXHJcbiAgICAgICAgICAgIGhvc3BpdGFsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGh5c2ljaWFuWzBdWydAX0hvc3BpdGFsJ11bMF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZW1haWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5FTWFpbFswXSxcclxuICAgICAgICAgIGVtZXJnZW5jeUNvbnRhY3RzOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uRW1lcmdlbmN5Q29udGFjdHNbMF0uRW1lcmdlbmN5Q29udGFjdC5tYXAoXHJcbiAgICAgICAgICAgIChjb250YWN0KSA9PiAoe1xyXG4gICAgICAgICAgICAgIG5hbWU6IGNvbnRhY3RbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICAgICAgICBob21lOiBjb250YWN0WydAX0hvbWVQaG9uZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgbW9iaWxlOiBjb250YWN0WydAX01vYmlsZVBob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBvdGhlcjogY29udGFjdFsnQF9PdGhlclBob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB3b3JrOiBjb250YWN0WydAX1dvcmtQaG9uZSddWzBdLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgcmVsYXRpb25zaGlwOiBjb250YWN0WydAX1JlbGF0aW9uc2hpcCddWzBdLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKSxcclxuICAgICAgICAgIGdlbmRlcjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HZW5kZXJbMF0sXHJcbiAgICAgICAgICBncmFkZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HcmFkZVswXSxcclxuICAgICAgICAgIGxvY2tlckluZm9SZWNvcmRzOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkxvY2tlckluZm9SZWNvcmRzWzBdLFxyXG4gICAgICAgICAgaG9tZUxhbmd1YWdlOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZUxhbmd1YWdlWzBdLFxyXG4gICAgICAgICAgaG9tZVJvb206IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lUm9vbVswXSxcclxuICAgICAgICAgIGhvbWVSb29tVGVhY2hlcjoge1xyXG4gICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoRU1haWxbMF0sXHJcbiAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lUm9vbVRjaFswXSxcclxuICAgICAgICAgICAgc3RhZmZHdTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoU3RhZmZHVVswXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhZGRpdGlvbmFsSW5mbzogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlVzZXJEZWZpbmVkR3JvdXBCb3hlc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94Lm1hcChcclxuICAgICAgICAgICAgKGRlZmluZWRCb3gpID0+ICh7XHJcbiAgICAgICAgICAgICAgaWQ6IGRlZmluZWRCb3hbJ0BfR3JvdXBCb3hJRCddWzBdLFxyXG4gICAgICAgICAgICAgIHR5cGU6IGRlZmluZWRCb3hbJ0BfR3JvdXBCb3hMYWJlbCddWzBdLFxyXG4gICAgICAgICAgICAgIHZjSWQ6IGRlZmluZWRCb3hbJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgIGl0ZW1zOiBkZWZpbmVkQm94LlVzZXJEZWZpbmVkSXRlbXNbMF0uVXNlckRlZmluZWRJdGVtLm1hcCgoaXRlbSkgPT4gKHtcclxuICAgICAgICAgICAgICAgIHNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICBlbGVtZW50OiBpdGVtWydAX1NvdXJjZUVsZW1lbnQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgb2JqZWN0OiBpdGVtWydAX1NvdXJjZU9iamVjdCddWzBdLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZjSWQ6IGl0ZW1bJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1bJ0BfVmFsdWUnXVswXSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IGl0ZW1bJ0BfSXRlbVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICB9KSkgYXMgQWRkaXRpb25hbEluZm9JdGVtW10sXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICApIGFzIEFkZGl0aW9uYWxJbmZvW10sXHJcbiAgICAgICAgfSBhcyBTdHVkZW50SW5mbyk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZWooZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGU6IERhdGUpIHtcclxuICAgIHJldHVybiBzdXBlci5wcm9jZXNzUmVxdWVzdDxDYWxlbmRhclhNTE9iamVjdD4oe1xyXG4gICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudENhbGVuZGFyJyxcclxuICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgUmVxdWVzdERhdGU6IGRhdGUudG9JU09TdHJpbmcoKSB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Q2FsZW5kYXJPcHRpb25zfSBvcHRpb25zIE9wdGlvbnMgdG8gcHJvdmlkZSBmb3IgY2FsZW5kYXIgbWV0aG9kLiBBbiBpbnRlcnZhbCBpcyByZXF1aXJlZC5cclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxDYWxlbmRhcj59IFJldHVybnMgYSBDYWxlbmRhciBvYmplY3RcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYGpzXHJcbiAgICogY2xpZW50LmNhbGVuZGFyKHsgaW50ZXJ2YWw6IHsgc3RhcnQ6IG5ldyBEYXRlKCc1LzEvMjAyMicpLCBlbmQ6IG5ldyBEYXRlKCc4LzEvMjAyMScpIH0sIGNvbmN1cnJlbmN5OiBudWxsIH0pOyAvLyAtPiBMaW1pdGxlc3MgY29uY3VycmVuY3kgKG5vdCByZWNvbW1lbmRlZClcclxuICAgKlxyXG4gICAqIGNvbnN0IGNhbGVuZGFyID0gYXdhaXQgY2xpZW50LmNhbGVuZGFyKHsgaW50ZXJ2YWw6IHsgLi4uIH19KTtcclxuICAgKiBjb25zb2xlLmxvZyhjYWxlbmRhcik7IC8vIC0+IHsgc2Nob29sRGF0ZTogey4uLn0sIG91dHB1dFJhbmdlOiB7Li4ufSwgZXZlbnRzOiBbLi4uXSB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGNhbGVuZGFyKG9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyk6IFByb21pc2U8Q2FsZW5kYXI+IHtcclxuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBDYWxlbmRhck9wdGlvbnMgPSB7XHJcbiAgICAgIGNvbmN1cnJlbmN5OiA3LFxyXG4gICAgICAuLi5vcHRpb25zLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzLCByZWopID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgc2Nob29sU3RhcnREYXRlOiBEYXRlIHwgbnVtYmVyID0gb3B0aW9ucy5pbnRlcnZhbC5zdGFydDtcclxuICAgICAgICBsZXQgc2Nob29sRW5kRGF0ZTogRGF0ZSB8IG51bWJlciA9IG9wdGlvbnMuaW50ZXJ2YWwuZW5kO1xyXG5cclxuICAgICAgICBjb25zdCBtb250aHNXaXRoaW5TY2hvb2xZZWFyID0gZWFjaE1vbnRoT2ZJbnRlcnZhbCh7IHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsIGVuZDogc2Nob29sRW5kRGF0ZSB9KTtcclxuICAgICAgICBjb25zdCBhbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyOiBDYWxlbmRhclhNTE9iamVjdFtdID1cclxuICAgICAgICAgIGRlZmF1bHRPcHRpb25zLmNvbmN1cnJlbmN5ID09IG51bGxcclxuICAgICAgICAgICAgPyBhd2FpdCBQcm9taXNlLmFsbChtb250aHNXaXRoaW5TY2hvb2xZZWFyLm1hcCgoZGF0ZSkgPT4gdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpKSlcclxuICAgICAgICAgICAgOiBhd2FpdCBhc3luY1Bvb2woZGVmYXVsdE9wdGlvbnMuY29uY3VycmVuY3ksIG1vbnRoc1dpdGhpblNjaG9vbFllYXIsIChkYXRlKSA9PlxyXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICBsZXQgbWVtbzogQ2FsZW5kYXIgfCBudWxsID0gbnVsbDtcclxuICAgICAgICBjb25zdCBldmVudHMgPSBhbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyLnJlZHVjZSgocHJldiwgZXZlbnRzKSA9PiB7XHJcbiAgICAgICAgICBpZiAobWVtbyA9PSBudWxsKVxyXG4gICAgICAgICAgICBtZW1vID0ge1xyXG4gICAgICAgICAgICAgIHNjaG9vbERhdGU6IHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF1bJ0BfU2Nob29sRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIG91dHB1dFJhbmdlOiB7XHJcbiAgICAgICAgICAgICAgICBzdGFydDogc2Nob29sU3RhcnREYXRlLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBzY2hvb2xFbmREYXRlLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZXZlbnRzOiBbXSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIGxldCByZXN0OiBDYWxlbmRhciA9IHtcclxuICAgICAgICAgICAgLi4ubWVtbywgLy8gVGhpcyBpcyB0byBwcmV2ZW50IHJlLWluaXRpYWxpemluZyBEYXRlIG9iamVjdHMgaW4gb3JkZXIgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxyXG4gICAgICAgICAgICBldmVudHM6IFtcclxuICAgICAgICAgICAgICAuLi4ocHJldi5ldmVudHMgPyBwcmV2LmV2ZW50cyA6IFtdKSxcclxuICAgICAgICAgICAgICAuLi4oZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXS5FdmVudExpc3RzWzBdLkV2ZW50TGlzdC5tYXAoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50WydAX0RheVR5cGUnXVswXSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5BU1NJR05NRU5UOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNzaWdubWVudEV2ZW50ID0gZXZlbnQgYXMgQXNzaWdubWVudEV2ZW50WE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogYXNzaWdubWVudEV2ZW50WydAX1RpdGxlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBhZGRMaW5rRGF0YTogYXNzaWdubWVudEV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBhZ3U6IGFzc2lnbm1lbnRFdmVudFsnQF9BR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGFzc2lnbm1lbnRFdmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGd1OiBhc3NpZ25tZW50RXZlbnRbJ0BfREdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBhc3NpZ25tZW50RXZlbnRbJ0BfTGluayddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBhc3NpZ25tZW50RXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuQVNTSUdOTUVOVCxcclxuICAgICAgICAgICAgICAgICAgICAgIHZpZXdUeXBlOiBhc3NpZ25tZW50RXZlbnRbJ0BfVmlld1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICB9IGFzIEFzc2lnbm1lbnRFdmVudDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5IT0xJREFZOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBldmVudFsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLkhPTElEQVksXHJcbiAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IGV2ZW50WydAX1N0YXJ0VGltZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICB9IGFzIEhvbGlkYXlFdmVudDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5SRUdVTEFSOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVndWxhckV2ZW50ID0gZXZlbnQgYXMgUmVndWxhckV2ZW50WE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogcmVndWxhckV2ZW50WydAX1RpdGxlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBhZ3U6IHJlZ3VsYXJFdmVudFsnQF9BR1UnXSA/IHJlZ3VsYXJFdmVudFsnQF9BR1UnXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKHJlZ3VsYXJFdmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHJlZ3VsYXJFdmVudFsnQF9FdnREZXNjcmlwdGlvbiddID8gcmVndWxhckV2ZW50WydAX0V2dERlc2NyaXB0aW9uJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBkZ3U6IHJlZ3VsYXJFdmVudFsnQF9ER1UnXSA/IHJlZ3VsYXJFdmVudFsnQF9ER1UnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IHJlZ3VsYXJFdmVudFsnQF9MaW5rJ10gPyByZWd1bGFyRXZlbnRbJ0BfTGluayddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiByZWd1bGFyRXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuUkVHVUxBUixcclxuICAgICAgICAgICAgICAgICAgICAgIHZpZXdUeXBlOiByZWd1bGFyRXZlbnRbJ0BfVmlld1R5cGUnXSA/IHJlZ3VsYXJFdmVudFsnQF9WaWV3VHlwZSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYWRkTGlua0RhdGE6IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddID8gcmVndWxhckV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgfSBhcyBSZWd1bGFyRXZlbnQ7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KSBhcyBFdmVudFtdKSxcclxuICAgICAgICAgICAgXSBhcyBFdmVudFtdLFxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gcmVzdDtcclxuICAgICAgICB9LCB7fSBhcyBDYWxlbmRhcik7XHJcblxyXG4gICAgICAgIHJlcyh7IC4uLmV2ZW50cywgZXZlbnRzOiBfLnVuaXFCeShldmVudHMuZXZlbnRzLCAoaXRlbSkgPT4gaXRlbS50aXRsZSkgfSBhcyBDYWxlbmRhcik7XHJcbiAgICAgICAgLy8gcmVzKGFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqKGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19