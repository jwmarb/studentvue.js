import { Staff } from '../Client.interfaces';

export declare interface Schedule {
  /**
   * The current school term
   */
  term: {
    /**
     * The index of the school term
     */
    index: number;

    /**
     * The name of the school term
     */
    name: string;
  };
  /**
   * The error of the schedule, if there are any
   */
  error: string;

  /**
   * The course schedules of all schools
   */
  today: SchoolScheduleInfo[];

  /**
   * The classes' information in regards to the schedule
   */
  classes: ClassInfo[];

  /**
   * All the available terms that can retrieve a schedule
   */
  terms: TermInfo[];
}

/**
 * Information about the school's schedule
 */
export declare interface SchoolScheduleInfo {
  /**
   * The name of the school
   */
  name: string;

  /**
   * The name of the bell schedule
   */
  bellScheduleName: string;

  /**
   * The student's classes of this school
   */
  classes: ClassScheduleInfo[];
}

/**
 * Information about the school term
 */
export declare interface TermInfo {
  /**
   * The index of the term
   */
  index: number;

  /**
   * The name of the term
   */
  name: string;

  /**
   * The date of the term
   */
  date: {
    /**
     * The beginning date of the term
     */
    start: Date;

    /**
     * The last date of the term
     */
    end: Date;
  };

  /**
   * The GU of the school year term. It is unknown what this does.
   */
  schoolYearTermCodeGu: string;
}

/**
 * The information of a class
 */
export declare interface ClassInfo {
  /**
   * The period number of the class
   */
  period: number;

  /**
   * The name of the class
   */
  name: string;

  /**
   * The room name or location of the class
   */
  room: string;

  /**
   * The teacher of the class
   */
  teacher: Staff;

  /**
   * The sectionGu of the class. It is unknown what this does
   */
  sectionGu: string;
}

/**
 * Information about the class's schedule
 */
export declare interface ClassScheduleInfo {
  /**
   * The period number of the class
   */
  period: number;

  /**
   * The name of the class
   */
  name: string;

  /**
   * The class's website, if it has one.
   */
  url: string;

  /**
   * The time of the class
   */
  time: {
    /**
     * The start time of the class
     */
    start: Date;

    /**
     * The end time of the class
     */
    end: Date;
  };

  /**
   * The date of the class
   */
  date: {
    /**
     * The start date of the class
     */
    start: Date;

    /**
     * The end date of the class
     */
    end: Date;
  };

  /**
   * The attendance code of the class
   */
  attendanceCode: string;

  /**
   * The sectionGu of the class. It is unknown what this does
   */
  sectionGu: string;

  /**
   * The teacher of the class
   */
  teacher: Staff & { url: string; emailSubject: string };
}
