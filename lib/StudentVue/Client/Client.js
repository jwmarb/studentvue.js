(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/soap/soap", "../Message/Message", "date-fns", "../../Constants/EventType", "lodash", "tiny-async-pool", "../../Constants/ResourceType", "../ReportCard/ReportCard", "../Document/Document", "../RequestException/RequestException", "../../utils/XMLFactory/XMLFactory", "../../utils/isBase64"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/soap/soap"), require("../Message/Message"), require("date-fns"), require("../../Constants/EventType"), require("lodash"), require("tiny-async-pool"), require("../../Constants/ResourceType"), require("../ReportCard/ReportCard"), require("../Document/Document"), require("../RequestException/RequestException"), require("../../utils/XMLFactory/XMLFactory"), require("../../utils/isBase64"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.soap, global.Message, global.dateFns, global.EventType, global.lodash, global.tinyAsyncPool, global.ResourceType, global.ReportCard, global.Document, global.RequestException, global.XMLFactory, global.isBase64);
    global.Client = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _soap, _Message, _dateFns, _EventType, _lodash, _tinyAsyncPool, _ResourceType, _ReportCard, _Document, _RequestException, _XMLFactory, _isBase) {
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
  _isBase = _interopRequireDefault(_isBase);

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
                    name: decodeURIComponent(escape(atob(assignment['@_Measure'][0]))),
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
                    description: decodeURIComponent(escape(atob(assignment['@_MeasureDescription'][0]))),
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
      }, xml => {
        return new _XMLFactory.default(xml).encodeAttribute('Title', 'Icon').toString();
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


    calendar(options = {}) {
      const defaultOptions = {
        concurrency: 7,
        ...options
      };
      return new Promise((res, rej) => {
        let schoolStartDate = Date.now();
        let schoolEndDate = Date.now();

        if (options.interval == null || options.interval && (options.interval.start == null || options.interval.end == null)) {
          this.fetchEventsWithinInterval(new Date()).then(cal => {
            schoolStartDate = options.interval?.start ?? new Date(cal.CalendarListing[0]['@_SchoolBegDate'][0]);
            schoolEndDate = options.interval?.end ?? new Date(cal.CalendarListing[0]['@_SchoolEndDate'][0]);
          });
        }

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

            const rest = { ...memo,
              // This is to prevent re-initializing Date objects in order to improve performance
              events: [...(prev.events ? prev.events : []), ...(typeof events.CalendarListing[0].EventLists[0] !== 'string' ? events.CalendarListing[0].EventLists[0].EventList.map(event => {
                switch (event['@_DayType'][0]) {
                  case _EventType.default.ASSIGNMENT:
                    {
                      const assignmentEvent = event;
                      return {
                        title: (0, _isBase.default)(assignmentEvent['@_Title'][0]) ? decodeURIComponent(escape(atob(assignmentEvent['@_Title'][0]))) : assignmentEvent['@_Title'][0],
                        addLinkData: assignmentEvent['@_AddLinkData'][0],
                        agu: assignmentEvent['@_AGU'] ? assignmentEvent['@_AGU'][0] : undefined,
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
                        title: (0, _isBase.default)(event['@_Title'][0]) ? decodeURIComponent(escape(atob(event['@_Title'][0]))) : event['@_Title'][0],
                        type: _EventType.default.HOLIDAY,
                        startTime: event['@_StartTime'][0],
                        date: new Date(event['@_Date'][0])
                      };
                    }

                  case _EventType.default.REGULAR:
                    {
                      const regularEvent = event;
                      return {
                        title: (0, _isBase.default)(regularEvent['@_Title'][0]) ? decodeURIComponent(escape(atob(regularEvent['@_Title'][0]))) : regularEvent['@_Title'][0],
                        agu: regularEvent['@_AGU'] ? regularEvent['@_AGU'][0] : undefined,
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
              }) : [])]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50Iiwic29hcCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwidmFsaWRhdGVDcmVkZW50aWFscyIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJwcm9jZXNzUmVxdWVzdCIsIm1ldGhvZE5hbWUiLCJ2YWxpZGF0ZUVycm9ycyIsInRoZW4iLCJyZXNwb25zZSIsIlJUX0VSUk9SIiwiUmVxdWVzdEV4Y2VwdGlvbiIsImNhdGNoIiwiZG9jdW1lbnRzIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwieG1sT2JqZWN0IiwiU3R1ZGVudERvY3VtZW50RGF0YXMiLCJTdHVkZW50RG9jdW1lbnREYXRhIiwieG1sIiwiRG9jdW1lbnQiLCJyZXBvcnRDYXJkcyIsIlJDUmVwb3J0aW5nUGVyaW9kRGF0YSIsIlJDUmVwb3J0aW5nUGVyaW9kcyIsIlJDUmVwb3J0aW5nUGVyaW9kIiwiUmVwb3J0Q2FyZCIsInNjaG9vbEluZm8iLCJjaGlsZEludElEIiwiU3R1ZGVudFNjaG9vbEluZm9MaXN0aW5nIiwiU3RhZmZMaXN0cyIsIlN0YWZmTGlzdCIsInN0YWZmIiwibmFtZSIsImVtYWlsIiwic3RhZmZHdSIsImpvYlRpdGxlIiwiZXh0biIsInBob25lIiwic2Nob29sIiwiYWRkcmVzcyIsImFkZHJlc3NBbHQiLCJjaXR5IiwiemlwQ29kZSIsImFsdFBob25lIiwicHJpbmNpcGFsIiwic2NoZWR1bGUiLCJ0ZXJtSW5kZXgiLCJUZXJtSW5kZXgiLCJTdHVkZW50Q2xhc3NTY2hlZHVsZSIsIkNsYXNzTGlzdHMiLCJDbGFzc0xpc3RpbmciLCJzdHVkZW50Q2xhc3MiLCJwZXJpb2QiLCJOdW1iZXIiLCJyb29tIiwic2VjdGlvbkd1IiwidGVhY2hlciIsIlRlcm1MaXN0cyIsIlRlcm1MaXN0aW5nIiwidGVybSIsImRhdGUiLCJzdGFydCIsIkRhdGUiLCJlbmQiLCJpbmRleCIsInNjaG9vbFllYXJUZXJtQ29kZUd1IiwiZXJyb3IiLCJ0b2RheSIsIlRvZGF5U2NoZWR1bGVJbmZvRGF0YSIsIlNjaG9vbEluZm9zIiwiU2Nob29sSW5mbyIsIm1hcCIsImJlbGxTY2hlZHVsZU5hbWUiLCJjbGFzc2VzIiwiQ2xhc3NlcyIsIkNsYXNzSW5mbyIsImNvdXJzZSIsImF0dGVuZGFuY2VDb2RlIiwiQXR0ZW5kYW5jZUNvZGUiLCJlbWFpbFN1YmplY3QiLCJ1cmwiLCJ0aW1lIiwibm93IiwidGVybXMiLCJhdHRlbmRhbmNlIiwiYXR0ZW5kYW5jZVhNTE9iamVjdCIsIkF0dGVuZGFuY2UiLCJBYnNlbmNlcyIsIkFic2VuY2UiLCJhYnNlbmNlIiwiUGVyaW9kcyIsIlBlcmlvZCIsInJlYXNvbiIsIm9yZ1llYXJHdSIsIm5vdGUiLCJkZXNjcmlwdGlvbiIsInBlcmlvZHMiLCJUb3RhbEFjdGl2aXRpZXMiLCJQZXJpb2RUb3RhbCIsInBkIiwiaSIsInRvdGFsIiwiZXhjdXNlZCIsIlRvdGFsRXhjdXNlZCIsInRhcmRpZXMiLCJUb3RhbFRhcmRpZXMiLCJ1bmV4Y3VzZWQiLCJUb3RhbFVuZXhjdXNlZCIsImFjdGl2aXRpZXMiLCJ1bmV4Y3VzZWRUYXJkaWVzIiwiVG90YWxVbmV4Y3VzZWRUYXJkaWVzIiwidHlwZSIsInNjaG9vbE5hbWUiLCJhYnNlbmNlcyIsInBlcmlvZEluZm9zIiwiZ3JhZGVib29rIiwicmVwb3J0aW5nUGVyaW9kSW5kZXgiLCJSZXBvcnRQZXJpb2QiLCJYTUxGYWN0b3J5IiwiZW5jb2RlQXR0cmlidXRlIiwidG9TdHJpbmciLCJHcmFkZWJvb2siLCJSZXBvcnRpbmdQZXJpb2RzIiwiQ291cnNlcyIsIkNvdXJzZSIsIk1hcmtzIiwiTWFyayIsIm1hcmsiLCJjYWxjdWxhdGVkU2NvcmUiLCJzdHJpbmciLCJyYXciLCJ3ZWlnaHRlZENhdGVnb3JpZXMiLCJBc3NpZ25tZW50R3JhZGVDYWxjIiwid2VpZ2h0ZWQiLCJjYWxjdWxhdGVkTWFyayIsIndlaWdodCIsImV2YWx1YXRlZCIsInN0YW5kYXJkIiwicG9pbnRzIiwiY3VycmVudCIsInBvc3NpYmxlIiwiYXNzaWdubWVudHMiLCJBc3NpZ25tZW50cyIsIkFzc2lnbm1lbnQiLCJhc3NpZ25tZW50IiwiZ3JhZGVib29rSWQiLCJkZWNvZGVVUklDb21wb25lbnQiLCJlc2NhcGUiLCJhdG9iIiwiZHVlIiwic2NvcmUiLCJ2YWx1ZSIsIm5vdGVzIiwidGVhY2hlcklkIiwiaGFzRHJvcGJveCIsIkpTT04iLCJwYXJzZSIsInN0dWRlbnRJZCIsImRyb3Bib3hEYXRlIiwicmVzb3VyY2VzIiwiUmVzb3VyY2VzIiwiUmVzb3VyY2UiLCJyc3JjIiwiZmlsZVJzcmMiLCJSZXNvdXJjZVR5cGUiLCJGSUxFIiwiZmlsZSIsInVyaSIsInJlc291cmNlIiwiaWQiLCJ1cmxSc3JjIiwiVVJMIiwicGF0aCIsInRpdGxlIiwibWFya3MiLCJyZXBvcnRpbmdQZXJpb2QiLCJmaW5kIiwieCIsIlJlcG9ydGluZ1BlcmlvZCIsImF2YWlsYWJsZSIsImNvdXJzZXMiLCJtZXNzYWdlcyIsIlBYUE1lc3NhZ2VzRGF0YSIsIk1lc3NhZ2VMaXN0aW5ncyIsIk1lc3NhZ2VMaXN0aW5nIiwibWVzc2FnZSIsIk1lc3NhZ2UiLCJzdHVkZW50SW5mbyIsInhtbE9iamVjdERhdGEiLCJTdHVkZW50SW5mbyIsIkFkZHJlc3MiLCJFbWVyZ2VuY3lDb250YWN0cyIsIkVtZXJnZW5jeUNvbnRhY3QiLCJjb250YWN0IiwiaG9tZSIsIm1vYmlsZSIsIm90aGVyIiwid29yayIsInJlbGF0aW9uc2hpcCIsIlVzZXJEZWZpbmVkR3JvdXBCb3hlcyIsIlVzZXJEZWZpbmVkR3JvdXBCb3giLCJkZWZpbmVkQm94IiwiVXNlckRlZmluZWRJdGVtcyIsIlVzZXJEZWZpbmVkSXRlbSIsIml0ZW0iLCJzb3VyY2UiLCJlbGVtZW50Iiwib2JqZWN0IiwidmNJZCIsIml0ZW1zIiwic3R1ZGVudCIsIkZvcm1hdHRlZE5hbWUiLCJsYXN0TmFtZSIsIkxhc3ROYW1lR29lc0J5Iiwibmlja25hbWUiLCJOaWNrTmFtZSIsImJpcnRoRGF0ZSIsIkJpcnRoRGF0ZSIsInRyYWNrIiwiVHJhY2siLCJiciIsInBob3RvIiwiUGhvdG8iLCJjb3Vuc2Vsb3IiLCJDb3Vuc2Vsb3JOYW1lIiwiQ291bnNlbG9yRW1haWwiLCJDb3Vuc2Vsb3JTdGFmZkdVIiwiY3VycmVudFNjaG9vbCIsIkN1cnJlbnRTY2hvb2wiLCJkZW50aXN0IiwiRGVudGlzdCIsIm9mZmljZSIsInBoeXNpY2lhbiIsIlBoeXNpY2lhbiIsImhvc3BpdGFsIiwiUGVybUlEIiwiT3JnWWVhckdVIiwiUGhvbmUiLCJFTWFpbCIsImVtZXJnZW5jeUNvbnRhY3RzIiwiZ2VuZGVyIiwiR2VuZGVyIiwiZ3JhZGUiLCJHcmFkZSIsImxvY2tlckluZm9SZWNvcmRzIiwiTG9ja2VySW5mb1JlY29yZHMiLCJob21lTGFuZ3VhZ2UiLCJIb21lTGFuZ3VhZ2UiLCJob21lUm9vbSIsIkhvbWVSb29tIiwiaG9tZVJvb21UZWFjaGVyIiwiSG9tZVJvb21UY2hFTWFpbCIsIkhvbWVSb29tVGNoIiwiSG9tZVJvb21UY2hTdGFmZkdVIiwiYWRkaXRpb25hbEluZm8iLCJmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsIiwiUmVxdWVzdERhdGUiLCJ0b0lTT1N0cmluZyIsImNhbGVuZGFyIiwib3B0aW9ucyIsImRlZmF1bHRPcHRpb25zIiwiY29uY3VycmVuY3kiLCJzY2hvb2xTdGFydERhdGUiLCJzY2hvb2xFbmREYXRlIiwiaW50ZXJ2YWwiLCJjYWwiLCJDYWxlbmRhckxpc3RpbmciLCJtb250aHNXaXRoaW5TY2hvb2xZZWFyIiwiZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhciIsImFsbCIsIm1lbW8iLCJldmVudHMiLCJhbGxFdmVudHMiLCJyZWR1Y2UiLCJwcmV2Iiwic2Nob29sRGF0ZSIsIm91dHB1dFJhbmdlIiwicmVzdCIsIkV2ZW50TGlzdHMiLCJFdmVudExpc3QiLCJldmVudCIsIkV2ZW50VHlwZSIsIkFTU0lHTk1FTlQiLCJhc3NpZ25tZW50RXZlbnQiLCJhZGRMaW5rRGF0YSIsImFndSIsInVuZGVmaW5lZCIsImRndSIsImxpbmsiLCJzdGFydFRpbWUiLCJ2aWV3VHlwZSIsIkhPTElEQVkiLCJSRUdVTEFSIiwicmVndWxhckV2ZW50IiwiXyIsInVuaXFCeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxRQUFNQSxNQUFOLFNBQXFCQyxjQUFLRCxNQUExQixDQUFpQztBQUU5Q0UsSUFBQUEsV0FBVyxDQUFDQyxXQUFELEVBQWdDQyxPQUFoQyxFQUFpRDtBQUMxRCxZQUFNRCxXQUFOO0FBQ0EsV0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7OztBQUNTQyxJQUFBQSxtQkFBbUIsR0FBa0I7QUFDMUMsYUFBTyxJQUFJQyxPQUFKLENBQVksQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEtBQWM7QUFDL0IsY0FDR0MsY0FESCxDQUNzQztBQUFFQyxVQUFBQSxVQUFVLEVBQUUsWUFBZDtBQUE0QkMsVUFBQUEsY0FBYyxFQUFFO0FBQTVDLFNBRHRDLEVBRUdDLElBRkgsQ0FFU0MsUUFBRCxJQUFjO0FBQ2xCLGNBQUlBLFFBQVEsQ0FBQ0MsUUFBVCxDQUFrQixDQUFsQixFQUFxQixpQkFBckIsRUFBd0MsQ0FBeEMsTUFBK0MsbUNBQW5EO0FBQXdGUCxZQUFBQSxHQUFHO0FBQTNGLGlCQUNLQyxHQUFHLENBQUMsSUFBSU8seUJBQUosQ0FBcUJGLFFBQXJCLENBQUQsQ0FBSDtBQUNOLFNBTEgsRUFNR0csS0FOSCxDQU1TUixHQU5UO0FBT0QsT0FSTSxDQUFQO0FBU0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU1MsSUFBQUEsU0FBUyxHQUF3QjtBQUN0QyxhQUFPLElBQUlYLE9BQUosQ0FBWSxDQUFDQyxHQUFELEVBQU1DLEdBQU4sS0FBYztBQUMvQixjQUNHQyxjQURILENBQ3FDO0FB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NkVHakssS0E3RUgsQ0E2RVNSLEdBN0VUO0FBOEVELE9BcEdNLENBQVA7QUFxR0Q7O0FBN3FCNkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzLCBQYXJzZWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XHJcbmltcG9ydCB7IEFkZGl0aW9uYWxJbmZvLCBBZGRpdGlvbmFsSW5mb0l0ZW0sIENsYXNzU2NoZWR1bGVJbmZvLCBTY2hvb2xJbmZvLCBTdHVkZW50SW5mbyB9IGZyb20gJy4vQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBTdHVkZW50SW5mb1hNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU3R1ZGVudEluZm8nO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuLi9NZXNzYWdlL01lc3NhZ2UnO1xyXG5pbXBvcnQgeyBNZXNzYWdlWE1MT2JqZWN0IH0gZnJvbSAnLi4vTWVzc2FnZS9NZXNzYWdlLnhtbCc7XHJcbmltcG9ydCB7IEFzc2lnbm1lbnRFdmVudFhNTE9iamVjdCwgQ2FsZW5kYXJYTUxPYmplY3QsIFJlZ3VsYXJFdmVudFhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvQ2FsZW5kYXInO1xyXG5pbXBvcnQgeyBBc3NpZ25tZW50RXZlbnQsIENhbGVuZGFyLCBDYWxlbmRhck9wdGlvbnMsIEV2ZW50LCBIb2xpZGF5RXZlbnQsIFJlZ3VsYXJFdmVudCB9IGZyb20gJy4vSW50ZXJmYWNlcy9DYWxlbmRhcic7XHJcbmltcG9ydCB7IGVhY2hNb250aE9mSW50ZXJ2YWwsIHBhcnNlIH0gZnJvbSAnZGF0ZS1mbnMnO1xyXG5pbXBvcnQgeyBGaWxlUmVzb3VyY2VYTUxPYmplY3QsIEdyYWRlYm9va1hNTE9iamVjdCwgVVJMUmVzb3VyY2VYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0dyYWRlYm9vayc7XHJcbmltcG9ydCB7IEF0dGVuZGFuY2VYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0F0dGVuZGFuY2UnO1xyXG5pbXBvcnQgRXZlbnRUeXBlIGZyb20gJy4uLy4uL0NvbnN0YW50cy9FdmVudFR5cGUnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBBc3NpZ25tZW50LCBGaWxlUmVzb3VyY2UsIEdyYWRlYm9vaywgTWFyaywgVVJMUmVzb3VyY2UsIFdlaWdodGVkQ2F0ZWdvcnkgfSBmcm9tICcuL0ludGVyZmFjZXMvR3JhZGVib29rJztcclxuaW1wb3J0IGFzeW5jUG9vbCBmcm9tICd0aW55LWFzeW5jLXBvb2wnO1xyXG5pbXBvcnQgUmVzb3VyY2VUeXBlIGZyb20gJy4uLy4uL0NvbnN0YW50cy9SZXNvdXJjZVR5cGUnO1xyXG5pbXBvcnQgeyBBYnNlbnRQZXJpb2QsIEF0dGVuZGFuY2UsIFBlcmlvZEluZm8gfSBmcm9tICcuL0ludGVyZmFjZXMvQXR0ZW5kYW5jZSc7XHJcbmltcG9ydCB7IFNjaGVkdWxlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9TY2hlZHVsZSc7XHJcbmltcG9ydCB7IFNjaGVkdWxlIH0gZnJvbSAnLi9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFNjaG9vbEluZm9YTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1NjaG9vbEluZm8nO1xyXG5pbXBvcnQgeyBSZXBvcnRDYXJkc1hNTE9iamVjdCB9IGZyb20gJy4uL1JlcG9ydENhcmQvUmVwb3J0Q2FyZC54bWwnO1xyXG5pbXBvcnQgeyBEb2N1bWVudFhNTE9iamVjdCB9IGZyb20gJy4uL0RvY3VtZW50L0RvY3VtZW50LnhtbCc7XHJcbmltcG9ydCBSZXBvcnRDYXJkIGZyb20gJy4uL1JlcG9ydENhcmQvUmVwb3J0Q2FyZCc7XHJcbmltcG9ydCBEb2N1bWVudCBmcm9tICcuLi9Eb2N1bWVudC9Eb2N1bWVudCc7XHJcbmltcG9ydCBSZXF1ZXN0RXhjZXB0aW9uIGZyb20gJy4uL1JlcXVlc3RFeGNlcHRpb24vUmVxdWVzdEV4Y2VwdGlvbic7XHJcbmltcG9ydCBYTUxGYWN0b3J5IGZyb20gJy4uLy4uL3V0aWxzL1hNTEZhY3RvcnkvWE1MRmFjdG9yeSc7XHJcbmltcG9ydCBpc0Jhc2U2NCBmcm9tICcuLi8uLi91dGlscy9pc0Jhc2U2NCc7XHJcblxyXG4vKipcclxuICogVGhlIFN0dWRlbnRWVUUgQ2xpZW50IHRvIGFjY2VzcyB0aGUgQVBJXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQgZXh0ZW5kcyBzb2FwLkNsaWVudCB7XHJcbiAgcHJpdmF0ZSBob3N0VXJsOiBzdHJpbmc7XHJcbiAgY29uc3RydWN0b3IoY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsIGhvc3RVcmw6IHN0cmluZykge1xyXG4gICAgc3VwZXIoY3JlZGVudGlhbHMpO1xyXG4gICAgdGhpcy5ob3N0VXJsID0gaG9zdFVybDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFZhbGlkYXRlJ3MgdGhlIHVzZXIncyBjcmVkZW50aWFscy4gSXQgd2lsbCB0aHJvdyBhbiBlcnJvciBpZiBjcmVkZW50aWFscyBhcmUgaW5jb3JyZWN0XHJcbiAgICovXHJcbiAgcHVibGljIHZhbGlkYXRlQ3JlZGVudGlhbHMoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFBhcnNlZFJlcXVlc3RFcnJvcj4oeyBtZXRob2ROYW1lOiAnbG9naW4gdGVzdCcsIHZhbGlkYXRlRXJyb3JzOiBmYWxzZSB9KVxyXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLlJUX0VSUk9SWzBdWydAX0VSUk9SX01FU1NBR0UnXVswXSA9PT0gJ2xvZ2luIHRlc3QgaXMgbm90IGEgdmFsaWQgbWV0aG9kLicpIHJlcygpO1xyXG4gICAgICAgICAgZWxzZSByZWoobmV3IFJlcXVlc3RFeGNlcHRpb24ocmVzcG9uc2UpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBzdHVkZW50J3MgZG9jdW1lbnRzIGZyb20gc3luZXJneSBzZXJ2ZXJzXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8RG9jdW1lbnRbXT59PiBSZXR1cm5zIGEgbGlzdCBvZiBzdHVkZW50IGRvY3VtZW50c1xyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgZG9jdW1lbnRzID0gYXdhaXQgY2xpZW50LmRvY3VtZW50cygpO1xyXG4gICAqIGNvbnN0IGRvY3VtZW50ID0gZG9jdW1lbnRzWzBdO1xyXG4gICAqIGNvbnN0IGZpbGVzID0gYXdhaXQgZG9jdW1lbnQuZ2V0KCk7XHJcbiAgICogY29uc3QgYmFzZTY0Y29sbGVjdGlvbiA9IGZpbGVzLm1hcCgoZmlsZSkgPT4gZmlsZS5iYXNlNjQpO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBkb2N1bWVudHMoKTogUHJvbWlzZTxEb2N1bWVudFtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PERvY3VtZW50WE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnR2V0U3R1ZGVudERvY3VtZW50SW5pdGlhbERhdGEnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKFxyXG4gICAgICAgICAgICB4bWxPYmplY3RbJ1N0dWRlbnREb2N1bWVudHMnXVswXS5TdHVkZW50RG9jdW1lbnREYXRhc1swXS5TdHVkZW50RG9jdW1lbnREYXRhLm1hcChcclxuICAgICAgICAgICAgICAoeG1sKSA9PiBuZXcgRG9jdW1lbnQoeG1sLCBzdXBlci5jcmVkZW50aWFscylcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIGEgbGlzdCBvZiByZXBvcnQgY2FyZHNcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxSZXBvcnRDYXJkW10+fSBSZXR1cm5zIGEgbGlzdCBvZiByZXBvcnQgY2FyZHMgdGhhdCBjYW4gZmV0Y2ggYSBmaWxlXHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCByZXBvcnRDYXJkcyA9IGF3YWl0IGNsaWVudC5yZXBvcnRDYXJkcygpO1xyXG4gICAqIGNvbnN0IGZpbGVzID0gYXdhaXQgUHJvbWlzZS5hbGwocmVwb3J0Q2FyZHMubWFwKChjYXJkKSA9PiBjYXJkLmdldCgpKSk7XHJcbiAgICogY29uc3QgYmFzZTY0YXJyID0gZmlsZXMubWFwKChmaWxlKSA9PiBmaWxlLmJhc2U2NCk7IC8vIFtcIkpWQkVSaTAuLi5cIiwgXCJkVUlvYTEuLi5cIiwgLi4uXTtcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgcmVwb3J0Q2FyZHMoKTogUHJvbWlzZTxSZXBvcnRDYXJkW10+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8UmVwb3J0Q2FyZHNYTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRSZXBvcnRDYXJkSW5pdGlhbERhdGEnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKFxyXG4gICAgICAgICAgICB4bWxPYmplY3QuUkNSZXBvcnRpbmdQZXJpb2REYXRhWzBdLlJDUmVwb3J0aW5nUGVyaW9kc1swXS5SQ1JlcG9ydGluZ1BlcmlvZC5tYXAoXHJcbiAgICAgICAgICAgICAgKHhtbCkgPT4gbmV3IFJlcG9ydENhcmQoeG1sLCBzdXBlci5jcmVkZW50aWFscylcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBzdHVkZW50J3Mgc2Nob29sJ3MgaW5mb3JtYXRpb25cclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTY2hvb2xJbmZvPn0gUmV0dXJucyB0aGUgaW5mb3JtYXRpb24gb2YgdGhlIHN0dWRlbnQncyBzY2hvb2xcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGF3YWl0IGNsaWVudC5zY2hvb2xJbmZvKCk7XHJcbiAgICpcclxuICAgKiBjbGllbnQuc2Nob29sSW5mbygpLnRoZW4oKHNjaG9vbEluZm8pID0+IHtcclxuICAgKiAgY29uc29sZS5sb2coXy51bmlxKHNjaG9vbEluZm8uc3RhZmYubWFwKChzdGFmZikgPT4gc3RhZmYubmFtZSkpKTsgLy8gTGlzdCBhbGwgc3RhZmYgcG9zaXRpb25zIHVzaW5nIGxvZGFzaFxyXG4gICAqIH0pXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIHNjaG9vbEluZm8oKTogUHJvbWlzZTxTY2hvb2xJbmZvPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFNjaG9vbEluZm9YTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50U2Nob29sSW5mbycsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElEOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeyBTdHVkZW50U2Nob29sSW5mb0xpc3Rpbmc6IFt4bWxPYmplY3RdIH0pID0+IHtcclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIHNjaG9vbDoge1xyXG4gICAgICAgICAgICAgIGFkZHJlc3M6IHhtbE9iamVjdFsnQF9TY2hvb2xBZGRyZXNzJ11bMF0sXHJcbiAgICAgICAgICAgICAgYWRkcmVzc0FsdDogeG1sT2JqZWN0WydAX1NjaG9vbEFkZHJlc3MyJ11bMF0sXHJcbiAgICAgICAgICAgICAgY2l0eTogeG1sT2JqZWN0WydAX1NjaG9vbENpdHknXVswXSxcclxuICAgICAgICAgICAgICB6aXBDb2RlOiB4bWxPYmplY3RbJ0BfU2Nob29sWmlwJ11bMF0sXHJcbiAgICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdFsnQF9QaG9uZSddWzBdLFxyXG4gICAgICAgICAgICAgIGFsdFBob25lOiB4bWxPYmplY3RbJ0BfUGhvbmUyJ11bMF0sXHJcbiAgICAgICAgICAgICAgcHJpbmNpcGFsOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0WydAX1ByaW5jaXBhbEVtYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBzdGFmZkd1OiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsR3UnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdGFmZjogeG1sT2JqZWN0LlN0YWZmTGlzdHNbMF0uU3RhZmZMaXN0Lm1hcCgoc3RhZmYpID0+ICh7XHJcbiAgICAgICAgICAgICAgbmFtZTogc3RhZmZbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIGVtYWlsOiBzdGFmZlsnQF9FTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgIHN0YWZmR3U6IHN0YWZmWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICBqb2JUaXRsZTogc3RhZmZbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICBleHRuOiBzdGFmZlsnQF9FeHRuJ11bMF0sXHJcbiAgICAgICAgICAgICAgcGhvbmU6IHN0YWZmWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHNjaGVkdWxlIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRlcm1JbmRleCBUaGUgaW5kZXggb2YgdGhlIHRlcm0uXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8U2NoZWR1bGU+fSBSZXR1cm5zIHRoZSBzY2hlZHVsZSBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogYXdhaXQgc2NoZWR1bGUoMCkgLy8gLT4geyB0ZXJtOiB7IGluZGV4OiAwLCBuYW1lOiAnMXN0IFF0ciBQcm9ncmVzcycgfSwgLi4uIH1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc2NoZWR1bGUodGVybUluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxTY2hlZHVsZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxTY2hlZHVsZVhNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRDbGFzc0xpc3QnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgLi4uKHRlcm1JbmRleCAhPSBudWxsID8geyBUZXJtSW5kZXg6IHRlcm1JbmRleCB9IDoge30pIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICByZXMoe1xyXG4gICAgICAgICAgICB0ZXJtOiB7XHJcbiAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcih4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfVGVybUluZGV4J11bMF0pLFxyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9UZXJtSW5kZXhOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfRXJyb3JNZXNzYWdlJ11bMF0sXHJcbiAgICAgICAgICAgIHRvZGF5OlxyXG4gICAgICAgICAgICAgIHR5cGVvZiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVG9kYXlTY2hlZHVsZUluZm9EYXRhWzBdLlNjaG9vbEluZm9zWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgPyB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVG9kYXlTY2hlZHVsZUluZm9EYXRhWzBdLlNjaG9vbEluZm9zWzBdLlNjaG9vbEluZm8ubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgIChzY2hvb2wpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzY2hvb2xbJ0BfU2Nob29sTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYmVsbFNjaGVkdWxlTmFtZTogc2Nob29sWydAX0JlbGxTY2hlZE5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXM6IHNjaG9vbC5DbGFzc2VzWzBdLkNsYXNzSW5mby5tYXA8Q2xhc3NTY2hlZHVsZUluZm8+KChjb3Vyc2UpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKGNvdXJzZVsnQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGVuZGFuY2VDb2RlOiBjb3Vyc2UuQXR0ZW5kYW5jZUNvZGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoY291cnNlWydAX1N0YXJ0RGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKGNvdXJzZVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfQ2xhc3NOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb25HdTogY291cnNlWydAX1NlY3Rpb25HVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWFjaGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGNvdXJzZVsnQF9UZWFjaGVyRW1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbFN1YmplY3Q6IGNvdXJzZVsnQF9FbWFpbFN1YmplY3QnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfVGVhY2hlck5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBjb3Vyc2VbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY291cnNlWydAX1RlYWNoZXJVUkwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBjb3Vyc2VbJ0BfQ2xhc3NVUkwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBwYXJzZShjb3Vyc2VbJ0BfU3RhcnRUaW1lJ11bMF0sICdoaDptbSBhJywgRGF0ZS5ub3coKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBwYXJzZShjb3Vyc2VbJ0BfRW5kVGltZSddWzBdLCAnaGg6bW0gYScsIERhdGUubm93KCkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgIGNsYXNzZXM6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5DbGFzc0xpc3RzWzBdLkNsYXNzTGlzdGluZy5tYXAoKHN0dWRlbnRDbGFzcykgPT4gKHtcclxuICAgICAgICAgICAgICBuYW1lOiBzdHVkZW50Q2xhc3NbJ0BfQ291cnNlVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihzdHVkZW50Q2xhc3NbJ0BfUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHJvb206IHN0dWRlbnRDbGFzc1snQF9Sb29tTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIHNlY3Rpb25HdTogc3R1ZGVudENsYXNzWydAX1NlY3Rpb25HVSddWzBdLFxyXG4gICAgICAgICAgICAgIHRlYWNoZXI6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IHN0dWRlbnRDbGFzc1snQF9UZWFjaGVyJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogc3R1ZGVudENsYXNzWydAX1RlYWNoZXJFbWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgc3RhZmZHdTogc3R1ZGVudENsYXNzWydAX1RlYWNoZXJTdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgICB0ZXJtczogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLlRlcm1MaXN0c1swXS5UZXJtTGlzdGluZy5tYXAoKHRlcm0pID0+ICh7XHJcbiAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHRlcm1bJ0BfQmVnaW5EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZSh0ZXJtWydAX0VuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBpbmRleDogTnVtYmVyKHRlcm1bJ0BfVGVybUluZGV4J11bMF0pLFxyXG4gICAgICAgICAgICAgIG5hbWU6IHRlcm1bJ0BfVGVybU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICBzY2hvb2xZZWFyVGVybUNvZGVHdTogdGVybVsnQF9TY2hvb2xZZWFyVHJtQ29kZUdVJ11bMF0sXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGF0dGVuZGFuY2Ugb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBdHRlbmRhbmNlPn0gUmV0dXJucyBhbiBBdHRlbmRhbmNlIG9iamVjdFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY2xpZW50LmF0dGVuZGFuY2UoKVxyXG4gICAqICAudGhlbihjb25zb2xlLmxvZyk7IC8vIC0+IHsgdHlwZTogJ1BlcmlvZCcsIHBlcmlvZDogey4uLn0sIHNjaG9vbE5hbWU6ICdVbml2ZXJzaXR5IEhpZ2ggU2Nob29sJywgYWJzZW5jZXM6IFsuLi5dLCBwZXJpb2RJbmZvczogWy4uLl0gfVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBhdHRlbmRhbmNlKCk6IFByb21pc2U8QXR0ZW5kYW5jZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxBdHRlbmRhbmNlWE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnQXR0ZW5kYW5jZScsXHJcbiAgICAgICAgICBwYXJhbVN0cjoge1xyXG4gICAgICAgICAgICBjaGlsZEludElkOiAwLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKChhdHRlbmRhbmNlWE1MT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB4bWxPYmplY3QgPSBhdHRlbmRhbmNlWE1MT2JqZWN0LkF0dGVuZGFuY2VbMF07XHJcblxyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgdHlwZTogeG1sT2JqZWN0WydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgcGVyaW9kOiB7XHJcbiAgICAgICAgICAgICAgdG90YWw6IE51bWJlcih4bWxPYmplY3RbJ0BfUGVyaW9kQ291bnQnXVswXSksXHJcbiAgICAgICAgICAgICAgc3RhcnQ6IE51bWJlcih4bWxPYmplY3RbJ0BfU3RhcnRQZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgZW5kOiBOdW1iZXIoeG1sT2JqZWN0WydAX0VuZFBlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2Nob29sTmFtZTogeG1sT2JqZWN0WydAX1NjaG9vbE5hbWUnXVswXSxcclxuICAgICAgICAgICAgYWJzZW5jZXM6IHhtbE9iamVjdC5BYnNlbmNlc1swXS5BYnNlbmNlLm1hcCgoYWJzZW5jZSkgPT4gKHtcclxuICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShhYnNlbmNlWydAX0Fic2VuY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHJlYXNvbjogYWJzZW5jZVsnQF9SZWFzb24nXVswXSxcclxuICAgICAgICAgICAgICBub3RlOiBhYnNlbmNlWydAX05vdGUnXVswXSxcclxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYWJzZW5jZVsnQF9Db2RlQWxsRGF5RGVzY3JpcHRpb24nXVswXSxcclxuICAgICAgICAgICAgICBwZXJpb2RzOiBhYnNlbmNlLlBlcmlvZHNbMF0uUGVyaW9kLm1hcChcclxuICAgICAgICAgICAgICAgIChwZXJpb2QpID0+XHJcbiAgICAgICAgICAgICAgICAgICh7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIocGVyaW9kWydAX051bWJlciddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlYXNvbjogcGVyaW9kWydAX1JlYXNvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvdXJzZTogcGVyaW9kWydAX0NvdXJzZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWZmOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfU3RhZmYnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IHBlcmlvZFsnQF9TdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogcGVyaW9kWydAX1N0YWZmRU1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9yZ1llYXJHdTogcGVyaW9kWydAX09yZ1llYXJHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICB9IGFzIEFic2VudFBlcmlvZClcclxuICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICAgIHBlcmlvZEluZm9zOiB4bWxPYmplY3QuVG90YWxBY3Rpdml0aWVzWzBdLlBlcmlvZFRvdGFsLm1hcCgocGQsIGkpID0+ICh7XHJcbiAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIocGRbJ0BfTnVtYmVyJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHRvdGFsOiB7XHJcbiAgICAgICAgICAgICAgICBleGN1c2VkOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsRXhjdXNlZFswXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICAgIHRhcmRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxUYXJkaWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgdW5leGN1c2VkOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVW5leGN1c2VkWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgYWN0aXZpdGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbEFjdGl2aXRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgICB1bmV4Y3VzZWRUYXJkaWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVW5leGN1c2VkVGFyZGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KSkgYXMgUGVyaW9kSW5mb1tdLFxyXG4gICAgICAgICAgfSBhcyBBdHRlbmRhbmNlKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBncmFkZWJvb2sgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcGFyYW0ge251bWJlcn0gcmVwb3J0aW5nUGVyaW9kSW5kZXggVGhlIHRpbWVmcmFtZSB0aGF0IHRoZSBncmFkZWJvb2sgc2hvdWxkIHJldHVyblxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEdyYWRlYm9vaz59IFJldHVybnMgYSBHcmFkZWJvb2sgb2JqZWN0XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBncmFkZWJvb2sgPSBhd2FpdCBjbGllbnQuZ3JhZGVib29rKCk7XHJcbiAgICogY29uc29sZS5sb2coZ3JhZGVib29rKTsgLy8geyBlcnJvcjogJycsIHR5cGU6ICdUcmFkaXRpb25hbCcsIHJlcG9ydGluZ1BlcmlvZDogey4uLn0sIGNvdXJzZXM6IFsuLi5dIH07XHJcbiAgICpcclxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDApIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggMCBhcyBcIjFzdCBRdWFydGVyIFByb2dyZXNzXCJcclxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDcpIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggNyBhcyBcIjR0aCBRdWFydGVyXCJcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgZ3JhZGVib29rKHJlcG9ydGluZ1BlcmlvZEluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxHcmFkZWJvb2s+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8R3JhZGVib29rWE1MT2JqZWN0PihcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgbWV0aG9kTmFtZTogJ0dyYWRlYm9vaycsXHJcbiAgICAgICAgICAgIHBhcmFtU3RyOiB7XHJcbiAgICAgICAgICAgICAgY2hpbGRJbnRJZDogMCxcclxuICAgICAgICAgICAgICAuLi4ocmVwb3J0aW5nUGVyaW9kSW5kZXggIT0gbnVsbCA/IHsgUmVwb3J0UGVyaW9kOiByZXBvcnRpbmdQZXJpb2RJbmRleCB9IDoge30pLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICh4bWwpID0+XHJcbiAgICAgICAgICAgIG5ldyBYTUxGYWN0b3J5KHhtbClcclxuICAgICAgICAgICAgICAuZW5jb2RlQXR0cmlidXRlKCdNZWFzdXJlRGVzY3JpcHRpb24nLCAnSGFzRHJvcEJveCcpXHJcbiAgICAgICAgICAgICAgLmVuY29kZUF0dHJpYnV0ZSgnTWVhc3VyZScsICdUeXBlJylcclxuICAgICAgICAgICAgICAudG9TdHJpbmcoKVxyXG4gICAgICAgIClcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0OiBHcmFkZWJvb2tYTUxPYmplY3QpID0+IHtcclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIGVycm9yOiB4bWxPYmplY3QuR3JhZGVib29rWzBdWydAX0Vycm9yTWVzc2FnZSddWzBdLFxyXG4gICAgICAgICAgICB0eXBlOiB4bWxPYmplY3QuR3JhZGVib29rWzBdWydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgcmVwb3J0aW5nUGVyaW9kOiB7XHJcbiAgICAgICAgICAgICAgY3VycmVudDoge1xyXG4gICAgICAgICAgICAgICAgaW5kZXg6XHJcbiAgICAgICAgICAgICAgICAgIHJlcG9ydGluZ1BlcmlvZEluZGV4ID8/XHJcbiAgICAgICAgICAgICAgICAgIE51bWJlcihcclxuICAgICAgICAgICAgICAgICAgICB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZHNbMF0uUmVwb3J0UGVyaW9kLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAoeCkgPT4geFsnQF9HcmFkZVBlcmlvZCddWzBdID09PSB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9HcmFkZVBlcmlvZCddWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgKT8uWydAX0luZGV4J11bMF1cclxuICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX1N0YXJ0RGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZSh4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0dyYWRlUGVyaW9kJ11bMF0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBhdmFpbGFibGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QubWFwKChwZXJpb2QpID0+ICh7XHJcbiAgICAgICAgICAgICAgICBkYXRlOiB7IHN0YXJ0OiBuZXcgRGF0ZShwZXJpb2RbJ0BfU3RhcnREYXRlJ11bMF0pLCBlbmQ6IG5ldyBEYXRlKHBlcmlvZFsnQF9FbmREYXRlJ11bMF0pIH0sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfR3JhZGVQZXJpb2QnXVswXSxcclxuICAgICAgICAgICAgICAgIGluZGV4OiBOdW1iZXIocGVyaW9kWydAX0luZGV4J11bMF0pLFxyXG4gICAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY291cnNlczogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5Db3Vyc2VzWzBdLkNvdXJzZS5tYXAoKGNvdXJzZSkgPT4gKHtcclxuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihjb3Vyc2VbJ0BfUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiBjb3Vyc2VbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICByb29tOiBjb3Vyc2VbJ0BfUm9vbSddWzBdLFxyXG4gICAgICAgICAgICAgIHN0YWZmOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfU3RhZmYnXVswXSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBjb3Vyc2VbJ0BfU3RhZmZFTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgc3RhZmZHdTogY291cnNlWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIG1hcmtzOiBjb3Vyc2UuTWFya3NbMF0uTWFyay5tYXAoKG1hcmspID0+ICh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBtYXJrWydAX01hcmtOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBjYWxjdWxhdGVkU2NvcmU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RyaW5nOiBtYXJrWydAX0NhbGN1bGF0ZWRTY29yZVN0cmluZyddWzBdLFxyXG4gICAgICAgICAgICAgICAgICByYXc6IE51bWJlcihtYXJrWydAX0NhbGN1bGF0ZWRTY29yZVJhdyddWzBdKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZENhdGVnb3JpZXM6XHJcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiBtYXJrWydHcmFkZUNhbGN1bGF0aW9uU3VtbWFyeSddWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgID8gbWFya1snR3JhZGVDYWxjdWxhdGlvblN1bW1hcnknXVswXS5Bc3NpZ25tZW50R3JhZGVDYWxjLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHdlaWdodGVkKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB3ZWlnaHRlZFsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkTWFyazogd2VpZ2h0ZWRbJ0BfQ2FsY3VsYXRlZE1hcmsnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmFsdWF0ZWQ6IHdlaWdodGVkWydAX1dlaWdodGVkUGN0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkOiB3ZWlnaHRlZFsnQF9XZWlnaHQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDogTnVtYmVyKHdlaWdodGVkWydAX1BvaW50cyddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zc2libGU6IE51bWJlcih3ZWlnaHRlZFsnQF9Qb2ludHNQb3NzaWJsZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBXZWlnaHRlZENhdGVnb3J5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50czpcclxuICAgICAgICAgICAgICAgICAgdHlwZW9mIG1hcmsuQXNzaWdubWVudHNbMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgPyAobWFyay5Bc3NpZ25tZW50c1swXS5Bc3NpZ25tZW50Lm1hcCgoYXNzaWdubWVudCkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhZGVib29rSWQ6IGFzc2lnbm1lbnRbJ0BfR3JhZGVib29rSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZShhdG9iKGFzc2lnbm1lbnRbJ0BfTWVhc3VyZSddWzBdKSkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhc3NpZ25tZW50WydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHVlOiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0R1ZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYXNzaWdubWVudFsnQF9TY29yZVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYXNzaWdubWVudFsnQF9TY29yZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IGFzc2lnbm1lbnRbJ0BfUG9pbnRzJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGVzOiBhc3NpZ25tZW50WydAX05vdGVzJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYWNoZXJJZDogYXNzaWdubWVudFsnQF9UZWFjaGVySUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUoYXRvYihhc3NpZ25tZW50WydAX01lYXN1cmVEZXNjcmlwdGlvbiddWzBdKSkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNEcm9wYm94OiBKU09OLnBhcnNlKGFzc2lnbm1lbnRbJ0BfSGFzRHJvcEJveCddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R1ZGVudElkOiBhc3NpZ25tZW50WydAX1N0dWRlbnRJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wYm94RGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0Ryb3BTdGFydERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0Ryb3BFbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZXM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAoYXNzaWdubWVudC5SZXNvdXJjZXNbMF0uUmVzb3VyY2UubWFwKChyc3JjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyc3JjWydAX1R5cGUnXVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnRmlsZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZVJzcmMgPSByc3JjIGFzIEZpbGVSZXNvdXJjZVhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBSZXNvdXJjZVR5cGUuRklMRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaWxlUnNyY1snQF9GaWxlVHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZVJzcmNbJ0BfRmlsZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVyaTogdGhpcy5ob3N0VXJsICsgZmlsZVJzcmNbJ0BfU2VydmVyRmlsZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShmaWxlUnNyY1snQF9SZXNvdXJjZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZmlsZVJzcmNbJ0BfUmVzb3VyY2VJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZVJzcmNbJ0BfUmVzb3VyY2VOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBGaWxlUmVzb3VyY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdVUkwnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybFJzcmMgPSByc3JjIGFzIFVSTFJlc291cmNlWE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdXJsUnNyY1snQF9VUkwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBSZXNvdXJjZVR5cGUuVVJMLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSh1cmxSc3JjWydAX1Jlc291cmNlRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB1cmxSc3JjWydAX1Jlc291cmNlSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHVybFJzcmNbJ0BfUmVzb3VyY2VOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdXJsUnNyY1snQF9SZXNvdXJjZURlc2NyaXB0aW9uJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiB1cmxSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgVVJMUmVzb3VyY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWooXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFR5cGUgJHtyc3JjWydAX1R5cGUnXVswXX0gZG9lcyBub3QgZXhpc3QgYXMgYSB0eXBlLiBBZGQgaXQgdG8gdHlwZSBkZWNsYXJhdGlvbnMuYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkgYXMgKEZpbGVSZXNvdXJjZSB8IFVSTFJlc291cmNlKVtdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgIH0pKSBhcyBBc3NpZ25tZW50W10pXHJcbiAgICAgICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgICB9KSkgYXMgTWFya1tdLFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICB9IGFzIEdyYWRlYm9vayk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGEgbGlzdCBvZiBtZXNzYWdlcyBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPE1lc3NhZ2VbXT59IFJldHVybnMgYW4gYXJyYXkgb2YgbWVzc2FnZXMgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGF3YWl0IGNsaWVudC5tZXNzYWdlcygpOyAvLyAtPiBbeyBpZDogJ0U5NzJGMUJDLTk5QTAtNENEMC04RDE1LUIxODk2OEI0M0UwOCcsIHR5cGU6ICdTdHVkZW50QWN0aXZpdHknLCAuLi4gfSwgeyBpZDogJzg2RkRBMTFELTQyQzctNDI0OS1CMDAzLTk0QjE1RUIyQzhENCcsIHR5cGU6ICdTdHVkZW50QWN0aXZpdHknLCAuLi4gfV1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgbWVzc2FnZXMoKTogUHJvbWlzZTxNZXNzYWdlW10+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8TWVzc2FnZVhNTE9iamVjdD4oXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRQWFBNZXNzYWdlcycsXHJcbiAgICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAoeG1sKSA9PiBuZXcgWE1MRmFjdG9yeSh4bWwpLmVuY29kZUF0dHJpYnV0ZSgnQ29udGVudCcsICdSZWFkJykudG9TdHJpbmcoKVxyXG4gICAgICAgIClcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICByZXMoXHJcbiAgICAgICAgICAgIHhtbE9iamVjdC5QWFBNZXNzYWdlc0RhdGFbMF0uTWVzc2FnZUxpc3RpbmdzWzBdLk1lc3NhZ2VMaXN0aW5nLm1hcChcclxuICAgICAgICAgICAgICAobWVzc2FnZSkgPT4gbmV3IE1lc3NhZ2UobWVzc2FnZSwgc3VwZXIuY3JlZGVudGlhbHMsIHRoaXMuaG9zdFVybClcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBpbmZvIG9mIGEgc3R1ZGVudFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN0dWRlbnRJbmZvPn0gU3R1ZGVudEluZm8gb2JqZWN0XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBzdHVkZW50SW5mbygpLnRoZW4oY29uc29sZS5sb2cpIC8vIC0+IHsgc3R1ZGVudDogeyBuYW1lOiAnRXZhbiBEYXZpcycsIG5pY2tuYW1lOiAnJywgbGFzdE5hbWU6ICdEYXZpcycgfSwgLi4ufVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzdHVkZW50SW5mbygpOiBQcm9taXNlPFN0dWRlbnRJbmZvPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8U3R1ZGVudEluZm8+KChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxTdHVkZW50SW5mb1hNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRJbmZvJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3REYXRhKSA9PiB7XHJcbiAgICAgICAgICByZXMoe1xyXG4gICAgICAgICAgICBzdHVkZW50OiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Gb3JtYXR0ZWROYW1lWzBdLFxyXG4gICAgICAgICAgICAgIGxhc3ROYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uTGFzdE5hbWVHb2VzQnlbMF0sXHJcbiAgICAgICAgICAgICAgbmlja25hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5OaWNrTmFtZVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYmlydGhEYXRlOiBuZXcgRGF0ZSh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQmlydGhEYXRlWzBdKSxcclxuICAgICAgICAgICAgdHJhY2s6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5UcmFja1swXSxcclxuICAgICAgICAgICAgYWRkcmVzczogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLmJyWzBdLFxyXG4gICAgICAgICAgICBwaG90bzogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBob3RvWzBdLFxyXG4gICAgICAgICAgICBjb3Vuc2Vsb3I6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ291bnNlbG9yTmFtZVswXSxcclxuICAgICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvckVtYWlsWzBdLFxyXG4gICAgICAgICAgICAgIHN0YWZmR3U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Db3Vuc2Vsb3JTdGFmZkdVWzBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjdXJyZW50U2Nob29sOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ3VycmVudFNjaG9vbFswXSxcclxuICAgICAgICAgICAgZGVudGlzdDoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5EZW50aXN0WzBdWydAX05hbWUnXVswXSxcclxuICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICBleHRuOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uRGVudGlzdFswXVsnQF9FeHRuJ11bMF0sXHJcbiAgICAgICAgICAgICAgb2ZmaWNlOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uRGVudGlzdFswXVsnQF9PZmZpY2UnXVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGh5c2ljaWFuOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5bMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICBleHRuOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGh5c2ljaWFuWzBdWydAX0V4dG4nXVswXSxcclxuICAgICAgICAgICAgICBob3NwaXRhbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9Ib3NwaXRhbCddWzBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpZDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QZXJtSURbMF0sXHJcbiAgICAgICAgICAgIG9yZ1llYXJHdTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLk9yZ1llYXJHVVswXSxcclxuICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaG9uZVswXSxcclxuICAgICAgICAgICAgZW1haWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5FTWFpbFswXSxcclxuICAgICAgICAgICAgZW1lcmdlbmN5Q29udGFjdHM6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5FbWVyZ2VuY3lDb250YWN0c1swXS5FbWVyZ2VuY3lDb250YWN0Lm1hcChcclxuICAgICAgICAgICAgICAoY29udGFjdCkgPT4gKHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IGNvbnRhY3RbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgICAgICAgICAgaG9tZTogY29udGFjdFsnQF9Ib21lUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgbW9iaWxlOiBjb250YWN0WydAX01vYmlsZVBob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIG90aGVyOiBjb250YWN0WydAX090aGVyUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgd29yazogY29udGFjdFsnQF9Xb3JrUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6IGNvbnRhY3RbJ0BfUmVsYXRpb25zaGlwJ11bMF0sXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgZ2VuZGVyOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkdlbmRlclswXSxcclxuICAgICAgICAgICAgZ3JhZGU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uR3JhZGVbMF0sXHJcbiAgICAgICAgICAgIGxvY2tlckluZm9SZWNvcmRzOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkxvY2tlckluZm9SZWNvcmRzWzBdLFxyXG4gICAgICAgICAgICBob21lTGFuZ3VhZ2U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lTGFuZ3VhZ2VbMF0sXHJcbiAgICAgICAgICAgIGhvbWVSb29tOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZVJvb21bMF0sXHJcbiAgICAgICAgICAgIGhvbWVSb29tVGVhY2hlcjoge1xyXG4gICAgICAgICAgICAgIGVtYWlsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZVJvb21UY2hFTWFpbFswXSxcclxuICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZVJvb21UY2hbMF0sXHJcbiAgICAgICAgICAgICAgc3RhZmZHdTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoU3RhZmZHVVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWRkaXRpb25hbEluZm86IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94ZXNbMF0uVXNlckRlZmluZWRHcm91cEJveC5tYXAoXHJcbiAgICAgICAgICAgICAgKGRlZmluZWRCb3gpID0+ICh7XHJcbiAgICAgICAgICAgICAgICBpZDogZGVmaW5lZEJveFsnQF9Hcm91cEJveElEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBkZWZpbmVkQm94WydAX0dyb3VwQm94TGFiZWwnXVswXSxcclxuICAgICAgICAgICAgICAgIHZjSWQ6IGRlZmluZWRCb3hbJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgaXRlbXM6IGRlZmluZWRCb3guVXNlckRlZmluZWRJdGVtc1swXS5Vc2VyRGVmaW5lZEl0ZW0ubWFwKChpdGVtKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBpdGVtWydAX1NvdXJjZUVsZW1lbnQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IGl0ZW1bJ0BfU291cmNlT2JqZWN0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIHZjSWQ6IGl0ZW1bJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbVsnQF9WYWx1ZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiBpdGVtWydAX0l0ZW1UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB9KSkgYXMgQWRkaXRpb25hbEluZm9JdGVtW10sXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKSBhcyBBZGRpdGlvbmFsSW5mb1tdLFxyXG4gICAgICAgICAgfSBhcyBTdHVkZW50SW5mbyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGU6IERhdGUpIHtcclxuICAgIHJldHVybiBzdXBlci5wcm9jZXNzUmVxdWVzdDxDYWxlbmRhclhNTE9iamVjdD4oXHJcbiAgICAgIHtcclxuICAgICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudENhbGVuZGFyJyxcclxuICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwLCBSZXF1ZXN0RGF0ZTogZGF0ZS50b0lTT1N0cmluZygpIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgICh4bWwpID0+IG5ldyBYTUxGYWN0b3J5KHhtbCkuZW5jb2RlQXR0cmlidXRlKCdUaXRsZScsICdJY29uJykudG9TdHJpbmcoKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtDYWxlbmRhck9wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyB0byBwcm92aWRlIGZvciBjYWxlbmRhciBtZXRob2QuIEFuIGludGVydmFsIGlzIHJlcXVpcmVkLlxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPENhbGVuZGFyPn0gUmV0dXJucyBhIENhbGVuZGFyIG9iamVjdFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY2xpZW50LmNhbGVuZGFyKHsgaW50ZXJ2YWw6IHsgc3RhcnQ6IG5ldyBEYXRlKCc1LzEvMjAyMicpLCBlbmQ6IG5ldyBEYXRlKCc4LzEvMjAyMScpIH0sIGNvbmN1cnJlbmN5OiBudWxsIH0pOyAvLyAtPiBMaW1pdGxlc3MgY29uY3VycmVuY3kgKG5vdCByZWNvbW1lbmRlZClcclxuICAgKlxyXG4gICAqIGNvbnN0IGNhbGVuZGFyID0gYXdhaXQgY2xpZW50LmNhbGVuZGFyKHsgaW50ZXJ2YWw6IHsgLi4uIH19KTtcclxuICAgKiBjb25zb2xlLmxvZyhjYWxlbmRhcik7IC8vIC0+IHsgc2Nob29sRGF0ZTogey4uLn0sIG91dHB1dFJhbmdlOiB7Li4ufSwgZXZlbnRzOiBbLi4uXSB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGNhbGVuZGFyKG9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyA9IHt9KTogUHJvbWlzZTxDYWxlbmRhcj4ge1xyXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyA9IHtcclxuICAgICAgY29uY3VycmVuY3k6IDcsXHJcbiAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBsZXQgc2Nob29sU3RhcnREYXRlOiBEYXRlIHwgbnVtYmVyID0gRGF0ZS5ub3coKTtcclxuICAgICAgbGV0IHNjaG9vbEVuZERhdGU6IERhdGUgfCBudW1iZXIgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIG9wdGlvbnMuaW50ZXJ2YWwgPT0gbnVsbCB8fFxyXG4gICAgICAgIChvcHRpb25zLmludGVydmFsICYmIChvcHRpb25zLmludGVydmFsLnN0YXJ0ID09IG51bGwgfHwgb3B0aW9ucy5pbnRlcnZhbC5lbmQgPT0gbnVsbCkpXHJcbiAgICAgICkge1xyXG4gICAgICAgIHRoaXMuZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChuZXcgRGF0ZSgpKS50aGVuKChjYWwpID0+IHtcclxuICAgICAgICAgIHNjaG9vbFN0YXJ0RGF0ZSA9IG9wdGlvbnMuaW50ZXJ2YWw/LnN0YXJ0ID8/IG5ldyBEYXRlKGNhbC5DYWxlbmRhckxpc3RpbmdbMF1bJ0BfU2Nob29sQmVnRGF0ZSddWzBdKTtcclxuICAgICAgICAgIHNjaG9vbEVuZERhdGUgPSBvcHRpb25zLmludGVydmFsPy5lbmQgPz8gbmV3IERhdGUoY2FsLkNhbGVuZGFyTGlzdGluZ1swXVsnQF9TY2hvb2xFbmREYXRlJ11bMF0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBtb250aHNXaXRoaW5TY2hvb2xZZWFyID0gZWFjaE1vbnRoT2ZJbnRlcnZhbCh7IHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsIGVuZDogc2Nob29sRW5kRGF0ZSB9KTtcclxuICAgICAgY29uc3QgZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhciA9ICgpOiBQcm9taXNlPENhbGVuZGFyWE1MT2JqZWN0W10+ID0+XHJcbiAgICAgICAgZGVmYXVsdE9wdGlvbnMuY29uY3VycmVuY3kgPT0gbnVsbFxyXG4gICAgICAgICAgPyBQcm9taXNlLmFsbChtb250aHNXaXRoaW5TY2hvb2xZZWFyLm1hcCgoZGF0ZSkgPT4gdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpKSlcclxuICAgICAgICAgIDogYXN5bmNQb29sKGRlZmF1bHRPcHRpb25zLmNvbmN1cnJlbmN5LCBtb250aHNXaXRoaW5TY2hvb2xZZWFyLCAoZGF0ZSkgPT5cclxuICAgICAgICAgICAgICB0aGlzLmZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwoZGF0ZSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgbGV0IG1lbW86IENhbGVuZGFyIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgIGdldEFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIoKVxyXG4gICAgICAgIC50aGVuKChldmVudHMpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGFsbEV2ZW50cyA9IGV2ZW50cy5yZWR1Y2UoKHByZXYsIGV2ZW50cykgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWVtbyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgIG1lbW8gPSB7XHJcbiAgICAgICAgICAgICAgICBzY2hvb2xEYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXVsnQF9TY2hvb2xFbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG91dHB1dFJhbmdlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsXHJcbiAgICAgICAgICAgICAgICAgIGVuZDogc2Nob29sRW5kRGF0ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBldmVudHM6IFtdLFxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3Q6IENhbGVuZGFyID0ge1xyXG4gICAgICAgICAgICAgIC4uLm1lbW8sIC8vIFRoaXMgaXMgdG8gcHJldmVudCByZS1pbml0aWFsaXppbmcgRGF0ZSBvYmplY3RzIGluIG9yZGVyIHRvIGltcHJvdmUgcGVyZm9ybWFuY2VcclxuICAgICAgICAgICAgICBldmVudHM6IFtcclxuICAgICAgICAgICAgICAgIC4uLihwcmV2LmV2ZW50cyA/IHByZXYuZXZlbnRzIDogW10pLFxyXG4gICAgICAgICAgICAgICAgLi4uKHR5cGVvZiBldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdLkV2ZW50TGlzdHNbMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgID8gKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF0uRXZlbnRMaXN0c1swXS5FdmVudExpc3QubWFwKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChldmVudFsnQF9EYXlUeXBlJ11bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuQVNTSUdOTUVOVDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzc2lnbm1lbnRFdmVudCA9IGV2ZW50IGFzIEFzc2lnbm1lbnRFdmVudFhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGlzQmFzZTY0KGFzc2lnbm1lbnRFdmVudFsnQF9UaXRsZSddWzBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUoYXRvYihhc3NpZ25tZW50RXZlbnRbJ0BfVGl0bGUnXVswXSkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGFzc2lnbm1lbnRFdmVudFsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkTGlua0RhdGE6IGFzc2lnbm1lbnRFdmVudFsnQF9BZGRMaW5rRGF0YSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWd1OiBhc3NpZ25tZW50RXZlbnRbJ0BfQUdVJ10gPyBhc3NpZ25tZW50RXZlbnRbJ0BfQUdVJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShhc3NpZ25tZW50RXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRndTogYXNzaWdubWVudEV2ZW50WydAX0RHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogYXNzaWdubWVudEV2ZW50WydAX0xpbmsnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogYXNzaWdubWVudEV2ZW50WydAX1N0YXJ0VGltZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLkFTU0lHTk1FTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3VHlwZTogYXNzaWdubWVudEV2ZW50WydAX1ZpZXdUeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBBc3NpZ25tZW50RXZlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuSE9MSURBWToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogaXNCYXNlNjQoZXZlbnRbJ0BfVGl0bGUnXVswXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKGF0b2IoZXZlbnRbJ0BfVGl0bGUnXVswXSkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGV2ZW50WydAX1RpdGxlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuSE9MSURBWSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogZXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShldmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgSG9saWRheUV2ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLlJFR1VMQVI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWd1bGFyRXZlbnQgPSBldmVudCBhcyBSZWd1bGFyRXZlbnRYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBpc0Jhc2U2NChyZWd1bGFyRXZlbnRbJ0BfVGl0bGUnXVswXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKGF0b2IocmVndWxhckV2ZW50WydAX1RpdGxlJ11bMF0pKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiByZWd1bGFyRXZlbnRbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFndTogcmVndWxhckV2ZW50WydAX0FHVSddID8gcmVndWxhckV2ZW50WydAX0FHVSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUocmVndWxhckV2ZW50WydAX0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogcmVndWxhckV2ZW50WydAX0V2dERlc2NyaXB0aW9uJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyByZWd1bGFyRXZlbnRbJ0BfRXZ0RGVzY3JpcHRpb24nXVswXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRndTogcmVndWxhckV2ZW50WydAX0RHVSddID8gcmVndWxhckV2ZW50WydAX0RHVSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogcmVndWxhckV2ZW50WydAX0xpbmsnXSA/IHJlZ3VsYXJFdmVudFsnQF9MaW5rJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IHJlZ3VsYXJFdmVudFsnQF9TdGFydFRpbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEV2ZW50VHlwZS5SRUdVTEFSLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld1R5cGU6IHJlZ3VsYXJFdmVudFsnQF9WaWV3VHlwZSddID8gcmVndWxhckV2ZW50WydAX1ZpZXdUeXBlJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRMaW5rRGF0YTogcmVndWxhckV2ZW50WydAX0FkZExpbmtEYXRhJ10gPyByZWd1bGFyRXZlbnRbJ0BfQWRkTGlua0RhdGEnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFJlZ3VsYXJFdmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pIGFzIEV2ZW50W10pXHJcbiAgICAgICAgICAgICAgICAgIDogW10pLFxyXG4gICAgICAgICAgICAgIF0gYXMgRXZlbnRbXSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN0O1xyXG4gICAgICAgICAgfSwge30gYXMgQ2FsZW5kYXIpO1xyXG4gICAgICAgICAgcmVzKHsgLi4uYWxsRXZlbnRzLCBldmVudHM6IF8udW5pcUJ5KGFsbEV2ZW50cy5ldmVudHMsIChpdGVtKSA9PiBpdGVtLnRpdGxlKSB9IGFzIENhbGVuZGFyKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==