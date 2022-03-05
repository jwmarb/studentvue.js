export * from './Interfaces/StudentInfo';
export * from './Interfaces/Gradebook';
export * from './Interfaces/Calendar';
export * from './Interfaces/Attendance';
export * from './Interfaces/Schedule';
export * from './Interfaces/SchoolInfo';

/**
 * Information about the staff member working in the school facility
 */
export declare interface Staff {
  /**
   * The name of the staff
   */
  name: string;

  /**
   * The staff's email
   */
  email: string;

  /**
   * The staffGu of the staff member
   */
  staffGu: string;
}
