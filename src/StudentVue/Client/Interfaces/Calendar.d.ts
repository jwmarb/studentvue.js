import EventType from '../../../Constants/EventType';
import { Icon } from '../../StudentVue';

export declare interface CalendarOptions {
  interval: {
    start: Date | number;
    end: Date | number;
  };
}

export declare interface Calendar {
  schoolDate: {
    start: Date | number;
    end: Date | number;
  };
  outputRange: {
    start: Date | number;
    end: Date | number;
  };
  events: (AssignmentEvent | HolidayEvent | RegularEvent)[];
}

export declare interface Event {
  date: Date;
  title: string;
  type: EventType;
  startTime: string;
}

export declare interface AssignmentEvent extends Event {
  agu: string;
  link: string;
  dgu: string;
  viewType: string;
  addLinkData: string;
}

export declare interface HolidayEvent extends Event {}

export declare interface RegularEvent extends Event {
  agu?: string;
  dgu?: string;
  link?: string;
  viewType?: string;
  addLinkData?: string;
  description?: string;
}
