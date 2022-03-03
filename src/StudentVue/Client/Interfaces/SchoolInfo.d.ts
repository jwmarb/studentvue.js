import { Staff } from '../Client.interfaces';
export declare interface SchoolInfo {
  school: {
    address: string;
    addressAlt: string;
    city: string;
    zipCode: string;
    phone: string;
    altPhone: string;
    principal: Staff;
  };
  staff: StaffInfo[];
}

export declare interface StaffInfo extends Staff {
  jobTitle: string;
  extn: string;
  phone: string;
}
