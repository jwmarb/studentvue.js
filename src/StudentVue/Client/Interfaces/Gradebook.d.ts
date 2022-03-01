import ResourceType from '../../../Constants/ResourceType';
import { Staff } from '../Client.interfaces';

export declare interface Gradebook {
  error: string;
  type: string;
  reportingPeriod: {
    current: ReportingPeriod;
    available: ReportingPeriod[];
  };
  courses: Course[];
}

export declare interface ReportingPeriod {
  index: number;
  name: string;
  date: {
    start: Date;
    end: Date;
  };
}

export declare interface Course {
  period: number;
  title: string;
  room: string;
  staff: Staff;
  marks: Mark[];
}

export declare interface Mark {
  name: string;
  calculatedScore: {
    string: string;
    raw: number;
  };
  weightedCategories: WeightedCategory[];
  assignments: Assignment[];
}

export declare interface WeightedCategory {
  calculatedMark: string;
  type: string;
  weight: {
    evaluated: string;
    standard: string;
  };
  points: {
    current: number;
    possible: number;
  };
}

export declare interface Assignment {
  gradebookId: string;
  name: string;
  type: string;
  date: {
    start: Date;
    due: Date;
  };
  score: {
    type: string;
    value: string;
  };
  points: string;
  notes: string;
  teacherId: string;
  description: string;
  hasDropbox: boolean;
  studentId: string;
  dropboxDate: {
    start: Date;
    end: Date;
  };
  resources: (FileResource | URLResource)[];
}

export declare interface FileResource extends Resource {
  file: {
    type: string;
    name: string;
    uri: string;
  };
  resource: {
    date: Date;
    id: string;
    name: string;
  };
  type: ResourceType.FILE;
}

export declare interface URLResource extends Resource {
  url: string;
  type: ResourceType.URL;
  resource: {
    date: Date;
    id: string;
    name: string;
    description: string;
  };
  path: string;
}

export declare interface Resource {
  classId: string;

  gradebookId: string;

  sequence: string;
  teacherId: string;
}
