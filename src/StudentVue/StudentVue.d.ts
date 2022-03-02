import { SchoolDistrict, UserCredentials } from './StudentVue.interfaces';
import Client from './Client/Client';
import { StudentInfo } from './Client/Client.interfaces';
export default class StudentVue {
    static login(districtUrl: string, credentials: UserCredentials): Promise<[Client, StudentInfo]>;
    static findDistricts(zipCode: string): Promise<SchoolDistrict[]>;
}
