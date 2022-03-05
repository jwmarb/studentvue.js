import { Staff } from '../Client.interfaces';

export declare interface StudentInfo {
  /**
   * Basic info about the student
   */
  student: {
    /**
     * The name of the student
     */
    name: string;

    /**
     * The nickname of the student
     */
    nickname: string;

    /**
     * The last name of the student
     */
    lastName: string;
  };
  /**
   * The student's ID. Can be their metric number
   */
  id: string;

  /**
   * The student's address
   */
  address: string;

  /**
   * The student's gender
   */
  gender: string;

  /**
   * The grade level of the student
   */
  grade: string;

  /**
   * The birth date of the student
   */
  birthDate: string;

  /**
   * The email of the student
   */
  email: string;

  /**
   * The student's parent phone number
   */
  phone: string;

  /**
   * The student's primary language
   */
  homeLanguage: string;

  /**
   * The school the student goes to
   */
  currentSchool: string;

  /**
   * The track the student is in
   */
  track: string;

  /**
   * The student's homeroom teacher
   * @type {Staff}
   */
  homeRoomTeacher: Staff;

  /**
   * The organization year Gu. it is unknown what this does
   */
  orgYearGu: string;

  /**
   * The student's homeroom location/name
   */
  homeRoom: string;

  /**
   * The student's counselor
   * @type {Staff}
   */
  counselor: Staff;

  /**
   * The student's photo. It is a base64 string
   */
  photo: string;

  /**
   * A list of contacts in case of emergency
   * @type {EmergencyContact[]}
   */
  emergencyContacts: EmergencyContact[];

  /**
   * The student's physician
   */
  physician: {
    name: string;
    phone: string;
    extn: string;
    hospital: string;
  };

  /**
   * The student's dentist
   */
  dentist: {
    name: string;
    phone: string;
    extn: string;
    office: string;
  };

  /**
   * The info about the student's lockers
   */
  lockerInfoRecords: string;

  /**
   * Additional information about the student such as transportation information
   * @type {AdditionalInfo[]}
   */
  additionalInfo: AdditionalInfo[];
}

export declare interface AdditionalInfo {
  /**
   * The type of the information
   */
  type: string;

  /**
   * The ID of the information
   */
  id: string;

  /**
   * The vcID of the information
   */
  vcId: string;

  /**
   * Fields within the information. For example, if the type was `Transportation Information`, this will contain items about it such as `AM Route`, `Pickup Bus Stop`, etc.
   * @type {AdditionalInfoItem[]}
   */
  items: AdditionalInfoItem[];
}

/**
 * A field contained in the student's additional information
 */
export declare interface AdditionalInfoItem {
  /**
   * The type of field. For example, this can be `AM Route` if this was under `Transportation Information`
   */
  type: string;

  /**
   * The source of the field within synergy database
   */
  source: {
    /**
     * The object ID of the field
     */
    object: string;

    /**
     * The element name of the field in the database
     */
    element: string;
  };

  /**
   * The vcId of the field
   */
  vcId: string;

  /**
   * The value of the field according to what the student has set
   */
  value: string;
}

/**
 * The person to contact in case of emergency
 */
export declare interface EmergencyContact {
  /**
   * The name of the contacter
   */
  name: string;

  /**
   * The contacter's relationship with the student
   */
  relationship: string;

  /**
   * The contacter's phone
   */
  phone: {
    /**
     * The home phone number of the contacter
     */
    home: string;

    /**
     * The work phone number of the contacter
     */
    work: string;

    /**
     * A phone number of the contacter
     */
    other: string;

    /**
     * The contacter's mobile phone number
     */
    mobile: string;
  };
}
