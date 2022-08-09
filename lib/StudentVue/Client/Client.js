(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/soap/soap", "../Message/Message", "date-fns", "../../Constants/EventType", "lodash", "tiny-async-pool", "../../Constants/ResourceType", "../ReportCard/ReportCard", "../Document/Document", "../RequestException/RequestException", "../../utils/XMLFactory/XMLFactory", "../../utils/cache/cache"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/soap/soap"), require("../Message/Message"), require("date-fns"), require("../../Constants/EventType"), require("lodash"), require("tiny-async-pool"), require("../../Constants/ResourceType"), require("../ReportCard/ReportCard"), require("../Document/Document"), require("../RequestException/RequestException"), require("../../utils/XMLFactory/XMLFactory"), require("../../utils/cache/cache"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.soap, global.Message, global.dateFns, global.EventType, global.lodash, global.tinyAsyncPool, global.ResourceType, global.ReportCard, global.Document, global.RequestException, global.XMLFactory, global.cache);
    global.Client = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _soap, _Message, _dateFns, _EventType, _lodash, _tinyAsyncPool, _ResourceType, _ReportCard, _Document, _RequestException, _XMLFactory, _cache) {
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
  _cache = _interopRequireDefault(_cache);

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
            absences: xmlObject.Absences[0].Absence ? xmlObject.Absences[0].Absence.map(absence => {
              return {
                date: new Date(absence['@_AbsenceDate'][0]),
                reason: absence['@_Reason'][0],
                note: absence['@_Note'][0],
                description: absence['@_CodeAllDayDescription'][0],
                periods: absence.Periods[0].Period.map(period => {
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
                })
              };
            }) : [],
            periodInfos: _r6
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
          var _a7 = xmlObject.Gradebook[0].ReportingPeriods[0].ReportPeriod;

          var _f7 = period => {
            return {
              date: {
                start: new Date(period['@_StartDate'][0]),
                end: new Date(period['@_EndDate'][0])
              },
              name: period['@_GradePeriod'][0],
              index: Number(period['@_Index'][0])
            };
          };

          var _r7 = [];

          for (var _i7 = 0; _i7 < _a7.length; _i7++) {
            _r7.push(_f7(_a7[_i7], _i7, _a7));
          }

          var _a8 = xmlObject.Gradebook[0].Courses[0].Course;

          var _f8 = course => {
            var _a9 = course.Marks[0].Mark;

            var _f9 = mark => {
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
                    name: decodeURI(assignment['@_Measure'][0]),
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
                    description: decodeURI(assignment['@_MeasureDescription'][0]),
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

            var _r9 = [];

            for (var _i9 = 0; _i9 < _a9.length; _i9++) {
              _r9.push(_f9(_a9[_i9], _i9, _a9));
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
              marks: _r9
            };
          };

          var _r8 = [];

          for (var _i8 = 0; _i8 < _a8.length; _i8++) {
            _r8.push(_f8(_a8[_i8], _i8, _a8));
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
              available: _r7
            },
            courses: _r8
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
          var _a10 = xmlObject.PXPMessagesData[0].MessageListings[0].MessageListing;

          var _f10 = message => {
            return new _Message.default(message, super.credentials, this.hostUrl);
          };

          var _r10 = [];

          for (var _i10 = 0; _i10 < _a10.length; _i10++) {
            _r10.push(_f10(_a10[_i10], _i10, _a10));
          }

          res(_r10);
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
          res({
            student: {
              name: xmlObjectData.StudentInfo[0].FormattedName[0],
              lastName: xmlObjectData.StudentInfo[0].Address[0].LastNameGoesBy[0],
              nickname: xmlObjectData.StudentInfo[0].Address[0].NickName[0]
            },
            birthDate: new Date(xmlObjectData.StudentInfo[0].Address[0].BirthDate[0]),
            track: this.optional(xmlObjectData.StudentInfo[0].Address[0].Track),
            address: this.optional(xmlObjectData.StudentInfo[0].Address[0].br),
            photo: this.optional(xmlObjectData.StudentInfo[0].Address[0].Photo),
            counselor: xmlObjectData.StudentInfo[0].Address[0].CounselorName && xmlObjectData.StudentInfo[0].Address[0].CounselorEmail && xmlObjectData.StudentInfo[0].Address[0].CounselorStaffGU ? {
              name: xmlObjectData.StudentInfo[0].Address[0].CounselorName[0],
              email: xmlObjectData.StudentInfo[0].Address[0].CounselorEmail[0],
              staffGu: xmlObjectData.StudentInfo[0].Address[0].CounselorStaffGU[0]
            } : undefined,
            currentSchool: xmlObjectData.StudentInfo[0].Address[0].CurrentSchool[0],
            dentist: xmlObjectData.StudentInfo[0].Address[0].Dentist ? {
              name: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Name'][0],
              phone: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Phone'][0],
              extn: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Extn'][0],
              office: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Office'][0]
            } : undefined,
            physician: xmlObjectData.StudentInfo[0].Address[0].Physician ? {
              name: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Name'][0],
              phone: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Phone'][0],
              extn: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Extn'][0],
              hospital: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Hospital'][0]
            } : undefined,
            id: this.optional(xmlObjectData.StudentInfo[0].PermID),
            orgYearGu: this.optional(xmlObjectData.StudentInfo[0].Address[0].OrgYearGU),
            phone: this.optional(xmlObjectData.StudentInfo[0].Address[0].Phone),
            email: this.optional(xmlObjectData.StudentInfo[0].Address[0].EMail),
            emergencyContacts: xmlObjectData.StudentInfo[0].Address[0].EmergencyContacts ? xmlObjectData.StudentInfo[0].Address[0].EmergencyContacts[0].EmergencyContact.map(contact => {
              return {
                name: this.optional(contact['@_Name']),
                phone: {
                  home: this.optional(contact['@_HomePhone']),
                  mobile: this.optional(contact['@_MobilePhone']),
                  other: this.optional(contact['@_OtherPhone']),
                  work: this.optional(contact['@_WorkPhone'])
                },
                relationship: this.optional(contact['@_Relationship'])
              };
            }) : [],
            gender: this.optional(xmlObjectData.StudentInfo[0].Gender),
            grade: this.optional(xmlObjectData.StudentInfo[0].Grade),
            lockerInfoRecords: this.optional(xmlObjectData.StudentInfo[0].LockerInfoRecords),
            homeLanguage: this.optional(xmlObjectData.StudentInfo[0].Address[0].HomeLanguage),
            homeRoom: this.optional(xmlObjectData.StudentInfo[0].Address[0].HomeRoom),
            homeRoomTeacher: {
              email: this.optional(xmlObjectData.StudentInfo[0].Address[0].HomeRoomTchEMail),
              name: this.optional(xmlObjectData.StudentInfo[0].Address[0].HomeRoomTch),
              staffGu: this.optional(xmlObjectData.StudentInfo[0].Address[0].HomeRoomTchStaffGU)
            },
            additionalInfo: xmlObjectData.StudentInfo[0].Address[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox ? xmlObjectData.StudentInfo[0].Address[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox.map(definedBox => {
              return {
                id: definedBox['@_GroupBoxID'][0],
                type: definedBox['@_GroupBoxLabel'][0],
                vcId: definedBox['@_VCID'][0],
                items: definedBox.UserDefinedItems[0].UserDefinedItem.map(item => {
                  return {
                    source: {
                      element: item['@_SourceElement'][0],
                      object: item['@_SourceObject'][0]
                    },
                    vcId: item['@_VCID'][0],
                    value: item['@_Value'][0],
                    type: item['@_ItemType'][0]
                  };
                })
              };
            }) : []
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

    optional(xmlArr) {
      return xmlArr ? xmlArr[0] : undefined;
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


    async calendar(options = {}) {
      const defaultOptions = {
        concurrency: 7,
        ...options
      };
      const cal = await _cache.default.memo(() => {
        return this.fetchEventsWithinInterval(new Date());
      });
      const schoolEndDate = options.interval?.end ?? new Date(cal.CalendarListing[0]['@_SchoolEndDate'][0]);
      const schoolStartDate = options.interval?.start ?? new Date(cal.CalendarListing[0]['@_SchoolBegDate'][0]);
      return new Promise((res, rej) => {
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
                        title: decodeURI(assignmentEvent['@_Title'][0]),
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
                        title: decodeURI(event['@_Title'][0]),
                        type: _EventType.default.HOLIDAY,
                        startTime: event['@_StartTime'][0],
                        date: new Date(event['@_Date'][0])
                      };
                    }

                  case _EventType.default.REGULAR:
                    {
                      const regularEvent = event;
                      return {
                        title: decodeURI(regularEvent['@_Title'][0]),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50Iiwic29hcCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwidmFsaWRhdGVDcmVkZW50aWFscyIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJwcm9jZXNzUmVxdWVzdCIsIm1ldGhvZE5hbWUiLCJ2YWxpZGF0ZUVycm9ycyIsInRoZW4iLCJyZXNwb25zZSIsIlJUX0VSUk9SIiwiUmVxdWVzdEV4Y2VwdGlvbiIsImNhdGNoIiwiZG9jdW1lbnRzIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwieG1sT2JqZWN0IiwiU3R1ZGVudERvY3VtZW50RGF0YXMiLCJTdHVkZW50RG9jdW1lbnREYXRhIiwieG1sIiwiRG9jdW1lbnQiLCJyZXBvcnRDYXJkcyIsIlJDUmVwb3J0aW5nUGVyaW9kRGF0YSIsIlJDUmVwb3J0aW5nUGVyaW9kcyIsIlJDUmVwb3J0aW5nUGVyaW9kIiwiUmVwb3J0Q2FyZCIsInNjaG9vbEluZm8iLCJjaGlsZEludElEIiwiU3R1ZGVudFNjaG9vbEluZm9MaXN0aW5nIiwiU3RhZmZMaXN0cyIsIlN0YWZmTGlzdCIsInN0YWZmIiwibmFtZSIsImVtYWlsIiwic3RhZmZHdSIsImpvYlRpdGxlIiwiZXh0biIsInBob25lIiwic2Nob29sIiwiYWRkcmVzcyIsImFkZHJlc3NBbHQiLCJjaXR5IiwiemlwQ29kZSIsImFsdFBob25lIiwicHJpbmNpcGFsIiwic2NoZWR1bGUiLCJ0ZXJtSW5kZXgiLCJUZXJtSW5kZXgiLCJTdHVkZW50Q2xhc3NTY2hlZHVsZSIsIkNsYXNzTGlzdHMiLCJDbGFzc0xpc3RpbmciLCJzdHVkZW50Q2xhc3MiLCJwZXJpb2QiLCJOdW1iZXIiLCJyb29tIiwic2VjdGlvbkd1IiwidGVhY2hlciIsIlRlcm1MaXN0cyIsIlRlcm1MaXN0aW5nIiwidGVybSIsImRhdGUiLCJzdGFydCIsIkRhdGUiLCJlbmQiLCJpbmRleCIsInNjaG9vbFllYXJUZXJtQ29kZUd1IiwiZXJyb3IiLCJ0b2RheSIsIlRvZGF5U2NoZWR1bGVJbmZvRGF0YSIsIlNjaG9vbEluZm9zIiwiU2Nob29sSW5mbyIsIm1hcCIsImJlbGxTY2hlZHVsZU5hbWUiLCJjbGFzc2VzIiwiQ2xhc3NlcyIsIkNsYXNzSW5mbyIsImNvdXJzZSIsImF0dGVuZGFuY2VDb2RlIiwiQXR0ZW5kYW5jZUNvZGUiLCJlbWFpbFN1YmplY3QiLCJ1cmwiLCJ0aW1lIiwibm93IiwidGVybXMiLCJhdHRlbmRhbmNlIiwiYXR0ZW5kYW5jZVhNTE9iamVjdCIsIkF0dGVuZGFuY2UiLCJUb3RhbEFjdGl2aXRpZXMiLCJQZXJpb2RUb3RhbCIsInBkIiwiaSIsInRvdGFsIiwiZXhjdXNlZCIsIlRvdGFsRXhjdXNlZCIsInRhcmRpZXMiLCJUb3RhbFRhcmRpZXMiLCJ1bmV4Y3VzZWQiLCJUb3RhbFVuZXhjdXNlZCIsImFjdGl2aXRpZXMiLCJ1bmV4Y3VzZWRUYXJkaWVzIiwiVG90YWxVbmV4Y3VzZWRUYXJkaWVzIiwidHlwZSIsInNjaG9vbE5hbWUiLCJhYnNlbmNlcyIsIkFic2VuY2VzIiwiQWJzZW5jZSIsImFic2VuY2UiLCJyZWFzb24iLCJub3RlIiwiZGVzY3JpcHRpb24iLCJwZXJpb2RzIiwiUGVyaW9kcyIsIlBlcmlvZCIsIm9yZ1llYXJHdSIsInBlcmlvZEluZm9zIiwiZ3JhZGVib29rIiwicmVwb3J0aW5nUGVyaW9kSW5kZXgiLCJSZXBvcnRQZXJpb2QiLCJYTUxGYWN0b3J5IiwiZW5jb2RlQXR0cmlidXRlIiwidG9TdHJpbmciLCJHcmFkZWJvb2siLCJSZXBvcnRpbmdQZXJpb2RzIiwiQ291cnNlcyIsIkNvdXJzZSIsIk1hcmtzIiwiTWFyayIsIm1hcmsiLCJjYWxjdWxhdGVkU2NvcmUiLCJzdHJpbmciLCJyYXciLCJ3ZWlnaHRlZENhdGVnb3JpZXMiLCJBc3NpZ25tZW50R3JhZGVDYWxjIiwid2VpZ2h0ZWQiLCJjYWxjdWxhdGVkTWFyayIsIndlaWdodCIsImV2YWx1YXRlZCIsInN0YW5kYXJkIiwicG9pbnRzIiwiY3VycmVudCIsInBvc3NpYmxlIiwiYXNzaWdubWVudHMiLCJBc3NpZ25tZW50cyIsIkFzc2lnbm1lbnQiLCJhc3NpZ25tZW50IiwiZ3JhZGVib29rSWQiLCJkZWNvZGVVUkkiLCJkdWUiLCJzY29yZSIsInZhbHVlIiwibm90ZXMiLCJ0ZWFjaGVySWQiLCJoYXNEcm9wYm94IiwiSlNPTiIsInBhcnNlIiwic3R1ZGVudElkIiwiZHJvcGJveERhdGUiLCJyZXNvdXJjZXMiLCJSZXNvdXJjZXMiLCJSZXNvdXJjZSIsInJzcmMiLCJmaWxlUnNyYyIsIlJlc291cmNlVHlwZSIsIkZJTEUiLCJmaWxlIiwidXJpIiwicmVzb3VyY2UiLCJpZCIsInVybFJzcmMiLCJVUkwiLCJwYXRoIiwidGl0bGUiLCJtYXJrcyIsInJlcG9ydGluZ1BlcmlvZCIsImZpbmQiLCJ4IiwiUmVwb3J0aW5nUGVyaW9kIiwiYXZhaWxhYmxlIiwiY291cnNlcyIsIm1lc3NhZ2VzIiwiUFhQTWVzc2FnZXNEYXRhIiwiTWVzc2FnZUxpc3RpbmdzIiwiTWVzc2FnZUxpc3RpbmciLCJtZXNzYWdlIiwiTWVzc2FnZSIsInN0dWRlbnRJbmZvIiwieG1sT2JqZWN0RGF0YSIsInN0dWRlbnQiLCJTdHVkZW50SW5mbyIsIkZvcm1hdHRlZE5hbWUiLCJsYXN0TmFtZSIsIkFkZHJlc3MiLCJMYXN0TmFtZUdvZXNCeSIsIm5pY2tuYW1lIiwiTmlja05hbWUiLCJiaXJ0aERhdGUiLCJCaXJ0aERhdGUiLCJ0cmFjayIsIm9wdGlvbmFsIiwiVHJhY2siLCJiciIsInBob3RvIiwiUGhvdG8iLCJjb3Vuc2Vsb3IiLCJDb3Vuc2Vsb3JOYW1lIiwiQ291bnNlbG9yRW1haWwiLCJDb3Vuc2Vsb3JTdGFmZkdVIiwidW5kZWZpbmVkIiwiY3VycmVudFNjaG9vbCIsIkN1cnJlbnRTY2hvb2wiLCJkZW50aXN0IiwiRGVudGlzdCIsIm9mZmljZSIsInBoeXNpY2lhbiIsIlBoeXNpY2lhbiIsImhvc3BpdGFsIiwiUGVybUlEIiwiT3JnWWVhckdVIiwiUGhvbmUiLCJFTWFpbCIsImVtZXJnZW5jeUNvbnRhY3RzIiwiRW1lcmdlbmN5Q29udGFjdHMiLCJFbWVyZ2VuY3lDb250YWN0IiwiY29udGFjdCIsImhvbWUiLCJtb2JpbGUiLCJvdGhlciIsIndvcmsiLCJyZWxhdGlvbnNoaXAiLCJnZW5kZXIiLCJHZW5kZXIiLCJncmFkZSIsIkdyYWRlIiwibG9ja2VySW5mb1JlY29yZHMiLCJMb2NrZXJJbmZvUmVjb3JkcyIsImhvbWVMYW5ndWFnZSIsIkhvbWVMYW5ndWFnZSIsImhvbWVSb29tIiwiSG9tZVJvb20iLCJob21lUm9vbVRlYWNoZXIiLCJIb21lUm9vbVRjaEVNYWlsIiwiSG9tZVJvb21UY2giLCJIb21lUm9vbVRjaFN0YWZmR1UiLCJhZGRpdGlvbmFsSW5mbyIsIlVzZXJEZWZpbmVkR3JvdXBCb3hlcyIsIlVzZXJEZWZpbmVkR3JvdXBCb3giLCJkZWZpbmVkQm94IiwidmNJZCIsIml0ZW1zIiwiVXNlckRlZmluZWRJdGVtcyIsIlVzZXJEZWZpbmVkSXRlbSIsIml0ZW0iLCJzb3VyY2UiLCJlbGVtZW50Iiwib2JqZWN0IiwiZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbCIsIlJlcXVlc3REYXRlIiwidG9JU09TdHJpbmciLCJ4bWxBcnIiLCJjYWxlbmRhciIsIm9wdGlvbnMiLCJkZWZhdWx0T3B0aW9ucyIsImNvbmN1cnJlbmN5IiwiY2FsIiwiY2FjaGUiLCJtZW1vIiwic2Nob29sRW5kRGF0ZSIsImludGVydmFsIiwiQ2FsZW5kYXJMaXN0aW5nIiwic2Nob29sU3RhcnREYXRlIiwibW9udGhzV2l0aGluU2Nob29sWWVhciIsImdldEFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIiLCJhbGwiLCJldmVudHMiLCJhbGxFdmVudHMiLCJyZWR1Y2UiLCJwcmV2Iiwic2Nob29sRGF0ZSIsIm91dHB1dFJhbmdlIiwicmVzdCIsIkV2ZW50TGlzdHMiLCJFdmVudExpc3QiLCJldmVudCIsIkV2ZW50VHlwZSIsIkFTU0lHTk1FTlQiLCJhc3NpZ25tZW50RXZlbnQiLCJhZGRMaW5rRGF0YSIsImFndSIsImRndSIsImxpbmsiLCJzdGFydFRpbWUiLCJ2aWV3VHlwZSIsIkhPTElEQVkiLCJSRUdVTEFSIiwicmVndWxhckV2ZW50IiwiXyIsInVuaXFCeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxRQUFNQSxNQUFOLFNBQXFCQyxjQUFLRCxNQUExQixDQUFpQztBQUU5Q0UsSUFBQUEsV0FBVyxDQUFDQyxXQUFELEVBQWdDQyxPQUFoQyxFQUFpRDtBQUMxRCxZQUFNRCxXQUFOO0FBQ0EsV0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7OztBQUNTQyxJQUFBQSxtQkFBbUIsR0FBa0I7QUFDMUMsYUFBTyxJQUFJQyxPQUFKLENBQVksQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEtBQWM7QUFDL0IsY0FDR0MsY0FESCxDQUNzQztBQUFFQyxVQUFBQSxVQUFVLEVBQUUsWUFBZDtBQUE0QkMsVUFBQUEsY0FBYyxFQUFFO0FBQTVDLFNBRHRDLEVBRUdDLElBRkgsQ0FFU0MsUUFBRCxJQUFjO0FBQ2xCLGNBQUlBLFFBQVEsQ0FBQ0MsUUFBVCxDQUFrQixDQUFsQixFQUFxQixpQkFBckIsRUFBd0MsQ0FBeEMsTUFBK0MsbUNBQW5EO0FBQXdGUCxZQUFBQSxHQUFHO0FBQTNGLGlCQUNLQyxHQUFHLENBQUMsSUFBSU8seUJBQUosQ0FBcUJGLFFBQXJCLENBQUQsQ0FBSDtBQUNOLFNBTEgsRUFNR0csS0FOSCxDQU1TUixHQU5UO0FBT0QsT0FSTSxDQUFQO0FBU0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU1MsSUFBQUEsU0FBUyxHQUF3QjtBQUN0QyxhQUFPLElBQUlYLE9BQUosQ0FBWSxDQUFDQyxHQUFELEVBQU1DLEdBQU4sS0FBYztBQUMvQixjQUNHQyxjQURILENBQ3FDO0FBQ2pDQyxVQUFBQSxVQUFVLEVBQUUsK0JBRHFCO0FBRWpDUSxVQUFBQSxRQUFRLEVBQUU7QUFBRUMsWUFBQUEsVUFBVSxFQUFFO0FBQWQ7QUFGdUIsU0FEckMsRUFLR1AsSUFMSCxDQUtTUSxTQUFELElBQWU7QUFBQSxtQkFFakJBLFNBQVMsQ0FBQyxrQkFBRCxDQUFULENBQThCLENBQTlCLEVBQWlDQyxvQkFBakMsQ0FBc0QsQ0FBdEQsRUFBeURDLG1CQUZ4Qzs7QUFBQSxtQkFHZEMsR0FBRDtBQUFBLG1CQUFTLElBQUlDLGlCQUFKLENBQWFELEdBQWIsRUFBa0IsTUFBTXBCLFdBQXhCLENBQVQ7QUFBQSxXQUhlOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFDbkJJLFVBQUFBLEdBQUcsSUFBSDtBQUtELFNBWEgsRUFZR1MsS0FaSCxDQVlTUixHQVpUO0FBYUQsT0FkTSxDQUFQO0FBZUQ7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ1NpQixJQUFBQSxXQUFXLEdBQTBCO0FBQzFDLGFBQU8sSUFBSW5CLE9BQUosQ0FBWSxDQUFDQyxHQUFELEVBQU1DLEdBQU4sS0FBYztBQUMvQixjQUNHQyxjQURILENBQ3dDO0FBQ3BDQyxVQUFBQSxVQUFVLEVBQUUsMEJBRHdCO0FBRXBDUSxVQUFBQSxRQUFRLEVBQUU7QUFBRUMsWUFBQUEsVUFBVSxFQUFFO0FBQWQ7QUFGMEIsU0FEeEMsRUFLR1AsSUFMSCxDQUtTUSxTQUFELElBQWU7QUFBQSxvQkFFakJBLFNBQVMsQ0FBQ00scUJBQVYsQ0FBZ0MsQ0FBaEMsRUFBbUNDLGtCQUFuQyxDQUFzRCxDQUF0RCxFQUF5REMsaUJBRnhDOztBQUFBLG9CQUdkTCxHQUFEO0FBQUEsbUJBQVMsSUFBSU0sbUJBQUosQ0FBZU4sR0FBZixFQUFvQixNQUFNcEIsV0FBMUIsQ0FBVDtBQUFBLFdBSGU7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUNuQkksVUFBQUEsR0FBRyxLQUFIO0FBS0QsU0FYSCxFQVlHUyxLQVpILENBWVNSLEdBWlQ7QUFhRCxPQWRNLENBQVA7QUFlRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ1NzQixJQUFBQSxVQUFVLEdBQXdCO0FBQ3ZDLGFBQU8sSUFBSXhCLE9BQUosQ0FBWSxDQUFDQyxHQUFELEVBQU1DLEdBQU4sS0FBYztBQUMvQixjQUNHQyxjQURILENBQ3VDO0FBQ25DQyxVQUFBQSxVQUFVLEVBQUUsbUJBRHVCO0FBRW5DUSxVQUFBQSxRQUFRLEVBQUU7QUFBRWEsWUFBQUEsVUFBVSxFQUFFO0FBQWQ7QUFGeUIsU0FEdkMsRUFLR25CLElBTEgsQ0FLUSxDQUFDO0FBQUVvQixVQUFBQSx3QkFBd0IsRUFBRSxDQUFDWixTQUFEO0FBQTVCLFNBQUQsS0FBK0M7QUFBQSxvQkFlMUNBLFNBQVMsQ0FBQ2EsVUFBVixDQUFxQixDQUFyQixFQUF3QkMsU0Fma0I7O0FBQUEsb0JBZUhDLEtBQUQ7QUFBQSxtQkFBWTtBQUN2REMsY0FBQUEsSUFBSSxFQUFFRCxLQUFLLENBQUMsUUFBRCxDQUFMLENBQWdCLENBQWhCLENBRGlEO0FBRXZERSxjQUFBQSxLQUFLLEVBQUVGLEtBQUssQ0FBQyxTQUFELENBQUwsQ0FBaUIsQ0FBakIsQ0FGZ0Q7QUFHdkRHLGNBQUFBLE9BQU8sRUFBRUgsS0FBSyxDQUFDLFdBQUQsQ0FBTCxDQUFtQixDQUFuQixDQUg4QztBQUl2REksY0FBQUEsUUFBUSxFQUFFSixLQUFLLENBQUMsU0FBRCxDQUFMLENBQWlCLENBQWpCLENBSjZDO0FBS3ZESyxjQUFBQSxJQUFJLEVBQUVMLEtBQUssQ0FBQyxRQUFELENBQUwsQ0FBZ0IsQ0FBaEIsQ0FMaUQ7QUFNdkRNLGNBQUFBLEtBQUssRUFBRU4sS0FBSyxDQUFDLFNBQUQsQ0FBTCxDQUFpQixDQUFqQjtBQU5nRCxhQUFaO0FBQUEsV0FmSTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQ25ENUIsVUFBQUEsR0FBRyxDQUFDO0FBQ0ZtQyxZQUFBQSxNQUFNLEVBQUU7QUFDTkMsY0FBQUEsT0FBTyxFQUFFdkIsU0FBUyxDQUFDLGlCQUFELENBQVQsQ0FBNkIsQ0FBN0IsQ0FESDtBQUVOd0IsY0FBQUEsVUFBVSxFQUFFeEIsU0FBUyxDQUFDLGtCQUFELENBQVQsQ0FBOEIsQ0FBOUIsQ0FGTjtBQUdOeUIsY0FBQUEsSUFBSSxFQUFFekIsU0FBUyxDQUFDLGNBQUQsQ0FBVCxDQUEwQixDQUExQixDQUhBO0FBSU4wQixjQUFBQSxPQUFPLEVBQUUxQixTQUFTLENBQUMsYUFBRCxDQUFULENBQXlCLENBQXpCLENBSkg7QUFLTnFCLGNBQUFBLEtBQUssRUFBRXJCLFNBQVMsQ0FBQyxTQUFELENBQVQsQ0FBcUIsQ0FBckIsQ0FMRDtBQU1OMkIsY0FBQUEsUUFBUSxFQUFFM0IsU0FBUyxDQUFDLFVBQUQsQ0FBVCxDQUFzQixDQUF0QixDQU5KO0FBT040QixjQUFBQSxTQUFTLEVBQUU7QUFDVFosZ0JBQUFBLElBQUksRUFBRWhCLFNBQVMsQ0FBQyxhQUFELENBQVQsQ0FBeUIsQ0FBekIsQ0FERztBQUVUaUIsZ0JBQUFBLEtBQUssRUFBRWpCLFNBQVMsQ0FBQyxrQkFBRCxDQUFULENBQThCLENBQTlCLENBRkU7QUFHVGtCLGdCQUFBQSxPQUFPLEVBQUVsQixTQUFTLENBQUMsZUFBRCxDQUFULENBQTJCLENBQTNCO0FBSEE7QUFQTCxhQUROO0FBY0ZlLFlBQUFBLEtBQUs7QUFkSCxXQUFELENBQUg7QUF1QkQsU0E3QkgsRUE4QkduQixLQTlCSCxDQThCU1IsR0E5QlQ7QUErQkQsT0FoQ00sQ0FBUDtBQWlDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ1N5QyxJQUFBQSxRQUFRLENBQUNDLFNBQUQsRUFBd0M7QUFDckQsYUFBTyxJQUFJNUMsT0FBSixDQUFZLENBQUNDLEdBQUQsRUFBTUMsR0FBTixLQUFjO0FBQy9CLGNBQ0dDLGNBREgsQ0FDcUM7QUFDakNDLFVBQUFBLFVBQVUsRUFBRSxrQkFEcUI7QUFFakNRLFVBQUFBLFFBQVEsRUFBRTtBQUFFQyxZQUFBQSxVQUFVLEVBQUUsQ0FBZDtBQUFpQixnQkFBSStCLFNBQVMsSUFBSSxJQUFiLEdBQW9CO0FBQUVDLGNBQUFBLFNBQVMsRUFBRUQ7QUFBYixhQUFwQixHQUErQyxFQUFuRDtBQUFqQjtBQUZ1QixTQURyQyxFQUtHdEMsSUFMSCxDQUtTUSxTQUFELElBQWU7QUFBQSxvQkFzQ1JBLFNBQVMsQ0FBQ2dDLG9CQUFWLENBQStCLENBQS9CLEVBQWtDQyxVQUFsQyxDQUE2QyxDQUE3QyxFQUFnREMsWUF0Q3hDOztBQUFBLG9CQXNDMERDLFlBQUQ7QUFBQSxtQkFBbUI7QUFDM0ZuQixjQUFBQSxJQUFJLEVBQUVtQixZQUFZLENBQUMsZUFBRCxDQUFaLENBQThCLENBQTlCLENBRHFGO0FBRTNGQyxjQUFBQSxNQUFNLEVBQUVDLE1BQU0sQ0FBQ0YsWUFBWSxDQUFDLFVBQUQsQ0FBWixDQUF5QixDQUF6QixDQUFELENBRjZFO0FBRzNGRyxjQUFBQSxJQUFJLEVBQUVILFlBQVksQ0FBQyxZQUFELENBQVosQ0FBMkIsQ0FBM0IsQ0FIcUY7QUFJM0ZJLGNBQUFBLFNBQVMsRUFBRUosWUFBWSxDQUFDLGFBQUQsQ0FBWixDQUE0QixDQUE1QixDQUpnRjtBQUszRkssY0FBQUEsT0FBTyxFQUFFO0FBQ1B4QixnQkFBQUEsSUFBSSxFQUFFbUIsWUFBWSxDQUFDLFdBQUQsQ0FBWixDQUEwQixDQUExQixDQURDO0FBRVBsQixnQkFBQUEsS0FBSyxFQUFFa0IsWUFBWSxDQUFDLGdCQUFELENBQVosQ0FBK0IsQ0FBL0IsQ0FGQTtBQUdQakIsZ0JBQUFBLE9BQU8sRUFBRWlCLFlBQVksQ0FBQyxrQkFBRCxDQUFaLENBQWlDLENBQWpDO0FBSEY7QUFMa0YsYUFBbkI7QUFBQSxXQXRDekQ7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBLG9CQWlEVm5DLFNBQVMsQ0FBQ2dDLG9CQUFWLENBQStCLENBQS9CLEVBQWtDUyxTQUFsQyxDQUE0QyxDQUE1QyxFQUErQ0MsV0FqRHJDOztBQUFBLG9CQWlEc0RDLElBQUQ7QUFBQSxtQkFBVztBQUMvRUMsY0FBQUEsSUFBSSxFQUFFO0FBQ0pDLGdCQUFBQSxLQUFLLEVBQUUsSUFBSUMsSUFBSixDQUFTSCxJQUFJLENBQUMsYUFBRCxDQUFKLENBQW9CLENBQXBCLENBQVQsQ0FESDtBQUVKSSxnQkFBQUEsR0FBRyxFQUFFLElBQUlELElBQUosQ0FBU0gsSUFBSSxDQUFDLFdBQUQsQ0FBSixDQUFrQixDQUFsQixDQUFUO0FBRkQsZUFEeUU7QUFLL0VLLGNBQUFBLEtBQUssRUFBRVgsTUFBTSxDQUFDTSxJQUFJLENBQUMsYUFBRCxDQUFKLENBQW9CLENBQXBCLENBQUQsQ0FMa0U7QUFNL0UzQixjQUFBQSxJQUFJLEVBQUUyQixJQUFJLENBQUMsWUFBRCxDQUFKLENBQW1CLENBQW5CLENBTnlFO0FBTy9FTSxjQUFBQSxvQkFBb0IsRUFBRU4sSUFBSSxDQUFDLHVCQUFELENBQUosQ0FBOEIsQ0FBOUI7QUFQeUQsYUFBWDtBQUFBLFdBakRyRDs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQ25CeEQsVUFBQUEsR0FBRyxDQUFDO0FBQ0Z3RCxZQUFBQSxJQUFJLEVBQUU7QUFDSkssY0FBQUEsS0FBSyxFQUFFWCxNQUFNLENBQUNyQyxTQUFTLENBQUNnQyxvQkFBVixDQUErQixDQUEvQixFQUFrQyxhQUFsQyxFQUFpRCxDQUFqRCxDQUFELENBRFQ7QUFFSmhCLGNBQUFBLElBQUksRUFBRWhCLFNBQVMsQ0FBQ2dDLG9CQUFWLENBQStCLENBQS9CLEVBQWtDLGlCQUFsQyxFQUFxRCxDQUFyRDtBQUZGLGFBREo7QUFLRmtCLFlBQUFBLEtBQUssRUFBRWxELFNBQVMsQ0FBQ2dDLG9CQUFWLENBQStCLENBQS9CLEVBQWtDLGdCQUFsQyxFQUFvRCxDQUFwRCxDQUxMO0FBTUZtQixZQUFBQSxLQUFLLEVBQ0gsT0FBT25ELFNBQVMsQ0FBQ2dDLG9CQUFWLENBQStCLENBQS9CLEVBQWtDb0IscUJBQWxDLENBQXdELENBQXhELEVBQTJEQyxXQUEzRCxDQUF1RSxDQUF2RSxDQUFQLEtBQXFGLFFBQXJGLEdBQ0lyRCxTQUFTLENBQUNnQyxvQkFBVixDQUErQixDQUEvQixFQUFrQ29CLHFCQUFsQyxDQUF3RCxDQUF4RCxFQUEyREMsV0FBM0QsQ0FBdUUsQ0FBdkUsRUFBMEVDLFVBQTFFLENBQXFGQyxHQUFyRixDQUNHakMsTUFBRDtBQUFBLHFCQUFhO0FBQ1hOLGdCQUFBQSxJQUFJLEVBQUVNLE1BQU0sQ0FBQyxjQUFELENBQU4sQ0FBdUIsQ0FBdkIsQ0FESztBQUVYa0MsZ0JBQUFBLGdCQUFnQixFQUFFbEMsTUFBTSxDQUFDLGlCQUFELENBQU4sQ0FBMEIsQ0FBMUIsQ0FGUDtBQUdYbUMsZ0JBQUFBLE9BQU8sRUFBRW5DLE1BQU0sQ0FBQ29DLE9BQVAsQ0FBZSxDQUFmLEVBQWtCQyxTQUFsQixDQUE0QkosR0FBNUIsQ0FBb0RLLE1BQUQ7QUFBQSx5QkFBYTtBQUN2RXhCLG9CQUFBQSxNQUFNLEVBQUVDLE1BQU0sQ0FBQ3VCLE1BQU0sQ0FBQyxVQUFELENBQU4sQ0FBbUIsQ0FBbkIsQ0FBRCxDQUR5RDtBQUV2RUMsb0JBQUFBLGNBQWMsRUFBRUQsTUFBTSxDQUFDRSxjQUFQLENBQXNCLENBQXRCLENBRnVEO0FBR3ZFbEIsb0JBQUFBLElBQUksRUFBRTtBQUNKQyxzQkFBQUEsS0FBSyxFQUFFLElBQUlDLElBQUosQ0FBU2MsTUFBTSxDQUFDLGFBQUQsQ0FBTixDQUFzQixDQUF0QixDQUFULENBREg7QUFFSmIsc0JBQUFBLEdBQUcsRUFBRSxJQUFJRCxJQUFKLENBQVNjLE1BQU0sQ0FBQyxXQUFELENBQU4sQ0FBb0IsQ0FBcEIsQ0FBVDtBQUZELHFCQUhpRTtBQU92RTVDLG9CQUFBQSxJQUFJLEVBQUU0QyxNQUFNLENBQUMsYUFBRCxDQUFOLENBQXNCLENBQXRCLENBUGlFO0FBUXZFckIsb0JBQUFBLFNBQVMsRUFBRXFCLE1BQU0sQ0FBQyxhQUFELENBQU4sQ0FBc0IsQ0FBdEIsQ0FSNEQ7QUFTdkVwQixvQkFBQUEsT0FBTyxFQUFFO0FBQ1B2QixzQkFBQUEsS0FBSyxFQUFFMkMsTUFBTSxDQUFDLGdCQUFELENBQU4sQ0FBeUIsQ0FBekIsQ0FEQTtBQUVQRyxzQkFBQUEsWUFBWSxFQUFFSCxNQUFNLENBQUMsZ0JBQUQsQ0FBTixDQUF5QixDQUF6QixDQUZQO0FBR1A1QyxzQkFBQUEsSUFBSSxFQUFFNEMsTUFBTSxDQUFDLGVBQUQsQ0FBTixDQUF3QixDQUF4QixDQUhDO0FBSVAxQyxzQkFBQUEsT0FBTyxFQUFFMEMsTUFBTSxDQUFDLFdBQUQsQ0FBTixDQUFvQixDQUFwQixDQUpGO0FBS1BJLHNCQUFBQSxHQUFHLEVBQUVKLE1BQU0sQ0FBQyxjQUFELENBQU4sQ0FBdUIsQ0FBdkI7QUFMRSxxQkFUOEQ7QUFnQnZFSSxvQkFBQUEsR0FBRyxFQUFFSixNQUFNLENBQUMsWUFBRCxDQUFOLENBQXFCLENBQXJCLENBaEJrRTtBQWlCdkVLLG9CQUFBQSxJQUFJLEVBQUU7QUFDSnBCLHNCQUFBQSxLQUFLLEVBQUUsb0JBQU1lLE1BQU0sQ0FBQyxhQUFELENBQU4sQ0FBc0IsQ0FBdEIsQ0FBTixFQUFnQyxTQUFoQyxFQUEyQ2QsSUFBSSxDQUFDb0IsR0FBTCxFQUEzQyxDQURIO0FBRUpuQixzQkFBQUEsR0FBRyxFQUFFLG9CQUFNYSxNQUFNLENBQUMsV0FBRCxDQUFOLENBQW9CLENBQXBCLENBQU4sRUFBOEIsU0FBOUIsRUFBeUNkLElBQUksQ0FBQ29CLEdBQUwsRUFBekM7QUFGRDtBQWpCaUUsbUJBQWI7QUFBQSxpQkFBbkQ7QUFIRSxlQUFiO0FBQUEsYUFERixDQURKLEdBNkJJLEVBcENKO0FBcUNGVCxZQUFBQSxPQUFPLEtBckNMO0FBZ0RGVSxZQUFBQSxLQUFLO0FBaERILFdBQUQsQ0FBSDtBQTBERCxTQWhFSCxFQWlFR3ZFLEtBakVILENBaUVTUixHQWpFVDtBQWtFRCxPQW5FTSxDQUFQO0FBb0VEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU2dGLElBQUFBLFVBQVUsR0FBd0I7QUFDdkMsYUFBTyxJQUFJbEYsT0FBSixDQUFZLENBQUNDLEdBQUQsRUFBTUMsR0FBTixLQUFjO0FBQy9CLGNBQ0dDLGNBREgsQ0FDdUM7QUFDbkNDLFVBQUFBLFVBQVUsRUFBRSxZQUR1QjtBQUVuQ1EsVUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFlBQUFBLFVBQVUsRUFBRTtBQURKO0FBRnlCLFNBRHZDLEVBT0dQLElBUEgsQ0FPUzZFLG1CQUFELElBQXlCO0FBQzdCLGdCQUFNckUsU0FBUyxHQUFHcUUsbUJBQW1CLENBQUNDLFVBQXBCLENBQStCLENBQS9CLENBQWxCO0FBRDZCLG9CQWtDZHRFLFNBQVMsQ0FBQ3VFLGVBQVYsQ0FBMEIsQ0FBMUIsRUFBNkJDLFdBbENmOztBQUFBLG9CQWtDK0IsQ0FBQ0MsRUFBRCxFQUFLQyxDQUFMO0FBQUEsbUJBQVk7QUFDcEV0QyxjQUFBQSxNQUFNLEVBQUVDLE1BQU0sQ0FBQ29DLEVBQUUsQ0FBQyxVQUFELENBQUYsQ0FBZSxDQUFmLENBQUQsQ0FEc0Q7QUFFcEVFLGNBQUFBLEtBQUssRUFBRTtBQUNMQyxnQkFBQUEsT0FBTyxFQUFFdkMsTUFBTSxDQUFDckMsU0FBUyxDQUFDNkUsWUFBVixDQUF1QixDQUF2QixFQUEwQkwsV0FBMUIsQ0FBc0NFLENBQXRDLEVBQXlDLFNBQXpDLEVBQW9ELENBQXBELENBQUQsQ0FEVjtBQUVMSSxnQkFBQUEsT0FBTyxFQUFFekMsTUFBTSxDQUFDckMsU0FBUyxDQUFDK0UsWUFBVixDQUF1QixDQUF2QixFQUEwQlAsV0FBMUIsQ0FBc0NFLENBQXRDLEVBQXlDLFNBQXpDLEVBQW9ELENBQXBELENBQUQsQ0FGVjtBQUdMTSxnQkFBQUEsU0FBUyxFQUFFM0MsTUFBTSxDQUFDckMsU0FBUyxDQUFDaUYsY0FBVixDQUF5QixDQUF6QixFQUE0QlQsV0FBNUIsQ0FBd0NFLENBQXhDLEVBQTJDLFNBQTNDLEVBQXNELENBQXRELENBQUQsQ0FIWjtBQUlMUSxnQkFBQUEsVUFBVSxFQUFFN0MsTUFBTSxDQUFDckMsU0FBUyxDQUFDdUUsZUFBVixDQUEwQixDQUExQixFQUE2QkMsV0FBN0IsQ0FBeUNFLENBQXpDLEVBQTRDLFNBQTVDLEVBQXVELENBQXZELENBQUQsQ0FKYjtBQUtMUyxnQkFBQUEsZ0JBQWdCLEVBQUU5QyxNQUFNLENBQUNyQyxTQUFTLENBQUNvRixxQkFBVixDQUFnQyxDQUFoQyxFQUFtQ1osV0FBbkMsQ0FBK0NFLENBQS9DLEVBQWtELFNBQWxELEVBQTZELENBQTdELENBQUQ7QUFMbkI7QUFGNkQsYUFBWjtBQUFBLFdBbEMvQjs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBRzdCdkYsVUFBQUEsR0FBRyxDQUFDO0FBQ0ZrRyxZQUFBQSxJQUFJLEVBQUVyRixTQUFTLENBQUMsUUFBRCxDQUFULENBQW9CLENBQXBCLENBREo7QUFFRm9DLFlBQUFBLE1BQU0sRUFBRTtBQUNOdUMsY0FBQUEsS0FBSyxFQUFFdEMsTUFBTSxDQUFDckMsU0FBUyxDQUFDLGVBQUQsQ0FBVCxDQUEyQixDQUEzQixDQUFELENBRFA7QUFFTjZDLGNBQUFBLEtBQUssRUFBRVIsTUFBTSxDQUFDckMsU0FBUyxDQUFDLGVBQUQsQ0FBVCxDQUEyQixDQUEzQixDQUFELENBRlA7QUFHTitDLGNBQUFBLEdBQUcsRUFBRVYsTUFBTSxDQUFDckMsU0FBUyxDQUFDLGFBQUQsQ0FBVCxDQUF5QixDQUF6QixDQUFEO0FBSEwsYUFGTjtBQU9Gc0YsWUFBQUEsVUFBVSxFQUFFdEYsU0FBUyxDQUFDLGNBQUQsQ0FBVCxDQUEwQixDQUExQixDQVBWO0FBUUZ1RixZQUFBQSxRQUFRLEVBQUV2RixTQUFTLENBQUN3RixRQUFWLENBQW1CLENBQW5CLEVBQXNCQyxPQUF0QixHQUNOekYsU0FBUyxDQUFDd0YsUUFBVixDQUFtQixDQUFuQixFQUFzQkMsT0FBdEIsQ0FBOEJsQyxHQUE5QixDQUFtQ21DLE9BQUQ7QUFBQSxxQkFBYztBQUM5QzlDLGdCQUFBQSxJQUFJLEVBQUUsSUFBSUUsSUFBSixDQUFTNEMsT0FBTyxDQUFDLGVBQUQsQ0FBUCxDQUF5QixDQUF6QixDQUFULENBRHdDO0FBRTlDQyxnQkFBQUEsTUFBTSxFQUFFRCxPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9CLENBQXBCLENBRnNDO0FBRzlDRSxnQkFBQUEsSUFBSSxFQUFFRixPQUFPLENBQUMsUUFBRCxDQUFQLENBQWtCLENBQWxCLENBSHdDO0FBSTlDRyxnQkFBQUEsV0FBVyxFQUFFSCxPQUFPLENBQUMseUJBQUQsQ0FBUCxDQUFtQyxDQUFuQyxDQUppQztBQUs5Q0ksZ0JBQUFBLE9BQU8sRUFBRUosT0FBTyxDQUFDSyxPQUFSLENBQWdCLENBQWhCLEVBQW1CQyxNQUFuQixDQUEwQnpDLEdBQTFCLENBQ05uQixNQUFEO0FBQUEseUJBQ0c7QUFDQ0Esb0JBQUFBLE1BQU0sRUFBRUMsTUFBTSxDQUFDRCxNQUFNLENBQUMsVUFBRCxDQUFOLENBQW1CLENBQW5CLENBQUQsQ0FEZjtBQUVDcEIsb0JBQUFBLElBQUksRUFBRW9CLE1BQU0sQ0FBQyxRQUFELENBQU4sQ0FBaUIsQ0FBakIsQ0FGUDtBQUdDdUQsb0JBQUFBLE1BQU0sRUFBRXZELE1BQU0sQ0FBQyxVQUFELENBQU4sQ0FBbUIsQ0FBbkIsQ0FIVDtBQUlDd0Isb0JBQUFBLE1BQU0sRUFBRXhCLE1BQU0sQ0FBQyxVQUFELENBQU4sQ0FBbUIsQ0FBbkIsQ0FKVDtBQUtDckIsb0JBQUFBLEtBQUssRUFBRTtBQUNMQyxzQkFBQUEsSUFBSSxFQUFFb0IsTUFBTSxDQUFDLFNBQUQsQ0FBTixDQUFrQixDQUFsQixDQUREO0FBRUxsQixzQkFBQUEsT0FBTyxFQUFFa0IsTUFBTSxDQUFDLFdBQUQsQ0FBTixDQUFvQixDQUFwQixDQUZKO0FBR0xuQixzQkFBQUEsS0FBSyxFQUFFbUIsTUFBTSxDQUFDLGNBQUQsQ0FBTixDQUF1QixDQUF2QjtBQUhGLHFCQUxSO0FBVUM2RCxvQkFBQUEsU0FBUyxFQUFFN0QsTUFBTSxDQUFDLGFBQUQsQ0FBTixDQUFzQixDQUF0QjtBQVZaLG1CQURIO0FBQUEsaUJBRE87QUFMcUMsZUFBZDtBQUFBLGFBQWxDLENBRE0sR0FzQk4sRUE5QkY7QUErQkY4RCxZQUFBQSxXQUFXO0FBL0JULFdBQUQsQ0FBSDtBQTBDRCxTQXBESCxFQXFER3RHLEtBckRILENBcURTUixHQXJEVDtBQXNERCxPQXZETSxDQUFQO0FBd0REO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNTK0csSUFBQUEsU0FBUyxDQUFDQyxvQkFBRCxFQUFvRDtBQUNsRSxhQUFPLElBQUlsSCxPQUFKLENBQVksQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEtBQWM7QUFDL0IsY0FDR0MsY0FESCxDQUVJO0FBQ0VDLFVBQUFBLFVBQVUsRUFBRSxXQURkO0FBRUVRLFVBQUFBLFFBQVEsRUFBRTtBQUNSQyxZQUFBQSxVQUFVLEVBQUUsQ0FESjtBQUVSLGdCQUFJcUcsb0JBQW9CLElBQUksSUFBeEIsR0FBK0I7QUFBRUMsY0FBQUEsWUFBWSxFQUFFRDtBQUFoQixhQUEvQixHQUF3RSxFQUE1RTtBQUZRO0FBRlosU0FGSixFQVNLakcsR0FBRDtBQUFBLGlCQUNFLElBQUltRyxtQkFBSixDQUFlbkcsR0FBZixFQUNHb0csZUFESCxDQUNtQixvQkFEbkIsRUFDeUMsWUFEekMsRUFFR0EsZUFGSCxDQUVtQixTQUZuQixFQUU4QixNQUY5QixFQUdHQyxRQUhILEVBREY7QUFBQSxTQVRKLEVBZUdoSCxJQWZILENBZVNRLFNBQUQsSUFBbUM7QUFBQSxvQkFtQnhCQSxTQUFTLENBQUN5RyxTQUFWLENBQW9CLENBQXBCLEVBQXVCQyxnQkFBdkIsQ0FBd0MsQ0FBeEMsRUFBMkNMLFlBbkJuQjs7QUFBQSxvQkFtQnFDakUsTUFBRDtBQUFBLG1CQUFhO0FBQ2xGUSxjQUFBQSxJQUFJLEVBQUU7QUFBRUMsZ0JBQUFBLEtBQUssRUFBRSxJQUFJQyxJQUFKLENBQVNWLE1BQU0sQ0FBQyxhQUFELENBQU4sQ0FBc0IsQ0FBdEIsQ0FBVCxDQUFUO0FBQTZDVyxnQkFBQUEsR0FBRyxFQUFFLElBQUlELElBQUosQ0FBU1YsTUFBTSxDQUFDLFdBQUQsQ0FBTixDQUFvQixDQUFwQixDQUFUO0FBQWxELGVBRDRFO0FBRWxGcEIsY0FBQUEsSUFBSSxFQUFFb0IsTUFBTSxDQUFDLGVBQUQsQ0FBTixDQUF3QixDQUF4QixDQUY0RTtBQUdsRlksY0FBQUEsS0FBSyxFQUFFWCxNQUFNLENBQUNELE1BQU0sQ0FBQyxTQUFELENBQU4sQ0FBa0IsQ0FBbEIsQ0FBRDtBQUhxRSxhQUFiO0FBQUEsV0FuQnBDOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQSxvQkF5QjVCcEMsU0FBUyxDQUFDeUcsU0FBVixDQUFvQixDQUFwQixFQUF1QkUsT0FBdkIsQ0FBK0IsQ0FBL0IsRUFBa0NDLE1BekJOOztBQUFBLG9CQXlCa0JoRCxNQUFEO0FBQUEsc0JBUzdDQSxNQUFNLENBQUNpRCxLQUFQLENBQWEsQ0FBYixFQUFnQkMsSUFUNkI7O0FBQUEsc0JBU25CQyxJQUFEO0FBQUEscUJBQVc7QUFDekMvRixnQkFBQUEsSUFBSSxFQUFFK0YsSUFBSSxDQUFDLFlBQUQsQ0FBSixDQUFtQixDQUFuQixDQURtQztBQUV6Q0MsZ0JBQUFBLGVBQWUsRUFBRTtBQUNmQyxrQkFBQUEsTUFBTSxFQUFFRixJQUFJLENBQUMseUJBQUQsQ0FBSixDQUFnQyxDQUFoQyxDQURPO0FBRWZHLGtCQUFBQSxHQUFHLEVBQUU3RSxNQUFNLENBQUMwRSxJQUFJLENBQUMsc0JBQUQsQ0FBSixDQUE2QixDQUE3QixDQUFEO0FBRkksaUJBRndCO0FBTXpDSSxnQkFBQUEsa0JBQWtCLEVBQ2hCLE9BQU9KLElBQUksQ0FBQyx5QkFBRCxDQUFKLENBQWdDLENBQWhDLENBQVAsS0FBOEMsUUFBOUMsR0FDSUEsSUFBSSxDQUFDLHlCQUFELENBQUosQ0FBZ0MsQ0FBaEMsRUFBbUNLLG1CQUFuQyxDQUF1RDdELEdBQXZELENBQ0c4RCxRQUFEO0FBQUEseUJBQ0c7QUFDQ2hDLG9CQUFBQSxJQUFJLEVBQUVnQyxRQUFRLENBQUMsUUFBRCxDQUFSLENBQW1CLENBQW5CLENBRFA7QUFFQ0Msb0JBQUFBLGNBQWMsRUFBRUQsUUFBUSxDQUFDLGtCQUFELENBQVIsQ0FBNkIsQ0FBN0IsQ0FGakI7QUFHQ0Usb0JBQUFBLE1BQU0sRUFBRTtBQUNOQyxzQkFBQUEsU0FBUyxFQUFFSCxRQUFRLENBQUMsZUFBRCxDQUFSLENBQTBCLENBQTFCLENBREw7QUFFTkksc0JBQUFBLFFBQVEsRUFBRUosUUFBUSxDQUFDLFVBQUQsQ0FBUixDQUFxQixDQUFyQjtBQUZKLHFCQUhUO0FBT0NLLG9CQUFBQSxNQUFNLEVBQUU7QUFDTkMsc0JBQUFBLE9BQU8sRUFBRXRGLE1BQU0sQ0FBQ2dGLFFBQVEsQ0FBQyxVQUFELENBQVIsQ0FBcUIsQ0FBckIsQ0FBRCxDQURUO0FBRU5PLHNCQUFBQSxRQUFRLEVBQUV2RixNQUFNLENBQUNnRixRQUFRLENBQUMsa0JBQUQsQ0FBUixDQUE2QixDQUE3QixDQUFEO0FBRlY7QUFQVCxtQkFESDtBQUFBLGlCQURGLENBREosR0FnQkksRUF2Qm1DO0FBd0J6Q1EsZ0JBQUFBLFdBQVcsRUFDVCxPQUFPZCxJQUFJLENBQUNlLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBUCxLQUErQixRQUEvQixHQUNLZixJQUFJLENBQUNlLFdBQUwsQ0FBaUIsQ0FBakIsRUFBb0JDLFVBQXBCLENBQStCeEUsR0FBL0IsQ0FBb0N5RSxVQUFEO0FBQUEseUJBQWlCO0FBQ25EQyxvQkFBQUEsV0FBVyxFQUFFRCxVQUFVLENBQUMsZUFBRCxDQUFWLENBQTRCLENBQTVCLENBRHNDO0FBRW5EaEgsb0JBQUFBLElBQUksRUFBRWtILFNBQVMsQ0FBQ0YsVUFBVSxDQUFDLFdBQUQsQ0FBVixDQUF3QixDQUF4QixDQUFELENBRm9DO0FBR25EM0Msb0JBQUFBLElBQUksRUFBRTJDLFVBQVUsQ0FBQyxRQUFELENBQVYsQ0FBcUIsQ0FBckIsQ0FINkM7QUFJbkRwRixvQkFBQUEsSUFBSSxFQUFFO0FBQ0pDLHNCQUFBQSxLQUFLLEVBQUUsSUFBSUMsSUFBSixDQUFTa0YsVUFBVSxDQUFDLFFBQUQsQ0FBVixDQUFxQixDQUFyQixDQUFULENBREg7QUFFSkcsc0JBQUFBLEdBQUcsRUFBRSxJQUFJckYsSUFBSixDQUFTa0YsVUFBVSxDQUFDLFdBQUQsQ0FBVixDQUF3QixDQUF4QixDQUFUO0FBRkQscUJBSjZDO0FBUW5ESSxvQkFBQUEsS0FBSyxFQUFFO0FBQ0wvQyxzQkFBQUEsSUFBSSxFQUFFMkMsVUFBVSxDQUFDLGFBQUQsQ0FBVixDQUEwQixDQUExQixDQUREO0FBRUxLLHNCQUFBQSxLQUFLLEVBQUVMLFVBQVUsQ0FBQyxTQUFELENBQVYsQ0FBc0IsQ0FBdEI7QUFGRixxQkFSNEM7QUFZbkROLG9CQUFBQSxNQUFNLEVBQUVNLFVBQVUsQ0FBQyxVQUFELENBQVYsQ0FBdUIsQ0FBdkIsQ0FaMkM7QUFhbkRNLG9CQUFBQSxLQUFLLEVBQUVOLFVBQVUsQ0FBQyxTQUFELENBQVYsQ0FBc0IsQ0FBdEIsQ0FiNEM7QUFjbkRPLG9CQUFBQSxTQUFTLEVBQUVQLFVBQVUsQ0FBQyxhQUFELENBQVYsQ0FBMEIsQ0FBMUIsQ0Fkd0M7QUFlbkRuQyxvQkFBQUEsV0FBVyxFQUFFcUMsU0FBUyxDQUFDRixVQUFVLENBQUMsc0JBQUQsQ0FBVixDQUFtQyxDQUFuQyxDQUFELENBZjZCO0FBZ0JuRFEsb0JBQUFBLFVBQVUsRUFBRUMsSUFBSSxDQUFDQyxLQUFMLENBQVdWLFVBQVUsQ0FBQyxjQUFELENBQVYsQ0FBMkIsQ0FBM0IsQ0FBWCxDQWhCdUM7QUFpQm5EVyxvQkFBQUEsU0FBUyxFQUFFWCxVQUFVLENBQUMsYUFBRCxDQUFWLENBQTBCLENBQTFCLENBakJ3QztBQWtCbkRZLG9CQUFBQSxXQUFXLEVBQUU7QUFDWC9GLHNCQUFBQSxLQUFLLEVBQUUsSUFBSUMsSUFBSixDQUFTa0YsVUFBVSxDQUFDLGlCQUFELENBQVYsQ0FBOEIsQ0FBOUIsQ0FBVCxDQURJO0FBRVhqRixzQkFBQUEsR0FBRyxFQUFFLElBQUlELElBQUosQ0FBU2tGLFVBQVUsQ0FBQyxlQUFELENBQVYsQ0FBNEIsQ0FBNUIsQ0FBVDtBQUZNLHFCQWxCc0M7QUFzQm5EYSxvQkFBQUEsU0FBUyxFQUNQLE9BQU9iLFVBQVUsQ0FBQ2MsU0FBWCxDQUFxQixDQUFyQixDQUFQLEtBQW1DLFFBQW5DLEdBQ0tkLFVBQVUsQ0FBQ2MsU0FBWCxDQUFxQixDQUFyQixFQUF3QkMsUUFBeEIsQ0FBaUN4RixHQUFqQyxDQUFzQ3lGLElBQUQsSUFBVTtBQUM5Qyw4QkFBUUEsSUFBSSxDQUFDLFFBQUQsQ0FBSixDQUFlLENBQWYsQ0FBUjtBQUNFLDZCQUFLLE1BQUw7QUFBYTtBQUNYLGtDQUFNQyxRQUFRLEdBQUdELElBQWpCO0FBQ0EsbUNBQU87QUFDTDNELDhCQUFBQSxJQUFJLEVBQUU2RCxzQkFBYUMsSUFEZDtBQUVMQyw4QkFBQUEsSUFBSSxFQUFFO0FBQ0ovRCxnQ0FBQUEsSUFBSSxFQUFFNEQsUUFBUSxDQUFDLFlBQUQsQ0FBUixDQUF1QixDQUF2QixDQURGO0FBRUpqSSxnQ0FBQUEsSUFBSSxFQUFFaUksUUFBUSxDQUFDLFlBQUQsQ0FBUixDQUF1QixDQUF2QixDQUZGO0FBR0pJLGdDQUFBQSxHQUFHLEVBQUUsS0FBS3JLLE9BQUwsR0FBZWlLLFFBQVEsQ0FBQyxrQkFBRCxDQUFSLENBQTZCLENBQTdCO0FBSGhCLCtCQUZEO0FBT0xLLDhCQUFBQSxRQUFRLEVBQUU7QUFDUjFHLGdDQUFBQSxJQUFJLEVBQUUsSUFBSUUsSUFBSixDQUFTbUcsUUFBUSxDQUFDLGdCQUFELENBQVIsQ0FBMkIsQ0FBM0IsQ0FBVCxDQURFO0FBRVJNLGdDQUFBQSxFQUFFLEVBQUVOLFFBQVEsQ0FBQyxjQUFELENBQVIsQ0FBeUIsQ0FBekIsQ0FGSTtBQUdSakksZ0NBQUFBLElBQUksRUFBRWlJLFFBQVEsQ0FBQyxnQkFBRCxDQUFSLENBQTJCLENBQTNCO0FBSEU7QUFQTCw2QkFBUDtBQWFEOztBQUNELDZCQUFLLEtBQUw7QUFBWTtBQUNWLGtDQUFNTyxPQUFPLEdBQUdSLElBQWhCO0FBQ0EsbUNBQU87QUFDTGhGLDhCQUFBQSxHQUFHLEVBQUV3RixPQUFPLENBQUMsT0FBRCxDQUFQLENBQWlCLENBQWpCLENBREE7QUFFTG5FLDhCQUFBQSxJQUFJLEVBQUU2RCxzQkFBYU8sR0FGZDtBQUdMSCw4QkFBQUEsUUFBUSxFQUFFO0FBQ1IxRyxnQ0FBQUEsSUFBSSxFQUFFLElBQUlFLElBQUosQ0FBUzBHLE9BQU8sQ0FBQyxnQkFBRCxDQUFQLENBQTBCLENBQTFCLENBQVQsQ0FERTtBQUVSRCxnQ0FBQUEsRUFBRSxFQUFFQyxPQUFPLENBQUMsY0FBRCxDQUFQLENBQXdCLENBQXhCLENBRkk7QUFHUnhJLGdDQUFBQSxJQUFJLEVBQUV3SSxPQUFPLENBQUMsZ0JBQUQsQ0FBUCxDQUEwQixDQUExQixDQUhFO0FBSVIzRCxnQ0FBQUEsV0FBVyxFQUFFMkQsT0FBTyxDQUFDLHVCQUFELENBQVAsQ0FBaUMsQ0FBakM7QUFKTCwrQkFITDtBQVNMRSw4QkFBQUEsSUFBSSxFQUFFRixPQUFPLENBQUMsa0JBQUQsQ0FBUCxDQUE0QixDQUE1QjtBQVRELDZCQUFQO0FBV0Q7O0FBQ0Q7QUFDRXBLLDBCQUFBQSxHQUFHLENBQ0EsUUFBTzRKLElBQUksQ0FBQyxRQUFELENBQUosQ0FBZSxDQUFmLENBQWtCLHlEQUR6QixDQUFIO0FBaENKO0FBb0NELHFCQXJDQSxDQURMLEdBdUNJO0FBOUQ2QyxtQkFBakI7QUFBQSxpQkFBbkMsQ0FETCxHQWlFSTtBQTFGbUMsZUFBWDtBQUFBLGFBVG9COztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQSxtQkFBYTtBQUNqRTVHLGNBQUFBLE1BQU0sRUFBRUMsTUFBTSxDQUFDdUIsTUFBTSxDQUFDLFVBQUQsQ0FBTixDQUFtQixDQUFuQixDQUFELENBRG1EO0FBRWpFK0YsY0FBQUEsS0FBSyxFQUFFL0YsTUFBTSxDQUFDLFNBQUQsQ0FBTixDQUFrQixDQUFsQixDQUYwRDtBQUdqRXRCLGNBQUFBLElBQUksRUFBRXNCLE1BQU0sQ0FBQyxRQUFELENBQU4sQ0FBaUIsQ0FBakIsQ0FIMkQ7QUFJakU3QyxjQUFBQSxLQUFLLEVBQUU7QUFDTEMsZ0JBQUFBLElBQUksRUFBRTRDLE1BQU0sQ0FBQyxTQUFELENBQU4sQ0FBa0IsQ0FBbEIsQ0FERDtBQUVMM0MsZ0JBQUFBLEtBQUssRUFBRTJDLE1BQU0sQ0FBQyxjQUFELENBQU4sQ0FBdUIsQ0FBdkIsQ0FGRjtBQUdMMUMsZ0JBQUFBLE9BQU8sRUFBRTBDLE1BQU0sQ0FBQyxXQUFELENBQU4sQ0FBb0IsQ0FBcEI7QUFISixlQUowRDtBQVNqRWdHLGNBQUFBLEtBQUs7QUFUNEQsYUFBYjtBQUFBLFdBekJqQjs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQ3ZDekssVUFBQUEsR0FBRyxDQUFDO0FBQ0YrRCxZQUFBQSxLQUFLLEVBQUVsRCxTQUFTLENBQUN5RyxTQUFWLENBQW9CLENBQXBCLEVBQXVCLGdCQUF2QixFQUF5QyxDQUF6QyxDQURMO0FBRUZwQixZQUFBQSxJQUFJLEVBQUVyRixTQUFTLENBQUN5RyxTQUFWLENBQW9CLENBQXBCLEVBQXVCLFFBQXZCLEVBQWlDLENBQWpDLENBRko7QUFHRm9ELFlBQUFBLGVBQWUsRUFBRTtBQUNmbEMsY0FBQUEsT0FBTyxFQUFFO0FBQ1AzRSxnQkFBQUEsS0FBSyxFQUNIb0Qsb0JBQW9CLElBQ3BCL0QsTUFBTSxDQUNKckMsU0FBUyxDQUFDeUcsU0FBVixDQUFvQixDQUFwQixFQUF1QkMsZ0JBQXZCLENBQXdDLENBQXhDLEVBQTJDTCxZQUEzQyxDQUF3RHlELElBQXhELENBQ0dDLENBQUQ7QUFBQSx5QkFBT0EsQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQixDQUFuQixNQUEwQi9KLFNBQVMsQ0FBQ3lHLFNBQVYsQ0FBb0IsQ0FBcEIsRUFBdUJ1RCxlQUF2QixDQUF1QyxDQUF2QyxFQUEwQyxlQUExQyxFQUEyRCxDQUEzRCxDQUFqQztBQUFBLGlCQURGLElBRUksU0FGSixFQUVlLENBRmYsQ0FESSxDQUhEO0FBUVBwSCxnQkFBQUEsSUFBSSxFQUFFO0FBQ0pDLGtCQUFBQSxLQUFLLEVBQUUsSUFBSUMsSUFBSixDQUFTOUMsU0FBUyxDQUFDeUcsU0FBVixDQUFvQixDQUFwQixFQUF1QnVELGVBQXZCLENBQXVDLENBQXZDLEVBQTBDLGFBQTFDLEVBQXlELENBQXpELENBQVQsQ0FESDtBQUVKakgsa0JBQUFBLEdBQUcsRUFBRSxJQUFJRCxJQUFKLENBQVM5QyxTQUFTLENBQUN5RyxTQUFWLENBQW9CLENBQXBCLEVBQXVCdUQsZUFBdkIsQ0FBdUMsQ0FBdkMsRUFBMEMsV0FBMUMsRUFBdUQsQ0FBdkQsQ0FBVDtBQUZELGlCQVJDO0FBWVBoSixnQkFBQUEsSUFBSSxFQUFFaEIsU0FBUyxDQUFDeUcsU0FBVixDQUFvQixDQUFwQixFQUF1QnVELGVBQXZCLENBQXVDLENBQXZDLEVBQTBDLGVBQTFDLEVBQTJELENBQTNEO0FBWkMsZUFETTtBQWVmQyxjQUFBQSxTQUFTO0FBZk0sYUFIZjtBQXdCRkMsWUFBQUEsT0FBTztBQXhCTCxXQUFELENBQUg7QUErSEQsU0EvSUgsRUFnSkd0SyxLQWhKSCxDQWdKU1IsR0FoSlQ7QUFpSkQsT0FsSk0sQ0FBUDtBQW1KRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNTK0ssSUFBQUEsUUFBUSxHQUF1QjtBQUNwQyxhQUFPLElBQUlqTCxPQUFKLENBQVksQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEtBQWM7QUFDL0IsY0FDR0MsY0FESCxDQUVJO0FBQ0VDLFVBQUFBLFVBQVUsRUFBRSxnQkFEZDtBQUVFUSxVQUFBQSxRQUFRLEVBQUU7QUFBRUMsWUFBQUEsVUFBVSxFQUFFO0FBQWQ7QUFGWixTQUZKLEVBTUtJLEdBQUQ7QUFBQSxpQkFBUyxJQUFJbUcsbUJBQUosQ0FBZW5HLEdBQWYsRUFBb0JvRyxlQUFwQixDQUFvQyxTQUFwQyxFQUErQyxNQUEvQyxFQUF1REMsUUFBdkQsRUFBVDtBQUFBLFNBTkosRUFRR2hILElBUkgsQ0FRU1EsU0FBRCxJQUFlO0FBQUEscUJBRWpCQSxTQUFTLENBQUNvSyxlQUFWLENBQTBCLENBQTFCLEVBQTZCQyxlQUE3QixDQUE2QyxDQUE3QyxFQUFnREMsY0FGL0I7O0FBQUEscUJBR2RDLE9BQUQ7QUFBQSxtQkFBYSxJQUFJQyxnQkFBSixDQUFZRCxPQUFaLEVBQXFCLE1BQU14TCxXQUEzQixFQUF3QyxLQUFLQyxPQUE3QyxDQUFiO0FBQUEsV0FIZTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQ25CRyxVQUFBQSxHQUFHLE1BQUg7QUFLRCxTQWRILEVBZUdTLEtBZkgsQ0FlU1IsR0FmVDtBQWdCRCxPQWpCTSxDQUFQO0FBa0JEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ1NxTCxJQUFBQSxXQUFXLEdBQXlCO0FBQ3pDLGFBQU8sSUFBSXZMLE9BQUosQ0FBeUIsQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEtBQWM7QUFDNUMsY0FDR0MsY0FESCxDQUN3QztBQUNwQ0MsVUFBQUEsVUFBVSxFQUFFLGFBRHdCO0FBRXBDUSxVQUFBQSxRQUFRLEVBQUU7QUFBRUMsWUFBQUEsVUFBVSxFQUFFO0FBQWQ7QUFGMEIsU0FEeEMsRUFLR1AsSUFMSCxDQUtTa0wsYUFBRCxJQUFtQjtBQUN2QnZMLFVBQUFBLEdBQUcsQ0FBQztBQUNGd0wsWUFBQUEsT0FBTyxFQUFFO0FBQ1AzSixjQUFBQSxJQUFJLEVBQUUwSixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJDLGFBQTdCLENBQTJDLENBQTNDLENBREM7QUFFUEMsY0FBQUEsUUFBUSxFQUFFSixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJHLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDQyxjQUF4QyxDQUF1RCxDQUF2RCxDQUZIO0FBR1BDLGNBQUFBLFFBQVEsRUFBRVAsYUFBYSxDQUFDRSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q0csUUFBeEMsQ0FBaUQsQ0FBakQ7QUFISCxhQURQO0FBTUZDLFlBQUFBLFNBQVMsRUFBRSxJQUFJckksSUFBSixDQUFTNEgsYUFBYSxDQUFDRSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q0ssU0FBeEMsQ0FBa0QsQ0FBbEQsQ0FBVCxDQU5UO0FBT0ZDLFlBQUFBLEtBQUssRUFBRSxLQUFLQyxRQUFMLENBQWNaLGFBQWEsQ0FBQ0UsV0FBZCxDQUEwQixDQUExQixFQUE2QkcsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0NRLEtBQXRELENBUEw7QUFRRmhLLFlBQUFBLE9BQU8sRUFBRSxLQUFLK0osUUFBTCxDQUFjWixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJHLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDUyxFQUF0RCxDQVJQO0FBU0ZDLFlBQUFBLEtBQUssRUFBRSxLQUFLSCxRQUFMLENBQWNaLGFBQWEsQ0FBQ0UsV0FBZCxDQUEwQixDQUExQixFQUE2QkcsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0NXLEtBQXRELENBVEw7QUFVRkMsWUFBQUEsU0FBUyxFQUNQakIsYUFBYSxDQUFDRSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q2EsYUFBeEMsSUFDQWxCLGFBQWEsQ0FBQ0UsV0FBZCxDQUEwQixDQUExQixFQUE2QkcsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0NjLGNBRHhDLElBRUFuQixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJHLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDZSxnQkFGeEMsR0FHSTtBQUNFOUssY0FBQUEsSUFBSSxFQUFFMEosYUFBYSxDQUFDRSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q2EsYUFBeEMsQ0FBc0QsQ0FBdEQsQ0FEUjtBQUVFM0ssY0FBQUEsS0FBSyxFQUFFeUosYUFBYSxDQUFDRSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q2MsY0FBeEMsQ0FBdUQsQ0FBdkQsQ0FGVDtBQUdFM0ssY0FBQUEsT0FBTyxFQUFFd0osYUFBYSxDQUFDRSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q2UsZ0JBQXhDLENBQXlELENBQXpEO0FBSFgsYUFISixHQVFJQyxTQW5CSjtBQW9CRkMsWUFBQUEsYUFBYSxFQUFFdEIsYUFBYSxDQUFDRSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q2tCLGFBQXhDLENBQXNELENBQXRELENBcEJiO0FBcUJGQyxZQUFBQSxPQUFPLEVBQUV4QixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJHLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDb0IsT0FBeEMsR0FDTDtBQUNFbkwsY0FBQUEsSUFBSSxFQUFFMEosYUFBYSxDQUFDRSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q29CLE9BQXhDLENBQWdELENBQWhELEVBQW1ELFFBQW5ELEVBQTZELENBQTdELENBRFI7QUFFRTlLLGNBQUFBLEtBQUssRUFBRXFKLGFBQWEsQ0FBQ0UsV0FBZCxDQUEwQixDQUExQixFQUE2QkcsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0NvQixPQUF4QyxDQUFnRCxDQUFoRCxFQUFtRCxTQUFuRCxFQUE4RCxDQUE5RCxDQUZUO0FBR0UvSyxjQUFBQSxJQUFJLEVBQUVzSixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJHLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDb0IsT0FBeEMsQ0FBZ0QsQ0FBaEQsRUFBbUQsUUFBbkQsRUFBNkQsQ0FBN0QsQ0FIUjtBQUlFQyxjQUFBQSxNQUFNLEVBQUUxQixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJHLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDb0IsT0FBeEMsQ0FBZ0QsQ0FBaEQsRUFBbUQsVUFBbkQsRUFBK0QsQ0FBL0Q7QUFKVixhQURLLEdBT0xKLFNBNUJGO0FBNkJGTSxZQUFBQSxTQUFTLEVBQUUzQixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJHLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDdUIsU0FBeEMsR0FDUDtBQUNFdEwsY0FBQUEsSUFBSSxFQUFFMEosYUFBYSxDQUFDRSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q3VCLFNBQXhDLENBQWtELENBQWxELEVBQXFELFFBQXJELEVBQStELENBQS9ELENBRFI7QUFFRWpMLGNBQUFBLEtBQUssRUFBRXFKLGFBQWEsQ0FBQ0UsV0FBZCxDQUEwQixDQUExQixFQUE2QkcsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0N1QixTQUF4QyxDQUFrRCxDQUFsRCxFQUFxRCxTQUFyRCxFQUFnRSxDQUFoRSxDQUZUO0FBR0VsTCxjQUFBQSxJQUFJLEVBQUVzSixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJHLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDdUIsU0FBeEMsQ0FBa0QsQ0FBbEQsRUFBcUQsUUFBckQsRUFBK0QsQ0FBL0QsQ0FIUjtBQUlFQyxjQUFBQSxRQUFRLEVBQUU3QixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJHLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDdUIsU0FBeEMsQ0FBa0QsQ0FBbEQsRUFBcUQsWUFBckQsRUFBbUUsQ0FBbkU7QUFKWixhQURPLEdBT1BQLFNBcENGO0FBcUNGeEMsWUFBQUEsRUFBRSxFQUFFLEtBQUsrQixRQUFMLENBQWNaLGFBQWEsQ0FBQ0UsV0FBZCxDQUEwQixDQUExQixFQUE2QjRCLE1BQTNDLENBckNGO0FBc0NGdkcsWUFBQUEsU0FBUyxFQUFFLEtBQUtxRixRQUFMLENBQWNaLGFBQWEsQ0FBQ0UsV0FBZCxDQUEwQixDQUExQixFQUE2QkcsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0MwQixTQUF0RCxDQXRDVDtBQXVDRnBMLFlBQUFBLEtBQUssRUFBRSxLQUFLaUssUUFBTCxDQUFjWixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJHLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDMkIsS0FBdEQsQ0F2Q0w7QUF3Q0Z6TCxZQUFBQSxLQUFLLEVBQUUsS0FBS3FLLFFBQUwsQ0FBY1osYUFBYSxDQUFDRSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3QzRCLEtBQXRELENBeENMO0FBeUNGQyxZQUFBQSxpQkFBaUIsRUFBRWxDLGFBQWEsQ0FBQ0UsV0FBZCxDQUEwQixDQUExQixFQUE2QkcsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0M4QixpQkFBeEMsR0FDZm5DLGFBQWEsQ0FBQ0UsV0FBZCxDQUEwQixDQUExQixFQUE2QkcsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0M4QixpQkFBeEMsQ0FBMEQsQ0FBMUQsRUFBNkRDLGdCQUE3RCxDQUE4RXZKLEdBQTlFLENBQW1Gd0osT0FBRDtBQUFBLHFCQUFjO0FBQzlGL0wsZ0JBQUFBLElBQUksRUFBRSxLQUFLc0ssUUFBTCxDQUFjeUIsT0FBTyxDQUFDLFFBQUQsQ0FBckIsQ0FEd0Y7QUFFOUYxTCxnQkFBQUEsS0FBSyxFQUFFO0FBQ0wyTCxrQkFBQUEsSUFBSSxFQUFFLEtBQUsxQixRQUFMLENBQWN5QixPQUFPLENBQUMsYUFBRCxDQUFyQixDQUREO0FBRUxFLGtCQUFBQSxNQUFNLEVBQUUsS0FBSzNCLFFBQUwsQ0FBY3lCLE9BQU8sQ0FBQyxlQUFELENBQXJCLENBRkg7QUFHTEcsa0JBQUFBLEtBQUssRUFBRSxLQUFLNUIsUUFBTCxDQUFjeUIsT0FBTyxDQUFDLGNBQUQsQ0FBckIsQ0FIRjtBQUlMSSxrQkFBQUEsSUFBSSxFQUFFLEtBQUs3QixRQUFMLENBQWN5QixPQUFPLENBQUMsYUFBRCxDQUFyQjtBQUpELGlCQUZ1RjtBQVE5RkssZ0JBQUFBLFlBQVksRUFBRSxLQUFLOUIsUUFBTCxDQUFjeUIsT0FBTyxDQUFDLGdCQUFELENBQXJCO0FBUmdGLGVBQWQ7QUFBQSxhQUFsRixDQURlLEdBV2YsRUFwREY7QUFxREZNLFlBQUFBLE1BQU0sRUFBRSxLQUFLL0IsUUFBTCxDQUFjWixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkIwQyxNQUEzQyxDQXJETjtBQXNERkMsWUFBQUEsS0FBSyxFQUFFLEtBQUtqQyxRQUFMLENBQWNaLGFBQWEsQ0FBQ0UsV0FBZCxDQUEwQixDQUExQixFQUE2QjRDLEtBQTNDLENBdERMO0FBdURGQyxZQUFBQSxpQkFBaUIsRUFBRSxLQUFLbkMsUUFBTCxDQUFjWixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkI4QyxpQkFBM0MsQ0F2RGpCO0FBd0RGQyxZQUFBQSxZQUFZLEVBQUUsS0FBS3JDLFFBQUwsQ0FBY1osYUFBYSxDQUFDRSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3QzZDLFlBQXRELENBeERaO0FBeURGQyxZQUFBQSxRQUFRLEVBQUUsS0FBS3ZDLFFBQUwsQ0FBY1osYUFBYSxDQUFDRSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3QytDLFFBQXRELENBekRSO0FBMERGQyxZQUFBQSxlQUFlLEVBQUU7QUFDZjlNLGNBQUFBLEtBQUssRUFBRSxLQUFLcUssUUFBTCxDQUFjWixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJHLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDaUQsZ0JBQXRELENBRFE7QUFFZmhOLGNBQUFBLElBQUksRUFBRSxLQUFLc0ssUUFBTCxDQUFjWixhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJHLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDa0QsV0FBdEQsQ0FGUztBQUdmL00sY0FBQUEsT0FBTyxFQUFFLEtBQUtvSyxRQUFMLENBQWNaLGFBQWEsQ0FBQ0UsV0FBZCxDQUEwQixDQUExQixFQUE2QkcsT0FBN0IsQ0FBcUMsQ0FBckMsRUFBd0NtRCxrQkFBdEQ7QUFITSxhQTFEZjtBQStERkMsWUFBQUEsY0FBYyxFQUFFekQsYUFBYSxDQUFDRSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRyxPQUE3QixDQUFxQyxDQUFyQyxFQUF3Q3FELHFCQUF4QyxDQUE4RCxDQUE5RCxFQUFpRUMsbUJBQWpFLEdBQ1gzRCxhQUFhLENBQUNFLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJHLE9BQTdCLENBQXFDLENBQXJDLEVBQXdDcUQscUJBQXhDLENBQThELENBQTlELEVBQWlFQyxtQkFBakUsQ0FBcUY5SyxHQUFyRixDQUNFK0ssVUFBRDtBQUFBLHFCQUFpQjtBQUNmL0UsZ0JBQUFBLEVBQUUsRUFBRStFLFVBQVUsQ0FBQyxjQUFELENBQVYsQ0FBMkIsQ0FBM0IsQ0FEVztBQUVmakosZ0JBQUFBLElBQUksRUFBRWlKLFVBQVUsQ0FBQyxpQkFBRCxDQUFWLENBQThCLENBQTlCLENBRlM7QUFHZkMsZ0JBQUFBLElBQUksRUFBRUQsVUFBVSxDQUFDLFFBQUQsQ0FBVixDQUFxQixDQUFyQixDQUhTO0FBSWZFLGdCQUFBQSxLQUFLLEVBQUVGLFVBQVUsQ0FBQ0csZ0JBQVgsQ0FBNEIsQ0FBNUIsRUFBK0JDLGVBQS9CLENBQStDbkwsR0FBL0MsQ0FBb0RvTCxJQUFEO0FBQUEseUJBQVc7QUFDbkVDLG9CQUFBQSxNQUFNLEVBQUU7QUFDTkMsc0JBQUFBLE9BQU8sRUFBRUYsSUFBSSxDQUFDLGlCQUFELENBQUosQ0FBd0IsQ0FBeEIsQ0FESDtBQUVORyxzQkFBQUEsTUFBTSxFQUFFSCxJQUFJLENBQUMsZ0JBQUQsQ0FBSixDQUF1QixDQUF2QjtBQUZGLHFCQUQyRDtBQUtuRUosb0JBQUFBLElBQUksRUFBRUksSUFBSSxDQUFDLFFBQUQsQ0FBSixDQUFlLENBQWYsQ0FMNkQ7QUFNbkV0RyxvQkFBQUEsS0FBSyxFQUFFc0csSUFBSSxDQUFDLFNBQUQsQ0FBSixDQUFnQixDQUFoQixDQU40RDtBQU9uRXRKLG9CQUFBQSxJQUFJLEVBQUVzSixJQUFJLENBQUMsWUFBRCxDQUFKLENBQW1CLENBQW5CO0FBUDZELG1CQUFYO0FBQUEsaUJBQW5EO0FBSlEsZUFBakI7QUFBQSxhQURELENBRFcsR0FpQlo7QUFoRkYsV0FBRCxDQUFIO0FBa0ZELFNBeEZILEVBeUZHL08sS0F6RkgsQ0F5RlNSLEdBekZUO0FBMEZELE9BM0ZNLENBQVA7QUE0RkQ7O0FBRU8yUCxJQUFBQSx5QkFBeUIsQ0FBQ25NLElBQUQsRUFBYTtBQUM1QyxhQUFPLE1BQU12RCxjQUFOLENBQ0w7QUFDRUMsUUFBQUEsVUFBVSxFQUFFLGlCQURkO0FBRUVRLFFBQUFBLFFBQVEsRUFBRTtBQUFFQyxVQUFBQSxVQUFVLEVBQUUsQ0FBZDtBQUFpQmlQLFVBQUFBLFdBQVcsRUFBRXBNLElBQUksQ0FBQ3FNLFdBQUw7QUFBOUI7QUFGWixPQURLLEVBS0o5TyxHQUFEO0FBQUEsZUFBUyxJQUFJbUcsbUJBQUosQ0FBZW5HLEdBQWYsRUFBb0JvRyxlQUFwQixDQUFvQyxPQUFwQyxFQUE2QyxNQUE3QyxFQUFxREMsUUFBckQsRUFBVDtBQUFBLE9BTEssQ0FBUDtBQU9EOztBQUVPOEUsSUFBQUEsUUFBUSxDQUFJNEQsTUFBSixFQUFpQztBQUMvQyxhQUFPQSxNQUFNLEdBQUdBLE1BQU0sQ0FBQyxDQUFELENBQVQsR0FBZW5ELFNBQTVCO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUN1QixVQUFSb0QsUUFBUSxDQUFDQyxPQUF3QixHQUFHLEVBQTVCLEVBQW1EO0FBQ3RFLFlBQU1DLGNBQStCLEdBQUc7QUFDdENDLFFBQUFBLFdBQVcsRUFBRSxDQUR5QjtBQUV0QyxXQUFHRjtBQUZtQyxPQUF4QztBQUlBLFlBQU1HLEdBQUcsR0FBRyxNQUFNQyxlQUFNQyxJQUFOLENBQVc7QUFBQSxlQUFNLEtBQUtWLHlCQUFMLENBQStCLElBQUlqTSxJQUFKLEVBQS9CLENBQU47QUFBQSxPQUFYLENBQWxCO0FBQ0EsWUFBTTRNLGFBQTRCLEdBQ2hDTixPQUFPLENBQUNPLFFBQVIsRUFBa0I1TSxHQUFsQixJQUF5QixJQUFJRCxJQUFKLENBQVN5TSxHQUFHLENBQUNLLGVBQUosQ0FBb0IsQ0FBcEIsRUFBdUIsaUJBQXZCLEVBQTBDLENBQTFDLENBQVQsQ0FEM0I7QUFFQSxZQUFNQyxlQUE4QixHQUNsQ1QsT0FBTyxDQUFDTyxRQUFSLEVBQWtCOU0sS0FBbEIsSUFBMkIsSUFBSUMsSUFBSixDQUFTeU0sR0FBRyxDQUFDSyxlQUFKLENBQW9CLENBQXBCLEVBQXVCLGlCQUF2QixFQUEwQyxDQUExQyxDQUFULENBRDdCO0FBR0EsYUFBTyxJQUFJMVEsT0FBSixDQUFZLENBQUNDLEdBQUQsRUFBTUMsR0FBTixLQUFjO0FBQy9CLGNBQU0wUSxzQkFBc0IsR0FBRyxrQ0FBb0I7QUFBRWpOLFVBQUFBLEtBQUssRUFBRWdOLGVBQVQ7QUFBMEI5TSxVQUFBQSxHQUFHLEVBQUUyTTtBQUEvQixTQUFwQixDQUEvQjs7QUFDQSxjQUFNSyw0QkFBNEIsR0FBRztBQUFBLGlCQUNuQ1YsY0FBYyxDQUFDQyxXQUFmLElBQThCLElBQTlCLEdBQ0lwUSxPQUFPLENBQUM4USxHQUFSLENBQVlGLHNCQUFzQixDQUFDdk0sR0FBdkIsQ0FBNEJYLElBQUQ7QUFBQSxtQkFBVSxLQUFLbU0seUJBQUwsQ0FBK0JuTSxJQUEvQixDQUFWO0FBQUEsV0FBM0IsQ0FBWixDQURKLEdBRUksNEJBQVV5TSxjQUFjLENBQUNDLFdBQXpCLEVBQXNDUSxzQkFBdEMsRUFBK0RsTixJQUFEO0FBQUEsbUJBQzVELEtBQUttTSx5QkFBTCxDQUErQm5NLElBQS9CLENBRDREO0FBQUEsV0FBOUQsQ0FIK0I7QUFBQSxTQUFyQzs7QUFNQSxZQUFJNk0sSUFBcUIsR0FBRyxJQUE1QjtBQUNBTSxRQUFBQSw0QkFBNEIsR0FDekJ2USxJQURILENBQ1N5USxNQUFELElBQVk7QUFDaEIsZ0JBQU1DLFNBQVMsR0FBR0QsTUFBTSxDQUFDRSxNQUFQLENBQWMsQ0FBQ0MsSUFBRCxFQUFPSCxNQUFQLEtBQWtCO0FBQ2hELGdCQUFJUixJQUFJLElBQUksSUFBWjtBQUNFQSxjQUFBQSxJQUFJLEdBQUc7QUFDTFksZ0JBQUFBLFVBQVUsRUFBRTtBQUNWeE4sa0JBQUFBLEtBQUssRUFBRSxJQUFJQyxJQUFKLENBQVNtTixNQUFNLENBQUNMLGVBQVAsQ0FBdUIsQ0FBdkIsRUFBMEIsaUJBQTFCLEVBQTZDLENBQTdDLENBQVQsQ0FERztBQUVWN00sa0JBQUFBLEdBQUcsRUFBRSxJQUFJRCxJQUFKLENBQVNtTixNQUFNLENBQUNMLGVBQVAsQ0FBdUIsQ0FBdkIsRUFBMEIsaUJBQTFCLEVBQTZDLENBQTdDLENBQVQ7QUFGSyxpQkFEUDtBQUtMVSxnQkFBQUEsV0FBVyxFQUFFO0FBQ1h6TixrQkFBQUEsS0FBSyxFQUFFZ04sZUFESTtBQUVYOU0sa0JBQUFBLEdBQUcsRUFBRTJNO0FBRk0saUJBTFI7QUFTTE8sZ0JBQUFBLE1BQU0sRUFBRTtBQVRILGVBQVA7QUFERjs7QUFZQSxrQkFBTU0sSUFBYyxHQUFHLEVBQ3JCLEdBQUdkLElBRGtCO0FBQ1o7QUFDVFEsY0FBQUEsTUFBTSxFQUFFLENBQ04sSUFBSUcsSUFBSSxDQUFDSCxNQUFMLEdBQWNHLElBQUksQ0FBQ0gsTUFBbkIsR0FBNEIsRUFBaEMsQ0FETSxFQUVOLElBQUksT0FBT0EsTUFBTSxDQUFDTCxlQUFQLENBQXVCLENBQXZCLEVBQTBCWSxVQUExQixDQUFxQyxDQUFyQyxDQUFQLEtBQW1ELFFBQW5ELEdBQ0NQLE1BQU0sQ0FBQ0wsZUFBUCxDQUF1QixDQUF2QixFQUEwQlksVUFBMUIsQ0FBcUMsQ0FBckMsRUFBd0NDLFNBQXhDLENBQWtEbE4sR0FBbEQsQ0FBdURtTixLQUFELElBQVc7QUFDaEUsd0JBQVFBLEtBQUssQ0FBQyxXQUFELENBQUwsQ0FBbUIsQ0FBbkIsQ0FBUjtBQUNFLHVCQUFLQyxtQkFBVUMsVUFBZjtBQUEyQjtBQUN6Qiw0QkFBTUMsZUFBZSxHQUFHSCxLQUF4QjtBQUNBLDZCQUFPO0FBQ0wvRyx3QkFBQUEsS0FBSyxFQUFFekIsU0FBUyxDQUFDMkksZUFBZSxDQUFDLFNBQUQsQ0FBZixDQUEyQixDQUEzQixDQUFELENBRFg7QUFFTEMsd0JBQUFBLFdBQVcsRUFBRUQsZUFBZSxDQUFDLGVBQUQsQ0FBZixDQUFpQyxDQUFqQyxDQUZSO0FBR0xFLHdCQUFBQSxHQUFHLEVBQUVGLGVBQWUsQ0FBQyxPQUFELENBQWYsR0FBMkJBLGVBQWUsQ0FBQyxPQUFELENBQWYsQ0FBeUIsQ0FBekIsQ0FBM0IsR0FBeUQ5RSxTQUh6RDtBQUlMbkosd0JBQUFBLElBQUksRUFBRSxJQUFJRSxJQUFKLENBQVMrTixlQUFlLENBQUMsUUFBRCxDQUFmLENBQTBCLENBQTFCLENBQVQsQ0FKRDtBQUtMRyx3QkFBQUEsR0FBRyxFQUFFSCxlQUFlLENBQUMsT0FBRCxDQUFmLENBQXlCLENBQXpCLENBTEE7QUFNTEksd0JBQUFBLElBQUksRUFBRUosZUFBZSxDQUFDLFFBQUQsQ0FBZixDQUEwQixDQUExQixDQU5EO0FBT0xLLHdCQUFBQSxTQUFTLEVBQUVMLGVBQWUsQ0FBQyxhQUFELENBQWYsQ0FBK0IsQ0FBL0IsQ0FQTjtBQVFMeEwsd0JBQUFBLElBQUksRUFBRXNMLG1CQUFVQyxVQVJYO0FBU0xPLHdCQUFBQSxRQUFRLEVBQUVOLGVBQWUsQ0FBQyxZQUFELENBQWYsQ0FBOEIsQ0FBOUI7QUFUTCx1QkFBUDtBQVdEOztBQUNELHVCQUFLRixtQkFBVVMsT0FBZjtBQUF3QjtBQUN0Qiw2QkFBTztBQUNMekgsd0JBQUFBLEtBQUssRUFBRXpCLFNBQVMsQ0FBQ3dJLEtBQUssQ0FBQyxTQUFELENBQUwsQ0FBaUIsQ0FBakIsQ0FBRCxDQURYO0FBRUxyTCx3QkFBQUEsSUFBSSxFQUFFc0wsbUJBQVVTLE9BRlg7QUFHTEYsd0JBQUFBLFNBQVMsRUFBRVIsS0FBSyxDQUFDLGFBQUQsQ0FBTCxDQUFxQixDQUFyQixDQUhOO0FBSUw5Tix3QkFBQUEsSUFBSSxFQUFFLElBQUlFLElBQUosQ0FBUzROLEtBQUssQ0FBQyxRQUFELENBQUwsQ0FBZ0IsQ0FBaEIsQ0FBVDtBQUpELHVCQUFQO0FBTUQ7O0FBQ0QsdUJBQUtDLG1CQUFVVSxPQUFmO0FBQXdCO0FBQ3RCLDRCQUFNQyxZQUFZLEdBQUdaLEtBQXJCO0FBQ0EsNkJBQU87QUFDTC9HLHdCQUFBQSxLQUFLLEVBQUV6QixTQUFTLENBQUNvSixZQUFZLENBQUMsU0FBRCxDQUFaLENBQXdCLENBQXhCLENBQUQsQ0FEWDtBQUVMUCx3QkFBQUEsR0FBRyxFQUFFTyxZQUFZLENBQUMsT0FBRCxDQUFaLEdBQXdCQSxZQUFZLENBQUMsT0FBRCxDQUFaLENBQXNCLENBQXRCLENBQXhCLEdBQW1EdkYsU0FGbkQ7QUFHTG5KLHdCQUFBQSxJQUFJLEVBQUUsSUFBSUUsSUFBSixDQUFTd08sWUFBWSxDQUFDLFFBQUQsQ0FBWixDQUF1QixDQUF2QixDQUFULENBSEQ7QUFJTHpMLHdCQUFBQSxXQUFXLEVBQUV5TCxZQUFZLENBQUMsa0JBQUQsQ0FBWixHQUNUQSxZQUFZLENBQUMsa0JBQUQsQ0FBWixDQUFpQyxDQUFqQyxDQURTLEdBRVR2RixTQU5DO0FBT0xpRix3QkFBQUEsR0FBRyxFQUFFTSxZQUFZLENBQUMsT0FBRCxDQUFaLEdBQXdCQSxZQUFZLENBQUMsT0FBRCxDQUFaLENBQXNCLENBQXRCLENBQXhCLEdBQW1EdkYsU0FQbkQ7QUFRTGtGLHdCQUFBQSxJQUFJLEVBQUVLLFlBQVksQ0FBQyxRQUFELENBQVosR0FBeUJBLFlBQVksQ0FBQyxRQUFELENBQVosQ0FBdUIsQ0FBdkIsQ0FBekIsR0FBcUR2RixTQVJ0RDtBQVNMbUYsd0JBQUFBLFNBQVMsRUFBRUksWUFBWSxDQUFDLGFBQUQsQ0FBWixDQUE0QixDQUE1QixDQVROO0FBVUxqTSx3QkFBQUEsSUFBSSxFQUFFc0wsbUJBQVVVLE9BVlg7QUFXTEYsd0JBQUFBLFFBQVEsRUFBRUcsWUFBWSxDQUFDLFlBQUQsQ0FBWixHQUE2QkEsWUFBWSxDQUFDLFlBQUQsQ0FBWixDQUEyQixDQUEzQixDQUE3QixHQUE2RHZGLFNBWGxFO0FBWUwrRSx3QkFBQUEsV0FBVyxFQUFFUSxZQUFZLENBQUMsZUFBRCxDQUFaLEdBQWdDQSxZQUFZLENBQUMsZUFBRCxDQUFaLENBQThCLENBQTlCLENBQWhDLEdBQW1FdkY7QUFaM0UsdUJBQVA7QUFjRDtBQXZDSDtBQXlDRCxlQTFDQSxDQURELEdBNENBLEVBNUNKLENBRk07QUFGYSxhQUF2QjtBQW9EQSxtQkFBT3dFLElBQVA7QUFDRCxXQWxFaUIsRUFrRWYsRUFsRWUsQ0FBbEI7QUFtRUFwUixVQUFBQSxHQUFHLENBQUMsRUFBRSxHQUFHK1EsU0FBTDtBQUFnQkQsWUFBQUEsTUFBTSxFQUFFc0IsZ0JBQUVDLE1BQUYsQ0FBU3RCLFNBQVMsQ0FBQ0QsTUFBbkIsRUFBNEJ0QixJQUFEO0FBQUEscUJBQVVBLElBQUksQ0FBQ2hGLEtBQWY7QUFBQSxhQUEzQjtBQUF4QixXQUFELENBQUg7QUFDRCxTQXRFSCxFQXVFRy9KLEtBdkVILENBdUVTUixHQXZFVDtBQXdFRCxPQWpGTSxDQUFQO0FBa0ZEOztBQWpyQjZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscywgUGFyc2VkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgc29hcCBmcm9tICcuLi8uLi91dGlscy9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgeyBBZGRpdGlvbmFsSW5mbywgQWRkaXRpb25hbEluZm9JdGVtLCBDbGFzc1NjaGVkdWxlSW5mbywgU2Nob29sSW5mbywgU3R1ZGVudEluZm8gfSBmcm9tICcuL0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgU3R1ZGVudEluZm9YTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1N0dWRlbnRJbmZvJztcclxuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi4vTWVzc2FnZS9NZXNzYWdlJztcclxuaW1wb3J0IHsgTWVzc2FnZVhNTE9iamVjdCB9IGZyb20gJy4uL01lc3NhZ2UvTWVzc2FnZS54bWwnO1xyXG5pbXBvcnQgeyBBc3NpZ25tZW50RXZlbnRYTUxPYmplY3QsIENhbGVuZGFyWE1MT2JqZWN0LCBSZWd1bGFyRXZlbnRYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0NhbGVuZGFyJztcclxuaW1wb3J0IHsgQXNzaWdubWVudEV2ZW50LCBDYWxlbmRhciwgQ2FsZW5kYXJPcHRpb25zLCBFdmVudCwgSG9saWRheUV2ZW50LCBSZWd1bGFyRXZlbnQgfSBmcm9tICcuL0ludGVyZmFjZXMvQ2FsZW5kYXInO1xyXG5pbXBvcnQgeyBlYWNoTW9udGhPZkludGVydmFsLCBwYXJzZSB9IGZyb20gJ2RhdGUtZm5zJztcclxuaW1wb3J0IHsgRmlsZVJlc291cmNlWE1MT2JqZWN0LCBHcmFkZWJvb2tYTUxPYmplY3QsIFVSTFJlc291cmNlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9HcmFkZWJvb2snO1xyXG5pbXBvcnQgeyBBdHRlbmRhbmNlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9BdHRlbmRhbmNlJztcclxuaW1wb3J0IEV2ZW50VHlwZSBmcm9tICcuLi8uLi9Db25zdGFudHMvRXZlbnRUeXBlJztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgQXNzaWdubWVudCwgRmlsZVJlc291cmNlLCBHcmFkZWJvb2ssIE1hcmssIFVSTFJlc291cmNlLCBXZWlnaHRlZENhdGVnb3J5IH0gZnJvbSAnLi9JbnRlcmZhY2VzL0dyYWRlYm9vayc7XHJcbmltcG9ydCBhc3luY1Bvb2wgZnJvbSAndGlueS1hc3luYy1wb29sJztcclxuaW1wb3J0IFJlc291cmNlVHlwZSBmcm9tICcuLi8uLi9Db25zdGFudHMvUmVzb3VyY2VUeXBlJztcclxuaW1wb3J0IHsgQWJzZW50UGVyaW9kLCBBdHRlbmRhbmNlLCBQZXJpb2RJbmZvIH0gZnJvbSAnLi9JbnRlcmZhY2VzL0F0dGVuZGFuY2UnO1xyXG5pbXBvcnQgeyBTY2hlZHVsZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU2NoZWR1bGUnO1xyXG5pbXBvcnQgeyBTY2hlZHVsZSB9IGZyb20gJy4vQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBTY2hvb2xJbmZvWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9TY2hvb2xJbmZvJztcclxuaW1wb3J0IHsgUmVwb3J0Q2FyZHNYTUxPYmplY3QgfSBmcm9tICcuLi9SZXBvcnRDYXJkL1JlcG9ydENhcmQueG1sJztcclxuaW1wb3J0IHsgRG9jdW1lbnRYTUxPYmplY3QgfSBmcm9tICcuLi9Eb2N1bWVudC9Eb2N1bWVudC54bWwnO1xyXG5pbXBvcnQgUmVwb3J0Q2FyZCBmcm9tICcuLi9SZXBvcnRDYXJkL1JlcG9ydENhcmQnO1xyXG5pbXBvcnQgRG9jdW1lbnQgZnJvbSAnLi4vRG9jdW1lbnQvRG9jdW1lbnQnO1xyXG5pbXBvcnQgUmVxdWVzdEV4Y2VwdGlvbiBmcm9tICcuLi9SZXF1ZXN0RXhjZXB0aW9uL1JlcXVlc3RFeGNlcHRpb24nO1xyXG5pbXBvcnQgWE1MRmFjdG9yeSBmcm9tICcuLi8uLi91dGlscy9YTUxGYWN0b3J5L1hNTEZhY3RvcnknO1xyXG5pbXBvcnQgY2FjaGUgZnJvbSAnLi4vLi4vdXRpbHMvY2FjaGUvY2FjaGUnO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBTdHVkZW50VlVFIENsaWVudCB0byBhY2Nlc3MgdGhlIEFQSVxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQGV4dGVuZHMge3NvYXAuQ2xpZW50fVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IGV4dGVuZHMgc29hcC5DbGllbnQge1xyXG4gIHByaXZhdGUgaG9zdFVybDogc3RyaW5nO1xyXG4gIGNvbnN0cnVjdG9yKGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzLCBob3N0VXJsOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGNyZWRlbnRpYWxzKTtcclxuICAgIHRoaXMuaG9zdFVybCA9IGhvc3RVcmw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBWYWxpZGF0ZSdzIHRoZSB1c2VyJ3MgY3JlZGVudGlhbHMuIEl0IHdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgY3JlZGVudGlhbHMgYXJlIGluY29ycmVjdFxyXG4gICAqL1xyXG4gIHB1YmxpYyB2YWxpZGF0ZUNyZWRlbnRpYWxzKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxQYXJzZWRSZXF1ZXN0RXJyb3I+KHsgbWV0aG9kTmFtZTogJ2xvZ2luIHRlc3QnLCB2YWxpZGF0ZUVycm9yczogZmFsc2UgfSlcclxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZS5SVF9FUlJPUlswXVsnQF9FUlJPUl9NRVNTQUdFJ11bMF0gPT09ICdsb2dpbiB0ZXN0IGlzIG5vdCBhIHZhbGlkIG1ldGhvZC4nKSByZXMoKTtcclxuICAgICAgICAgIGVsc2UgcmVqKG5ldyBSZXF1ZXN0RXhjZXB0aW9uKHJlc3BvbnNlKSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgc3R1ZGVudCdzIGRvY3VtZW50cyBmcm9tIHN5bmVyZ3kgc2VydmVyc1xyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPERvY3VtZW50W10+fT4gUmV0dXJucyBhIGxpc3Qgb2Ygc3R1ZGVudCBkb2N1bWVudHNcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IGRvY3VtZW50cyA9IGF3YWl0IGNsaWVudC5kb2N1bWVudHMoKTtcclxuICAgKiBjb25zdCBkb2N1bWVudCA9IGRvY3VtZW50c1swXTtcclxuICAgKiBjb25zdCBmaWxlcyA9IGF3YWl0IGRvY3VtZW50LmdldCgpO1xyXG4gICAqIGNvbnN0IGJhc2U2NGNvbGxlY3Rpb24gPSBmaWxlcy5tYXAoKGZpbGUpID0+IGZpbGUuYmFzZTY0KTtcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgZG9jdW1lbnRzKCk6IFByb21pc2U8RG9jdW1lbnRbXT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxEb2N1bWVudFhNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0dldFN0dWRlbnREb2N1bWVudEluaXRpYWxEYXRhJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcclxuICAgICAgICAgIHJlcyhcclxuICAgICAgICAgICAgeG1sT2JqZWN0WydTdHVkZW50RG9jdW1lbnRzJ11bMF0uU3R1ZGVudERvY3VtZW50RGF0YXNbMF0uU3R1ZGVudERvY3VtZW50RGF0YS5tYXAoXHJcbiAgICAgICAgICAgICAgKHhtbCkgPT4gbmV3IERvY3VtZW50KHhtbCwgc3VwZXIuY3JlZGVudGlhbHMpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyBhIGxpc3Qgb2YgcmVwb3J0IGNhcmRzXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8UmVwb3J0Q2FyZFtdPn0gUmV0dXJucyBhIGxpc3Qgb2YgcmVwb3J0IGNhcmRzIHRoYXQgY2FuIGZldGNoIGEgZmlsZVxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgcmVwb3J0Q2FyZHMgPSBhd2FpdCBjbGllbnQucmVwb3J0Q2FyZHMoKTtcclxuICAgKiBjb25zdCBmaWxlcyA9IGF3YWl0IFByb21pc2UuYWxsKHJlcG9ydENhcmRzLm1hcCgoY2FyZCkgPT4gY2FyZC5nZXQoKSkpO1xyXG4gICAqIGNvbnN0IGJhc2U2NGFyciA9IGZpbGVzLm1hcCgoZmlsZSkgPT4gZmlsZS5iYXNlNjQpOyAvLyBbXCJKVkJFUmkwLi4uXCIsIFwiZFVJb2ExLi4uXCIsIC4uLl07XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIHJlcG9ydENhcmRzKCk6IFByb21pc2U8UmVwb3J0Q2FyZFtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFJlcG9ydENhcmRzWE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnR2V0UmVwb3J0Q2FyZEluaXRpYWxEYXRhJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcclxuICAgICAgICAgIHJlcyhcclxuICAgICAgICAgICAgeG1sT2JqZWN0LlJDUmVwb3J0aW5nUGVyaW9kRGF0YVswXS5SQ1JlcG9ydGluZ1BlcmlvZHNbMF0uUkNSZXBvcnRpbmdQZXJpb2QubWFwKFxyXG4gICAgICAgICAgICAgICh4bWwpID0+IG5ldyBSZXBvcnRDYXJkKHhtbCwgc3VwZXIuY3JlZGVudGlhbHMpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgc3R1ZGVudCdzIHNjaG9vbCdzIGluZm9ybWF0aW9uXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8U2Nob29sSW5mbz59IFJldHVybnMgdGhlIGluZm9ybWF0aW9uIG9mIHRoZSBzdHVkZW50J3Mgc2Nob29sXHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBhd2FpdCBjbGllbnQuc2Nob29sSW5mbygpO1xyXG4gICAqXHJcbiAgICogY2xpZW50LnNjaG9vbEluZm8oKS50aGVuKChzY2hvb2xJbmZvKSA9PiB7XHJcbiAgICogIGNvbnNvbGUubG9nKF8udW5pcShzY2hvb2xJbmZvLnN0YWZmLm1hcCgoc3RhZmYpID0+IHN0YWZmLm5hbWUpKSk7IC8vIExpc3QgYWxsIHN0YWZmIHBvc2l0aW9ucyB1c2luZyBsb2Rhc2hcclxuICAgKiB9KVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzY2hvb2xJbmZvKCk6IFByb21pc2U8U2Nob29sSW5mbz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxTY2hvb2xJbmZvWE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudFNjaG9vbEluZm8nLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJRDogMCB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHsgU3R1ZGVudFNjaG9vbEluZm9MaXN0aW5nOiBbeG1sT2JqZWN0XSB9KSA9PiB7XHJcbiAgICAgICAgICByZXMoe1xyXG4gICAgICAgICAgICBzY2hvb2w6IHtcclxuICAgICAgICAgICAgICBhZGRyZXNzOiB4bWxPYmplY3RbJ0BfU2Nob29sQWRkcmVzcyddWzBdLFxyXG4gICAgICAgICAgICAgIGFkZHJlc3NBbHQ6IHhtbE9iamVjdFsnQF9TY2hvb2xBZGRyZXNzMiddWzBdLFxyXG4gICAgICAgICAgICAgIGNpdHk6IHhtbE9iamVjdFsnQF9TY2hvb2xDaXR5J11bMF0sXHJcbiAgICAgICAgICAgICAgemlwQ29kZTogeG1sT2JqZWN0WydAX1NjaG9vbFppcCddWzBdLFxyXG4gICAgICAgICAgICAgIHBob25lOiB4bWxPYmplY3RbJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICBhbHRQaG9uZTogeG1sT2JqZWN0WydAX1Bob25lMiddWzBdLFxyXG4gICAgICAgICAgICAgIHByaW5jaXBhbDoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0WydAX1ByaW5jaXBhbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IHhtbE9iamVjdFsnQF9QcmluY2lwYWxFbWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgc3RhZmZHdTogeG1sT2JqZWN0WydAX1ByaW5jaXBhbEd1J11bMF0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3RhZmY6IHhtbE9iamVjdC5TdGFmZkxpc3RzWzBdLlN0YWZmTGlzdC5tYXAoKHN0YWZmKSA9PiAoe1xyXG4gICAgICAgICAgICAgIG5hbWU6IHN0YWZmWydAX05hbWUnXVswXSxcclxuICAgICAgICAgICAgICBlbWFpbDogc3RhZmZbJ0BfRU1haWwnXVswXSxcclxuICAgICAgICAgICAgICBzdGFmZkd1OiBzdGFmZlsnQF9TdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgam9iVGl0bGU6IHN0YWZmWydAX1RpdGxlJ11bMF0sXHJcbiAgICAgICAgICAgICAgZXh0bjogc3RhZmZbJ0BfRXh0biddWzBdLFxyXG4gICAgICAgICAgICAgIHBob25lOiBzdGFmZlsnQF9QaG9uZSddWzBdLFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBzY2hlZHVsZSBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0ZXJtSW5kZXggVGhlIGluZGV4IG9mIHRoZSB0ZXJtLlxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFNjaGVkdWxlPn0gUmV0dXJucyB0aGUgc2NoZWR1bGUgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGF3YWl0IHNjaGVkdWxlKDApIC8vIC0+IHsgdGVybTogeyBpbmRleDogMCwgbmFtZTogJzFzdCBRdHIgUHJvZ3Jlc3MnIH0sIC4uLiB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIHNjaGVkdWxlKHRlcm1JbmRleD86IG51bWJlcik6IFByb21pc2U8U2NoZWR1bGU+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8U2NoZWR1bGVYTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50Q2xhc3NMaXN0JyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIC4uLih0ZXJtSW5kZXggIT0gbnVsbCA/IHsgVGVybUluZGV4OiB0ZXJtSW5kZXggfSA6IHt9KSB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgdGVybToge1xyXG4gICAgICAgICAgICAgIGluZGV4OiBOdW1iZXIoeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdWydAX1Rlcm1JbmRleCddWzBdKSxcclxuICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfVGVybUluZGV4TmFtZSddWzBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdWydAX0Vycm9yTWVzc2FnZSddWzBdLFxyXG4gICAgICAgICAgICB0b2RheTpcclxuICAgICAgICAgICAgICB0eXBlb2YgeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLlRvZGF5U2NoZWR1bGVJbmZvRGF0YVswXS5TY2hvb2xJbmZvc1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgID8geG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLlRvZGF5U2NoZWR1bGVJbmZvRGF0YVswXS5TY2hvb2xJbmZvc1swXS5TY2hvb2xJbmZvLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAoc2Nob29sKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogc2Nob29sWydAX1NjaG9vbE5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGJlbGxTY2hlZHVsZU5hbWU6IHNjaG9vbFsnQF9CZWxsU2NoZWROYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzOiBzY2hvb2wuQ2xhc3Nlc1swXS5DbGFzc0luZm8ubWFwPENsYXNzU2NoZWR1bGVJbmZvPigoY291cnNlKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihjb3Vyc2VbJ0BfUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRlbmRhbmNlQ29kZTogY291cnNlLkF0dGVuZGFuY2VDb2RlWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGNvdXJzZVsnQF9TdGFydERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShjb3Vyc2VbJ0BfRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogY291cnNlWydAX0NsYXNzTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWN0aW9uR3U6IGNvdXJzZVsnQF9TZWN0aW9uR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVhY2hlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBjb3Vyc2VbJ0BfVGVhY2hlckVtYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWxTdWJqZWN0OiBjb3Vyc2VbJ0BfRW1haWxTdWJqZWN0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogY291cnNlWydAX1RlYWNoZXJOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhZmZHdTogY291cnNlWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGNvdXJzZVsnQF9UZWFjaGVyVVJMJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY291cnNlWydAX0NsYXNzVVJMJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogcGFyc2UoY291cnNlWydAX1N0YXJ0VGltZSddWzBdLCAnaGg6bW0gYScsIERhdGUubm93KCkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogcGFyc2UoY291cnNlWydAX0VuZFRpbWUnXVswXSwgJ2hoOm1tIGEnLCBEYXRlLm5vdygpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICA6IFtdLFxyXG4gICAgICAgICAgICBjbGFzc2VzOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uQ2xhc3NMaXN0c1swXS5DbGFzc0xpc3RpbmcubWFwKChzdHVkZW50Q2xhc3MpID0+ICh7XHJcbiAgICAgICAgICAgICAgbmFtZTogc3R1ZGVudENsYXNzWydAX0NvdXJzZVRpdGxlJ11bMF0sXHJcbiAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIoc3R1ZGVudENsYXNzWydAX1BlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgICByb29tOiBzdHVkZW50Q2xhc3NbJ0BfUm9vbU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICBzZWN0aW9uR3U6IHN0dWRlbnRDbGFzc1snQF9TZWN0aW9uR1UnXVswXSxcclxuICAgICAgICAgICAgICB0ZWFjaGVyOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBzdHVkZW50Q2xhc3NbJ0BfVGVhY2hlciddWzBdLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IHN0dWRlbnRDbGFzc1snQF9UZWFjaGVyRW1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgIHN0YWZmR3U6IHN0dWRlbnRDbGFzc1snQF9UZWFjaGVyU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgICAgdGVybXM6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5UZXJtTGlzdHNbMF0uVGVybUxpc3RpbmcubWFwKCh0ZXJtKSA9PiAoe1xyXG4gICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh0ZXJtWydAX0JlZ2luRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUodGVybVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcih0ZXJtWydAX1Rlcm1JbmRleCddWzBdKSxcclxuICAgICAgICAgICAgICBuYW1lOiB0ZXJtWydAX1Rlcm1OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgc2Nob29sWWVhclRlcm1Db2RlR3U6IHRlcm1bJ0BfU2Nob29sWWVhclRybUNvZGVHVSddWzBdLFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBhdHRlbmRhbmNlIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQHJldHVybnMge1Byb21pc2U8QXR0ZW5kYW5jZT59IFJldHVybnMgYW4gQXR0ZW5kYW5jZSBvYmplY3RcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNsaWVudC5hdHRlbmRhbmNlKClcclxuICAgKiAgLnRoZW4oY29uc29sZS5sb2cpOyAvLyAtPiB7IHR5cGU6ICdQZXJpb2QnLCBwZXJpb2Q6IHsuLi59LCBzY2hvb2xOYW1lOiAnVW5pdmVyc2l0eSBIaWdoIFNjaG9vbCcsIGFic2VuY2VzOiBbLi4uXSwgcGVyaW9kSW5mb3M6IFsuLi5dIH1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgYXR0ZW5kYW5jZSgpOiBQcm9taXNlPEF0dGVuZGFuY2U+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8QXR0ZW5kYW5jZVhNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0F0dGVuZGFuY2UnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHtcclxuICAgICAgICAgICAgY2hpbGRJbnRJZDogMCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoYXR0ZW5kYW5jZVhNTE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgeG1sT2JqZWN0ID0gYXR0ZW5kYW5jZVhNTE9iamVjdC5BdHRlbmRhbmNlWzBdO1xyXG5cclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIHR5cGU6IHhtbE9iamVjdFsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgIHBlcmlvZDoge1xyXG4gICAgICAgICAgICAgIHRvdGFsOiBOdW1iZXIoeG1sT2JqZWN0WydAX1BlcmlvZENvdW50J11bMF0pLFxyXG4gICAgICAgICAgICAgIHN0YXJ0OiBOdW1iZXIoeG1sT2JqZWN0WydAX1N0YXJ0UGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICAgIGVuZDogTnVtYmVyKHhtbE9iamVjdFsnQF9FbmRQZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNjaG9vbE5hbWU6IHhtbE9iamVjdFsnQF9TY2hvb2xOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgIGFic2VuY2VzOiB4bWxPYmplY3QuQWJzZW5jZXNbMF0uQWJzZW5jZVxyXG4gICAgICAgICAgICAgID8geG1sT2JqZWN0LkFic2VuY2VzWzBdLkFic2VuY2UubWFwKChhYnNlbmNlKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShhYnNlbmNlWydAX0Fic2VuY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICByZWFzb246IGFic2VuY2VbJ0BfUmVhc29uJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIG5vdGU6IGFic2VuY2VbJ0BfTm90ZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYWJzZW5jZVsnQF9Db2RlQWxsRGF5RGVzY3JpcHRpb24nXVswXSxcclxuICAgICAgICAgICAgICAgICAgcGVyaW9kczogYWJzZW5jZS5QZXJpb2RzWzBdLlBlcmlvZC5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgKHBlcmlvZCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKHBlcmlvZFsnQF9OdW1iZXInXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbjogcGVyaW9kWydAX1JlYXNvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3Vyc2U6IHBlcmlvZFsnQF9Db3Vyc2UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhZmY6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfU3RhZmYnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBwZXJpb2RbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBwZXJpb2RbJ0BfU3RhZmZFTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmdZZWFyR3U6IHBlcmlvZFsnQF9PcmdZZWFyR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIH0gYXMgQWJzZW50UGVyaW9kKVxyXG4gICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgcGVyaW9kSW5mb3M6IHhtbE9iamVjdC5Ub3RhbEFjdGl2aXRpZXNbMF0uUGVyaW9kVG90YWwubWFwKChwZCwgaSkgPT4gKHtcclxuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihwZFsnQF9OdW1iZXInXVswXSksXHJcbiAgICAgICAgICAgICAgdG90YWw6IHtcclxuICAgICAgICAgICAgICAgIGV4Y3VzZWQ6IE51bWJlcih4bWxPYmplY3QuVG90YWxFeGN1c2VkWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgdGFyZGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbFRhcmRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgICB1bmV4Y3VzZWQ6IE51bWJlcih4bWxPYmplY3QuVG90YWxVbmV4Y3VzZWRbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsQWN0aXZpdGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICAgIHVuZXhjdXNlZFRhcmRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxVbmV4Y3VzZWRUYXJkaWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pKSBhcyBQZXJpb2RJbmZvW10sXHJcbiAgICAgICAgICB9IGFzIEF0dGVuZGFuY2UpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGdyYWRlYm9vayBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByZXBvcnRpbmdQZXJpb2RJbmRleCBUaGUgdGltZWZyYW1lIHRoYXQgdGhlIGdyYWRlYm9vayBzaG91bGQgcmV0dXJuXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8R3JhZGVib29rPn0gUmV0dXJucyBhIEdyYWRlYm9vayBvYmplY3RcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IGdyYWRlYm9vayA9IGF3YWl0IGNsaWVudC5ncmFkZWJvb2soKTtcclxuICAgKiBjb25zb2xlLmxvZyhncmFkZWJvb2spOyAvLyB7IGVycm9yOiAnJywgdHlwZTogJ1RyYWRpdGlvbmFsJywgcmVwb3J0aW5nUGVyaW9kOiB7Li4ufSwgY291cnNlczogWy4uLl0gfTtcclxuICAgKlxyXG4gICAqIGF3YWl0IGNsaWVudC5ncmFkZWJvb2soMCkgLy8gU29tZSBzY2hvb2xzIHdpbGwgaGF2ZSBSZXBvcnRpbmdQZXJpb2RJbmRleCAwIGFzIFwiMXN0IFF1YXJ0ZXIgUHJvZ3Jlc3NcIlxyXG4gICAqIGF3YWl0IGNsaWVudC5ncmFkZWJvb2soNykgLy8gU29tZSBzY2hvb2xzIHdpbGwgaGF2ZSBSZXBvcnRpbmdQZXJpb2RJbmRleCA3IGFzIFwiNHRoIFF1YXJ0ZXJcIlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBncmFkZWJvb2socmVwb3J0aW5nUGVyaW9kSW5kZXg/OiBudW1iZXIpOiBQcm9taXNlPEdyYWRlYm9vaz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxHcmFkZWJvb2tYTUxPYmplY3Q+KFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBtZXRob2ROYW1lOiAnR3JhZGVib29rJyxcclxuICAgICAgICAgICAgcGFyYW1TdHI6IHtcclxuICAgICAgICAgICAgICBjaGlsZEludElkOiAwLFxyXG4gICAgICAgICAgICAgIC4uLihyZXBvcnRpbmdQZXJpb2RJbmRleCAhPSBudWxsID8geyBSZXBvcnRQZXJpb2Q6IHJlcG9ydGluZ1BlcmlvZEluZGV4IH0gOiB7fSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKHhtbCkgPT5cclxuICAgICAgICAgICAgbmV3IFhNTEZhY3RvcnkoeG1sKVxyXG4gICAgICAgICAgICAgIC5lbmNvZGVBdHRyaWJ1dGUoJ01lYXN1cmVEZXNjcmlwdGlvbicsICdIYXNEcm9wQm94JylcclxuICAgICAgICAgICAgICAuZW5jb2RlQXR0cmlidXRlKCdNZWFzdXJlJywgJ1R5cGUnKVxyXG4gICAgICAgICAgICAgIC50b1N0cmluZygpXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3Q6IEdyYWRlYm9va1hNTE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgZXJyb3I6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfRXJyb3JNZXNzYWdlJ11bMF0sXHJcbiAgICAgICAgICAgIHR5cGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgICByZXBvcnRpbmdQZXJpb2Q6IHtcclxuICAgICAgICAgICAgICBjdXJyZW50OiB7XHJcbiAgICAgICAgICAgICAgICBpbmRleDpcclxuICAgICAgICAgICAgICAgICAgcmVwb3J0aW5nUGVyaW9kSW5kZXggPz9cclxuICAgICAgICAgICAgICAgICAgTnVtYmVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QuZmluZChcclxuICAgICAgICAgICAgICAgICAgICAgICh4KSA9PiB4WydAX0dyYWRlUGVyaW9kJ11bMF0gPT09IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0dyYWRlUGVyaW9kJ11bMF1cclxuICAgICAgICAgICAgICAgICAgICApPy5bJ0BfSW5kZXgnXVswXVxyXG4gICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0VuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfR3JhZGVQZXJpb2QnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGF2YWlsYWJsZTogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RzWzBdLlJlcG9ydFBlcmlvZC5tYXAoKHBlcmlvZCkgPT4gKHtcclxuICAgICAgICAgICAgICAgIGRhdGU6IHsgc3RhcnQ6IG5ldyBEYXRlKHBlcmlvZFsnQF9TdGFydERhdGUnXVswXSksIGVuZDogbmV3IERhdGUocGVyaW9kWydAX0VuZERhdGUnXVswXSkgfSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9HcmFkZVBlcmlvZCddWzBdLFxyXG4gICAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcihwZXJpb2RbJ0BfSW5kZXgnXVswXSksXHJcbiAgICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb3Vyc2VzOiB4bWxPYmplY3QuR3JhZGVib29rWzBdLkNvdXJzZXNbMF0uQ291cnNlLm1hcCgoY291cnNlKSA9PiAoe1xyXG4gICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKGNvdXJzZVsnQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgdGl0bGU6IGNvdXJzZVsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgIHJvb206IGNvdXJzZVsnQF9Sb29tJ11bMF0sXHJcbiAgICAgICAgICAgICAgc3RhZmY6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9TdGFmZiddWzBdLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IGNvdXJzZVsnQF9TdGFmZkVNYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBzdGFmZkd1OiBjb3Vyc2VbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbWFya3M6IGNvdXJzZS5NYXJrc1swXS5NYXJrLm1hcCgobWFyaykgPT4gKHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG1hcmtbJ0BfTWFya05hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRTY29yZToge1xyXG4gICAgICAgICAgICAgICAgICBzdHJpbmc6IG1hcmtbJ0BfQ2FsY3VsYXRlZFNjb3JlU3RyaW5nJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHJhdzogTnVtYmVyKG1hcmtbJ0BfQ2FsY3VsYXRlZFNjb3JlUmF3J11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHdlaWdodGVkQ2F0ZWdvcmllczpcclxuICAgICAgICAgICAgICAgICAgdHlwZW9mIG1hcmtbJ0dyYWRlQ2FsY3VsYXRpb25TdW1tYXJ5J11bMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgPyBtYXJrWydHcmFkZUNhbGN1bGF0aW9uU3VtbWFyeSddWzBdLkFzc2lnbm1lbnRHcmFkZUNhbGMubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAod2VpZ2h0ZWQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHdlaWdodGVkWydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRNYXJrOiB3ZWlnaHRlZFsnQF9DYWxjdWxhdGVkTWFyayddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2YWx1YXRlZDogd2VpZ2h0ZWRbJ0BfV2VpZ2h0ZWRQY3QnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmQ6IHdlaWdodGVkWydAX1dlaWdodCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBOdW1iZXIod2VpZ2h0ZWRbJ0BfUG9pbnRzJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NzaWJsZTogTnVtYmVyKHdlaWdodGVkWydAX1BvaW50c1Bvc3NpYmxlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFdlaWdodGVkQ2F0ZWdvcnkpXHJcbiAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnRzOlxyXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgbWFyay5Bc3NpZ25tZW50c1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICA/IChtYXJrLkFzc2lnbm1lbnRzWzBdLkFzc2lnbm1lbnQubWFwKChhc3NpZ25tZW50KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmFkZWJvb2tJZDogYXNzaWdubWVudFsnQF9HcmFkZWJvb2tJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBkZWNvZGVVUkkoYXNzaWdubWVudFsnQF9NZWFzdXJlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhc3NpZ25tZW50WydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHVlOiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0R1ZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYXNzaWdubWVudFsnQF9TY29yZVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYXNzaWdubWVudFsnQF9TY29yZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IGFzc2lnbm1lbnRbJ0BfUG9pbnRzJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGVzOiBhc3NpZ25tZW50WydAX05vdGVzJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYWNoZXJJZDogYXNzaWdubWVudFsnQF9UZWFjaGVySUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRlY29kZVVSSShhc3NpZ25tZW50WydAX01lYXN1cmVEZXNjcmlwdGlvbiddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzRHJvcGJveDogSlNPTi5wYXJzZShhc3NpZ25tZW50WydAX0hhc0Ryb3BCb3gnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0dWRlbnRJZDogYXNzaWdubWVudFsnQF9TdHVkZW50SUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGJveERhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9Ecm9wU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9Ecm9wRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBhc3NpZ25tZW50LlJlc291cmNlc1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdLlJlc291cmNlLm1hcCgocnNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocnNyY1snQF9UeXBlJ11bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ0ZpbGUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVSc3JjID0gcnNyYyBhcyBGaWxlUmVzb3VyY2VYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUmVzb3VyY2VUeXBlLkZJTEUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlsZVJzcmNbJ0BfRmlsZVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVSc3JjWydAX0ZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmk6IHRoaXMuaG9zdFVybCArIGZpbGVSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZmlsZVJzcmNbJ0BfUmVzb3VyY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGZpbGVSc3JjWydAX1Jlc291cmNlSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVSc3JjWydAX1Jlc291cmNlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgRmlsZVJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnVVJMJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmxSc3JjID0gcnNyYyBhcyBVUkxSZXNvdXJjZVhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybFJzcmNbJ0BfVVJMJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUmVzb3VyY2VUeXBlLlVSTCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUodXJsUnNyY1snQF9SZXNvdXJjZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdXJsUnNyY1snQF9SZXNvdXJjZUlEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB1cmxSc3JjWydAX1Jlc291cmNlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVybFJzcmNbJ0BfUmVzb3VyY2VEZXNjcmlwdGlvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogdXJsUnNyY1snQF9TZXJ2ZXJGaWxlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFVSTFJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBUeXBlICR7cnNyY1snQF9UeXBlJ11bMF19IGRvZXMgbm90IGV4aXN0IGFzIGEgdHlwZS4gQWRkIGl0IHRvIHR5cGUgZGVjbGFyYXRpb25zLmBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pIGFzIChGaWxlUmVzb3VyY2UgfCBVUkxSZXNvdXJjZSlbXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KSkgYXMgQXNzaWdubWVudFtdKVxyXG4gICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgfSkpIGFzIE1hcmtbXSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfSBhcyBHcmFkZWJvb2spO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhIGxpc3Qgb2YgbWVzc2FnZXMgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxNZXNzYWdlW10+fSBSZXR1cm5zIGFuIGFycmF5IG9mIG1lc3NhZ2VzIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTsgLy8gLT4gW3sgaWQ6ICdFOTcyRjFCQy05OUEwLTRDRDAtOEQxNS1CMTg5NjhCNDNFMDgnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH0sIHsgaWQ6ICc4NkZEQTExRC00MkM3LTQyNDktQjAwMy05NEIxNUVCMkM4RDQnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH1dXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIG1lc3NhZ2VzKCk6IFByb21pc2U8TWVzc2FnZVtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PE1lc3NhZ2VYTUxPYmplY3Q+KFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBtZXRob2ROYW1lOiAnR2V0UFhQTWVzc2FnZXMnLFxyXG4gICAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKHhtbCkgPT4gbmV3IFhNTEZhY3RvcnkoeG1sKS5lbmNvZGVBdHRyaWJ1dGUoJ0NvbnRlbnQnLCAnUmVhZCcpLnRvU3RyaW5nKClcclxuICAgICAgICApXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKFxyXG4gICAgICAgICAgICB4bWxPYmplY3QuUFhQTWVzc2FnZXNEYXRhWzBdLk1lc3NhZ2VMaXN0aW5nc1swXS5NZXNzYWdlTGlzdGluZy5tYXAoXHJcbiAgICAgICAgICAgICAgKG1lc3NhZ2UpID0+IG5ldyBNZXNzYWdlKG1lc3NhZ2UsIHN1cGVyLmNyZWRlbnRpYWxzLCB0aGlzLmhvc3RVcmwpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgaW5mbyBvZiBhIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTdHVkZW50SW5mbz59IFN0dWRlbnRJbmZvIG9iamVjdFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogc3R1ZGVudEluZm8oKS50aGVuKGNvbnNvbGUubG9nKSAvLyAtPiB7IHN0dWRlbnQ6IHsgbmFtZTogJ0V2YW4gRGF2aXMnLCBuaWNrbmFtZTogJycsIGxhc3ROYW1lOiAnRGF2aXMnIH0sIC4uLn1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc3R1ZGVudEluZm8oKTogUHJvbWlzZTxTdHVkZW50SW5mbz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFN0dWRlbnRJbmZvPigocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8U3R1ZGVudEluZm9YTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50SW5mbycsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0RGF0YSkgPT4ge1xyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgc3R1ZGVudDoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRm9ybWF0dGVkTmFtZVswXSxcclxuICAgICAgICAgICAgICBsYXN0TmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkxhc3ROYW1lR29lc0J5WzBdLFxyXG4gICAgICAgICAgICAgIG5pY2tuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uTmlja05hbWVbMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkJpcnRoRGF0ZVswXSksXHJcbiAgICAgICAgICAgIHRyYWNrOiB0aGlzLm9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5UcmFjayksXHJcbiAgICAgICAgICAgIGFkZHJlc3M6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLmJyKSxcclxuICAgICAgICAgICAgcGhvdG86IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBob3RvKSxcclxuICAgICAgICAgICAgY291bnNlbG9yOlxyXG4gICAgICAgICAgICAgIHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Db3Vuc2Vsb3JOYW1lICYmXHJcbiAgICAgICAgICAgICAgeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvckVtYWlsICYmXHJcbiAgICAgICAgICAgICAgeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvclN0YWZmR1VcclxuICAgICAgICAgICAgICAgID8ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Db3Vuc2Vsb3JOYW1lWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ291bnNlbG9yRW1haWxbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhZmZHdTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvclN0YWZmR1VbMF0sXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjdXJyZW50U2Nob29sOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ3VycmVudFNjaG9vbFswXSxcclxuICAgICAgICAgICAgZGVudGlzdDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RcclxuICAgICAgICAgICAgICA/IHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfRXh0biddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBvZmZpY2U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5EZW50aXN0WzBdWydAX09mZmljZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBwaHlzaWNpYW46IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5cclxuICAgICAgICAgICAgICA/IHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHBob25lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGh5c2ljaWFuWzBdWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIGV4dG46IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5bMF1bJ0BfRXh0biddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBob3NwaXRhbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9Ib3NwaXRhbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBpZDogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBlcm1JRCksXHJcbiAgICAgICAgICAgIG9yZ1llYXJHdTogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uT3JnWWVhckdVKSxcclxuICAgICAgICAgICAgcGhvbmU6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBob25lKSxcclxuICAgICAgICAgICAgZW1haWw6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkVNYWlsKSxcclxuICAgICAgICAgICAgZW1lcmdlbmN5Q29udGFjdHM6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5FbWVyZ2VuY3lDb250YWN0c1xyXG4gICAgICAgICAgICAgID8geG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkVtZXJnZW5jeUNvbnRhY3RzWzBdLkVtZXJnZW5jeUNvbnRhY3QubWFwKChjb250YWN0KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLm9wdGlvbmFsKGNvbnRhY3RbJ0BfTmFtZSddKSxcclxuICAgICAgICAgICAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBob21lOiB0aGlzLm9wdGlvbmFsKGNvbnRhY3RbJ0BfSG9tZVBob25lJ10pLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vYmlsZTogdGhpcy5vcHRpb25hbChjb250YWN0WydAX01vYmlsZVBob25lJ10pLFxyXG4gICAgICAgICAgICAgICAgICAgIG90aGVyOiB0aGlzLm9wdGlvbmFsKGNvbnRhY3RbJ0BfT3RoZXJQaG9uZSddKSxcclxuICAgICAgICAgICAgICAgICAgICB3b3JrOiB0aGlzLm9wdGlvbmFsKGNvbnRhY3RbJ0BfV29ya1Bob25lJ10pLFxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6IHRoaXMub3B0aW9uYWwoY29udGFjdFsnQF9SZWxhdGlvbnNoaXAnXSksXHJcbiAgICAgICAgICAgICAgICB9KSlcclxuICAgICAgICAgICAgICA6IFtdLFxyXG4gICAgICAgICAgICBnZW5kZXI6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HZW5kZXIpLFxyXG4gICAgICAgICAgICBncmFkZTogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkdyYWRlKSxcclxuICAgICAgICAgICAgbG9ja2VySW5mb1JlY29yZHM6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Mb2NrZXJJbmZvUmVjb3JkcyksXHJcbiAgICAgICAgICAgIGhvbWVMYW5ndWFnZTogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZUxhbmd1YWdlKSxcclxuICAgICAgICAgICAgaG9tZVJvb206IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tKSxcclxuICAgICAgICAgICAgaG9tZVJvb21UZWFjaGVyOiB7XHJcbiAgICAgICAgICAgICAgZW1haWw6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoRU1haWwpLFxyXG4gICAgICAgICAgICAgIG5hbWU6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoKSxcclxuICAgICAgICAgICAgICBzdGFmZkd1OiB0aGlzLm9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lUm9vbVRjaFN0YWZmR1UpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZGRpdGlvbmFsSW5mbzogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlVzZXJEZWZpbmVkR3JvdXBCb3hlc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94XHJcbiAgICAgICAgICAgICAgPyAoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlVzZXJEZWZpbmVkR3JvdXBCb3hlc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94Lm1hcChcclxuICAgICAgICAgICAgICAgICAgKGRlZmluZWRCb3gpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGRlZmluZWRCb3hbJ0BfR3JvdXBCb3hJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGRlZmluZWRCb3hbJ0BfR3JvdXBCb3hMYWJlbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHZjSWQ6IGRlZmluZWRCb3hbJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBkZWZpbmVkQm94LlVzZXJEZWZpbmVkSXRlbXNbMF0uVXNlckRlZmluZWRJdGVtLm1hcCgoaXRlbSkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBpdGVtWydAX1NvdXJjZUVsZW1lbnQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBpdGVtWydAX1NvdXJjZU9iamVjdCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgIHZjSWQ6IGl0ZW1bJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1bJ0BfVmFsdWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGl0ZW1bJ0BfSXRlbVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICB9KSkgYXMgQWRkaXRpb25hbEluZm9JdGVtW10sXHJcbiAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApIGFzIEFkZGl0aW9uYWxJbmZvW10pXHJcbiAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgIH0gYXMgU3R1ZGVudEluZm8pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlOiBEYXRlKSB7XHJcbiAgICByZXR1cm4gc3VwZXIucHJvY2Vzc1JlcXVlc3Q8Q2FsZW5kYXJYTUxPYmplY3Q+KFxyXG4gICAgICB7XHJcbiAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRDYWxlbmRhcicsXHJcbiAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgUmVxdWVzdERhdGU6IGRhdGUudG9JU09TdHJpbmcoKSB9LFxyXG4gICAgICB9LFxyXG4gICAgICAoeG1sKSA9PiBuZXcgWE1MRmFjdG9yeSh4bWwpLmVuY29kZUF0dHJpYnV0ZSgnVGl0bGUnLCAnSWNvbicpLnRvU3RyaW5nKClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9wdGlvbmFsPFQ+KHhtbEFycj86IFRbXSk6IFQgfCB1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuIHhtbEFyciA/IHhtbEFyclswXSA6IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtDYWxlbmRhck9wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyB0byBwcm92aWRlIGZvciBjYWxlbmRhciBtZXRob2QuIEFuIGludGVydmFsIGlzIHJlcXVpcmVkLlxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPENhbGVuZGFyPn0gUmV0dXJucyBhIENhbGVuZGFyIG9iamVjdFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY2xpZW50LmNhbGVuZGFyKHsgaW50ZXJ2YWw6IHsgc3RhcnQ6IG5ldyBEYXRlKCc1LzEvMjAyMicpLCBlbmQ6IG5ldyBEYXRlKCc4LzEvMjAyMScpIH0sIGNvbmN1cnJlbmN5OiBudWxsIH0pOyAvLyAtPiBMaW1pdGxlc3MgY29uY3VycmVuY3kgKG5vdCByZWNvbW1lbmRlZClcclxuICAgKlxyXG4gICAqIGNvbnN0IGNhbGVuZGFyID0gYXdhaXQgY2xpZW50LmNhbGVuZGFyKHsgaW50ZXJ2YWw6IHsgLi4uIH19KTtcclxuICAgKiBjb25zb2xlLmxvZyhjYWxlbmRhcik7IC8vIC0+IHsgc2Nob29sRGF0ZTogey4uLn0sIG91dHB1dFJhbmdlOiB7Li4ufSwgZXZlbnRzOiBbLi4uXSB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGFzeW5jIGNhbGVuZGFyKG9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyA9IHt9KTogUHJvbWlzZTxDYWxlbmRhcj4ge1xyXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyA9IHtcclxuICAgICAgY29uY3VycmVuY3k6IDcsXHJcbiAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgY2FsID0gYXdhaXQgY2FjaGUubWVtbygoKSA9PiB0aGlzLmZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwobmV3IERhdGUoKSkpO1xyXG4gICAgY29uc3Qgc2Nob29sRW5kRGF0ZTogRGF0ZSB8IG51bWJlciA9XHJcbiAgICAgIG9wdGlvbnMuaW50ZXJ2YWw/LmVuZCA/PyBuZXcgRGF0ZShjYWwuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEVuZERhdGUnXVswXSk7XHJcbiAgICBjb25zdCBzY2hvb2xTdGFydERhdGU6IERhdGUgfCBudW1iZXIgPVxyXG4gICAgICBvcHRpb25zLmludGVydmFsPy5zdGFydCA/PyBuZXcgRGF0ZShjYWwuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBjb25zdCBtb250aHNXaXRoaW5TY2hvb2xZZWFyID0gZWFjaE1vbnRoT2ZJbnRlcnZhbCh7IHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsIGVuZDogc2Nob29sRW5kRGF0ZSB9KTtcclxuICAgICAgY29uc3QgZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhciA9ICgpOiBQcm9taXNlPENhbGVuZGFyWE1MT2JqZWN0W10+ID0+XHJcbiAgICAgICAgZGVmYXVsdE9wdGlvbnMuY29uY3VycmVuY3kgPT0gbnVsbFxyXG4gICAgICAgICAgPyBQcm9taXNlLmFsbChtb250aHNXaXRoaW5TY2hvb2xZZWFyLm1hcCgoZGF0ZSkgPT4gdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpKSlcclxuICAgICAgICAgIDogYXN5bmNQb29sKGRlZmF1bHRPcHRpb25zLmNvbmN1cnJlbmN5LCBtb250aHNXaXRoaW5TY2hvb2xZZWFyLCAoZGF0ZSkgPT5cclxuICAgICAgICAgICAgICB0aGlzLmZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwoZGF0ZSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgbGV0IG1lbW86IENhbGVuZGFyIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgIGdldEFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIoKVxyXG4gICAgICAgIC50aGVuKChldmVudHMpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGFsbEV2ZW50cyA9IGV2ZW50cy5yZWR1Y2UoKHByZXYsIGV2ZW50cykgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWVtbyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgIG1lbW8gPSB7XHJcbiAgICAgICAgICAgICAgICBzY2hvb2xEYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXVsnQF9TY2hvb2xFbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG91dHB1dFJhbmdlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsXHJcbiAgICAgICAgICAgICAgICAgIGVuZDogc2Nob29sRW5kRGF0ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBldmVudHM6IFtdLFxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3Q6IENhbGVuZGFyID0ge1xyXG4gICAgICAgICAgICAgIC4uLm1lbW8sIC8vIFRoaXMgaXMgdG8gcHJldmVudCByZS1pbml0aWFsaXppbmcgRGF0ZSBvYmplY3RzIGluIG9yZGVyIHRvIGltcHJvdmUgcGVyZm9ybWFuY2VcclxuICAgICAgICAgICAgICBldmVudHM6IFtcclxuICAgICAgICAgICAgICAgIC4uLihwcmV2LmV2ZW50cyA/IHByZXYuZXZlbnRzIDogW10pLFxyXG4gICAgICAgICAgICAgICAgLi4uKHR5cGVvZiBldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdLkV2ZW50TGlzdHNbMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgID8gKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF0uRXZlbnRMaXN0c1swXS5FdmVudExpc3QubWFwKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChldmVudFsnQF9EYXlUeXBlJ11bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuQVNTSUdOTUVOVDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzc2lnbm1lbnRFdmVudCA9IGV2ZW50IGFzIEFzc2lnbm1lbnRFdmVudFhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGRlY29kZVVSSShhc3NpZ25tZW50RXZlbnRbJ0BfVGl0bGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRMaW5rRGF0YTogYXNzaWdubWVudEV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZ3U6IGFzc2lnbm1lbnRFdmVudFsnQF9BR1UnXSA/IGFzc2lnbm1lbnRFdmVudFsnQF9BR1UnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGFzc2lnbm1lbnRFdmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGd1OiBhc3NpZ25tZW50RXZlbnRbJ0BfREdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBhc3NpZ25tZW50RXZlbnRbJ0BfTGluayddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBhc3NpZ25tZW50RXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuQVNTSUdOTUVOVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdUeXBlOiBhc3NpZ25tZW50RXZlbnRbJ0BfVmlld1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIEFzc2lnbm1lbnRFdmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5IT0xJREFZOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBkZWNvZGVVUkkoZXZlbnRbJ0BfVGl0bGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuSE9MSURBWSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogZXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShldmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgSG9saWRheUV2ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLlJFR1VMQVI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWd1bGFyRXZlbnQgPSBldmVudCBhcyBSZWd1bGFyRXZlbnRYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBkZWNvZGVVUkkocmVndWxhckV2ZW50WydAX1RpdGxlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWd1OiByZWd1bGFyRXZlbnRbJ0BfQUdVJ10gPyByZWd1bGFyRXZlbnRbJ0BfQUdVJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShyZWd1bGFyRXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiByZWd1bGFyRXZlbnRbJ0BfRXZ0RGVzY3JpcHRpb24nXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHJlZ3VsYXJFdmVudFsnQF9FdnREZXNjcmlwdGlvbiddWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGd1OiByZWd1bGFyRXZlbnRbJ0BfREdVJ10gPyByZWd1bGFyRXZlbnRbJ0BfREdVJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiByZWd1bGFyRXZlbnRbJ0BfTGluayddID8gcmVndWxhckV2ZW50WydAX0xpbmsnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogcmVndWxhckV2ZW50WydAX1N0YXJ0VGltZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLlJFR1VMQVIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3VHlwZTogcmVndWxhckV2ZW50WydAX1ZpZXdUeXBlJ10gPyByZWd1bGFyRXZlbnRbJ0BfVmlld1R5cGUnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZExpbmtEYXRhOiByZWd1bGFyRXZlbnRbJ0BfQWRkTGlua0RhdGEnXSA/IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgUmVndWxhckV2ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSkgYXMgRXZlbnRbXSlcclxuICAgICAgICAgICAgICAgICAgOiBbXSksXHJcbiAgICAgICAgICAgICAgXSBhcyBFdmVudFtdLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XHJcbiAgICAgICAgICB9LCB7fSBhcyBDYWxlbmRhcik7XHJcbiAgICAgICAgICByZXMoeyAuLi5hbGxFdmVudHMsIGV2ZW50czogXy51bmlxQnkoYWxsRXZlbnRzLmV2ZW50cywgKGl0ZW0pID0+IGl0ZW0udGl0bGUpIH0gYXMgQ2FsZW5kYXIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19