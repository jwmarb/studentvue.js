import { SchoolDistrict, UserCredentials } from './StudentVue.interfaces';
import Client from './Client/Client';
import { StudentInfo } from './Client/Client.interfaces';
/** @module StudentVue */
/**
 * Login to the StudentVUE API
 * @param {string} districtUrl The URL of the district which can be found using `findDistricts()` method
 * @param {UserCredentials} credentials User credentials of the student
 * @returns {Promise<[Client, StudentInfo]>} Returns the client and the information of the student upon successful login
 */
export declare function login(districtUrl: string, credentials: UserCredentials): Promise<[Client, StudentInfo]>;
/**
 * Find school districts using a zipcode
 * @param {string} zipCode The zipcode to get a list of schools from
 * @returns {Promise<SchoolDistrict[]>} Returns a list of school districts which can be used to login to the API
 */
export declare function findDistricts(zipCode: string): Promise<SchoolDistrict[]>;
