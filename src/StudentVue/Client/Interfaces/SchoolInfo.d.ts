import { Staff } from '../Client.interfaces';

/**
 * The information of the school
 */
export declare interface SchoolInfo {
  /**
   * Information about the school
   */
  school: {
    /**
     * The address of the school
     */
    address: string;

    /**
     * The alt address of the school
     */
    addressAlt: string;

    /**
     * The city the school is located in
     */
    city: string;

    /**
     * The zipcode of the school
     */
    zipCode: string;

    /**
     * The phone number of the school
     */
    phone: string;

    /**
     * The alt phone number of the school
     */
    altPhone: string;

    /**
     * The principal of the school
     * @type {Staff}
     */
    principal: Staff;
  };

  /**
   * A list of staff members in the school
   * @type {StaffInfo[]}
   */
  staff: StaffInfo[];
}

export declare interface StaffInfo extends Staff {
  /**
   * The name of the position the staff member holds
   */
  jobTitle: string;

  /**
   * The extn of the staff member
   */
  extn: string;

  /**
   * The phone number of the staff member
   */
  phone: string;
}
