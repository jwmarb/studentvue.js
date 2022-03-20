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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50Iiwic29hcCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwidmFsaWRhdGVDcmVkZW50aWFscyIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJwcm9jZXNzUmVxdWVzdCIsIm1ldGhvZE5hbWUiLCJ2YWxpZGF0ZUVycm9ycyIsInRoZW4iLCJyZXNwb25zZSIsIlJUX0VSUk9SIiwiUmVxdWVzdEV4Y2VwdGlvbiIsImNhdGNoIiwiZG9jdW1lbnRzIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwieG1sT2JqZWN0IiwiU3R1ZGVudERvY3VtZW50RGF0YXMiLCJTdHVkZW50RG9jdW1lbnREYXRhIiwieG1sIiwiRG9jdW1lbnQiLCJyZXBvcnRDYXJkcyIsIlJDUmVwb3J0aW5nUGVyaW9kRGF0YSIsIlJDUmVwb3J0aW5nUGVyaW9kcyIsIlJDUmVwb3J0aW5nUGVyaW9kIiwiUmVwb3J0Q2FyZCIsInNjaG9vbEluZm8iLCJjaGlsZEludElEIiwiU3R1ZGVudFNjaG9vbEluZm9MaXN0aW5nIiwiU3RhZmZMaXN0cyIsIlN0YWZmTGlzdCIsInN0YWZmIiwibmFtZSIsImVtYWlsIiwic3RhZmZHdSIsImpvYlRpdGxlIiwiZXh0biIsInBob25lIiwic2Nob29sIiwiYWRkcmVzcyIsImFkZHJlc3NBbHQiLCJjaXR5IiwiemlwQ29kZSIsImFsdFBob25lIiwicHJpbmNpcGFsIiwic2NoZWR1bGUiLCJ0ZXJtSW5kZXgiLCJUZXJtSW5kZXgiLCJTdHVkZW50Q2xhc3NTY2hlZHVsZSIsIkNsYXNzTGlzdHMiLCJDbGFzc0xpc3RpbmciLCJzdHVkZW50Q2xhc3MiLCJwZXJpb2QiLCJOdW1iZXIiLCJyb29tIiwic2VjdGlvbkd1IiwidGVhY2hlciIsIlRlcm1MaXN0cyIsIlRlcm1MaXN0aW5nIiwidGVybSIsImRhdGUiLCJzdGFydCIsIkRhdGUiLCJlbmQiLCJpbmRleCIsInNjaG9vbFllYXJUZXJtQ29kZUd1IiwiZXJyb3IiLCJ0b2RheSIsIlRvZGF5U2NoZWR1bGVJbmZvRGF0YSIsIlNjaG9vbEluZm9zIiwiU2Nob29sSW5mbyIsIm1hcCIsImJlbGxTY2hlZHVsZU5hbWUiLCJjbGFzc2VzIiwiQ2xhc3NlcyIsIkNsYXNzSW5mbyIsImNvdXJzZSIsImF0dGVuZGFuY2VDb2RlIiwiQXR0ZW5kYW5jZUNvZGUiLCJlbWFpbFN1YmplY3QiLCJ1cmwiLCJ0ZXJtcyIsImF0dGVuZGFuY2UiLCJhdHRlbmRhbmNlWE1MT2JqZWN0IiwiQXR0ZW5kYW5jZSIsIkFic2VuY2VzIiwiQWJzZW5jZSIsImFic2VuY2UiLCJQZXJpb2RzIiwiUGVyaW9kIiwicmVhc29uIiwib3JnWWVhckd1Iiwibm90ZSIsImRlc2NyaXB0aW9uIiwicGVyaW9kcyIsIlRvdGFsQWN0aXZpdGllcyIsIlBlcmlvZFRvdGFsIiwicGQiLCJpIiwidG90YWwiLCJleGN1c2VkIiwiVG90YWxFeGN1c2VkIiwidGFyZGllcyIsIlRvdGFsVGFyZGllcyIsInVuZXhjdXNlZCIsIlRvdGFsVW5leGN1c2VkIiwiYWN0aXZpdGllcyIsInVuZXhjdXNlZFRhcmRpZXMiLCJUb3RhbFVuZXhjdXNlZFRhcmRpZXMiLCJ0eXBlIiwic2Nob29sTmFtZSIsImFic2VuY2VzIiwicGVyaW9kSW5mb3MiLCJncmFkZWJvb2siLCJyZXBvcnRpbmdQZXJpb2RJbmRleCIsIlJlcG9ydFBlcmlvZCIsIlhNTEZhY3RvcnkiLCJlbmNvZGVBdHRyaWJ1dGUiLCJ0b1N0cmluZyIsIkdyYWRlYm9vayIsIlJlcG9ydGluZ1BlcmlvZHMiLCJDb3Vyc2VzIiwiQ291cnNlIiwiTWFya3MiLCJNYXJrIiwibWFyayIsImNhbGN1bGF0ZWRTY29yZSIsInN0cmluZyIsInJhdyIsIndlaWdodGVkQ2F0ZWdvcmllcyIsIkFzc2lnbm1lbnRHcmFkZUNhbGMiLCJ3ZWlnaHRlZCIsImNhbGN1bGF0ZWRNYXJrIiwid2VpZ2h0IiwiZXZhbHVhdGVkIiwic3RhbmRhcmQiLCJwb2ludHMiLCJjdXJyZW50IiwicG9zc2libGUiLCJhc3NpZ25tZW50cyIsIkFzc2lnbm1lbnRzIiwiQXNzaWdubWVudCIsImFzc2lnbm1lbnQiLCJncmFkZWJvb2tJZCIsImF0b2IiLCJkdWUiLCJzY29yZSIsInZhbHVlIiwibm90ZXMiLCJ0ZWFjaGVySWQiLCJoYXNEcm9wYm94IiwiSlNPTiIsInBhcnNlIiwic3R1ZGVudElkIiwiZHJvcGJveERhdGUiLCJyZXNvdXJjZXMiLCJSZXNvdXJjZXMiLCJSZXNvdXJjZSIsInJzcmMiLCJmaWxlUnNyYyIsIlJlc291cmNlVHlwZSIsIkZJTEUiLCJmaWxlIiwidXJpIiwicmVzb3VyY2UiLCJpZCIsInVybFJzcmMiLCJVUkwiLCJwYXRoIiwidGl0bGUiLCJtYXJrcyIsInJlcG9ydGluZ1BlcmlvZCIsImZpbmQiLCJ4IiwiUmVwb3J0aW5nUGVyaW9kIiwiYXZhaWxhYmxlIiwiY291cnNlcyIsIm1lc3NhZ2VzIiwiUFhQTWVzc2FnZXNEYXRhIiwiTWVzc2FnZUxpc3RpbmdzIiwiTWVzc2FnZUxpc3RpbmciLCJtZXNzYWdlIiwiTWVzc2FnZSIsInN0dWRlbnRJbmZvIiwieG1sT2JqZWN0RGF0YSIsIlN0dWRlbnRJbmZvIiwiQWRkcmVzcyIsIkVtZXJnZW5jeUNvbnRhY3RzIiwiRW1lcmdlbmN5Q29udGFjdCIsImNvbnRhY3QiLCJob21lIiwibW9iaWxlIiwib3RoZXIiLCJ3b3JrIiwicmVsYXRpb25zaGlwIiwiVXNlckRlZmluZWRHcm91cEJveGVzIiwiVXNlckRlZmluZWRHcm91cEJveCIsImRlZmluZWRCb3giLCJVc2VyRGVmaW5lZEl0ZW1zIiwiVXNlckRlZmluZWRJdGVtIiwiaXRlbSIsInNvdXJjZSIsImVsZW1lbnQiLCJvYmplY3QiLCJ2Y0lkIiwiaXRlbXMiLCJzdHVkZW50IiwiRm9ybWF0dGVkTmFtZSIsImxhc3ROYW1lIiwiTGFzdE5hbWVHb2VzQnkiLCJuaWNrbmFtZSIsIk5pY2tOYW1lIiwiYmlydGhEYXRlIiwiQmlydGhEYXRlIiwidHJhY2siLCJUcmFjayIsImJyIiwicGhvdG8iLCJQaG90byIsImNvdW5zZWxvciIsIkNvdW5zZWxvck5hbWUiLCJDb3Vuc2Vsb3JFbWFpbCIsIkNvdW5zZWxvclN0YWZmR1UiLCJjdXJyZW50U2Nob29sIiwiQ3VycmVudFNjaG9vbCIsImRlbnRpc3QiLCJEZW50aXN0Iiwib2ZmaWNlIiwicGh5c2ljaWFuIiwiUGh5c2ljaWFuIiwiaG9zcGl0YWwiLCJQZXJtSUQiLCJPcmdZZWFyR1UiLCJQaG9uZSIsIkVNYWlsIiwiZW1lcmdlbmN5Q29udGFjdHMiLCJnZW5kZXIiLCJHZW5kZXIiLCJncmFkZSIsIkdyYWRlIiwibG9ja2VySW5mb1JlY29yZHMiLCJMb2NrZXJJbmZvUmVjb3JkcyIsImhvbWVMYW5ndWFnZSIsIkhvbWVMYW5ndWFnZSIsImhvbWVSb29tIiwiSG9tZVJvb20iLCJob21lUm9vbVRlYWNoZXIiLCJIb21lUm9vbVRjaEVNYWlsIiwiSG9tZVJvb21UY2giLCJIb21lUm9vbVRjaFN0YWZmR1UiLCJhZGRpdGlvbmFsSW5mbyIsImZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwiLCJSZXF1ZXN0RGF0ZSIsInRvSVNPU3RyaW5nIiwiY2FsZW5kYXIiLCJvcHRpb25zIiwiZGVmYXVsdE9wdGlvbnMiLCJjb25jdXJyZW5jeSIsInNjaG9vbFN0YXJ0RGF0ZSIsImludGVydmFsIiwic2Nob29sRW5kRGF0ZSIsIm1vbnRoc1dpdGhpblNjaG9vbFllYXIiLCJnZXRBbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyIiwiYWxsIiwibWVtbyIsImV2ZW50cyIsImFsbEV2ZW50cyIsInJlZHVjZSIsInByZXYiLCJzY2hvb2xEYXRlIiwiQ2FsZW5kYXJMaXN0aW5nIiwib3V0cHV0UmFuZ2UiLCJFdmVudExpc3RzIiwiRXZlbnRMaXN0IiwiZXZlbnQiLCJFdmVudFR5cGUiLCJBU1NJR05NRU5UIiwiYXNzaWdubWVudEV2ZW50IiwiYWRkTGlua0RhdGEiLCJhZ3UiLCJkZ3UiLCJsaW5rIiwic3RhcnRUaW1lIiwidmlld1R5cGUiLCJIT0xJREFZIiwiUkVHVUxBUiIsInJlZ3VsYXJFdmVudCIsInVuZGVmaW5lZCIsInJlc3QiLCJfIiwidW5pcUJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsUUFBTUEsTUFBTixTQUFxQkMsY0FBS0QsTUFBMUIsQ0FBaUM7QUFFOUNFLElBQUFBLFdBQVcsQ0FBQ0MsV0FBRCxFQUFnQ0MsT0FBaEMsRUFBaUQ7QUFDMUQsWUFBTUQsV0FBTjtBQUNBLFdBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNEO0FBRUQ7QUFDRjtBQUNBOzs7QUFDU0MsSUFBQUEsbUJBQW1CLEdBQWtCO0FBQzFDLGFBQU8sSUFBSUMsT0FBSixDQUFZLENBQUNDLEdBQUQsRUFBTUMsR0FBTixLQUFjO0FBQy9CLGNBQ0dDLGNBREgsQ0FDc0M7QUFBRUMsVUFBQUEsVUFBVSxFQUFFLFlBQWQ7QUFBNEJDLFVBQUFBLGNBQWMsRUFBRTtBQUE1QyxTQUR0QyxFQUVHQyxJQUZILENBRVNDLFFBQUQsSUFBYztBQUNsQixjQUFJQSxRQUFRLENBQUNDLFFBQVQsQ0FBa0IsQ0FBbEIsRUFBcUIsaUJBQXJCLEVBQXdDLENBQXhDLE1BQStDLG1DQUFuRDtBQUF3RlAsWUFBQUEsR0FBRztBQUEzRixpQkFDS0MsR0FBRyxDQUFDLElBQUlPLHlCQUFKLENBQXFCRixRQUFyQixDQUFELENBQUg7QUFDTixTQUxILEVBTUdHLEtBTkgsQ0FNU1IsR0FOVDtBQU9ELE9BUk0sQ0FBUDtBQVNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ1NTLElBQUFBLFNBQVMsR0FBd0I7QUFDdEMsYUFBTyxJQUFJWCxPQUFKLENBQVksQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEtBQWM7QUFDL0IsY0FDR0MsY0FESCxDQUNxQztBQUNqQ0MsVUFBQUEsVUFBVSxFQUFFLCtCQURxQjtBQUVqQ1EsVUFBQUEsUUFBUSxFQUFF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QUFNLEVBQUV3QixnQkFBRUMsTUFBRixDQUFTeEIsU0FBUyxDQUFDRCxNQUFuQixFQUE0QmpFLElBQUQ7QUFBQSxxQkFBVUEsSUFBSSxDQUFDL0IsS0FBZjtBQUFBLGFBQTNCO0FBQXhCLFdBQUQsQ0FBSDtBQUNELFNBbEVILEVBbUVHN0osS0FuRUgsQ0FtRVNSLEdBbkVUO0FBb0VELE9BaEZNLENBQVA7QUFpRkQ7O0FBcHBCNkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzLCBQYXJzZWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi8uLi91dGlscy9zb2FwL0NsaWVudC9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCBzb2FwIGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvc29hcCc7XHJcbmltcG9ydCB7IEFkZGl0aW9uYWxJbmZvLCBBZGRpdGlvbmFsSW5mb0l0ZW0sIENsYXNzU2NoZWR1bGVJbmZvLCBTY2hvb2xJbmZvLCBTdHVkZW50SW5mbyB9IGZyb20gJy4vQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBTdHVkZW50SW5mb1hNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU3R1ZGVudEluZm8nO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuLi9NZXNzYWdlL01lc3NhZ2UnO1xyXG5pbXBvcnQgeyBNZXNzYWdlWE1MT2JqZWN0IH0gZnJvbSAnLi4vTWVzc2FnZS9NZXNzYWdlLnhtbCc7XHJcbmltcG9ydCB7IEFzc2lnbm1lbnRFdmVudFhNTE9iamVjdCwgQ2FsZW5kYXJYTUxPYmplY3QsIFJlZ3VsYXJFdmVudFhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvQ2FsZW5kYXInO1xyXG5pbXBvcnQgeyBBc3NpZ25tZW50RXZlbnQsIENhbGVuZGFyLCBDYWxlbmRhck9wdGlvbnMsIEV2ZW50LCBIb2xpZGF5RXZlbnQsIFJlZ3VsYXJFdmVudCB9IGZyb20gJy4vSW50ZXJmYWNlcy9DYWxlbmRhcic7XHJcbmltcG9ydCB7IGVhY2hNb250aE9mSW50ZXJ2YWwgfSBmcm9tICdkYXRlLWZucyc7XHJcbmltcG9ydCB7IEZpbGVSZXNvdXJjZVhNTE9iamVjdCwgR3JhZGVib29rWE1MT2JqZWN0LCBVUkxSZXNvdXJjZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvR3JhZGVib29rJztcclxuaW1wb3J0IHsgQXR0ZW5kYW5jZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvQXR0ZW5kYW5jZSc7XHJcbmltcG9ydCBFdmVudFR5cGUgZnJvbSAnLi4vLi4vQ29uc3RhbnRzL0V2ZW50VHlwZSc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IEFzc2lnbm1lbnQsIEZpbGVSZXNvdXJjZSwgR3JhZGVib29rLCBNYXJrLCBVUkxSZXNvdXJjZSwgV2VpZ2h0ZWRDYXRlZ29yeSB9IGZyb20gJy4vSW50ZXJmYWNlcy9HcmFkZWJvb2snO1xyXG5pbXBvcnQgYXN5bmNQb29sIGZyb20gJ3RpbnktYXN5bmMtcG9vbCc7XHJcbmltcG9ydCBSZXNvdXJjZVR5cGUgZnJvbSAnLi4vLi4vQ29uc3RhbnRzL1Jlc291cmNlVHlwZSc7XHJcbmltcG9ydCB7IEFic2VudFBlcmlvZCwgQXR0ZW5kYW5jZSwgUGVyaW9kSW5mbyB9IGZyb20gJy4vSW50ZXJmYWNlcy9BdHRlbmRhbmNlJztcclxuaW1wb3J0IHsgU2NoZWR1bGVYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1NjaGVkdWxlJztcclxuaW1wb3J0IHsgU2NoZWR1bGUgfSBmcm9tICcuL0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgU2Nob29sSW5mb1hNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU2Nob29sSW5mbyc7XHJcbmltcG9ydCB7IFJlcG9ydENhcmRzWE1MT2JqZWN0IH0gZnJvbSAnLi4vUmVwb3J0Q2FyZC9SZXBvcnRDYXJkLnhtbCc7XHJcbmltcG9ydCB7IERvY3VtZW50WE1MT2JqZWN0IH0gZnJvbSAnLi4vRG9jdW1lbnQvRG9jdW1lbnQueG1sJztcclxuaW1wb3J0IFJlcG9ydENhcmQgZnJvbSAnLi4vUmVwb3J0Q2FyZC9SZXBvcnRDYXJkJztcclxuaW1wb3J0IERvY3VtZW50IGZyb20gJy4uL0RvY3VtZW50L0RvY3VtZW50JztcclxuaW1wb3J0IFJlcXVlc3RFeGNlcHRpb24gZnJvbSAnLi4vUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcclxuaW1wb3J0IFhNTEZhY3RvcnkgZnJvbSAnLi4vLi4vdXRpbHMvWE1MRmFjdG9yeS9YTUxGYWN0b3J5JztcclxuXHJcbi8qKlxyXG4gKiBUaGUgU3R1ZGVudFZVRSBDbGllbnQgdG8gYWNjZXNzIHRoZSBBUElcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBleHRlbmRzIHtzb2FwLkNsaWVudH1cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCBleHRlbmRzIHNvYXAuQ2xpZW50IHtcclxuICBwcml2YXRlIGhvc3RVcmw6IHN0cmluZztcclxuICBjb25zdHJ1Y3RvcihjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFscywgaG9zdFVybDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihjcmVkZW50aWFscyk7XHJcbiAgICB0aGlzLmhvc3RVcmwgPSBob3N0VXJsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVmFsaWRhdGUncyB0aGUgdXNlcidzIGNyZWRlbnRpYWxzLiBJdCB3aWxsIHRocm93IGFuIGVycm9yIGlmIGNyZWRlbnRpYWxzIGFyZSBpbmNvcnJlY3RcclxuICAgKi9cclxuICBwdWJsaWMgdmFsaWRhdGVDcmVkZW50aWFscygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8UGFyc2VkUmVxdWVzdEVycm9yPih7IG1ldGhvZE5hbWU6ICdsb2dpbiB0ZXN0JywgdmFsaWRhdGVFcnJvcnM6IGZhbHNlIH0pXHJcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uc2UuUlRfRVJST1JbMF1bJ0BfRVJST1JfTUVTU0FHRSddWzBdID09PSAnbG9naW4gdGVzdCBpcyBub3QgYSB2YWxpZCBtZXRob2QuJykgcmVzKCk7XHJcbiAgICAgICAgICBlbHNlIHJlaihuZXcgUmVxdWVzdEV4Y2VwdGlvbihyZXNwb25zZSkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHN0dWRlbnQncyBkb2N1bWVudHMgZnJvbSBzeW5lcmd5IHNlcnZlcnNcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxEb2N1bWVudFtdPn0+IFJldHVybnMgYSBsaXN0IG9mIHN0dWRlbnQgZG9jdW1lbnRzXHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBkb2N1bWVudHMgPSBhd2FpdCBjbGllbnQuZG9jdW1lbnRzKCk7XHJcbiAgICogY29uc3QgZG9jdW1lbnQgPSBkb2N1bWVudHNbMF07XHJcbiAgICogY29uc3QgZmlsZXMgPSBhd2FpdCBkb2N1bWVudC5nZXQoKTtcclxuICAgKiBjb25zdCBiYXNlNjRjb2xsZWN0aW9uID0gZmlsZXMubWFwKChmaWxlKSA9PiBmaWxlLmJhc2U2NCk7XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGRvY3VtZW50cygpOiBQcm9taXNlPERvY3VtZW50W10+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8RG9jdW1lbnRYTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRTdHVkZW50RG9jdW1lbnRJbml0aWFsRGF0YScsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICByZXMoXHJcbiAgICAgICAgICAgIHhtbE9iamVjdFsnU3R1ZGVudERvY3VtZW50cyddWzBdLlN0dWRlbnREb2N1bWVudERhdGFzWzBdLlN0dWRlbnREb2N1bWVudERhdGEubWFwKFxyXG4gICAgICAgICAgICAgICh4bWwpID0+IG5ldyBEb2N1bWVudCh4bWwsIHN1cGVyLmNyZWRlbnRpYWxzKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgYSBsaXN0IG9mIHJlcG9ydCBjYXJkc1xyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFJlcG9ydENhcmRbXT59IFJldHVybnMgYSBsaXN0IG9mIHJlcG9ydCBjYXJkcyB0aGF0IGNhbiBmZXRjaCBhIGZpbGVcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IHJlcG9ydENhcmRzID0gYXdhaXQgY2xpZW50LnJlcG9ydENhcmRzKCk7XHJcbiAgICogY29uc3QgZmlsZXMgPSBhd2FpdCBQcm9taXNlLmFsbChyZXBvcnRDYXJkcy5tYXAoKGNhcmQpID0+IGNhcmQuZ2V0KCkpKTtcclxuICAgKiBjb25zdCBiYXNlNjRhcnIgPSBmaWxlcy5tYXAoKGZpbGUpID0+IGZpbGUuYmFzZTY0KTsgLy8gW1wiSlZCRVJpMC4uLlwiLCBcImRVSW9hMS4uLlwiLCAuLi5dO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyByZXBvcnRDYXJkcygpOiBQcm9taXNlPFJlcG9ydENhcmRbXT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxSZXBvcnRDYXJkc1hNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0dldFJlcG9ydENhcmRJbml0aWFsRGF0YScsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICByZXMoXHJcbiAgICAgICAgICAgIHhtbE9iamVjdC5SQ1JlcG9ydGluZ1BlcmlvZERhdGFbMF0uUkNSZXBvcnRpbmdQZXJpb2RzWzBdLlJDUmVwb3J0aW5nUGVyaW9kLm1hcChcclxuICAgICAgICAgICAgICAoeG1sKSA9PiBuZXcgUmVwb3J0Q2FyZCh4bWwsIHN1cGVyLmNyZWRlbnRpYWxzKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHN0dWRlbnQncyBzY2hvb2wncyBpbmZvcm1hdGlvblxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFNjaG9vbEluZm8+fSBSZXR1cm5zIHRoZSBpbmZvcm1hdGlvbiBvZiB0aGUgc3R1ZGVudCdzIHNjaG9vbFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogYXdhaXQgY2xpZW50LnNjaG9vbEluZm8oKTtcclxuICAgKlxyXG4gICAqIGNsaWVudC5zY2hvb2xJbmZvKCkudGhlbigoc2Nob29sSW5mbykgPT4ge1xyXG4gICAqICBjb25zb2xlLmxvZyhfLnVuaXEoc2Nob29sSW5mby5zdGFmZi5tYXAoKHN0YWZmKSA9PiBzdGFmZi5uYW1lKSkpOyAvLyBMaXN0IGFsbCBzdGFmZiBwb3NpdGlvbnMgdXNpbmcgbG9kYXNoXHJcbiAgICogfSlcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc2Nob29sSW5mbygpOiBQcm9taXNlPFNjaG9vbEluZm8+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8U2Nob29sSW5mb1hNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRTY2hvb2xJbmZvJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SUQ6IDAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCh7IFN0dWRlbnRTY2hvb2xJbmZvTGlzdGluZzogW3htbE9iamVjdF0gfSkgPT4ge1xyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgc2Nob29sOiB7XHJcbiAgICAgICAgICAgICAgYWRkcmVzczogeG1sT2JqZWN0WydAX1NjaG9vbEFkZHJlc3MnXVswXSxcclxuICAgICAgICAgICAgICBhZGRyZXNzQWx0OiB4bWxPYmplY3RbJ0BfU2Nob29sQWRkcmVzczInXVswXSxcclxuICAgICAgICAgICAgICBjaXR5OiB4bWxPYmplY3RbJ0BfU2Nob29sQ2l0eSddWzBdLFxyXG4gICAgICAgICAgICAgIHppcENvZGU6IHhtbE9iamVjdFsnQF9TY2hvb2xaaXAnXVswXSxcclxuICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0WydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgYWx0UGhvbmU6IHhtbE9iamVjdFsnQF9QaG9uZTInXVswXSxcclxuICAgICAgICAgICAgICBwcmluY2lwYWw6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdFsnQF9QcmluY2lwYWwnXVswXSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsRW1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgIHN0YWZmR3U6IHhtbE9iamVjdFsnQF9QcmluY2lwYWxHdSddWzBdLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0YWZmOiB4bWxPYmplY3QuU3RhZmZMaXN0c1swXS5TdGFmZkxpc3QubWFwKChzdGFmZikgPT4gKHtcclxuICAgICAgICAgICAgICBuYW1lOiBzdGFmZlsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgZW1haWw6IHN0YWZmWydAX0VNYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgc3RhZmZHdTogc3RhZmZbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgIGpvYlRpdGxlOiBzdGFmZlsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgIGV4dG46IHN0YWZmWydAX0V4dG4nXVswXSxcclxuICAgICAgICAgICAgICBwaG9uZTogc3RhZmZbJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgc2NoZWR1bGUgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcGFyYW0ge251bWJlcn0gdGVybUluZGV4IFRoZSBpbmRleCBvZiB0aGUgdGVybS5cclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTY2hlZHVsZT59IFJldHVybnMgdGhlIHNjaGVkdWxlIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBhd2FpdCBzY2hlZHVsZSgwKSAvLyAtPiB7IHRlcm06IHsgaW5kZXg6IDAsIG5hbWU6ICcxc3QgUXRyIFByb2dyZXNzJyB9LCAuLi4gfVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzY2hlZHVsZSh0ZXJtSW5kZXg/OiBudW1iZXIpOiBQcm9taXNlPFNjaGVkdWxlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFNjaGVkdWxlWE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudENsYXNzTGlzdCcsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwLCAuLi4odGVybUluZGV4ICE9IG51bGwgPyB7IFRlcm1JbmRleDogdGVybUluZGV4IH0gOiB7fSkgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIHRlcm06IHtcclxuICAgICAgICAgICAgICBpbmRleDogTnVtYmVyKHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9UZXJtSW5kZXgnXVswXSksXHJcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdWydAX1Rlcm1JbmRleE5hbWUnXVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9FcnJvck1lc3NhZ2UnXVswXSxcclxuICAgICAgICAgICAgdG9kYXk6XHJcbiAgICAgICAgICAgICAgdHlwZW9mIHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5Ub2RheVNjaGVkdWxlSW5mb0RhdGFbMF0uU2Nob29sSW5mb3NbMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICA/IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5Ub2RheVNjaGVkdWxlSW5mb0RhdGFbMF0uU2Nob29sSW5mb3NbMF0uU2Nob29sSW5mby5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgKHNjaG9vbCkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNjaG9vbFsnQF9TY2hvb2xOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBiZWxsU2NoZWR1bGVOYW1lOiBzY2hvb2xbJ0BfQmVsbFNjaGVkTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlczogc2Nob29sLkNsYXNzZXNbMF0uQ2xhc3NJbmZvLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGNvdXJzZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIoY291cnNlWydAX1BlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGVuZGFuY2VDb2RlOiBjb3Vyc2UuQXR0ZW5kYW5jZUNvZGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShjb3Vyc2VbJ0BfU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKGNvdXJzZVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9DbGFzc05hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb25HdTogY291cnNlWydAX1NlY3Rpb25HVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVhY2hlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogY291cnNlWydAX1RlYWNoZXJFbWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbFN1YmplY3Q6IGNvdXJzZVsnQF9FbWFpbFN1YmplY3QnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogY291cnNlWydAX1RlYWNoZXJOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IGNvdXJzZVsnQF9TdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY291cnNlWydAX1RlYWNoZXJVUkwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBDbGFzc1NjaGVkdWxlSW5mbylcclxuICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgY2xhc3NlczogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLkNsYXNzTGlzdHNbMF0uQ2xhc3NMaXN0aW5nLm1hcCgoc3R1ZGVudENsYXNzKSA9PiAoe1xyXG4gICAgICAgICAgICAgIG5hbWU6IHN0dWRlbnRDbGFzc1snQF9Db3Vyc2VUaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKHN0dWRlbnRDbGFzc1snQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgcm9vbTogc3R1ZGVudENsYXNzWydAX1Jvb21OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgc2VjdGlvbkd1OiBzdHVkZW50Q2xhc3NbJ0BfU2VjdGlvbkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgdGVhY2hlcjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogc3R1ZGVudENsYXNzWydAX1RlYWNoZXInXVswXSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBzdHVkZW50Q2xhc3NbJ0BfVGVhY2hlckVtYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBzdGFmZkd1OiBzdHVkZW50Q2xhc3NbJ0BfVGVhY2hlclN0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICAgIHRlcm1zOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVGVybUxpc3RzWzBdLlRlcm1MaXN0aW5nLm1hcCgodGVybSkgPT4gKHtcclxuICAgICAgICAgICAgICBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUodGVybVsnQF9CZWdpbkRhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHRlcm1bJ0BfRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGluZGV4OiBOdW1iZXIodGVybVsnQF9UZXJtSW5kZXgnXVswXSksXHJcbiAgICAgICAgICAgICAgbmFtZTogdGVybVsnQF9UZXJtTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIHNjaG9vbFllYXJUZXJtQ29kZUd1OiB0ZXJtWydAX1NjaG9vbFllYXJUcm1Db2RlR1UnXVswXSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgYXR0ZW5kYW5jZSBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEF0dGVuZGFuY2U+fSBSZXR1cm5zIGFuIEF0dGVuZGFuY2Ugb2JqZWN0XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjbGllbnQuYXR0ZW5kYW5jZSgpXHJcbiAgICogIC50aGVuKGNvbnNvbGUubG9nKTsgLy8gLT4geyB0eXBlOiAnUGVyaW9kJywgcGVyaW9kOiB7Li4ufSwgc2Nob29sTmFtZTogJ1VuaXZlcnNpdHkgSGlnaCBTY2hvb2wnLCBhYnNlbmNlczogWy4uLl0sIHBlcmlvZEluZm9zOiBbLi4uXSB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGF0dGVuZGFuY2UoKTogUHJvbWlzZTxBdHRlbmRhbmNlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PEF0dGVuZGFuY2VYTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdBdHRlbmRhbmNlJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7XHJcbiAgICAgICAgICAgIGNoaWxkSW50SWQ6IDAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKGF0dGVuZGFuY2VYTUxPYmplY3QpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHhtbE9iamVjdCA9IGF0dGVuZGFuY2VYTUxPYmplY3QuQXR0ZW5kYW5jZVswXTtcclxuXHJcbiAgICAgICAgICByZXMoe1xyXG4gICAgICAgICAgICB0eXBlOiB4bWxPYmplY3RbJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgICBwZXJpb2Q6IHtcclxuICAgICAgICAgICAgICB0b3RhbDogTnVtYmVyKHhtbE9iamVjdFsnQF9QZXJpb2RDb3VudCddWzBdKSxcclxuICAgICAgICAgICAgICBzdGFydDogTnVtYmVyKHhtbE9iamVjdFsnQF9TdGFydFBlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgICBlbmQ6IE51bWJlcih4bWxPYmplY3RbJ0BfRW5kUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzY2hvb2xOYW1lOiB4bWxPYmplY3RbJ0BfU2Nob29sTmFtZSddWzBdLFxyXG4gICAgICAgICAgICBhYnNlbmNlczogeG1sT2JqZWN0LkFic2VuY2VzWzBdLkFic2VuY2UubWFwKChhYnNlbmNlKSA9PiAoe1xyXG4gICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGFic2VuY2VbJ0BfQWJzZW5jZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgcmVhc29uOiBhYnNlbmNlWydAX1JlYXNvbiddWzBdLFxyXG4gICAgICAgICAgICAgIG5vdGU6IGFic2VuY2VbJ0BfTm90ZSddWzBdLFxyXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBhYnNlbmNlWydAX0NvZGVBbGxEYXlEZXNjcmlwdGlvbiddWzBdLFxyXG4gICAgICAgICAgICAgIHBlcmlvZHM6IGFic2VuY2UuUGVyaW9kc1swXS5QZXJpb2QubWFwKFxyXG4gICAgICAgICAgICAgICAgKHBlcmlvZCkgPT5cclxuICAgICAgICAgICAgICAgICAgKHtcclxuICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihwZXJpb2RbJ0BfTnVtYmVyJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBwZXJpb2RbJ0BfUmVhc29uJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgY291cnNlOiBwZXJpb2RbJ0BfQ291cnNlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhZmY6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9TdGFmZiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgc3RhZmZHdTogcGVyaW9kWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBwZXJpb2RbJ0BfU3RhZmZFTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb3JnWWVhckd1OiBwZXJpb2RbJ0BfT3JnWWVhckdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIH0gYXMgQWJzZW50UGVyaW9kKVxyXG4gICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgICAgcGVyaW9kSW5mb3M6IHhtbE9iamVjdC5Ub3RhbEFjdGl2aXRpZXNbMF0uUGVyaW9kVG90YWwubWFwKChwZCwgaSkgPT4gKHtcclxuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihwZFsnQF9OdW1iZXInXVswXSksXHJcbiAgICAgICAgICAgICAgdG90YWw6IHtcclxuICAgICAgICAgICAgICAgIGV4Y3VzZWQ6IE51bWJlcih4bWxPYmplY3QuVG90YWxFeGN1c2VkWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgdGFyZGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbFRhcmRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgICB1bmV4Y3VzZWQ6IE51bWJlcih4bWxPYmplY3QuVG90YWxVbmV4Y3VzZWRbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsQWN0aXZpdGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICAgIHVuZXhjdXNlZFRhcmRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxVbmV4Y3VzZWRUYXJkaWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pKSBhcyBQZXJpb2RJbmZvW10sXHJcbiAgICAgICAgICB9IGFzIEF0dGVuZGFuY2UpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGdyYWRlYm9vayBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByZXBvcnRpbmdQZXJpb2RJbmRleCBUaGUgdGltZWZyYW1lIHRoYXQgdGhlIGdyYWRlYm9vayBzaG91bGQgcmV0dXJuXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8R3JhZGVib29rPn0gUmV0dXJucyBhIEdyYWRlYm9vayBvYmplY3RcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IGdyYWRlYm9vayA9IGF3YWl0IGNsaWVudC5ncmFkZWJvb2soKTtcclxuICAgKiBjb25zb2xlLmxvZyhncmFkZWJvb2spOyAvLyB7IGVycm9yOiAnJywgdHlwZTogJ1RyYWRpdGlvbmFsJywgcmVwb3J0aW5nUGVyaW9kOiB7Li4ufSwgY291cnNlczogWy4uLl0gfTtcclxuICAgKlxyXG4gICAqIGF3YWl0IGNsaWVudC5ncmFkZWJvb2soMCkgLy8gU29tZSBzY2hvb2xzIHdpbGwgaGF2ZSBSZXBvcnRpbmdQZXJpb2RJbmRleCAwIGFzIFwiMXN0IFF1YXJ0ZXIgUHJvZ3Jlc3NcIlxyXG4gICAqIGF3YWl0IGNsaWVudC5ncmFkZWJvb2soNykgLy8gU29tZSBzY2hvb2xzIHdpbGwgaGF2ZSBSZXBvcnRpbmdQZXJpb2RJbmRleCA3IGFzIFwiNHRoIFF1YXJ0ZXJcIlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBncmFkZWJvb2socmVwb3J0aW5nUGVyaW9kSW5kZXg/OiBudW1iZXIpOiBQcm9taXNlPEdyYWRlYm9vaz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxHcmFkZWJvb2tYTUxPYmplY3Q+KFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBtZXRob2ROYW1lOiAnR3JhZGVib29rJyxcclxuICAgICAgICAgICAgcGFyYW1TdHI6IHtcclxuICAgICAgICAgICAgICBjaGlsZEludElkOiAwLFxyXG4gICAgICAgICAgICAgIC4uLihyZXBvcnRpbmdQZXJpb2RJbmRleCAhPSBudWxsID8geyBSZXBvcnRQZXJpb2Q6IHJlcG9ydGluZ1BlcmlvZEluZGV4IH0gOiB7fSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKHhtbCkgPT5cclxuICAgICAgICAgICAgbmV3IFhNTEZhY3RvcnkoeG1sKVxyXG4gICAgICAgICAgICAgIC5lbmNvZGVBdHRyaWJ1dGUoJ01lYXN1cmVEZXNjcmlwdGlvbicsICdIYXNEcm9wQm94JylcclxuICAgICAgICAgICAgICAuZW5jb2RlQXR0cmlidXRlKCdNZWFzdXJlJywgJ1R5cGUnKVxyXG4gICAgICAgICAgICAgIC50b1N0cmluZygpXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3Q6IEdyYWRlYm9va1hNTE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgZXJyb3I6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfRXJyb3JNZXNzYWdlJ11bMF0sXHJcbiAgICAgICAgICAgIHR5cGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgICByZXBvcnRpbmdQZXJpb2Q6IHtcclxuICAgICAgICAgICAgICBjdXJyZW50OiB7XHJcbiAgICAgICAgICAgICAgICBpbmRleDpcclxuICAgICAgICAgICAgICAgICAgcmVwb3J0aW5nUGVyaW9kSW5kZXggPz9cclxuICAgICAgICAgICAgICAgICAgTnVtYmVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QuZmluZChcclxuICAgICAgICAgICAgICAgICAgICAgICh4KSA9PiB4WydAX0dyYWRlUGVyaW9kJ11bMF0gPT09IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0dyYWRlUGVyaW9kJ11bMF1cclxuICAgICAgICAgICAgICAgICAgICApPy5bJ0BfSW5kZXgnXVswXVxyXG4gICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0VuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfR3JhZGVQZXJpb2QnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGF2YWlsYWJsZTogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RzWzBdLlJlcG9ydFBlcmlvZC5tYXAoKHBlcmlvZCkgPT4gKHtcclxuICAgICAgICAgICAgICAgIGRhdGU6IHsgc3RhcnQ6IG5ldyBEYXRlKHBlcmlvZFsnQF9TdGFydERhdGUnXVswXSksIGVuZDogbmV3IERhdGUocGVyaW9kWydAX0VuZERhdGUnXVswXSkgfSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9HcmFkZVBlcmlvZCddWzBdLFxyXG4gICAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcihwZXJpb2RbJ0BfSW5kZXgnXVswXSksXHJcbiAgICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb3Vyc2VzOiB4bWxPYmplY3QuR3JhZGVib29rWzBdLkNvdXJzZXNbMF0uQ291cnNlLm1hcCgoY291cnNlKSA9PiAoe1xyXG4gICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKGNvdXJzZVsnQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgdGl0bGU6IGNvdXJzZVsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgIHJvb206IGNvdXJzZVsnQF9Sb29tJ11bMF0sXHJcbiAgICAgICAgICAgICAgc3RhZmY6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9TdGFmZiddWzBdLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IGNvdXJzZVsnQF9TdGFmZkVNYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBzdGFmZkd1OiBjb3Vyc2VbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbWFya3M6IGNvdXJzZS5NYXJrc1swXS5NYXJrLm1hcCgobWFyaykgPT4gKHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG1hcmtbJ0BfTWFya05hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRTY29yZToge1xyXG4gICAgICAgICAgICAgICAgICBzdHJpbmc6IG1hcmtbJ0BfQ2FsY3VsYXRlZFNjb3JlU3RyaW5nJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHJhdzogTnVtYmVyKG1hcmtbJ0BfQ2FsY3VsYXRlZFNjb3JlUmF3J11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHdlaWdodGVkQ2F0ZWdvcmllczpcclxuICAgICAgICAgICAgICAgICAgdHlwZW9mIG1hcmtbJ0dyYWRlQ2FsY3VsYXRpb25TdW1tYXJ5J11bMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgPyBtYXJrWydHcmFkZUNhbGN1bGF0aW9uU3VtbWFyeSddWzBdLkFzc2lnbm1lbnRHcmFkZUNhbGMubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAod2VpZ2h0ZWQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHdlaWdodGVkWydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRNYXJrOiB3ZWlnaHRlZFsnQF9DYWxjdWxhdGVkTWFyayddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2YWx1YXRlZDogd2VpZ2h0ZWRbJ0BfV2VpZ2h0ZWRQY3QnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmQ6IHdlaWdodGVkWydAX1dlaWdodCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBOdW1iZXIod2VpZ2h0ZWRbJ0BfUG9pbnRzJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NzaWJsZTogTnVtYmVyKHdlaWdodGVkWydAX1BvaW50c1Bvc3NpYmxlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFdlaWdodGVkQ2F0ZWdvcnkpXHJcbiAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnRzOlxyXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgbWFyay5Bc3NpZ25tZW50c1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICA/IChtYXJrLkFzc2lnbm1lbnRzWzBdLkFzc2lnbm1lbnQubWFwKChhc3NpZ25tZW50KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmFkZWJvb2tJZDogYXNzaWdubWVudFsnQF9HcmFkZWJvb2tJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBhdG9iKGFzc2lnbm1lbnRbJ0BfTWVhc3VyZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYXNzaWdubWVudFsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGR1ZTogbmV3IERhdGUoYXNzaWdubWVudFsnQF9EdWVEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFzc2lnbm1lbnRbJ0BfU2NvcmVUeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGFzc2lnbm1lbnRbJ0BfU2NvcmUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzOiBhc3NpZ25tZW50WydAX1BvaW50cyddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlczogYXNzaWdubWVudFsnQF9Ob3RlcyddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWFjaGVySWQ6IGFzc2lnbm1lbnRbJ0BfVGVhY2hlcklEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBhdG9iKGFzc2lnbm1lbnRbJ0BfTWVhc3VyZURlc2NyaXB0aW9uJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNEcm9wYm94OiBKU09OLnBhcnNlKGFzc2lnbm1lbnRbJ0BfSGFzRHJvcEJveCddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R1ZGVudElkOiBhc3NpZ25tZW50WydAX1N0dWRlbnRJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wYm94RGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0Ryb3BTdGFydERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0Ryb3BFbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZXM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAoYXNzaWdubWVudC5SZXNvdXJjZXNbMF0uUmVzb3VyY2UubWFwKChyc3JjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyc3JjWydAX1R5cGUnXVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnRmlsZSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZVJzcmMgPSByc3JjIGFzIEZpbGVSZXNvdXJjZVhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBSZXNvdXJjZVR5cGUuRklMRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaWxlUnNyY1snQF9GaWxlVHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZVJzcmNbJ0BfRmlsZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVyaTogdGhpcy5ob3N0VXJsICsgZmlsZVJzcmNbJ0BfU2VydmVyRmlsZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShmaWxlUnNyY1snQF9SZXNvdXJjZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZmlsZVJzcmNbJ0BfUmVzb3VyY2VJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZVJzcmNbJ0BfUmVzb3VyY2VOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBGaWxlUmVzb3VyY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdVUkwnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybFJzcmMgPSByc3JjIGFzIFVSTFJlc291cmNlWE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdXJsUnNyY1snQF9VUkwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBSZXNvdXJjZVR5cGUuVVJMLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSh1cmxSc3JjWydAX1Jlc291cmNlRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB1cmxSc3JjWydAX1Jlc291cmNlSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHVybFJzcmNbJ0BfUmVzb3VyY2VOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdXJsUnNyY1snQF9SZXNvdXJjZURlc2NyaXB0aW9uJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiB1cmxSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgVVJMUmVzb3VyY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWooXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFR5cGUgJHtyc3JjWydAX1R5cGUnXVswXX0gZG9lcyBub3QgZXhpc3QgYXMgYSB0eXBlLiBBZGQgaXQgdG8gdHlwZSBkZWNsYXJhdGlvbnMuYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkgYXMgKEZpbGVSZXNvdXJjZSB8IFVSTFJlc291cmNlKVtdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgIH0pKSBhcyBBc3NpZ25tZW50W10pXHJcbiAgICAgICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgICB9KSkgYXMgTWFya1tdLFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICB9IGFzIEdyYWRlYm9vayk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGEgbGlzdCBvZiBtZXNzYWdlcyBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPE1lc3NhZ2VbXT59IFJldHVybnMgYW4gYXJyYXkgb2YgbWVzc2FnZXMgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGF3YWl0IGNsaWVudC5tZXNzYWdlcygpOyAvLyAtPiBbeyBpZDogJ0U5NzJGMUJDLTk5QTAtNENEMC04RDE1LUIxODk2OEI0M0UwOCcsIHR5cGU6ICdTdHVkZW50QWN0aXZpdHknLCAuLi4gfSwgeyBpZDogJzg2RkRBMTFELTQyQzctNDI0OS1CMDAzLTk0QjE1RUIyQzhENCcsIHR5cGU6ICdTdHVkZW50QWN0aXZpdHknLCAuLi4gfV1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgbWVzc2FnZXMoKTogUHJvbWlzZTxNZXNzYWdlW10+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8TWVzc2FnZVhNTE9iamVjdD4oXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRQWFBNZXNzYWdlcycsXHJcbiAgICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAoeG1sKSA9PiBuZXcgWE1MRmFjdG9yeSh4bWwpLmVuY29kZUF0dHJpYnV0ZSgnQ29udGVudCcsICdSZWFkJykudG9TdHJpbmcoKVxyXG4gICAgICAgIClcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICByZXMoXHJcbiAgICAgICAgICAgIHhtbE9iamVjdC5QWFBNZXNzYWdlc0RhdGFbMF0uTWVzc2FnZUxpc3RpbmdzWzBdLk1lc3NhZ2VMaXN0aW5nLm1hcChcclxuICAgICAgICAgICAgICAobWVzc2FnZSkgPT4gbmV3IE1lc3NhZ2UobWVzc2FnZSwgc3VwZXIuY3JlZGVudGlhbHMsIHRoaXMuaG9zdFVybClcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBpbmZvIG9mIGEgc3R1ZGVudFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN0dWRlbnRJbmZvPn0gU3R1ZGVudEluZm8gb2JqZWN0XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBzdHVkZW50SW5mbygpLnRoZW4oY29uc29sZS5sb2cpIC8vIC0+IHsgc3R1ZGVudDogeyBuYW1lOiAnRXZhbiBEYXZpcycsIG5pY2tuYW1lOiAnJywgbGFzdE5hbWU6ICdEYXZpcycgfSwgLi4ufVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzdHVkZW50SW5mbygpOiBQcm9taXNlPFN0dWRlbnRJbmZvPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8U3R1ZGVudEluZm8+KChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxTdHVkZW50SW5mb1hNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRJbmZvJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3REYXRhKSA9PiB7XHJcbiAgICAgICAgICByZXMoe1xyXG4gICAgICAgICAgICBzdHVkZW50OiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Gb3JtYXR0ZWROYW1lWzBdLFxyXG4gICAgICAgICAgICAgIGxhc3ROYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uTGFzdE5hbWVHb2VzQnlbMF0sXHJcbiAgICAgICAgICAgICAgbmlja25hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5OaWNrTmFtZVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYmlydGhEYXRlOiBuZXcgRGF0ZSh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQmlydGhEYXRlWzBdKSxcclxuICAgICAgICAgICAgdHJhY2s6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5UcmFja1swXSxcclxuICAgICAgICAgICAgYWRkcmVzczogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLmJyWzBdLFxyXG4gICAgICAgICAgICBwaG90bzogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBob3RvWzBdLFxyXG4gICAgICAgICAgICBjb3Vuc2Vsb3I6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ291bnNlbG9yTmFtZVswXSxcclxuICAgICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvckVtYWlsWzBdLFxyXG4gICAgICAgICAgICAgIHN0YWZmR3U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Db3Vuc2Vsb3JTdGFmZkdVWzBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjdXJyZW50U2Nob29sOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ3VycmVudFNjaG9vbFswXSxcclxuICAgICAgICAgICAgZGVudGlzdDoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5EZW50aXN0WzBdWydAX05hbWUnXVswXSxcclxuICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICBleHRuOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uRGVudGlzdFswXVsnQF9FeHRuJ11bMF0sXHJcbiAgICAgICAgICAgICAgb2ZmaWNlOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uRGVudGlzdFswXVsnQF9PZmZpY2UnXVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGh5c2ljaWFuOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5bMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICBleHRuOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGh5c2ljaWFuWzBdWydAX0V4dG4nXVswXSxcclxuICAgICAgICAgICAgICBob3NwaXRhbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9Ib3NwaXRhbCddWzBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpZDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QZXJtSURbMF0sXHJcbiAgICAgICAgICAgIG9yZ1llYXJHdTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLk9yZ1llYXJHVVswXSxcclxuICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaG9uZVswXSxcclxuICAgICAgICAgICAgZW1haWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5FTWFpbFswXSxcclxuICAgICAgICAgICAgZW1lcmdlbmN5Q29udGFjdHM6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5FbWVyZ2VuY3lDb250YWN0c1swXS5FbWVyZ2VuY3lDb250YWN0Lm1hcChcclxuICAgICAgICAgICAgICAoY29udGFjdCkgPT4gKHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IGNvbnRhY3RbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgICAgICAgICAgaG9tZTogY29udGFjdFsnQF9Ib21lUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgbW9iaWxlOiBjb250YWN0WydAX01vYmlsZVBob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIG90aGVyOiBjb250YWN0WydAX090aGVyUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgd29yazogY29udGFjdFsnQF9Xb3JrUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6IGNvbnRhY3RbJ0BfUmVsYXRpb25zaGlwJ11bMF0sXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgZ2VuZGVyOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkdlbmRlclswXSxcclxuICAgICAgICAgICAgZ3JhZGU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uR3JhZGVbMF0sXHJcbiAgICAgICAgICAgIGxvY2tlckluZm9SZWNvcmRzOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkxvY2tlckluZm9SZWNvcmRzWzBdLFxyXG4gICAgICAgICAgICBob21lTGFuZ3VhZ2U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lTGFuZ3VhZ2VbMF0sXHJcbiAgICAgICAgICAgIGhvbWVSb29tOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZVJvb21bMF0sXHJcbiAgICAgICAgICAgIGhvbWVSb29tVGVhY2hlcjoge1xyXG4gICAgICAgICAgICAgIGVtYWlsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZVJvb21UY2hFTWFpbFswXSxcclxuICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZVJvb21UY2hbMF0sXHJcbiAgICAgICAgICAgICAgc3RhZmZHdTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoU3RhZmZHVVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWRkaXRpb25hbEluZm86IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94ZXNbMF0uVXNlckRlZmluZWRHcm91cEJveC5tYXAoXHJcbiAgICAgICAgICAgICAgKGRlZmluZWRCb3gpID0+ICh7XHJcbiAgICAgICAgICAgICAgICBpZDogZGVmaW5lZEJveFsnQF9Hcm91cEJveElEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBkZWZpbmVkQm94WydAX0dyb3VwQm94TGFiZWwnXVswXSxcclxuICAgICAgICAgICAgICAgIHZjSWQ6IGRlZmluZWRCb3hbJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgaXRlbXM6IGRlZmluZWRCb3guVXNlckRlZmluZWRJdGVtc1swXS5Vc2VyRGVmaW5lZEl0ZW0ubWFwKChpdGVtKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBpdGVtWydAX1NvdXJjZUVsZW1lbnQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IGl0ZW1bJ0BfU291cmNlT2JqZWN0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIHZjSWQ6IGl0ZW1bJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbVsnQF9WYWx1ZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiBpdGVtWydAX0l0ZW1UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB9KSkgYXMgQWRkaXRpb25hbEluZm9JdGVtW10sXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKSBhcyBBZGRpdGlvbmFsSW5mb1tdLFxyXG4gICAgICAgICAgfSBhcyBTdHVkZW50SW5mbyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGU6IERhdGUpIHtcclxuICAgIHJldHVybiBzdXBlci5wcm9jZXNzUmVxdWVzdDxDYWxlbmRhclhNTE9iamVjdD4oe1xyXG4gICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudENhbGVuZGFyJyxcclxuICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgUmVxdWVzdERhdGU6IGRhdGUudG9JU09TdHJpbmcoKSB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Q2FsZW5kYXJPcHRpb25zfSBvcHRpb25zIE9wdGlvbnMgdG8gcHJvdmlkZSBmb3IgY2FsZW5kYXIgbWV0aG9kLiBBbiBpbnRlcnZhbCBpcyByZXF1aXJlZC5cclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxDYWxlbmRhcj59IFJldHVybnMgYSBDYWxlbmRhciBvYmplY3RcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNsaWVudC5jYWxlbmRhcih7IGludGVydmFsOiB7IHN0YXJ0OiBuZXcgRGF0ZSgnNS8xLzIwMjInKSwgZW5kOiBuZXcgRGF0ZSgnOC8xLzIwMjEnKSB9LCBjb25jdXJyZW5jeTogbnVsbCB9KTsgLy8gLT4gTGltaXRsZXNzIGNvbmN1cnJlbmN5IChub3QgcmVjb21tZW5kZWQpXHJcbiAgICpcclxuICAgKiBjb25zdCBjYWxlbmRhciA9IGF3YWl0IGNsaWVudC5jYWxlbmRhcih7IGludGVydmFsOiB7IC4uLiB9fSk7XHJcbiAgICogY29uc29sZS5sb2coY2FsZW5kYXIpOyAvLyAtPiB7IHNjaG9vbERhdGU6IHsuLi59LCBvdXRwdXRSYW5nZTogey4uLn0sIGV2ZW50czogWy4uLl0gfVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBjYWxlbmRhcihvcHRpb25zOiBDYWxlbmRhck9wdGlvbnMpOiBQcm9taXNlPENhbGVuZGFyPiB7XHJcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogQ2FsZW5kYXJPcHRpb25zID0ge1xyXG4gICAgICBjb25jdXJyZW5jeTogNyxcclxuICAgICAgLi4ub3B0aW9ucyxcclxuICAgIH07XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNjaG9vbFN0YXJ0RGF0ZTogRGF0ZSB8IG51bWJlciA9IG9wdGlvbnMuaW50ZXJ2YWwuc3RhcnQ7XHJcbiAgICAgIGNvbnN0IHNjaG9vbEVuZERhdGU6IERhdGUgfCBudW1iZXIgPSBvcHRpb25zLmludGVydmFsLmVuZDtcclxuXHJcbiAgICAgIGNvbnN0IG1vbnRoc1dpdGhpblNjaG9vbFllYXIgPSBlYWNoTW9udGhPZkludGVydmFsKHsgc3RhcnQ6IHNjaG9vbFN0YXJ0RGF0ZSwgZW5kOiBzY2hvb2xFbmREYXRlIH0pO1xyXG4gICAgICBjb25zdCBnZXRBbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyID0gKCk6IFByb21pc2U8Q2FsZW5kYXJYTUxPYmplY3RbXT4gPT5cclxuICAgICAgICBkZWZhdWx0T3B0aW9ucy5jb25jdXJyZW5jeSA9PSBudWxsXHJcbiAgICAgICAgICA/IFByb21pc2UuYWxsKG1vbnRoc1dpdGhpblNjaG9vbFllYXIubWFwKChkYXRlKSA9PiB0aGlzLmZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwoZGF0ZSkpKVxyXG4gICAgICAgICAgOiBhc3luY1Bvb2woZGVmYXVsdE9wdGlvbnMuY29uY3VycmVuY3ksIG1vbnRoc1dpdGhpblNjaG9vbFllYXIsIChkYXRlKSA9PlxyXG4gICAgICAgICAgICAgIHRoaXMuZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICBsZXQgbWVtbzogQ2FsZW5kYXIgfCBudWxsID0gbnVsbDtcclxuICAgICAgZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhcigpXHJcbiAgICAgICAgLnRoZW4oKGV2ZW50cykgPT4ge1xyXG4gICAgICAgICAgY29uc3QgYWxsRXZlbnRzID0gZXZlbnRzLnJlZHVjZSgocHJldiwgZXZlbnRzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtZW1vID09IG51bGwpXHJcbiAgICAgICAgICAgICAgbWVtbyA9IHtcclxuICAgICAgICAgICAgICAgIHNjaG9vbERhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF1bJ0BfU2Nob29sQmVnRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEVuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0UmFuZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IHNjaG9vbFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICAgICAgZW5kOiBzY2hvb2xFbmREYXRlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGV2ZW50czogW10sXHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdDogQ2FsZW5kYXIgPSB7XHJcbiAgICAgICAgICAgICAgLi4ubWVtbywgLy8gVGhpcyBpcyB0byBwcmV2ZW50IHJlLWluaXRpYWxpemluZyBEYXRlIG9iamVjdHMgaW4gb3JkZXIgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxyXG4gICAgICAgICAgICAgIGV2ZW50czogW1xyXG4gICAgICAgICAgICAgICAgLi4uKHByZXYuZXZlbnRzID8gcHJldi5ldmVudHMgOiBbXSksXHJcbiAgICAgICAgICAgICAgICAuLi4oZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXS5FdmVudExpc3RzWzBdLkV2ZW50TGlzdC5tYXAoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnRbJ0BfRGF5VHlwZSddWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuQVNTSUdOTUVOVDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNzaWdubWVudEV2ZW50ID0gZXZlbnQgYXMgQXNzaWdubWVudEV2ZW50WE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGFzc2lnbm1lbnRFdmVudFsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRMaW5rRGF0YTogYXNzaWdubWVudEV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFndTogYXNzaWdubWVudEV2ZW50WydAX0FHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShhc3NpZ25tZW50RXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGd1OiBhc3NpZ25tZW50RXZlbnRbJ0BfREdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGFzc2lnbm1lbnRFdmVudFsnQF9MaW5rJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogYXNzaWdubWVudEV2ZW50WydAX1N0YXJ0VGltZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuQVNTSUdOTUVOVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlld1R5cGU6IGFzc2lnbm1lbnRFdmVudFsnQF9WaWV3VHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgfSBhcyBBc3NpZ25tZW50RXZlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLkhPTElEQVk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBldmVudFsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuSE9MSURBWSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBldmVudFsnQF9TdGFydFRpbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgIH0gYXMgSG9saWRheUV2ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5SRUdVTEFSOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWd1bGFyRXZlbnQgPSBldmVudCBhcyBSZWd1bGFyRXZlbnRYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogcmVndWxhckV2ZW50WydAX1RpdGxlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFndTogcmVndWxhckV2ZW50WydAX0FHVSddID8gcmVndWxhckV2ZW50WydAX0FHVSddIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShyZWd1bGFyRXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHJlZ3VsYXJFdmVudFsnQF9FdnREZXNjcmlwdGlvbiddID8gcmVndWxhckV2ZW50WydAX0V2dERlc2NyaXB0aW9uJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRndTogcmVndWxhckV2ZW50WydAX0RHVSddID8gcmVndWxhckV2ZW50WydAX0RHVSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiByZWd1bGFyRXZlbnRbJ0BfTGluayddID8gcmVndWxhckV2ZW50WydAX0xpbmsnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiByZWd1bGFyRXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEV2ZW50VHlwZS5SRUdVTEFSLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3VHlwZTogcmVndWxhckV2ZW50WydAX1ZpZXdUeXBlJ10gPyByZWd1bGFyRXZlbnRbJ0BfVmlld1R5cGUnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkTGlua0RhdGE6IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddID8gcmVndWxhckV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICB9IGFzIFJlZ3VsYXJFdmVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pIGFzIEV2ZW50W10pLFxyXG4gICAgICAgICAgICAgIF0gYXMgRXZlbnRbXSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN0O1xyXG4gICAgICAgICAgfSwge30gYXMgQ2FsZW5kYXIpO1xyXG4gICAgICAgICAgcmVzKHsgLi4uYWxsRXZlbnRzLCBldmVudHM6IF8udW5pcUJ5KGFsbEV2ZW50cy5ldmVudHMsIChpdGVtKSA9PiBpdGVtLnRpdGxlKSB9IGFzIENhbGVuZGFyKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==