import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import soap from '../../utils/soap/soap';
import { AdditionalInfo, AdditionalInfoItem, StudentInfo } from './Client.interfaces';
import { StudentInfoXMLObject } from './Interfaces/xml/StudentInfo';
import Message from '../Message/Message';
import { MessageXMLObject } from '../Message/Message.xml';
import { AssignmentEventXMLObject, CalendarXMLObject, RegularEventXMLObject } from './Interfaces/xml/Calendar';
import { AssignmentEvent, Calendar, CalendarOptions, Event, HolidayEvent, RegularEvent } from './Interfaces/Calendar';
import { eachMonthOfInterval, isAfter, isBefore, isThisMonth } from 'date-fns';
import { Icon } from '../StudentVue';
import EventType from '../../Constants/EventType';
import _ from 'lodash';
import asyncPool from 'tiny-async-pool';

export default class Client extends soap.Client {
  private hostUrl: string;
  constructor(credentials: LoginCredentials, hostUrl: string) {
    super(credentials);
    this.hostUrl = hostUrl;
  }

  public messages(): Promise<Message[]> {
    return new Promise(async (res, rej) => {
      try {
        const xmlObject: MessageXMLObject = await super.processRequest({
          methodName: 'GetPXPMessages',
          paramStr: { childIntId: 0 },
        });
        res(
          xmlObject.PXPMessagesData[0].MessageListings[0].MessageListing.map(
            (message) => new Message(message, super.credentials, this.hostUrl)
          )
        );
      } catch (e) {
        rej(e);
      }
    });
  }

