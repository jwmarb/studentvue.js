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
                id: definedBox['@_GroupBoxID'],
                type: definedBox['@_GroupBoxLabel'][0],
                vcId: definedBox['@_VCID'],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3luY1Bvb2xBbGwiLCJwb29sTGltaXQiLCJhcnJheSIsIml0ZXJhdG9yRm4iLCJyZXN1bHRzIiwicmVzdWx0IiwiYXN5bmNQb29sIiwicHVzaCIsIkNsaWVudCIsInNvYXAiLCJjb25zdHJ1Y3RvciIsImNyZWRlbnRpYWxzIiwiaG9zdFVybCIsInZhbGlkYXRlQ3JlZGVudGlhbHMiLCJQcm9taXNlIiwicmVzIiwicmVqIiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwidmFsaWRhdGVFcnJvcnMiLCJ0aGVuIiwicmVzcG9uc2UiLCJSVF9FUlJPUiIsIlJlcXVlc3RFeGNlcHRpb24iLCJjYXRjaCIsImRvY3VtZW50cyIsInBhcmFtU3RyIiwiY2hpbGRJbnRJZCIsInhtbE9iamVjdCIsIlN0dWRlbnREb2N1bWVudERhdGFzIiwiU3R1ZGVudERvY3VtZW50RGF0YSIsInhtbCIsIkRvY3VtZW50IiwicmVwb3J0Q2FyZHMiLCJSQ1JlcG9ydGluZ1BlcmlvZERhdGEiLCJSQ1JlcG9ydGluZ1BlcmlvZHMiLCJSQ1JlcG9ydGluZ1BlcmlvZCIsIlJlcG9ydENhcmQiLCJzY2hvb2xJbmZvIiwiY2hpbGRJbnRJRCIsIlN0dWRlbnRTY2hvb2xJbmZvTGlzdGluZyIsIlN0YWZmTGlzdHMiLCJTdGFmZkxpc3QiLCJzdGFmZiIsIm5hbWUiLCJlbWFpbCIsInN0YWZmR3UiLCJqb2JUaXRsZSIsImV4dG4iLCJwaG9uZSIsInNjaG9vbCIsImFkZHJlc3MiLCJhZGRyZXNzQWx0IiwiY2l0eSIsInppcENvZGUiLCJhbHRQaG9uZSIsInByaW5jaXBhbCIsInNjaGVkdWxlIiwidGVybUluZGV4IiwiVGVybUluZGV4IiwiU3R1ZGVudENsYXNzU2NoZWR1bGUiLCJUZXJtTGlzdHMiLCJUZXJtTGlzdGluZyIsInRlcm0iLCJkYXRlIiwic3RhcnQiLCJEYXRlIiwiZW5kIiwiaW5kZXgiLCJOdW1iZXIiLCJzY2hvb2xZZWFyVGVybUNvZGVHdSIsImVycm9yIiwidG9kYXkiLCJUb2RheVNjaGVkdWxlSW5mb0RhdGEiLCJTY2hvb2xJbmZvcyIsIlNjaG9vbEluZm8iLCJtYXAiLCJiZWxsU2NoZWR1bGVOYW1lIiwiY2xhc3NlcyIsIkNsYXNzZXMiLCJDbGFzc0luZm8iLCJjb3Vyc2UiLCJwZXJpb2QiLCJhdHRlbmRhbmNlQ29kZSIsIkF0dGVuZGFuY2VDb2RlIiwic2VjdGlvbkd1IiwidGVhY2hlciIsImVtYWlsU3ViamVjdCIsInVybCIsInRpbWUiLCJwYXJzZSIsIm5vdyIsIkNsYXNzTGlzdHMiLCJDbGFzc0xpc3RpbmciLCJzdHVkZW50Q2xhc3MiLCJyb29tIiwidGVybXMiLCJhdHRlbmRhbmNlIiwiYXR0ZW5kYW5jZVhNTE9iamVjdCIsIkF0dGVuZGFuY2UiLCJUb3RhbEFjdGl2aXRpZXMiLCJQZXJpb2RUb3RhbCIsInBkIiwiaSIsInRvdGFsIiwiZXhjdXNlZCIsIlRvdGFsRXhjdXNlZCIsInRhcmRpZXMiLCJUb3RhbFRhcmRpZXMiLCJ1bmV4Y3VzZWQiLCJUb3RhbFVuZXhjdXNlZCIsImFjdGl2aXRpZXMiLCJ1bmV4Y3VzZWRUYXJkaWVzIiwiVG90YWxVbmV4Y3VzZWRUYXJkaWVzIiwidHlwZSIsInNjaG9vbE5hbWUiLCJhYnNlbmNlcyIsIkFic2VuY2VzIiwiQWJzZW5jZSIsImFic2VuY2UiLCJyZWFzb24iLCJub3RlIiwiZGVzY3JpcHRpb24iLCJwZXJpb2RzIiwiUGVyaW9kcyIsIlBlcmlvZCIsIm9yZ1llYXJHdSIsInBlcmlvZEluZm9zIiwiZ3JhZGVib29rIiwicmVwb3J0aW5nUGVyaW9kSW5kZXgiLCJSZXBvcnRQZXJpb2QiLCJYTUxGYWN0b3J5IiwiZW5jb2RlQXR0cmlidXRlIiwidG9TdHJpbmciLCJHcmFkZWJvb2siLCJSZXBvcnRpbmdQZXJpb2RzIiwiQ291cnNlcyIsIkNvdXJzZSIsIk1hcmtzIiwiTWFyayIsIm1hcmsiLCJjYWxjdWxhdGVkU2NvcmUiLCJzdHJpbmciLCJyYXciLCJ3ZWlnaHRlZENhdGVnb3JpZXMiLCJBc3NpZ25tZW50R3JhZGVDYWxjIiwid2VpZ2h0ZWQiLCJjYWxjdWxhdGVkTWFyayIsIndlaWdodCIsImV2YWx1YXRlZCIsInN0YW5kYXJkIiwicG9pbnRzIiwiY3VycmVudCIsInBvc3NpYmxlIiwiYXNzaWdubWVudHMiLCJBc3NpZ25tZW50cyIsIkFzc2lnbm1lbnQiLCJhc3NpZ25tZW50IiwiZ3JhZGVib29rSWQiLCJkZWNvZGVVUkkiLCJkdWUiLCJzY29yZSIsInZhbHVlIiwibm90ZXMiLCJ0ZWFjaGVySWQiLCJoYXNEcm9wYm94IiwiSlNPTiIsInN0dWRlbnRJZCIsImRyb3Bib3hEYXRlIiwicmVzb3VyY2VzIiwiUmVzb3VyY2VzIiwiUmVzb3VyY2UiLCJyc3JjIiwiZmlsZVJzcmMiLCJSZXNvdXJjZVR5cGUiLCJGSUxFIiwiZmlsZSIsInVyaSIsInJlc291cmNlIiwiaWQiLCJ1cmxSc3JjIiwiVVJMIiwicGF0aCIsInRpdGxlIiwibWFya3MiLCJyZXBvcnRpbmdQZXJpb2QiLCJmaW5kIiwieCIsIlJlcG9ydGluZ1BlcmlvZCIsImF2YWlsYWJsZSIsImNvdXJzZXMiLCJtZXNzYWdlcyIsIlBYUE1lc3NhZ2VzRGF0YSIsIk1lc3NhZ2VMaXN0aW5ncyIsIk1lc3NhZ2VMaXN0aW5nIiwibWVzc2FnZSIsIk1lc3NhZ2UiLCJzdHVkZW50SW5mbyIsInhtbE9iamVjdERhdGEiLCJzdHVkZW50IiwiU3R1ZGVudEluZm8iLCJGb3JtYXR0ZWROYW1lIiwibGFzdE5hbWUiLCJMYXN0TmFtZUdvZXNCeSIsIm5pY2tuYW1lIiwiTmlja05hbWUiLCJiaXJ0aERhdGUiLCJCaXJ0aERhdGUiLCJ0cmFjayIsIm9wdGlvbmFsIiwiVHJhY2siLCJBZGRyZXNzIiwicGhvdG8iLCJQaG90byIsImNvdW5zZWxvciIsIkNvdW5zZWxvck5hbWUiLCJDb3Vuc2Vsb3JFbWFpbCIsIkNvdW5zZWxvclN0YWZmR1UiLCJ1bmRlZmluZWQiLCJjdXJyZW50U2Nob29sIiwiQ3VycmVudFNjaG9vbCIsImRlbnRpc3QiLCJEZW50aXN0Iiwib2ZmaWNlIiwicGh5c2ljaWFuIiwiUGh5c2ljaWFuIiwiaG9zcGl0YWwiLCJQZXJtSUQiLCJPcmdZZWFyR1UiLCJQaG9uZSIsIkVNYWlsIiwiZW1lcmdlbmN5Q29udGFjdHMiLCJFbWVyZ2VuY3lDb250YWN0cyIsIkVtZXJnZW5jeUNvbnRhY3QiLCJjb250YWN0IiwiaG9tZSIsIm1vYmlsZSIsIm90aGVyIiwid29yayIsInJlbGF0aW9uc2hpcCIsImdlbmRlciIsIkdlbmRlciIsImdyYWRlIiwiR3JhZGUiLCJsb2NrZXJJbmZvUmVjb3JkcyIsIkxvY2tlckluZm9SZWNvcmRzIiwiaG9tZUxhbmd1YWdlIiwiSG9tZUxhbmd1YWdlIiwiaG9tZVJvb20iLCJIb21lUm9vbSIsImhvbWVSb29tVGVhY2hlciIsIkhvbWVSb29tVGNoRU1haWwiLCJIb21lUm9vbVRjaCIsIkhvbWVSb29tVGNoU3RhZmZHVSIsImFkZGl0aW9uYWxJbmZvIiwiVXNlckRlZmluZWRHcm91cEJveGVzIiwiVXNlckRlZmluZWRHcm91cEJveCIsImRlZmluZWRCb3giLCJ2Y0lkIiwiaXRlbXMiLCJVc2VyRGVmaW5lZEl0ZW1zIiwiVXNlckRlZmluZWRJdGVtIiwiaXRlbSIsInNvdXJjZSIsImVsZW1lbnQiLCJvYmplY3QiLCJmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsIiwiUmVxdWVzdERhdGUiLCJ0b0lTT1N0cmluZyIsInhtbEFyciIsImNhbGVuZGFyIiwib3B0aW9ucyIsImRlZmF1bHRPcHRpb25zIiwiY29uY3VycmVuY3kiLCJjYWwiLCJjYWNoZSIsIm1lbW8iLCJzY2hvb2xFbmREYXRlIiwiaW50ZXJ2YWwiLCJDYWxlbmRhckxpc3RpbmciLCJzY2hvb2xTdGFydERhdGUiLCJtb250aHNXaXRoaW5TY2hvb2xZZWFyIiwiZWFjaE1vbnRoT2ZJbnRlcnZhbCIsImdldEFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIiLCJhbGwiLCJldmVudHMiLCJhbGxFdmVudHMiLCJyZWR1Y2UiLCJwcmV2Iiwic2Nob29sRGF0ZSIsIm91dHB1dFJhbmdlIiwicmVzdCIsIkV2ZW50TGlzdHMiLCJFdmVudExpc3QiLCJldmVudCIsIkV2ZW50VHlwZSIsIkFTU0lHTk1FTlQiLCJhc3NpZ25tZW50RXZlbnQiLCJhZGRMaW5rRGF0YSIsImFndSIsImRndSIsImxpbmsiLCJzdGFydFRpbWUiLCJ2aWV3VHlwZSIsIkhPTElEQVkiLCJSRUdVTEFSIiwicmVndWxhckV2ZW50IiwiXyIsInVuaXFCeSJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscywgUGFyc2VkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xuaW1wb3J0IHNvYXAgZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9zb2FwJztcbmltcG9ydCB7IEFkZGl0aW9uYWxJbmZvLCBBZGRpdGlvbmFsSW5mb0l0ZW0sIENsYXNzU2NoZWR1bGVJbmZvLCBTY2hvb2xJbmZvLCBTdHVkZW50SW5mbyB9IGZyb20gJy4vQ2xpZW50LmludGVyZmFjZXMnO1xuaW1wb3J0IHsgU3R1ZGVudEluZm9YTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1N0dWRlbnRJbmZvJztcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4uL01lc3NhZ2UvTWVzc2FnZSc7XG5pbXBvcnQgeyBNZXNzYWdlWE1MT2JqZWN0IH0gZnJvbSAnLi4vTWVzc2FnZS9NZXNzYWdlLnhtbCc7XG5pbXBvcnQgeyBBc3NpZ25tZW50RXZlbnRYTUxPYmplY3QsIENhbGVuZGFyWE1MT2JqZWN0LCBSZWd1bGFyRXZlbnRYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0NhbGVuZGFyJztcbmltcG9ydCB7IEFzc2lnbm1lbnRFdmVudCwgQ2FsZW5kYXIsIENhbGVuZGFyT3B0aW9ucywgRXZlbnQsIEhvbGlkYXlFdmVudCwgUmVndWxhckV2ZW50IH0gZnJvbSAnLi9JbnRlcmZhY2VzL0NhbGVuZGFyJztcbmltcG9ydCB7IGVhY2hNb250aE9mSW50ZXJ2YWwsIHBhcnNlIH0gZnJvbSAnZGF0ZS1mbnMnO1xuaW1wb3J0IHsgRmlsZVJlc291cmNlWE1MT2JqZWN0LCBHcmFkZWJvb2tYTUxPYmplY3QsIFVSTFJlc291cmNlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9HcmFkZWJvb2snO1xuaW1wb3J0IHsgQXR0ZW5kYW5jZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvQXR0ZW5kYW5jZSc7XG5pbXBvcnQgRXZlbnRUeXBlIGZyb20gJy4uLy4uL0NvbnN0YW50cy9FdmVudFR5cGUnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IEFzc2lnbm1lbnQsIEZpbGVSZXNvdXJjZSwgR3JhZGVib29rLCBNYXJrLCBVUkxSZXNvdXJjZSwgV2VpZ2h0ZWRDYXRlZ29yeSB9IGZyb20gJy4vSW50ZXJmYWNlcy9HcmFkZWJvb2snO1xuaW1wb3J0IGFzeW5jUG9vbCBmcm9tICd0aW55LWFzeW5jLXBvb2wnO1xuaW1wb3J0IFJlc291cmNlVHlwZSBmcm9tICcuLi8uLi9Db25zdGFudHMvUmVzb3VyY2VUeXBlJztcbmltcG9ydCB7IEFic2VudFBlcmlvZCwgQXR0ZW5kYW5jZSwgUGVyaW9kSW5mbyB9IGZyb20gJy4vSW50ZXJmYWNlcy9BdHRlbmRhbmNlJztcbmltcG9ydCB7IFNjaGVkdWxlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9TY2hlZHVsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZSB9IGZyb20gJy4vQ2xpZW50LmludGVyZmFjZXMnO1xuaW1wb3J0IHsgU2Nob29sSW5mb1hNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvU2Nob29sSW5mbyc7XG5pbXBvcnQgeyBSZXBvcnRDYXJkc1hNTE9iamVjdCB9IGZyb20gJy4uL1JlcG9ydENhcmQvUmVwb3J0Q2FyZC54bWwnO1xuaW1wb3J0IHsgRG9jdW1lbnRYTUxPYmplY3QgfSBmcm9tICcuLi9Eb2N1bWVudC9Eb2N1bWVudC54bWwnO1xuaW1wb3J0IFJlcG9ydENhcmQgZnJvbSAnLi4vUmVwb3J0Q2FyZC9SZXBvcnRDYXJkJztcbmltcG9ydCBEb2N1bWVudCBmcm9tICcuLi9Eb2N1bWVudC9Eb2N1bWVudCc7XG5pbXBvcnQgUmVxdWVzdEV4Y2VwdGlvbiBmcm9tICcuLi9SZXF1ZXN0RXhjZXB0aW9uL1JlcXVlc3RFeGNlcHRpb24nO1xuaW1wb3J0IFhNTEZhY3RvcnkgZnJvbSAnLi4vLi4vdXRpbHMvWE1MRmFjdG9yeS9YTUxGYWN0b3J5JztcbmltcG9ydCBjYWNoZSBmcm9tICcuLi8uLi91dGlscy9jYWNoZS9jYWNoZSc7XG5cbmFzeW5jIGZ1bmN0aW9uIGFzeW5jUG9vbEFsbDxJTiwgT1VUPihcbiAgcG9vbExpbWl0OiBudW1iZXIsXG4gIGFycmF5OiByZWFkb25seSBJTltdLFxuICBpdGVyYXRvckZuOiAoZ2VuZXJhdG9yOiBJTikgPT4gUHJvbWlzZTxPVVQ+XG4pIHtcbiAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICBmb3IgYXdhaXQgKGNvbnN0IHJlc3VsdCBvZiBhc3luY1Bvb2wocG9vbExpbWl0LCBhcnJheSwgaXRlcmF0b3JGbikpIHtcbiAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0cztcbn1cblxuLyoqXG4gKiBUaGUgU3R1ZGVudFZVRSBDbGllbnQgdG8gYWNjZXNzIHRoZSBBUElcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMge3NvYXAuQ2xpZW50fVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQgZXh0ZW5kcyBzb2FwLkNsaWVudCB7XG4gIHByaXZhdGUgaG9zdFVybDogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcihjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFscywgaG9zdFVybDogc3RyaW5nKSB7XG4gICAgc3VwZXIoY3JlZGVudGlhbHMpO1xuICAgIHRoaXMuaG9zdFVybCA9IGhvc3RVcmw7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUncyB0aGUgdXNlcidzIGNyZWRlbnRpYWxzLiBJdCB3aWxsIHRocm93IGFuIGVycm9yIGlmIGNyZWRlbnRpYWxzIGFyZSBpbmNvcnJlY3RcbiAgICovXG4gIHB1YmxpYyB2YWxpZGF0ZUNyZWRlbnRpYWxzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIHN1cGVyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxQYXJzZWRSZXF1ZXN0RXJyb3I+KHsgbWV0aG9kTmFtZTogJ2xvZ2luIHRlc3QnLCB2YWxpZGF0ZUVycm9yczogZmFsc2UgfSlcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlLlJUX0VSUk9SWzBdWydAX0VSUk9SX01FU1NBR0UnXVswXSA9PT0gJ2xvZ2luIHRlc3QgaXMgbm90IGEgdmFsaWQgbWV0aG9kLicpIHJlcygpO1xuICAgICAgICAgIGVsc2UgcmVqKG5ldyBSZXF1ZXN0RXhjZXB0aW9uKHJlc3BvbnNlKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWopO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHN0dWRlbnQncyBkb2N1bWVudHMgZnJvbSBzeW5lcmd5IHNlcnZlcnNcbiAgICogQHJldHVybnMge1Byb21pc2U8RG9jdW1lbnRbXT59PiBSZXR1cm5zIGEgbGlzdCBvZiBzdHVkZW50IGRvY3VtZW50c1xuICAgKiBAZGVzY3JpcHRpb25cbiAgICogYGBganNcbiAgICogY29uc3QgZG9jdW1lbnRzID0gYXdhaXQgY2xpZW50LmRvY3VtZW50cygpO1xuICAgKiBjb25zdCBkb2N1bWVudCA9IGRvY3VtZW50c1swXTtcbiAgICogY29uc3QgZmlsZXMgPSBhd2FpdCBkb2N1bWVudC5nZXQoKTtcbiAgICogY29uc3QgYmFzZTY0Y29sbGVjdGlvbiA9IGZpbGVzLm1hcCgoZmlsZSkgPT4gZmlsZS5iYXNlNjQpO1xuICAgKiBgYGBcbiAgICovXG4gIHB1YmxpYyBkb2N1bWVudHMoKTogUHJvbWlzZTxEb2N1bWVudFtdPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgc3VwZXJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PERvY3VtZW50WE1MT2JqZWN0Pih7XG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0dldFN0dWRlbnREb2N1bWVudEluaXRpYWxEYXRhJyxcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcbiAgICAgICAgICByZXMoXG4gICAgICAgICAgICB4bWxPYmplY3RbJ1N0dWRlbnREb2N1bWVudHMnXVswXS5TdHVkZW50RG9jdW1lbnREYXRhc1swXS5TdHVkZW50RG9jdW1lbnREYXRhLm1hcChcbiAgICAgICAgICAgICAgKHhtbCkgPT4gbmV3IERvY3VtZW50KHhtbCwgc3VwZXIuY3JlZGVudGlhbHMpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlaik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIGxpc3Qgb2YgcmVwb3J0IGNhcmRzXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFJlcG9ydENhcmRbXT59IFJldHVybnMgYSBsaXN0IG9mIHJlcG9ydCBjYXJkcyB0aGF0IGNhbiBmZXRjaCBhIGZpbGVcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGNvbnN0IHJlcG9ydENhcmRzID0gYXdhaXQgY2xpZW50LnJlcG9ydENhcmRzKCk7XG4gICAqIGNvbnN0IGZpbGVzID0gYXdhaXQgUHJvbWlzZS5hbGwocmVwb3J0Q2FyZHMubWFwKChjYXJkKSA9PiBjYXJkLmdldCgpKSk7XG4gICAqIGNvbnN0IGJhc2U2NGFyciA9IGZpbGVzLm1hcCgoZmlsZSkgPT4gZmlsZS5iYXNlNjQpOyAvLyBbXCJKVkJFUmkwLi4uXCIsIFwiZFVJb2ExLi4uXCIsIC4uLl07XG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIHJlcG9ydENhcmRzKCk6IFByb21pc2U8UmVwb3J0Q2FyZFtdPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgc3VwZXJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFJlcG9ydENhcmRzWE1MT2JqZWN0Pih7XG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0dldFJlcG9ydENhcmRJbml0aWFsRGF0YScsXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XG4gICAgICAgICAgcmVzKFxuICAgICAgICAgICAgeG1sT2JqZWN0LlJDUmVwb3J0aW5nUGVyaW9kRGF0YVswXS5SQ1JlcG9ydGluZ1BlcmlvZHNbMF0uUkNSZXBvcnRpbmdQZXJpb2QubWFwKFxuICAgICAgICAgICAgICAoeG1sKSA9PiBuZXcgUmVwb3J0Q2FyZCh4bWwsIHN1cGVyLmNyZWRlbnRpYWxzKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWopO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHN0dWRlbnQncyBzY2hvb2wncyBpbmZvcm1hdGlvblxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTY2hvb2xJbmZvPn0gUmV0dXJucyB0aGUgaW5mb3JtYXRpb24gb2YgdGhlIHN0dWRlbnQncyBzY2hvb2xcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGF3YWl0IGNsaWVudC5zY2hvb2xJbmZvKCk7XG4gICAqXG4gICAqIGNsaWVudC5zY2hvb2xJbmZvKCkudGhlbigoc2Nob29sSW5mbykgPT4ge1xuICAgKiAgY29uc29sZS5sb2coXy51bmlxKHNjaG9vbEluZm8uc3RhZmYubWFwKChzdGFmZikgPT4gc3RhZmYubmFtZSkpKTsgLy8gTGlzdCBhbGwgc3RhZmYgcG9zaXRpb25zIHVzaW5nIGxvZGFzaFxuICAgKiB9KVxuICAgKiBgYGBcbiAgICovXG4gIHB1YmxpYyBzY2hvb2xJbmZvKCk6IFByb21pc2U8U2Nob29sSW5mbz4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIHN1cGVyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxTY2hvb2xJbmZvWE1MT2JqZWN0Pih7XG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRTY2hvb2xJbmZvJyxcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElEOiAwIH0sXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCh7IFN0dWRlbnRTY2hvb2xJbmZvTGlzdGluZzogW3htbE9iamVjdF0gfSkgPT4ge1xuICAgICAgICAgIHJlcyh7XG4gICAgICAgICAgICBzY2hvb2w6IHtcbiAgICAgICAgICAgICAgYWRkcmVzczogeG1sT2JqZWN0WydAX1NjaG9vbEFkZHJlc3MnXVswXSxcbiAgICAgICAgICAgICAgYWRkcmVzc0FsdDogeG1sT2JqZWN0WydAX1NjaG9vbEFkZHJlc3MyJ11bMF0sXG4gICAgICAgICAgICAgIGNpdHk6IHhtbE9iamVjdFsnQF9TY2hvb2xDaXR5J11bMF0sXG4gICAgICAgICAgICAgIHppcENvZGU6IHhtbE9iamVjdFsnQF9TY2hvb2xaaXAnXVswXSxcbiAgICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdFsnQF9QaG9uZSddWzBdLFxuICAgICAgICAgICAgICBhbHRQaG9uZTogeG1sT2JqZWN0WydAX1Bob25lMiddWzBdLFxuICAgICAgICAgICAgICBwcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsJ11bMF0sXG4gICAgICAgICAgICAgICAgZW1haWw6IHhtbE9iamVjdFsnQF9QcmluY2lwYWxFbWFpbCddWzBdLFxuICAgICAgICAgICAgICAgIHN0YWZmR3U6IHhtbE9iamVjdFsnQF9QcmluY2lwYWxHdSddWzBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0YWZmOiB4bWxPYmplY3QuU3RhZmZMaXN0c1swXS5TdGFmZkxpc3QubWFwKChzdGFmZikgPT4gKHtcbiAgICAgICAgICAgICAgbmFtZTogc3RhZmZbJ0BfTmFtZSddWzBdLFxuICAgICAgICAgICAgICBlbWFpbDogc3RhZmZbJ0BfRU1haWwnXVswXSxcbiAgICAgICAgICAgICAgc3RhZmZHdTogc3RhZmZbJ0BfU3RhZmZHVSddWzBdLFxuICAgICAgICAgICAgICBqb2JUaXRsZTogc3RhZmZbJ0BfVGl0bGUnXVswXSxcbiAgICAgICAgICAgICAgZXh0bjogc3RhZmZbJ0BfRXh0biddWzBdLFxuICAgICAgICAgICAgICBwaG9uZTogc3RhZmZbJ0BfUGhvbmUnXVswXSxcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlaik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgc2NoZWR1bGUgb2YgdGhlIHN0dWRlbnRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRlcm1JbmRleCBUaGUgaW5kZXggb2YgdGhlIHRlcm0uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFNjaGVkdWxlPn0gUmV0dXJucyB0aGUgc2NoZWR1bGUgb2YgdGhlIHN0dWRlbnRcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGF3YWl0IHNjaGVkdWxlKDApIC8vIC0+IHsgdGVybTogeyBpbmRleDogMCwgbmFtZTogJzFzdCBRdHIgUHJvZ3Jlc3MnIH0sIC4uLiB9XG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIHNjaGVkdWxlKHRlcm1JbmRleD86IG51bWJlcik6IFByb21pc2U8U2NoZWR1bGU+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBzdXBlclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8U2NoZWR1bGVYTUxPYmplY3Q+KHtcbiAgICAgICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudENsYXNzTGlzdCcsXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgLi4uKHRlcm1JbmRleCAhPSBudWxsID8geyBUZXJtSW5kZXg6IHRlcm1JbmRleCB9IDoge30pIH0sXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcbiAgICAgICAgICByZXMoe1xuICAgICAgICAgICAgdGVybToge1xuICAgICAgICAgICAgICBpbmRleDogTnVtYmVyKHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9UZXJtSW5kZXgnXVswXSksXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9UZXJtSW5kZXhOYW1lJ11bMF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9FcnJvck1lc3NhZ2UnXVswXSxcbiAgICAgICAgICAgIHRvZGF5OlxuICAgICAgICAgICAgICB0eXBlb2YgeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLlRvZGF5U2NoZWR1bGVJbmZvRGF0YVswXS5TY2hvb2xJbmZvc1swXSAhPT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICA/IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5Ub2RheVNjaGVkdWxlSW5mb0RhdGFbMF0uU2Nob29sSW5mb3NbMF0uU2Nob29sSW5mby5tYXAoXG4gICAgICAgICAgICAgICAgICAgIChzY2hvb2wpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogc2Nob29sWydAX1NjaG9vbE5hbWUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICBiZWxsU2NoZWR1bGVOYW1lOiBzY2hvb2xbJ0BfQmVsbFNjaGVkTmFtZSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXM6XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygc2Nob29sLkNsYXNzZXNbMF0gIT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gc2Nob29sLkNsYXNzZXNbMF0uQ2xhc3NJbmZvLm1hcDxDbGFzc1NjaGVkdWxlSW5mbz4oKGNvdXJzZSkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKGNvdXJzZVsnQF9QZXJpb2QnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRlbmRhbmNlQ29kZTogY291cnNlLkF0dGVuZGFuY2VDb2RlWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoY291cnNlWydAX1N0YXJ0RGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShjb3Vyc2VbJ0BfRW5kRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfQ2xhc3NOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWN0aW9uR3U6IGNvdXJzZVsnQF9TZWN0aW9uR1UnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlYWNoZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGNvdXJzZVsnQF9UZWFjaGVyRW1haWwnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWxTdWJqZWN0OiBjb3Vyc2VbJ0BfRW1haWxTdWJqZWN0J11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9UZWFjaGVyTmFtZSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBjb3Vyc2VbJ0BfU3RhZmZHVSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGNvdXJzZVsnQF9UZWFjaGVyVVJMJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBjb3Vyc2VbJ0BfQ2xhc3NVUkwnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHBhcnNlKGNvdXJzZVsnQF9TdGFydFRpbWUnXVswXSwgJ2hoOm1tIGEnLCBEYXRlLm5vdygpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBwYXJzZShjb3Vyc2VbJ0BfRW5kVGltZSddWzBdLCAnaGg6bW0gYScsIERhdGUubm93KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICA6IFtdLFxuICAgICAgICAgICAgY2xhc3NlczpcbiAgICAgICAgICAgICAgdHlwZW9mIHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5DbGFzc0xpc3RzWzBdICE9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgID8geG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLkNsYXNzTGlzdHNbMF0uQ2xhc3NMaXN0aW5nLm1hcCgoc3R1ZGVudENsYXNzKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdHVkZW50Q2xhc3NbJ0BfQ291cnNlVGl0bGUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIoc3R1ZGVudENsYXNzWydAX1BlcmlvZCddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgcm9vbTogc3R1ZGVudENsYXNzWydAX1Jvb21OYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgIHNlY3Rpb25HdTogc3R1ZGVudENsYXNzWydAX1NlY3Rpb25HVSddWzBdLFxuICAgICAgICAgICAgICAgICAgICB0ZWFjaGVyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogc3R1ZGVudENsYXNzWydAX1RlYWNoZXInXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogc3R1ZGVudENsYXNzWydAX1RlYWNoZXJFbWFpbCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IHN0dWRlbnRDbGFzc1snQF9UZWFjaGVyU3RhZmZHVSddWzBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgICAgIHRlcm1zOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVGVybUxpc3RzWzBdLlRlcm1MaXN0aW5nLm1hcCgodGVybSkgPT4gKHtcbiAgICAgICAgICAgICAgZGF0ZToge1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh0ZXJtWydAX0JlZ2luRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHRlcm1bJ0BfRW5kRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcih0ZXJtWydAX1Rlcm1JbmRleCddWzBdKSxcbiAgICAgICAgICAgICAgbmFtZTogdGVybVsnQF9UZXJtTmFtZSddWzBdLFxuICAgICAgICAgICAgICBzY2hvb2xZZWFyVGVybUNvZGVHdTogdGVybVsnQF9TY2hvb2xZZWFyVHJtQ29kZUdVJ11bMF0sXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWopO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGF0dGVuZGFuY2Ugb2YgdGhlIHN0dWRlbnRcbiAgICogQHJldHVybnMge1Byb21pc2U8QXR0ZW5kYW5jZT59IFJldHVybnMgYW4gQXR0ZW5kYW5jZSBvYmplY3RcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGNsaWVudC5hdHRlbmRhbmNlKClcbiAgICogIC50aGVuKGNvbnNvbGUubG9nKTsgLy8gLT4geyB0eXBlOiAnUGVyaW9kJywgcGVyaW9kOiB7Li4ufSwgc2Nob29sTmFtZTogJ1VuaXZlcnNpdHkgSGlnaCBTY2hvb2wnLCBhYnNlbmNlczogWy4uLl0sIHBlcmlvZEluZm9zOiBbLi4uXSB9XG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIGF0dGVuZGFuY2UoKTogUHJvbWlzZTxBdHRlbmRhbmNlPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgc3VwZXJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PEF0dGVuZGFuY2VYTUxPYmplY3Q+KHtcbiAgICAgICAgICBtZXRob2ROYW1lOiAnQXR0ZW5kYW5jZScsXG4gICAgICAgICAgcGFyYW1TdHI6IHtcbiAgICAgICAgICAgIGNoaWxkSW50SWQ6IDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKGF0dGVuZGFuY2VYTUxPYmplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCB4bWxPYmplY3QgPSBhdHRlbmRhbmNlWE1MT2JqZWN0LkF0dGVuZGFuY2VbMF07XG5cbiAgICAgICAgICByZXMoe1xuICAgICAgICAgICAgdHlwZTogeG1sT2JqZWN0WydAX1R5cGUnXVswXSxcbiAgICAgICAgICAgIHBlcmlvZDoge1xuICAgICAgICAgICAgICB0b3RhbDogTnVtYmVyKHhtbE9iamVjdFsnQF9QZXJpb2RDb3VudCddWzBdKSxcbiAgICAgICAgICAgICAgc3RhcnQ6IE51bWJlcih4bWxPYmplY3RbJ0BfU3RhcnRQZXJpb2QnXVswXSksXG4gICAgICAgICAgICAgIGVuZDogTnVtYmVyKHhtbE9iamVjdFsnQF9FbmRQZXJpb2QnXVswXSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2Nob29sTmFtZTogeG1sT2JqZWN0WydAX1NjaG9vbE5hbWUnXVswXSxcbiAgICAgICAgICAgIGFic2VuY2VzOiB4bWxPYmplY3QuQWJzZW5jZXNbMF0uQWJzZW5jZVxuICAgICAgICAgICAgICA/IHhtbE9iamVjdC5BYnNlbmNlc1swXS5BYnNlbmNlLm1hcCgoYWJzZW5jZSkgPT4gKHtcbiAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGFic2VuY2VbJ0BfQWJzZW5jZURhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgICByZWFzb246IGFic2VuY2VbJ0BfUmVhc29uJ11bMF0sXG4gICAgICAgICAgICAgICAgICBub3RlOiBhYnNlbmNlWydAX05vdGUnXVswXSxcbiAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBhYnNlbmNlWydAX0NvZGVBbGxEYXlEZXNjcmlwdGlvbiddWzBdLFxuICAgICAgICAgICAgICAgICAgcGVyaW9kczogYWJzZW5jZS5QZXJpb2RzWzBdLlBlcmlvZC5tYXAoXG4gICAgICAgICAgICAgICAgICAgIChwZXJpb2QpID0+XG4gICAgICAgICAgICAgICAgICAgICAgKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKHBlcmlvZFsnQF9OdW1iZXInXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfTmFtZSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBwZXJpb2RbJ0BfUmVhc29uJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3Vyc2U6IHBlcmlvZFsnQF9Db3Vyc2UnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWZmOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9TdGFmZiddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBwZXJpb2RbJ0BfU3RhZmZHVSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogcGVyaW9kWydAX1N0YWZmRU1haWwnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmdZZWFyR3U6IHBlcmlvZFsnQF9PcmdZZWFyR1UnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICB9IGFzIEFic2VudFBlcmlvZClcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgIDogW10sXG4gICAgICAgICAgICBwZXJpb2RJbmZvczogeG1sT2JqZWN0LlRvdGFsQWN0aXZpdGllc1swXS5QZXJpb2RUb3RhbC5tYXAoKHBkLCBpKSA9PiAoe1xuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihwZFsnQF9OdW1iZXInXVswXSksXG4gICAgICAgICAgICAgIHRvdGFsOiB7XG4gICAgICAgICAgICAgICAgZXhjdXNlZDogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbEV4Y3VzZWRbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXG4gICAgICAgICAgICAgICAgdGFyZGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbFRhcmRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXG4gICAgICAgICAgICAgICAgdW5leGN1c2VkOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVW5leGN1c2VkWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxBY3Rpdml0aWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxuICAgICAgICAgICAgICAgIHVuZXhjdXNlZFRhcmRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxVbmV4Y3VzZWRUYXJkaWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSkpIGFzIFBlcmlvZEluZm9bXSxcbiAgICAgICAgICB9IGFzIEF0dGVuZGFuY2UpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2gocmVqKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBncmFkZWJvb2sgb2YgdGhlIHN0dWRlbnRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHJlcG9ydGluZ1BlcmlvZEluZGV4IFRoZSB0aW1lZnJhbWUgdGhhdCB0aGUgZ3JhZGVib29rIHNob3VsZCByZXR1cm5cbiAgICogQHJldHVybnMge1Byb21pc2U8R3JhZGVib29rPn0gUmV0dXJucyBhIEdyYWRlYm9vayBvYmplY3RcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGNvbnN0IGdyYWRlYm9vayA9IGF3YWl0IGNsaWVudC5ncmFkZWJvb2soKTtcbiAgICogY29uc29sZS5sb2coZ3JhZGVib29rKTsgLy8geyBlcnJvcjogJycsIHR5cGU6ICdUcmFkaXRpb25hbCcsIHJlcG9ydGluZ1BlcmlvZDogey4uLn0sIGNvdXJzZXM6IFsuLi5dIH07XG4gICAqXG4gICAqIGF3YWl0IGNsaWVudC5ncmFkZWJvb2soMCkgLy8gU29tZSBzY2hvb2xzIHdpbGwgaGF2ZSBSZXBvcnRpbmdQZXJpb2RJbmRleCAwIGFzIFwiMXN0IFF1YXJ0ZXIgUHJvZ3Jlc3NcIlxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDcpIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggNyBhcyBcIjR0aCBRdWFydGVyXCJcbiAgICogYGBgXG4gICAqL1xuICBwdWJsaWMgZ3JhZGVib29rKHJlcG9ydGluZ1BlcmlvZEluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxHcmFkZWJvb2s+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBzdXBlclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8R3JhZGVib29rWE1MT2JqZWN0PihcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtZXRob2ROYW1lOiAnR3JhZGVib29rJyxcbiAgICAgICAgICAgIHBhcmFtU3RyOiB7XG4gICAgICAgICAgICAgIGNoaWxkSW50SWQ6IDAsXG4gICAgICAgICAgICAgIC4uLihyZXBvcnRpbmdQZXJpb2RJbmRleCAhPSBudWxsID8geyBSZXBvcnRQZXJpb2Q6IHJlcG9ydGluZ1BlcmlvZEluZGV4IH0gOiB7fSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgKHhtbCkgPT5cbiAgICAgICAgICAgIG5ldyBYTUxGYWN0b3J5KHhtbClcbiAgICAgICAgICAgICAgLmVuY29kZUF0dHJpYnV0ZSgnTWVhc3VyZURlc2NyaXB0aW9uJywgJ0hhc0Ryb3BCb3gnKVxuICAgICAgICAgICAgICAuZW5jb2RlQXR0cmlidXRlKCdNZWFzdXJlJywgJ1R5cGUnKVxuICAgICAgICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICApXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3Q6IEdyYWRlYm9va1hNTE9iamVjdCkgPT4ge1xuICAgICAgICAgIHJlcyh7XG4gICAgICAgICAgICBlcnJvcjogeG1sT2JqZWN0LkdyYWRlYm9va1swXVsnQF9FcnJvck1lc3NhZ2UnXVswXSxcbiAgICAgICAgICAgIHR5cGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfVHlwZSddWzBdLFxuICAgICAgICAgICAgcmVwb3J0aW5nUGVyaW9kOiB7XG4gICAgICAgICAgICAgIGN1cnJlbnQ6IHtcbiAgICAgICAgICAgICAgICBpbmRleDpcbiAgICAgICAgICAgICAgICAgIHJlcG9ydGluZ1BlcmlvZEluZGV4ID8/XG4gICAgICAgICAgICAgICAgICBOdW1iZXIoXG4gICAgICAgICAgICAgICAgICAgIHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QuZmluZChcbiAgICAgICAgICAgICAgICAgICAgICAoeCkgPT4geFsnQF9HcmFkZVBlcmlvZCddWzBdID09PSB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9HcmFkZVBlcmlvZCddWzBdXG4gICAgICAgICAgICAgICAgICAgICk/LlsnQF9JbmRleCddWzBdXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIGRhdGU6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9TdGFydERhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0VuZERhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9HcmFkZVBlcmlvZCddWzBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBhdmFpbGFibGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QubWFwKChwZXJpb2QpID0+ICh7XG4gICAgICAgICAgICAgICAgZGF0ZTogeyBzdGFydDogbmV3IERhdGUocGVyaW9kWydAX1N0YXJ0RGF0ZSddWzBdKSwgZW5kOiBuZXcgRGF0ZShwZXJpb2RbJ0BfRW5kRGF0ZSddWzBdKSB9LFxuICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9HcmFkZVBlcmlvZCddWzBdLFxuICAgICAgICAgICAgICAgIGluZGV4OiBOdW1iZXIocGVyaW9kWydAX0luZGV4J11bMF0pLFxuICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY291cnNlczogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5Db3Vyc2VzWzBdLkNvdXJzZS5tYXAoKGNvdXJzZSkgPT4gKHtcbiAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIoY291cnNlWydAX1BlcmlvZCddWzBdKSxcbiAgICAgICAgICAgICAgdGl0bGU6IGNvdXJzZVsnQF9UaXRsZSddWzBdLFxuICAgICAgICAgICAgICByb29tOiBjb3Vyc2VbJ0BfUm9vbSddWzBdLFxuICAgICAgICAgICAgICBzdGFmZjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9TdGFmZiddWzBdLFxuICAgICAgICAgICAgICAgIGVtYWlsOiBjb3Vyc2VbJ0BfU3RhZmZFTWFpbCddWzBdLFxuICAgICAgICAgICAgICAgIHN0YWZmR3U6IGNvdXJzZVsnQF9TdGFmZkdVJ11bMF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1hcmtzOiBjb3Vyc2UuTWFya3NbMF0uTWFyay5tYXAoKG1hcmspID0+ICh7XG4gICAgICAgICAgICAgICAgbmFtZTogbWFya1snQF9NYXJrTmFtZSddWzBdLFxuICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRTY29yZToge1xuICAgICAgICAgICAgICAgICAgc3RyaW5nOiBtYXJrWydAX0NhbGN1bGF0ZWRTY29yZVN0cmluZyddWzBdLFxuICAgICAgICAgICAgICAgICAgcmF3OiBOdW1iZXIobWFya1snQF9DYWxjdWxhdGVkU2NvcmVSYXcnXVswXSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZENhdGVnb3JpZXM6XG4gICAgICAgICAgICAgICAgICB0eXBlb2YgbWFya1snR3JhZGVDYWxjdWxhdGlvblN1bW1hcnknXVswXSAhPT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgICAgPyBtYXJrWydHcmFkZUNhbGN1bGF0aW9uU3VtbWFyeSddWzBdLkFzc2lnbm1lbnRHcmFkZUNhbGMubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgKHdlaWdodGVkKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHdlaWdodGVkWydAX1R5cGUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkTWFyazogd2VpZ2h0ZWRbJ0BfQ2FsY3VsYXRlZE1hcmsnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2YWx1YXRlZDogd2VpZ2h0ZWRbJ0BfV2VpZ2h0ZWRQY3QnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkOiB3ZWlnaHRlZFsnQF9XZWlnaHQnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDogTnVtYmVyKHdlaWdodGVkWydAX1BvaW50cyddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3NpYmxlOiBOdW1iZXIod2VpZ2h0ZWRbJ0BfUG9pbnRzUG9zc2libGUnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBXZWlnaHRlZENhdGVnb3J5KVxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50czpcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiBtYXJrLkFzc2lnbm1lbnRzWzBdICE9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICA/IChtYXJrLkFzc2lnbm1lbnRzWzBdLkFzc2lnbm1lbnQubWFwKChhc3NpZ25tZW50KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhZGVib29rSWQ6IGFzc2lnbm1lbnRbJ0BfR3JhZGVib29rSUQnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGRlY29kZVVSSShhc3NpZ25tZW50WydAX01lYXN1cmUnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhc3NpZ25tZW50WydAX1R5cGUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHVlOiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0R1ZURhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYXNzaWdubWVudFsnQF9TY29yZVR5cGUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGFzc2lnbm1lbnRbJ0BfU2NvcmUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IGFzc2lnbm1lbnRbJ0BfUG9pbnRzJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlczogYXNzaWdubWVudFsnQF9Ob3RlcyddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVhY2hlcklkOiBhc3NpZ25tZW50WydAX1RlYWNoZXJJRCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRlY29kZVVSSShhc3NpZ25tZW50WydAX01lYXN1cmVEZXNjcmlwdGlvbiddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0Ryb3Bib3g6IEpTT04ucGFyc2UoYXNzaWdubWVudFsnQF9IYXNEcm9wQm94J11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R1ZGVudElkOiBhc3NpZ25tZW50WydAX1N0dWRlbnRJRCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGJveERhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRHJvcFN0YXJ0RGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0Ryb3BFbmREYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdICE9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdLlJlc291cmNlLm1hcCgocnNyYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJzcmNbJ0BfVHlwZSddWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnRmlsZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVSc3JjID0gcnNyYyBhcyBGaWxlUmVzb3VyY2VYTUxPYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBSZXNvdXJjZVR5cGUuRklMRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpbGVSc3JjWydAX0ZpbGVUeXBlJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZVJzcmNbJ0BfRmlsZU5hbWUnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmk6IHRoaXMuaG9zdFVybCArIGZpbGVSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZmlsZVJzcmNbJ0BfUmVzb3VyY2VEYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBmaWxlUnNyY1snQF9SZXNvdXJjZUlEJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZVJzcmNbJ0BfUmVzb3VyY2VOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIEZpbGVSZXNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnVVJMJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsUnNyYyA9IHJzcmMgYXMgVVJMUmVzb3VyY2VYTUxPYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybFJzcmNbJ0BfVVJMJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFJlc291cmNlVHlwZS5VUkwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUodXJsUnNyY1snQF9SZXNvdXJjZURhdGUnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHVybFJzcmNbJ0BfUmVzb3VyY2VJRCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHVybFJzcmNbJ0BfUmVzb3VyY2VOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVybFJzcmNbJ0BfUmVzb3VyY2VEZXNjcmlwdGlvbiddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiB1cmxSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFVSTFJlc291cmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgVHlwZSAke3JzcmNbJ0BfVHlwZSddWzBdfSBkb2VzIG5vdCBleGlzdCBhcyBhIHR5cGUuIEFkZCBpdCB0byB0eXBlIGRlY2xhcmF0aW9ucy5gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSBhcyAoRmlsZVJlc291cmNlIHwgVVJMUmVzb3VyY2UpW10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICB9KSkgYXMgQXNzaWdubWVudFtdKVxuICAgICAgICAgICAgICAgICAgICA6IFtdLFxuICAgICAgICAgICAgICB9KSkgYXMgTWFya1tdLFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgIH0gYXMgR3JhZGVib29rKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlaik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbGlzdCBvZiBtZXNzYWdlcyBvZiB0aGUgc3R1ZGVudFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxNZXNzYWdlW10+fSBSZXR1cm5zIGFuIGFycmF5IG9mIG1lc3NhZ2VzIG9mIHRoZSBzdHVkZW50XG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTsgLy8gLT4gW3sgaWQ6ICdFOTcyRjFCQy05OUEwLTRDRDAtOEQxNS1CMTg5NjhCNDNFMDgnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH0sIHsgaWQ6ICc4NkZEQTExRC00MkM3LTQyNDktQjAwMy05NEIxNUVCMkM4RDQnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH1dXG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIG1lc3NhZ2VzKCk6IFByb21pc2U8TWVzc2FnZVtdPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgc3VwZXJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PE1lc3NhZ2VYTUxPYmplY3Q+KFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRQWFBNZXNzYWdlcycsXG4gICAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAoeG1sKSA9PiBuZXcgWE1MRmFjdG9yeSh4bWwpLmVuY29kZUF0dHJpYnV0ZSgnQ29udGVudCcsICdSZWFkJykudG9TdHJpbmcoKVxuICAgICAgICApXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcbiAgICAgICAgICByZXMoXG4gICAgICAgICAgICB4bWxPYmplY3QuUFhQTWVzc2FnZXNEYXRhWzBdLk1lc3NhZ2VMaXN0aW5nc1swXS5NZXNzYWdlTGlzdGluZy5tYXAoXG4gICAgICAgICAgICAgIChtZXNzYWdlKSA9PiBuZXcgTWVzc2FnZShtZXNzYWdlLCBzdXBlci5jcmVkZW50aWFscywgdGhpcy5ob3N0VXJsKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWopO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGluZm8gb2YgYSBzdHVkZW50XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN0dWRlbnRJbmZvPn0gU3R1ZGVudEluZm8gb2JqZWN0XG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGBqc1xuICAgKiBzdHVkZW50SW5mbygpLnRoZW4oY29uc29sZS5sb2cpIC8vIC0+IHsgc3R1ZGVudDogeyBuYW1lOiAnRXZhbiBEYXZpcycsIG5pY2tuYW1lOiAnJywgbGFzdE5hbWU6ICdEYXZpcycgfSwgLi4ufVxuICAgKiBgYGBcbiAgICovXG4gIHB1YmxpYyBzdHVkZW50SW5mbygpOiBQcm9taXNlPFN0dWRlbnRJbmZvPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFN0dWRlbnRJbmZvPigocmVzLCByZWopID0+IHtcbiAgICAgIHN1cGVyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxTdHVkZW50SW5mb1hNTE9iamVjdD4oe1xuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50SW5mbycsXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoeG1sT2JqZWN0RGF0YSkgPT4ge1xuICAgICAgICAgIHJlcyh7XG4gICAgICAgICAgICBzdHVkZW50OiB7XG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRm9ybWF0dGVkTmFtZVswXSxcbiAgICAgICAgICAgICAgbGFzdE5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uTGFzdE5hbWVHb2VzQnlbMF0sXG4gICAgICAgICAgICAgIG5pY2tuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLk5pY2tOYW1lWzBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5CaXJ0aERhdGVbMF0pLFxuICAgICAgICAgICAgdHJhY2s6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5UcmFjayksXG4gICAgICAgICAgICBhZGRyZXNzOiB0aGlzLm9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzcyksXG4gICAgICAgICAgICBwaG90bzogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBob3RvKSxcbiAgICAgICAgICAgIGNvdW5zZWxvcjpcbiAgICAgICAgICAgICAgeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Db3Vuc2Vsb3JOYW1lICYmXG4gICAgICAgICAgICAgIHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yRW1haWwgJiZcbiAgICAgICAgICAgICAgeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Db3Vuc2Vsb3JTdGFmZkdVXG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yTmFtZVswXSxcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yRW1haWxbMF0sXG4gICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yU3RhZmZHVVswXSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGN1cnJlbnRTY2hvb2w6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ3VycmVudFNjaG9vbFswXSxcbiAgICAgICAgICAgIGRlbnRpc3Q6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRGVudGlzdFxuICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRGVudGlzdFswXVsnQF9OYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5EZW50aXN0WzBdWydAX1Bob25lJ11bMF0sXG4gICAgICAgICAgICAgICAgICBleHRuOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkRlbnRpc3RbMF1bJ0BfRXh0biddWzBdLFxuICAgICAgICAgICAgICAgICAgb2ZmaWNlOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkRlbnRpc3RbMF1bJ0BfT2ZmaWNlJ11bMF0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHBoeXNpY2lhbjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaHlzaWNpYW5cbiAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBoeXNpY2lhblswXVsnQF9OYW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaHlzaWNpYW5bMF1bJ0BfUGhvbmUnXVswXSxcbiAgICAgICAgICAgICAgICAgIGV4dG46IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uUGh5c2ljaWFuWzBdWydAX0V4dG4nXVswXSxcbiAgICAgICAgICAgICAgICAgIGhvc3BpdGFsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBoeXNpY2lhblswXVsnQF9Ib3NwaXRhbCddWzBdLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBpZDogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBlcm1JRCksXG4gICAgICAgICAgICBvcmdZZWFyR3U6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5PcmdZZWFyR1UpLFxuICAgICAgICAgICAgcGhvbmU6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaG9uZSksXG4gICAgICAgICAgICBlbWFpbDogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkVNYWlsKSxcbiAgICAgICAgICAgIGVtZXJnZW5jeUNvbnRhY3RzOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkVtZXJnZW5jeUNvbnRhY3RzXG4gICAgICAgICAgICAgID8geG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5FbWVyZ2VuY3lDb250YWN0c1swXS5FbWVyZ2VuY3lDb250YWN0Lm1hcCgoY29udGFjdCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMub3B0aW9uYWwoY29udGFjdFsnQF9OYW1lJ10pLFxuICAgICAgICAgICAgICAgICAgcGhvbmU6IHtcbiAgICAgICAgICAgICAgICAgICAgaG9tZTogdGhpcy5vcHRpb25hbChjb250YWN0WydAX0hvbWVQaG9uZSddKSxcbiAgICAgICAgICAgICAgICAgICAgbW9iaWxlOiB0aGlzLm9wdGlvbmFsKGNvbnRhY3RbJ0BfTW9iaWxlUGhvbmUnXSksXG4gICAgICAgICAgICAgICAgICAgIG90aGVyOiB0aGlzLm9wdGlvbmFsKGNvbnRhY3RbJ0BfT3RoZXJQaG9uZSddKSxcbiAgICAgICAgICAgICAgICAgICAgd29yazogdGhpcy5vcHRpb25hbChjb250YWN0WydAX1dvcmtQaG9uZSddKSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6IHRoaXMub3B0aW9uYWwoY29udGFjdFsnQF9SZWxhdGlvbnNoaXAnXSksXG4gICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgIDogW10sXG4gICAgICAgICAgICBnZW5kZXI6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HZW5kZXIpLFxuICAgICAgICAgICAgZ3JhZGU6IHRoaXMub3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5HcmFkZSksXG4gICAgICAgICAgICBsb2NrZXJJbmZvUmVjb3JkczogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkxvY2tlckluZm9SZWNvcmRzKSxcbiAgICAgICAgICAgIGhvbWVMYW5ndWFnZTogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkhvbWVMYW5ndWFnZSksXG4gICAgICAgICAgICBob21lUm9vbTogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkhvbWVSb29tKSxcbiAgICAgICAgICAgIGhvbWVSb29tVGVhY2hlcjoge1xuICAgICAgICAgICAgICBlbWFpbDogdGhpcy5vcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkhvbWVSb29tVGNoRU1haWwpLFxuICAgICAgICAgICAgICBuYW1lOiB0aGlzLm9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uSG9tZVJvb21UY2gpLFxuICAgICAgICAgICAgICBzdGFmZkd1OiB0aGlzLm9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uSG9tZVJvb21UY2hTdGFmZkdVKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRpdGlvbmFsSW5mbzogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94ZXNbMF0uVXNlckRlZmluZWRHcm91cEJveFxuICAgICAgICAgICAgICA/ICh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlVzZXJEZWZpbmVkR3JvdXBCb3hlc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94Lm1hcCgoZGVmaW5lZEJveCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgIGlkOiBkZWZpbmVkQm94WydAX0dyb3VwQm94SUQnXVswXSxcbiAgICAgICAgICAgICAgICAgIHR5cGU6IGRlZmluZWRCb3hbJ0BfR3JvdXBCb3hMYWJlbCddWzBdLFxuICAgICAgICAgICAgICAgICAgdmNJZDogZGVmaW5lZEJveFsnQF9WQ0lEJ11bMF0sXG4gICAgICAgICAgICAgICAgICBpdGVtczogZGVmaW5lZEJveC5Vc2VyRGVmaW5lZEl0ZW1zWzBdLlVzZXJEZWZpbmVkSXRlbS5tYXAoKGl0ZW0pID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGl0ZW1bJ0BfU291cmNlRWxlbWVudCddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogaXRlbVsnQF9Tb3VyY2VPYmplY3QnXVswXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdmNJZDogaXRlbVsnQF9WQ0lEJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpdGVtWydAX1ZhbHVlJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGl0ZW1bJ0BfSXRlbVR5cGUnXVswXSxcbiAgICAgICAgICAgICAgICAgIH0pKSBhcyBBZGRpdGlvbmFsSW5mb0l0ZW1bXSxcbiAgICAgICAgICAgICAgICB9KSkgYXMgQWRkaXRpb25hbEluZm9bXSlcbiAgICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgICB9IGFzIFN0dWRlbnRJbmZvKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlaik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwoZGF0ZTogRGF0ZSkge1xuICAgIHJldHVybiBzdXBlci5wcm9jZXNzUmVxdWVzdDxDYWxlbmRhclhNTE9iamVjdD4oXG4gICAgICB7XG4gICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50Q2FsZW5kYXInLFxuICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwLCBSZXF1ZXN0RGF0ZTogZGF0ZS50b0lTT1N0cmluZygpIH0sXG4gICAgICB9LFxuICAgICAgKHhtbCkgPT4gbmV3IFhNTEZhY3RvcnkoeG1sKS5lbmNvZGVBdHRyaWJ1dGUoJ1RpdGxlJywgJ0ljb24nKS50b1N0cmluZygpXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgb3B0aW9uYWw8VD4oeG1sQXJyPzogVFtdKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHhtbEFyciA/IHhtbEFyclswXSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge0NhbGVuZGFyT3B0aW9uc30gb3B0aW9ucyBPcHRpb25zIHRvIHByb3ZpZGUgZm9yIGNhbGVuZGFyIG1ldGhvZC4gQW4gaW50ZXJ2YWwgaXMgcmVxdWlyZWQuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPENhbGVuZGFyPn0gUmV0dXJucyBhIENhbGVuZGFyIG9iamVjdFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogYGBganNcbiAgICogY2xpZW50LmNhbGVuZGFyKHsgaW50ZXJ2YWw6IHsgc3RhcnQ6IG5ldyBEYXRlKCc1LzEvMjAyMicpLCBlbmQ6IG5ldyBEYXRlKCc4LzEvMjAyMScpIH0sIGNvbmN1cnJlbmN5OiBudWxsIH0pOyAvLyAtPiBMaW1pdGxlc3MgY29uY3VycmVuY3kgKG5vdCByZWNvbW1lbmRlZClcbiAgICpcbiAgICogY29uc3QgY2FsZW5kYXIgPSBhd2FpdCBjbGllbnQuY2FsZW5kYXIoeyBpbnRlcnZhbDogeyAuLi4gfX0pO1xuICAgKiBjb25zb2xlLmxvZyhjYWxlbmRhcik7IC8vIC0+IHsgc2Nob29sRGF0ZTogey4uLn0sIG91dHB1dFJhbmdlOiB7Li4ufSwgZXZlbnRzOiBbLi4uXSB9XG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIGFzeW5jIGNhbGVuZGFyKG9wdGlvbnM6IENhbGVuZGFyT3B0aW9ucyA9IHt9KTogUHJvbWlzZTxDYWxlbmRhcj4ge1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBDYWxlbmRhck9wdGlvbnMgPSB7XG4gICAgICBjb25jdXJyZW5jeTogNyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcbiAgICBjb25zdCBjYWwgPSBhd2FpdCBjYWNoZS5tZW1vKCgpID0+IHRoaXMuZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChuZXcgRGF0ZSgpKSk7XG4gICAgY29uc3Qgc2Nob29sRW5kRGF0ZTogRGF0ZSB8IG51bWJlciA9XG4gICAgICBvcHRpb25zLmludGVydmFsPy5lbmQgPz8gbmV3IERhdGUoY2FsLkNhbGVuZGFyTGlzdGluZ1swXVsnQF9TY2hvb2xFbmREYXRlJ11bMF0pO1xuICAgIGNvbnN0IHNjaG9vbFN0YXJ0RGF0ZTogRGF0ZSB8IG51bWJlciA9XG4gICAgICBvcHRpb25zLmludGVydmFsPy5zdGFydCA/PyBuZXcgRGF0ZShjYWwuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEJlZ0RhdGUnXVswXSk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBjb25zdCBtb250aHNXaXRoaW5TY2hvb2xZZWFyID0gZWFjaE1vbnRoT2ZJbnRlcnZhbCh7IHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsIGVuZDogc2Nob29sRW5kRGF0ZSB9KTtcbiAgICAgIGNvbnN0IGdldEFsbEV2ZW50c1dpdGhpblNjaG9vbFllYXIgPSAoKTogUHJvbWlzZTxDYWxlbmRhclhNTE9iamVjdFtdPiA9PlxuICAgICAgICBkZWZhdWx0T3B0aW9ucy5jb25jdXJyZW5jeSA9PSBudWxsXG4gICAgICAgICAgPyBQcm9taXNlLmFsbChtb250aHNXaXRoaW5TY2hvb2xZZWFyLm1hcCgoZGF0ZSkgPT4gdGhpcy5mZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGUpKSlcbiAgICAgICAgICA6IGFzeW5jUG9vbEFsbChkZWZhdWx0T3B0aW9ucy5jb25jdXJyZW5jeSwgbW9udGhzV2l0aGluU2Nob29sWWVhciwgKGRhdGUpID0+XG4gICAgICAgICAgICAgIHRoaXMuZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlKVxuICAgICAgICAgICAgKTtcbiAgICAgIGxldCBtZW1vOiBDYWxlbmRhciB8IG51bGwgPSBudWxsO1xuICAgICAgZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhcigpXG4gICAgICAgIC50aGVuKChldmVudHMpID0+IHtcbiAgICAgICAgICBjb25zdCBhbGxFdmVudHMgPSBldmVudHMucmVkdWNlKChwcmV2LCBldmVudHMpID0+IHtcbiAgICAgICAgICAgIGlmIChtZW1vID09IG51bGwpXG4gICAgICAgICAgICAgIG1lbW8gPSB7XG4gICAgICAgICAgICAgICAgc2Nob29sRGF0ZToge1xuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF1bJ0BfU2Nob29sQmVnRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXVsnQF9TY2hvb2xFbmREYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3V0cHV0UmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBzY2hvb2xTdGFydERhdGUsXG4gICAgICAgICAgICAgICAgICBlbmQ6IHNjaG9vbEVuZERhdGUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBldmVudHM6IFtdLFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgcmVzdDogQ2FsZW5kYXIgPSB7XG4gICAgICAgICAgICAgIC4uLm1lbW8sIC8vIFRoaXMgaXMgdG8gcHJldmVudCByZS1pbml0aWFsaXppbmcgRGF0ZSBvYmplY3RzIGluIG9yZGVyIHRvIGltcHJvdmUgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgICAgZXZlbnRzOiBbXG4gICAgICAgICAgICAgICAgLi4uKHByZXYuZXZlbnRzID8gcHJldi5ldmVudHMgOiBbXSksXG4gICAgICAgICAgICAgICAgLi4uKHR5cGVvZiBldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdLkV2ZW50TGlzdHNbMF0gIT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICA/IChldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdLkV2ZW50TGlzdHNbMF0uRXZlbnRMaXN0Lm1hcCgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50WydAX0RheVR5cGUnXVswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuQVNTSUdOTUVOVDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3NpZ25tZW50RXZlbnQgPSBldmVudCBhcyBBc3NpZ25tZW50RXZlbnRYTUxPYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGRlY29kZVVSSShhc3NpZ25tZW50RXZlbnRbJ0BfVGl0bGUnXVswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkTGlua0RhdGE6IGFzc2lnbm1lbnRFdmVudFsnQF9BZGRMaW5rRGF0YSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFndTogYXNzaWdubWVudEV2ZW50WydAX0FHVSddID8gYXNzaWdubWVudEV2ZW50WydAX0FHVSddWzBdIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGFzc2lnbm1lbnRFdmVudFsnQF9EYXRlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRndTogYXNzaWdubWVudEV2ZW50WydAX0RHVSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGFzc2lnbm1lbnRFdmVudFsnQF9MaW5rJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBhc3NpZ25tZW50RXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogRXZlbnRUeXBlLkFTU0lHTk1FTlQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld1R5cGU6IGFzc2lnbm1lbnRFdmVudFsnQF9WaWV3VHlwZSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIEFzc2lnbm1lbnRFdmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLkhPTElEQVk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZGVjb2RlVVJJKGV2ZW50WydAX1RpdGxlJ11bMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEV2ZW50VHlwZS5IT0xJREFZLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogZXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZXZlbnRbJ0BfRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBIb2xpZGF5RXZlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5SRUdVTEFSOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlZ3VsYXJFdmVudCA9IGV2ZW50IGFzIFJlZ3VsYXJFdmVudFhNTE9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZGVjb2RlVVJJKHJlZ3VsYXJFdmVudFsnQF9UaXRsZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZ3U6IHJlZ3VsYXJFdmVudFsnQF9BR1UnXSA/IHJlZ3VsYXJFdmVudFsnQF9BR1UnXVswXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShyZWd1bGFyRXZlbnRbJ0BfRGF0ZSddWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogcmVndWxhckV2ZW50WydAX0V2dERlc2NyaXB0aW9uJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcmVndWxhckV2ZW50WydAX0V2dERlc2NyaXB0aW9uJ11bMF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRndTogcmVndWxhckV2ZW50WydAX0RHVSddID8gcmVndWxhckV2ZW50WydAX0RHVSddWzBdIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6IHJlZ3VsYXJFdmVudFsnQF9MaW5rJ10gPyByZWd1bGFyRXZlbnRbJ0BfTGluayddWzBdIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogcmVndWxhckV2ZW50WydAX1N0YXJ0VGltZSddWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEV2ZW50VHlwZS5SRUdVTEFSLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdUeXBlOiByZWd1bGFyRXZlbnRbJ0BfVmlld1R5cGUnXSA/IHJlZ3VsYXJFdmVudFsnQF9WaWV3VHlwZSddWzBdIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZExpbmtEYXRhOiByZWd1bGFyRXZlbnRbJ0BfQWRkTGlua0RhdGEnXSA/IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddWzBdIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFJlZ3VsYXJFdmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pIGFzIEV2ZW50W10pXG4gICAgICAgICAgICAgICAgICA6IFtdKSxcbiAgICAgICAgICAgICAgXSBhcyBFdmVudFtdLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgICAgfSwge30gYXMgQ2FsZW5kYXIpO1xuICAgICAgICAgIHJlcyh7IC4uLmFsbEV2ZW50cywgZXZlbnRzOiBfLnVuaXFCeShhbGxFdmVudHMuZXZlbnRzLCAoaXRlbSkgPT4gaXRlbS50aXRsZSkgfSBhcyBDYWxlbmRhcik7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChyZWopO1xuICAgIH0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE0QkEsZUFBZUEsWUFBWSxDQUN6QkMsU0FBaUIsRUFDakJDLEtBQW9CLEVBQ3BCQyxVQUEyQyxFQUMzQztJQUNBLE1BQU1DLE9BQU8sR0FBRyxFQUFFO0lBQ2xCLFdBQVcsTUFBTUMsTUFBTSxJQUFJLElBQUFDLHNCQUFTLEVBQUNMLFNBQVMsRUFBRUMsS0FBSyxFQUFFQyxVQUFVLENBQUMsRUFBRTtNQUNsRUMsT0FBTyxDQUFDRyxJQUFJLENBQUNGLE1BQU0sQ0FBQztJQUN0QjtJQUNBLE9BQU9ELE9BQU87RUFDaEI7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNlLE1BQU1JLE1BQU0sU0FBU0MsYUFBSSxDQUFDRCxNQUFNLENBQUM7SUFFOUNFLFdBQVcsQ0FBQ0MsV0FBNkIsRUFBRUMsT0FBZSxFQUFFO01BQzFELEtBQUssQ0FBQ0QsV0FBVyxDQUFDO01BQ2xCLElBQUksQ0FBQ0MsT0FBTyxHQUFHQSxPQUFPO0lBQ3hCOztJQUVBO0FBQ0Y7QUFDQTtJQUNTQyxtQkFBbUIsR0FBa0I7TUFDMUMsT0FBTyxJQUFJQyxPQUFPLENBQUMsQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEtBQUs7UUFDL0IsS0FBSyxDQUNGQyxjQUFjLENBQXFCO1VBQUVDLFVBQVUsRUFBRSxZQUFZO1VBQUVDLGNBQWMsRUFBRTtRQUFNLENBQUMsQ0FBQyxDQUN2RkMsSUFBSSxDQUFFQyxRQUFR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