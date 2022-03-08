(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/soap/soap", "../Message/Message", "date-fns", "../../Constants/EventType", "lodash", "tiny-async-pool", "../../Constants/ResourceType", "../ReportCard/ReportCard", "../Document/Document", "../RequestException/RequestException"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/soap/soap"), require("../Message/Message"), require("date-fns"), require("../../Constants/EventType"), require("lodash"), require("tiny-async-pool"), require("../../Constants/ResourceType"), require("../ReportCard/ReportCard"), require("../Document/Document"), require("../RequestException/RequestException"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.soap, global.Message, global.dateFns, global.EventType, global.lodash, global.tinyAsyncPool, global.ResourceType, global.ReportCard, global.Document, global.RequestException);
    global.Client = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _soap, _Message, _dateFns, _EventType, _lodash, _tinyAsyncPool, _ResourceType, _ReportCard, _Document, _RequestException) {
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
            ...(reportingPeriodIndex ? {
              ReportingPeriod: reportingPeriodIndex
            } : {})
          }
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
              var _a12 = mark.Assignments[0].Assignment;

              var _f12 = assignment => {
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
              };

              var _r12 = [];

              for (var _i12 = 0; _i12 < _a12.length; _i12++) {
                _r12.push(_f12(_a12[_i12], _i12, _a12));
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
                assignments: _r12
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
          // xml.replace(/(?<=Content=").*(?="\sRead)/g, btoa)
          const Content = (xml.match(/Content=".*" Read/g) ?? [''])[0];
          const base64 = btoa(Content.substring(9, Content.length - 6));
          return xml.replace(/Content=".*" Read/g, `Content="${base64}" Read`);
        }).then(xmlObject => {
          var _a13 = xmlObject.PXPMessagesData[0].MessageListings[0].MessageListing;

          var _f13 = message => {
            return new _Message.default(message, super.credentials, this.hostUrl);
          };

          var _r13 = [];

          for (var _i13 = 0; _i13 < _a13.length; _i13++) {
            _r13.push(_f13(_a13[_i13], _i13, _a13));
          }

          res(_r13);
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
          var _a14 = xmlObjectData.StudentInfo[0].Address[0].EmergencyContacts[0].EmergencyContact;

          var _f14 = contact => {
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

          var _r14 = [];

          for (var _i14 = 0; _i14 < _a14.length; _i14++) {
            _r14.push(_f14(_a14[_i14], _i14, _a14));
          }

          var _a15 = xmlObjectData.StudentInfo[0].Address[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox;

          var _f15 = definedBox => {
            var _a16 = definedBox.UserDefinedItems[0].UserDefinedItem;

            var _f16 = item => {
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

            var _r16 = [];

            for (var _i16 = 0; _i16 < _a16.length; _i16++) {
              _r16.push(_f16(_a16[_i16], _i16, _a16));
            }

            return {
              id: definedBox['@_GroupBoxID'][0],
              type: definedBox['@_GroupBoxLabel'][0],
              vcId: definedBox['@_VCID'][0],
              items: _r16
            };
          };

          var _r15 = [];

          for (var _i15 = 0; _i15 < _a15.length; _i15++) {
            _r15.push(_f15(_a15[_i15], _i15, _a15));
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
            emergencyContacts: _r14,
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
            additionalInfo: _r15
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

            var _a17 = events.CalendarListing[0].EventLists[0].EventList;

            var _f17 = event => {
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

            var _r17 = [];

            for (var _i17 = 0; _i17 < _a17.length; _i17++) {
              _r17.push(_f17(_a17[_i17], _i17, _a17));
            }

            const rest = { ...memo,
              // This is to prevent re-initializing Date objects in order to improve performance
              events: [...(prev.events ? prev.events : []), ..._r17]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOlsiQ2xpZW50Iiwic29hcCIsImNvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwidmFsaWRhdGVDcmVkZW50aWFscyIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJwcm9jZXNzUmVxdWVzdCIsIm1ldGhvZE5hbWUiLCJ2YWxpZGF0ZUVycm9ycyIsInRoZW4iLCJyZXNwb25zZSIsIlJUX0VSUk9SIiwiUmVxdWVzdEV4Y2VwdGlvbiIsImNhdGNoIiwiZG9jdW1lbnRzIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwieG1sT2JqZWN0IiwiU3R1ZGVudERvY3VtZW50RGF0YXMiLCJTdHVkZW50RG9jdW1lbnREYXRhIiwieG1sIiwiRG9jdW1lbnQiLCJyZXBvcnRDYXJkcyIsIlJDUmVwb3J0aW5nUGVyaW9kRGF0YSIsIlJDUmVwb3J0aW5nUGVyaW9kcyIsIlJDUmVwb3J0aW5nUGVyaW9kIiwiUmVwb3J0Q2FyZCIsInNjaG9vbEluZm8iLCJjaGlsZEludElEIiwiU3R1ZGVudFNjaG9vbEluZm9MaXN0aW5nIiwiU3RhZmZMaXN0cyIsIlN0YWZmTGlzdCIsInN0YWZmIiwibmFtZSIsImVtYWlsIiwic3RhZmZHdSIsImpvYlRpdGxlIiwiZXh0biIsInBob25lIiwic2Nob29sIiwiYWRkcmVzcyIsImFkZHJlc3NBbHQiLCJjaXR5IiwiemlwQ29kZSIsImFsdFBob25lIiwicHJpbmNpcGFsIiwic2NoZWR1bGUiLCJ0ZXJtSW5kZXgiLCJUZXJtSW5kZXgiLCJTdHVkZW50Q2xhc3NTY2hlZHVsZSIsIkNsYXNzTGlzdHMiLCJDbGFzc0xpc3RpbmciLCJzdHVkZW50Q2xhc3MiLCJwZXJpb2QiLCJOdW1iZXIiLCJyb29tIiwic2VjdGlvbkd1IiwidGVhY2hlciIsIlRlcm1MaXN0cyIsIlRlcm1MaXN0aW5nIiwidGVybSIsImRhdGUiLCJzdGFydCIsIkRhdGUiLCJlbmQiLCJpbmRleCIsInNjaG9vbFllYXJUZXJtQ29kZUd1IiwiZXJyb3IiLCJ0b2RheSIsIlRvZGF5U2NoZWR1bGVJbmZvRGF0YSIsIlNjaG9vbEluZm9zIiwiU2Nob29sSW5mbyIsIm1hcCIsImJlbGxTY2hlZHVsZU5hbWUiLCJjbGFzc2VzIiwiQ2xhc3NlcyIsIkNsYXNzSW5mbyIsImNvdXJzZSIsImF0dGVuZGFuY2VDb2RlIiwiQXR0ZW5kYW5jZUNvZGUiLCJlbWFpbFN1YmplY3QiLCJ1cmwiLCJ0ZXJtcyIsImF0dGVuZGFuY2UiLCJhdHRlbmRhbmNlWE1MT2JqZWN0IiwiQXR0ZW5kYW5jZSIsIkFic2VuY2VzIiwiQWJzZW5jZSIsImFic2VuY2UiLCJQZXJpb2RzIiwiUGVyaW9kIiwicmVhc29uIiwib3JnWWVhckd1Iiwibm90ZSIsImRlc2NyaXB0aW9uIiwicGVyaW9kcyIsIlRvdGFsQWN0aXZpdGllcyIsIlBlcmlvZFRvdGFsIiwicGQiLCJpIiwidG90YWwiLCJleGN1c2VkIiwiVG90YWxFeGN1c2VkIiwidGFyZGllcyIsIlRvdGFsVGFyZGllcyIsInVuZXhjdXNlZCIsIlRvdGFsVW5leGN1c2VkIiwiYWN0aXZpdGllcyIsInVuZXhjdXNlZFRhcmRpZXMiLCJUb3RhbFVuZXhjdXNlZFRhcmRpZXMiLCJ0eXBlIiwic2Nob29sTmFtZSIsImFic2VuY2VzIiwicGVyaW9kSW5mb3MiLCJncmFkZWJvb2siLCJyZXBvcnRpbmdQZXJpb2RJbmRleCIsIlJlcG9ydGluZ1BlcmlvZCIsIkdyYWRlYm9vayIsIlJlcG9ydGluZ1BlcmlvZHMiLCJSZXBvcnRQZXJpb2QiLCJDb3Vyc2VzIiwiQ291cnNlIiwiTWFya3MiLCJNYXJrIiwibWFyayIsIkFzc2lnbm1lbnRzIiwiQXNzaWdubWVudCIsImFzc2lnbm1lbnQiLCJncmFkZWJvb2tJZCIsImR1ZSIsInNjb3JlIiwidmFsdWUiLCJwb2ludHMiLCJub3RlcyIsInRlYWNoZXJJZCIsImhhc0Ryb3Bib3giLCJKU09OIiwicGFyc2UiLCJzdHVkZW50SWQiLCJkcm9wYm94RGF0ZSIsInJlc291cmNlcyIsIlJlc291cmNlcyIsIlJlc291cmNlIiwicnNyYyIsImZpbGVSc3JjIiwiUmVzb3VyY2VUeXBlIiwiRklMRSIsImZpbGUiLCJ1cmkiLCJyZXNvdXJjZSIsImlkIiwidXJsUnNyYyIsIlVSTCIsInBhdGgiLCJjYWxjdWxhdGVkU2NvcmUiLCJzdHJpbmciLCJyYXciLCJ3ZWlnaHRlZENhdGVnb3JpZXMiLCJBc3NpZ25tZW50R3JhZGVDYWxjIiwid2VpZ2h0ZWQiLCJjYWxjdWxhdGVkTWFyayIsIndlaWdodCIsImV2YWx1YXRlZCIsInN0YW5kYXJkIiwiY3VycmVudCIsInBvc3NpYmxlIiwiYXNzaWdubWVudHMiLCJ0aXRsZSIsIm1hcmtzIiwicmVwb3J0aW5nUGVyaW9kIiwiZmluZCIsIngiLCJhdmFpbGFibGUiLCJjb3Vyc2VzIiwibWVzc2FnZXMiLCJDb250ZW50IiwibWF0Y2giLCJiYXNlNjQiLCJidG9hIiwic3Vic3RyaW5nIiwibGVuZ3RoIiwicmVwbGFjZSIsIlBYUE1lc3NhZ2VzRGF0YSIsIk1lc3NhZ2VMaXN0aW5ncyIsIk1lc3NhZ2VMaXN0aW5nIiwibWVzc2FnZSIsIk1lc3NhZ2UiLCJzdHVkZW50SW5mbyIsInhtbE9iamVjdERhdGEiLCJTdHVkZW50SW5mbyIsIkFkZHJlc3MiLCJFbWVyZ2VuY3lDb250YWN0cyIsIkVtZXJnZW5jeUNvbnRhY3QiLCJjb250YWN0IiwiaG9tZSIsIm1vYmlsZSIsIm90aGVyIiwid29yayIsInJlbGF0aW9uc2hpcCIsIlVzZXJEZWZpbmVkR3JvdXBCb3hlcyIsIlVzZXJEZWZpbmVkR3JvdXBCb3giLCJkZWZpbmVkQm94IiwiVXNlckRlZmluZWRJdGVtcyIsIlVzZXJEZWZpbmVkSXRlbSIsIml0ZW0iLCJzb3VyY2UiLCJlbGVtZW50Iiwib2JqZWN0IiwidmNJZCIsIml0ZW1zIiwic3R1ZGVudCIsIkZvcm1hdHRlZE5hbWUiLCJsYXN0TmFtZSIsIkxhc3ROYW1lR29lc0J5Iiwibmlja25hbWUiLCJOaWNrTmFtZSIsImJpcnRoRGF0ZSIsIkJpcnRoRGF0ZSIsInRyYWNrIiwiVHJhY2siLCJiciIsImNvdW5zZWxvciIsIkNvdW5zZWxvck5hbWUiLCJDb3Vuc2Vsb3JFbWFpbCIsIkNvdW5zZWxvclN0YWZmR1UiLCJjdXJyZW50U2Nob29sIiwiQ3VycmVudFNjaG9vbCIsImRlbnRpc3QiLCJEZW50aXN0Iiwib2ZmaWNlIiwicGh5c2ljaWFuIiwiUGh5c2ljaWFuIiwiaG9zcGl0YWwiLCJFTWFpbCIsImVtZXJnZW5jeUNvbnRhY3RzIiwiZ2VuZGVyIiwiR2VuZGVyIiwiZ3JhZGUiLCJHcmFkZSIsImxvY2tlckluZm9SZWNvcmRzIiwiTG9ja2VySW5mb1JlY29yZHMiLCJob21lTGFuZ3VhZ2UiLCJIb21lTGFuZ3VhZ2UiLCJob21lUm9vbSIsIkhvbWVSb29tIiwiaG9tZVJvb21UZWFjaGVyIiwiSG9tZVJvb21UY2hFTWFpbCIsIkhvbWVSb29tVGNoIiwiSG9tZVJvb21UY2hTdGFmZkdVIiwiYWRkaXRpb25hbEluZm8iLCJmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsIiwiUmVxdWVzdERhdGUiLCJ0b0lTT1N0cmluZyIsImNhbGVuZGFyIiwib3B0aW9ucyIsImRlZmF1bHRPcHRpb25zIiwiY29uY3VycmVuY3kiLCJzY2hvb2xTdGFydERhdGUiLCJpbnRlcnZhbCIsInNjaG9vbEVuZERhdGUiLCJtb250aHNXaXRoaW5TY2hvb2xZZWFyIiwiZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhciIsImFsbCIsIm1lbW8iLCJldmVudHMiLCJhbGxFdmVudHMiLCJyZWR1Y2UiLCJwcmV2Iiwic2Nob29sRGF0ZSIsIkNhbGVuZGFyTGlzdGluZyIsIm91dHB1dFJhbmdlIiwiRXZlbnRMaXN0cyIsIkV2ZW50TGlzdCIsImV2ZW50IiwiRXZlbnRUeXBlIiwiQVNTSUdOTUVOVCIsImFzc2lnbm1lbnRFdmVudCIsImFkZExpbmtEYXRhIiwiYWd1IiwiZGd1IiwibGluayIsInN0YXJ0VGltZSIsInZpZXdUeXBlIiwiSE9MSURBWSIsIlJFR1VMQVIiLCJyZWd1bGFy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QUEsV0FBVyxFQUFFUSxZQUFZLENBQUMsZUFBRCxDQUFaLEdBQWdDQSxZQUFZLENBQUMsZUFBRCxDQUFaLENBQThCLENBQTlCLENBQWhDLEdBQW1FQztBQVYzRSxxQkFBUDtBQVlEO0FBckNIO0FBdUNELGFBekQyQzs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBYWhELGtCQUFNQyxJQUFjLEdBQUcsRUFDckIsR0FBR3hCLElBRGtCO0FBQ1o7QUFDVEMsY0FBQUEsTUFBTSxFQUFFLENBQ04sSUFBSUcsSUFBSSxDQUFDSCxNQUFMLEdBQWNHLElBQUksQ0FBQ0gsTUFBbkIsR0FBNEIsRUFBaEMsQ0FETSxFQUVOLE9BRk07QUFGYSxhQUF2QjtBQWdEQSxtQkFBT3VCLElBQVA7QUFDRCxXQTlEaUIsRUE4RGYsRUE5RGUsQ0FBbEI7QUErREEzUixVQUFBQSxHQUFHLENBQUMsRUFBRSxHQUFHcVEsU0FBTDtBQUFnQkQsWUFBQUEsTUFBTSxFQUFFd0IsZ0JBQUVDLE1BQUYsQ0FBU3hCLFNBQVMsQ0FBQ0QsTUFBbkIsRUFBNEI1RCxJQUFEO0FBQUEscUJBQVVBLElBQUksQ0FBQ3JDLEtBQWY7QUFBQSxhQUEzQjtBQUF4QixXQUFELENBQUg7QUFDRCxTQWxFSCxFQW1FRzFKLEtBbkVILENBbUVTUixHQW5FVDtBQW9FRCxPQWhGTSxDQUFQO0FBaUZEOztBQXRvQjZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscywgUGFyc2VkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xyXG5pbXBvcnQgc29hcCBmcm9tICcuLi8uLi91dGlscy9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgeyBBZGRpdGlvbmFsSW5mbywgQWRkaXRpb25hbEluZm9JdGVtLCBDbGFzc1NjaGVkdWxlSW5mbywgU2Nob29sSW5mbywgU3R1ZGVudEluZm8gfSBmcm9tICcuL0NsaWVudC5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgU3R1ZGVudEluZm9YTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1N0dWRlbnRJbmZvJztcclxuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi4vTWVzc2FnZS9NZXNzYWdlJztcclxuaW1wb3J0IHsgTWVzc2FnZVhNTE9iamVjdCB9IGZyb20gJy4uL01lc3NhZ2UvTWVzc2FnZS54bWwnO1xyXG5pbXBvcnQgeyBBc3NpZ25tZW50RXZlbnRYTUxPYmplY3QsIENhbGVuZGFyWE1MT2JqZWN0LCBSZWd1bGFyRXZlbnRYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0NhbGVuZGFyJztcclxuaW1wb3J0IHsgQXNzaWdubWVudEV2ZW50LCBDYWxlbmRhciwgQ2FsZW5kYXJPcHRpb25zLCBFdmVudCwgSG9saWRheUV2ZW50LCBSZWd1bGFyRXZlbnQgfSBmcm9tICcuL0ludGVyZmFjZXMvQ2FsZW5kYXInO1xyXG5pbXBvcnQgeyBlYWNoTW9udGhPZkludGVydmFsIH0gZnJvbSAnZGF0ZS1mbnMnO1xyXG5pbXBvcnQgeyBGaWxlUmVzb3VyY2VYTUxPYmplY3QsIEdyYWRlYm9va1hNTE9iamVjdCwgVVJMUmVzb3VyY2VYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0dyYWRlYm9vayc7XHJcbmltcG9ydCB7IEF0dGVuZGFuY2VYTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL0F0dGVuZGFuY2UnO1xyXG5pbXBvcnQgRXZlbnRUeXBlIGZyb20gJy4uLy4uL0NvbnN0YW50cy9FdmVudFR5cGUnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBBc3NpZ25tZW50LCBGaWxlUmVzb3VyY2UsIEdyYWRlYm9vaywgTWFyaywgVVJMUmVzb3VyY2UsIFdlaWdodGVkQ2F0ZWdvcnkgfSBmcm9tICcuL0ludGVyZmFjZXMvR3JhZGVib29rJztcclxuaW1wb3J0IGFzeW5jUG9vbCBmcm9tICd0aW55LWFzeW5jLXBvb2wnO1xyXG5pbXBvcnQgUmVzb3VyY2VUeXBlIGZyb20gJy4uLy4uL0NvbnN0YW50cy9SZXNvdXJjZVR5cGUnO1xyXG5pbXBvcnQgeyBBYnNlbnRQZXJpb2QsIEF0dGVuZGFuY2UsIFBlcmlvZEluZm8gfSBmcm9tICcuL0ludGVyZmFjZXMvQXR0ZW5kYW5jZSc7XHJcbmltcG9ydCB7IFNjaGVkdWxlWE1MT2JqZWN0IH0gZnJvbSAnLi9JbnRlcmZhY2VzL3htbC9TY2hlZHVsZSc7XHJcbmltcG9ydCB7IFNjaGVkdWxlIH0gZnJvbSAnLi9DbGllbnQuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFNjaG9vbEluZm9YTUxPYmplY3QgfSBmcm9tICcuL0ludGVyZmFjZXMveG1sL1NjaG9vbEluZm8nO1xyXG5pbXBvcnQgeyBSZXBvcnRDYXJkc1hNTE9iamVjdCB9IGZyb20gJy4uL1JlcG9ydENhcmQvUmVwb3J0Q2FyZC54bWwnO1xyXG5pbXBvcnQgeyBEb2N1bWVudFhNTE9iamVjdCB9IGZyb20gJy4uL0RvY3VtZW50L0RvY3VtZW50LnhtbCc7XHJcbmltcG9ydCBSZXBvcnRDYXJkIGZyb20gJy4uL1JlcG9ydENhcmQvUmVwb3J0Q2FyZCc7XHJcbmltcG9ydCBEb2N1bWVudCBmcm9tICcuLi9Eb2N1bWVudC9Eb2N1bWVudCc7XHJcbmltcG9ydCBSZXF1ZXN0RXhjZXB0aW9uIGZyb20gJy4uL1JlcXVlc3RFeGNlcHRpb24vUmVxdWVzdEV4Y2VwdGlvbic7XHJcblxyXG4vKipcclxuICogVGhlIFN0dWRlbnRWVUUgQ2xpZW50IHRvIGFjY2VzcyB0aGUgQVBJXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQgZXh0ZW5kcyBzb2FwLkNsaWVudCB7XHJcbiAgcHJpdmF0ZSBob3N0VXJsOiBzdHJpbmc7XHJcbiAgY29uc3RydWN0b3IoY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsIGhvc3RVcmw6IHN0cmluZykge1xyXG4gICAgc3VwZXIoY3JlZGVudGlhbHMpO1xyXG4gICAgdGhpcy5ob3N0VXJsID0gaG9zdFVybDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFZhbGlkYXRlJ3MgdGhlIHVzZXIncyBjcmVkZW50aWFscy4gSXQgd2lsbCB0aHJvdyBhbiBlcnJvciBpZiBjcmVkZW50aWFscyBhcmUgaW5jb3JyZWN0XHJcbiAgICovXHJcbiAgcHVibGljIHZhbGlkYXRlQ3JlZGVudGlhbHMoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFBhcnNlZFJlcXVlc3RFcnJvcj4oeyBtZXRob2ROYW1lOiAnbG9naW4gdGVzdCcsIHZhbGlkYXRlRXJyb3JzOiBmYWxzZSB9KVxyXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLlJUX0VSUk9SWzBdWydAX0VSUk9SX01FU1NBR0UnXVswXSA9PT0gJ2xvZ2luIHRlc3QgaXMgbm90IGEgdmFsaWQgbWV0aG9kLicpIHJlcygpO1xyXG4gICAgICAgICAgZWxzZSByZWoobmV3IFJlcXVlc3RFeGNlcHRpb24ocmVzcG9uc2UpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBzdHVkZW50J3MgZG9jdW1lbnRzIGZyb20gc3luZXJneSBzZXJ2ZXJzXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8RG9jdW1lbnRbXT59PiBSZXR1cm5zIGEgbGlzdCBvZiBzdHVkZW50IGRvY3VtZW50c1xyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY29uc3QgZG9jdW1lbnRzID0gYXdhaXQgY2xpZW50LmRvY3VtZW50cygpO1xyXG4gICAqIGNvbnN0IGRvY3VtZW50ID0gZG9jdW1lbnRzWzBdO1xyXG4gICAqIGNvbnN0IGZpbGVzID0gYXdhaXQgZG9jdW1lbnQuZ2V0KCk7XHJcbiAgICogY29uc3QgYmFzZTY0Y29sbGVjdGlvbiA9IGZpbGVzLm1hcCgoZmlsZSkgPT4gZmlsZS5iYXNlNjQpO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBkb2N1bWVudHMoKTogUHJvbWlzZTxEb2N1bWVudFtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PERvY3VtZW50WE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnR2V0U3R1ZGVudERvY3VtZW50SW5pdGlhbERhdGEnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKFxyXG4gICAgICAgICAgICB4bWxPYmplY3RbJ1N0dWRlbnREb2N1bWVudHMnXVswXS5TdHVkZW50RG9jdW1lbnREYXRhc1swXS5TdHVkZW50RG9jdW1lbnREYXRhLm1hcChcclxuICAgICAgICAgICAgICAoeG1sKSA9PiBuZXcgRG9jdW1lbnQoeG1sLCBzdXBlci5jcmVkZW50aWFscylcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIGEgbGlzdCBvZiByZXBvcnQgY2FyZHNcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxSZXBvcnRDYXJkW10+fSBSZXR1cm5zIGEgbGlzdCBvZiByZXBvcnQgY2FyZHMgdGhhdCBjYW4gZmV0Y2ggYSBmaWxlXHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCByZXBvcnRDYXJkcyA9IGF3YWl0IGNsaWVudC5yZXBvcnRDYXJkcygpO1xyXG4gICAqIGNvbnN0IGZpbGVzID0gYXdhaXQgUHJvbWlzZS5hbGwocmVwb3J0Q2FyZHMubWFwKChjYXJkKSA9PiBjYXJkLmdldCgpKSk7XHJcbiAgICogY29uc3QgYmFzZTY0YXJyID0gZmlsZXMubWFwKChmaWxlKSA9PiBmaWxlLmJhc2U2NCk7IC8vIFtcIkpWQkVSaTAuLi5cIiwgXCJkVUlvYTEuLi5cIiwgLi4uXTtcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgcmVwb3J0Q2FyZHMoKTogUHJvbWlzZTxSZXBvcnRDYXJkW10+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8UmVwb3J0Q2FyZHNYTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdHZXRSZXBvcnRDYXJkSW5pdGlhbERhdGEnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgcmVzKFxyXG4gICAgICAgICAgICB4bWxPYmplY3QuUkNSZXBvcnRpbmdQZXJpb2REYXRhWzBdLlJDUmVwb3J0aW5nUGVyaW9kc1swXS5SQ1JlcG9ydGluZ1BlcmlvZC5tYXAoXHJcbiAgICAgICAgICAgICAgKHhtbCkgPT4gbmV3IFJlcG9ydENhcmQoeG1sLCBzdXBlci5jcmVkZW50aWFscylcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBzdHVkZW50J3Mgc2Nob29sJ3MgaW5mb3JtYXRpb25cclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTY2hvb2xJbmZvPn0gUmV0dXJucyB0aGUgaW5mb3JtYXRpb24gb2YgdGhlIHN0dWRlbnQncyBzY2hvb2xcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGF3YWl0IGNsaWVudC5zY2hvb2xJbmZvKCk7XHJcbiAgICpcclxuICAgKiBjbGllbnQuc2Nob29sSW5mbygpLnRoZW4oKHNjaG9vbEluZm8pID0+IHtcclxuICAgKiAgY29uc29sZS5sb2coXy51bmlxKHNjaG9vbEluZm8uc3RhZmYubWFwKChzdGFmZikgPT4gc3RhZmYubmFtZSkpKTsgLy8gTGlzdCBhbGwgc3RhZmYgcG9zaXRpb25zIHVzaW5nIGxvZGFzaFxyXG4gICAqIH0pXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIHNjaG9vbEluZm8oKTogUHJvbWlzZTxTY2hvb2xJbmZvPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFNjaG9vbEluZm9YTUxPYmplY3Q+KHtcclxuICAgICAgICAgIG1ldGhvZE5hbWU6ICdTdHVkZW50U2Nob29sSW5mbycsXHJcbiAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElEOiAwIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeyBTdHVkZW50U2Nob29sSW5mb0xpc3Rpbmc6IFt4bWxPYmplY3RdIH0pID0+IHtcclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIHNjaG9vbDoge1xyXG4gICAgICAgICAgICAgIGFkZHJlc3M6IHhtbE9iamVjdFsnQF9TY2hvb2xBZGRyZXNzJ11bMF0sXHJcbiAgICAgICAgICAgICAgYWRkcmVzc0FsdDogeG1sT2JqZWN0WydAX1NjaG9vbEFkZHJlc3MyJ11bMF0sXHJcbiAgICAgICAgICAgICAgY2l0eTogeG1sT2JqZWN0WydAX1NjaG9vbENpdHknXVswXSxcclxuICAgICAgICAgICAgICB6aXBDb2RlOiB4bWxPYmplY3RbJ0BfU2Nob29sWmlwJ11bMF0sXHJcbiAgICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdFsnQF9QaG9uZSddWzBdLFxyXG4gICAgICAgICAgICAgIGFsdFBob25lOiB4bWxPYmplY3RbJ0BfUGhvbmUyJ11bMF0sXHJcbiAgICAgICAgICAgICAgcHJpbmNpcGFsOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogeG1sT2JqZWN0WydAX1ByaW5jaXBhbEVtYWlsJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBzdGFmZkd1OiB4bWxPYmplY3RbJ0BfUHJpbmNpcGFsR3UnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdGFmZjogeG1sT2JqZWN0LlN0YWZmTGlzdHNbMF0uU3RhZmZMaXN0Lm1hcCgoc3RhZmYpID0+ICh7XHJcbiAgICAgICAgICAgICAgbmFtZTogc3RhZmZbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIGVtYWlsOiBzdGFmZlsnQF9FTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgIHN0YWZmR3U6IHN0YWZmWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICBqb2JUaXRsZTogc3RhZmZbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICBleHRuOiBzdGFmZlsnQF9FeHRuJ11bMF0sXHJcbiAgICAgICAgICAgICAgcGhvbmU6IHN0YWZmWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHNjaGVkdWxlIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRlcm1JbmRleCBUaGUgaW5kZXggb2YgdGhlIHRlcm0uXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8U2NoZWR1bGU+fSBSZXR1cm5zIHRoZSBzY2hlZHVsZSBvZiB0aGUgc3R1ZGVudFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogYXdhaXQgc2NoZWR1bGUoMCkgLy8gLT4geyB0ZXJtOiB7IGluZGV4OiAwLCBuYW1lOiAnMXN0IFF0ciBQcm9ncmVzcycgfSwgLi4uIH1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc2NoZWR1bGUodGVybUluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxTY2hlZHVsZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxTY2hlZHVsZVhNTE9iamVjdD4oe1xyXG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1N0dWRlbnRDbGFzc0xpc3QnLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgLi4uKHRlcm1JbmRleCAhPSBudWxsID8geyBUZXJtSW5kZXg6IHRlcm1JbmRleCB9IDoge30pIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICByZXMoe1xyXG4gICAgICAgICAgICB0ZXJtOiB7XHJcbiAgICAgICAgICAgICAgaW5kZXg6IE51bWJlcih4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfVGVybUluZGV4J11bMF0pLFxyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXVsnQF9UZXJtSW5kZXhOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF1bJ0BfRXJyb3JNZXNzYWdlJ11bMF0sXHJcbiAgICAgICAgICAgIHRvZGF5OlxyXG4gICAgICAgICAgICAgIHR5cGVvZiB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVG9kYXlTY2hlZHVsZUluZm9EYXRhWzBdLlNjaG9vbEluZm9zWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgPyB4bWxPYmplY3QuU3R1ZGVudENsYXNzU2NoZWR1bGVbMF0uVG9kYXlTY2hlZHVsZUluZm9EYXRhWzBdLlNjaG9vbEluZm9zWzBdLlNjaG9vbEluZm8ubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgIChzY2hvb2wpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzY2hvb2xbJ0BfU2Nob29sTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYmVsbFNjaGVkdWxlTmFtZTogc2Nob29sWydAX0JlbGxTY2hlZE5hbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXM6IHNjaG9vbC5DbGFzc2VzWzBdLkNsYXNzSW5mby5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChjb3Vyc2UpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZDogTnVtYmVyKGNvdXJzZVsnQF9QZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRlbmRhbmNlQ29kZTogY291cnNlLkF0dGVuZGFuY2VDb2RlWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoY291cnNlWydAX1N0YXJ0RGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShjb3Vyc2VbJ0BfRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfQ2xhc3NOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWN0aW9uR3U6IGNvdXJzZVsnQF9TZWN0aW9uR1UnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlYWNoZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGNvdXJzZVsnQF9UZWFjaGVyRW1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWxTdWJqZWN0OiBjb3Vyc2VbJ0BfRW1haWxTdWJqZWN0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvdXJzZVsnQF9UZWFjaGVyTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFmZkd1OiBjb3Vyc2VbJ0BfU3RhZmZHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGNvdXJzZVsnQF9UZWFjaGVyVVJMJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgQ2xhc3NTY2hlZHVsZUluZm8pXHJcbiAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgIGNsYXNzZXM6IHhtbE9iamVjdC5TdHVkZW50Q2xhc3NTY2hlZHVsZVswXS5DbGFzc0xpc3RzWzBdLkNsYXNzTGlzdGluZy5tYXAoKHN0dWRlbnRDbGFzcykgPT4gKHtcclxuICAgICAgICAgICAgICBuYW1lOiBzdHVkZW50Q2xhc3NbJ0BfQ291cnNlVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihzdHVkZW50Q2xhc3NbJ0BfUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHJvb206IHN0dWRlbnRDbGFzc1snQF9Sb29tTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIHNlY3Rpb25HdTogc3R1ZGVudENsYXNzWydAX1NlY3Rpb25HVSddWzBdLFxyXG4gICAgICAgICAgICAgIHRlYWNoZXI6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IHN0dWRlbnRDbGFzc1snQF9UZWFjaGVyJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogc3R1ZGVudENsYXNzWydAX1RlYWNoZXJFbWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgc3RhZmZHdTogc3R1ZGVudENsYXNzWydAX1RlYWNoZXJTdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgICB0ZXJtczogeG1sT2JqZWN0LlN0dWRlbnRDbGFzc1NjaGVkdWxlWzBdLlRlcm1MaXN0c1swXS5UZXJtTGlzdGluZy5tYXAoKHRlcm0pID0+ICh7XHJcbiAgICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHRlcm1bJ0BfQmVnaW5EYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZSh0ZXJtWydAX0VuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBpbmRleDogTnVtYmVyKHRlcm1bJ0BfVGVybUluZGV4J11bMF0pLFxyXG4gICAgICAgICAgICAgIG5hbWU6IHRlcm1bJ0BfVGVybU5hbWUnXVswXSxcclxuICAgICAgICAgICAgICBzY2hvb2xZZWFyVGVybUNvZGVHdTogdGVybVsnQF9TY2hvb2xZZWFyVHJtQ29kZUdVJ11bMF0sXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGF0dGVuZGFuY2Ugb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBdHRlbmRhbmNlPn0gUmV0dXJucyBhbiBBdHRlbmRhbmNlIG9iamVjdFxyXG4gICAqIEBkZXNjcmlwdGlvblxyXG4gICAqIGBgYGpzXHJcbiAgICogY2xpZW50LmF0dGVuZGFuY2UoKVxyXG4gICAqICAudGhlbihjb25zb2xlLmxvZyk7IC8vIC0+IHsgdHlwZTogJ1BlcmlvZCcsIHBlcmlvZDogey4uLn0sIHNjaG9vbE5hbWU6ICdVbml2ZXJzaXR5IEhpZ2ggU2Nob29sJywgYWJzZW5jZXM6IFsuLi5dLCBwZXJpb2RJbmZvczogWy4uLl0gfVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBhdHRlbmRhbmNlKCk6IFByb21pc2U8QXR0ZW5kYW5jZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICBzdXBlclxyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdDxBdHRlbmRhbmNlWE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnQXR0ZW5kYW5jZScsXHJcbiAgICAgICAgICBwYXJhbVN0cjoge1xyXG4gICAgICAgICAgICBjaGlsZEludElkOiAwLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKChhdHRlbmRhbmNlWE1MT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB4bWxPYmplY3QgPSBhdHRlbmRhbmNlWE1MT2JqZWN0LkF0dGVuZGFuY2VbMF07XHJcblxyXG4gICAgICAgICAgcmVzKHtcclxuICAgICAgICAgICAgdHlwZTogeG1sT2JqZWN0WydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgcGVyaW9kOiB7XHJcbiAgICAgICAgICAgICAgdG90YWw6IE51bWJlcih4bWxPYmplY3RbJ0BfUGVyaW9kQ291bnQnXVswXSksXHJcbiAgICAgICAgICAgICAgc3RhcnQ6IE51bWJlcih4bWxPYmplY3RbJ0BfU3RhcnRQZXJpb2QnXVswXSksXHJcbiAgICAgICAgICAgICAgZW5kOiBOdW1iZXIoeG1sT2JqZWN0WydAX0VuZFBlcmlvZCddWzBdKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2Nob29sTmFtZTogeG1sT2JqZWN0WydAX1NjaG9vbE5hbWUnXVswXSxcclxuICAgICAgICAgICAgYWJzZW5jZXM6IHhtbE9iamVjdC5BYnNlbmNlc1swXS5BYnNlbmNlLm1hcCgoYWJzZW5jZSkgPT4gKHtcclxuICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShhYnNlbmNlWydAX0Fic2VuY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHJlYXNvbjogYWJzZW5jZVsnQF9SZWFzb24nXVswXSxcclxuICAgICAgICAgICAgICBub3RlOiBhYnNlbmNlWydAX05vdGUnXVswXSxcclxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYWJzZW5jZVsnQF9Db2RlQWxsRGF5RGVzY3JpcHRpb24nXVswXSxcclxuICAgICAgICAgICAgICBwZXJpb2RzOiBhYnNlbmNlLlBlcmlvZHNbMF0uUGVyaW9kLm1hcChcclxuICAgICAgICAgICAgICAgIChwZXJpb2QpID0+XHJcbiAgICAgICAgICAgICAgICAgICh7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIocGVyaW9kWydAX051bWJlciddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlYXNvbjogcGVyaW9kWydAX1JlYXNvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvdXJzZTogcGVyaW9kWydAX0NvdXJzZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWZmOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfU3RhZmYnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgIHN0YWZmR3U6IHBlcmlvZFsnQF9TdGFmZkdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogcGVyaW9kWydAX1N0YWZmRU1haWwnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9yZ1llYXJHdTogcGVyaW9kWydAX09yZ1llYXJHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICB9IGFzIEFic2VudFBlcmlvZClcclxuICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICAgIHBlcmlvZEluZm9zOiB4bWxPYmplY3QuVG90YWxBY3Rpdml0aWVzWzBdLlBlcmlvZFRvdGFsLm1hcCgocGQsIGkpID0+ICh7XHJcbiAgICAgICAgICAgICAgcGVyaW9kOiBOdW1iZXIocGRbJ0BfTnVtYmVyJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHRvdGFsOiB7XHJcbiAgICAgICAgICAgICAgICBleGN1c2VkOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsRXhjdXNlZFswXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICAgIHRhcmRpZXM6IE51bWJlcih4bWxPYmplY3QuVG90YWxUYXJkaWVzWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgdW5leGN1c2VkOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVW5leGN1c2VkWzBdLlBlcmlvZFRvdGFsW2ldWydAX1RvdGFsJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgYWN0aXZpdGllczogTnVtYmVyKHhtbE9iamVjdC5Ub3RhbEFjdGl2aXRpZXNbMF0uUGVyaW9kVG90YWxbaV1bJ0BfVG90YWwnXVswXSksXHJcbiAgICAgICAgICAgICAgICB1bmV4Y3VzZWRUYXJkaWVzOiBOdW1iZXIoeG1sT2JqZWN0LlRvdGFsVW5leGN1c2VkVGFyZGllc1swXS5QZXJpb2RUb3RhbFtpXVsnQF9Ub3RhbCddWzBdKSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KSkgYXMgUGVyaW9kSW5mb1tdLFxyXG4gICAgICAgICAgfSBhcyBBdHRlbmRhbmNlKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBncmFkZWJvb2sgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcGFyYW0ge251bWJlcn0gcmVwb3J0aW5nUGVyaW9kSW5kZXggVGhlIHRpbWVmcmFtZSB0aGF0IHRoZSBncmFkZWJvb2sgc2hvdWxkIHJldHVyblxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEdyYWRlYm9vaz59IFJldHVybnMgYSBHcmFkZWJvb2sgb2JqZWN0XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBjb25zdCBncmFkZWJvb2sgPSBhd2FpdCBjbGllbnQuZ3JhZGVib29rKCk7XHJcbiAgICogY29uc29sZS5sb2coZ3JhZGVib29rKTsgLy8geyBlcnJvcjogJycsIHR5cGU6ICdUcmFkaXRpb25hbCcsIHJlcG9ydGluZ1BlcmlvZDogey4uLn0sIGNvdXJzZXM6IFsuLi5dIH07XHJcbiAgICpcclxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDApIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggMCBhcyBcIjFzdCBRdWFydGVyIFByb2dyZXNzXCJcclxuICAgKiBhd2FpdCBjbGllbnQuZ3JhZGVib29rKDcpIC8vIFNvbWUgc2Nob29scyB3aWxsIGhhdmUgUmVwb3J0aW5nUGVyaW9kSW5kZXggNyBhcyBcIjR0aCBRdWFydGVyXCJcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgZ3JhZGVib29rKHJlcG9ydGluZ1BlcmlvZEluZGV4PzogbnVtYmVyKTogUHJvbWlzZTxHcmFkZWJvb2s+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgc3VwZXJcclxuICAgICAgICAucHJvY2Vzc1JlcXVlc3Q8R3JhZGVib29rWE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnR3JhZGVib29rJyxcclxuICAgICAgICAgIHBhcmFtU3RyOiB7IGNoaWxkSW50SWQ6IDAsIC4uLihyZXBvcnRpbmdQZXJpb2RJbmRleCA/IHsgUmVwb3J0aW5nUGVyaW9kOiByZXBvcnRpbmdQZXJpb2RJbmRleCB9IDoge30pIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoeG1sT2JqZWN0OiBHcmFkZWJvb2tYTUxPYmplY3QpID0+IHtcclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIGVycm9yOiB4bWxPYmplY3QuR3JhZGVib29rWzBdWydAX0Vycm9yTWVzc2FnZSddWzBdLFxyXG4gICAgICAgICAgICB0eXBlOiB4bWxPYmplY3QuR3JhZGVib29rWzBdWydAX1R5cGUnXVswXSxcclxuICAgICAgICAgICAgcmVwb3J0aW5nUGVyaW9kOiB7XHJcbiAgICAgICAgICAgICAgY3VycmVudDoge1xyXG4gICAgICAgICAgICAgICAgaW5kZXg6XHJcbiAgICAgICAgICAgICAgICAgIHJlcG9ydGluZ1BlcmlvZEluZGV4ID8/XHJcbiAgICAgICAgICAgICAgICAgIE51bWJlcihcclxuICAgICAgICAgICAgICAgICAgICB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZHNbMF0uUmVwb3J0UGVyaW9kLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAoeCkgPT4geFsnQF9HcmFkZVBlcmlvZCddWzBdID09PSB4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9HcmFkZVBlcmlvZCddWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgKT8uWydAX0luZGV4J11bMF1cclxuICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIGRhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX1N0YXJ0RGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZSh4bWxPYmplY3QuR3JhZGVib29rWzBdLlJlcG9ydGluZ1BlcmlvZFswXVsnQF9FbmREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kWzBdWydAX0dyYWRlUGVyaW9kJ11bMF0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBhdmFpbGFibGU6IHhtbE9iamVjdC5HcmFkZWJvb2tbMF0uUmVwb3J0aW5nUGVyaW9kc1swXS5SZXBvcnRQZXJpb2QubWFwKChwZXJpb2QpID0+ICh7XHJcbiAgICAgICAgICAgICAgICBkYXRlOiB7IHN0YXJ0OiBuZXcgRGF0ZShwZXJpb2RbJ0BfU3RhcnREYXRlJ11bMF0pLCBlbmQ6IG5ldyBEYXRlKHBlcmlvZFsnQF9FbmREYXRlJ11bMF0pIH0sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBwZXJpb2RbJ0BfR3JhZGVQZXJpb2QnXVswXSxcclxuICAgICAgICAgICAgICAgIGluZGV4OiBOdW1iZXIocGVyaW9kWydAX0luZGV4J11bMF0pLFxyXG4gICAgICAgICAgICAgIH0pKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY291cnNlczogeG1sT2JqZWN0LkdyYWRlYm9va1swXS5Db3Vyc2VzWzBdLkNvdXJzZS5tYXAoKGNvdXJzZSkgPT4gKHtcclxuICAgICAgICAgICAgICBwZXJpb2Q6IE51bWJlcihjb3Vyc2VbJ0BfUGVyaW9kJ11bMF0pLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiBjb3Vyc2VbJ0BfVGl0bGUnXVswXSxcclxuICAgICAgICAgICAgICByb29tOiBjb3Vyc2VbJ0BfUm9vbSddWzBdLFxyXG4gICAgICAgICAgICAgIHN0YWZmOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBjb3Vyc2VbJ0BfU3RhZmYnXVswXSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBjb3Vyc2VbJ0BfU3RhZmZFTWFpbCddWzBdLFxyXG4gICAgICAgICAgICAgICAgc3RhZmZHdTogY291cnNlWydAX1N0YWZmR1UnXVswXSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIG1hcmtzOiBjb3Vyc2UuTWFya3NbMF0uTWFyay5tYXAoKG1hcmspID0+ICh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBtYXJrWydAX01hcmtOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICBjYWxjdWxhdGVkU2NvcmU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RyaW5nOiBtYXJrWydAX0NhbGN1bGF0ZWRTY29yZVN0cmluZyddWzBdLFxyXG4gICAgICAgICAgICAgICAgICByYXc6IE51bWJlcihtYXJrWydAX0NhbGN1bGF0ZWRTY29yZVJhdyddWzBdKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZENhdGVnb3JpZXM6XHJcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiBtYXJrWydHcmFkZUNhbGN1bGF0aW9uU3VtbWFyeSddWzBdICE9PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgID8gbWFya1snR3JhZGVDYWxjdWxhdGlvblN1bW1hcnknXVswXS5Bc3NpZ25tZW50R3JhZGVDYWxjLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHdlaWdodGVkKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB3ZWlnaHRlZFsnQF9UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkTWFyazogd2VpZ2h0ZWRbJ0BfQ2FsY3VsYXRlZE1hcmsnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmFsdWF0ZWQ6IHdlaWdodGVkWydAX1dlaWdodGVkUGN0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkOiB3ZWlnaHRlZFsnQF9XZWlnaHQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDogTnVtYmVyKHdlaWdodGVkWydAX1BvaW50cyddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zc2libGU6IE51bWJlcih3ZWlnaHRlZFsnQF9Qb2ludHNQb3NzaWJsZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBXZWlnaHRlZENhdGVnb3J5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgIDogW10sXHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50czogbWFyay5Bc3NpZ25tZW50c1swXS5Bc3NpZ25tZW50Lm1hcCgoYXNzaWdubWVudCkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgZ3JhZGVib29rSWQ6IGFzc2lnbm1lbnRbJ0BfR3JhZGVib29rSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgbmFtZTogYXNzaWdubWVudFsnQF9NZWFzdXJlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6IGFzc2lnbm1lbnRbJ0BfVHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICBkdWU6IG5ldyBEYXRlKGFzc2lnbm1lbnRbJ0BfRHVlRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgc2NvcmU6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBhc3NpZ25tZW50WydAX1Njb3JlVHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBhc3NpZ25tZW50WydAX1Njb3JlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIHBvaW50czogYXNzaWdubWVudFsnQF9Qb2ludHMnXVswXSxcclxuICAgICAgICAgICAgICAgICAgbm90ZXM6IGFzc2lnbm1lbnRbJ0BfTm90ZXMnXVswXSxcclxuICAgICAgICAgICAgICAgICAgdGVhY2hlcklkOiBhc3NpZ25tZW50WydAX1RlYWNoZXJJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYXNzaWdubWVudFsnQF9NZWFzdXJlRGVzY3JpcHRpb24nXVswXSxcclxuICAgICAgICAgICAgICAgICAgaGFzRHJvcGJveDogSlNPTi5wYXJzZShhc3NpZ25tZW50WydAX0hhc0Ryb3BCb3gnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgIHN0dWRlbnRJZDogYXNzaWdubWVudFsnQF9TdHVkZW50SUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgZHJvcGJveERhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9Ecm9wU3RhcnREYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoYXNzaWdubWVudFsnQF9Ecm9wRW5kRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgcmVzb3VyY2VzOlxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBhc3NpZ25tZW50LlJlc291cmNlc1swXSAhPT0gJ3N0cmluZydcclxuICAgICAgICAgICAgICAgICAgICAgID8gKGFzc2lnbm1lbnQuUmVzb3VyY2VzWzBdLlJlc291cmNlLm1hcCgocnNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocnNyY1snQF9UeXBlJ11bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ0ZpbGUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVSc3JjID0gcnNyYyBhcyBGaWxlUmVzb3VyY2VYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUmVzb3VyY2VUeXBlLkZJTEUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlsZVJzcmNbJ0BfRmlsZVR5cGUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVSc3JjWydAX0ZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmk6IHRoaXMuaG9zdFVybCArIGZpbGVSc3JjWydAX1NlcnZlckZpbGVOYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZmlsZVJzcmNbJ0BfUmVzb3VyY2VEYXRlJ11bMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGZpbGVSc3JjWydAX1Jlc291cmNlSUQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVSc3JjWydAX1Jlc291cmNlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgRmlsZVJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnVVJMJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmxSc3JjID0gcnNyYyBhcyBVUkxSZXNvdXJjZVhNTE9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybFJzcmNbJ0BfVVJMJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUmVzb3VyY2VUeXBlLlVSTCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUodXJsUnNyY1snQF9SZXNvdXJjZURhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdXJsUnNyY1snQF9SZXNvdXJjZUlEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB1cmxSc3JjWydAX1Jlc291cmNlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVybFJzcmNbJ0BfUmVzb3VyY2VEZXNjcmlwdGlvbiddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogdXJsUnNyY1snQF9TZXJ2ZXJGaWxlTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFVSTFJlc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqKGBUeXBlICR7cnNyY1snQF9UeXBlJ11bMF19IGRvZXMgbm90IGV4aXN0IGFzIGEgdHlwZS4gQWRkIGl0IHRvIHR5cGUgZGVjbGFyYXRpb25zLmApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkgYXMgKEZpbGVSZXNvdXJjZSB8IFVSTFJlc291cmNlKVtdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBbXSxcclxuICAgICAgICAgICAgICAgIH0pKSBhcyBBc3NpZ25tZW50W10sXHJcbiAgICAgICAgICAgICAgfSkpIGFzIE1hcmtbXSxcclxuICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgfSBhcyBHcmFkZWJvb2spO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhIGxpc3Qgb2YgbWVzc2FnZXMgb2YgdGhlIHN0dWRlbnRcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxNZXNzYWdlW10+fSBSZXR1cm5zIGFuIGFycmF5IG9mIG1lc3NhZ2VzIG9mIHRoZSBzdHVkZW50XHJcbiAgICogQGRlc2NyaXB0aW9uXHJcbiAgICogYGBganNcclxuICAgKiBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTsgLy8gLT4gW3sgaWQ6ICdFOTcyRjFCQy05OUEwLTRDRDAtOEQxNS1CMTg5NjhCNDNFMDgnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH0sIHsgaWQ6ICc4NkZEQTExRC00MkM3LTQyNDktQjAwMy05NEIxNUVCMkM4RDQnLCB0eXBlOiAnU3R1ZGVudEFjdGl2aXR5JywgLi4uIH1dXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIG1lc3NhZ2VzKCk6IFByb21pc2U8TWVzc2FnZVtdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PE1lc3NhZ2VYTUxPYmplY3Q+KFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBtZXRob2ROYW1lOiAnR2V0UFhQTWVzc2FnZXMnLFxyXG4gICAgICAgICAgICBwYXJhbVN0cjogeyBjaGlsZEludElkOiAwIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKHhtbCkgPT4ge1xyXG4gICAgICAgICAgICAvLyB4bWwucmVwbGFjZSgvKD88PUNvbnRlbnQ9XCIpLiooPz1cIlxcc1JlYWQpL2csIGJ0b2EpXHJcbiAgICAgICAgICAgIGNvbnN0IENvbnRlbnQgPSAoeG1sLm1hdGNoKC9Db250ZW50PVwiLipcIiBSZWFkL2cpID8/IFsnJ10pWzBdO1xyXG4gICAgICAgICAgICBjb25zdCBiYXNlNjQgPSBidG9hKENvbnRlbnQuc3Vic3RyaW5nKDksIENvbnRlbnQubGVuZ3RoIC0gNikpO1xyXG4gICAgICAgICAgICByZXR1cm4geG1sLnJlcGxhY2UoL0NvbnRlbnQ9XCIuKlwiIFJlYWQvZywgYENvbnRlbnQ9XCIke2Jhc2U2NH1cIiBSZWFkYCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgICAgIC50aGVuKCh4bWxPYmplY3QpID0+IHtcclxuICAgICAgICAgIHJlcyhcclxuICAgICAgICAgICAgeG1sT2JqZWN0LlBYUE1lc3NhZ2VzRGF0YVswXS5NZXNzYWdlTGlzdGluZ3NbMF0uTWVzc2FnZUxpc3RpbmcubWFwKFxyXG4gICAgICAgICAgICAgIChtZXNzYWdlKSA9PiBuZXcgTWVzc2FnZShtZXNzYWdlLCBzdXBlci5jcmVkZW50aWFscywgdGhpcy5ob3N0VXJsKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlaik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGluZm8gb2YgYSBzdHVkZW50XHJcbiAgICogQHJldHVybnMge1Byb21pc2U8U3R1ZGVudEluZm8+fSBTdHVkZW50SW5mbyBvYmplY3RcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIHN0dWRlbnRJbmZvKCkudGhlbihjb25zb2xlLmxvZykgLy8gLT4geyBzdHVkZW50OiB7IG5hbWU6ICdFdmFuIERhdmlzJywgbmlja25hbWU6ICcnLCBsYXN0TmFtZTogJ0RhdmlzJyB9LCAuLi59XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgcHVibGljIHN0dWRlbnRJbmZvKCk6IFByb21pc2U8U3R1ZGVudEluZm8+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxTdHVkZW50SW5mbz4oKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIHN1cGVyXHJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0PFN0dWRlbnRJbmZvWE1MT2JqZWN0Pih7XHJcbiAgICAgICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudEluZm8nLFxyXG4gICAgICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHhtbE9iamVjdERhdGEpID0+IHtcclxuICAgICAgICAgIHJlcyh7XHJcbiAgICAgICAgICAgIHN0dWRlbnQ6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkZvcm1hdHRlZE5hbWVbMF0sXHJcbiAgICAgICAgICAgICAgbGFzdE5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5MYXN0TmFtZUdvZXNCeVswXSxcclxuICAgICAgICAgICAgICBuaWNrbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLk5pY2tOYW1lWzBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBiaXJ0aERhdGU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5CaXJ0aERhdGVbMF0sXHJcbiAgICAgICAgICAgIHRyYWNrOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uVHJhY2tbMF0sXHJcbiAgICAgICAgICAgIGFkZHJlc3M6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5iclswXSxcclxuICAgICAgICAgICAgY291bnNlbG9yOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkNvdW5zZWxvck5hbWVbMF0sXHJcbiAgICAgICAgICAgICAgZW1haWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Db3Vuc2Vsb3JFbWFpbFswXSxcclxuICAgICAgICAgICAgICBzdGFmZkd1OiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uQ291bnNlbG9yU3RhZmZHVVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3VycmVudFNjaG9vbDogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkN1cnJlbnRTY2hvb2xbMF0sXHJcbiAgICAgICAgICAgIGRlbnRpc3Q6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uRGVudGlzdFswXVsnQF9OYW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgcGhvbmU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5EZW50aXN0WzBdWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfRXh0biddWzBdLFxyXG4gICAgICAgICAgICAgIG9mZmljZTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkRlbnRpc3RbMF1bJ0BfT2ZmaWNlJ11bMF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBoeXNpY2lhbjoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5bMF1bJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgIHBob25lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uUGh5c2ljaWFuWzBdWydAX1Bob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgZXh0bjogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLlBoeXNpY2lhblswXVsnQF9FeHRuJ11bMF0sXHJcbiAgICAgICAgICAgICAgaG9zcGl0YWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5QaHlzaWNpYW5bMF1bJ0BfSG9zcGl0YWwnXVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW1haWw6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5FTWFpbFswXSxcclxuICAgICAgICAgICAgZW1lcmdlbmN5Q29udGFjdHM6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5FbWVyZ2VuY3lDb250YWN0c1swXS5FbWVyZ2VuY3lDb250YWN0Lm1hcChcclxuICAgICAgICAgICAgICAoY29udGFjdCkgPT4gKHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IGNvbnRhY3RbJ0BfTmFtZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgICAgICAgICAgaG9tZTogY29udGFjdFsnQF9Ib21lUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgbW9iaWxlOiBjb250YWN0WydAX01vYmlsZVBob25lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIG90aGVyOiBjb250YWN0WydAX090aGVyUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgd29yazogY29udGFjdFsnQF9Xb3JrUGhvbmUnXVswXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6IGNvbnRhY3RbJ0BfUmVsYXRpb25zaGlwJ11bMF0sXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgZ2VuZGVyOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkdlbmRlclswXSxcclxuICAgICAgICAgICAgZ3JhZGU6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uR3JhZGVbMF0sXHJcbiAgICAgICAgICAgIGxvY2tlckluZm9SZWNvcmRzOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkxvY2tlckluZm9SZWNvcmRzWzBdLFxyXG4gICAgICAgICAgICBob21lTGFuZ3VhZ2U6IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Ib21lTGFuZ3VhZ2VbMF0sXHJcbiAgICAgICAgICAgIGhvbWVSb29tOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZVJvb21bMF0sXHJcbiAgICAgICAgICAgIGhvbWVSb29tVGVhY2hlcjoge1xyXG4gICAgICAgICAgICAgIGVtYWlsOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZVJvb21UY2hFTWFpbFswXSxcclxuICAgICAgICAgICAgICBuYW1lOiB4bWxPYmplY3REYXRhLlN0dWRlbnRJbmZvWzBdLkFkZHJlc3NbMF0uSG9tZVJvb21UY2hbMF0sXHJcbiAgICAgICAgICAgICAgc3RhZmZHdTogeG1sT2JqZWN0RGF0YS5TdHVkZW50SW5mb1swXS5BZGRyZXNzWzBdLkhvbWVSb29tVGNoU3RhZmZHVVswXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWRkaXRpb25hbEluZm86IHhtbE9iamVjdERhdGEuU3R1ZGVudEluZm9bMF0uQWRkcmVzc1swXS5Vc2VyRGVmaW5lZEdyb3VwQm94ZXNbMF0uVXNlckRlZmluZWRHcm91cEJveC5tYXAoXHJcbiAgICAgICAgICAgICAgKGRlZmluZWRCb3gpID0+ICh7XHJcbiAgICAgICAgICAgICAgICBpZDogZGVmaW5lZEJveFsnQF9Hcm91cEJveElEJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBkZWZpbmVkQm94WydAX0dyb3VwQm94TGFiZWwnXVswXSxcclxuICAgICAgICAgICAgICAgIHZjSWQ6IGRlZmluZWRCb3hbJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgaXRlbXM6IGRlZmluZWRCb3guVXNlckRlZmluZWRJdGVtc1swXS5Vc2VyRGVmaW5lZEl0ZW0ubWFwKChpdGVtKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBpdGVtWydAX1NvdXJjZUVsZW1lbnQnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IGl0ZW1bJ0BfU291cmNlT2JqZWN0J11bMF0sXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIHZjSWQ6IGl0ZW1bJ0BfVkNJRCddWzBdLFxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbVsnQF9WYWx1ZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiBpdGVtWydAX0l0ZW1UeXBlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICB9KSkgYXMgQWRkaXRpb25hbEluZm9JdGVtW10sXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKSBhcyBBZGRpdGlvbmFsSW5mb1tdLFxyXG4gICAgICAgICAgfSBhcyBTdHVkZW50SW5mbyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVqKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBmZXRjaEV2ZW50c1dpdGhpbkludGVydmFsKGRhdGU6IERhdGUpIHtcclxuICAgIHJldHVybiBzdXBlci5wcm9jZXNzUmVxdWVzdDxDYWxlbmRhclhNTE9iamVjdD4oe1xyXG4gICAgICBtZXRob2ROYW1lOiAnU3R1ZGVudENhbGVuZGFyJyxcclxuICAgICAgcGFyYW1TdHI6IHsgY2hpbGRJbnRJZDogMCwgUmVxdWVzdERhdGU6IGRhdGUudG9JU09TdHJpbmcoKSB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Q2FsZW5kYXJPcHRpb25zfSBvcHRpb25zIE9wdGlvbnMgdG8gcHJvdmlkZSBmb3IgY2FsZW5kYXIgbWV0aG9kLiBBbiBpbnRlcnZhbCBpcyByZXF1aXJlZC5cclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxDYWxlbmRhcj59IFJldHVybnMgYSBDYWxlbmRhciBvYmplY3RcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBgYGBqc1xyXG4gICAqIGNsaWVudC5jYWxlbmRhcih7IGludGVydmFsOiB7IHN0YXJ0OiBuZXcgRGF0ZSgnNS8xLzIwMjInKSwgZW5kOiBuZXcgRGF0ZSgnOC8xLzIwMjEnKSB9LCBjb25jdXJyZW5jeTogbnVsbCB9KTsgLy8gLT4gTGltaXRsZXNzIGNvbmN1cnJlbmN5IChub3QgcmVjb21tZW5kZWQpXHJcbiAgICpcclxuICAgKiBjb25zdCBjYWxlbmRhciA9IGF3YWl0IGNsaWVudC5jYWxlbmRhcih7IGludGVydmFsOiB7IC4uLiB9fSk7XHJcbiAgICogY29uc29sZS5sb2coY2FsZW5kYXIpOyAvLyAtPiB7IHNjaG9vbERhdGU6IHsuLi59LCBvdXRwdXRSYW5nZTogey4uLn0sIGV2ZW50czogWy4uLl0gfVxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyBjYWxlbmRhcihvcHRpb25zOiBDYWxlbmRhck9wdGlvbnMpOiBQcm9taXNlPENhbGVuZGFyPiB7XHJcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogQ2FsZW5kYXJPcHRpb25zID0ge1xyXG4gICAgICBjb25jdXJyZW5jeTogNyxcclxuICAgICAgLi4ub3B0aW9ucyxcclxuICAgIH07XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNjaG9vbFN0YXJ0RGF0ZTogRGF0ZSB8IG51bWJlciA9IG9wdGlvbnMuaW50ZXJ2YWwuc3RhcnQ7XHJcbiAgICAgIGNvbnN0IHNjaG9vbEVuZERhdGU6IERhdGUgfCBudW1iZXIgPSBvcHRpb25zLmludGVydmFsLmVuZDtcclxuXHJcbiAgICAgIGNvbnN0IG1vbnRoc1dpdGhpblNjaG9vbFllYXIgPSBlYWNoTW9udGhPZkludGVydmFsKHsgc3RhcnQ6IHNjaG9vbFN0YXJ0RGF0ZSwgZW5kOiBzY2hvb2xFbmREYXRlIH0pO1xyXG4gICAgICBjb25zdCBnZXRBbGxFdmVudHNXaXRoaW5TY2hvb2xZZWFyID0gKCk6IFByb21pc2U8Q2FsZW5kYXJYTUxPYmplY3RbXT4gPT5cclxuICAgICAgICBkZWZhdWx0T3B0aW9ucy5jb25jdXJyZW5jeSA9PSBudWxsXHJcbiAgICAgICAgICA/IFByb21pc2UuYWxsKG1vbnRoc1dpdGhpblNjaG9vbFllYXIubWFwKChkYXRlKSA9PiB0aGlzLmZldGNoRXZlbnRzV2l0aGluSW50ZXJ2YWwoZGF0ZSkpKVxyXG4gICAgICAgICAgOiBhc3luY1Bvb2woZGVmYXVsdE9wdGlvbnMuY29uY3VycmVuY3ksIG1vbnRoc1dpdGhpblNjaG9vbFllYXIsIChkYXRlKSA9PlxyXG4gICAgICAgICAgICAgIHRoaXMuZmV0Y2hFdmVudHNXaXRoaW5JbnRlcnZhbChkYXRlKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICBsZXQgbWVtbzogQ2FsZW5kYXIgfCBudWxsID0gbnVsbDtcclxuICAgICAgZ2V0QWxsRXZlbnRzV2l0aGluU2Nob29sWWVhcigpXHJcbiAgICAgICAgLnRoZW4oKGV2ZW50cykgPT4ge1xyXG4gICAgICAgICAgY29uc3QgYWxsRXZlbnRzID0gZXZlbnRzLnJlZHVjZSgocHJldiwgZXZlbnRzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtZW1vID09IG51bGwpXHJcbiAgICAgICAgICAgICAgbWVtbyA9IHtcclxuICAgICAgICAgICAgICAgIHNjaG9vbERhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGV2ZW50cy5DYWxlbmRhckxpc3RpbmdbMF1bJ0BfU2Nob29sQmVnRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShldmVudHMuQ2FsZW5kYXJMaXN0aW5nWzBdWydAX1NjaG9vbEVuZERhdGUnXVswXSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0UmFuZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IHNjaG9vbFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICAgICAgZW5kOiBzY2hvb2xFbmREYXRlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGV2ZW50czogW10sXHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdDogQ2FsZW5kYXIgPSB7XHJcbiAgICAgICAgICAgICAgLi4ubWVtbywgLy8gVGhpcyBpcyB0byBwcmV2ZW50IHJlLWluaXRpYWxpemluZyBEYXRlIG9iamVjdHMgaW4gb3JkZXIgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxyXG4gICAgICAgICAgICAgIGV2ZW50czogW1xyXG4gICAgICAgICAgICAgICAgLi4uKHByZXYuZXZlbnRzID8gcHJldi5ldmVudHMgOiBbXSksXHJcbiAgICAgICAgICAgICAgICAuLi4oZXZlbnRzLkNhbGVuZGFyTGlzdGluZ1swXS5FdmVudExpc3RzWzBdLkV2ZW50TGlzdC5tYXAoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnRbJ0BfRGF5VHlwZSddWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuQVNTSUdOTUVOVDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNzaWdubWVudEV2ZW50ID0gZXZlbnQgYXMgQXNzaWdubWVudEV2ZW50WE1MT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGFzc2lnbm1lbnRFdmVudFsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRMaW5rRGF0YTogYXNzaWdubWVudEV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFndTogYXNzaWdubWVudEV2ZW50WydAX0FHVSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShhc3NpZ25tZW50RXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGd1OiBhc3NpZ25tZW50RXZlbnRbJ0BfREdVJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGFzc2lnbm1lbnRFdmVudFsnQF9MaW5rJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogYXNzaWdubWVudEV2ZW50WydAX1N0YXJ0VGltZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuQVNTSUdOTUVOVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlld1R5cGU6IGFzc2lnbm1lbnRFdmVudFsnQF9WaWV3VHlwZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgfSBhcyBBc3NpZ25tZW50RXZlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLkhPTElEQVk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBldmVudFsnQF9UaXRsZSddWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBFdmVudFR5cGUuSE9MSURBWSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBldmVudFsnQF9TdGFydFRpbWUnXVswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoZXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgIH0gYXMgSG9saWRheUV2ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5SRUdVTEFSOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWd1bGFyRXZlbnQgPSBldmVudCBhcyBSZWd1bGFyRXZlbnRYTUxPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogcmVndWxhckV2ZW50WydAX1RpdGxlJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFndTogcmVndWxhckV2ZW50WydAX0FHVSddID8gcmVndWxhckV2ZW50WydAX0FHVSddIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShyZWd1bGFyRXZlbnRbJ0BfRGF0ZSddWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHJlZ3VsYXJFdmVudFsnQF9FdnREZXNjcmlwdGlvbiddID8gcmVndWxhckV2ZW50WydAX0V2dERlc2NyaXB0aW9uJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRndTogcmVndWxhckV2ZW50WydAX0RHVSddID8gcmVndWxhckV2ZW50WydAX0RHVSddWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiByZWd1bGFyRXZlbnRbJ0BfTGluayddID8gcmVndWxhckV2ZW50WydAX0xpbmsnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiByZWd1bGFyRXZlbnRbJ0BfU3RhcnRUaW1lJ11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEV2ZW50VHlwZS5SRUdVTEFSLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3VHlwZTogcmVndWxhckV2ZW50WydAX1ZpZXdUeXBlJ10gPyByZWd1bGFyRXZlbnRbJ0BfVmlld1R5cGUnXVswXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkTGlua0RhdGE6IHJlZ3VsYXJFdmVudFsnQF9BZGRMaW5rRGF0YSddID8gcmVndWxhckV2ZW50WydAX0FkZExpbmtEYXRhJ11bMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICB9IGFzIFJlZ3VsYXJFdmVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pIGFzIEV2ZW50W10pLFxyXG4gICAgICAgICAgICAgIF0gYXMgRXZlbnRbXSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN0O1xyXG4gICAgICAgICAgfSwge30gYXMgQ2FsZW5kYXIpO1xyXG4gICAgICAgICAgcmVzKHsgLi4uYWxsRXZlbnRzLCBldmVudHM6IF8udW5pcUJ5KGFsbEV2ZW50cy5ldmVudHMsIChpdGVtKSA9PiBpdGVtLnRpdGxlKSB9IGFzIENhbGVuZGFyKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWopO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==