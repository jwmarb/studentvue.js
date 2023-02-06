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
  async function asyncPoolAll(poolLimit, array, iteratorFn) {
    const results = [];
    for await (const result of (0, _tinyAsyncPool.default)(poolLimit, array, iteratorFn)) {
      results.push(result);
    }
    return results;
  }

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
          var _a4 = xmlObject.StudentClassSchedule[0].TermLists[0].TermListing;
          var _f4 = term => {
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
          var _r4 = [];
          for (var _i4 = 0; _i4 < _a4.length; _i4++) {
            _r4.push(_f4(_a4[_i4], _i4, _a4));
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
                classes: typeof school.Classes[0] !== 'string' ? school.Classes[0].ClassInfo.map(course => {
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
                }) : []
              };
            }) : [],
            classes: typeof xmlObject.StudentClassSchedule[0].ClassLists[0] !== 'string' ? xmlObject.StudentClassSchedule[0].ClassLists[0].ClassListing.map(studentClass => {
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
            }) : [],
            terms: _r4
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
          var _a5 = xmlObject.TotalActivities[0].PeriodTotal;
          var _f5 = (pd, i) => {
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
          var _r5 = [];
          for (var _i5 = 0; _i5 < _a5.length; _i5++) {
            _r5.push(_f5(_a5[_i5], _i5, _a5));
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
            periodInfos: _r5
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
          var _a6 = xmlObject.Gradebook[0].ReportingPeriods[0].ReportPeriod;
          var _f6 = period => {
            return {
              date: {
                start: new Date(period['@_StartDate'][0]),
                end: new Date(period['@_EndDate'][0])
              },
              name: period['@_GradePeriod'][0],
              index: Number(period['@_Index'][0])
            };
          };
          var _r6 = [];
          for (var _i6 = 0; _i6 < _a6.length; _i6++) {
            _r6.push(_f6(_a6[_i6], _i6, _a6));
          }
          var _a7 = xmlObject.Gradebook[0].Courses[0].Course;
          var _f7 = course => {
            var _a8 = course.Marks[0].Mark;
            var _f8 = mark => {
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
            var _r8 = [];
            for (var _i8 = 0; _i8 < _a8.length; _i8++) {
              _r8.push(_f8(_a8[_i8], _i8, _a8));
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
              marks: _r8
            };
          };
          var _r7 = [];
          for (var _i7 = 0; _i7 < _a7.length; _i7++) {
            _r7.push(_f7(_a7[_i7], _i7, _a7));
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
              available: _r6
            },
            courses: _r7
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
          var _a9 = xmlObject.PXPMessagesData[0].MessageListings[0].MessageListing;
          var _f9 = message => {
            return new _Message.default(message, super.credentials, this.hostUrl);
          };
          var _r9 = [];
          for (var _i9 = 0; _i9 < _a9.length; _i9++) {
            _r9.push(_f9(_a9[_i9], _i9, _a9));
          }
          res(_r9);
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
              lastName: xmlObjectData.StudentInfo[0].LastNameGoesBy[0],
              nickname: xmlObjectData.StudentInfo[0].NickName[0]
            },
            birthDate: new Date(xmlObjectData.StudentInfo[0].BirthDate[0]),
            track: this.optional(xmlObjectData.StudentInfo[0].Track),
            address: this.optional(xmlObjectData.StudentInfo[0].Address),
            photo: this.optional(xmlObjectData.StudentInfo[0].Photo),
            counselor: xmlObjectData.StudentInfo[0].CounselorName && xmlObjectData.StudentInfo[0].CounselorEmail && xmlObjectData.StudentInfo[0].CounselorStaffGU ? {
              name: xmlObjectData.StudentInfo[0].CounselorName[0],
              email: xmlObjectData.StudentInfo[0].CounselorEmail[0],
              staffGu: xmlObjectData.StudentInfo[0].CounselorStaffGU[0]
            } : undefined,
            currentSchool: xmlObjectData.StudentInfo[0].CurrentSchool[0],
            dentist: xmlObjectData.StudentInfo[0].Dentist ? {
              name: xmlObjectData.StudentInfo[0].Dentist[0]['@_Name'][0],
              phone: xmlObjectData.StudentInfo[0].Dentist[0]['@_Phone'][0],
              extn: xmlObjectData.StudentInfo[0].Dentist[0]['@_Extn'][0],
              office: xmlObjectData.StudentInfo[0].Dentist[0]['@_Office'][0]
            } : undefined,
            physician: xmlObjectData.StudentInfo[0].Physician ? {
              name: xmlObjectData.StudentInfo[0].Physician[0]['@_Name'][0],
              phone: xmlObjectData.StudentInfo[0].Physician[0]['@_Phone'][0],
              extn: xmlObjectData.StudentInfo[0].Physician[0]['@_Extn'][0],
              hospital: xmlObjectData.StudentInfo[0].Physician[0]['@_Hospital'][0]
            } : undefined,
            id: this.optional(xmlObjectData.StudentInfo[0].PermID),
            orgYearGu: this.optional(xmlObjectData.StudentInfo[0].OrgYearGU),
            phone: this.optional(xmlObjectData.StudentInfo[0].Phone),
            email: this.optional(xmlObjectData.StudentInfo[0].EMail),
            emergencyContacts: xmlObjectData.StudentInfo[0].EmergencyContacts ? xmlObjectData.StudentInfo[0].EmergencyContacts[0].EmergencyContact.map(contact => {
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
            homeLanguage: this.optional(xmlObjectData.StudentInfo[0].HomeLanguage),
            homeRoom: this.optional(xmlObjectData.StudentInfo[0].HomeRoom),
            homeRoomTeacher: {
              email: this.optional(xmlObjectData.StudentInfo[0].HomeRoomTchEMail),
              name: this.optional(xmlObjectData.StudentInfo[0].HomeRoomTch),
              staffGu: this.optional(xmlObjectData.StudentInfo[0].HomeRoomTchStaffGU)
            },
            additionalInfo: xmlObjectData.StudentInfo[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox ? xmlObjectData.StudentInfo[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox.map(definedBox => {
              return {
                id: this.optional(definedBox['@_GroupBoxID']),
                // string | undefined
                type: definedBox['@_GroupBoxLabel'][0],
                // string
                vcId: this.optional(definedBox['@_VCID']),
                // string | undefined
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
          })) : asyncPoolAll(defaultOptions.concurrency, monthsWithinSchoolYear, date => {
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
            const rest = {
              ...memo,
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
          res({
            ...allEvents,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3luY1Bvb2xBbGwiLCJwb29sTGltaXQiLCJhcnJheSIsIml0ZXJhdG9yRm4iLCJyZXN1bHRzIiwicmVzdWx0IiwiYXN5bmNQb29sIiwicHVzaCIsIkNsaWVudCIsInNvYXAiLCJjb25zdHJ1Y3RvciIsImNyZWRlbnRpYWxzIiwiaG9zdFVybCIsInZhbGlkYXRlQ3JlZGVudGlhbHMiLCJQcm9taXNlIiwicmVzIiwicmVqIiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwidmFsaWRhdGVFcnJvcnMiLCJ0aGVuIiwicmVzcG9uc2UiLCJSVF9FUlJPUiIsIlJlcXVlc3RFeGNlcHRpb24iLCJjYXRjaCIsImRvY3VtZW50cyIsInBhcmFtU3RyIiwiY2hpbGRJbnRJZCIsInhtbE9iamVjdCIsIlN0dWRlbnREb2N1bWVudERhdGFzIiwiU3R1ZGVudERvY3VtZW50RGF0YSIsInhtbCIsIkRvY3VtZW50IiwicmVwb3J0Q2FyZHMiLCJSQ1JlcG9ydGluZ1BlcmlvZERhdGEiLCJSQ1JlcG9ydGluZ1BlcmlvZHMiLCJSQ1JlcG9ydGluZ1BlcmlvZCIsIlJlcG9ydENhcmQiLCJzY2hvb2xJbmZvIiwiY2hpbGRJbnRJRCIsIlN0dWRlbnRTY2hvb2xJbmZvTGlzdGluZyIsIlN0YWZmTGlzdHMiLCJTdGFmZkxpc3QiLCJzdGFmZiIsIm5hbWUiLCJlbWFpbCIsInN0YWZmR3UiLCJqb2JUaXRsZSIsImV4dG4iLCJwaG9uZSIsInNjaG9vbCIsImFkZHJlc3MiLCJhZGRyZXNzQWx0IiwiY2l0eSIsInppcENvZGUiLCJhbHRQaG9uZSIsInByaW5jaXBhbCIsInNjaGVkdWxlIiwidGVybUluZGV4IiwiVGVybUluZGV4IiwiU3R1ZGVudENsYXNzU2NoZWR1bGUiLCJUZXJtTGlzdHMiLCJUZXJtTGlzdGluZyIsInRlcm0iLCJkYXRlIiwic3RhcnQiLCJEYXRlIiwiZW5kIiwiaW5kZXgiLCJOdW1iZXIiLCJzY2hvb2xZZWFyVGVybUNvZGVHdSIsImVycm9yIiwidG9kYXkiLCJUb2RheVNjaGVkdWxlSW5mb0RhdGEiLCJTY2hvb2xJbmZvcyIsIlNjaG9vbEluZm8iLCJtYXAiLCJiZWxsU2NoZWR1bGVOYW1lIiwiY2xhc3NlcyIsIkNsYXNzZXMiLCJDbGFzc0luZm8iLCJjb3Vyc2UiLCJwZXJpb2QiLCJhdHRlbmRhbmNlQ29kZSIsIkF0dGVuZGFuY2VDb2RlIiwic2VjdGlvbkd1IiwidGVhY2hlciIsImVtYWlsU3ViamVjdCIsInVybCIsInRpbWUiLCJwYXJzZSIsIm5vdyIsIkNsYXNzTGlzdHMiLCJDbGFzc0xpc3RpbmciLCJzdHVkZW50Q2xhc3MiLCJyb29tIiwidGVybXMiLCJhdHRlbmRhbmNlIiwiYXR0ZW5kYW5jZVhNTE9iamVjdCIsIkF0dGVuZGFuY2UiLCJUb3RhbEFjdGl2aXRpZXMiLCJQZXJpb2RUb3RhbCIsInBkIiwiaSIsInRvdGFsIiwiZXhjdXNlZCIsIlRvdGFsRXhjdXNlZCIsInRhcmRpZXMiLCJUb3RhbFRhcmRpZXMiLCJ1bmV4Y3VzZWQiLCJUb3RhbFVuZXhjdXNlZCIsImFjdGl2aXRpZXMiLCJ1bmV4Y3VzZWRUYXJkaWVzIiwiVG90YWxVbmV4Y3VzZWRUYXJkaWVzIiwidHlwZSIsInNjaG9vbE5hbWUiLCJhYnNlbmNlcyIsIkFic2VuY2VzIiwiQWJzZW5jZSIsImFic2VuY2UiLCJyZWFzb24iLCJub3RlIiwiZGVzY3JpcHRpb24iLCJwZXJpb2RzIiwiUGVyaW9kcyIsIlBlcmlvZCIsIm9yZ1llYXJHdSIsInBlcmlvZEluZm9zIiwiZ3JhZGVib29rIiwicmVwb3J0aW5nUGVyaW9kSW5kZXgiLCJSZXBvcnRQZXJpb2QiLCJYTUxGYWN0b3J5IiwiZW5jb2RlQXR0cmlidXRlIiwidG9TdHJpbmciLCJHcmFkZWJvb2siLCJSZXBvcnRpbmdQZXJpb2RzIiwiQ291cnNlcyIsIkNvdXJzZSIsIk1hcmtzIiwiTWFyayIsIm1hcmsiLCJjYWxjdWxhdGVkU2NvcmUiLCJzdHJpbmciLCJyYXciLCJ3ZWlnaHRlZENhdGVnb3JpZXMiLCJBc3NpZ25tZW50R3JhZGVDYWxjIiwid2VpZ2h0ZWQiLCJjYWxjdWxhdGVkTWFyayIsIndlaWdodCIsImV2YWx1YXRlZCIsInN0YW5kYXJkIiwicG9pbnRzIiwiY3VycmVudCIsInBvc3NpYmxlIiwiYXNzaWdubWVudHMiLCJBc3NpZ25tZW50cyIsIkFzc2lnbm1lbnQiLCJhc3NpZ25tZW50IiwiZ3JhZGVib29rSWQiLCJkZWNvZGVVUkkiLCJkdWUiLCJzY29yZSIsInZhbHVlIiwibm90ZXMiLCJ0ZWFjaGVySWQiLCJoYXNEcm9wYm94IiwiSlNPTiIsInN0dWRlbnRJZCIsImRyb3Bib3hEYXRlIiwicmVzb3VyY2VzIiwiUmVzb3VyY2VzIiwiUmVzb3VyY2UiLCJyc3JjIiwiZmlsZVJzcmMiLCJSZXNvdXJjZVR5cGUiLCJGSUxFIiwiZmlsZSIsInVyaSIsInJlc291cmNlIiwiaWQiLCJ1cmxSc3JjIiwiVVJMIiwicGF0aCIsInRpdGxlIiwibWFya3MiLCJyZXBvcnRpbmdQZXJpb2QiLCJmaW5kIiwieCIsIlJlcG9ydGluZ1BlcmlvZCIsImF2YWlsYWJsZSIsImNvdXJzZXMiLCJtZXNzYWdlcyIsIlBYUE1lc3NhZ2VzRGF0YSIsIk1lc3NhZ2VMaXN0aW5ncyIsIk1lc3NhZ2VMaXN0aW5nIiwibWVzc2FnZSIsIk1lc3NhZ2UiLCJzdHVkZW50SW5mbyIsInhtbE9iamVjdERhdGEiLCJzdHVkZW50IiwiU3R1ZGVudEluZm8iLCJGb3JtYXR0ZWROYW1lIiwibGFzdE5hbWUiLCJMYXN0TmFtZUdvZXNCeSIsIm5pY2tuYW1lIiwiTmlja05hbWUiLCJiaXJ0aERhdGUiLCJCaXJ0aERhdGUiLCJ0cmFjayIsIm9wdGlvbmFsIiwiVHJhY2siLCJBZGRyZXNzIiwicGhvdG8iLCJQaG90byIsImNvdW5zZWxvciIsIkNvdW5zZWxvck5hbWUiLCJDb3Vuc2Vsb3JFbWFpbCIsIkNvdW5zZWxvclN0YWZmR1UiLCJ1bmRlZmluZWQiLCJjdXJyZW50U2Nob29sIiwiQ3VycmVudFNjaG9vbCIsImRlbnRpc3QiLCJEZW50aXN0Iiwib2ZmaWNlIiwicGh5c2ljaWFuIiwiUGh5c2ljaWFuIiwiaG9zcGl0YWwiLCJQZXJtSUQiLCJPcmdZZWFyR1UiLCJQaG9uZSIsIkVNYWlsIiwiZW1lcmdlbmN5Q29udGFjdHMiLCJFbWVyZ2VuY3lDb250YWN0cyIsIkVtZXJnZW5jeUNvbnRhY3QiLCJjb250YWN0IiwiaG9tZSIsIm1vYmlsZSIsIm90aGVyIiwid29yayIsInJlbGF0aW9uc2hpcCIsImdlbmRlciIsIkdlbmRlciIsImdyYWRlIiwiR3JhZGUiLCJsb2NrZXJJbmZvUmVjb3JkcyIsIkxvY2tlckluZm9SZWNvcmRzIiwiaG9tZUxhbmd1YWdlIiwiSG9tZUxhbmd1YWdlIiwiaG9tZVJvb20iLCJIb21lUm9vbSIsImhvbWVSb29tVGVhY2hlciIsIkhvbWVSb29tVGNoRU1haWwiLCJIb21lUm9vbVRjaCIsIkhvbWVSb29tVGNoU3RhZmZHVSIsImFkZGl0aW9uYWxJbmZvIiwiVXNlckRlZmluZWRHcm91cEJveGVzIiwiVXNlckRlZmluZWRHcm91cEJveCIsImRlZmluZWRCb3giLCJ2Y0lkIiwiaXRlbXMiLCJVc2VyRGVmaW5lZEl0ZW1zIiwiVXNlckRlZmluZWRJdGVtIiwiaXRlbSIsInNvdXJjZSIsImVsZW1lbnQiLCJvYmplY3QiLCJmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsIiwiUmVxdWVzdERhdGUiLCJ0b0lTT1N0cmluZyIsInhtbEFyciIsImNhbGVuZGFyIiwib3B0aW9ucyIsImRlZmF1bHRPcHRpb25zIiwiY29uY3VycmVuY3kiLCJjYWwiLCJjYWNoZSIsIm1lbW8iLCJzY2hvb2xFbmREYXRlIiwiaW50ZXJ2YWwiLCJDYWxlbmRhckxpc3RpbmciLCJzY2hvb2xTdGFydERhdGUiLCJtb250aHNXaXRoaW5TY2hvb2xZZWFyIiwiZWFjaE1vbnRoT2ZJbnRlcnZhbCIsImdldEFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIiLCJhbGwiLCJldmVudHMiLCJhbGxFdmVudHMiLCJyZWR1Y2UiLCJwcmV2Iiwic2Nob29sRGF0ZSIsIm91dHB1dFJhbmdlIiwicmVzdCIsIkV2ZW50TGlzdHMiLCJFdmVudExpc3QiLCJldmVudCIsIkV2ZW50VHlwZSIsIkFTU0lHTk1FTlQiLCJhc3NpZ25tZW50RXZlbnQiLCJhZGRMaW5rRGF0YSIsImFndSIsImRndSIsImxpbmsiLCJzdGFydFRpbWUiLCJ2aWV3VHlwZSIsIkhPTElEQVkiLCJSRUdVTEFSIiwicmVndWxhckV2ZW50IiwiXyIsInVuaXFCeSJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscywgUGFyc2VkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgc29hcCBmcm9tICcuLi8uLi91dGlscy9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgeyBBZGRpdGlvbmFsSW5mbywgQWRkaXRpb25hbEluZm9JdGVtLCBDbGFzc1NjaGVkdWxlSW5mbywgU2Nob29sSW5mbywgU3R1ZGVudEluZm8gfSBmcm9tICcuL0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgU3R1ZGVudEluZm9YTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1N0dWRlbnRJbmZvJztcclxuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi4vTWVzc2FnZS9NZXNzYWdlJztcclxuaW1wb3J0IHsgTWVzc2FnZVhNTE9iamVjdCB9IGZyb20gJy4uL01lc3NhZ2UvTWVzc2FnZS54bWwnO1xyXG5pbXBvcnQgeyBBc3NpZ25tZW50RXZlbnRYTUxPYmplY3QsIENhbGVuZGFyWE1MT2JqZWN0LCBSZWd1bGFyRXZlbnRYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0NhbGVuZGFyJztcclxuaW1wb3J0IHsgQXNzaWdubWVudEV2ZW50LCBDYWxlbmRhciwgQ2FsZW5kYXJPcHRpb25zLCBFdmVudCwgSG9saWRheUV2ZW50LCBSZWd1bGFyRXZlbnQgfSBmcm9tICcuL0ludGVyZmFjZXMvQ2FsZW5kYXInO1xyXG5pbXBvcnQgeyBlYWNoTW9udGhPZkludGVydmFsLCBwYXJzZSB9IGZyb20gJ2RhdGUtZm5zJztcclxuaW1wb3J0IHsgRmlsZVJlc291cmNlWE1MT2JqZWN0LCBHcmFkZWJvb2tYTUxPYmplY3QsIFVSTFJlc291cmNlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9HcmFkZWJvb2snO1xyXG5pbXBvcnQgeyBBdHRlbmRhbmNlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9BdHRlbmRhbmNlJztcclxuaW1wb3J0IEV2ZW50VHlwZSBmcm9tICcuLi8uLi9Db25zdGFudHMvRXZlbnRUeXBlJztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgQXNzaWdubWVudCwgRmlsZVJlc291cmNlLCBHcmFkZWJvb2ssIE1hcmssIFVSTFJlc291cmNlLCBXZWlnaHRlZENhdGVnb3J5IH0gZnJvbSAnLi9JbnRlcmZhY2VzL0dyYWRlYm9vayc7XHJcbmltcG9ydCBhc3luY1Bvb2wgZnJvbSAndGlueS1hc3luYy1wb29sJztcclxuaW1wb3J0IFJlc291cmNlVHlwZSBmcm9tICcuLi8uLi9Db25zdGFudHMvUmVzb3VyY2VUeXBlJztcclxuaW1wb3J0IHsgQWJzZW50UGVyaW9kLCBBdHRlbmRhbmNlLCBQZXJpb2RJbmZvIH0gZnJvbSAnLi9JbnRlcmZhY2VzL0F0dGVuZGFuY2UnO1xyXG5pbXBvcnQgeyBTY2hlZHVsZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU2NoZWR1bGUnO1xyXG5pbXBvcnQgeyBTY2hlZHVsZSB9IGZyb20gJy4vQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBTY2hvb2xJbmZvWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9TY2hvb2xJbmZvJztcclxuaW1wb3J0IHsgUmVwb3J0Q2FyZHNYTUxPYmplY3QgfSBmcm9tICcuLi9SZXBvcnRDYXJkL1JlcG9ydENhcmQueG1sJztcclxuaW1wb3J0IHsgRG9jdW1lbnRYTUxPYmplY3QgfSBmcm9tICcuLi9Eb2N1bWVudC9Eb2N1bWVudC54bWwnO1xyXG5pbXBvcnQgUmVwb3J0Q2FyZCBmcm9tICcuLi9SZXBvcnRDYXJkL1JlcG9ydENhcmQnO1xyXG5pbXBvcnQgRG9jdW1lbnQgZnJvbSAnLi4vRG9jdW1lbnQvRG9jdW1lbnQnO1xyXG5pbXBvcnQgUmVxdWVzdEV4Y2VwdGlvbiBmcm9tICcuLi9SZXF1ZXN0RXhjZXB0aW9uL1JlcXVlc3RFeGNlcHRpb24nO1xyXG5pbXBvcnQgWE1MRmFjdG9yeSBmcm9tICcuLi8uLi91dGlscy9YTUxGYWN0b3J5L1hNTEZhY3RvcnknO1xyXG5pbXBvcnQgY2FjaGUgZnJvbSAnLi4vLi4vdXRpbHMvY2FjaGUvY2FjaGUnO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gYXN5bmNQb29sQWxsPElOLCBPVVQ+KFxyXG4gIHBvb2xMaW1pdDogbnVtYmVyLFxyXG4gIGFycmF5OiByZWFkb25seSBJTltdLFxyXG4gIGl0ZXJhdG9yRm46IChnZW5lcmF0b3I6IElOKSA9PiBQcm9taXNlPE9VVD5cclxuKSB7XHJcbiAgY29uc3QgcmVzdWx0cyA9IFtdO1xyXG4gIGZvciBhd2FpdCAoY29uc3QgcmVzdWx0IG9mIGFzeW5jUG9vbChwb29sTGltaXQsIGFycmF5LCBpdGVyYXRvckZuKSkge1xyXG4gICAgcmVzdWx0cy5wdXNoKHJlc3VsdCk7XHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHRzO1xyXG59XHJcblxyXG4vKipcclxuICogVGhlIFN0dWRlbnRWVUUgQ2xpZW50IHRvIGFjY2VzcyB0aGUgQVBJXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQgZXh0ZW5kcyBzb2FwLkNsaWVudCB7XHJcbiAgcHJpdmF0ZSBob3N0VXJsOiBzdHJpbmc7XHJcbiAgY29uc3RydWN0b3IoY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsIGhvc3RVcmw6IHN0cmluZykge1xyXG4gICAgc3VwZXIoY3JlZGVudGlhbHMpO1xyXG4gICAgdGhpcy5ob3N0VXJsID0gaG9zdFVybDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFZhbGlkYXRlJ3MgdGhlIHVzZXIncyBjcmVkZW50aWFscy4gSXQgd2lsbCB0aHJvdyBhbiBlcnJvciBpZiBjcmVkZW50aWFscyBhcmUgaW5jb3JyZWN0XHJcbiAgICovXHJcbiAgcHVibGljIHZhbGlkYXRlQ3JlZGVudGlhbHMoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFBhcnNlZFJlcXVlc3RFcnJvcj4oeyBtZXRob2ROYW1lOiAnbG9naW4gdGVzdCcsIHZhbGlkYXRlRXJyb3JzOiBmYWxzZSB9KVxyXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLlJUX0VSUk9SWzBdWydAX0VSUk9SX01FU1NBR0UnXVswXSA9PT0gJ2xvZ2luIHRlc3QgaXMgbm90IGEgdmFsaWQgbWV0aG9kLicpIHJlcygpO1xyXG4gICAgICAgICAgZWxzZSByZWoobmV3IFJlcXVlc3RFeGNlcHRpb24ocmVzcG9uc2UpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBzdHVkZW50J3MgZG9jdW1lbnRzIGZyb20gc3luZXJneSBzZXJ2ZXJzXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8RG9jdW1lbnRbXT59PiBSZXR1cm5zIGEgbGlzdCBvZiBzdHVkZW50IGRvY3VtZW50c1xyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgZG9jdW1lbnRzID0gYXdhaXQgY2xpZW50LmRvY3VtZW50cygpO1xyXG4gICAqIGNvbnN0IGRvY3VtZW50ID0gZG9jdW1lbnRzWzBdO1xyXG4gICAqIGNvbnN0IGZpbGVzID0gYXdhaXQgZG9jdW1lbnQuZ2V0KCk7XHJcbiAgICogY29uc3QgYmFzZTY0Y29sbGVjdGlvbiA9IGZpbGVzLm1hcCgoZmlsZSkgPT4gZmlsZS5iYXNlNjQpO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBkb2N1bWVudHMoKTogUHJvbWlzZTxEb2N1bWVudFtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PERvY3VtZW50WE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnR2V0U3R1ZGVudERvY3VtZW50SW5pdGlhbERhdGEnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKFxyXG4gICAgICAgICAgICB4bWxPYmplY3RbJ1N0dWRlbnREb2N1bWVudHMnXVswXS5TdHVkZW50RG9jdW1lbnREYXRhc1swXS5TdHVkZW50RG9jdW1lbnREYXRhLm1hcChcclxuICAgICAgICAgICAgICAoeG1sKSA9PiBuZXcgRG9jdW1lbnQoeG1sLCBzdXBlci5jcmVkZW50aWFscylcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIGEgbGlzdCBvZiByZXBvcnQgY2FyZHNcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxSZXBvcnRDYXJkW10+fSBSZXR1cm5zIGEgbGlzdCBvZiByZXBvcnQgY2FyZHMgdGhhdCBjYW4gZmV0Y2ggYSBmaWxlXHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCByZXBvcnRDYXJkcyA9IGF3YWl0IGNsaWVudC5yZXBvcnRDYXJkcygpO1xyXG4gICAqIGNvbnN0IGZpbGVzID0gYXdhaXQgUHJvbWlzZS5hbGwocmVwb3J0Q2FyZHMubWFwKChjYXJkKSA9PiBjYXJkLmdldCgpKSk7XHJcbiAgICogY29uc3QgYmFzZTY0YXJyID0gZmlsZXMubWFwKChmaWxlKSA9PiBmaWxlLmJhc2U2NCk7IC8vIFtcIkpWQkVSaTAuLi5cIiwgXCJkVUlvYTEuLi5cIiwgLi4uXTtcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgcmVwb3J0Q2FyZHMoKTogUHJvbWlzZTxSZXBvcnRDYXJkW10+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8UmVwb3J0Q2FyZHNYTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRSZXBvcnRDYXJkSW5pdGlhbERhdGEnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKFxyXG4gICAgICAgICAgICB4bWxPYmplY3QuUkNSZXBvcnRpbmdQZXJpb2REYXRhWzBdLlJDUmVwb3J0aW5nUGVyaW9kc1swXS5SQ1JlcG9ydGluZ1BlcmlvZC5tYXAoXHJcbiAgICAgICAgICAgICAgKHhtbCkgPT4gbmV3IFJlcG9ydENhcmQoeG1sLCBzdXBlci5jcmVkZW50aWFscylcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBzdHVkZW50J3Mgc2Nob29sJ3MgaW5mb3JtYXRpb25cclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTY2hvb2xJbmZvPn0gUmV0dXJucyB0aGUgaW5mb3JtYXRpb24gb2YgdGhlIHN0dWRlbnQncyBzY2hvb2xcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGF3YWl0IGNsaWVudC5zY2hvb2xJbmZvKCk7XHJcbiAgICpcclxuICAgKiBjbGllbnQuc2Nob29sSW5mbygpLnRoZW4oKHNjaG9vbEluZm8pID0+IHtcclxuICAgKiAgY29uc29sZS5sb2coXy51bmlxKHNjaG9vbEluZm8uc3RhZmYubWFwKChzdGFmZikgPT4gc3RhZmYubmFtZSkpKTsgLy8gTGlzdCBhbGwgc3RhZmYgcG9zaXRpb25zIHVzaW5nIGxvZGFzaFxyXG4gICAqIH0pXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIHNjaG9vbEluZm8oKTogUHJvbWlzZTxTY2hvb2xJbmZvPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFNjaG9vbEluZm9YTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50U2Nob29sSW5mbycsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElEOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeyBTdHVkZW50U2Nob29sSW5mb0xpc3Rpbmc6IFt4bWxPYmplY3RdIH0pID0+IHtcclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIHNjaG9vbDoge1xyXG4gICAgICAgICAgICAgIGFkZHJlc3M6IHhtbE9iamVjdFsnQF9TY2hvb2xBZGRyZXNzJ11bMF0sXHJcbiAgICAgICAgICAgICAgYWRkcmVzc0FsdDogeG1sT2JqZWN0WydAX1NjaG9vbEFkZHJlc3MyJ11bMF0sXHJcbiAgICAgICAgICAgICAgY2l0eTogeG1sT2JqZWN0WydAX1NjaG9vbENpdHknXVswXSxcclxuICAgICAgICAgICAgICB6aXBDb2RlOiB4bWxPYmplY3RbJ0BfU2Nob29sWmlwJ11bMF0sXHJcbiAgICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdFsnQF9QaG9uZSddWzBdLFxyXG4gICAgICAgICAgICAgIGFsdFBob25lOiB4bWxPYmplY3RbJ0BfUGhvbmUyJ11bMF0sXHJcbiAgICAgICAgICAgICAgcHJpbmNpcGFsOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0WydAX1ByaW5jaXBhbEVtYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBzdGFmZkd1OiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsR3UnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdGFmZjogeG1sT2JqZWN0LlN0YWZmTGlzdHNbMF0uU3RhZmZMaXN0Lm1hcCgoc3RhZmYpID0+ICh7XHJcbiAgICAgICAgICAgICAgbmFtZTogc3RhZmZbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIGVtYWlsOiBzdGFmZlsnQF9FTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgIHN0YWZmR3U6IHN0YWZmWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICBqb2JUaXRsZTogc3RhZmZbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICBleHRuOiBzdGFmZlsnQF9FeHRuJ11bMF0sXHJcbiAgICAgICAgICAgICAgcGhvbmU6IHN0YWZmWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHNjaGVkdWxlIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRlcm1JbmRleCBUaGUgaW5kZXggb2YgdGhlIHRlcm0uXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8U2NoZWR1bGU+fSBSZXR1cm5zIHRoZSBzY2hlZHVsZSBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogYXdhaXQgc2NoZWR1bGUoMCkgLy8gLT4geyB0ZXJtOiB7IGluZGV4OiAwLCBuYW1lOiAnMXN0IFF0ciBQcm9ncmVzcycgfSwgLi4uIH1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc2NoZWR1bGUodGVybUluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxTY2hlZHVsZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxTY2hlZHVsZVhNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRDbGFzc0xpc3QnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgLi4uKHRlcm1JbmRleCAhPSBudWxsID8geyBUZXJtSW5kZXg6IHRlcm1JbmRleCB9IDoge30pIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICByZXMoe1xyXG4gICAgICAgICAgICB0ZXJtOiB7XHJcbiAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcih4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfVGVybUluZGV4J11bMF0pLFxyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9UZXJtSW5kZXhOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfRXJyb3JNZXNzYWdlJ11bMF0sXHJcbiAgICAgICAgICAgIHRvZGF5OlxyXG4gICAgICAgICAgICAgIHR5cGVvZiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVG9kYXlTY2hlZHVsZUluZm9EYXRhWzBdLlNjaG9vbEluZm9zWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgPyB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVG9kYXlTY2hlZHVsZUluZm9EYXRhWzBdLlNjaG9vbEluZm9zWzBdLlNjaG9vbEluZm8ubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgIChzY2hvb2wpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzY2hvb2xbJ0BfU2Nob29sTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYmVsbFNjaGVkdWxlTmFtZTogc2Nob29sWydAX0JlbGxTY2hlZE5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBzY2hvb2wuQ2xhc3Nlc1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA/IHNjaG9vbC5DbGFzc2VzWzBdLkNsYXNzSW5mby5tYXA8Q2xhc3NTY2hlZHVsZUluZm8+KChjb3Vyc2UpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKGNvdXJzZVsnQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGVuZGFuY2VDb2RlOiBjb3Vyc2UuQXR0ZW5kYW5jZUNvZGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoY291cnNlWydAX1N0YXJ0RGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKGNvdXJzZVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfQ2xhc3NOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb25HdTogY291cnNlWydAX1NlY3Rpb25HVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZWFjaGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGNvdXJzZVsnQF9UZWFjaGVyRW1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbFN1YmplY3Q6IGNvdXJzZVsnQF9FbWFpbFN1YmplY3QnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfVGVhY2hlck5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBjb3Vyc2VbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY291cnNlWydAX1RlYWNoZXJVUkwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBjb3Vyc2VbJ0BfQ2xhc3NVUkwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBwYXJzZShjb3Vyc2VbJ0BfU3RhcnRUaW1lJ11bMF0sICdoaDptbSBhJywgRGF0ZS5ub3coKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBwYXJzZShjb3Vyc2VbJ0BfRW5kVGltZSddWzBdLCAnaGg6bW0gYScsIERhdGUubm93KCkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICA6IFtdLFxyXG4gICAgICAgICAgICBjbGFzc2VzOlxyXG4gICAgICAgICAgICAgIHR5cGVvZiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uQ2xhc3NMaXN0c1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgID8geG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLkNsYXNzTGlzdHNbMF0uQ2xhc3NMaXN0aW5nLm1hcCgoc3R1ZGVudENsYXNzKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHN0dWRlbnRDbGFzc1snQF9Db3Vyc2VUaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKHN0dWRlbnRDbGFzc1snQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vbTogc3R1ZGVudENsYXNzWydAX1Jvb21OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2VjdGlvbkd1OiBzdHVkZW50Q2xhc3NbJ0BfU2VjdGlvbkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGVhY2hlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogc3R1ZGVudENsYXNzWydAX1RlYWNoZXInXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBzdHVkZW50Q2xhc3NbJ0BfVGVhY2hlckVtYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBzdHVkZW50Q2xhc3NbJ0BfVGVhY2hlclN0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICB9KSlcclxuICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgIHRlcm1zOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVGVybUxpc3RzWzBdLlRlcm1MaXN0aW5nLm1hcCgodGVybSkgPT4gKHtcclxuICAgICAgICAgICAgICBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUodGVybVsnQF9CZWdpbkRhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHRlcm1bJ0BfRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGluZGV4OiBOdW1iZXIodGVybVsnQF9UZXJtSW5kZXgnXVswXSksXHJcbiAgICAgICAgICAgICAgbmFtZTogdGVybVsnQF9UZXJtTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIHNjaG9vbFllYXJUZXJtQ29kZUd1OiB0ZXJtWydAX1NjaG9vbFllYXJUcm1Db2RlR1UnXVswXSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgYXR0ZW5kYW5jZSBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEF0dGVuZGFuY2U+fSBSZXR1cm5zIGFuIEF0dGVuZGFuY2Ugb2JqZWN0XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjbGllbnQuYXR0ZW5kYW5jZSgpXHJcbiAgICogIC50aGVuKGNvbnNvbGUubG9nKTsgLy8gLT4geyB0eXBlOiAnUGVyaW9kJywgcGVyaW9kOiB7Li4ufSwgc2Nob29sTmFtZTogJ1VuaXZlcnNpdHkgSGlnaCBTY2hvb2wnLCBhYnNlbmNlczogWy4uLl0sIHBlcmlvZEluZm9zOiBbLi4uXSB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGF0dGVuZGFuY2UoKTogUHJvbWlzZTxBdHRlbmRhbmNlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PEF0dGVuZGFuY2VYTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdBdHRlbmRhbmNlJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7XHJcbiAgICAgICAgICAgIGNoaWxkSW50SWQ6IDAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKGF0dGVuZGFuY2VYTUxPYmplY3QpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHhtbE9iamVjdCA9IGF0dGVuZGFuY2VYTUxPYmplY3QuQXR0ZW5kYW5jZVswXTtcclxuXHJcbiAgICAgICAgICByZXMoe1xyXG4gICAgICAgICAgICB0eXBlOiB4bWxPYmplY3RbJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgICBwZXJpb2Q6IHtcclxuICAgICAgICAgICAgICB0b3RhbDogTnVtYmVyKHhtbE9iamVjdFsnQF9QZXJpb2RDb3VudCddWzBdKSxcclxuICAgICAgICAgICAgICBzdGFydDogTnVtYmVyKHhtbE9iamVjdFsnQF9TdGFydFBlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgICBlbmQ6IE51bWJlcih4bWxPYmplY3RbJ0BfRW5kUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzY2hvb2xOYW1lOiB4bWxPYmplY3RbJ0BfU2Nob29sTmFtZSddWzBdLFxyXG4gICAgICAgICAgICBhYnNlbmNlczogeG1sT2JqZWN0LkFic2VuY2VzWzBdLkFic2VuY2VcclxuICAgICAgICAgICAgICA/IHhtbE9iamVjdC5BYnNlbmNlc1swXS5BYnNlbmNlLm1hcCgoYWJzZW5jZSkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoYWJzZW5jZVsnQF9BYnNlbmNlRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgcmVhc29uOiBhYnNlbmNlWydAX1JlYXNvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBub3RlOiBhYnNlbmNlWydAX05vdGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGFic2VuY2VbJ0BfQ29kZUFsbERheURlc2NyaXB0aW9uJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHBlcmlvZHM6IGFic2VuY2UuUGVyaW9kc1swXS5QZXJpb2QubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgIChwZXJpb2QpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihwZXJpb2RbJ0BfTnVtYmVyJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFzb246IHBlcmlvZFsnQF9SZWFzb24nXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY291cnNlOiBwZXJpb2RbJ0BfQ291cnNlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWZmOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcGVyaW9kWydAX1N0YWZmJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhZmZHdTogcGVyaW9kWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogcGVyaW9kWydAX1N0YWZmRU1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3JnWWVhckd1OiBwZXJpb2RbJ0BfT3JnWWVhckdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICB9IGFzIEFic2VudFBlcmlvZClcclxuICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgIHBlcmlvZEluZm9zOiB4bWxPYmplY3QuVG90YWxBY3Rpdml0aWVzWzBdLlBlcmlvZFRvdGFsLm1hcCgocGQsIGkpID0+ICh7XHJcbiAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIocGRbJ0BfTnVtYmVyJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHRvdGFsOiB7XHJcbiAgICAgICAgICAgICAgICBleGN1c2VkOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsRXhjdXNlZFswXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICAgIHRhcmRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxUYXJkaWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgdW5leGN1c2VkOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVW5leGN1c2VkWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgYWN0aXZpdGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbEFjdGl2aXRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgICB1bmV4Y3VzZWRUYXJkaWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVW5leGN1c2VkVGFyZGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KSkgYXMgUGVyaW9kSW5mb1tdLFxyXG4gICAgICAgICAgfSBhcyBBdHRlbmRhbmNlKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBncmFkZWJvb2sgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcGFyYW0ge251bWJlcn0gcmVwb3J0aW5nUGVyaW9kSW5kZXggVGhlIHRpbWVmcmFtZSB0aGF0IHRoZSBncmFkZWJvb2sgc2hvdWxkIHJldHVyblxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEdyYWRlYm9vaz59IFJldHVybnMgYSBHcmFkZWJvb2sgb2JqZWN0XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBncmFkZWJvb2sgPSBhd2FpdCBjbGllbnQuZ3JhZGVib29rKCk7XHJcbiAgICogY29uc29sZS5sb2coZ3JhZGVib29rKTsgLy8geyBlcnJvcjogJycsIHR5cGU6ICdUcmFkaXRpb25hbCcsIHJlcG9ydGluZ1BlcmlvZDogey4uLn0sIGNvdXJzZXM6IFsuLi5dIH07XHJcbiAgICpcclxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDApIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggMCBhcyBcIjFzdCBRdWFydGVyIFByb2dyZXNzXCJcclxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDcpIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggNyBhcyBcIjR0aCBRdWFydGVyXCJcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgZ3JhZGVib29rKHJlcG9ydGluZ1BlcmlvZEluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxHcmFkZWJvb2s+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8R3JhZGVib29rWE1MT2JqZWN0PihcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgbWV0aG9kTmFtZTogJ0dyYWRlYm9vaycsXHJcbiAgICAgICAgICAgIHBhcmFtU3RyOiB7XHJcbiAgICAgICAgICAgICAgY2hpbGRJbnRJZDogMCxcclxuICAgICAgICAgICAgICAuLi4ocmVwb3J0aW5nUGVyaW9kSW5kZXggIT0gbnVsbCA/IHsgUmVwb3J0UGVyaW9kOiByZXBvcnRpbmdQZXJpb2RJbmRleCB9IDoge30pLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICh4bWwpID0+XHJcbiAgICAgICAgICAgIG5ldyBYTUxGYWN0b3J5KHhtbClcclxuICAgICAgICAgICAgICAuZW5jb2RlQXR0cmlidXRlKCdNZWFzdXJlRGVzY3JpcHRpb24nLCAnSGFzRHJvcEJveCcpXHJcbiAgICAgICAgICAgICAgLmVuY29kZUF0dHJpYnV0ZSgnTWVhc3VyZScsICdUeXBlJylcclxuICAgICAgICAgICAgICAudG9TdHJpbmcoKVxyXG4gICAgICAgIClcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0OiBHcmFkZWJvb2tYTUxPYmplY3QpID0+IHtcclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIGVycm9yOiB4bWxPYmplY3QuR3JhZGVib29rWzBdWydAX0Vycm9yTWVzc2FnZSddWzBdLFxyXG4gICAgICAgICAgICB0eXBlOiB4bWxPYmplY3QuR3JhZGVib29rWzBdWydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgcmVwb3J0aW5nUGVyaW9kOiB7XHJcbiAgICAgICAgICAgICAgY3VycmVudDoge1xyXG4gICAgICAgICAgICAgICAgaW5kZXg6XHJcbiAgICAgICAgICAgICAgICAgIHJlcG9ydGluZ1BlcmlvZEluZGV4ID8/XHJcbiAgICAgICAgICAgICAgICAgIE51bWJlcihcclxuICAgICAgICAgICAgICAgICAgICB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZHNbMF0uUmVwb3J0UGVyaW9kLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAoeCkgPT4geFsnQF9HcmFkZVBlcmlvZCddWzBdID09PSB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9HcmFkZVBlcmlvZCddWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgKT8uWydAX0luZGV4J11bMF1cclxuICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX1N0YXJ0RGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZSh4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0dyYWRlUGVyaW9kJ11bMF0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBhdmFpbGFibGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QubWFwKChwZXJpb2QpID0+ICh7XHJcbiAgICAgICAgICAgICAgICBkYXRlOiB7IHN0YXJ0OiBuZXcgRGF0ZShwZXJpb2RbJ0BfU3RhcnREYXRlJ11bMF0pLCBlbmQ6IG5ldyBEYXRlKHBlcmlvZFsnQF9FbmREYXRlJ11bMF0pIH0sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfR3JhZGVQZXJpb2QnXVswXSxcclxuICAgICAgICAgICAgICAgIGluZGV4OiBOdW1iZXIocGVyaW9kWydAX0luZGV4J11bMF0pLFxyXG4gICAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY291cnNlczogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5Db3Vyc2VzWzBdLkNvdXJzZS5tYXAoKGNvdXJzZSkgPT4gKHtcclxuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihjb3Vyc2VbJ0BfUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiBjb3Vyc2VbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICByb29tOiBjb3Vyc2VbJ0BfUm9vbSddWzBdLFxyXG4gICAgICAgICAgICAgIHN0YWZmOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfU3RhZmYnXVswXSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBjb3Vyc2VbJ0BfU3RhZmZFTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgc3RhZmZHdTogY291cnNlWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIG1hcmtzOiBjb3Vyc2UuTWFya3NbMF0uTWFyay5tYXAoKG1hcmspID0+ICh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBtYXJrWydAX01hcmtOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBjYWxjdWxhdGVkU2NvcmU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RyaW5nOiBtYXJrWydAX0NhbGN1bGF0ZWRTY29yZVN0cmluZyddWzBdLFxyXG4gICAgICAgICAgICAgICAgICByYXc6IE51bWJlcihtYXJrWydAX0NhbGN1bGF0ZWRTY29yZVJhdyddWzBdKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZENhdGVnb3JpZXM6XHJcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiBtYXJrWydHcmFkZUNhbGN1bGF0aW9uU3VtbWFyeSddWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgID8gbWFya1snR3JhZGVDYWxjdWxhdGlvblN1bW1hcnknXVswXS5Bc3NpZ25tZW50R3JhZGVDYWxjLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHdlaWdodGVkKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB3ZWlnaHRlZFsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkTWFyazogd2VpZ2h0ZWRbJ0BfQ2FsY3VsYXRlZE1hcmsnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmFsdWF0ZWQ6IHdlaWdodGVkWydAX1dlaWdodGVkUGN0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkOiB3ZWlnaHRlZFsnQF9XZWlnaHQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDogTnVtYmVyKHdlaWdodGVkWydAX1BvaW50cyddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zc2libGU6IE51bWJlcih3ZWlnaHRlZFsnQF9Qb2ludHNQb3NzaWJsZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBXZWlnaHRlZENhdGVnb3J5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50czpcclxuICAgICAgICAgICAgICAgICAgdHlwZW9mIG1hcmsuQXNzaWdubWVudHNbMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgPyAobWFyay5Bc3NpZ25tZW50c1swXS5Bc3NpZ25tZW50Lm1hcCgoYXNzaWdubWVudCkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhZGVib29rSWQ6IGFzc2lnbm1lbnRbJ0BfR3JhZGVib29rSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGVjb2RlVVJJKGFzc2lnbm1lbnRbJ0BfTWVhc3VyZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYXNzaWdubWVudFsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGR1ZTogbmV3IERhdGUoYXNzaWdubWVudFsnQF9EdWVEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFzc2lnbm1lbnRbJ0BfU2NvcmVUeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGFzc2lnbm1lbnRbJ0BfU2NvcmUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzOiBhc3NpZ25tZW50WydAX1BvaW50cyddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlczogYXNzaWdubWVudFsnQF9Ob3RlcyddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWFjaGVySWQ6IGFzc2lnbm1lbnRbJ0BfVGVhY2hlcklEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkZWNvZGVVUkkoYXNzaWdubWVudFsnQF9NZWFzdXJlRGVzY3JpcHRpb24nXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0Ryb3Bib3g6IEpTT04ucGFyc2UoYXNzaWdubWVudFsnQF9IYXNEcm9wQm94J11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHVkZW50SWQ6IGFzc2lnbm1lbnRbJ0BfU3R1ZGVudElEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bib3hEYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRHJvcFN0YXJ0RGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRHJvcEVuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgYXNzaWdubWVudC5SZXNvdXJjZXNbMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IChhc3NpZ25tZW50LlJlc291cmNlc1swXS5SZXNvdXJjZS5tYXAoKHJzcmMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJzcmNbJ0BfVHlwZSddWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdGaWxlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlUnNyYyA9IHJzcmMgYXMgRmlsZVJlc291cmNlWE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFJlc291cmNlVHlwZS5GSUxFLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpbGVSc3JjWydAX0ZpbGVUeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBmaWxlUnNyY1snQF9GaWxlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJpOiB0aGlzLmhvc3RVcmwgKyBmaWxlUnNyY1snQF9TZXJ2ZXJGaWxlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGZpbGVSc3JjWydAX1Jlc291cmNlRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBmaWxlUnNyY1snQF9SZXNvdXJjZUlEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBmaWxlUnNyY1snQF9SZXNvdXJjZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIEZpbGVSZXNvdXJjZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ1VSTCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsUnNyYyA9IHJzcmMgYXMgVVJMUmVzb3VyY2VYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmxSc3JjWydAX1VSTCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFJlc291cmNlVHlwZS5VUkwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKHVybFJzcmNbJ0BfUmVzb3VyY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHVybFJzcmNbJ0BfUmVzb3VyY2VJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdXJsUnNyY1snQF9SZXNvdXJjZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1cmxSc3JjWydAX1Jlc291cmNlRGVzY3JpcHRpb24nXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHVybFJzcmNbJ0BfU2VydmVyRmlsZU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBVUkxSZXNvdXJjZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlaihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgVHlwZSAke3JzcmNbJ0BfVHlwZSddWzBdfSBkb2VzIG5vdCBleGlzdCBhcyBhIHR5cGUuIEFkZCBpdCB0byB0eXBlIGRlY2xhcmF0aW9ucy5gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSBhcyAoRmlsZVJlc291cmNlIHwgVVJMUmVzb3VyY2UpW10pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgfSkpIGFzIEFzc2lnbm1lbnRbXSlcclxuICAgICAgICAgICAgICAgICAgICA6IFtdLFxyXG4gICAgICAgICAgICAgIH0pKSBhcyBNYXJrW10sXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgIH0gYXMgR3JhZGVib29rKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYSBsaXN0IG9mIG1lc3NhZ2VzIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQHJldHVybnMge1Byb21pc2U8TWVzc2FnZVtdPn0gUmV0dXJucyBhbiBhcnJheSBvZiBtZXNzYWdlcyBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogYXdhaXQgY2xpZW50Lm1lc3NhZ2VzKCk7IC8vIC0+IFt7IGlkOiAnRTk3MkYxQkMtOTlBMC00Q0QwLThEMTUtQjE4OTY4QjQzRTA4JywgdHlwZTogJ1N0dWRlbnRBY3Rpdml0eScsIC4uLiB9LCB7IGlkOiAnODZGREExMUQtNDJDNy00MjQ5LUIwMDMtOTRCMTVFQjJDOEQ0JywgdHlwZTogJ1N0dWRlbnRBY3Rpdml0eScsIC4uLiB9XVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBtZXNzYWdlcygpOiBQcm9taXNlPE1lc3NhZ2VbXT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxNZXNzYWdlWE1MT2JqZWN0PihcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgbWV0aG9kTmFtZTogJ0dldFBYUE1lc3NhZ2VzJyxcclxuICAgICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICh4bWwpID0+IG5ldyBYTUxGYWN0b3J5KHhtbCkuZW5jb2RlQXR0cmlidXRlKCdDb250ZW50JywgJ1JlYWQnKS50b1N0cmluZygpXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcclxuICAgICAgICAgIHJlcyhcclxuICAgICAgICAgICAgeG1sT2JqZWN0LlBYUE1lc3NhZ2VzRGF0YVswXS5NZXNzYWdlTGlzdGluZ3NbMF0uTWVzc2FnZUxpc3RpbmcubWFwKFxyXG4gICAgICAgICAgICAgIChtZXNzYWdlKSA9PiBuZXcgTWVzc2FnZShtZXNzYWdlLCBzdXBlci5jcmVkZW50aWFscywgdGhpcy5ob3N0VXJsKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGluZm8gb2YgYSBzdHVkZW50XHJcbiAgICogQHJldHVybnMge1Byb21pc2U8U3R1ZGVudEluZm8+fSBTdHVkZW50SW5mbyBvYmplY3RcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIHN0dWRlbnRJbmZvKCkudGhlbihjb25zb2xlLmxvZykgLy8gLT4geyBzdHVkZW50OiB7IG5hbWU6ICdFdmFuIERhdmlzJywgbmlja25hbWU6ICcnLCBsYXN0TmFtZTogJ0RhdmlzJyB9LCAuLi59XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIHN0dWRlbnRJbmZvKCk6IFByb21pc2U8U3R1ZGVudEluZm8+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxTdHVkZW50SW5mbz4oKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFN0dWRlbnRJbmZvWE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudEluZm8nLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdERhdGEpID0+IHtcclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIHN0dWRlbnQ6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkZvcm1hdHRlZE5hbWVbMF0sXHJcbiAgICAgICAgICAgICAgbGFzdE5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uTGFzdE5hbWVHb2VzQnlbMF0sXHJcbiAgICAgICAgICAgICAgbmlja25hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uTmlja05hbWVbMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5CaXJ0aERhdGVbMF0pLFxyXG4gICAgICAgICAgICB0cmFjazogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlRyYWNrKSxcclxuICAgICAgICAgICAgYWRkcmVzczogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3MpLFxyXG4gICAgICAgICAgICBwaG90bzogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBob3RvKSxcclxuICAgICAgICAgICAgY291bnNlbG9yOlxyXG4gICAgICAgICAgICAgIHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yTmFtZSAmJlxyXG4gICAgICAgICAgICAgIHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yRW1haWwgJiZcclxuICAgICAgICAgICAgICB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkNvdW5zZWxvclN0YWZmR1VcclxuICAgICAgICAgICAgICAgID8ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yTmFtZVswXSxcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Db3Vuc2Vsb3JFbWFpbFswXSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkNvdW5zZWxvclN0YWZmR1VbMF0sXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjdXJyZW50U2Nob29sOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkN1cnJlbnRTY2hvb2xbMF0sXHJcbiAgICAgICAgICAgIGRlbnRpc3Q6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRGVudGlzdFxyXG4gICAgICAgICAgICAgID8ge1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkRlbnRpc3RbMF1bJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5EZW50aXN0WzBdWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIGV4dG46IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRGVudGlzdFswXVsnQF9FeHRuJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIG9mZmljZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5EZW50aXN0WzBdWydAX09mZmljZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBwaHlzaWNpYW46IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uUGh5c2ljaWFuXHJcbiAgICAgICAgICAgICAgPyB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uUGh5c2ljaWFuWzBdWydAX05hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uUGh5c2ljaWFuWzBdWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIGV4dG46IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uUGh5c2ljaWFuWzBdWydAX0V4dG4nXVswXSxcclxuICAgICAgICAgICAgICAgICAgaG9zcGl0YWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uUGh5c2ljaWFuWzBdWydAX0hvc3BpdGFsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGlkOiB0aGlzLm9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uUGVybUlEKSxcclxuICAgICAgICAgICAgb3JnWWVhckd1OiB0aGlzLm9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uT3JnWWVhckdVKSxcclxuICAgICAgICAgICAgcGhvbmU6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaG9uZSksXHJcbiAgICAgICAgICAgIGVtYWlsOiB0aGlzLm9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRU1haWwpLFxyXG4gICAgICAgICAgICBlbWVyZ2VuY3lDb250YWN0czogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5FbWVyZ2VuY3lDb250YWN0c1xyXG4gICAgICAgICAgICAgID8geG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5FbWVyZ2VuY3lDb250YWN0c1swXS5FbWVyZ2VuY3lDb250YWN0Lm1hcCgoY29udGFjdCkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5vcHRpb25hbChjb250YWN0WydAX05hbWUnXSksXHJcbiAgICAgICAgICAgICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaG9tZTogdGhpcy5vcHRpb25hbChjb250YWN0WydAX0hvbWVQaG9uZSddKSxcclxuICAgICAgICAgICAgICAgICAgICBtb2JpbGU6IHRoaXMub3B0aW9uYWwoY29udGFjdFsnQF9Nb2JpbGVQaG9uZSddKSxcclxuICAgICAgICAgICAgICAgICAgICBvdGhlcjogdGhpcy5vcHRpb25hbChjb250YWN0WydAX090aGVyUGhvbmUnXSksXHJcbiAgICAgICAgICAgICAgICAgICAgd29yazogdGhpcy5vcHRpb25hbChjb250YWN0WydAX1dvcmtQaG9uZSddKSxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwOiB0aGlzLm9wdGlvbmFsKGNvbnRhY3RbJ0BfUmVsYXRpb25zaGlwJ10pLFxyXG4gICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgZ2VuZGVyOiB0aGlzLm9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uR2VuZGVyKSxcclxuICAgICAgICAgICAgZ3JhZGU6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HcmFkZSksXHJcbiAgICAgICAgICAgIGxvY2tlckluZm9SZWNvcmRzOiB0aGlzLm9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uTG9ja2VySW5mb1JlY29yZHMpLFxyXG4gICAgICAgICAgICBob21lTGFuZ3VhZ2U6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Ib21lTGFuZ3VhZ2UpLFxyXG4gICAgICAgICAgICBob21lUm9vbTogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkhvbWVSb29tKSxcclxuICAgICAgICAgICAgaG9tZVJvb21UZWFjaGVyOiB7XHJcbiAgICAgICAgICAgICAgZW1haWw6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Ib21lUm9vbVRjaEVNYWlsKSxcclxuICAgICAgICAgICAgICBuYW1lOiB0aGlzLm9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uSG9tZVJvb21UY2gpLFxyXG4gICAgICAgICAgICAgIHN0YWZmR3U6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Ib21lUm9vbVRjaFN0YWZmR1UpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZGRpdGlvbmFsSW5mbzogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94ZXNbMF0uVXNlckRlZmluZWRHcm91cEJveFxyXG4gICAgICAgICAgICAgID8gKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uVXNlckRlZmluZWRHcm91cEJveGVzWzBdLlVzZXJEZWZpbmVkR3JvdXBCb3gubWFwKChkZWZpbmVkQm94KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMub3B0aW9uYWwoZGVmaW5lZEJveFsnQF9Hcm91cEJveElEJ10pLCAvLyBzdHJpbmcgfCB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgIHR5cGU6IGRlZmluZWRCb3hbJ0BfR3JvdXBCb3hMYWJlbCddWzBdLCAvLyBzdHJpbmdcclxuICAgICAgICAgICAgICAgIHZjSWQ6IHRoaXMub3B0aW9uYWwoZGVmaW5lZEJveFsnQF9WQ0lEJ10pLCAvLyBzdHJpbmcgfCB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgaXRlbXM6IGRlZmluZWRCb3guVXNlckRlZmluZWRJdGVtc1swXS5Vc2VyRGVmaW5lZEl0ZW0ubWFwKChpdGVtKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogaXRlbVsnQF9Tb3VyY2VFbGVtZW50J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IGl0ZW1bJ0BfU291cmNlT2JqZWN0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB2Y0lkOiBpdGVtWydAX1ZDSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbVsnQF9WYWx1ZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGl0ZW1bJ0BfSXRlbVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgfSkpIGFzIEFkZGl0aW9uYWxJbmZvSXRlbVtdLFxyXG4gICAgICAgICAgICAgICAgfSkpIGFzIEFkZGl0aW9uYWxJbmZvW10pXHJcbiAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgIH0gYXMgU3R1ZGVudEluZm8pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlOiBEYXRlKSB7XHJcbiAgICByZXR1cm4gc3VwZXIucHJvY2Vzc1JlcXVlc3Q8Q2FsZW5kYXJYTUxPYmplY3Q+KFxyXG4gICAgICB7XHJcbiAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRDYWxlbmRhcicsXHJcbiAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgUmVxdWVzdERhdGU6IGRhdGUudG9JU09TdHJpbmcoKSB9LFxyXG4gICAgICB9LFxyXG4gICAgICAoeG1sKSA9PiBuZXcgWE1MRmFjdG9yeSh4bWwpLmVuY29kZUF0dHJpYnV0ZSgnVGl0bGUnLCAnSWNvbicpLnRvU3RyaW5nKClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9wdGlvbmFsPFQ+KHhtbEFycj86IFRbXSk6IFQgfCB1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuIHhtbEFyciA/IHhtbEFyclswXSA6IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtDYWxlbmRhck9wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyB0byBwcm92aWRlIGZvciBjYWxlbmRhciBtZXRob2QuIEFuIGludGVydmFsIGlzIHJlcXVpcmVkLlxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPENhbGVuZGFyPn0gUmV0dXJucyBhIENhbGVuZGFyIG9iamVjdFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY2xpZW50LmNhbGVuZGFyKHsgaW50ZXJ2YWw6IHsgc3RhcnQ6IG5ldyBEYXRlKCc1LzEvMjAyMicpLCBlbmQ6IG5ldyBEYXRlKCc4LzEvMjAyMScpIH0sIGNvbmN1cnJlbmN5OiBudWxsIH0pOyAvLyAtPiBMaW1pdGxlc3MgY29uY3VycmVuY3kgKG5vdCByZWNvbW1lbmRlZClcclxuICAgKlxyXG4gICAqIGNvbnN0IGNhbGVuZGFyID0gYXdhaXQgY2xpZW50LmNhbGVuZGFyKHsgaW50ZXJ2YWw6IHsgLi4uIH19KTtcclxuICAgKiBjb25zb2xlLmxvZyhjYWxlbmRhcik7IC8vIC0+IHsgc2Nob29sRGF0ZTogey4uLn0sIG91dHB1dFJhbmdlOiB7Li4ufSwgZXZlbnRzOiBbLi4uXSB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGFzeW5jIGNhbGVuZGFyKG9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyA9IHt9KTogUHJvbWlzZTxDYWxlbmRhcj4ge1xyXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyA9IHtcclxuICAgICAgY29uY3VycmVuY3k6IDcsXHJcbiAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgY2FsID0gYXdhaXQgY2FjaGUubWVtbygoKSA9PiB0aGlzLmZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwobmV3IERhdGUoKSkpO1xyXG4gICAgY29uc3Qgc2Nob29sRW5kRGF0ZTogRGF0ZSB8IG51bWJlciA9XHJcbiAgICAgIG9wdGlvbnMuaW50ZXJ2YWw/LmVuZCA/PyBuZXcgRGF0ZShjYWwuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEVuZERhdGUnXVswXSk7XHJcbiAgICBjb25zdCBzY2hvb2xTdGFydERhdGU6IERhdGUgfCBudW1iZXIgPVxyXG4gICAgICBvcHRpb25zLmludGVydmFsPy5zdGFydCA/PyBuZXcgRGF0ZShjYWwuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBjb25zdCBtb250aHNXaXRoaW5TY2hvb2xZZWFyID0gZWFjaE1vbnRoT2ZJbnRlcnZhbCh7IHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsIGVuZDogc2Nob29sRW5kRGF0ZSB9KTtcclxuICAgICAgY29uc3QgZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhciA9ICgpOiBQcm9taXNlPENhbGVuZGFyWE1MT2JqZWN0W10+ID0+XHJcbiAgICAgICAgZGVmYXVsdE9wdGlvbnMuY29uY3VycmVuY3kgPT0gbnVsbFxyXG4gICAgICAgICAgPyBQcm9taXNlLmFsbChtb250aHNXaXRoaW5TY2hvb2xZZWFyLm1hcCgoZGF0ZSkgPT4gdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpKSlcclxuICAgICAgICAgIDogYXN5bmNQb29sQWxsKGRlZmF1bHRPcHRpb25zLmNvbmN1cnJlbmN5LCBtb250aHNXaXRoaW5TY2hvb2xZZWFyLCAoZGF0ZSkgPT5cclxuICAgICAgICAgICAgICB0aGlzLmZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwoZGF0ZSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgbGV0IG1lbW86IENhbGVuZGFyIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgIGdldEFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIoKVxyXG4gICAgICAgIC50aGVuKChldmVudHMpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGFsbEV2ZW50cyA9IGV2ZW50cy5yZWR1Y2UoKHByZXYsIGV2ZW50cykgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWVtbyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgIG1lbW8gPSB7XHJcbiAgICAgICAgICAgICAgICBzY2hvb2xEYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXVsnQF9TY2hvb2xFbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG91dHB1dFJhbmdlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsXHJcbiAgICAgICAgICAgICAgICAgIGVuZDogc2Nob29sRW5kRGF0ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBldmVudHM6IFtdLFxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3Q6IENhbGVuZGFyID0ge1xyXG4gICAgICAgICAgICAgIC4uLm1lbW8sIC8vIFRoaXMgaXMgdG8gcHJldmVudCByZS1pbml0aWFsaXppbmcgRGF0ZSBvYmplY3RzIGluIG9yZGVyIHRvIGltcHJvdmUgcGVyZm9ybWFuY2VcclxuICAgICAgICAgICAgICBldmVudHM6IFtcclxuICAgICAgICAgICAgICAgIC4uLihwcmV2LmV2ZW50cyA/IHByZXYuZXZlbnRzIDogW10pLFxyXG4gICAgICAgICAgICAgICAgLi4uKHR5cGVvZiBldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdLkV2ZW50TGlzdHNbMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgID8gKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF0uRXZlbnRMaXN0c1swXS5FdmVudExpc3QubWFwKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChldmVudFsnQF9EYXlUeXBlJ11bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuQVNTSUdOTUVOVDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzc2lnbm1lbnRFdmVudCA9IGV2ZW50IGFzIEFzc2lnbm1lbnRFdmVudFhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGRlY29kZVVSSShhc3NpZ25tZW50RXZlbnRbJ0BfVGl0bGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRMaW5rRGF0YTogYXNzaWdubWVudEV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZ3U6IGFzc2lnbm1lbnRFdmVudFsnQF9BR1UnXSA/IGFzc2lnbm1lbnRFdmVudFsnQF9BR1UnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGFzc2lnbm1lbnRFdmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGd1OiBhc3NpZ25tZW50RXZlbnRbJ0BfREdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBhc3NpZ25tZW50RXZlbnRbJ0BfTGluayddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBhc3NpZ25tZW50RXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuQVNTSUdOTUVOVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdUeXBlOiBhc3NpZ25tZW50RXZlbnRbJ0BfVmlld1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIEFzc2lnbm1lbnRFdmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5IT0xJREFZOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBkZWNvZGVVUkkoZXZlbnRbJ0BfVGl0bGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuSE9MSURBWSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogZXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShldmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgSG9saWRheUV2ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLlJFR1VMQVI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWd1bGFyRXZlbnQgPSBldmVudCBhcyBSZWd1bGFyRXZlbnRYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBkZWNvZGVVUkkocmVndWxhckV2ZW50WydAX1RpdGxlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWd1OiByZWd1bGFyRXZlbnRbJ0BfQUdVJ10gPyByZWd1bGFyRXZlbnRbJ0BfQUdVJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShyZWd1bGFyRXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiByZWd1bGFyRXZlbnRbJ0BfRXZ0RGVzY3JpcHRpb24nXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHJlZ3VsYXJFdmVudFsnQF9FdnREZXNjcmlwdGlvbiddWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGd1OiByZWd1bGFyRXZlbnRbJ0BfREdVJ10gPyByZWd1bGFyRXZlbnRbJ0BfREdVJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiByZWd1bGFyRXZlbnRbJ0BfTGluayddID8gcmVndWxhckV2ZW50WydAX0xpbmsnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogcmVndWxhckV2ZW50WydAX1N0YXJ0VGltZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLlJFR1VMQVIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3VHlwZTogcmVndWxhckV2ZW50WydAX1ZpZXdUeXBlJ10gPyByZWd1bGFyRXZlbnRbJ0BfVmlld1R5cGUnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZExpbmtEYXRhOiByZWd1bGFyRXZlbnRbJ0BfQWRkTGlua0RhdGEnXSA/IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgUmVndWxhckV2ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSkgYXMgRXZlbnRbXSlcclxuICAgICAgICAgICAgICAgICAgOiBbXSksXHJcbiAgICAgICAgICAgICAgXSBhcyBFdmVudFtdLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XHJcbiAgICAgICAgICB9LCB7fSBhcyBDYWxlbmRhcik7XHJcbiAgICAgICAgICByZXMoeyAuLi5hbGxFdmVudHMsIGV2ZW50czogXy51bmlxQnkoYWxsRXZlbnRzLmV2ZW50cywgKGl0ZW0pID0+IGl0ZW0udGl0bGUpIH0gYXMgQ2FsZW5kYXIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcbn1c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