export declare interface StudentInfo {
  student: {
    name: string;
    nickname: string;
    lastName: string;
  };
  id: string;
  address: string;
  gender: string;
  grade: string;
  birthDate: string;
  email: string;
  phone: string;
  homeLanguage: string;
  currentSchool: string;
  track: string;
  homeRoomTeacher: {
    name: string;
    email: string;
    staffGu: string;
  };
  orgYearGu: string;
  homeRoom: string;
  counselor: {
    name: string;
    email: string;
    staffGu: string;
  };
  photo: string;
  emergencyContacts: EmergencyContact[];
  physician: {
    name: string;
    phone: string;
    extn: string;
    hospital: string;
  };
  dentist: {
    name: string;
    phone: string;
    extn: string;
    office: string;
  };
  lockerInfoRecords: string;
  additionalInfo: AdditionalInfo[];
}

export declare interface AdditionalInfo {
  type: string;
  id: string;
  vcId: string;
  items: {
    type: string;
    source: {
      object: string;
      element: string;
      vcId: string;
      value: string;
    };
  }[];
}

export declare interface EmergencyContact {
  name: string;
  relationship: string;
  phone: {
    home: string;
    work: string;
    other: string;
    mobile: string;
  };
}

export * from './Client';