  public studentInfo(): Promise<StudentInfo> {
    return new Promise<StudentInfo>(async (res, rej) => {
      try {
        const xmlObjectData: StudentInfoXMLObject = await super.processRequest({
          methodName: 'StudentInfo',
          paramStr: { childIntId: 0 },
        });

        res({
          student: {
            name: xmlObjectData.StudentInfo[0].FormattedName[0],
            lastName: xmlObjectData.StudentInfo[0].Address[0].LastNameGoesBy[0],
            nickname: xmlObjectData.StudentInfo[0].Address[0].NickName[0],
          },
          birthDate: xmlObjectData.StudentInfo[0].Address[0].BirthDate[0],
          track: xmlObjectData.StudentInfo[0].Address[0].Track[0],
          address: xmlObjectData.StudentInfo[0].Address[0].br[0],
          counselor: {
            name: xmlObjectData.StudentInfo[0].Address[0].CounselorName[0],
            email: xmlObjectData.StudentInfo[0].Address[0].CounselorEmail[0],
            staffGu: xmlObjectData.StudentInfo[0].Address[0].CounselorStaffGU[0],
          },
          currentSchool: xmlObjectData.StudentInfo[0].Address[0].CurrentSchool[0],
          dentist: {
            name: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Name'][0],
            phone: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Phone'][0],
            extn: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Extn'][0],
            office: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Office'][0],
          },
          physician: {
            name: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Name'][0],
            phone: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Phone'][0],
            extn: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Extn'][0],
            hospital: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Hospital'][0],
          },
          email: xmlObjectData.StudentInfo[0].Address[0].EMail[0],
          emergencyContacts: xmlObjectData.StudentInfo[0].Address[0].EmergencyContacts[0].EmergencyContact.map(
            (contact) => ({
              name: contact['@_Name'][0],
              phone: {
                home: contact['@_HomePhone'][0],
                mobile: contact['@_MobilePhone'][0],
                other: contact['@_OtherPhone'][0],
                work: contact['@_WorkPhone'][0],
              },
              relationship: contact['@_Relationship'][0],
            })
          ),
          gender: xmlObjectData.StudentInfo[0].Gender[0],
          grade: xmlObjectData.StudentInfo[0].Grade[0],
          lockerInfoRecords: xmlObjectData.StudentInfo[0].LockerInfoRecords[0],
          homeLanguage: xmlObjectData.StudentInfo[0].Address[0].HomeLanguage[0],
          homeRoom: xmlObjectData.StudentInfo[0].Address[0].HomeRoom[0],
          homeRoomTeacher: {
            email: xmlObjectData.StudentInfo[0].Address[0].HomeRoomTchEMail[0],
            name: xmlObjectData.StudentInfo[0].Address[0].HomeRoomTch[0],
            staffGu: xmlObjectData.StudentInfo[0].Address[0].HomeRoomTchStaffGU[0],
          },
          additionalInfo: xmlObjectData.StudentInfo[0].Address[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox.map(
            (definedBox) => ({
              id: definedBox['@_GroupBoxID'][0],
              type: definedBox['@_GroupBoxLabel'][0],
              vcId: definedBox['@_VCID'][0],
              items: definedBox.UserDefinedItems[0].UserDefinedItem.map((item) => ({
                source: {
                  element: item['@_SourceElement'][0],
                  object: item['@_SourceObject'][0],
                },
                vcId: item['@_VCID'][0],
                value: item['@_Value'][0],
                type: item['@_ItemType'][0],
              })) as AdditionalInfoItem[],
            })
          ) as AdditionalInfo[],
        } as StudentInfo);
      } catch (e) {
        rej(e);
      }
    });
  }

  private fetchEventsWithinInterval(date: Date) {
    return super.processRequest<CalendarXMLObject>({
      methodName: 'StudentCalendar',
      paramStr: { childIntId: 0, RequestDate: date.toISOString() },
    });
  }

  public calendar(options: CalendarOptions): Promise<Calendar> {
    const defaultOptions: CalendarOptions = {
      concurrency: 7,
      ...options,
    };
    return new Promise(async (res, rej) => {
      try {
        let schoolStartDate: Date | number = options.interval.start;
        let schoolEndDate: Date | number = options.interval.end;

        const monthsWithinSchoolYear = eachMonthOfInterval({ start: schoolStartDate, end: schoolEndDate });
        const allEventsWithinSchoolYear: CalendarXMLObject[] =
          defaultOptions.concurrency == null
            ? await Promise.all(monthsWithinSchoolYear.map((date) => this.fetchEventsWithinInterval(date)))
            : await asyncPool(defaultOptions.concurrency, monthsWithinSchoolYear, (date) =>
                this.fetchEventsWithinInterval(date)
              );
        let memo: Calendar | null = null;
        const events = allEventsWithinSchoolYear.reduce((prev, events) => {
          if (memo == null)
            memo = {
              schoolDate: {
                start: new Date(events.CalendarListing[0]['@_SchoolBegDate'][0]),
                end: new Date(events.CalendarListing[0]['@_SchoolEndDate'][0]),
              },
              outputRange: {
                start: schoolStartDate,
                end: schoolEndDate,
              },
              events: [],
            };
          let rest: Calendar = {
            ...memo, // This is to prevent re-initializing Date objects in order to improve performance
            events: [
              ...(prev.events ? prev.events : []),
              ...(events.CalendarListing[0].EventLists[0].EventList.map((event) => {
                switch (event['@_DayType'][0]) {
                  case EventType.ASSIGNMENT: {
                    const assignmentEvent = event as AssignmentEventXMLObject;
                    return {
                      title: assignmentEvent['@_Title'][0],
                      addLinkData: assignmentEvent['@_AddLinkData'][0],
                      agu: assignmentEvent['@_AGU'][0],
                      date: new Date(assignmentEvent['@_Date'][0]),
                      dgu: assignmentEvent['@_DGU'][0],
                      link: assignmentEvent['@_Link'][0],
                      startTime: assignmentEvent['@_StartTime'][0],
                      type: EventType.ASSIGNMENT,
                      viewType: assignmentEvent['@_ViewType'][0],
                    } as AssignmentEvent;
                  }
                  case EventType.HOLIDAY: {
                    return {
                      title: event['@_Title'][0],
                      type: EventType.HOLIDAY,
                      startTime: event['@_StartTime'][0],
                      date: new Date(event['@_Date'][0]),
                    } as HolidayEvent;
                  }
                  case EventType.REGULAR: {
                    const regularEvent = event as RegularEventXMLObject;
                    return {
                      title: regularEvent['@_Title'][0],
                      agu: regularEvent['@_AGU'] ? regularEvent['@_AGU'] : undefined,
                      date: new Date(regularEvent['@_Date'][0]),
                      description: regularEvent['@_EvtDescription'] ? regularEvent['@_EvtDescription'][0] : undefined,
                      dgu: regularEvent['@_DGU'] ? regularEvent['@_DGU'][0] : undefined,
                      link: regularEvent['@_Link'] ? regularEvent['@_Link'][0] : undefined,
                      startTime: regularEvent['@_StartTime'][0],
                      type: EventType.REGULAR,
                      viewType: regularEvent['@_ViewType'] ? regularEvent['@_ViewType'][0] : undefined,
                      addLinkData: regularEvent['@_AddLinkData'] ? regularEvent['@_AddLinkData'][0] : undefined,
                    } as RegularEvent;
                  }
                }
              }) as Event[]),
            ] as Event[],
          };

          return rest;
        }, {} as Calendar);

        res({ ...events, events: _.uniqBy(events.events, (item) => item.title) } as Calendar);
        // res(allEventsWithinSchoolYear);
      } catch (e) {
        rej(e);
      }
    });
  }
}
