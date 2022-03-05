import { LoginOptions } from '../utils/soap/Client/Client.interfaces';

/**
 * SchoolDistrict
 */
export declare interface SchoolDistrict {
  /**
   * The address of the school district
   */
  address: string;

  /**
   * The ID of the school district
   */
  id: string;

  /**
   * The name of the school district
   */
  name: string;

  /**
   * The ParentVUE URL of the school district
   */
  parentVueUrl: string;
}

/**
 * The login information of the student
 */
export declare interface UserCredentials extends LoginOptions {
  /**
   * The student's username
   */
  username: string;

  /**
   * The student's password
   */
  password: string;
}
