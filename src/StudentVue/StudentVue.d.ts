import { SchoolDistrict, UserCredentials } from './StudentVue.interfaces';
import Client from './Client/Client';
export default class StudentVue {
    static login(districtUrl: string, credentials: UserCredentials): Promise<Client>;
    static findDistricts(zipCode: string): Promise<SchoolDistrict[]>;
}
