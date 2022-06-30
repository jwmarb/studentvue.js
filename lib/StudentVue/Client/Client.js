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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50Iiwic29hcCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwidmFsaWRhdGVDcmVkZW50aWFscyIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJwcm9jZXNzUmVxdWVzdCIsIm1ldGhvZE5hbWUiLCJ2YWxpZGF0ZUVycm9ycyIsInRoZW4iLCJyZXNwb25zZSIsIlJUX0VSUk9SIiwiUmVxdWVzdEV4Y2VwdGlvbiIsImNhdGNoIiwiZG9jdW1lbnRzIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwieG1sT2JqZWN0IiwiU3R1ZGVudERvY3VtZW50RGF0YXMiLCJTdHVkZW50RG9jdW1lbnREYXRhIiwieG1sIiwiRG9jdW1lbnQiLCJyZXBvcnRDYXJkcyIsIlJDUmVwb3J0aW5nUGVyaW9kRGF0YSIsIlJDUmVwb3J0aW5nUGVyaW9kcyIsIlJDUmVwb3J0aW5nUGVyaW9kIiwiUmVwb3J0Q2FyZCIsInNjaG9vbEluZm8iLCJjaGlsZEludElEIiwiU3R1ZGVudFNjaG9vbEluZm9MaXN0aW5nIiwiU3RhZmZMaXN0cyIsIlN0YWZmTGlzdCIsInN0YWZmIiwibmFtZSIsImVtYWlsIiwic3RhZmZHdSIsImpvYlRpdGxlIiwiZXh0biIsInBob25lIiwic2Nob29sIiwiYWRkcmVzcyIsImFkZHJlc3NBbHQiLCJjaXR5IiwiemlwQ29kZSIsImFsdFBob25lIiwicHJpbmNpcGFsIiwic2NoZWR1bGUiLCJ0ZXJtSW5kZXgiLCJUZXJtSW5kZXgiLCJTdHVkZW50Q2xhc3NTY2hlZHVsZSIsIkNsYXNzTGlzdHMiLCJDbGFzc0xpc3RpbmciLCJzdHVkZW50Q2xhc3MiLCJwZXJpb2QiLCJOdW1iZXIiLCJyb29tIiwic2VjdGlvbkd1IiwidGVhY2hlciIsIlRlcm1MaXN0cyIsIlRlcm1MaXN0aW5nIiwidGVybSIsImRhdGUiLCJzdGFydCIsIkRhdGUiLCJlbmQiLCJpbmRleCIsInNjaG9vbFllYXJUZXJtQ29kZUd1IiwiZXJyb3IiLCJ0b2RheSIsIlRvZGF5U2NoZWR1bGVJbmZvRGF0YSIsIlNjaG9vbEluZm9zIiwiU2Nob29sSW5mbyIsIm1hcCIsImJlbGxTY2hlZHVsZU5hbWUiLCJjbGFzc2VzIiwiQ2xhc3NlcyIsIkNsYXNzSW5mbyIsImNvdXJzZSIsImF0dGVuZGFuY2VDb2RlIiwiQXR0ZW5kYW5jZUNvZGUiLCJlbWFpbFN1YmplY3QiLCJ1cmwiLCJ0aW1lIiwibm93IiwidGVybXMiLCJhdHRlbmRhbmNlIiwiYXR0ZW5kYW5jZVhNTE9iamVjdCIsIkF0dGVuZGFuY2UiLCJBYnNlbmNlcyIsIkFic2VuY2UiLCJhYnNlbmNlIiwiUGVyaW9kcyIsIlBlcmlvZCIsInJlYXNvbiIsIm9yZ1llYXJHdSIsIm5vdGUiLCJkZXNjcmlwdGlvbiIsInBlcmlvZHMiLCJUb3RhbEFjdGl2aXRpZXMiLCJQZXJpb2RUb3RhbCIsInBkIiwiaSIsInRvdGFsIiwiZXhjdXNlZCIsIlRvdGFsRXhjdXNlZCIsInRhcmRpZXMiLCJUb3RhbFRhcmRpZXMiLCJ1bmV4Y3VzZWQiLCJUb3RhbFVuZXhjdXNlZCIsImFjdGl2aXRpZXMiLCJ1bmV4Y3VzZWRUYXJkaWVzIiwiVG90YWxVbmV4Y3VzZWRUYXJkaWVzIiwidHlwZSIsInNjaG9vbE5hbWUiLCJhYnNlbmNlcyIsInBlcmlvZEluZm9zIiwiZ3JhZGVib29rIiwicmVwb3J0aW5nUGVyaW9kSW5kZXgiLCJSZXBvcnRQZXJpb2QiLCJYTUxGYWN0b3J5IiwiZW5jb2RlQXR0cmlidXRlIiwidG9TdHJpbmciLCJHcmFkZWJvb2siLCJSZXBvcnRpbmdQZXJpb2RzIiwiQ291cnNlcyIsIkNvdXJzZSIsIk1hcmtzIiwiTWFyayIsIm1hcmsiLCJjYWxjdWxhdGVkU2NvcmUiLCJzdHJpbmciLCJyYXciLCJ3ZWlnaHRlZENhdGVnb3JpZXMiLCJBc3NpZ25tZW50R3JhZGVDYWxjIiwid2VpZ2h0ZWQiLCJjYWxjdWxhdGVkTWFyayIsIndlaWdodCIsImV2YWx1YXRlZCIsInN0YW5kYXJkIiwicG9pbnRzIiwiY3VycmVudCIsInBvc3NpYmxlIiwiYXNzaWdubWVudHMiLCJBc3NpZ25tZW50cyIsIkFzc2lnbm1lbnQiLCJhc3NpZ25tZW50IiwiZ3JhZGVib29rSWQiLCJkZWNvZGVVUkkiLCJkdWUiLCJzY29yZSIsInZhbHVlIiwibm90ZXMiLCJ0ZWFjaGVySWQiLCJoYXNEcm9wYm94IiwiSlNPTiIsInBhcnNlIiwic3R1ZGVudElkIiwiZHJvcGJveERhdGUiLCJyZXNvdXJjZXMiLCJSZXNvdXJjZXMiLCJSZXNvdXJjZSIsInJzcmMiLCJmaWxlUnNyYyIsIlJlc291cmNlVHlwZSIsIkZJTEUiLCJmaWxlIiwidXJpIiwicmVzb3VyY2UiLCJpZCIsInVybFJzcmMiLCJVUkwiLCJwYXRoIiwidGl0bGUiLCJtYXJrcyIsInJlcG9ydGluZ1BlcmlvZCIsImZpbmQiLCJ4IiwiUmVwb3J0aW5nUGVyaW9kIiwiYXZhaWxhYmxlIiwiY291cnNlcyIsIm1lc3NhZ2VzIiwiUFhQTWVzc2FnZXNEYXRhIiwiTWVzc2FnZUxpc3RpbmdzIiwiTWVzc2FnZUxpc3RpbmciLCJtZXNzYWdlIiwiTWVzc2FnZSIsInN0dWRlbnRJbmZvIiwieG1sT2JqZWN0RGF0YSIsInN0dWRlbnQiLCJTdHVkZW50SW5mbyIsIkZvcm1hdHRlZE5hbWUiLCJsYXN0TmFtZSIsIkFkZHJlc3MiLCJMYXN0TmFtZUdvZXNCeSIsIm5pY2tuYW1lIiwiTmlja05hbWUiLCJiaXJ0aERhdGUiLCJCaXJ0aERhdGUiLCJ0cmFjayIsIm9wdGlvbmFsIiwiVHJhY2siLCJiciIsInBob3RvIiwiUGhvdG8iLCJjb3Vuc2Vsb3IiLCJDb3Vuc2Vsb3JOYW1lIiwiQ291bnNlbG9yRW1haWwiLCJDb3Vuc2Vsb3JTdGFmZkdVIiwidW5kZWZpbmVkIiwiY3VycmVudFNjaG9vbCIsIkN1cnJlbnRTY2hvb2wiLCJkZW50aXN0IiwiRGVudGlzdCIsIm9mZmljZSIsInBoeXNpY2lhbiIsIlBoeXNpY2lhbiIsImhvc3BpdGFsIiwiUGVybUlEIiwiT3JnWWVhckdVIiwiUGhvbmUiLCJFTWFpbCIsImVtZXJnZW5jeUNvbnRhY3RzIiwiRW1lcmdlbmN5Q29udGFjdHMiLCJFbWVyZ2VuY3lDb250YWN0IiwiY29udGFjdCIsImhvbWUiLCJtb2JpbGUiLCJvdGhlciIsIndvcmsiLCJyZWxhdGlvbnNoaXAiLCJnZW5kZXIiLCJHZW5kZXIiLCJncmFkZSIsIkdyYWRlIiwibG9ja2VySW5mb1JlY29yZHMiLCJMb2NrZXJJbmZvUmVjb3JkcyIsImhvbWVMYW5ndWFnZSIsIkhvbWVMYW5ndWFnZSIsImhvbWVSb29tIiwiSG9tZVJvb20iLCJob21lUm9vbVRlYWNoZXIiLCJIb21lUm9vbVRjaEVNYWlsIiwiSG9tZVJvb21UY2giLCJIb21lUm9vbVRjaFN0YWZmR1UiLCJhZGRpdGlvbmFsSW5mbyIsIlVzZXJEZWZpbmVkR3JvdXBCb3hlcyIsIlVzZXJEZWZpbmVkR3JvdXBCb3giLCJkZWZpbmVkQm94IiwidmNJZCIsIml0ZW1zIiwiVXNlckRlZmluZWRJdGVtcyIsIlVzZXJEZWZpbmVkSXRlbSIsIml0ZW0iLCJzb3VyY2UiLCJlbGVtZW50Iiwib2JqZWN0IiwiZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbCIsIlJlcXVlc3REYXRlIiwidG9JU09TdHJpbmciLCJ4bWxBcnIiLCJjYWxlbmRhciIsIm9wdGlvbnMiLCJkZWZhdWx0T3B0aW9ucyIsImNvbmN1cnJlbmN5IiwiY2FsIiwiY2FjaGUiLCJtZW1vIiwic2Nob29sRW5kRGF0ZSIsImludGVydmFsIiwiQ2FsZW5kYXJMaXN0aW5nIiwic2Nob29sU3RhcnREYXRlIiwibW9udGhzV2l0aGluU2Nob29sWWVhciIsImdldEFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIiLCJhbGwiLCJldmVudHMiLCJhbGxFdmVudHMiLCJyZWR1Y2UiLCJwcmV2Iiwic2Nob29sRGF0ZSIsIm91dHB1dFJhbmdlIiwicmVzdCIsIkV2ZW50TGlzdHMiLCJFdmVudExpc3QiLCJldmVudCIsIkV2ZW50VHlwZSIsIkFTU0lHTk1FTlQiLCJhc3NpZ25tZW50RXZlbnQiLCJhZGRMaW5rRGF0YSIsImFndSIsImRndSIsImxpbmsiLCJzdGFydFRpbWUiLCJ2aWV3VHlwZSIsIkhPTElEQVkiLCJSRUdVTEFSIiwicmVndWxhckV2ZW50IiwiXyIsInVuaXFCeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxRQUFNQSxNQUFOLFNBQXFCQyxjQUFLRCxNQUExQixDQUFpQztBQUU5Q0UsSUFBQUEsV0FBVyxDQUFDQyxXQUFELEVBQWdDQyxPQUFoQyxFQUFpRDtBQUMxRCxZQUFNRCxXQUFOO0FBQ0EsV0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7OztBQUNTQyxJQUFBQSxtQkFBbUIsR0FBa0I7QUFDMUMsYUFBTyxJQUFJQyxPQUFKLENBQVksQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEtBQWM7QUFDL0IsY0FDR0MsY0FESCxDQUNzQztBQUFFQyxVQUFBQSxVQUFVLEVBQUUsWUFBZDtBQUE0QkMsVUFBQUEsY0FBYyxFQUFFO0FBQTVDLFNBRHRDLEVBRUdDLElBRkgsQ0FFU0MsUUFBRCxJQUFjO0FBQ2xCLGNBQUlBLFFBQVEsQ0FBQ0MsUUFBVCxDQUFrQixDQUFsQixFQUFxQixpQkFBckIsRUFBd0MsQ0FBeEMsTUFBK0MsbUNBQW5EO0FBQXdGUCxZQUFBQSxHQUFHO0FBQTNGLGlCQUNLQyxHQUFHLENBQUMsSUFBSU8seUJBQUosQ0FBcUJGLFFBQXJCLENBQUQsQ0FBSDtBQUNOLFNBTEgsRUFNR0csS0FOSCxDQU1TUixHQU5UO0FBT0QsT0FSTSxDQUFQO0FBU0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU1MsSUFBQUEsU0FBUyxHQUF3QjtBQUN0QyxhQUFPLElBQUlYLE9BQUosQ0FBWSxDQUFDQyxHQUFELEVBQU1DLEdBQU4sS0FBYztBQUMvQixjQUNHQyxjQURILENBQ3FD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QUNoRixLQUFmO0FBQUEsYUFBM0I7QUFBeEIsV0FBRCxDQUFIO0FBQ0QsU0F0RUgsRUF1RUcvSixLQXZFSCxDQXVFU1IsR0F2RVQ7QUF3RUQsT0FqRk0sQ0FBUDtBQWtGRDs7QUEvcUI2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMsIFBhcnNlZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHNvYXAgZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9zb2FwJztcclxuaW1wb3J0IHsgQWRkaXRpb25hbEluZm8sIEFkZGl0aW9uYWxJbmZvSXRlbSwgQ2xhc3NTY2hlZHVsZUluZm8sIFNjaG9vbEluZm8sIFN0dWRlbnRJbmZvIH0gZnJvbSAnLi9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFN0dWRlbnRJbmZvWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9TdHVkZW50SW5mbyc7XHJcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4uL01lc3NhZ2UvTWVzc2FnZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VYTUxPYmplY3QgfSBmcm9tICcuLi9NZXNzYWdlL01lc3NhZ2UueG1sJztcclxuaW1wb3J0IHsgQXNzaWdubWVudEV2ZW50WE1MT2JqZWN0LCBDYWxlbmRhclhNTE9iamVjdCwgUmVndWxhckV2ZW50WE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9DYWxlbmRhcic7XHJcbmltcG9ydCB7IEFzc2lnbm1lbnRFdmVudCwgQ2FsZW5kYXIsIENhbGVuZGFyT3B0aW9ucywgRXZlbnQsIEhvbGlkYXlFdmVudCwgUmVndWxhckV2ZW50IH0gZnJvbSAnLi9JbnRlcmZhY2VzL0NhbGVuZGFyJztcclxuaW1wb3J0IHsgZWFjaE1vbnRoT2ZJbnRlcnZhbCwgcGFyc2UgfSBmcm9tICdkYXRlLWZucyc7XHJcbmltcG9ydCB7IEZpbGVSZXNvdXJjZVhNTE9iamVjdCwgR3JhZGVib29rWE1MT2JqZWN0LCBVUkxSZXNvdXJjZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvR3JhZGVib29rJztcclxuaW1wb3J0IHsgQXR0ZW5kYW5jZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvQXR0ZW5kYW5jZSc7XHJcbmltcG9ydCBFdmVudFR5cGUgZnJvbSAnLi4vLi4vQ29uc3RhbnRzL0V2ZW50VHlwZSc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IEFzc2lnbm1lbnQsIEZpbGVSZXNvdXJjZSwgR3JhZGVib29rLCBNYXJrLCBVUkxSZXNvdXJjZSwgV2VpZ2h0ZWRDYXRlZ29yeSB9IGZyb20gJy4vSW50ZXJmYWNlcy9HcmFkZWJvb2snO1xyXG5pbXBvcnQgYXN5bmNQb29sIGZyb20gJ3RpbnktYXN5bmMtcG9vbCc7XHJcbmltcG9ydCBSZXNvdXJjZVR5cGUgZnJvbSAnLi4vLi4vQ29uc3RhbnRzL1Jlc291cmNlVHlwZSc7XHJcbmltcG9ydCB7IEFic2VudFBlcmlvZCwgQXR0ZW5kYW5jZSwgUGVyaW9kSW5mbyB9IGZyb20gJy4vSW50ZXJmYWNlcy9BdHRlbmRhbmNlJztcclxuaW1wb3J0IHsgU2NoZWR1bGVYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1NjaGVkdWxlJztcclxuaW1wb3J0IHsgU2NoZWR1bGUgfSBmcm9tICcuL0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgU2Nob29sSW5mb1hNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU2Nob29sSW5mbyc7XHJcbmltcG9ydCB7IFJlcG9ydENhcmRzWE1MT2JqZWN0IH0gZnJvbSAnLi4vUmVwb3J0Q2FyZC9SZXBvcnRDYXJkLnhtbCc7XHJcbmltcG9ydCB7IERvY3VtZW50WE1MT2JqZWN0IH0gZnJvbSAnLi4vRG9jdW1lbnQvRG9jdW1lbnQueG1sJztcclxuaW1wb3J0IFJlcG9ydENhcmQgZnJvbSAnLi4vUmVwb3J0Q2FyZC9SZXBvcnRDYXJkJztcclxuaW1wb3J0IERvY3VtZW50IGZyb20gJy4uL0RvY3VtZW50L0RvY3VtZW50JztcclxuaW1wb3J0IFJlcXVlc3RFeGNlcHRpb24gZnJvbSAnLi4vUmVxdWVzdEV4Y2VwdGlvbi9SZXF1ZXN0RXhjZXB0aW9uJztcclxuaW1wb3J0IFhNTEZhY3RvcnkgZnJvbSAnLi4vLi4vdXRpbHMvWE1MRmFjdG9yeS9YTUxGYWN0b3J5JztcclxuaW1wb3J0IGNhY2hlIGZyb20gJy4uLy4uL3V0aWxzL2NhY2hlL2NhY2hlJztcclxuXHJcbi8qKlxyXG4gKiBUaGUgU3R1ZGVudFZVRSBDbGllbnQgdG8gYWNjZXNzIHRoZSBBUElcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBleHRlbmRzIHtzb2FwLkNsaWVudH1cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCBleHRlbmRzIHNvYXAuQ2xpZW50IHtcclxuICBwcml2YXRlIGhvc3RVcmw6IHN0cmluZztcclxuICBjb25zdHJ1Y3RvcihjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFscywgaG9zdFVybDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihjcmVkZW50aWFscyk7XHJcbiAgICB0aGlzLmhvc3RVcmwgPSBob3N0VXJsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVmFsaWRhdGUncyB0aGUgdXNlcidzIGNyZWRlbnRpYWxzLiBJdCB3aWxsIHRocm93IGFuIGVycm9yIGlmIGNyZWRlbnRpYWxzIGFyZSBpbmNvcnJlY3RcclxuICAgKi9cclxuICBwdWJsaWMgdmFsaWRhdGVDcmVkZW50aWFscygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8UGFyc2VkUmVxdWVzdEVycm9yPih7IG1ldGhvZE5hbWU6ICdsb2dpbiB0ZXN0JywgdmFsaWRhdGVFcnJvcnM6IGZhbHNlIH0pXHJcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uc2UuUlRfRVJST1JbMF1bJ0BfRVJST1JfTUVTU0FHRSddWzBdID09PSAnbG9naW4gdGVzdCBpcyBub3QgYSB2YWxpZCBtZXRob2QuJykgcmVzKCk7XHJcbiAgICAgICAgICBlbHNlIHJlaihuZXcgUmVxdWVzdEV4Y2VwdGlvbihyZXNwb25zZSkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHN0dWRlbnQncyBkb2N1bWVudHMgZnJvbSBzeW5lcmd5IHNlcnZlcnNcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxEb2N1bWVudFtdPn0+IFJldHVybnMgYSBsaXN0IG9mIHN0dWRlbnQgZG9jdW1lbnRzXHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBkb2N1bWVudHMgPSBhd2FpdCBjbGllbnQuZG9jdW1lbnRzKCk7XHJcbiAgICogY29uc3QgZG9jdW1lbnQgPSBkb2N1bWVudHNbMF07XHJcbiAgICogY29uc3QgZmlsZXMgPSBhd2FpdCBkb2N1bWVudC5nZXQoKTtcclxuICAgKiBjb25zdCBiYXNlNjRjb2xsZWN0aW9uID0gZmlsZXMubWFwKChmaWxlKSA9PiBmaWxlLmJhc2U2NCk7XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGRvY3VtZW50cygpOiBQcm9taXNlPERvY3VtZW50W10+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8RG9jdW1lbnRYTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRTdHVkZW50RG9jdW1lbnRJbml0aWFsRGF0YScsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICByZXMoXHJcbiAgICAgICAgICAgIHhtbE9iamVjdFsnU3R1ZGVudERvY3VtZW50cyddWzBdLlN0dWRlbnREb2N1bWVudERhdGFzWzBdLlN0dWRlbnREb2N1bWVudERhdGEubWFwKFxyXG4gICAgICAgICAgICAgICh4bWwpID0+IG5ldyBEb2N1bWVudCh4bWwsIHN1cGVyLmNyZWRlbnRpYWxzKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgYSBsaXN0IG9mIHJlcG9ydCBjYXJkc1xyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFJlcG9ydENhcmRbXT59IFJldHVybnMgYSBsaXN0IG9mIHJlcG9ydCBjYXJkcyB0aGF0IGNhbiBmZXRjaCBhIGZpbGVcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IHJlcG9ydENhcmRzID0gYXdhaXQgY2xpZW50LnJlcG9ydENhcmRzKCk7XHJcbiAgICogY29uc3QgZmlsZXMgPSBhd2FpdCBQcm9taXNlLmFsbChyZXBvcnRDYXJkcy5tYXAoKGNhcmQpID0+IGNhcmQuZ2V0KCkpKTtcclxuICAgKiBjb25zdCBiYXNlNjRhcnIgPSBmaWxlcy5tYXAoKGZpbGUpID0+IGZpbGUuYmFzZTY0KTsgLy8gW1wiSlZCRVJpMC4uLlwiLCBcImRVSW9hMS4uLlwiLCAuLi5dO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyByZXBvcnRDYXJkcygpOiBQcm9taXNlPFJlcG9ydENhcmRbXT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxSZXBvcnRDYXJkc1hNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0dldFJlcG9ydENhcmRJbml0aWFsRGF0YScsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICByZXMoXHJcbiAgICAgICAgICAgIHhtbE9iamVjdC5SQ1JlcG9ydGluZ1BlcmlvZERhdGFbMF0uUkNSZXBvcnRpbmdQZXJpb2RzWzBdLlJDUmVwb3J0aW5nUGVyaW9kLm1hcChcclxuICAgICAgICAgICAgICAoeG1sKSA9PiBuZXcgUmVwb3J0Q2FyZCh4bWwsIHN1cGVyLmNyZWRlbnRpYWxzKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHN0dWRlbnQncyBzY2hvb2wncyBpbmZvcm1hdGlvblxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFNjaG9vbEluZm8+fSBSZXR1cm5zIHRoZSBpbmZvcm1hdGlvbiBvZiB0aGUgc3R1ZGVudCdzIHNjaG9vbFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogYXdhaXQgY2xpZW50LnNjaG9vbEluZm8oKTtcclxuICAgKlxyXG4gICAqIGNsaWVudC5zY2hvb2xJbmZvKCkudGhlbigoc2Nob29sSW5mbykgPT4ge1xyXG4gICAqICBjb25zb2xlLmxvZyhfLnVuaXEoc2Nob29sSW5mby5zdGFmZi5tYXAoKHN0YWZmKSA9PiBzdGFmZi5uYW1lKSkpOyAvLyBMaXN0IGFsbCBzdGFmZiBwb3NpdGlvbnMgdXNpbmcgbG9kYXNoXHJcbiAgICogfSlcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc2Nob29sSW5mbygpOiBQcm9taXNlPFNjaG9vbEluZm8+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8U2Nob29sSW5mb1hNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRTY2hvb2xJbmZvJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SUQ6IDAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCh7IFN0dWRlbnRTY2hvb2xJbmZvTGlzdGluZzogW3htbE9iamVjdF0gfSkgPT4ge1xyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgc2Nob29sOiB7XHJcbiAgICAgICAgICAgICAgYWRkcmVzczogeG1sT2JqZWN0WydAX1NjaG9vbEFkZHJlc3MnXVswXSxcclxuICAgICAgICAgICAgICBhZGRyZXNzQWx0OiB4bWxPYmplY3RbJ0BfU2Nob29sQWRkcmVzczInXVswXSxcclxuICAgICAgICAgICAgICBjaXR5OiB4bWxPYmplY3RbJ0BfU2Nob29sQ2l0eSddWzBdLFxyXG4gICAgICAgICAgICAgIHppcENvZGU6IHhtbE9iamVjdFsnQF9TY2hvb2xaaXAnXVswXSxcclxuICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0WydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgYWx0UGhvbmU6IHhtbE9iamVjdFsnQF9QaG9uZTInXVswXSxcclxuICAgICAgICAgICAgICBwcmluY2lwYWw6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdFsnQF9QcmluY2lwYWwnXVswXSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsRW1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgIHN0YWZmR3U6IHhtbE9iamVjdFsnQF9QcmluY2lwYWxHdSddWzBdLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0YWZmOiB4bWxPYmplY3QuU3RhZmZMaXN0c1swXS5TdGFmZkxpc3QubWFwKChzdGFmZikgPT4gKHtcclxuICAgICAgICAgICAgICBuYW1lOiBzdGFmZlsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgZW1haWw6IHN0YWZmWydAX0VNYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgc3RhZmZHdTogc3RhZmZbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgIGpvYlRpdGxlOiBzdGFmZlsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgIGV4dG46IHN0YWZmWydAX0V4dG4nXVswXSxcclxuICAgICAgICAgICAgICBwaG9uZTogc3RhZmZbJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgc2NoZWR1bGUgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcGFyYW0ge251bWJlcn0gdGVybUluZGV4IFRoZSBpbmRleCBvZiB0aGUgdGVybS5cclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTY2hlZHVsZT59IFJldHVybnMgdGhlIHNjaGVkdWxlIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBhd2FpdCBzY2hlZHVsZSgwKSAvLyAtPiB7IHRlcm06IHsgaW5kZXg6IDAsIG5hbWU6ICcxc3QgUXRyIFByb2dyZXNzJyB9LCAuLi4gfVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzY2hlZHVsZSh0ZXJtSW5kZXg/OiBudW1iZXIpOiBQcm9taXNlPFNjaGVkdWxlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFNjaGVkdWxlWE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudENsYXNzTGlzdCcsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwLCAuLi4odGVybUluZGV4ICE9IG51bGwgPyB7IFRlcm1JbmRleDogdGVybUluZGV4IH0gOiB7fSkgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIHRlcm06IHtcclxuICAgICAgICAgICAgICBpbmRleDogTnVtYmVyKHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9UZXJtSW5kZXgnXVswXSksXHJcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdWydAX1Rlcm1JbmRleE5hbWUnXVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9FcnJvck1lc3NhZ2UnXVswXSxcclxuICAgICAgICAgICAgdG9kYXk6XHJcbiAgICAgICAgICAgICAgdHlwZW9mIHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5Ub2RheVNjaGVkdWxlSW5mb0RhdGFbMF0uU2Nob29sSW5mb3NbMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICA/IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5Ub2RheVNjaGVkdWxlSW5mb0RhdGFbMF0uU2Nob29sSW5mb3NbMF0uU2Nob29sSW5mby5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgKHNjaG9vbCkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNjaG9vbFsnQF9TY2hvb2xOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBiZWxsU2NoZWR1bGVOYW1lOiBzY2hvb2xbJ0BfQmVsbFNjaGVkTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlczogc2Nob29sLkNsYXNzZXNbMF0uQ2xhc3NJbmZvLm1hcDxDbGFzc1NjaGVkdWxlSW5mbz4oKGNvdXJzZSkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIoY291cnNlWydAX1BlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ZW5kYW5jZUNvZGU6IGNvdXJzZS5BdHRlbmRhbmNlQ29kZVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShjb3Vyc2VbJ0BfU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoY291cnNlWydAX0VuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9DbGFzc05hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VjdGlvbkd1OiBjb3Vyc2VbJ0BfU2VjdGlvbkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYWNoZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogY291cnNlWydAX1RlYWNoZXJFbWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsU3ViamVjdDogY291cnNlWydAX0VtYWlsU3ViamVjdCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9UZWFjaGVyTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IGNvdXJzZVsnQF9TdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBjb3Vyc2VbJ0BfVGVhY2hlclVSTCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGNvdXJzZVsnQF9DbGFzc1VSTCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHBhcnNlKGNvdXJzZVsnQF9TdGFydFRpbWUnXVswXSwgJ2hoOm1tIGEnLCBEYXRlLm5vdygpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IHBhcnNlKGNvdXJzZVsnQF9FbmRUaW1lJ11bMF0sICdoaDptbSBhJywgRGF0ZS5ub3coKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgY2xhc3NlczogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLkNsYXNzTGlzdHNbMF0uQ2xhc3NMaXN0aW5nLm1hcCgoc3R1ZGVudENsYXNzKSA9PiAoe1xyXG4gICAgICAgICAgICAgIG5hbWU6IHN0dWRlbnRDbGFzc1snQF9Db3Vyc2VUaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKHN0dWRlbnRDbGFzc1snQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgcm9vbTogc3R1ZGVudENsYXNzWydAX1Jvb21OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgc2VjdGlvbkd1OiBzdHVkZW50Q2xhc3NbJ0BfU2VjdGlvbkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgdGVhY2hlcjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogc3R1ZGVudENsYXNzWydAX1RlYWNoZXInXVswXSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBzdHVkZW50Q2xhc3NbJ0BfVGVhY2hlckVtYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBzdGFmZkd1OiBzdHVkZW50Q2xhc3NbJ0BfVGVhY2hlclN0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICAgIHRlcm1zOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVGVybUxpc3RzWzBdLlRlcm1MaXN0aW5nLm1hcCgodGVybSkgPT4gKHtcclxuICAgICAgICAgICAgICBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUodGVybVsnQF9CZWdpbkRhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHRlcm1bJ0BfRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGluZGV4OiBOdW1iZXIodGVybVsnQF9UZXJtSW5kZXgnXVswXSksXHJcbiAgICAgICAgICAgICAgbmFtZTogdGVybVsnQF9UZXJtTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIHNjaG9vbFllYXJUZXJtQ29kZUd1OiB0ZXJtWydAX1NjaG9vbFllYXJUcm1Db2RlR1UnXVswXSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgYXR0ZW5kYW5jZSBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEF0dGVuZGFuY2U+fSBSZXR1cm5zIGFuIEF0dGVuZGFuY2Ugb2JqZWN0XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjbGllbnQuYXR0ZW5kYW5jZSgpXHJcbiAgICogIC50aGVuKGNvbnNvbGUubG9nKTsgLy8gLT4geyB0eXBlOiAnUGVyaW9kJywgcGVyaW9kOiB7Li4ufSwgc2Nob29sTmFtZTogJ1VuaXZlcnNpdHkgSGlnaCBTY2hvb2wnLCBhYnNlbmNlczogWy4uLl0sIHBlcmlvZEluZm9zOiBbLi4uXSB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGF0dGVuZGFuY2UoKTogUHJvbWlzZTxBdHRlbmRhbmNlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PEF0dGVuZGFuY2VYTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdBdHRlbmRhbmNlJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7XHJcbiAgICAgICAgICAgIGNoaWxkSW50SWQ6IDAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKGF0dGVuZGFuY2VYTUxPYmplY3QpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHhtbE9iamVjdCA9IGF0dGVuZGFuY2VYTUxPYmplY3QuQXR0ZW5kYW5jZVswXTtcclxuXHJcbiAgICAgICAgICByZXMoe1xyXG4gICAgICAgICAgICB0eXBlOiB4bWxPYmplY3RbJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgICBwZXJpb2Q6IHtcclxuICAgICAgICAgICAgICB0b3RhbDogTnVtYmVyKHhtbE9iamVjdFsnQF9QZXJpb2RDb3VudCddWzBdKSxcclxuICAgICAgICAgICAgICBzdGFydDogTnVtYmVyKHhtbE9iamVjdFsnQF9TdGFydFBlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgICBlbmQ6IE51bWJlcih4bWxPYmplY3RbJ0BfRW5kUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzY2hvb2xOYW1lOiB4bWxPYmplY3RbJ0BfU2Nob29sTmFtZSddWzBdLFxyXG4gICAgICAgICAgICBhYnNlbmNlczogeG1sT2JqZWN0LkFic2VuY2VzWzBdLkFic2VuY2UubWFwKChhYnNlbmNlKSA9PiAoe1xyXG4gICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGFic2VuY2VbJ0BfQWJzZW5jZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgcmVhc29uOiBhYnNlbmNlWydAX1JlYXNvbiddWzBdLFxyXG4gICAgICAgICAgICAgIG5vdGU6IGFic2VuY2VbJ0BfTm90ZSddWzBdLFxyXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBhYnNlbmNlWydAX0NvZGVBbGxEYXlEZXNjcmlwdGlvbiddWzBdLFxyXG4gICAgICAgICAgICAgIHBlcmlvZHM6IGFic2VuY2UuUGVyaW9kc1swXS5QZXJpb2QubWFwKFxyXG4gICAgICAgICAgICAgICAgKHBlcmlvZCkgPT5cclxuICAgICAgICAgICAgICAgICAgKHtcclxuICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihwZXJpb2RbJ0BfTnVtYmVyJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBwZXJpb2RbJ0BfUmVhc29uJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgY291cnNlOiBwZXJpb2RbJ0BfQ291cnNlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhZmY6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9TdGFmZiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgc3RhZmZHdTogcGVyaW9kWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBwZXJpb2RbJ0BfU3RhZmZFTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb3JnWWVhckd1OiBwZXJpb2RbJ0BfT3JnWWVhckdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIH0gYXMgQWJzZW50UGVyaW9kKVxyXG4gICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgICAgcGVyaW9kSW5mb3M6IHhtbE9iamVjdC5Ub3RhbEFjdGl2aXRpZXNbMF0uUGVyaW9kVG90YWwubWFwKChwZCwgaSkgPT4gKHtcclxuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihwZFsnQF9OdW1iZXInXVswXSksXHJcbiAgICAgICAgICAgICAgdG90YWw6IHtcclxuICAgICAgICAgICAgICAgIGV4Y3VzZWQ6IE51bWJlcih4bWxPYmplY3QuVG90YWxFeGN1c2VkWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgdGFyZGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbFRhcmRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgICB1bmV4Y3VzZWQ6IE51bWJlcih4bWxPYmplY3QuVG90YWxVbmV4Y3VzZWRbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsQWN0aXZpdGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICAgIHVuZXhjdXNlZFRhcmRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxVbmV4Y3VzZWRUYXJkaWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pKSBhcyBQZXJpb2RJbmZvW10sXHJcbiAgICAgICAgICB9IGFzIEF0dGVuZGFuY2UpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGdyYWRlYm9vayBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByZXBvcnRpbmdQZXJpb2RJbmRleCBUaGUgdGltZWZyYW1lIHRoYXQgdGhlIGdyYWRlYm9vayBzaG91bGQgcmV0dXJuXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8R3JhZGVib29rPn0gUmV0dXJucyBhIEdyYWRlYm9vayBvYmplY3RcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IGdyYWRlYm9vayA9IGF3YWl0IGNsaWVudC5ncmFkZWJvb2soKTtcclxuICAgKiBjb25zb2xlLmxvZyhncmFkZWJvb2spOyAvLyB7IGVycm9yOiAnJywgdHlwZTogJ1RyYWRpdGlvbmFsJywgcmVwb3J0aW5nUGVyaW9kOiB7Li4ufSwgY291cnNlczogWy4uLl0gfTtcclxuICAgKlxyXG4gICAqIGF3YWl0IGNsaWVudC5ncmFkZWJvb2soMCkgLy8gU29tZSBzY2hvb2xzIHdpbGwgaGF2ZSBSZXBvcnRpbmdQZXJpb2RJbmRleCAwIGFzIFwiMXN0IFF1YXJ0ZXIgUHJvZ3Jlc3NcIlxyXG4gICAqIGF3YWl0IGNsaWVudC5ncmFkZWJvb2soNykgLy8gU29tZSBzY2hvb2xzIHdpbGwgaGF2ZSBSZXBvcnRpbmdQZXJpb2RJbmRleCA3IGFzIFwiNHRoIFF1YXJ0ZXJcIlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBncmFkZWJvb2socmVwb3J0aW5nUGVyaW9kSW5kZXg/OiBudW1iZXIpOiBQcm9taXNlPEdyYWRlYm9vaz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxHcmFkZWJvb2tYTUxPYmplY3Q+KFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBtZXRob2ROYW1lOiAnR3JhZGVib29rJyxcclxuICAgICAgICAgICAgcGFyYW1TdHI6IHtcclxuICAgICAgICAgICAgICBjaGlsZEludElkOiAwLFxyXG4gICAgICAgICAgICAgIC4uLihyZXBvcnRpbmdQZXJpb2RJbmRleCAhPSBudWxsID8geyBSZXBvcnRQZXJpb2Q6IHJlcG9ydGluZ1BlcmlvZEluZGV4IH0gOiB7fSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKHhtbCkgPT5cclxuICAgICAgICAgICAgbmV3IFhNTEZhY3RvcnkoeG1sKVxyXG4gICAgICAgICAgICAgIC5lbmNvZGVBdHRyaWJ1dGUoJ01lYXN1cmVEZXNjcmlwdGlvbicsICdIYXNEcm9wQm94JylcclxuICAgICAgICAgICAgICAuZW5jb2RlQXR0cmlidXRlKCdNZWFzdXJlJywgJ1R5cGUnKVxyXG4gICAgICAgICAgICAgIC50b1N0cmluZygpXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3Q6IEdyYWRlYm9va1hNTE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgZXJyb3I6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfRXJyb3JNZXNzYWdlJ11bMF0sXHJcbiAgICAgICAgICAgIHR5cGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgICByZXBvcnRpbmdQZXJpb2Q6IHtcclxuICAgICAgICAgICAgICBjdXJyZW50OiB7XHJcbiAgICAgICAgICAgICAgICBpbmRleDpcclxuICAgICAgICAgICAgICAgICAgcmVwb3J0aW5nUGVyaW9kSW5kZXggPz9cclxuICAgICAgICAgICAgICAgICAgTnVtYmVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QuZmluZChcclxuICAgICAgICAgICAgICAgICAgICAgICh4KSA9PiB4WydAX0dyYWRlUGVyaW9kJ11bMF0gPT09IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0dyYWRlUGVyaW9kJ11bMF1cclxuICAgICAgICAgICAgICAgICAgICApPy5bJ0BfSW5kZXgnXVswXVxyXG4gICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0VuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfR3JhZGVQZXJpb2QnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGF2YWlsYWJsZTogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RzWzBdLlJlcG9ydFBlcmlvZC5tYXAoKHBlcmlvZCkgPT4gKHtcclxuICAgICAgICAgICAgICAgIGRhdGU6IHsgc3RhcnQ6IG5ldyBEYXRlKHBlcmlvZFsnQF9TdGFydERhdGUnXVswXSksIGVuZDogbmV3IERhdGUocGVyaW9kWydAX0VuZERhdGUnXVswXSkgfSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9HcmFkZVBlcmlvZCddWzBdLFxyXG4gICAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcihwZXJpb2RbJ0BfSW5kZXgnXVswXSksXHJcbiAgICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb3Vyc2VzOiB4bWxPYmplY3QuR3JhZGVib29rWzBdLkNvdXJzZXNbMF0uQ291cnNlLm1hcCgoY291cnNlKSA9PiAoe1xyXG4gICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKGNvdXJzZVsnQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgdGl0bGU6IGNvdXJzZVsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgIHJvb206IGNvdXJzZVsnQF9Sb29tJ11bMF0sXHJcbiAgICAgICAgICAgICAgc3RhZmY6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9TdGFmZiddWzBdLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IGNvdXJzZVsnQF9TdGFmZkVNYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBzdGFmZkd1OiBjb3Vyc2VbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbWFya3M6IGNvdXJzZS5NYXJrc1swXS5NYXJrLm1hcCgobWFyaykgPT4gKHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG1hcmtbJ0BfTWFya05hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRTY29yZToge1xyXG4gICAgICAgICAgICAgICAgICBzdHJpbmc6IG1hcmtbJ0BfQ2FsY3VsYXRlZFNjb3JlU3RyaW5nJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHJhdzogTnVtYmVyKG1hcmtbJ0BfQ2FsY3VsYXRlZFNjb3JlUmF3J11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHdlaWdodGVkQ2F0ZWdvcmllczpcclxuICAgICAgICAgICAgICAgICAgdHlwZW9mIG1hcmtbJ0dyYWRlQ2FsY3VsYXRpb25TdW1tYXJ5J11bMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgPyBtYXJrWydHcmFkZUNhbGN1bGF0aW9uU3VtbWFyeSddWzBdLkFzc2lnbm1lbnRHcmFkZUNhbGMubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAod2VpZ2h0ZWQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHdlaWdodGVkWydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRNYXJrOiB3ZWlnaHRlZFsnQF9DYWxjdWxhdGVkTWFyayddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2YWx1YXRlZDogd2VpZ2h0ZWRbJ0BfV2VpZ2h0ZWRQY3QnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmQ6IHdlaWdodGVkWydAX1dlaWdodCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBOdW1iZXIod2VpZ2h0ZWRbJ0BfUG9pbnRzJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NzaWJsZTogTnVtYmVyKHdlaWdodGVkWydAX1BvaW50c1Bvc3NpYmxlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFdlaWdodGVkQ2F0ZWdvcnkpXHJcbiAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnRzOlxyXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgbWFyay5Bc3NpZ25tZW50c1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICA/IChtYXJrLkFzc2lnbm1lbnRzWzBdLkFzc2lnbm1lbnQubWFwKChhc3NpZ25tZW50KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmFkZWJvb2tJZDogYXNzaWdubWVudFsnQF9HcmFkZWJvb2tJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBkZWNvZGVVUkkoYXNzaWdubWVudFsnQF9NZWFzdXJlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhc3NpZ25tZW50WydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHVlOiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0R1ZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYXNzaWdubWVudFsnQF9TY29yZVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYXNzaWdubWVudFsnQF9TY29yZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IGFzc2lnbm1lbnRbJ0BfUG9pbnRzJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGVzOiBhc3NpZ25tZW50WydAX05vdGVzJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYWNoZXJJZDogYXNzaWdubWVudFsnQF9UZWFjaGVySUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRlY29kZVVSSShhc3NpZ25tZW50WydAX01lYXN1cmVEZXNjcmlwdGlvbiddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzRHJvcGJveDogSlNPTi5wYXJzZShhc3NpZ25tZW50WydAX0hhc0Ryb3BCb3gnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0dWRlbnRJZDogYXNzaWdubWVudFsnQF9TdHVkZW50SUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGJveERhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9Ecm9wU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9Ecm9wRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBhc3NpZ25tZW50LlJlc291cmNlc1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdLlJlc291cmNlLm1hcCgocnNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocnNyY1snQF9UeXBlJ11bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ0ZpbGUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVSc3JjID0gcnNyYyBhcyBGaWxlUmVzb3VyY2VYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUmVzb3VyY2VUeXBlLkZJTEUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlsZVJzcmNbJ0BfRmlsZVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVSc3JjWydAX0ZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmk6IHRoaXMuaG9zdFVybCArIGZpbGVSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZmlsZVJzcmNbJ0BfUmVzb3VyY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGZpbGVSc3JjWydAX1Jlc291cmNlSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVSc3JjWydAX1Jlc291cmNlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgRmlsZVJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnVVJMJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmxSc3JjID0gcnNyYyBhcyBVUkxSZXNvdXJjZVhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybFJzcmNbJ0BfVVJMJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUmVzb3VyY2VUeXBlLlVSTCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUodXJsUnNyY1snQF9SZXNvdXJjZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdXJsUnNyY1snQF9SZXNvdXJjZUlEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB1cmxSc3JjWydAX1Jlc291cmNlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVybFJzcmNbJ0BfUmVzb3VyY2VEZXNjcmlwdGlvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogdXJsUnNyY1snQF9TZXJ2ZXJGaWxlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFVSTFJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBUeXBlICR7cnNyY1snQF9UeXBlJ11bMF19IGRvZXMgbm90IGV4aXN0IGFzIGEgdHlwZS4gQWRkIGl0IHRvIHR5cGUgZGVjbGFyYXRpb25zLmBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pIGFzIChGaWxlUmVzb3VyY2UgfCBVUkxSZXNvdXJjZSlbXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KSkgYXMgQXNzaWdubWVudFtdKVxyXG4gICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgfSkpIGFzIE1hcmtbXSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfSBhcyBHcmFkZWJvb2spO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhIGxpc3Qgb2YgbWVzc2FnZXMgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxNZXNzYWdlW10+fSBSZXR1cm5zIGFuIGFycmF5IG9mIG1lc3NhZ2VzIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTsgLy8gLT4gW3sgaWQ6ICdFOTcyRjFCQy05OUEwLTRDRDAtOEQxNS1CMTg5NjhCNDNFMDgnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH0sIHsgaWQ6ICc4NkZEQTExRC00MkM3LTQyNDktQjAwMy05NEIxNUVCMkM4RDQnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH1dXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIG1lc3NhZ2VzKCk6IFByb21pc2U8TWVzc2FnZVtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PE1lc3NhZ2VYTUxPYmplY3Q+KFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBtZXRob2ROYW1lOiAnR2V0UFhQTWVzc2FnZXMnLFxyXG4gICAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKHhtbCkgPT4gbmV3IFhNTEZhY3RvcnkoeG1sKS5lbmNvZGVBdHRyaWJ1dGUoJ0NvbnRlbnQnLCAnUmVhZCcpLnRvU3RyaW5nKClcclxuICAgICAgICApXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKFxyXG4gICAgICAgICAgICB4bWxPYmplY3QuUFhQTWVzc2FnZXNEYXRhWzBdLk1lc3NhZ2VMaXN0aW5nc1swXS5NZXNzYWdlTGlzdGluZy5tYXAoXHJcbiAgICAgICAgICAgICAgKG1lc3NhZ2UpID0+IG5ldyBNZXNzYWdlKG1lc3NhZ2UsIHN1cGVyLmNyZWRlbnRpYWxzLCB0aGlzLmhvc3RVcmwpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgaW5mbyBvZiBhIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTdHVkZW50SW5mbz59IFN0dWRlbnRJbmZvIG9iamVjdFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogc3R1ZGVudEluZm8oKS50aGVuKGNvbnNvbGUubG9nKSAvLyAtPiB7IHN0dWRlbnQ6IHsgbmFtZTogJ0V2YW4gRGF2aXMnLCBuaWNrbmFtZTogJycsIGxhc3ROYW1lOiAnRGF2aXMnIH0sIC4uLn1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc3R1ZGVudEluZm8oKTogUHJvbWlzZTxTdHVkZW50SW5mbz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFN0dWRlbnRJbmZvPigocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8U3R1ZGVudEluZm9YTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50SW5mbycsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0RGF0YSkgPT4ge1xyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgc3R1ZGVudDoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRm9ybWF0dGVkTmFtZVswXSxcclxuICAgICAgICAgICAgICBsYXN0TmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkxhc3ROYW1lR29lc0J5WzBdLFxyXG4gICAgICAgICAgICAgIG5pY2tuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uTmlja05hbWVbMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkJpcnRoRGF0ZVswXSksXHJcbiAgICAgICAgICAgIHRyYWNrOiB0aGlzLm9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5UcmFjayksXHJcbiAgICAgICAgICAgIGFkZHJlc3M6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLmJyKSxcclxuICAgICAgICAgICAgcGhvdG86IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBob3RvKSxcclxuICAgICAgICAgICAgY291bnNlbG9yOlxyXG4gICAgICAgICAgICAgIHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Db3Vuc2Vsb3JOYW1lICYmXHJcbiAgICAgICAgICAgICAgeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvckVtYWlsICYmXHJcbiAgICAgICAgICAgICAgeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvclN0YWZmR1VcclxuICAgICAgICAgICAgICAgID8ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Db3Vuc2Vsb3JOYW1lWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ291bnNlbG9yRW1haWxbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhZmZHdTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvclN0YWZmR1VbMF0sXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjdXJyZW50U2Nob29sOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ3VycmVudFNjaG9vbFswXSxcclxuICAgICAgICAgICAgZGVudGlzdDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RcclxuICAgICAgICAgICAgICA/IHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfRXh0biddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBvZmZpY2U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5EZW50aXN0WzBdWydAX09mZmljZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBwaHlzaWNpYW46IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5cclxuICAgICAgICAgICAgICA/IHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHBob25lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGh5c2ljaWFuWzBdWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIGV4dG46IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5bMF1bJ0BfRXh0biddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBob3NwaXRhbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9Ib3NwaXRhbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBpZDogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBlcm1JRCksXHJcbiAgICAgICAgICAgIG9yZ1llYXJHdTogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uT3JnWWVhckdVKSxcclxuICAgICAgICAgICAgcGhvbmU6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBob25lKSxcclxuICAgICAgICAgICAgZW1haWw6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkVNYWlsKSxcclxuICAgICAgICAgICAgZW1lcmdlbmN5Q29udGFjdHM6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5FbWVyZ2VuY3lDb250YWN0c1xyXG4gICAgICAgICAgICAgID8geG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkVtZXJnZW5jeUNvbnRhY3RzWzBdLkVtZXJnZW5jeUNvbnRhY3QubWFwKChjb250YWN0KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLm9wdGlvbmFsKGNvbnRhY3RbJ0BfTmFtZSddKSxcclxuICAgICAgICAgICAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBob21lOiB0aGlzLm9wdGlvbmFsKGNvbnRhY3RbJ0BfSG9tZVBob25lJ10pLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vYmlsZTogdGhpcy5vcHRpb25hbChjb250YWN0WydAX01vYmlsZVBob25lJ10pLFxyXG4gICAgICAgICAgICAgICAgICAgIG90aGVyOiB0aGlzLm9wdGlvbmFsKGNvbnRhY3RbJ0BfT3RoZXJQaG9uZSddKSxcclxuICAgICAgICAgICAgICAgICAgICB3b3JrOiB0aGlzLm9wdGlvbmFsKGNvbnRhY3RbJ0BfV29ya1Bob25lJ10pLFxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6IHRoaXMub3B0aW9uYWwoY29udGFjdFsnQF9SZWxhdGlvbnNoaXAnXSksXHJcbiAgICAgICAgICAgICAgICB9KSlcclxuICAgICAgICAgICAgICA6IFtdLFxyXG4gICAgICAgICAgICBnZW5kZXI6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HZW5kZXIpLFxyXG4gICAgICAgICAgICBncmFkZTogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkdyYWRlKSxcclxuICAgICAgICAgICAgbG9ja2VySW5mb1JlY29yZHM6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Mb2NrZXJJbmZvUmVjb3JkcyksXHJcbiAgICAgICAgICAgIGhvbWVMYW5ndWFnZTogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZUxhbmd1YWdlKSxcclxuICAgICAgICAgICAgaG9tZVJvb206IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tKSxcclxuICAgICAgICAgICAgaG9tZVJvb21UZWFjaGVyOiB7XHJcbiAgICAgICAgICAgICAgZW1haWw6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoRU1haWwpLFxyXG4gICAgICAgICAgICAgIG5hbWU6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoKSxcclxuICAgICAgICAgICAgICBzdGFmZkd1OiB0aGlzLm9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lUm9vbVRjaFN0YWZmR1UpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZGRpdGlvbmFsSW5mbzogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlVzZXJEZWZpbmVkR3JvdXBCb3hlc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94XHJcbiAgICAgICAgICAgICAgPyAoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlVzZXJEZWZpbmVkR3JvdXBCb3hlc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94Lm1hcChcclxuICAgICAgICAgICAgICAgICAgKGRlZmluZWRCb3gpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGRlZmluZWRCb3hbJ0BfR3JvdXBCb3hJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGRlZmluZWRCb3hbJ0BfR3JvdXBCb3hMYWJlbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHZjSWQ6IGRlZmluZWRCb3hbJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBkZWZpbmVkQm94LlVzZXJEZWZpbmVkSXRlbXNbMF0uVXNlckRlZmluZWRJdGVtLm1hcCgoaXRlbSkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBpdGVtWydAX1NvdXJjZUVsZW1lbnQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBpdGVtWydAX1NvdXJjZU9iamVjdCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgIHZjSWQ6IGl0ZW1bJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1bJ0BfVmFsdWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGl0ZW1bJ0BfSXRlbVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICB9KSkgYXMgQWRkaXRpb25hbEluZm9JdGVtW10sXHJcbiAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApIGFzIEFkZGl0aW9uYWxJbmZvW10pXHJcbiAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgIH0gYXMgU3R1ZGVudEluZm8pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlOiBEYXRlKSB7XHJcbiAgICByZXR1cm4gc3VwZXIucHJvY2Vzc1JlcXVlc3Q8Q2FsZW5kYXJYTUxPYmplY3Q+KFxyXG4gICAgICB7XHJcbiAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRDYWxlbmRhcicsXHJcbiAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgUmVxdWVzdERhdGU6IGRhdGUudG9JU09TdHJpbmcoKSB9LFxyXG4gICAgICB9LFxyXG4gICAgICAoeG1sKSA9PiBuZXcgWE1MRmFjdG9yeSh4bWwpLmVuY29kZUF0dHJpYnV0ZSgnVGl0bGUnLCAnSWNvbicpLnRvU3RyaW5nKClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9wdGlvbmFsPFQ+KHhtbEFycj86IFRbXSk6IFQgfCB1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuIHhtbEFyciA/IHhtbEFyclswXSA6IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtDYWxlbmRhck9wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyB0byBwcm92aWRlIGZvciBjYWxlbmRhciBtZXRob2QuIEFuIGludGVydmFsIGlzIHJlcXVpcmVkLlxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPENhbGVuZGFyPn0gUmV0dXJucyBhIENhbGVuZGFyIG9iamVjdFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY2xpZW50LmNhbGVuZGFyKHsgaW50ZXJ2YWw6IHsgc3RhcnQ6IG5ldyBEYXRlKCc1LzEvMjAyMicpLCBlbmQ6IG5ldyBEYXRlKCc4LzEvMjAyMScpIH0sIGNvbmN1cnJlbmN5OiBudWxsIH0pOyAvLyAtPiBMaW1pdGxlc3MgY29uY3VycmVuY3kgKG5vdCByZWNvbW1lbmRlZClcclxuICAgKlxyXG4gICAqIGNvbnN0IGNhbGVuZGFyID0gYXdhaXQgY2xpZW50LmNhbGVuZGFyKHsgaW50ZXJ2YWw6IHsgLi4uIH19KTtcclxuICAgKiBjb25zb2xlLmxvZyhjYWxlbmRhcik7IC8vIC0+IHsgc2Nob29sRGF0ZTogey4uLn0sIG91dHB1dFJhbmdlOiB7Li4ufSwgZXZlbnRzOiBbLi4uXSB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGFzeW5jIGNhbGVuZGFyKG9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyA9IHt9KTogUHJvbWlzZTxDYWxlbmRhcj4ge1xyXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyA9IHtcclxuICAgICAgY29uY3VycmVuY3k6IDcsXHJcbiAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgY2FsID0gYXdhaXQgY2FjaGUubWVtbygoKSA9PiB0aGlzLmZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwobmV3IERhdGUoKSkpO1xyXG4gICAgY29uc3Qgc2Nob29sRW5kRGF0ZTogRGF0ZSB8IG51bWJlciA9XHJcbiAgICAgIG9wdGlvbnMuaW50ZXJ2YWw/LmVuZCA/PyBuZXcgRGF0ZShjYWwuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEVuZERhdGUnXVswXSk7XHJcbiAgICBjb25zdCBzY2hvb2xTdGFydERhdGU6IERhdGUgfCBudW1iZXIgPVxyXG4gICAgICBvcHRpb25zLmludGVydmFsPy5zdGFydCA/PyBuZXcgRGF0ZShjYWwuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBjb25zdCBtb250aHNXaXRoaW5TY2hvb2xZZWFyID0gZWFjaE1vbnRoT2ZJbnRlcnZhbCh7IHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsIGVuZDogc2Nob29sRW5kRGF0ZSB9KTtcclxuICAgICAgY29uc3QgZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhciA9ICgpOiBQcm9taXNlPENhbGVuZGFyWE1MT2JqZWN0W10+ID0+XHJcbiAgICAgICAgZGVmYXVsdE9wdGlvbnMuY29uY3VycmVuY3kgPT0gbnVsbFxyXG4gICAgICAgICAgPyBQcm9taXNlLmFsbChtb250aHNXaXRoaW5TY2hvb2xZZWFyLm1hcCgoZGF0ZSkgPT4gdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpKSlcclxuICAgICAgICAgIDogYXN5bmNQb29sKGRlZmF1bHRPcHRpb25zLmNvbmN1cnJlbmN5LCBtb250aHNXaXRoaW5TY2hvb2xZZWFyLCAoZGF0ZSkgPT5cclxuICAgICAgICAgICAgICB0aGlzLmZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwoZGF0ZSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgbGV0IG1lbW86IENhbGVuZGFyIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgIGdldEFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIoKVxyXG4gICAgICAgIC50aGVuKChldmVudHMpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGFsbEV2ZW50cyA9IGV2ZW50cy5yZWR1Y2UoKHByZXYsIGV2ZW50cykgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWVtbyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgIG1lbW8gPSB7XHJcbiAgICAgICAgICAgICAgICBzY2hvb2xEYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXVsnQF9TY2hvb2xFbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG91dHB1dFJhbmdlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsXHJcbiAgICAgICAgICAgICAgICAgIGVuZDogc2Nob29sRW5kRGF0ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBldmVudHM6IFtdLFxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3Q6IENhbGVuZGFyID0ge1xyXG4gICAgICAgICAgICAgIC4uLm1lbW8sIC8vIFRoaXMgaXMgdG8gcHJldmVudCByZS1pbml0aWFsaXppbmcgRGF0ZSBvYmplY3RzIGluIG9yZGVyIHRvIGltcHJvdmUgcGVyZm9ybWFuY2VcclxuICAgICAgICAgICAgICBldmVudHM6IFtcclxuICAgICAgICAgICAgICAgIC4uLihwcmV2LmV2ZW50cyA/IHByZXYuZXZlbnRzIDogW10pLFxyXG4gICAgICAgICAgICAgICAgLi4uKHR5cGVvZiBldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdLkV2ZW50TGlzdHNbMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgID8gKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF0uRXZlbnRMaXN0c1swXS5FdmVudExpc3QubWFwKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChldmVudFsnQF9EYXlUeXBlJ11bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuQVNTSUdOTUVOVDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzc2lnbm1lbnRFdmVudCA9IGV2ZW50IGFzIEFzc2lnbm1lbnRFdmVudFhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGRlY29kZVVSSShhc3NpZ25tZW50RXZlbnRbJ0BfVGl0bGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRMaW5rRGF0YTogYXNzaWdubWVudEV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZ3U6IGFzc2lnbm1lbnRFdmVudFsnQF9BR1UnXSA/IGFzc2lnbm1lbnRFdmVudFsnQF9BR1UnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGFzc2lnbm1lbnRFdmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGd1OiBhc3NpZ25tZW50RXZlbnRbJ0BfREdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBhc3NpZ25tZW50RXZlbnRbJ0BfTGluayddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBhc3NpZ25tZW50RXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuQVNTSUdOTUVOVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdUeXBlOiBhc3NpZ25tZW50RXZlbnRbJ0BfVmlld1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIEFzc2lnbm1lbnRFdmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5IT0xJREFZOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBkZWNvZGVVUkkoZXZlbnRbJ0BfVGl0bGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuSE9MSURBWSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogZXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShldmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgSG9saWRheUV2ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLlJFR1VMQVI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWd1bGFyRXZlbnQgPSBldmVudCBhcyBSZWd1bGFyRXZlbnRYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBkZWNvZGVVUkkocmVndWxhckV2ZW50WydAX1RpdGxlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWd1OiByZWd1bGFyRXZlbnRbJ0BfQUdVJ10gPyByZWd1bGFyRXZlbnRbJ0BfQUdVJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShyZWd1bGFyRXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiByZWd1bGFyRXZlbnRbJ0BfRXZ0RGVzY3JpcHRpb24nXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHJlZ3VsYXJFdmVudFsnQF9FdnREZXNjcmlwdGlvbiddWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGd1OiByZWd1bGFyRXZlbnRbJ0BfREdVJ10gPyByZWd1bGFyRXZlbnRbJ0BfREdVJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiByZWd1bGFyRXZlbnRbJ0BfTGluayddID8gcmVndWxhckV2ZW50WydAX0xpbmsnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogcmVndWxhckV2ZW50WydAX1N0YXJ0VGltZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLlJFR1VMQVIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3VHlwZTogcmVndWxhckV2ZW50WydAX1ZpZXdUeXBlJ10gPyByZWd1bGFyRXZlbnRbJ0BfVmlld1R5cGUnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZExpbmtEYXRhOiByZWd1bGFyRXZlbnRbJ0BfQWRkTGlua0RhdGEnXSA/IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgUmVndWxhckV2ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSkgYXMgRXZlbnRbXSlcclxuICAgICAgICAgICAgICAgICAgOiBbXSksXHJcbiAgICAgICAgICAgICAgXSBhcyBFdmVudFtdLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XHJcbiAgICAgICAgICB9LCB7fSBhcyBDYWxlbmRhcik7XHJcbiAgICAgICAgICByZXMoeyAuLi5hbGxFdmVudHMsIGV2ZW50czogXy51bmlxQnkoYWxsRXZlbnRzLmV2ZW50cywgKGl0ZW0pID0+IGl0ZW0udGl0bGUpIH0gYXMgQ2FsZW5kYXIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19