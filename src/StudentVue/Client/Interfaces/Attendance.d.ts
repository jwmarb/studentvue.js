import { Staff } from '../Client.interfaces';

/**
 * Student Attendance
 */
export declare interface Attendance {
  /**
   * The type of attendance
   */
  type: string;

  /**
   * The class periods
   */
  period: {
    /**
     * The total class periods
     */
    total: number;

    /**
     * The first class period
     */
    start: number;

    /**
     * The last class period
     */
    end: number;
  };

  /**
   * The name of the school
   */
  schoolName: string;

  /**
   * List of absences
   */
  absences: Absence[];

  /**
   * List of information about a period
   */
  periodInfos: PeriodInfo[];
}

/**
 * Information about the student's absence
 */
export declare interface Absence {
  /**
   * The date of the absence
   */
  date: Date;

  /**
   * The reason for being absence
   */
  reason: string;

  /**
   * The note about the student's absence
   */
  note: string;

  /**
   * The description about the student's absence
   */
  description: string;

  /**
   * The periods in which the student was absent in
   */
  periods: AbsentPeriod[];
}

/**
 * The period the student was absent in
 */
export declare interface AbsentPeriod {
  /**
   * The period number of the class
   */
  period: number;

  /**
   * The name of the absence type. Example would be `School Business`
   */
  name: string;

  /**
   * The reason for the student's absence in the class
   */
  reason: string;

  /**
   * The name of the student's class
   */
  course: string;

  /**
   * The staff member supervising the class
   */
  staff: Staff;

  /**
   * The organization year GU. It is unknown what this does
   */
  orgYearGu: string;
}

/**
 * The attendance information about the student's period
 */
export declare interface PeriodInfo {
  /**
   * The period number of the class
   */
  period: number;

  /**
   * Properties with total attendance type
   */
  total: {
    /**
     * The total excused absences of the student
     */
    excused: number;

    /**
     * The total late tardies of the student
     */
    tardies: number;

    /**
     * The total unexcused absences of the student
     */
    unexcused: number;

    /**
     * The total student absences due to activities
     */
    activities: number;

    /**
     * The total unexcused late tardies of the student
     */
    unexcusedTardies: number;
  };
}
