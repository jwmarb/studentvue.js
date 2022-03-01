import { Staff } from '../Client.interfaces';

export declare interface Attendance {
  type: string;
  period: {
    total: number;
    start: number;
    end: number;
  };
  schoolName: string;
  absences: Absence[];
  periodInfos: PeriodInfo[];
}

export declare interface Absence {
  date: Date;
  reason: string;
  note: string;
  description: string;
  periods: AbsentPeriod[];
}

export declare interface AbsentPeriod {
  period: number;
  name: string;
  reason: string;
  course: string;
  staff: Staff;
  orgYearGu: string;
}

export declare interface PeriodInfo {
  period: number;
  total: {
    excused: number;
    tardies: number;
    unexcused: number;
    activities: number;
    unexcusedTardies: number;
  };
}
