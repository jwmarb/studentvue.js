import { Staff } from '../Client.interfaces';

export declare interface Schedule {
  term: {
    index: number;
    name: string;
  };
  error: string;
  today: SchoolScheduleInfo[];
  classes: ClassInfo[];
  terms: TermInfo[];
}

export declare interface SchoolScheduleInfo {
  name: string;
  bellScheduleName: string;
  classes: ClassScheduleInfo[];
}

export declare interface TermInfo {
  index: number;
  name: string;
  date: {
    start: Date;
    end: Date;
  };
  schoolYearTermCodeGu: string;
}

export declare interface ClassInfo {
  period: number;
  name: string;
  room: string;
  teacher: Staff;
  sectionGu: string;
}

export declare interface ClassScheduleInfo {
  period: number;
  name: string;
  url: string;
  time: {
    start: Date;
    end: Date;
  };
  date: {
    start: Date;
    end: Date;
  };
  attendanceCode: string;
  sectionGu: string;
  teacher: Staff & { url: string; emailSubject: string };
}
