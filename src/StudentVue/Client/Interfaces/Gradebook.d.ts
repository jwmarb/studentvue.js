import ResourceType from '../../../Constants/ResourceType';
import { Staff } from '../Client.interfaces';

/**
 * The student gradebook
 */
export declare interface Gradebook {
  /**
   * Error message, if there is any
   */
  error: string;

  /**
   * The type of gradebook. It's usually `Traditional` if the student's class uses a letter-grade scale
   */
  type: string;

  /**
   * The reporting time period of the gradebook
   */
  reportingPeriod: {
    /**
     * The current time period that is reported
     * @type {ReportingPeriod}
     */
    current: ReportingPeriod;

    /**
     * Other available time periods the student can view
     * @type {ReportingPeriod[]}
     */
    available: ReportingPeriod[];
  };
  /**
   * The courses within this time period in the student gradebook
   * @type {Course[]}
   */
  courses: Course[];
}

/**
 * The time period of a gradebook
 */
export declare interface ReportingPeriod {
  /**
   * The index of the period. This is usually passed in `Client.gradebook()`
   */
  index: number;

  /**
   * The name of the period
   */
  name: string;

  /**
   * The date of the period
   */
  date: {
    /**
     * The start date of the period
     */
    start: Date;

    /**
     * The end date of the period
     */
    end: Date;
  };
}

/**
 * The course the student is taking
 */
export declare interface Course {
  /**
   * The period number of the course
   */
  period: number;

  /**
   * The title of the course
   */
  title: string;

  /**
   * The room name or location of the class
   */
  room: string;

  /**
   * The staff in charge of the class
   * @type {Staff}
   */
  staff: Staff;

  /**
   * The grade marks of the class
   * @type {Mark[]}
   */
  marks: Mark[];
}

/**
 * The grade mark of a course
 */
export declare interface Mark {
  /**
   * The name of the mark
   */
  name: string;

  /**
   * The calculated score of the mark
   */
  calculatedScore: {
    /**
     * The score formatted according to the gradebook type. If the gradebook type is `Traditional`, it will show A's, B's, C's, D's, and F's
     */
    string: string;

    /**
     * The score formatted in a number from 0-100. This is the student's percentage score, but without the % sign.
     */
    raw: number;
  };

  /**
   * The weighing scale of the course
   * @type {WeightedCategory[]}
   */
  weightedCategories: WeightedCategory[];

  /**
   * The assignments of the course
   * @type {Assignment[]}
   */
  assignments: Assignment[];
}

/**
 * The weighting scale category
 */
export declare interface WeightedCategory {
  /**
   * The score formatted according to the grade type. It is based on the student's score on the weighted category
   */
  calculatedMark: string;

  /**
   * The weighted category type. Examples are `Tests/Quizzes`, `Homework`, and `Finals`
   */
  type: string;

  /**
   * The weight of the category
   */
  weight: {
    /**
     * The student's percentage score in the weighted category
     */
    evaluated: string;

    /**
     * The percentage that makes up the total grade in the class
     */
    standard: string;
  };

  /**
   * The points in the weighted category
   */
  points: {
    /**
     * The current points the student achieved in the weighted category
     */
    current: number;

    /**
     * The points possible to achieve in the class
     */
    possible: number;
  };
}

/**
 * The Assignment of a course
 */
export declare interface Assignment {
  /**
   * The ID of the assignment
   */
  gradebookId: string;

  /**
   * The name of the assignment
   */
  name: string;

  /**
   * The type of the assignment that falls under the weighted categories
   */
  type: string;

  /**
   * The date of the assignment
   */
  date: {
    /**
     * The start date of the assignment
     */
    start: Date;

    /**
     * The due date of the assignment
     */
    due: Date;
  };

  /**
   * The student's score in the assignment
   */
  score: {
    /**
     * The type of the score. It is usually `Raw Score`
     */
    type: string;

    /**
     * The student's score in the assignment. It is usually formatted as `x out of x`
     */
    value: string;
  };
  /**
   * The points the student achieved in the assignment. It is usually formatted as `x / x`
   */
  points: string;

  /**
   * The notes the teacher provided in the assignment
   */
  notes: string;

  /**
   * The ID of the teacher
   */
  teacherId: string;

  /**
   * The description of teh assignment
   */
  description: string;

  /**
   * Whether the assignment has a dropbox or not
   */
  hasDropbox: boolean;

  /**
   * The ID of the student
   */
  studentId: string;

  /**
   * The date of the dropbox
   */
  dropboxDate: {
    /**
     * The beginning date of the dropbox
     */
    start: Date;

    /**
     * The end date of the dropbox before all submissions are closed
     */
    end: Date;
  };

  /**
   * The resources provided in the assignment
   * @type {(FileResource | URLResource)[]}
   */
  resources: (FileResource | URLResource)[];
}

/**
 * A resource that contains a file
 */
export declare interface FileResource extends Resource {
  /**
   * The properties of the file
   */
  file: {
    /**
     * The type of the file
     */
    type: string;

    /**
     * The name of the file
     */
    name: string;

    /**
     * The URI of the file
     */
    uri: string;
  };

  /**
   * The resource properties of the resource
   */
  resource: {
    /**
     * The upload date of the resource
     */
    date: Date;

    /**
     * The ID of the resource
     */
    id: string;

    /**
     * The name of the resource
     */
    name: string;
  };

  /**
   * The resource type
   * @type {ResourceType}
   */
  type: ResourceType.FILE;
}

/**
 * A resource that is a URL
 */
export declare interface URLResource extends Resource {
  /**
   * The URL of the resource
   */
  url: string;

  /**
   * The resource type
   * @type {ResourceType}
   */
  type: ResourceType.URL;

  /**
   * The resource properties of the resource
   */
  resource: {
    /**
     * The date of the resource
     */
    date: Date;

    /**
     * The ID of the resource
     */
    id: string;

    /**
     * The name of the resource
     */
    name: string;

    /**
     * The description of the resource
     */
    description: string;
  };

  /**
   * The URL path of the resource
   */
  path: string;
}

/**
 * A resource provided in the assignment
 */
export declare interface Resource {
  /**
   * The class ID of the resource
   */
  classId: string;

  /**
   * The gradebook ID of the resource
   */
  gradebookId: string;

  /**
   * The sequence type of the resource
   */
  sequence: string;

  /**
   * The teacher ID of the resource
   */
  teacherId: string;
}
