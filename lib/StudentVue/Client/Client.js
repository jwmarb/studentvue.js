(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/soap/soap", "../Message/Message", "date-fns", "../../Constants/EventType", "lodash", "../../Constants/ResourceType", "../ReportCard/ReportCard", "../Document/Document", "../RequestException/RequestException", "../../utils/XMLFactory/XMLFactory", "../../utils/cache/cache", "./Client.helpers"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/soap/soap"), require("../Message/Message"), require("date-fns"), require("../../Constants/EventType"), require("lodash"), require("../../Constants/ResourceType"), require("../ReportCard/ReportCard"), require("../Document/Document"), require("../RequestException/RequestException"), require("../../utils/XMLFactory/XMLFactory"), require("../../utils/cache/cache"), require("./Client.helpers"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.soap, global.Message, global.dateFns, global.EventType, global.lodash, global.ResourceType, global.ReportCard, global.Document, global.RequestException, global.XMLFactory, global.cache, global.Client);
    global.Client = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _soap, _Message, _dateFns, _EventType, _lodash, _ResourceType, _ReportCard, _Document, _RequestException, _XMLFactory, _cache, _Client) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _soap = _interopRequireDefault(_soap);
  _Message = _interopRequireDefault(_Message);
  _EventType = _interopRequireDefault(_EventType);
  _lodash = _interopRequireDefault(_lodash);
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
            track: (0, _Client.optional)(xmlObjectData.StudentInfo[0].Track),
            address: (0, _Client.optional)(xmlObjectData.StudentInfo[0].Address),
            photo: (0, _Client.optional)(xmlObjectData.StudentInfo[0].Photo),
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
            id: (0, _Client.optional)(xmlObjectData.StudentInfo[0].PermID),
            orgYearGu: (0, _Client.optional)(xmlObjectData.StudentInfo[0].OrgYearGU),
            phone: (0, _Client.optional)(xmlObjectData.StudentInfo[0].Phone),
            email: (0, _Client.optional)(xmlObjectData.StudentInfo[0].EMail),
            emergencyContacts: xmlObjectData.StudentInfo[0].EmergencyContacts ? xmlObjectData.StudentInfo[0].EmergencyContacts[0].EmergencyContact.map(contact => {
              return {
                name: (0, _Client.optional)(contact['@_Name']),
                phone: {
                  home: (0, _Client.optional)(contact['@_HomePhone']),
                  mobile: (0, _Client.optional)(contact['@_MobilePhone']),
                  other: (0, _Client.optional)(contact['@_OtherPhone']),
                  work: (0, _Client.optional)(contact['@_WorkPhone'])
                },
                relationship: (0, _Client.optional)(contact['@_Relationship'])
              };
            }) : [],
            gender: (0, _Client.optional)(xmlObjectData.StudentInfo[0].Gender),
            grade: (0, _Client.optional)(xmlObjectData.StudentInfo[0].Grade),
            lockerInfoRecords: (0, _Client.optional)(xmlObjectData.StudentInfo[0].LockerInfoRecords),
            homeLanguage: (0, _Client.optional)(xmlObjectData.StudentInfo[0].HomeLanguage),
            homeRoom: (0, _Client.optional)(xmlObjectData.StudentInfo[0].HomeRoom),
            homeRoomTeacher: {
              email: (0, _Client.optional)(xmlObjectData.StudentInfo[0].HomeRoomTchEMail),
              name: (0, _Client.optional)(xmlObjectData.StudentInfo[0].HomeRoomTch),
              staffGu: (0, _Client.optional)(xmlObjectData.StudentInfo[0].HomeRoomTchStaffGU)
            },
            additionalInfo: xmlObjectData.StudentInfo[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox ? xmlObjectData.StudentInfo[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox.map(definedBox => {
              return {
                id: (0, _Client.optional)(definedBox['@_GroupBoxID']),
                // string | undefined
                type: definedBox['@_GroupBoxLabel'][0],
                // string
                vcId: (0, _Client.optional)(definedBox['@_VCID']),
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
          })) : (0, _Client.asyncPoolAll)(defaultOptions.concurrency, monthsWithinSchoolYear, date => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDbGllbnQiLCJzb2FwIiwiY29uc3RydWN0b3IiLCJjcmVkZW50aWFscyIsImhvc3RVcmwiLCJ2YWxpZGF0ZUNyZWRlbnRpYWxzIiwiUHJvbWlzZSIsInJlcyIsInJlaiIsInByb2Nlc3NSZXF1ZXN0IiwibWV0aG9kTmFtZSIsInZhbGlkYXRlRXJyb3JzIiwidGhlbiIsInJlc3BvbnNlIiwiUlRfRVJST1IiLCJSZXF1ZXN0RXhjZXB0aW9uIiwiY2F0Y2giLCJkb2N1bWVudHMiLCJwYXJhbVN0ciIsImNoaWxkSW50SWQiLCJ4bWxPYmplY3QiLCJTdHVkZW50RG9jdW1lbnREYXRhcyIsIlN0dWRlbnREb2N1bWVudERhdGEiLCJ4bWwiLCJEb2N1bWVudCIsInJlcG9ydENhcmRzIiwiUkNSZXBvcnRpbmdQZXJpb2REYXRhIiwiUkNSZXBvcnRpbmdQZXJpb2RzIiwiUkNSZXBvcnRpbmdQZXJpb2QiLCJSZXBvcnRDYXJkIiwic2Nob29sSW5mbyIsImNoaWxkSW50SUQiLCJTdHVkZW50U2Nob29sSW5mb0xpc3RpbmciLCJTdGFmZkxpc3RzIiwiU3RhZmZMaXN0Iiwic3RhZmYiLCJuYW1lIiwiZW1haWwiLCJzdGFmZkd1Iiwiam9iVGl0bGUiLCJleHRuIiwicGhvbmUiLCJzY2hvb2wiLCJhZGRyZXNzIiwiYWRkcmVzc0FsdCIsImNpdHkiLCJ6aXBDb2RlIiwiYWx0UGhvbmUiLCJwcmluY2lwYWwiLCJzY2hlZHVsZSIsInRlcm1JbmRleCIsIlRlcm1JbmRleCIsIlN0dWRlbnRDbGFzc1NjaGVkdWxlIiwiVGVybUxpc3RzIiwiVGVybUxpc3RpbmciLCJ0ZXJtIiwiZGF0ZSIsInN0YXJ0IiwiRGF0ZSIsImVuZCIsImluZGV4IiwiTnVtYmVyIiwic2Nob29sWWVhclRlcm1Db2RlR3UiLCJlcnJvciIsInRvZGF5IiwiVG9kYXlTY2hlZHVsZUluZm9EYXRhIiwiU2Nob29sSW5mb3MiLCJTY2hvb2xJbmZvIiwibWFwIiwiYmVsbFNjaGVkdWxlTmFtZSIsImNsYXNzZXMiLCJDbGFzc2VzIiwiQ2xhc3NJbmZvIiwiY291cnNlIiwicGVyaW9kIiwiYXR0ZW5kYW5jZUNvZGUiLCJBdHRlbmRhbmNlQ29kZSIsInNlY3Rpb25HdSIsInRlYWNoZXIiLCJlbWFpbFN1YmplY3QiLCJ1cmwiLCJ0aW1lIiwicGFyc2UiLCJub3ciLCJDbGFzc0xpc3RzIiwiQ2xhc3NMaXN0aW5nIiwic3R1ZGVudENsYXNzIiwicm9vbSIsInRlcm1zIiwiYXR0ZW5kYW5jZSIsImF0dGVuZGFuY2VYTUxPYmplY3QiLCJBdHRlbmRhbmNlIiwiVG90YWxBY3Rpdml0aWVzIiwiUGVyaW9kVG90YWwiLCJwZCIsImkiLCJ0b3RhbCIsImV4Y3VzZWQiLCJUb3RhbEV4Y3VzZWQiLCJ0YXJkaWVzIiwiVG90YWxUYXJkaWVzIiwidW5leGN1c2VkIiwiVG90YWxVbmV4Y3VzZWQiLCJhY3Rpdml0aWVzIiwidW5leGN1c2VkVGFyZGllcyIsIlRvdGFsVW5leGN1c2VkVGFyZGllcyIsInR5cGUiLCJzY2hvb2xOYW1lIiwiYWJzZW5jZXMiLCJBYnNlbmNlcyIsIkFic2VuY2UiLCJhYnNlbmNlIiwicmVhc29uIiwibm90ZSIsImRlc2NyaXB0aW9uIiwicGVyaW9kcyIsIlBlcmlvZHMiLCJQZXJpb2QiLCJvcmdZZWFyR3UiLCJwZXJpb2RJbmZvcyIsImdyYWRlYm9vayIsInJlcG9ydGluZ1BlcmlvZEluZGV4IiwiUmVwb3J0UGVyaW9kIiwiWE1MRmFjdG9yeSIsImVuY29kZUF0dHJpYnV0ZSIsInRvU3RyaW5nIiwiR3JhZGVib29rIiwiUmVwb3J0aW5nUGVyaW9kcyIsIkNvdXJzZXMiLCJDb3Vyc2UiLCJNYXJrcyIsIk1hcmsiLCJtYXJrIiwiY2FsY3VsYXRlZFNjb3JlIiwic3RyaW5nIiwicmF3Iiwid2VpZ2h0ZWRDYXRlZ29yaWVzIiwiQXNzaWdubWVudEdyYWRlQ2FsYyIsIndlaWdodGVkIiwiY2FsY3VsYXRlZE1hcmsiLCJ3ZWlnaHQiLCJldmFsdWF0ZWQiLCJzdGFuZGFyZCIsInBvaW50cyIsImN1cnJlbnQiLCJwb3NzaWJsZSIsImFzc2lnbm1lbnRzIiwiQXNzaWdubWVudHMiLCJBc3NpZ25tZW50IiwiYXNzaWdubWVudCIsImdyYWRlYm9va0lkIiwiZGVjb2RlVVJJIiwiZHVlIiwic2NvcmUiLCJ2YWx1ZSIsIm5vdGVzIiwidGVhY2hlcklkIiwiaGFzRHJvcGJveCIsIkpTT04iLCJzdHVkZW50SWQiLCJkcm9wYm94RGF0ZSIsInJlc291cmNlcyIsIlJlc291cmNlcyIsIlJlc291cmNlIiwicnNyYyIsImZpbGVSc3JjIiwiUmVzb3VyY2VUeXBlIiwiRklMRSIsImZpbGUiLCJ1cmkiLCJyZXNvdXJjZSIsImlkIiwidXJsUnNyYyIsIlVSTCIsInBhdGgiLCJ0aXRsZSIsIm1hcmtzIiwicmVwb3J0aW5nUGVyaW9kIiwiZmluZCIsIngiLCJSZXBvcnRpbmdQZXJpb2QiLCJhdmFpbGFibGUiLCJjb3Vyc2VzIiwibWVzc2FnZXMiLCJQWFBNZXNzYWdlc0RhdGEiLCJNZXNzYWdlTGlzdGluZ3MiLCJNZXNzYWdlTGlzdGluZyIsIm1lc3NhZ2UiLCJNZXNzYWdlIiwic3R1ZGVudEluZm8iLCJ4bWxPYmplY3REYXRhIiwic3R1ZGVudCIsIlN0dWRlbnRJbmZvIiwiRm9ybWF0dGVkTmFtZSIsImxhc3ROYW1lIiwiTGFzdE5hbWVHb2VzQnkiLCJuaWNrbmFtZSIsIk5pY2tOYW1lIiwiYmlydGhEYXRlIiwiQmlydGhEYXRlIiwidHJhY2siLCJvcHRpb25hbCIsIlRyYWNrIiwiQWRkcmVzcyIsInBob3RvIiwiUGhvdG8iLCJjb3Vuc2Vsb3IiLCJDb3Vuc2Vsb3JOYW1lIiwiQ291bnNlbG9yRW1haWwiLCJDb3Vuc2Vsb3JTdGFmZkdVIiwidW5kZWZpbmVkIiwiY3VycmVudFNjaG9vbCIsIkN1cnJlbnRTY2hvb2wiLCJkZW50aXN0IiwiRGVudGlzdCIsIm9mZmljZSIsInBoeXNpY2lhbiIsIlBoeXNpY2lhbiIsImhvc3BpdGFsIiwiUGVybUlEIiwiT3JnWWVhckdVIiwiUGhvbmUiLCJFTWFpbCIsImVtZXJnZW5jeUNvbnRhY3RzIiwiRW1lcmdlbmN5Q29udGFjdHMiLCJFbWVyZ2VuY3lDb250YWN0IiwiY29udGFjdCIsImhvbWUiLCJtb2JpbGUiLCJvdGhlciIsIndvcmsiLCJyZWxhdGlvbnNoaXAiLCJnZW5kZXIiLCJHZW5kZXIiLCJncmFkZSIsIkdyYWRlIiwibG9ja2VySW5mb1JlY29yZHMiLCJMb2NrZXJJbmZvUmVjb3JkcyIsImhvbWVMYW5ndWFnZSIsIkhvbWVMYW5ndWFnZSIsImhvbWVSb29tIiwiSG9tZVJvb20iLCJob21lUm9vbVRlYWNoZXIiLCJIb21lUm9vbVRjaEVNYWlsIiwiSG9tZVJvb21UY2giLCJIb21lUm9vbVRjaFN0YWZmR1UiLCJhZGRpdGlvbmFsSW5mbyIsIlVzZXJEZWZpbmVkR3JvdXBCb3hlcyIsIlVzZXJEZWZpbmVkR3JvdXBCb3giLCJkZWZpbmVkQm94IiwidmNJZCIsIml0ZW1zIiwiVXNlckRlZmluZWRJdGVtcyIsIlVzZXJEZWZpbmVkSXRlbSIsIml0ZW0iLCJzb3VyY2UiLCJlbGVtZW50Iiwib2JqZWN0IiwiZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbCIsIlJlcXVlc3REYXRlIiwidG9JU09TdHJpbmciLCJjYWxlbmRhciIsIm9wdGlvbnMiLCJkZWZhdWx0T3B0aW9ucyIsImNvbmN1cnJlbmN5IiwiY2FsIiwiY2FjaGUiLCJtZW1vIiwic2Nob29sRW5kRGF0ZSIsImludGVydmFsIiwiQ2FsZW5kYXJMaXN0aW5nIiwic2Nob29sU3RhcnREYXRlIiwibW9udGhzV2l0aGluU2Nob29sWWVhciIsImVhY2hNb250aE9mSW50ZXJ2YWwiLCJnZXRBbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyIiwiYWxsIiwiYXN5bmNQb29sQWxsIiwiZXZlbnRzIiwiYWxsRXZlbnRzIiwicmVkdWNlIiwicHJldiIsInNjaG9vbERhdGUiLCJvdXRwdXRSYW5nZSIsInJlc3QiLCJFdmVudExpc3RzIiwiRXZlbnRMaXN0IiwiZXZlbnQiLCJFdmVudFR5cGUiLCJBU1NJR05NRU5UIiwiYXNzaWdubWVudEV2ZW50IiwiYWRkTGlua0RhdGEiLCJhZ3UiLCJkZ3UiLCJsaW5rIiwic3RhcnRUaW1lIiwidmlld1R5cGUiLCJIT0xJREFZIiwiUkVHVUxBUiIsInJlZ3VsYXJFdmVudCIsIl8iLCJ1bmlxQnkiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvU3R1ZGVudFZ1ZS9DbGllbnQvQ2xpZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2luQ3JlZGVudGlhbHMsIFBhcnNlZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHNvYXAgZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9zb2FwJztcclxuaW1wb3J0IHsgQWRkaXRpb25hbEluZm8sIEFkZGl0aW9uYWxJbmZvSXRlbSwgQ2xhc3NTY2hlZHVsZUluZm8sIFNjaG9vbEluZm8sIFN0dWRlbnRJbmZvIH0gZnJvbSAnLi9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFN0dWRlbnRJbmZvWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9TdHVkZW50SW5mbyc7XHJcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4uL01lc3NhZ2UvTWVzc2FnZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VYTUxPYmplY3QgfSBmcm9tICcuLi9NZXNzYWdlL01lc3NhZ2UueG1sJztcclxuaW1wb3J0IHsgQXNzaWdubWVudEV2ZW50WE1MT2JqZWN0LCBDYWxlbmRhclhNTE9iamVjdCwgUmVndWxhckV2ZW50WE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9DYWxlbmRhcic7XHJcbmltcG9ydCB7IEFzc2lnbm1lbnRFdmVudCwgQ2FsZW5kYXIsIENhbGVuZGFyT3B0aW9ucywgRXZlbnQsIEhvbGlkYXlFdmVudCwgUmVndWxhckV2ZW50IH0gZnJvbSAnLi9JbnRlcmZhY2VzL0NhbGVuZGFyJztcclxuaW1wb3J0IHsgZWFjaE1vbnRoT2ZJbnRlcnZhbCwgcGFyc2UgfSBmcm9tICdkYXRlLWZucyc7XHJcbmltcG9ydCB7IEZpbGVSZXNvdXJjZVhNTE9iamVjdCwgR3JhZGVib29rWE1MT2JqZWN0LCBVUkxSZXNvdXJjZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvR3JhZGVib29rJztcclxuaW1wb3J0IHsgQXR0ZW5kYW5jZVhNTE9iamVjdCB9IGZyb20gJy4vSW50ZXJmYWNlcy94bWwvQXR0ZW5kYW5jZSc7XHJcbmltcG9ydCBFdmVudFR5cGUgZnJvbSAnLi4vLi4vQ29uc3RhbnRzL0V2ZW50VHlwZSc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IEFzc2lnbm1lbnQsIEZpbGVSZXNvdXJjZSwgR3JhZGVib29rLCBNYXJrLCBVUkxSZXNvdXJjZSwgV2VpZ2h0ZWRDYXRlZ29yeSB9IGZyb20gJy4vSW50ZXJmYWNlcy9HcmFkZWJvb2snO1xyXG5pbXBvcnQgUmVzb3VyY2VUeXBlIGZyb20gJy4uLy4uL0NvbnN0YW50cy9SZXNvdXJjZVR5cGUnO1xyXG5pbXBvcnQgeyBBYnNlbnRQZXJpb2QsIEF0dGVuZGFuY2UsIFBlcmlvZEluZm8gfSBmcm9tICcuL0ludGVyZmFjZXMvQXR0ZW5kYW5jZSc7XHJcbmltcG9ydCB7IFNjaGVkdWxlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9TY2hlZHVsZSc7XHJcbmltcG9ydCB7IFNjaGVkdWxlIH0gZnJvbSAnLi9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFNjaG9vbEluZm9YTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1NjaG9vbEluZm8nO1xyXG5pbXBvcnQgeyBSZXBvcnRDYXJkc1hNTE9iamVjdCB9IGZyb20gJy4uL1JlcG9ydENhcmQvUmVwb3J0Q2FyZC54bWwnO1xyXG5pbXBvcnQgeyBEb2N1bWVudFhNTE9iamVjdCB9IGZyb20gJy4uL0RvY3VtZW50L0RvY3VtZW50LnhtbCc7XHJcbmltcG9ydCBSZXBvcnRDYXJkIGZyb20gJy4uL1JlcG9ydENhcmQvUmVwb3J0Q2FyZCc7XHJcbmltcG9ydCBEb2N1bWVudCBmcm9tICcuLi9Eb2N1bWVudC9Eb2N1bWVudCc7XHJcbmltcG9ydCBSZXF1ZXN0RXhjZXB0aW9uIGZyb20gJy4uL1JlcXVlc3RFeGNlcHRpb24vUmVxdWVzdEV4Y2VwdGlvbic7XHJcbmltcG9ydCBYTUxGYWN0b3J5IGZyb20gJy4uLy4uL3V0aWxzL1hNTEZhY3RvcnkvWE1MRmFjdG9yeSc7XHJcbmltcG9ydCBjYWNoZSBmcm9tICcuLi8uLi91dGlscy9jYWNoZS9jYWNoZSc7XHJcbmltcG9ydCB7IG9wdGlvbmFsLCBhc3luY1Bvb2xBbGwgfSBmcm9tICcuL0NsaWVudC5oZWxwZXJzJztcclxuXHJcbi8qKlxyXG4gKiBUaGUgU3R1ZGVudFZVRSBDbGllbnQgdG8gYWNjZXNzIHRoZSBBUElcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBleHRlbmRzIHtzb2FwLkNsaWVudH1cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCBleHRlbmRzIHNvYXAuQ2xpZW50IHtcclxuICBwcml2YXRlIGhvc3RVcmw6IHN0cmluZztcclxuICBjb25zdHJ1Y3RvcihjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFscywgaG9zdFVybDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihjcmVkZW50aWFscyk7XHJcbiAgICB0aGlzLmhvc3RVcmwgPSBob3N0VXJsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVmFsaWRhdGUncyB0aGUgdXNlcidzIGNyZWRlbnRpYWxzLiBJdCB3aWxsIHRocm93IGFuIGVycm9yIGlmIGNyZWRlbnRpYWxzIGFyZSBpbmNvcnJlY3RcclxuICAgKi9cclxuICBwdWJsaWMgdmFsaWRhdGVDcmVkZW50aWFscygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8UGFyc2VkUmVxdWVzdEVycm9yPih7IG1ldGhvZE5hbWU6ICdsb2dpbiB0ZXN0JywgdmFsaWRhdGVFcnJvcnM6IGZhbHNlIH0pXHJcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uc2UuUlRfRVJST1JbMF1bJ0BfRVJST1JfTUVTU0FHRSddWzBdID09PSAnbG9naW4gdGVzdCBpcyBub3QgYSB2YWxpZCBtZXRob2QuJykgcmVzKCk7XHJcbiAgICAgICAgICBlbHNlIHJlaihuZXcgUmVxdWVzdEV4Y2VwdGlvbihyZXNwb25zZSkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHN0dWRlbnQncyBkb2N1bWVudHMgZnJvbSBzeW5lcmd5IHNlcnZlcnNcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxEb2N1bWVudFtdPn0+IFJldHVybnMgYSBsaXN0IG9mIHN0dWRlbnQgZG9jdW1lbnRzXHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBkb2N1bWVudHMgPSBhd2FpdCBjbGllbnQuZG9jdW1lbnRzKCk7XHJcbiAgICogY29uc3QgZG9jdW1lbnQgPSBkb2N1bWVudHNbMF07XHJcbiAgICogY29uc3QgZmlsZXMgPSBhd2FpdCBkb2N1bWVudC5nZXQoKTtcclxuICAgKiBjb25zdCBiYXNlNjRjb2xsZWN0aW9uID0gZmlsZXMubWFwKChmaWxlKSA9PiBmaWxlLmJhc2U2NCk7XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIGRvY3VtZW50cygpOiBQcm9taXNlPERvY3VtZW50W10+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8RG9jdW1lbnRYTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRTdHVkZW50RG9jdW1lbnRJbml0aWFsRGF0YScsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICByZXMoXHJcbiAgICAgICAgICAgIHhtbE9iamVjdFsnU3R1ZGVudERvY3VtZW50cyddWzBdLlN0dWRlbnREb2N1bWVudERhdGFzWzBdLlN0dWRlbnREb2N1bWVudERhdGEubWFwKFxyXG4gICAgICAgICAgICAgICh4bWwpID0+IG5ldyBEb2N1bWVudCh4bWwsIHN1cGVyLmNyZWRlbnRpYWxzKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgYSBsaXN0IG9mIHJlcG9ydCBjYXJkc1xyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFJlcG9ydENhcmRbXT59IFJldHVybnMgYSBsaXN0IG9mIHJlcG9ydCBjYXJkcyB0aGF0IGNhbiBmZXRjaCBhIGZpbGVcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IHJlcG9ydENhcmRzID0gYXdhaXQgY2xpZW50LnJlcG9ydENhcmRzKCk7XHJcbiAgICogY29uc3QgZmlsZXMgPSBhd2FpdCBQcm9taXNlLmFsbChyZXBvcnRDYXJkcy5tYXAoKGNhcmQpID0+IGNhcmQuZ2V0KCkpKTtcclxuICAgKiBjb25zdCBiYXNlNjRhcnIgPSBmaWxlcy5tYXAoKGZpbGUpID0+IGZpbGUuYmFzZTY0KTsgLy8gW1wiSlZCRVJpMC4uLlwiLCBcImRVSW9hMS4uLlwiLCAuLi5dO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyByZXBvcnRDYXJkcygpOiBQcm9taXNlPFJlcG9ydENhcmRbXT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxSZXBvcnRDYXJkc1hNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0dldFJlcG9ydENhcmRJbml0aWFsRGF0YScsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICByZXMoXHJcbiAgICAgICAgICAgIHhtbE9iamVjdC5SQ1JlcG9ydGluZ1BlcmlvZERhdGFbMF0uUkNSZXBvcnRpbmdQZXJpb2RzWzBdLlJDUmVwb3J0aW5nUGVyaW9kLm1hcChcclxuICAgICAgICAgICAgICAoeG1sKSA9PiBuZXcgUmVwb3J0Q2FyZCh4bWwsIHN1cGVyLmNyZWRlbnRpYWxzKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHN0dWRlbnQncyBzY2hvb2wncyBpbmZvcm1hdGlvblxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFNjaG9vbEluZm8+fSBSZXR1cm5zIHRoZSBpbmZvcm1hdGlvbiBvZiB0aGUgc3R1ZGVudCdzIHNjaG9vbFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogYXdhaXQgY2xpZW50LnNjaG9vbEluZm8oKTtcclxuICAgKlxyXG4gICAqIGNsaWVudC5zY2hvb2xJbmZvKCkudGhlbigoc2Nob29sSW5mbykgPT4ge1xyXG4gICAqICBjb25zb2xlLmxvZyhfLnVuaXEoc2Nob29sSW5mby5zdGFmZi5tYXAoKHN0YWZmKSA9PiBzdGFmZi5uYW1lKSkpOyAvLyBMaXN0IGFsbCBzdGFmZiBwb3NpdGlvbnMgdXNpbmcgbG9kYXNoXHJcbiAgICogfSlcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc2Nob29sSW5mbygpOiBQcm9taXNlPFNjaG9vbEluZm8+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8U2Nob29sSW5mb1hNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRTY2hvb2xJbmZvJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SUQ6IDAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCh7IFN0dWRlbnRTY2hvb2xJbmZvTGlzdGluZzogW3htbE9iamVjdF0gfSkgPT4ge1xyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgc2Nob29sOiB7XHJcbiAgICAgICAgICAgICAgYWRkcmVzczogeG1sT2JqZWN0WydAX1NjaG9vbEFkZHJlc3MnXVswXSxcclxuICAgICAgICAgICAgICBhZGRyZXNzQWx0OiB4bWxPYmplY3RbJ0BfU2Nob29sQWRkcmVzczInXVswXSxcclxuICAgICAgICAgICAgICBjaXR5OiB4bWxPYmplY3RbJ0BfU2Nob29sQ2l0eSddWzBdLFxyXG4gICAgICAgICAgICAgIHppcENvZGU6IHhtbE9iamVjdFsnQF9TY2hvb2xaaXAnXVswXSxcclxuICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0WydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgYWx0UGhvbmU6IHhtbE9iamVjdFsnQF9QaG9uZTInXVswXSxcclxuICAgICAgICAgICAgICBwcmluY2lwYWw6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdFsnQF9QcmluY2lwYWwnXVswXSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsRW1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgIHN0YWZmR3U6IHhtbE9iamVjdFsnQF9QcmluY2lwYWxHdSddWzBdLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0YWZmOiB4bWxPYmplY3QuU3RhZmZMaXN0c1swXS5TdGFmZkxpc3QubWFwKChzdGFmZikgPT4gKHtcclxuICAgICAgICAgICAgICBuYW1lOiBzdGFmZlsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgZW1haWw6IHN0YWZmWydAX0VNYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgc3RhZmZHdTogc3RhZmZbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgIGpvYlRpdGxlOiBzdGFmZlsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgIGV4dG46IHN0YWZmWydAX0V4dG4nXVswXSxcclxuICAgICAgICAgICAgICBwaG9uZTogc3RhZmZbJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgc2NoZWR1bGUgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcGFyYW0ge251bWJlcn0gdGVybUluZGV4IFRoZSBpbmRleCBvZiB0aGUgdGVybS5cclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTY2hlZHVsZT59IFJldHVybnMgdGhlIHNjaGVkdWxlIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBhd2FpdCBzY2hlZHVsZSgwKSAvLyAtPiB7IHRlcm06IHsgaW5kZXg6IDAsIG5hbWU6ICcxc3QgUXRyIFByb2dyZXNzJyB9LCAuLi4gfVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzY2hlZHVsZSh0ZXJtSW5kZXg/OiBudW1iZXIpOiBQcm9taXNlPFNjaGVkdWxlPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFNjaGVkdWxlWE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudENsYXNzTGlzdCcsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwLCAuLi4odGVybUluZGV4ICE9IG51bGwgPyB7IFRlcm1JbmRleDogdGVybUluZGV4IH0gOiB7fSkgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIHRlcm06IHtcclxuICAgICAgICAgICAgICBpbmRleDogTnVtYmVyKHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9UZXJtSW5kZXgnXVswXSksXHJcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdWydAX1Rlcm1JbmRleE5hbWUnXVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9FcnJvck1lc3NhZ2UnXVswXSxcclxuICAgICAgICAgICAgdG9kYXk6XHJcbiAgICAgICAgICAgICAgdHlwZW9mIHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5Ub2RheVNjaGVkdWxlSW5mb0RhdGFbMF0uU2Nob29sSW5mb3NbMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICA/IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5Ub2RheVNjaGVkdWxlSW5mb0RhdGFbMF0uU2Nob29sSW5mb3NbMF0uU2Nob29sSW5mby5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgKHNjaG9vbCkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNjaG9vbFsnQF9TY2hvb2xOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBiZWxsU2NoZWR1bGVOYW1lOiBzY2hvb2xbJ0BfQmVsbFNjaGVkTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NlczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHNjaG9vbC5DbGFzc2VzWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gc2Nob29sLkNsYXNzZXNbMF0uQ2xhc3NJbmZvLm1hcDxDbGFzc1NjaGVkdWxlSW5mbz4oKGNvdXJzZSkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIoY291cnNlWydAX1BlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ZW5kYW5jZUNvZGU6IGNvdXJzZS5BdHRlbmRhbmNlQ29kZVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShjb3Vyc2VbJ0BfU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoY291cnNlWydAX0VuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9DbGFzc05hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VjdGlvbkd1OiBjb3Vyc2VbJ0BfU2VjdGlvbkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlYWNoZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogY291cnNlWydAX1RlYWNoZXJFbWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsU3ViamVjdDogY291cnNlWydAX0VtYWlsU3ViamVjdCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9UZWFjaGVyTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IGNvdXJzZVsnQF9TdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBjb3Vyc2VbJ0BfVGVhY2hlclVSTCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGNvdXJzZVsnQF9DbGFzc1VSTCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHBhcnNlKGNvdXJzZVsnQF9TdGFydFRpbWUnXVswXSwgJ2hoOm1tIGEnLCBEYXRlLm5vdygpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IHBhcnNlKGNvdXJzZVsnQF9FbmRUaW1lJ11bMF0sICdoaDptbSBhJywgRGF0ZS5ub3coKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgIGNsYXNzZXM6XHJcbiAgICAgICAgICAgICAgdHlwZW9mIHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5DbGFzc0xpc3RzWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgPyB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uQ2xhc3NMaXN0c1swXS5DbGFzc0xpc3RpbmcubWFwKChzdHVkZW50Q2xhc3MpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc3R1ZGVudENsYXNzWydAX0NvdXJzZVRpdGxlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIoc3R1ZGVudENsYXNzWydAX1BlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICByb29tOiBzdHVkZW50Q2xhc3NbJ0BfUm9vbU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICBzZWN0aW9uR3U6IHN0dWRlbnRDbGFzc1snQF9TZWN0aW9uR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0ZWFjaGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdHVkZW50Q2xhc3NbJ0BfVGVhY2hlciddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZW1haWw6IHN0dWRlbnRDbGFzc1snQF9UZWFjaGVyRW1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IHN0dWRlbnRDbGFzc1snQF9UZWFjaGVyU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgdGVybXM6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5UZXJtTGlzdHNbMF0uVGVybUxpc3RpbmcubWFwKCh0ZXJtKSA9PiAoe1xyXG4gICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh0ZXJtWydAX0JlZ2luRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUodGVybVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcih0ZXJtWydAX1Rlcm1JbmRleCddWzBdKSxcclxuICAgICAgICAgICAgICBuYW1lOiB0ZXJtWydAX1Rlcm1OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgc2Nob29sWWVhclRlcm1Db2RlR3U6IHRlcm1bJ0BfU2Nob29sWWVhclRybUNvZGVHVSddWzBdLFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBhdHRlbmRhbmNlIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQHJldHVybnMge1Byb21pc2U8QXR0ZW5kYW5jZT59IFJldHVybnMgYW4gQXR0ZW5kYW5jZSBvYmplY3RcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNsaWVudC5hdHRlbmRhbmNlKClcclxuICAgKiAgLnRoZW4oY29uc29sZS5sb2cpOyAvLyAtPiB7IHR5cGU6ICdQZXJpb2QnLCBwZXJpb2Q6IHsuLi59LCBzY2hvb2xOYW1lOiAnVW5pdmVyc2l0eSBIaWdoIFNjaG9vbCcsIGFic2VuY2VzOiBbLi4uXSwgcGVyaW9kSW5mb3M6IFsuLi5dIH1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgYXR0ZW5kYW5jZSgpOiBQcm9taXNlPEF0dGVuZGFuY2U+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8QXR0ZW5kYW5jZVhNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ0F0dGVuZGFuY2UnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHtcclxuICAgICAgICAgICAgY2hpbGRJbnRJZDogMCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoYXR0ZW5kYW5jZVhNTE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgeG1sT2JqZWN0ID0gYXR0ZW5kYW5jZVhNTE9iamVjdC5BdHRlbmRhbmNlWzBdO1xyXG5cclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIHR5cGU6IHhtbE9iamVjdFsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgIHBlcmlvZDoge1xyXG4gICAgICAgICAgICAgIHRvdGFsOiBOdW1iZXIoeG1sT2JqZWN0WydAX1BlcmlvZENvdW50J11bMF0pLFxyXG4gICAgICAgICAgICAgIHN0YXJ0OiBOdW1iZXIoeG1sT2JqZWN0WydAX1N0YXJ0UGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICAgIGVuZDogTnVtYmVyKHhtbE9iamVjdFsnQF9FbmRQZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNjaG9vbE5hbWU6IHhtbE9iamVjdFsnQF9TY2hvb2xOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgIGFic2VuY2VzOiB4bWxPYmplY3QuQWJzZW5jZXNbMF0uQWJzZW5jZVxyXG4gICAgICAgICAgICAgID8geG1sT2JqZWN0LkFic2VuY2VzWzBdLkFic2VuY2UubWFwKChhYnNlbmNlKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShhYnNlbmNlWydAX0Fic2VuY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICByZWFzb246IGFic2VuY2VbJ0BfUmVhc29uJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIG5vdGU6IGFic2VuY2VbJ0BfTm90ZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYWJzZW5jZVsnQF9Db2RlQWxsRGF5RGVzY3JpcHRpb24nXVswXSxcclxuICAgICAgICAgICAgICAgICAgcGVyaW9kczogYWJzZW5jZS5QZXJpb2RzWzBdLlBlcmlvZC5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgKHBlcmlvZCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKHBlcmlvZFsnQF9OdW1iZXInXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbjogcGVyaW9kWydAX1JlYXNvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3Vyc2U6IHBlcmlvZFsnQF9Db3Vyc2UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhZmY6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfU3RhZmYnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBwZXJpb2RbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBwZXJpb2RbJ0BfU3RhZmZFTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmdZZWFyR3U6IHBlcmlvZFsnQF9PcmdZZWFyR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIH0gYXMgQWJzZW50UGVyaW9kKVxyXG4gICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgcGVyaW9kSW5mb3M6IHhtbE9iamVjdC5Ub3RhbEFjdGl2aXRpZXNbMF0uUGVyaW9kVG90YWwubWFwKChwZCwgaSkgPT4gKHtcclxuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihwZFsnQF9OdW1iZXInXVswXSksXHJcbiAgICAgICAgICAgICAgdG90YWw6IHtcclxuICAgICAgICAgICAgICAgIGV4Y3VzZWQ6IE51bWJlcih4bWxPYmplY3QuVG90YWxFeGN1c2VkWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgdGFyZGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbFRhcmRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgICB1bmV4Y3VzZWQ6IE51bWJlcih4bWxPYmplY3QuVG90YWxVbmV4Y3VzZWRbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsQWN0aXZpdGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICAgIHVuZXhjdXNlZFRhcmRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxVbmV4Y3VzZWRUYXJkaWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pKSBhcyBQZXJpb2RJbmZvW10sXHJcbiAgICAgICAgICB9IGFzIEF0dGVuZGFuY2UpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGdyYWRlYm9vayBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByZXBvcnRpbmdQZXJpb2RJbmRleCBUaGUgdGltZWZyYW1lIHRoYXQgdGhlIGdyYWRlYm9vayBzaG91bGQgcmV0dXJuXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8R3JhZGVib29rPn0gUmV0dXJucyBhIEdyYWRlYm9vayBvYmplY3RcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNvbnN0IGdyYWRlYm9vayA9IGF3YWl0IGNsaWVudC5ncmFkZWJvb2soKTtcclxuICAgKiBjb25zb2xlLmxvZyhncmFkZWJvb2spOyAvLyB7IGVycm9yOiAnJywgdHlwZTogJ1RyYWRpdGlvbmFsJywgcmVwb3J0aW5nUGVyaW9kOiB7Li4ufSwgY291cnNlczogWy4uLl0gfTtcclxuICAgKlxyXG4gICAqIGF3YWl0IGNsaWVudC5ncmFkZWJvb2soMCkgLy8gU29tZSBzY2hvb2xzIHdpbGwgaGF2ZSBSZXBvcnRpbmdQZXJpb2RJbmRleCAwIGFzIFwiMXN0IFF1YXJ0ZXIgUHJvZ3Jlc3NcIlxyXG4gICAqIGF3YWl0IGNsaWVudC5ncmFkZWJvb2soNykgLy8gU29tZSBzY2hvb2xzIHdpbGwgaGF2ZSBSZXBvcnRpbmdQZXJpb2RJbmRleCA3IGFzIFwiNHRoIFF1YXJ0ZXJcIlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBncmFkZWJvb2socmVwb3J0aW5nUGVyaW9kSW5kZXg/OiBudW1iZXIpOiBQcm9taXNlPEdyYWRlYm9vaz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxHcmFkZWJvb2tYTUxPYmplY3Q+KFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBtZXRob2ROYW1lOiAnR3JhZGVib29rJyxcclxuICAgICAgICAgICAgcGFyYW1TdHI6IHtcclxuICAgICAgICAgICAgICBjaGlsZEludElkOiAwLFxyXG4gICAgICAgICAgICAgIC4uLihyZXBvcnRpbmdQZXJpb2RJbmRleCAhPSBudWxsID8geyBSZXBvcnRQZXJpb2Q6IHJlcG9ydGluZ1BlcmlvZEluZGV4IH0gOiB7fSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKHhtbCkgPT5cclxuICAgICAgICAgICAgbmV3IFhNTEZhY3RvcnkoeG1sKVxyXG4gICAgICAgICAgICAgIC5lbmNvZGVBdHRyaWJ1dGUoJ01lYXN1cmVEZXNjcmlwdGlvbicsICdIYXNEcm9wQm94JylcclxuICAgICAgICAgICAgICAuZW5jb2RlQXR0cmlidXRlKCdNZWFzdXJlJywgJ1R5cGUnKVxyXG4gICAgICAgICAgICAgIC50b1N0cmluZygpXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3Q6IEdyYWRlYm9va1hNTE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgZXJyb3I6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfRXJyb3JNZXNzYWdlJ11bMF0sXHJcbiAgICAgICAgICAgIHR5cGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF1bJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgICByZXBvcnRpbmdQZXJpb2Q6IHtcclxuICAgICAgICAgICAgICBjdXJyZW50OiB7XHJcbiAgICAgICAgICAgICAgICBpbmRleDpcclxuICAgICAgICAgICAgICAgICAgcmVwb3J0aW5nUGVyaW9kSW5kZXggPz9cclxuICAgICAgICAgICAgICAgICAgTnVtYmVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QuZmluZChcclxuICAgICAgICAgICAgICAgICAgICAgICh4KSA9PiB4WydAX0dyYWRlUGVyaW9kJ11bMF0gPT09IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0dyYWRlUGVyaW9kJ11bMF1cclxuICAgICAgICAgICAgICAgICAgICApPy5bJ0BfSW5kZXgnXVswXVxyXG4gICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0VuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RbMF1bJ0BfR3JhZGVQZXJpb2QnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGF2YWlsYWJsZTogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5SZXBvcnRpbmdQZXJpb2RzWzBdLlJlcG9ydFBlcmlvZC5tYXAoKHBlcmlvZCkgPT4gKHtcclxuICAgICAgICAgICAgICAgIGRhdGU6IHsgc3RhcnQ6IG5ldyBEYXRlKHBlcmlvZFsnQF9TdGFydERhdGUnXVswXSksIGVuZDogbmV3IERhdGUocGVyaW9kWydAX0VuZERhdGUnXVswXSkgfSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHBlcmlvZFsnQF9HcmFkZVBlcmlvZCddWzBdLFxyXG4gICAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcihwZXJpb2RbJ0BfSW5kZXgnXVswXSksXHJcbiAgICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb3Vyc2VzOiB4bWxPYmplY3QuR3JhZGVib29rWzBdLkNvdXJzZXNbMF0uQ291cnNlLm1hcCgoY291cnNlKSA9PiAoe1xyXG4gICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKGNvdXJzZVsnQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgdGl0bGU6IGNvdXJzZVsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgIHJvb206IGNvdXJzZVsnQF9Sb29tJ11bMF0sXHJcbiAgICAgICAgICAgICAgc3RhZmY6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9TdGFmZiddWzBdLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IGNvdXJzZVsnQF9TdGFmZkVNYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBzdGFmZkd1OiBjb3Vyc2VbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbWFya3M6IGNvdXJzZS5NYXJrc1swXS5NYXJrLm1hcCgobWFyaykgPT4gKHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG1hcmtbJ0BfTWFya05hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRTY29yZToge1xyXG4gICAgICAgICAgICAgICAgICBzdHJpbmc6IG1hcmtbJ0BfQ2FsY3VsYXRlZFNjb3JlU3RyaW5nJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHJhdzogTnVtYmVyKG1hcmtbJ0BfQ2FsY3VsYXRlZFNjb3JlUmF3J11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHdlaWdodGVkQ2F0ZWdvcmllczpcclxuICAgICAgICAgICAgICAgICAgdHlwZW9mIG1hcmtbJ0dyYWRlQ2FsY3VsYXRpb25TdW1tYXJ5J11bMF0gIT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgPyBtYXJrWydHcmFkZUNhbGN1bGF0aW9uU3VtbWFyeSddWzBdLkFzc2lnbm1lbnRHcmFkZUNhbGMubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAod2VpZ2h0ZWQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHdlaWdodGVkWydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRNYXJrOiB3ZWlnaHRlZFsnQF9DYWxjdWxhdGVkTWFyayddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2YWx1YXRlZDogd2VpZ2h0ZWRbJ0BfV2VpZ2h0ZWRQY3QnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmQ6IHdlaWdodGVkWydAX1dlaWdodCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBOdW1iZXIod2VpZ2h0ZWRbJ0BfUG9pbnRzJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NzaWJsZTogTnVtYmVyKHdlaWdodGVkWydAX1BvaW50c1Bvc3NpYmxlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFdlaWdodGVkQ2F0ZWdvcnkpXHJcbiAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnRzOlxyXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgbWFyay5Bc3NpZ25tZW50c1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICA/IChtYXJrLkFzc2lnbm1lbnRzWzBdLkFzc2lnbm1lbnQubWFwKChhc3NpZ25tZW50KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmFkZWJvb2tJZDogYXNzaWdubWVudFsnQF9HcmFkZWJvb2tJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBkZWNvZGVVUkkoYXNzaWdubWVudFsnQF9NZWFzdXJlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhc3NpZ25tZW50WydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHVlOiBuZXcgRGF0ZShhc3NpZ25tZW50WydAX0R1ZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYXNzaWdubWVudFsnQF9TY29yZVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYXNzaWdubWVudFsnQF9TY29yZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IGFzc2lnbm1lbnRbJ0BfUG9pbnRzJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGVzOiBhc3NpZ25tZW50WydAX05vdGVzJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYWNoZXJJZDogYXNzaWdubWVudFsnQF9UZWFjaGVySUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRlY29kZVVSSShhc3NpZ25tZW50WydAX01lYXN1cmVEZXNjcmlwdGlvbiddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzRHJvcGJveDogSlNPTi5wYXJzZShhc3NpZ25tZW50WydAX0hhc0Ryb3BCb3gnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0dWRlbnRJZDogYXNzaWdubWVudFsnQF9TdHVkZW50SUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGJveERhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9Ecm9wU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9Ecm9wRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBhc3NpZ25tZW50LlJlc291cmNlc1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdLlJlc291cmNlLm1hcCgocnNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocnNyY1snQF9UeXBlJ11bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ0ZpbGUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVSc3JjID0gcnNyYyBhcyBGaWxlUmVzb3VyY2VYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUmVzb3VyY2VUeXBlLkZJTEUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlsZVJzcmNbJ0BfRmlsZVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVSc3JjWydAX0ZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmk6IHRoaXMuaG9zdFVybCArIGZpbGVSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZmlsZVJzcmNbJ0BfUmVzb3VyY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGZpbGVSc3JjWydAX1Jlc291cmNlSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVSc3JjWydAX1Jlc291cmNlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgRmlsZVJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnVVJMJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmxSc3JjID0gcnNyYyBhcyBVUkxSZXNvdXJjZVhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybFJzcmNbJ0BfVVJMJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUmVzb3VyY2VUeXBlLlVSTCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUodXJsUnNyY1snQF9SZXNvdXJjZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdXJsUnNyY1snQF9SZXNvdXJjZUlEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB1cmxSc3JjWydAX1Jlc291cmNlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVybFJzcmNbJ0BfUmVzb3VyY2VEZXNjcmlwdGlvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogdXJsUnNyY1snQF9TZXJ2ZXJGaWxlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFVSTFJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBUeXBlICR7cnNyY1snQF9UeXBlJ11bMF19IGRvZXMgbm90IGV4aXN0IGFzIGEgdHlwZS4gQWRkIGl0IHRvIHR5cGUgZGVjbGFyYXRpb25zLmBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pIGFzIChGaWxlUmVzb3VyY2UgfCBVUkxSZXNvdXJjZSlbXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KSkgYXMgQXNzaWdubWVudFtdKVxyXG4gICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgfSkpIGFzIE1hcmtbXSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfSBhcyBHcmFkZWJvb2spO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhIGxpc3Qgb2YgbWVzc2FnZXMgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxNZXNzYWdlW10+fSBSZXR1cm5zIGFuIGFycmF5IG9mIG1lc3NhZ2VzIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTsgLy8gLT4gW3sgaWQ6ICdFOTcyRjFCQy05OUEwLTRDRDAtOEQxNS1CMTg5NjhCNDNFMDgnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH0sIHsgaWQ6ICc4NkZEQTExRC00MkM3LTQyNDktQjAwMy05NEIxNUVCMkM4RDQnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH1dXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIG1lc3NhZ2VzKCk6IFByb21pc2U8TWVzc2FnZVtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PE1lc3NhZ2VYTUxPYmplY3Q+KFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBtZXRob2ROYW1lOiAnR2V0UFhQTWVzc2FnZXMnLFxyXG4gICAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKHhtbCkgPT4gbmV3IFhNTEZhY3RvcnkoeG1sKS5lbmNvZGVBdHRyaWJ1dGUoJ0NvbnRlbnQnLCAnUmVhZCcpLnRvU3RyaW5nKClcclxuICAgICAgICApXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKFxyXG4gICAgICAgICAgICB4bWxPYmplY3QuUFhQTWVzc2FnZXNEYXRhWzBdLk1lc3NhZ2VMaXN0aW5nc1swXS5NZXNzYWdlTGlzdGluZy5tYXAoXHJcbiAgICAgICAgICAgICAgKG1lc3NhZ2UpID0+IG5ldyBNZXNzYWdlKG1lc3NhZ2UsIHN1cGVyLmNyZWRlbnRpYWxzLCB0aGlzLmhvc3RVcmwpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgaW5mbyBvZiBhIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTdHVkZW50SW5mbz59IFN0dWRlbnRJbmZvIG9iamVjdFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogc3R1ZGVudEluZm8oKS50aGVuKGNvbnNvbGUubG9nKSAvLyAtPiB7IHN0dWRlbnQ6IHsgbmFtZTogJ0V2YW4gRGF2aXMnLCBuaWNrbmFtZTogJycsIGxhc3ROYW1lOiAnRGF2aXMnIH0sIC4uLn1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc3R1ZGVudEluZm8oKTogUHJvbWlzZTxTdHVkZW50SW5mbz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFN0dWRlbnRJbmZvPigocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8U3R1ZGVudEluZm9YTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50SW5mbycsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0RGF0YSkgPT4ge1xyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgc3R1ZGVudDoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRm9ybWF0dGVkTmFtZVswXSxcclxuICAgICAgICAgICAgICBsYXN0TmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5MYXN0TmFtZUdvZXNCeVswXSxcclxuICAgICAgICAgICAgICBuaWNrbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5OaWNrTmFtZVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYmlydGhEYXRlOiBuZXcgRGF0ZSh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkJpcnRoRGF0ZVswXSksXHJcbiAgICAgICAgICAgIHRyYWNrOiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlRyYWNrKSxcclxuICAgICAgICAgICAgYWRkcmVzczogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzKSxcclxuICAgICAgICAgICAgcGhvdG86IG9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uUGhvdG8pLFxyXG4gICAgICAgICAgICBjb3Vuc2Vsb3I6XHJcbiAgICAgICAgICAgICAgeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Db3Vuc2Vsb3JOYW1lICYmXHJcbiAgICAgICAgICAgICAgeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Db3Vuc2Vsb3JFbWFpbCAmJlxyXG4gICAgICAgICAgICAgIHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yU3RhZmZHVVxyXG4gICAgICAgICAgICAgICAgPyB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Db3Vuc2Vsb3JOYW1lWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkNvdW5zZWxvckVtYWlsWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ291bnNlbG9yU3RhZmZHVVswXSxcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGN1cnJlbnRTY2hvb2w6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQ3VycmVudFNjaG9vbFswXSxcclxuICAgICAgICAgICAgZGVudGlzdDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5EZW50aXN0XHJcbiAgICAgICAgICAgICAgPyB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRGVudGlzdFswXVsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHBob25lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkRlbnRpc3RbMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5EZW50aXN0WzBdWydAX0V4dG4nXVswXSxcclxuICAgICAgICAgICAgICAgICAgb2ZmaWNlOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkRlbnRpc3RbMF1bJ0BfT2ZmaWNlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHBoeXNpY2lhbjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaHlzaWNpYW5cclxuICAgICAgICAgICAgICA/IHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaHlzaWNpYW5bMF1bJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBwaG9uZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaHlzaWNpYW5bMF1bJ0BfUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaHlzaWNpYW5bMF1bJ0BfRXh0biddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBob3NwaXRhbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5QaHlzaWNpYW5bMF1bJ0BfSG9zcGl0YWwnXVswXSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgaWQ6IG9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uUGVybUlEKSxcclxuICAgICAgICAgICAgb3JnWWVhckd1OiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLk9yZ1llYXJHVSksXHJcbiAgICAgICAgICAgIHBob25lOiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlBob25lKSxcclxuICAgICAgICAgICAgZW1haWw6IG9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uRU1haWwpLFxyXG4gICAgICAgICAgICBlbWVyZ2VuY3lDb250YWN0czogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5FbWVyZ2VuY3lDb250YWN0c1xyXG4gICAgICAgICAgICAgID8geG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5FbWVyZ2VuY3lDb250YWN0c1swXS5FbWVyZ2VuY3lDb250YWN0Lm1hcCgoY29udGFjdCkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogb3B0aW9uYWwoY29udGFjdFsnQF9OYW1lJ10pLFxyXG4gICAgICAgICAgICAgICAgICBwaG9uZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGhvbWU6IG9wdGlvbmFsKGNvbnRhY3RbJ0BfSG9tZVBob25lJ10pLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vYmlsZTogb3B0aW9uYWwoY29udGFjdFsnQF9Nb2JpbGVQaG9uZSddKSxcclxuICAgICAgICAgICAgICAgICAgICBvdGhlcjogb3B0aW9uYWwoY29udGFjdFsnQF9PdGhlclBob25lJ10pLFxyXG4gICAgICAgICAgICAgICAgICAgIHdvcms6IG9wdGlvbmFsKGNvbnRhY3RbJ0BfV29ya1Bob25lJ10pLFxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6IG9wdGlvbmFsKGNvbnRhY3RbJ0BfUmVsYXRpb25zaGlwJ10pLFxyXG4gICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgZ2VuZGVyOiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkdlbmRlciksXHJcbiAgICAgICAgICAgIGdyYWRlOiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkdyYWRlKSxcclxuICAgICAgICAgICAgbG9ja2VySW5mb1JlY29yZHM6IG9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uTG9ja2VySW5mb1JlY29yZHMpLFxyXG4gICAgICAgICAgICBob21lTGFuZ3VhZ2U6IG9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uSG9tZUxhbmd1YWdlKSxcclxuICAgICAgICAgICAgaG9tZVJvb206IG9wdGlvbmFsKHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uSG9tZVJvb20pLFxyXG4gICAgICAgICAgICBob21lUm9vbVRlYWNoZXI6IHtcclxuICAgICAgICAgICAgICBlbWFpbDogb3B0aW9uYWwoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Ib21lUm9vbVRjaEVNYWlsKSxcclxuICAgICAgICAgICAgICBuYW1lOiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkhvbWVSb29tVGNoKSxcclxuICAgICAgICAgICAgICBzdGFmZkd1OiBvcHRpb25hbCh4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkhvbWVSb29tVGNoU3RhZmZHVSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxJbmZvOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLlVzZXJEZWZpbmVkR3JvdXBCb3hlc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94XHJcbiAgICAgICAgICAgICAgPyAoeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94ZXNbMF0uVXNlckRlZmluZWRHcm91cEJveC5tYXAoKGRlZmluZWRCb3gpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgIGlkOiBvcHRpb25hbChkZWZpbmVkQm94WydAX0dyb3VwQm94SUQnXSksIC8vIHN0cmluZyB8IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiBkZWZpbmVkQm94WydAX0dyb3VwQm94TGFiZWwnXVswXSwgLy8gc3RyaW5nXHJcbiAgICAgICAgICAgICAgICAgIHZjSWQ6IG9wdGlvbmFsKGRlZmluZWRCb3hbJ0BfVkNJRCddKSwgLy8gc3RyaW5nIHwgdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1zOiBkZWZpbmVkQm94LlVzZXJEZWZpbmVkSXRlbXNbMF0uVXNlckRlZmluZWRJdGVtLm1hcCgoaXRlbSkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGl0ZW1bJ0BfU291cmNlRWxlbWVudCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBpdGVtWydAX1NvdXJjZU9iamVjdCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdmNJZDogaXRlbVsnQF9WQ0lEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1bJ0BfVmFsdWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBpdGVtWydAX0l0ZW1UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIH0pKSBhcyBBZGRpdGlvbmFsSW5mb0l0ZW1bXSxcclxuICAgICAgICAgICAgICAgIH0pKSBhcyBBZGRpdGlvbmFsSW5mb1tdKVxyXG4gICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICB9IGFzIFN0dWRlbnRJbmZvKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwoZGF0ZTogRGF0ZSkge1xyXG4gICAgcmV0dXJuIHN1cGVyLnByb2Nlc3NSZXF1ZXN0PENhbGVuZGFyWE1MT2JqZWN0PihcclxuICAgICAge1xyXG4gICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50Q2FsZW5kYXInLFxyXG4gICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIFJlcXVlc3REYXRlOiBkYXRlLnRvSVNPU3RyaW5nKCkgfSxcclxuICAgICAgfSxcclxuICAgICAgKHhtbCkgPT4gbmV3IFhNTEZhY3RvcnkoeG1sKS5lbmNvZGVBdHRyaWJ1dGUoJ1RpdGxlJywgJ0ljb24nKS50b1N0cmluZygpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0NhbGVuZGFyT3B0aW9uc30gb3B0aW9ucyBPcHRpb25zIHRvIHByb3ZpZGUgZm9yIGNhbGVuZGFyIG1ldGhvZC4gQW4gaW50ZXJ2YWwgaXMgcmVxdWlyZWQuXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8Q2FsZW5kYXI+fSBSZXR1cm5zIGEgQ2FsZW5kYXIgb2JqZWN0XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjbGllbnQuY2FsZW5kYXIoeyBpbnRlcnZhbDogeyBzdGFydDogbmV3IERhdGUoJzUvMS8yMDIyJyksIGVuZDogbmV3IERhdGUoJzgvMS8yMDIxJykgfSwgY29uY3VycmVuY3k6IG51bGwgfSk7IC8vIC0+IExpbWl0bGVzcyBjb25jdXJyZW5jeSAobm90IHJlY29tbWVuZGVkKVxyXG4gICAqXHJcbiAgICogY29uc3QgY2FsZW5kYXIgPSBhd2FpdCBjbGllbnQuY2FsZW5kYXIoeyBpbnRlcnZhbDogeyAuLi4gfX0pO1xyXG4gICAqIGNvbnNvbGUubG9nKGNhbGVuZGFyKTsgLy8gLT4geyBzY2hvb2xEYXRlOiB7Li4ufSwgb3V0cHV0UmFuZ2U6IHsuLi59LCBldmVudHM6IFsuLi5dIH1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgYXN5bmMgY2FsZW5kYXIob3B0aW9uczogQ2FsZW5kYXJPcHRpb25zID0ge30pOiBQcm9taXNlPENhbGVuZGFyPiB7XHJcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogQ2FsZW5kYXJPcHRpb25zID0ge1xyXG4gICAgICBjb25jdXJyZW5jeTogNyxcclxuICAgICAgLi4ub3B0aW9ucyxcclxuICAgIH07XHJcbiAgICBjb25zdCBjYWwgPSBhd2FpdCBjYWNoZS5tZW1vKCgpID0+IHRoaXMuZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChuZXcgRGF0ZSgpKSk7XHJcbiAgICBjb25zdCBzY2hvb2xFbmREYXRlOiBEYXRlIHwgbnVtYmVyID1cclxuICAgICAgb3B0aW9ucy5pbnRlcnZhbD8uZW5kID8/IG5ldyBEYXRlKGNhbC5DYWxlbmRhckxpc3RpbmdbMF1bJ0BfU2Nob29sRW5kRGF0ZSddWzBdKTtcclxuICAgIGNvbnN0IHNjaG9vbFN0YXJ0RGF0ZTogRGF0ZSB8IG51bWJlciA9XHJcbiAgICAgIG9wdGlvbnMuaW50ZXJ2YWw/LnN0YXJ0ID8/IG5ldyBEYXRlKGNhbC5DYWxlbmRhckxpc3RpbmdbMF1bJ0BfU2Nob29sQmVnRGF0ZSddWzBdKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIGNvbnN0IG1vbnRoc1dpdGhpblNjaG9vbFllYXIgPSBlYWNoTW9udGhPZkludGVydmFsKHsgc3RhcnQ6IHNjaG9vbFN0YXJ0RGF0ZSwgZW5kOiBzY2hvb2xFbmREYXRlIH0pO1xyXG4gICAgICBjb25zdCBnZXRBbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyID0gKCk6IFByb21pc2U8Q2FsZW5kYXJYTUxPYmplY3RbXT4gPT5cclxuICAgICAgICBkZWZhdWx0T3B0aW9ucy5jb25jdXJyZW5jeSA9PSBudWxsXHJcbiAgICAgICAgICA/IFByb21pc2UuYWxsKG1vbnRoc1dpdGhpblNjaG9vbFllYXIubWFwKChkYXRlKSA9PiB0aGlzLmZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwoZGF0ZSkpKVxyXG4gICAgICAgICAgOiBhc3luY1Bvb2xBbGwoZGVmYXVsdE9wdGlvbnMuY29uY3VycmVuY3ksIG1vbnRoc1dpdGhpblNjaG9vbFllYXIsIChkYXRlKSA9PlxyXG4gICAgICAgICAgICAgIHRoaXMuZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICBsZXQgbWVtbzogQ2FsZW5kYXIgfCBudWxsID0gbnVsbDtcclxuICAgICAgZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhcigpXHJcbiAgICAgICAgLnRoZW4oKGV2ZW50cykgPT4ge1xyXG4gICAgICAgICAgY29uc3QgYWxsRXZlbnRzID0gZXZlbnRzLnJlZHVjZSgocHJldiwgZXZlbnRzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtZW1vID09IG51bGwpXHJcbiAgICAgICAgICAgICAgbWVtbyA9IHtcclxuICAgICAgICAgICAgICAgIHNjaG9vbERhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF1bJ0BfU2Nob29sQmVnRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEVuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0UmFuZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IHNjaG9vbFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICAgICAgZW5kOiBzY2hvb2xFbmREYXRlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGV2ZW50czogW10sXHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdDogQ2FsZW5kYXIgPSB7XHJcbiAgICAgICAgICAgICAgLi4ubWVtbywgLy8gVGhpcyBpcyB0byBwcmV2ZW50IHJlLWluaXRpYWxpemluZyBEYXRlIG9iamVjdHMgaW4gb3JkZXIgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxyXG4gICAgICAgICAgICAgIGV2ZW50czogW1xyXG4gICAgICAgICAgICAgICAgLi4uKHByZXYuZXZlbnRzID8gcHJldi5ldmVudHMgOiBbXSksXHJcbiAgICAgICAgICAgICAgICAuLi4odHlwZW9mIGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF0uRXZlbnRMaXN0c1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgPyAoZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXS5FdmVudExpc3RzWzBdLkV2ZW50TGlzdC5tYXAoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50WydAX0RheVR5cGUnXVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5BU1NJR05NRU5UOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNzaWdubWVudEV2ZW50ID0gZXZlbnQgYXMgQXNzaWdubWVudEV2ZW50WE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZGVjb2RlVVJJKGFzc2lnbm1lbnRFdmVudFsnQF9UaXRsZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZExpbmtEYXRhOiBhc3NpZ25tZW50RXZlbnRbJ0BfQWRkTGlua0RhdGEnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFndTogYXNzaWdubWVudEV2ZW50WydAX0FHVSddID8gYXNzaWdubWVudEV2ZW50WydAX0FHVSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoYXNzaWdubWVudEV2ZW50WydAX0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZ3U6IGFzc2lnbm1lbnRFdmVudFsnQF9ER1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGFzc2lnbm1lbnRFdmVudFsnQF9MaW5rJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IGFzc2lnbm1lbnRFdmVudFsnQF9TdGFydFRpbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEV2ZW50VHlwZS5BU1NJR05NRU5ULFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld1R5cGU6IGFzc2lnbm1lbnRFdmVudFsnQF9WaWV3VHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgQXNzaWdubWVudEV2ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLkhPTElEQVk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGRlY29kZVVSSShldmVudFsnQF9UaXRsZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEV2ZW50VHlwZS5IT0xJREFZLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBldmVudFsnQF9TdGFydFRpbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGV2ZW50WydAX0RhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBIb2xpZGF5RXZlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuUkVHVUxBUjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlZ3VsYXJFdmVudCA9IGV2ZW50IGFzIFJlZ3VsYXJFdmVudFhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGRlY29kZVVSSShyZWd1bGFyRXZlbnRbJ0BfVGl0bGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZ3U6IHJlZ3VsYXJFdmVudFsnQF9BR1UnXSA/IHJlZ3VsYXJFdmVudFsnQF9BR1UnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKHJlZ3VsYXJFdmVudFsnQF9EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHJlZ3VsYXJFdmVudFsnQF9FdnREZXNjcmlwdGlvbiddXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcmVndWxhckV2ZW50WydAX0V2dERlc2NyaXB0aW9uJ11bMF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZ3U6IHJlZ3VsYXJFdmVudFsnQF9ER1UnXSA/IHJlZ3VsYXJFdmVudFsnQF9ER1UnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6IHJlZ3VsYXJFdmVudFsnQF9MaW5rJ10gPyByZWd1bGFyRXZlbnRbJ0BfTGluayddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiByZWd1bGFyRXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuUkVHVUxBUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdUeXBlOiByZWd1bGFyRXZlbnRbJ0BfVmlld1R5cGUnXSA/IHJlZ3VsYXJFdmVudFsnQF9WaWV3VHlwZSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkTGlua0RhdGE6IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddID8gcmVndWxhckV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBSZWd1bGFyRXZlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSBhcyBFdmVudFtdKVxyXG4gICAgICAgICAgICAgICAgICA6IFtdKSxcclxuICAgICAgICAgICAgICBdIGFzIEV2ZW50W10sXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcclxuICAgICAgICAgIH0sIHt9IGFzIENhbGVuZGFyKTtcclxuICAgICAgICAgIHJlcyh7IC4uLmFsbEV2ZW50cywgZXZlbnRzOiBfLnVuaXFCeShhbGxFdmVudHMuZXZlbnRzLCAoaXRlbSkgPT4gaXRlbS50aXRsZSkgfSBhcyBDYWxlbmRhcik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ2UsTUFBTUEsTUFBTSxTQUFTQyxhQUFJLENBQUNELE1BQU0sQ0FBQztJQUU5Q0UsV0FBVyxDQUFDQyxXQUE2QixFQUFFQyxPQUFlLEVBQUU7TUFDMUQsS0FBSyxDQUFDRCxXQUFXLENBQUM7TUFDbEIsSUFBSSxDQUFDQyxPQUFPLEdBQUdBLE9BQU87SUFDeEI7O0lBRUE7QUFDRjtBQUNBO0lBQ1NDLG1CQUFtQixHQUFrQjtNQUMxQyxPQUFPLElBQUlDLE9BQU8sQ0FBQyxDQUFDQyxHQUFHLEVBQUVDLEdBQUcsS0FBSztRQUMvQixLQUFLLENBQ0ZDLGNBQWMsQ0FBcUI7VUFBRUMsVUFBVSxFQUFFLFlBQVk7VUFBRUMsY0FBYyxFQUFFO1FBQU0sQ0FBQyxDQUFDLENBQ3ZGQyxJQUFJLENBQUVDLFFBQVEsSUFBSztVQUNsQixJQUFJQSxRQUFRLENBQUNDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLG1DQUFtQztZQUFFUCxHQUFHLEVBQUU7VUFBQyxPQUN6RkMsR0FBRyxDQUFDLElBQUlPLHlCQUFnQixDQUFDRixRQUFRLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FD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