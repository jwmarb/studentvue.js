import EventType from '../../../../Constants/EventType';

export declare interface CalendarXMLObject {
  CalendarListing: [
    {
      '@_xmlns:xsd': [string];
      '@_xmlns:xsi': [string];
      '@_SchoolBegDate': [string];
      '@_SchoolEndDate': [string];
      '@_MonthBegDate': [string];
      '@_MonthEndDate': [string];
      EventLists: [
        {
          EventList: (AssignmentEventXMLObject | HolidayEventXMLObject | RegularEventXMLObject)[];
        }
      ];
    }
  ];
}

export declare interface AssignmentEventXMLObject {
  '@_Date': [string];
  '@_Title': [string];
  '@_DayType': [EventType.ASSIGNMENT];
  '@_StartTime': [string];
  '@_Icon': [string];
  '@_AGU': [string];
  '@_Link': [string];
  '@_DGU': [string];
  '@_ViewType': [string];
  '@_AddLinkData': [string];
}

export declare interface HolidayEventXMLObject {
  '@_Date': [string];
  '@_Title': [string];
  '@_DayType': [EventType.HOLIDAY];
  '@_StartTime': [string];
}

export declare interface RegularEventXMLObject {
  '@_Date': [string];
  '@_Title': [string];
  '@_DayType': [EventType.REGULAR];
  '@_StartTime': [string];
  '@_Icon'?: [string];
  '@_AGU'?: string;
  '@_Link'?: [string];
  '@_DGU'?: [string];
  '@_ViewType'?: [string];
  '@_AddLinkData'?: [string];
  '@_EvtDescription'?: [string];
}
