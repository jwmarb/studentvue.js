(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/soap/soap", "../Message/Message", "date-fns", "../../Constants/EventType", "lodash", "tiny-async-pool", "../../Constants/ResourceType", "../ReportCard/ReportCard", "../Document/Document", "../RequestException/RequestException", "../../utils/XMLFactory/XMLFactory"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/soap/soap"), require("../Message/Message"), require("date-fns"), require("../../Constants/EventType"), require("lodash"), require("tiny-async-pool"), require("../../Constants/ResourceType"), require("../ReportCard/ReportCard"), require("../Document/Document"), require("../RequestException/RequestException"), require("../../utils/XMLFactory/XMLFactory"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.soap, global.Message, global.dateFns, global.EventType, global.lodash, global.tinyAsyncPool, global.ResourceType, global.ReportCard, global.Document, global.RequestException, global.XMLFactory);
    global.Client = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _soap, _Message, _dateFns, _EventType, _lodash, _tinyAsyncPool, _ResourceType, _ReportCard, _Document, _RequestException, _XMLFactory) {
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
  _RequestException = _interopRequireDefault(_RequestException);
  _XMLFactory = _interopRequireDefault(_XMLFactory);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * The StudentVUE Client to access the API
   * @constructor
   * @extends {soap.Client}
   */
  class Client extends _soap.default.Client {
    constructor(credentials, hostUrl) {
      super(credentials);
      this.hostUrl = hostUrl;
    }
    /**
     * Validate's the user's credentials. It will throw an error if credentials are incorrect
     */


    validateCredentials() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'login test',
          validateErrors: false
        }).then(response => {
          if (response.RT_ERROR[0]['@_ERROR_MESSAGE'][0] === 'login test is not a valid method.') {
            res();
          } else rej(new _RequestException.default(response));
        }).catch(rej);
      });
    }
    /**
     * Gets the student's documents from synergy servers
     * @returns {Promise<Document[]>}> Returns a list of student documents
     * @description
     * ```js
     * const documents = await client.documents();
     * const document = documents[0];
     * const files = await document.get();
     * const base64collection = files.map((file) => file.base64);
     * ```
     */


    documents() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'GetStudentDocumentInitialData',
          paramStr: {
            childIntId: 0
          }
        }).then(xmlObject => {
          var _a = xmlObject['StudentDocuments'][0].StudentDocumentDatas[0].StudentDocumentData;

          var _f = xml => {
            return new _Document.default(xml, super.credentials);
          };

          var _r = [];

          for (var _i = 0; _i < _a.length; _i++) {
            _r.push(_f(_a[_i], _i, _a));
          }

          res(_r);
        }).catch(rej);
      });
    }
    /**
     * Gets a list of report cards
     * @returns {Promise<ReportCard[]>} Returns a list of report cards that can fetch a file
     * @description
     * ```js
     * const reportCards = await client.reportCards();
     * const files = await Promise.all(reportCards.map((card) => card.get()));
     * const base64arr = files.map((file) => file.base64); // ["JVBERi0...", "dUIoa1...", ...];
     * ```
     */


    reportCards() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'GetReportCardInitialData',
          paramStr: {
            childIntId: 0
          }
        }).then(xmlObject => {
          var _a2 = xmlObject.RCReportingPeriodData[0].RCReportingPeriods[0].RCReportingPeriod;

          var _f2 = xml => {
            return new _ReportCard.default(xml, super.credentials);
          };

          var _r2 = [];

          for (var _i2 = 0; _i2 < _a2.length; _i2++) {
            _r2.push(_f2(_a2[_i2], _i2, _a2));
          }

          res(_r2);
        }).catch(rej);
      });
    }
    /**
     * Gets the student's school's information
     * @returns {Promise<SchoolInfo>} Returns the information of the student's school
     * @description
     * ```js
     * await client.schoolInfo();
     *
     * client.schoolInfo().then((schoolInfo) => {
     *  console.log(_.uniq(schoolInfo.staff.map((staff) => staff.name))); // List all staff positions using lodash
     * })
     * ```
     */


    schoolInfo() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'StudentSchoolInfo',
          paramStr: {
            childIntID: 0
          }
        }).then(({
          StudentSchoolInfoListing: [xmlObject]
        }) => {
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
        }).catch(rej);
      });
    }
    /**
     * Gets the schedule of the student
     * @param {number} termIndex The index of the term.
     * @returns {Promise<Schedule>} Returns the schedule of the student
     * @description
     * ```js
     * await schedule(0) // -> { term: { index: 0, name: '1st Qtr Progress' }, ... }
     * ```
     */


    schedule(termIndex) {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'StudentClassList',
          paramStr: {
            childIntId: 0,
            ...(termIndex != null ? {
              TermIndex: termIndex
            } : {})
          }
        }).then(xmlObject => {
          var _a4 = xmlObject.StudentClassSchedule[0].ClassLists[0].ClassListing;

          var _f4 = studentClass => {
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

          var _r4 = [];

          for (var _i4 = 0; _i4 < _a4.length; _i4++) {
            _r4.push(_f4(_a4[_i4], _i4, _a4));
          }

          var _a5 = xmlObject.StudentClassSchedule[0].TermLists[0].TermListing;

          var _f5 = term => {
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

          var _r5 = [];

          for (var _i5 = 0; _i5 < _a5.length; _i5++) {
            _r5.push(_f5(_a5[_i5], _i5, _a5));
          }

          res({
            term: {
              index: Number(xmlObject.StudentClassSchedule[0]['@_TermIndex'][0]),
              name: xmlObject.StudentClassSchedule[0]['@_TermIndexName'][0]
            },
            error: xmlObject.StudentClassSchedule[0]['@_ErrorMessage'][0],
            today: typeof xmlObject.StudentClassSchedule[0].TodayScheduleInfoData[0].SchoolInfos[0] !== 'string' ? xmlObject.StudentClassSchedule[0].TodayScheduleInfoData[0].SchoolInfos[0].SchoolInfo.map(school => {
              return {
                name: school['@_SchoolName'][0],
                bellScheduleName: school['@_BellSchedName'][0],
                classes: school.Classes[0].ClassInfo.map(course => {
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
                    },
                    url: course['@_ClassURL'][0],
                    time: {
                      start: (0, _dateFns.parse)(course['@_StartTime'][0], 'hh:mm a', Date.now()),
                      end: (0, _dateFns.parse)(course['@_EndTime'][0], 'hh:mm a', Date.now())
                    }
                  };
                })
              };
            }) : [],
            classes: _r4,
            terms: _r5
          });
        }).catch(rej);
      });
    }
    /**
     * Returns the attendance of the student
     * @returns {Promise<Attendance>} Returns an Attendance object
     * @description
     * ```js
     * client.attendance()
     *  .then(console.log); // -> { type: 'Period', period: {...}, schoolName: 'University High School', absences: [...], periodInfos: [...] }
     * ```
     */


    attendance() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'Attendance',
          paramStr: {
            childIntId: 0
          }
        }).then(attendanceXMLObject => {
          const xmlObject = attendanceXMLObject.Attendance[0];
          var _a6 = xmlObject.Absences[0].Absence;

          var _f6 = absence => {
            var _a8 = absence.Periods[0].Period;

            var _f8 = period => {
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

            var _r8 = [];

            for (var _i8 = 0; _i8 < _a8.length; _i8++) {
              _r8.push(_f8(_a8[_i8], _i8, _a8));
            }

            return {
              date: new Date(absence['@_AbsenceDate'][0]),
              reason: absence['@_Reason'][0],
              note: absence['@_Note'][0],
              description: absence['@_CodeAllDayDescription'][0],
              periods: _r8
            };
          };

          var _r6 = [];

          for (var _i6 = 0; _i6 < _a6.length; _i6++) {
            _r6.push(_f6(_a6[_i6], _i6, _a6));
          }

          var _a7 = xmlObject.TotalActivities[0].PeriodTotal;

          var _f7 = (pd, i) => {
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

          var _r7 = [];

          for (var _i7 = 0; _i7 < _a7.length; _i7++) {
            _r7.push(_f7(_a7[_i7], _i7, _a7));
          }

          res({
            type: xmlObject['@_Type'][0],
            period: {
              total: Number(xmlObject['@_PeriodCount'][0]),
              start: Number(xmlObject['@_StartPeriod'][0]),
              end: Number(xmlObject['@_EndPeriod'][0])
            },
            schoolName: xmlObject['@_SchoolName'][0],
            absences: _r6,
            periodInfos: _r7
          });
        }).catch(rej);
      });
    }
    /**
     * Returns the gradebook of the student
     * @param {number} reportingPeriodIndex The timeframe that the gradebook should return
     * @returns {Promise<Gradebook>} Returns a Gradebook object
     * @description
     * ```js
     * const gradebook = await client.gradebook();
     * console.log(gradebook); // { error: '', type: 'Traditional', reportingPeriod: {...}, courses: [...] };
     *
     * await client.gradebook(0) // Some schools will have ReportingPeriodIndex 0 as "1st Quarter Progress"
     * await client.gradebook(7) // Some schools will have ReportingPeriodIndex 7 as "4th Quarter"
     * ```
     */


    gradebook(reportingPeriodIndex) {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'Gradebook',
          paramStr: {
            childIntId: 0,
            ...(reportingPeriodIndex != null ? {
              ReportPeriod: reportingPeriodIndex
            } : {})
          }
        }, xml => {
          return new _XMLFactory.default(xml).encodeAttribute('MeasureDescription', 'HasDropBox').encodeAttribute('Measure', 'Type').toString();
        }).then(xmlObject => {
          var _a9 = xmlObject.Gradebook[0].ReportingPeriods[0].ReportPeriod;

          var _f9 = period => {
            return {
              date: {
                start: new Date(period['@_StartDate'][0]),
                end: new Date(period['@_EndDate'][0])
              },
              name: period['@_GradePeriod'][0],
              index: Number(period['@_Index'][0])
            };
          };

          var _r9 = [];

          for (var _i9 = 0; _i9 < _a9.length; _i9++) {
            _r9.push(_f9(_a9[_i9], _i9, _a9));
          }

          var _a10 = xmlObject.Gradebook[0].Courses[0].Course;

          var _f10 = course => {
            var _a11 = course.Marks[0].Mark;

            var _f11 = mark => {
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
                assignments: typeof mark.Assignments[0] !== 'string' ? mark.Assignments[0].Assignment.map(assignment => {
                  return {
                    gradebookId: assignment['@_GradebookID'][0],
                    name: atob(assignment['@_Measure'][0]),
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
                    description: atob(assignment['@_MeasureDescription'][0]),
                    hasDropbox: JSON.parse(assignment['@_HasDropBox'][0]),
                    studentId: assignment['@_StudentID'][0],
                    dropboxDate: {
                      start: new Date(assignment['@_DropStartDate'][0]),
                      end: new Date(assignment['@_DropEndDate'][0])
                    },
                    resources: typeof assignment.Resources[0] !== 'string' ? assignment.Resources[0].Resource.map(rsrc => {
                      switch (rsrc['@_Type'][0]) {
                        case 'File':
                          {
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
                          }

                        case 'URL':
                          {
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
                          }

                        default:
                          rej(`Type ${rsrc['@_Type'][0]} does not exist as a type. Add it to type declarations.`);
                      }
                    }) : []
                  };
                }) : []
              };
            };

            var _r11 = [];

            for (var _i11 = 0; _i11 < _a11.length; _i11++) {
              _r11.push(_f11(_a11[_i11], _i11, _a11));
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
              marks: _r11
            };
          };

          var _r10 = [];

          for (var _i10 = 0; _i10 < _a10.length; _i10++) {
            _r10.push(_f10(_a10[_i10], _i10, _a10));
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
              available: _r9
            },
            courses: _r10
          });
        }).catch(rej);
      });
    }
    /**
     * Get a list of messages of the student
     * @returns {Promise<Message[]>} Returns an array of messages of the student
     * @description
     * ```js
     * await client.messages(); // -> [{ id: 'E972F1BC-99A0-4CD0-8D15-B18968B43E08', type: 'StudentActivity', ... }, { id: '86FDA11D-42C7-4249-B003-94B15EB2C8D4', type: 'StudentActivity', ... }]
     * ```
     */


    messages() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'GetPXPMessages',
          paramStr: {
            childIntId: 0
          }
        }, xml => {
          return new _XMLFactory.default(xml).encodeAttribute('Content', 'Read').toString();
        }).then(xmlObject => {
          var _a12 = xmlObject.PXPMessagesData[0].MessageListings[0].MessageListing;

          var _f12 = message => {
            return new _Message.default(message, super.credentials, this.hostUrl);
          };

          var _r12 = [];

          for (var _i12 = 0; _i12 < _a12.length; _i12++) {
            _r12.push(_f12(_a12[_i12], _i12, _a12));
          }

          res(_r12);
        }).catch(rej);
      });
    }
    /**
     * Gets the info of a student
     * @returns {Promise<StudentInfo>} StudentInfo object
     * @description
     * ```js
     * studentInfo().then(console.log) // -> { student: { name: 'Evan Davis', nickname: '', lastName: 'Davis' }, ...}
     * ```
     */


    studentInfo() {
      return new Promise((res, rej) => {
        super.processRequest({
          methodName: 'StudentInfo',
          paramStr: {
            childIntId: 0
          }
        }).then(xmlObjectData => {
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
            birthDate: new Date(xmlObjectData.StudentInfo[0].Address[0].BirthDate[0]),
            track: xmlObjectData.StudentInfo[0].Address[0].Track[0],
            address: xmlObjectData.StudentInfo[0].Address[0].br[0],
            photo: xmlObjectData.StudentInfo[0].Address[0].Photo[0],
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
            id: xmlObjectData.StudentInfo[0].PermID[0],
            orgYearGu: xmlObjectData.StudentInfo[0].Address[0].OrgYearGU[0],
            phone: xmlObjectData.StudentInfo[0].Address[0].Phone[0],
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
        }).catch(rej);
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
     * @description
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
      return new Promise((res, rej) => {
        const schoolStartDate = options.interval.start;
        const schoolEndDate = options.interval.end;
        const monthsWithinSchoolYear = (0, _dateFns.eachMonthOfInterval)({
          start: schoolStartDate,
          end: schoolEndDate
        });

        const getAllEventsWithinSchoolYear = () => {
          return defaultOptions.concurrency == null ? Promise.all(monthsWithinSchoolYear.map(date => {
            return this.fetchEventsWithinInterval(date);
          })) : (0, _tinyAsyncPool.default)(defaultOptions.concurrency, monthsWithinSchoolYear, date => {
            return this.fetchEventsWithinInterval(date);
          });
        };

        let memo = null;
        getAllEventsWithinSchoolYear().then(events => {
          const allEvents = events.reduce((prev, events) => {
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

            const rest = { ...memo,
              // This is to prevent re-initializing Date objects in order to improve performance
              events: [...(prev.events ? prev.events : []), ..._r16]
            };
            return rest;
          }, {});
          res({ ...allEvents,
            events: _lodash.default.uniqBy(allEvents.events, item => {
              return item.title;
            })
          });
        }).catch(rej);
      });
    }

  }

  _exports.default = Client;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50Iiwic29hcCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwidmFsaWRhdGVDcmVkZW50aWFscyIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJwcm9jZXNzUmVxdWVzdCIsIm1ldGhvZE5hbWUiLCJ2YWxpZGF0ZUVycm9ycyIsInRoZW4iLCJyZXNwb25zZSIsIlJUX0VSUk9SIiwiUmVxdWVzdEV4Y2VwdGlvbiIsImNhdGNoIiwiZG9jdW1lbnRzIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwieG1sT2JqZWN0IiwiU3R1ZGVudERvY3VtZW50RGF0YXMiLCJTdHVkZW50RG9jdW1lbnREYXRhIiwieG1sIiwiRG9jdW1lbnQiLCJyZXBvcnRDYXJkcyIsIlJDUmVwb3J0aW5nUGVyaW9kRGF0YSIsIlJDUmVwb3J0aW5nUGVyaW9kcyIsIlJDUmVwb3J0aW5nUGVyaW9kIiwiUmVwb3J0Q2FyZCIsInNjaG9vbEluZm8iLCJjaGlsZEludElEIiwiU3R1ZGVudFNjaG9vbEluZm9MaXN0aW5nIiwiU3RhZmZMaXN0cyIsIlN0YWZmTGlzdCIsInN0YWZmIiwibmFtZSIsImVtYWlsIiwic3RhZmZHdSIsImpvYlRpdGxlIiwiZXh0biIsInBob25lIiwic2Nob29sIiwiYWRkcmVzcyIsImFkZHJlc3NBbHQiLCJjaXR5IiwiemlwQ29kZSIsImFsdFBob25lIiwicHJpbmNpcGFsIiwic2NoZWR1bGUiLCJ0ZXJtSW5kZXgiLCJUZXJtSW5kZXgiLCJTdHVkZW50Q2xhc3NTY2hlZHVsZSIsIkNsYXNzTGlzdHMiLCJDbGFzc0xpc3RpbmciLCJzdHVkZW50Q2xhc3MiLCJwZXJpb2QiLCJOdW1iZXIiLCJyb29tIiwic2VjdGlvbkd1IiwidGVhY2hlciIsIlRlcm1MaXN0cyIsIlRlcm1MaXN0aW5nIiwidGVybSIsImRhdGUiLCJzdGFydCIsIkRhdGUiLCJlbmQiLCJpbmRleCIsInNjaG9vbFllYXJUZXJtQ29kZUd1IiwiZXJyb3IiLCJ0b2RheSIsIlRvZGF5U2NoZWR1bGVJbmZvRGF0YSIsIlNjaG9vbEluZm9zIiwiU2Nob29sSW5mbyIsIm1hcCIsImJlbGxTY2hlZHVsZU5hbWUiLCJjbGFzc2VzIiwiQ2xhc3NlcyIsIkNsYXNzSW5mbyIsImNvdXJzZSIsImF0dGVuZGFuY2VDb2RlIiwiQXR0ZW5kYW5jZUNvZGUiLCJlbWFpbFN1YmplY3QiLCJ1cmwiLCJ0aW1lIiwibm93IiwidGVybXMiLCJhdHRlbmRhbmNlIiwiYXR0ZW5kYW5jZVhNTE9iamVjdCIsIkF0dGVuZGFuY2UiLCJBYnNlbmNlcyIsIkFic2VuY2UiLCJhYnNlbmNlIiwiUGVyaW9kcyIsIlBlcmlvZCIsInJlYXNvbiIsIm9yZ1llYXJHdSIsIm5vdGUiLCJkZXNjcmlwdGlvbiIsInBlcmlvZHMiLCJUb3RhbEFjdGl2aXRpZXMiLCJQZXJpb2RUb3RhbCIsInBkIiwiaSIsInRvdGFsIiwiZXhjdXNlZCIsIlRvdGFsRXhjdXNlZCIsInRhcmRpZXMiLCJUb3RhbFRhcmRpZXMiLCJ1bmV4Y3VzZWQiLCJUb3RhbFVuZXhjdXNlZCIsImFjdGl2aXRpZXMiLCJ1bmV4Y3VzZWRUYXJkaWVzIiwiVG90YWxVbmV4Y3VzZWRUYXJkaWVzIiwidHlwZSIsInNjaG9vbE5hbWUiLCJhYnNlbmNlcyIsInBlcmlvZEluZm9zIiwiZ3JhZGVib29rIiwicmVwb3J0aW5nUGVyaW9kSW5kZXgiLCJSZXBvcnRQZXJpb2QiLCJYTUxGYWN0b3J5IiwiZW5jb2RlQXR0cmlidXRlIiwidG9TdHJpbmciLCJHcmFkZWJvb2siLCJSZXBvcnRpbmdQZXJpb2RzIiwiQ291cnNlcyIsIkNvdXJzZSIsIk1hcmtzIiwiTWFyayIsIm1hcmsiLCJjYWxjdWxhdGVkU2NvcmUiLCJzdHJpbmciLCJyYXciLCJ3ZWlnaHRlZENhdGVnb3JpZXMiLCJBc3NpZ25tZW50R3JhZGVDYWxjIiwid2VpZ2h0ZWQiLCJjYWxjdWxhdGVkTWFyayIsIndlaWdodCIsImV2YWx1YXRlZCIsInN0YW5kYXJkIiwicG9pbnRzIiwiY3VycmVudCIsInBvc3NpYmxlIiwiYXNzaWdubWVudHMiLCJBc3NpZ25tZW50cyIsIkFzc2lnbm1lbnQiLCJhc3NpZ25tZW50IiwiZ3JhZGVib29rSWQiLCJhdG9iIiwiZHVlIiwic2NvcmUiLCJ2YWx1ZSIsIm5vdGVzIiwidGVhY2hlcklkIiwiaGFzRHJvcGJveCIsIkpTT04iLCJwYXJzZSIsInN0dWRlbnRJZCIsImRyb3Bib3hEYXRlIiwicmVzb3VyY2VzIiwiUmVzb3VyY2VzIiwiUmVzb3VyY2UiLCJyc3JjIiwiZmlsZVJzcmMiLCJSZXNvdXJjZVR5cGUiLCJGSUxFIiwiZmlsZSIsInVyaSIsInJlc291cmNlIiwiaWQiLCJ1cmxSc3JjIiwiVVJMIiwicGF0aCIsInRpdGxlIiwibWFya3MiLCJyZXBvcnRpbmdQZXJpb2QiLCJmaW5kIiwieCIsIlJlcG9ydGluZ1BlcmlvZCIsImF2YWlsYWJsZSIsImNvdXJzZXMiLCJtZXNzYWdlcyIsIlBYUE1lc3NhZ2VzRGF0YSIsIk1lc3NhZ2VMaXN0aW5ncyIsIk1lc3NhZ2VMaXN0aW5nIiwibWVzc2FnZSIsIk1lc3NhZ2UiLCJzdHVkZW50SW5mbyIsInhtbE9iamVjdERhdGEiLCJTdHVkZW50SW5mbyIsIkFkZHJlc3MiLCJFbWVyZ2VuY3lDb250YWN0cyIsIkVtZXJnZW5jeUNvbnRhY3QiLCJjb250YWN0IiwiaG9tZSIsIm1vYmlsZSIsIm90aGVyIiwid29yayIsInJlbGF0aW9uc2hpcCIsIlVzZXJEZWZpbmVkR3JvdXBCb3hlcyIsIlVzZXJEZWZpbmVkR3JvdXBCb3giLCJkZWZpbmVkQm94IiwiVXNlckRlZmluZWRJdGVtcyIsIlVzZXJEZWZpbmVkSXRlbSIsIml0ZW0iLCJzb3VyY2UiLCJlbGVtZW50Iiwib2JqZWN0IiwidmNJZCIsIml0ZW1zIiwic3R1ZGVudCIsIkZvcm1hdHRlZE5hbWUiLCJsYXN0TmFtZSIsIkxhc3ROYW1lR29lc0J5Iiwibmlja25hbWUiLCJOaWNrTmFtZSIsImJpcnRoRGF0ZSIsIkJpcnRoRGF0ZSIsInRyYWNrIiwiVHJhY2siLCJiciIsInBob3RvIiwiUGhvdG8iLCJjb3Vuc2Vsb3IiLCJDb3Vuc2Vsb3JOYW1lIiwiQ291bnNlbG9yRW1haWwiLCJDb3Vuc2Vsb3JTdGFmZkdVIiwiY3VycmVudFNjaG9vbCIsIkN1cnJlbnRTY2hvb2wiLCJkZW50aXN0IiwiRGVudGlzdCIsIm9mZmljZSIsInBoeXNpY2lhbiIsIlBoeXNpY2lhbiIsImhvc3BpdGFsIiwiUGVybUlEIiwiT3JnWWVhckdVIiwiUGhvbmUiLCJFTWFpbCIsImVtZXJnZW5jeUNvbnRhY3RzIiwiZ2VuZGVyIiwiR2VuZGVyIiwiZ3JhZGUiLCJHcmFkZSIsImxvY2tlckluZm9SZWNvcmRzIiwiTG9ja2VySW5mb1JlY29yZHMiLCJob21lTGFuZ3VhZ2UiLCJIb21lTGFuZ3VhZ2UiLCJob21lUm9vbSIsIkhvbWVSb29tIiwiaG9tZVJvb21UZWFjaGVyIiwiSG9tZVJvb21UY2hFTWFpbCIsIkhvbWVSb29tVGNoIiwiSG9tZVJvb21UY2hTdGFmZkdVIiwiYWRkaXRpb25hbEluZm8iLCJmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsIiwiUmVxdWVzdERhdGUiLCJ0b0lTT1N0cmluZyIsImNhbGVuZGFyIiwib3B0aW9ucyIsImRlZmF1bHRPcHRpb25zIiwiY29uY3VycmVuY3kiLCJzY2hvb2xTdGFydERhdGUiLCJpbnRlcnZhbCIsInNjaG9vbEVuZERhdGUiLCJtb250aHNXaXRoaW5TY2hvb2xZZWFyIiwiZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhciIsImFsbCIsIm1lbW8iLCJldmVudHMiLCJhbGxFdmVudHMiLCJyZWR1Y2UiLCJwcmV2Iiwic2Nob29sRGF0ZSIsIkNhbGVuZGFyTGlzdGluZyIsIm91dHB1dFJhbmdlIiwiRXZlbnRMaXN0cyIsIkV2ZW50TGlzdCIsImV2ZW50IiwiRXZlbnRUeXBlIiwiQVNTSUdOTUVOVCIsImFzc2lnbm1lbnRFdmVudCIsImFkZExpbmtEYXRhIiwiYWd1IiwiZGd1IiwibGluayIsInN0YXJ0VGltZSIsInZpZXdUeXBlIiwiSE9MSURBWSIsIlJFR1VMQVIiLCJyZWd1bGFyRXZlbnQiLCJ1bmRlZmluZWQiLCJyZXN0IiwiXyIsInVuaXFCeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLFFBQU1BLE1BQU4sU0FBcUJDLGNBQUtELE1BQTFCLENBQWlDO0FBRTlDRSxJQUFBQSxXQUFXLENBQUNDLFdBQUQsRUFBZ0NDLE9BQWhDLEVBQWlEO0FBQzFELFlBQU1ELFdBQU47QUFDQSxXQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDRDtBQUVEO0FBQ0Y7QUFDQTs7O0FBQ1NDLElBQUFBLG1CQUFtQixHQUFrQjtBQUMxQyxhQUFPLElBQUlDLE9BQUosQ0FBWSxDQUFDQyxHQUFELEVBQU1DLEdBQU4sS0FBYztBQUMvQixjQUNHQyxjQURILENBQ3NDO0FBQUVDLFVBQUFBLFVBQVUsRUFBRSxZQUFkO0FBQTRCQyxVQUFBQSxjQUFjLEVBQUU7QUFBNUMsU0FEdEMsRUFFR0MsSUFGSCxDQUVTQyxRQUFELElBQWM7QUFDbEIsY0FBSUEsUUFBUSxDQUFDQyxRQUFULENBQWtCLENBQWxCLEVBQXFCLGlCQUFyQixFQUF3QyxDQUF4QyxNQUErQyxtQ0FBbkQ7QUFBd0ZQLFlBQUFBLEdBQUc7QUFBM0YsaUJBQ0tDLEdBQUcsQ0FBQyxJQUFJTyx5QkFBSixDQUFxQkYsUUFBckIsQ0FBRCxDQUFIO0FBQ04sU0FMSCxFQU1HRyxLQU5ILENBTVNSLEdBTlQ7QUFPRCxPQVJNLENBQVA7QUFTRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNTUyxJQUFBQSxTQUFTLEdBQXdCO0FBQ3RDLGFBQU8sSUFBSVgsT0FBSixDQUFZLENBQUNDLEdBQUQsRUFBTUMsR0FBTixLQUFjO0FBQy9CLGNBQ0dDLGNBREgsQ0FDcUM7QUFDakNDLFVBQUFBLFVBQVUsRUFBRSwrQkFEcUI7QUFFakNRLFVB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QUFELENBQVosQ0FBOEIsQ0FBOUIsQ0FBaEMsR0FBbUVDO0FBVjNFLHFCQUFQO0FBWUQ7QUFyQ0g7QUF1Q0QsYUF6RDJDOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFhaEQsa0JBQU1DLElBQWMsR0FBRyxFQUNyQixHQUFHeEIsSUFEa0I7QUFDWjtBQUNUQyxjQUFBQSxNQUFNLEVBQUUsQ0FDTixJQUFJRyxJQUFJLENBQUNILE1BQUwsR0FBY0csSUFBSSxDQUFDSCxNQUFuQixHQUE0QixFQUFoQyxDQURNLEVBRU4sT0FGTTtBQUZhLGFBQXZCO0FBZ0RBLG1CQUFPdUIsSUFBUDtBQUNELFdBOURpQixFQThEZixFQTlEZSxDQUFsQjtBQStEQS9SLFVBQUFBLEdBQUcsQ0FBQyxFQUFFLEdBQUd5USxTQUFMO0FBQWdCRCxZQUFBQSxNQUFNLEVBQUV3QixnQkFBRUMsTUFBRixDQUFTeEIsU0FBUyxDQUFDRCxNQUFuQixFQUE0QmpFLElBQUQ7QUFBQSxxQkFBVUEsSUFBSSxDQUFDL0IsS0FBZjtBQUFBLGFBQTNCO0FBQXhCLFdBQUQsQ0FBSDtBQUNELFNBbEVILEVBbUVHL0osS0FuRUgsQ0FtRVNSLEdBbkVUO0FBb0VELE9BaEZNLENBQVA7QUFpRkQ7O0FBdHBCNkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzLCBQYXJzZWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XHJcbmltcG9ydCB7IEFkZGl0aW9uYWxJbmZvLCBBZGRpdGlvbmFsSW5mb0l0ZW0sIENsYXNzU2NoZWR1bGVJbmZvLCBTY2hvb2xJbmZvLCBTdHVkZW50SW5mbyB9IGZyb20gJy4vQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBTdHVkZW50SW5mb1hNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU3R1ZGVudEluZm8nO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuLi9NZXNzYWdlL01lc3NhZ2UnO1xyXG5pbXBvcnQgeyBNZXNzYWdlWE1MT2JqZWN0IH0gZnJvbSAnLi4vTWVzc2FnZS9NZXNzYWdlLnhtbCc7XHJcbmltcG9ydCB7IEFzc2lnbm1lbnRFdmVudFhNTE9iamVjdCwgQ2FsZW5kYXJYTUxPYmplY3QsIFJlZ3VsYXJFdmVudFhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvQ2FsZW5kYXInO1xyXG5pbXBvcnQgeyBBc3NpZ25tZW50RXZlbnQsIENhbGVuZGFyLCBDYWxlbmRhck9wdGlvbnMsIEV2ZW50LCBIb2xpZGF5RXZlbnQsIFJlZ3VsYXJFdmVudCB9IGZyb20gJy4vSW50ZXJmYWNlcy9DYWxlbmRhcic7XHJcbmltcG9ydCB7IGVhY2hNb250aE9mSW50ZXJ2YWwsIHBhcnNlIH0gZnJvbSAnZGF0ZS1mbnMnO1xyXG5pbXBvcnQgeyBGaWxlUmVzb3VyY2VYTUxPYmplY3QsIEdyYWRlYm9va1hNTE9iamVjdCwgVVJMUmVzb3VyY2VYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0dyYWRlYm9vayc7XHJcbmltcG9ydCB7IEF0dGVuZGFuY2VYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0F0dGVuZGFuY2UnO1xyXG5pbXBvcnQgRXZlbnRUeXBlIGZyb20gJy4uLy4uL0NvbnN0YW50cy9FdmVudFR5cGUnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBBc3NpZ25tZW50LCBGaWxlUmVzb3VyY2UsIEdyYWRlYm9vaywgTWFyaywgVVJMUmVzb3VyY2UsIFdlaWdodGVkQ2F0ZWdvcnkgfSBmcm9tICcuL0ludGVyZmFjZXMvR3JhZGVib29rJztcclxuaW1wb3J0IGFzeW5jUG9vbCBmcm9tICd0aW55LWFzeW5jLXBvb2wnO1xyXG5pbXBvcnQgUmVzb3VyY2VUeXBlIGZyb20gJy4uLy4uL0NvbnN0YW50cy9SZXNvdXJjZVR5cGUnO1xyXG5pbXBvcnQgeyBBYnNlbnRQZXJpb2QsIEF0dGVuZGFuY2UsIFBlcmlvZEluZm8gfSBmcm9tICcuL0ludGVyZmFjZXMvQXR0ZW5kYW5jZSc7XHJcbmltcG9ydCB7IFNjaGVkdWxlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9TY2hlZHVsZSc7XHJcbmltcG9ydCB7IFNjaGVkdWxlIH0gZnJvbSAnLi9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFNjaG9vbEluZm9YTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1NjaG9vbEluZm8nO1xyXG5pbXBvcnQgeyBSZXBvcnRDYXJkc1hNTE9iamVjdCB9IGZyb20gJy4uL1JlcG9ydENhcmQvUmVwb3J0Q2FyZC54bWwnO1xyXG5pbXBvcnQgeyBEb2N1bWVudFhNTE9iamVjdCB9IGZyb20gJy4uL0RvY3VtZW50L0RvY3VtZW50LnhtbCc7XHJcbmltcG9ydCBSZXBvcnRDYXJkIGZyb20gJy4uL1JlcG9ydENhcmQvUmVwb3J0Q2FyZCc7XHJcbmltcG9ydCBEb2N1bWVudCBmcm9tICcuLi9Eb2N1bWVudC9Eb2N1bWVudCc7XHJcbmltcG9ydCBSZXF1ZXN0RXhjZXB0aW9uIGZyb20gJy4uL1JlcXVlc3RFeGNlcHRpb24vUmVxdWVzdEV4Y2VwdGlvbic7XHJcbmltcG9ydCBYTUxGYWN0b3J5IGZyb20gJy4uLy4uL3V0aWxzL1hNTEZhY3RvcnkvWE1MRmFjdG9yeSc7XHJcblxyXG4vKipcclxuICogVGhlIFN0dWRlbnRWVUUgQ2xpZW50IHRvIGFjY2VzcyB0aGUgQVBJXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQgZXh0ZW5kcyBzb2FwLkNsaWVudCB7XHJcbiAgcHJpdmF0ZSBob3N0VXJsOiBzdHJpbmc7XHJcbiAgY29uc3RydWN0b3IoY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsIGhvc3RVcmw6IHN0cmluZykge1xyXG4gICAgc3VwZXIoY3JlZGVudGlhbHMpO1xyXG4gICAgdGhpcy5ob3N0VXJsID0gaG9zdFVybDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFZhbGlkYXRlJ3MgdGhlIHVzZXIncyBjcmVkZW50aWFscy4gSXQgd2lsbCB0aHJvdyBhbiBlcnJvciBpZiBjcmVkZW50aWFscyBhcmUgaW5jb3JyZWN0XHJcbiAgICovXHJcbiAgcHVibGljIHZhbGlkYXRlQ3JlZGVudGlhbHMoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFBhcnNlZFJlcXVlc3RFcnJvcj4oeyBtZXRob2ROYW1lOiAnbG9naW4gdGVzdCcsIHZhbGlkYXRlRXJyb3JzOiBmYWxzZSB9KVxyXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLlJUX0VSUk9SWzBdWydAX0VSUk9SX01FU1NBR0UnXVswXSA9PT0gJ2xvZ2luIHRlc3QgaXMgbm90IGEgdmFsaWQgbWV0aG9kLicpIHJlcygpO1xyXG4gICAgICAgICAgZWxzZSByZWoobmV3IFJlcXVlc3RFeGNlcHRpb24ocmVzcG9uc2UpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBzdHVkZW50J3MgZG9jdW1lbnRzIGZyb20gc3luZXJneSBzZXJ2ZXJzXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8RG9jdW1lbnRbXT59PiBSZXR1cm5zIGEgbGlzdCBvZiBzdHVkZW50IGRvY3VtZW50c1xyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgZG9jdW1lbnRzID0gYXdhaXQgY2xpZW50LmRvY3VtZW50cygpO1xyXG4gICAqIGNvbnN0IGRvY3VtZW50ID0gZG9jdW1lbnRzWzBdO1xyXG4gICAqIGNvbnN0IGZpbGVzID0gYXdhaXQgZG9jdW1lbnQuZ2V0KCk7XHJcbiAgICogY29uc3QgYmFzZTY0Y29sbGVjdGlvbiA9IGZpbGVzLm1hcCgoZmlsZSkgPT4gZmlsZS5iYXNlNjQpO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBkb2N1bWVudHMoKTogUHJvbWlzZTxEb2N1bWVudFtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PERvY3VtZW50WE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnR2V0U3R1ZGVudERvY3VtZW50SW5pdGlhbERhdGEnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKFxyXG4gICAgICAgICAgICB4bWxPYmplY3RbJ1N0dWRlbnREb2N1bWVudHMnXVswXS5TdHVkZW50RG9jdW1lbnREYXRhc1swXS5TdHVkZW50RG9jdW1lbnREYXRhLm1hcChcclxuICAgICAgICAgICAgICAoeG1sKSA9PiBuZXcgRG9jdW1lbnQoeG1sLCBzdXBlci5jcmVkZW50aWFscylcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIGEgbGlzdCBvZiByZXBvcnQgY2FyZHNcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxSZXBvcnRDYXJkW10+fSBSZXR1cm5zIGEgbGlzdCBvZiByZXBvcnQgY2FyZHMgdGhhdCBjYW4gZmV0Y2ggYSBmaWxlXHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCByZXBvcnRDYXJkcyA9IGF3YWl0IGNsaWVudC5yZXBvcnRDYXJkcygpO1xyXG4gICAqIGNvbnN0IGZpbGVzID0gYXdhaXQgUHJvbWlzZS5hbGwocmVwb3J0Q2FyZHMubWFwKChjYXJkKSA9PiBjYXJkLmdldCgpKSk7XHJcbiAgICogY29uc3QgYmFzZTY0YXJyID0gZmlsZXMubWFwKChmaWxlKSA9PiBmaWxlLmJhc2U2NCk7IC8vIFtcIkpWQkVSaTAuLi5cIiwgXCJkVUlvYTEuLi5cIiwgLi4uXTtcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgcmVwb3J0Q2FyZHMoKTogUHJvbWlzZTxSZXBvcnRDYXJkW10+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8UmVwb3J0Q2FyZHNYTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRSZXBvcnRDYXJkSW5pdGlhbERhdGEnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKFxyXG4gICAgICAgICAgICB4bWxPYmplY3QuUkNSZXBvcnRpbmdQZXJpb2REYXRhWzBdLlJDUmVwb3J0aW5nUGVyaW9kc1swXS5SQ1JlcG9ydGluZ1BlcmlvZC5tYXAoXHJcbiAgICAgICAgICAgICAgKHhtbCkgPT4gbmV3IFJlcG9ydENhcmQoeG1sLCBzdXBlci5jcmVkZW50aWFscylcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBzdHVkZW50J3Mgc2Nob29sJ3MgaW5mb3JtYXRpb25cclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTY2hvb2xJbmZvPn0gUmV0dXJucyB0aGUgaW5mb3JtYXRpb24gb2YgdGhlIHN0dWRlbnQncyBzY2hvb2xcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGF3YWl0IGNsaWVudC5zY2hvb2xJbmZvKCk7XHJcbiAgICpcclxuICAgKiBjbGllbnQuc2Nob29sSW5mbygpLnRoZW4oKHNjaG9vbEluZm8pID0+IHtcclxuICAgKiAgY29uc29sZS5sb2coXy51bmlxKHNjaG9vbEluZm8uc3RhZmYubWFwKChzdGFmZikgPT4gc3RhZmYubmFtZSkpKTsgLy8gTGlzdCBhbGwgc3RhZmYgcG9zaXRpb25zIHVzaW5nIGxvZGFzaFxyXG4gICAqIH0pXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIHNjaG9vbEluZm8oKTogUHJvbWlzZTxTY2hvb2xJbmZvPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFNjaG9vbEluZm9YTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50U2Nob29sSW5mbycsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElEOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeyBTdHVkZW50U2Nob29sSW5mb0xpc3Rpbmc6IFt4bWxPYmplY3RdIH0pID0+IHtcclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIHNjaG9vbDoge1xyXG4gICAgICAgICAgICAgIGFkZHJlc3M6IHhtbE9iamVjdFsnQF9TY2hvb2xBZGRyZXNzJ11bMF0sXHJcbiAgICAgICAgICAgICAgYWRkcmVzc0FsdDogeG1sT2JqZWN0WydAX1NjaG9vbEFkZHJlc3MyJ11bMF0sXHJcbiAgICAgICAgICAgICAgY2l0eTogeG1sT2JqZWN0WydAX1NjaG9vbENpdHknXVswXSxcclxuICAgICAgICAgICAgICB6aXBDb2RlOiB4bWxPYmplY3RbJ0BfU2Nob29sWmlwJ11bMF0sXHJcbiAgICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdFsnQF9QaG9uZSddWzBdLFxyXG4gICAgICAgICAgICAgIGFsdFBob25lOiB4bWxPYmplY3RbJ0BfUGhvbmUyJ11bMF0sXHJcbiAgICAgICAgICAgICAgcHJpbmNpcGFsOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0WydAX1ByaW5jaXBhbEVtYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBzdGFmZkd1OiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsR3UnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdGFmZjogeG1sT2JqZWN0LlN0YWZmTGlzdHNbMF0uU3RhZmZMaXN0Lm1hcCgoc3RhZmYpID0+ICh7XHJcbiAgICAgICAgICAgICAgbmFtZTogc3RhZmZbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIGVtYWlsOiBzdGFmZlsnQF9FTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgIHN0YWZmR3U6IHN0YWZmWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICBqb2JUaXRsZTogc3RhZmZbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICBleHRuOiBzdGFmZlsnQF9FeHRuJ11bMF0sXHJcbiAgICAgICAgICAgICAgcGhvbmU6IHN0YWZmWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHNjaGVkdWxlIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRlcm1JbmRleCBUaGUgaW5kZXggb2YgdGhlIHRlcm0uXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8U2NoZWR1bGU+fSBSZXR1cm5zIHRoZSBzY2hlZHVsZSBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogYXdhaXQgc2NoZWR1bGUoMCkgLy8gLT4geyB0ZXJtOiB7IGluZGV4OiAwLCBuYW1lOiAnMXN0IFF0ciBQcm9ncmVzcycgfSwgLi4uIH1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc2NoZWR1bGUodGVybUluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxTY2hlZHVsZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxTY2hlZHVsZVhNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRDbGFzc0xpc3QnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgLi4uKHRlcm1JbmRleCAhPSBudWxsID8geyBUZXJtSW5kZXg6IHRlcm1JbmRleCB9IDoge30pIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICByZXMoe1xyXG4gICAgICAgICAgICB0ZXJtOiB7XHJcbiAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcih4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfVGVybUluZGV4J11bMF0pLFxyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9UZXJtSW5kZXhOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfRXJyb3JNZXNzYWdlJ11bMF0sXHJcbiAgICAgICAgICAgIHRvZGF5OlxyXG4gICAgICAgICAgICAgIHR5cGVvZiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVG9kYXlTY2hlZHVsZUluZm9EYXRhWzBdLlNjaG9vbEluZm9zWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgPyB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVG9kYXlTY2hlZHVsZUluZm9EYXRhWzBdLlNjaG9vbEluZm9zWzBdLlNjaG9vbEluZm8ubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgIChzY2hvb2wpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzY2hvb2xbJ0BfU2Nob29sTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYmVsbFNjaGVkdWxlTmFtZTogc2Nob29sWydAX0JlbGxTY2hlZE5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXM6IHNjaG9vbC5DbGFzc2VzWzBdLkNsYXNzSW5mby5tYXA8Q2xhc3NTY2hlZHVsZUluZm8+KChjb3Vyc2UpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKGNvdXJzZVsnQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGVuZGFuY2VDb2RlOiBjb3Vyc2UuQXR0ZW5kYW5jZUNvZGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoY291cnNlWydAX1N0YXJ0RGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKGNvdXJzZVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfQ2xhc3NOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb25HdTogY291cnNlWydAX1NlY3Rpb25HVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWFjaGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGNvdXJzZVsnQF9UZWFjaGVyRW1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbFN1YmplY3Q6IGNvdXJzZVsnQF9FbWFpbFN1YmplY3QnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfVGVhY2hlck5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBjb3Vyc2VbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY291cnNlWydAX1RlYWNoZXJVUkwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBjb3Vyc2VbJ0BfQ2xhc3NVUkwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBwYXJzZShjb3Vyc2VbJ0BfU3RhcnRUaW1lJ11bMF0sICdoaDptbSBhJywgRGF0ZS5ub3coKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBwYXJzZShjb3Vyc2VbJ0BfRW5kVGltZSddWzBdLCAnaGg6bW0gYScsIERhdGUubm93KCkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgIGNsYXNzZXM6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5DbGFzc0xpc3RzWzBdLkNsYXNzTGlzdGluZy5tYXAoKHN0dWRlbnRDbGFzcykgPT4gKHtcclxuICAgICAgICAgICAgICBuYW1lOiBzdHVkZW50Q2xhc3NbJ0BfQ291cnNlVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihzdHVkZW50Q2xhc3NbJ0BfUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHJvb206IHN0dWRlbnRDbGFzc1snQF9Sb29tTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIHNlY3Rpb25HdTogc3R1ZGVudENsYXNzWydAX1NlY3Rpb25HVSddWzBdLFxyXG4gICAgICAgICAgICAgIHRlYWNoZXI6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IHN0dWRlbnRDbGFzc1snQF9UZWFjaGVyJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogc3R1ZGVudENsYXNzWydAX1RlYWNoZXJFbWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgc3RhZmZHdTogc3R1ZGVudENsYXNzWydAX1RlYWNoZXJTdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgICB0ZXJtczogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLlRlcm1MaXN0c1swXS5UZXJtTGlzdGluZy5tYXAoKHRlcm0pID0+ICh7XHJcbiAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHRlcm1bJ0BfQmVnaW5EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZSh0ZXJtWydAX0VuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBpbmRleDogTnVtYmVyKHRlcm1bJ0BfVGVybUluZGV4J11bMF0pLFxyXG4gICAgICAgICAgICAgIG5hbWU6IHRlcm1bJ0BfVGVybU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICBzY2hvb2xZZWFyVGVybUNvZGVHdTogdGVybVsnQF9TY2hvb2xZZWFyVHJtQ29kZUdVJ11bMF0sXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGF0dGVuZGFuY2Ugb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBdHRlbmRhbmNlPn0gUmV0dXJucyBhbiBBdHRlbmRhbmNlIG9iamVjdFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY2xpZW50LmF0dGVuZGFuY2UoKVxyXG4gICAqICAudGhlbihjb25zb2xlLmxvZyk7IC8vIC0+IHsgdHlwZTogJ1BlcmlvZCcsIHBlcmlvZDogey4uLn0sIHNjaG9vbE5hbWU6ICdVbml2ZXJzaXR5IEhpZ2ggU2Nob29sJywgYWJzZW5jZXM6IFsuLi5dLCBwZXJpb2RJbmZvczogWy4uLl0gfVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBhdHRlbmRhbmNlKCk6IFByb21pc2U8QXR0ZW5kYW5jZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxBdHRlbmRhbmNlWE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnQXR0ZW5kYW5jZScsXHJcbiAgICAgICAgICBwYXJhbVN0cjoge1xyXG4gICAgICAgICAgICBjaGlsZEludElkOiAwLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKChhdHRlbmRhbmNlWE1MT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB4bWxPYmplY3QgPSBhdHRlbmRhbmNlWE1MT2JqZWN0LkF0dGVuZGFuY2VbMF07XHJcblxyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgdHlwZTogeG1sT2JqZWN0WydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgcGVyaW9kOiB7XHJcbiAgICAgICAgICAgICAgdG90YWw6IE51bWJlcih4bWxPYmplY3RbJ0BfUGVyaW9kQ291bnQnXVswXSksXHJcbiAgICAgICAgICAgICAgc3RhcnQ6IE51bWJlcih4bWxPYmplY3RbJ0BfU3RhcnRQZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgZW5kOiBOdW1iZXIoeG1sT2JqZWN0WydAX0VuZFBlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2Nob29sTmFtZTogeG1sT2JqZWN0WydAX1NjaG9vbE5hbWUnXVswXSxcclxuICAgICAgICAgICAgYWJzZW5jZXM6IHhtbE9iamVjdC5BYnNlbmNlc1swXS5BYnNlbmNlLm1hcCgoYWJzZW5jZSkgPT4gKHtcclxuICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShhYnNlbmNlWydAX0Fic2VuY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHJlYXNvbjogYWJzZW5jZVsnQF9SZWFzb24nXVswXSxcclxuICAgICAgICAgICAgICBub3RlOiBhYnNlbmNlWydAX05vdGUnXVswXSxcclxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYWJzZW5jZVsnQF9Db2RlQWxsRGF5RGVzY3JpcHRpb24nXVswXSxcclxuICAgICAgICAgICAgICBwZXJpb2RzOiBhYnNlbmNlLlBlcmlvZHNbMF0uUGVyaW9kLm1hcChcclxuICAgICAgICAgICAgICAgIChwZXJpb2QpID0+XHJcbiAgICAgICAgICAgICAgICAgICh7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIocGVyaW9kWydAX051bWJlciddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlYXNvbjogcGVyaW9kWydAX1JlYXNvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvdXJzZTogcGVyaW9kWydAX0NvdXJzZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWZmOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfU3RhZmYnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IHBlcmlvZFsnQF9TdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogcGVyaW9kWydAX1N0YWZmRU1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9yZ1llYXJHdTogcGVyaW9kWydAX09yZ1llYXJHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICB9IGFzIEFic2VudFBlcmlvZClcclxuICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICAgIHBlcmlvZEluZm9zOiB4bWxPYmplY3QuVG90YWxBY3Rpdml0aWVzWzBdLlBlcmlvZFRvdGFsLm1hcCgocGQsIGkpID0+ICh7XHJcbiAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIocGRbJ0BfTnVtYmVyJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHRvdGFsOiB7XHJcbiAgICAgICAgICAgICAgICBleGN1c2VkOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsRXhjdXNlZFswXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICAgIHRhcmRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxUYXJkaWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgdW5leGN1c2VkOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVW5leGN1c2VkWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgYWN0aXZpdGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbEFjdGl2aXRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgICB1bmV4Y3VzZWRUYXJkaWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVW5leGN1c2VkVGFyZGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KSkgYXMgUGVyaW9kSW5mb1tdLFxyXG4gICAgICAgICAgfSBhcyBBdHRlbmRhbmNlKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBncmFkZWJvb2sgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcGFyYW0ge251bWJlcn0gcmVwb3J0aW5nUGVyaW9kSW5kZXggVGhlIHRpbWVmcmFtZSB0aGF0IHRoZSBncmFkZWJvb2sgc2hvdWxkIHJldHVyblxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEdyYWRlYm9vaz59IFJldHVybnMgYSBHcmFkZWJvb2sgb2JqZWN0XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBncmFkZWJvb2sgPSBhd2FpdCBjbGllbnQuZ3JhZGVib29rKCk7XHJcbiAgICogY29uc29sZS5sb2coZ3JhZGVib29rKTsgLy8geyBlcnJvcjogJycsIHR5cGU6ICdUcmFkaXRpb25hbCcsIHJlcG9ydGluZ1BlcmlvZDogey4uLn0sIGNvdXJzZXM6IFsuLi5dIH07XHJcbiAgICpcclxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDApIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggMCBhcyBcIjFzdCBRdWFydGVyIFByb2dyZXNzXCJcclxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDcpIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggNyBhcyBcIjR0aCBRdWFydGVyXCJcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgZ3JhZGVib29rKHJlcG9ydGluZ1BlcmlvZEluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxHcmFkZWJvb2s+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8R3JhZGVib29rWE1MT2JqZWN0PihcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgbWV0aG9kTmFtZTogJ0dyYWRlYm9vaycsXHJcbiAgICAgICAgICAgIHBhcmFtU3RyOiB7XHJcbiAgICAgICAgICAgICAgY2hpbGRJbnRJZDogMCxcclxuICAgICAgICAgICAgICAuLi4ocmVwb3J0aW5nUGVyaW9kSW5kZXggIT0gbnVsbCA/IHsgUmVwb3J0UGVyaW9kOiByZXBvcnRpbmdQZXJpb2RJbmRleCB9IDoge30pLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICh4bWwpID0+XHJcbiAgICAgICAgICAgIG5ldyBYTUxGYWN0b3J5KHhtbClcclxuICAgICAgICAgICAgICAuZW5jb2RlQXR0cmlidXRlKCdNZWFzdXJlRGVzY3JpcHRpb24nLCAnSGFzRHJvcEJveCcpXHJcbiAgICAgICAgICAgICAgLmVuY29kZUF0dHJpYnV0ZSgnTWVhc3VyZScsICdUeXBlJylcclxuICAgICAgICAgICAgICAudG9TdHJpbmcoKVxyXG4gICAgICAgIClcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0OiBHcmFkZWJvb2tYTUxPYmplY3QpID0+IHtcclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIGVycm9yOiB4bWxPYmplY3QuR3JhZGVib29rWzBdWydAX0Vycm9yTWVzc2FnZSddWzBdLFxyXG4gICAgICAgICAgICB0eXBlOiB4bWxPYmplY3QuR3JhZGVib29rWzBdWydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgcmVwb3J0aW5nUGVyaW9kOiB7XHJcbiAgICAgICAgICAgICAgY3VycmVudDoge1xyXG4gICAgICAgICAgICAgICAgaW5kZXg6XHJcbiAgICAgICAgICAgICAgICAgIHJlcG9ydGluZ1BlcmlvZEluZGV4ID8/XHJcbiAgICAgICAgICAgICAgICAgIE51bWJlcihcclxuICAgICAgICAgICAgICAgICAgICB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZHNbMF0uUmVwb3J0UGVyaW9kLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAoeCkgPT4geFsnQF9HcmFkZVBlcmlvZCddWzBdID09PSB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9HcmFkZVBlcmlvZCddWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgKT8uWydAX0luZGV4J11bMF1cclxuICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX1N0YXJ0RGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZSh4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0dyYWRlUGVyaW9kJ11bMF0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBhdmFpbGFibGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QubWFwKChwZXJpb2QpID0+ICh7XHJcbiAgICAgICAgICAgICAgICBkYXRlOiB7IHN0YXJ0OiBuZXcgRGF0ZShwZXJpb2RbJ0BfU3RhcnREYXRlJ11bMF0pLCBlbmQ6IG5ldyBEYXRlKHBlcmlvZFsnQF9FbmREYXRlJ11bMF0pIH0sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfR3JhZGVQZXJpb2QnXVswXSxcclxuICAgICAgICAgICAgICAgIGluZGV4OiBOdW1iZXIocGVyaW9kWydAX0luZGV4J11bMF0pLFxyXG4gICAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY291cnNlczogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5Db3Vyc2VzWzBdLkNvdXJzZS5tYXAoKGNvdXJzZSkgPT4gKHtcclxuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihjb3Vyc2VbJ0BfUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiBjb3Vyc2VbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICByb29tOiBjb3Vyc2VbJ0BfUm9vbSddWzBdLFxyXG4gICAgICAgICAgICAgIHN0YWZmOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfU3RhZmYnXVswXSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBjb3Vyc2VbJ0BfU3RhZmZFTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgc3RhZmZHdTogY291cnNlWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIG1hcmtzOiBjb3Vyc2UuTWFya3NbMF0uTWFyay5tYXAoKG1hcmspID0+ICh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBtYXJrWydAX01hcmtOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBjYWxjdWxhdGVkU2NvcmU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RyaW5nOiBtYXJrWydAX0NhbGN1bGF0ZWRTY29yZVN0cmluZyddWzBdLFxyXG4gICAgICAgICAgICAgICAgICByYXc6IE51bWJlcihtYXJrWydAX0NhbGN1bGF0ZWRTY29yZVJhdyddWzBdKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZENhdGVnb3JpZXM6XHJcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiBtYXJrWydHcmFkZUNhbGN1bGF0aW9uU3VtbWFyeSddWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgID8gbWFya1snR3JhZGVDYWxjdWxhdGlvblN1bW1hcnknXVswXS5Bc3NpZ25tZW50R3JhZGVDYWxjLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHdlaWdodGVkKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB3ZWlnaHRlZFsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkTWFyazogd2VpZ2h0ZWRbJ0BfQ2FsY3VsYXRlZE1hcmsnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmFsdWF0ZWQ6IHdlaWdodGVkWydAX1dlaWdodGVkUGN0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkOiB3ZWlnaHRlZFsnQF9XZWlnaHQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDogTnVtYmVyKHdlaWdodGVkWydAX1BvaW50cyddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zc2libGU6IE51bWJlcih3ZWlnaHRlZFsnQF9Qb2ludHNQb3NzaWJsZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBXZWlnaHRlZENhdGVnb3J5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50czpcclxuICAgICAgICAgICAgICAgICAgdHlwZW9mIG1hcmsuQXNzaWdubWVudHNbMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgPyAobWFyay5Bc3NpZ25tZW50c1swXS5Bc3NpZ25tZW50Lm1hcCgoYXNzaWdubWVudCkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhZGVib29rSWQ6IGFzc2lnbm1lbnRbJ0BfR3JhZGVib29rSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYXRvYihhc3NpZ25tZW50WydAX01lYXN1cmUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFzc2lnbm1lbnRbJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBkdWU6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRHVlRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhc3NpZ25tZW50WydAX1Njb3JlVHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBhc3NpZ25tZW50WydAX1Njb3JlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50czogYXNzaWdubWVudFsnQF9Qb2ludHMnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXM6IGFzc2lnbm1lbnRbJ0BfTm90ZXMnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVhY2hlcklkOiBhc3NpZ25tZW50WydAX1RlYWNoZXJJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYXRvYihhc3NpZ25tZW50WydAX01lYXN1cmVEZXNjcmlwdGlvbiddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzRHJvcGJveDogSlNPTi5wYXJzZShhc3NpZ25tZW50WydAX0hhc0Ryb3BCb3gnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0dWRlbnRJZDogYXNzaWdubWVudFsnQF9TdHVkZW50SUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGJveERhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9Ecm9wU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9Ecm9wRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBhc3NpZ25tZW50LlJlc291cmNlc1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdLlJlc291cmNlLm1hcCgocnNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocnNyY1snQF9UeXBlJ11bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ0ZpbGUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVSc3JjID0gcnNyYyBhcyBGaWxlUmVzb3VyY2VYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUmVzb3VyY2VUeXBlLkZJTEUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlsZVJzcmNbJ0BfRmlsZVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVSc3JjWydAX0ZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmk6IHRoaXMuaG9zdFVybCArIGZpbGVSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZmlsZVJzcmNbJ0BfUmVzb3VyY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGZpbGVSc3JjWydAX1Jlc291cmNlSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVSc3JjWydAX1Jlc291cmNlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgRmlsZVJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnVVJMJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmxSc3JjID0gcnNyYyBhcyBVUkxSZXNvdXJjZVhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybFJzcmNbJ0BfVVJMJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUmVzb3VyY2VUeXBlLlVSTCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUodXJsUnNyY1snQF9SZXNvdXJjZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdXJsUnNyY1snQF9SZXNvdXJjZUlEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB1cmxSc3JjWydAX1Jlc291cmNlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVybFJzcmNbJ0BfUmVzb3VyY2VEZXNjcmlwdGlvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogdXJsUnNyY1snQF9TZXJ2ZXJGaWxlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFVSTFJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBUeXBlICR7cnNyY1snQF9UeXBlJ11bMF19IGRvZXMgbm90IGV4aXN0IGFzIGEgdHlwZS4gQWRkIGl0IHRvIHR5cGUgZGVjbGFyYXRpb25zLmBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pIGFzIChGaWxlUmVzb3VyY2UgfCBVUkxSZXNvdXJjZSlbXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KSkgYXMgQXNzaWdubWVudFtdKVxyXG4gICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgfSkpIGFzIE1hcmtbXSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfSBhcyBHcmFkZWJvb2spO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhIGxpc3Qgb2YgbWVzc2FnZXMgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxNZXNzYWdlW10+fSBSZXR1cm5zIGFuIGFycmF5IG9mIG1lc3NhZ2VzIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTsgLy8gLT4gW3sgaWQ6ICdFOTcyRjFCQy05OUEwLTRDRDAtOEQxNS1CMTg5NjhCNDNFMDgnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH0sIHsgaWQ6ICc4NkZEQTExRC00MkM3LTQyNDktQjAwMy05NEIxNUVCMkM4RDQnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH1dXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIG1lc3NhZ2VzKCk6IFByb21pc2U8TWVzc2FnZVtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PE1lc3NhZ2VYTUxPYmplY3Q+KFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBtZXRob2ROYW1lOiAnR2V0UFhQTWVzc2FnZXMnLFxyXG4gICAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKHhtbCkgPT4gbmV3IFhNTEZhY3RvcnkoeG1sKS5lbmNvZGVBdHRyaWJ1dGUoJ0NvbnRlbnQnLCAnUmVhZCcpLnRvU3RyaW5nKClcclxuICAgICAgICApXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKFxyXG4gICAgICAgICAgICB4bWxPYmplY3QuUFhQTWVzc2FnZXNEYXRhWzBdLk1lc3NhZ2VMaXN0aW5nc1swXS5NZXNzYWdlTGlzdGluZy5tYXAoXHJcbiAgICAgICAgICAgICAgKG1lc3NhZ2UpID0+IG5ldyBNZXNzYWdlKG1lc3NhZ2UsIHN1cGVyLmNyZWRlbnRpYWxzLCB0aGlzLmhvc3RVcmwpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgaW5mbyBvZiBhIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTdHVkZW50SW5mbz59IFN0dWRlbnRJbmZvIG9iamVjdFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogc3R1ZGVudEluZm8oKS50aGVuKGNvbnNvbGUubG9nKSAvLyAtPiB7IHN0dWRlbnQ6IHsgbmFtZTogJ0V2YW4gRGF2aXMnLCBuaWNrbmFtZTogJycsIGxhc3ROYW1lOiAnRGF2aXMnIH0sIC4uLn1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc3R1ZGVudEluZm8oKTogUHJvbWlzZTxTdHVkZW50SW5mbz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFN0dWRlbnRJbmZvPigocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8U3R1ZGVudEluZm9YTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50SW5mbycsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0RGF0YSkgPT4ge1xyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgc3R1ZGVudDoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRm9ybWF0dGVkTmFtZVswXSxcclxuICAgICAgICAgICAgICBsYXN0TmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkxhc3ROYW1lR29lc0J5WzBdLFxyXG4gICAgICAgICAgICAgIG5pY2tuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uTmlja05hbWVbMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkJpcnRoRGF0ZVswXSksXHJcbiAgICAgICAgICAgIHRyYWNrOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uVHJhY2tbMF0sXHJcbiAgICAgICAgICAgIGFkZHJlc3M6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5iclswXSxcclxuICAgICAgICAgICAgcGhvdG86IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaG90b1swXSxcclxuICAgICAgICAgICAgY291bnNlbG9yOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvck5hbWVbMF0sXHJcbiAgICAgICAgICAgICAgZW1haWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Db3Vuc2Vsb3JFbWFpbFswXSxcclxuICAgICAgICAgICAgICBzdGFmZkd1OiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ291bnNlbG9yU3RhZmZHVVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3VycmVudFNjaG9vbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkN1cnJlbnRTY2hvb2xbMF0sXHJcbiAgICAgICAgICAgIGRlbnRpc3Q6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uRGVudGlzdFswXVsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5EZW50aXN0WzBdWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfRXh0biddWzBdLFxyXG4gICAgICAgICAgICAgIG9mZmljZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfT2ZmaWNlJ11bMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBoeXNpY2lhbjoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5bMF1bJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIHBob25lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGh5c2ljaWFuWzBdWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9FeHRuJ11bMF0sXHJcbiAgICAgICAgICAgICAgaG9zcGl0YWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5bMF1bJ0BfSG9zcGl0YWwnXVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaWQ6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uUGVybUlEWzBdLFxyXG4gICAgICAgICAgICBvcmdZZWFyR3U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5PcmdZZWFyR1VbMF0sXHJcbiAgICAgICAgICAgIHBob25lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGhvbmVbMF0sXHJcbiAgICAgICAgICAgIGVtYWlsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uRU1haWxbMF0sXHJcbiAgICAgICAgICAgIGVtZXJnZW5jeUNvbnRhY3RzOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uRW1lcmdlbmN5Q29udGFjdHNbMF0uRW1lcmdlbmN5Q29udGFjdC5tYXAoXHJcbiAgICAgICAgICAgICAgKGNvbnRhY3QpID0+ICh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBjb250YWN0WydAX05hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICAgICAgICAgIGhvbWU6IGNvbnRhY3RbJ0BfSG9tZVBob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIG1vYmlsZTogY29udGFjdFsnQF9Nb2JpbGVQaG9uZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBvdGhlcjogY29udGFjdFsnQF9PdGhlclBob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHdvcms6IGNvbnRhY3RbJ0BfV29ya1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwOiBjb250YWN0WydAX1JlbGF0aW9uc2hpcCddWzBdLFxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIGdlbmRlcjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HZW5kZXJbMF0sXHJcbiAgICAgICAgICAgIGdyYWRlOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkdyYWRlWzBdLFxyXG4gICAgICAgICAgICBsb2NrZXJJbmZvUmVjb3JkczogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Mb2NrZXJJbmZvUmVjb3Jkc1swXSxcclxuICAgICAgICAgICAgaG9tZUxhbmd1YWdlOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZUxhbmd1YWdlWzBdLFxyXG4gICAgICAgICAgICBob21lUm9vbTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tWzBdLFxyXG4gICAgICAgICAgICBob21lUm9vbVRlYWNoZXI6IHtcclxuICAgICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoRU1haWxbMF0sXHJcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoWzBdLFxyXG4gICAgICAgICAgICAgIHN0YWZmR3U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lUm9vbVRjaFN0YWZmR1VbMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxJbmZvOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uVXNlckRlZmluZWRHcm91cEJveGVzWzBdLlVzZXJEZWZpbmVkR3JvdXBCb3gubWFwKFxyXG4gICAgICAgICAgICAgIChkZWZpbmVkQm94KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGRlZmluZWRCb3hbJ0BfR3JvdXBCb3hJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogZGVmaW5lZEJveFsnQF9Hcm91cEJveExhYmVsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB2Y0lkOiBkZWZpbmVkQm94WydAX1ZDSUQnXVswXSxcclxuICAgICAgICAgICAgICAgIGl0ZW1zOiBkZWZpbmVkQm94LlVzZXJEZWZpbmVkSXRlbXNbMF0uVXNlckRlZmluZWRJdGVtLm1hcCgoaXRlbSkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgc291cmNlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogaXRlbVsnQF9Tb3VyY2VFbGVtZW50J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBpdGVtWydAX1NvdXJjZU9iamVjdCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICB2Y0lkOiBpdGVtWydAX1ZDSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1bJ0BfVmFsdWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgdHlwZTogaXRlbVsnQF9JdGVtVHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgfSkpIGFzIEFkZGl0aW9uYWxJbmZvSXRlbVtdLFxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICkgYXMgQWRkaXRpb25hbEluZm9bXSxcclxuICAgICAgICAgIH0gYXMgU3R1ZGVudEluZm8pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlOiBEYXRlKSB7XHJcbiAgICByZXR1cm4gc3VwZXIucHJvY2Vzc1JlcXVlc3Q8Q2FsZW5kYXJYTUxPYmplY3Q+KHtcclxuICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRDYWxlbmRhcicsXHJcbiAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIFJlcXVlc3REYXRlOiBkYXRlLnRvSVNPU3RyaW5nKCkgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0NhbGVuZGFyT3B0aW9uc30gb3B0aW9ucyBPcHRpb25zIHRvIHByb3ZpZGUgZm9yIGNhbGVuZGFyIG1ldGhvZC4gQW4gaW50ZXJ2YWwgaXMgcmVxdWlyZWQuXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8Q2FsZW5kYXI+fSBSZXR1cm5zIGEgQ2FsZW5kYXIgb2JqZWN0XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjbGllbnQuY2FsZW5kYXIoeyBpbnRlcnZhbDogeyBzdGFydDogbmV3IERhdGUoJzUvMS8yMDIyJyksIGVuZDogbmV3IERhdGUoJzgvMS8yMDIxJykgfSwgY29uY3VycmVuY3k6IG51bGwgfSk7IC8vIC0+IExpbWl0bGVzcyBjb25jdXJyZW5jeSAobm90IHJlY29tbWVuZGVkKVxyXG4gICAqXHJcbiAgICogY29uc3QgY2FsZW5kYXIgPSBhd2FpdCBjbGllbnQuY2FsZW5kYXIoeyBpbnRlcnZhbDogeyAuLi4gfX0pO1xyXG4gICAqIGNvbnNvbGUubG9nKGNhbGVuZGFyKTsgLy8gLT4geyBzY2hvb2xEYXRlOiB7Li4ufSwgb3V0cHV0UmFuZ2U6IHsuLi59LCBldmVudHM6IFsuLi5dIH1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgY2FsZW5kYXIob3B0aW9uczogQ2FsZW5kYXJPcHRpb25zKTogUHJvbWlzZTxDYWxlbmRhcj4ge1xyXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyA9IHtcclxuICAgICAgY29uY3VycmVuY3k6IDcsXHJcbiAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBjb25zdCBzY2hvb2xTdGFydERhdGU6IERhdGUgfCBudW1iZXIgPSBvcHRpb25zLmludGVydmFsLnN0YXJ0O1xyXG4gICAgICBjb25zdCBzY2hvb2xFbmREYXRlOiBEYXRlIHwgbnVtYmVyID0gb3B0aW9ucy5pbnRlcnZhbC5lbmQ7XHJcblxyXG4gICAgICBjb25zdCBtb250aHNXaXRoaW5TY2hvb2xZZWFyID0gZWFjaE1vbnRoT2ZJbnRlcnZhbCh7IHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsIGVuZDogc2Nob29sRW5kRGF0ZSB9KTtcclxuICAgICAgY29uc3QgZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhciA9ICgpOiBQcm9taXNlPENhbGVuZGFyWE1MT2JqZWN0W10+ID0+XHJcbiAgICAgICAgZGVmYXVsdE9wdGlvbnMuY29uY3VycmVuY3kgPT0gbnVsbFxyXG4gICAgICAgICAgPyBQcm9taXNlLmFsbChtb250aHNXaXRoaW5TY2hvb2xZZWFyLm1hcCgoZGF0ZSkgPT4gdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpKSlcclxuICAgICAgICAgIDogYXN5bmNQb29sKGRlZmF1bHRPcHRpb25zLmNvbmN1cnJlbmN5LCBtb250aHNXaXRoaW5TY2hvb2xZZWFyLCAoZGF0ZSkgPT5cclxuICAgICAgICAgICAgICB0aGlzLmZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwoZGF0ZSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgbGV0IG1lbW86IENhbGVuZGFyIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgIGdldEFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIoKVxyXG4gICAgICAgIC50aGVuKChldmVudHMpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGFsbEV2ZW50cyA9IGV2ZW50cy5yZWR1Y2UoKHByZXYsIGV2ZW50cykgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWVtbyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgIG1lbW8gPSB7XHJcbiAgICAgICAgICAgICAgICBzY2hvb2xEYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXVsnQF9TY2hvb2xFbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG91dHB1dFJhbmdlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsXHJcbiAgICAgICAgICAgICAgICAgIGVuZDogc2Nob29sRW5kRGF0ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBldmVudHM6IFtdLFxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3Q6IENhbGVuZGFyID0ge1xyXG4gICAgICAgICAgICAgIC4uLm1lbW8sIC8vIFRoaXMgaXMgdG8gcHJldmVudCByZS1pbml0aWFsaXppbmcgRGF0ZSBvYmplY3RzIGluIG9yZGVyIHRvIGltcHJvdmUgcGVyZm9ybWFuY2VcclxuICAgICAgICAgICAgICBldmVudHM6IFtcclxuICAgICAgICAgICAgICAgIC4uLihwcmV2LmV2ZW50cyA/IHByZXYuZXZlbnRzIDogW10pLFxyXG4gICAgICAgICAgICAgICAgLi4uKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF0uRXZlbnRMaXN0c1swXS5FdmVudExpc3QubWFwKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50WydAX0RheVR5cGUnXVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLkFTU0lHTk1FTlQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzc2lnbm1lbnRFdmVudCA9IGV2ZW50IGFzIEFzc2lnbm1lbnRFdmVudFhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBhc3NpZ25tZW50RXZlbnRbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkTGlua0RhdGE6IGFzc2lnbm1lbnRFdmVudFsnQF9BZGRMaW5rRGF0YSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZ3U6IGFzc2lnbm1lbnRFdmVudFsnQF9BR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoYXNzaWdubWVudEV2ZW50WydAX0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRndTogYXNzaWdubWVudEV2ZW50WydAX0RHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBhc3NpZ25tZW50RXZlbnRbJ0BfTGluayddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IGFzc2lnbm1lbnRFdmVudFsnQF9TdGFydFRpbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLkFTU0lHTk1FTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdUeXBlOiBhc3NpZ25tZW50RXZlbnRbJ0BfVmlld1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIH0gYXMgQXNzaWdubWVudEV2ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5IT0xJREFZOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZXZlbnRbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLkhPTElEQVksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogZXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGV2ZW50WydAX0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICB9IGFzIEhvbGlkYXlFdmVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuUkVHVUxBUjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVndWxhckV2ZW50ID0gZXZlbnQgYXMgUmVndWxhckV2ZW50WE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHJlZ3VsYXJFdmVudFsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZ3U6IHJlZ3VsYXJFdmVudFsnQF9BR1UnXSA/IHJlZ3VsYXJFdmVudFsnQF9BR1UnXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUocmVndWxhckV2ZW50WydAX0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiByZWd1bGFyRXZlbnRbJ0BfRXZ0RGVzY3JpcHRpb24nXSA/IHJlZ3VsYXJFdmVudFsnQF9FdnREZXNjcmlwdGlvbiddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZ3U6IHJlZ3VsYXJFdmVudFsnQF9ER1UnXSA/IHJlZ3VsYXJFdmVudFsnQF9ER1UnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluazogcmVndWxhckV2ZW50WydAX0xpbmsnXSA/IHJlZ3VsYXJFdmVudFsnQF9MaW5rJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogcmVndWxhckV2ZW50WydAX1N0YXJ0VGltZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuUkVHVUxBUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlld1R5cGU6IHJlZ3VsYXJFdmVudFsnQF9WaWV3VHlwZSddID8gcmVndWxhckV2ZW50WydAX1ZpZXdUeXBlJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZExpbmtEYXRhOiByZWd1bGFyRXZlbnRbJ0BfQWRkTGlua0RhdGEnXSA/IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgfSBhcyBSZWd1bGFyRXZlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSBhcyBFdmVudFtdKSxcclxuICAgICAgICAgICAgICBdIGFzIEV2ZW50W10sXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcclxuICAgICAgICAgIH0sIHt9IGFzIENhbGVuZGFyKTtcclxuICAgICAgICAgIHJlcyh7IC4uLmFsbEV2ZW50cywgZXZlbnRzOiBfLnVuaXFCeShhbGxFdmVudHMuZXZlbnRzLCAoaXRlbSkgPT4gaXRlbS50aXRsZSkgfSBhcyBDYWxlbmRhcik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=