import { SchoolDistrict, UserCredentials } from './StudentVue.interfaces';
import Client from './Client/Client';
import RequestException from './RequestException/RequestException';
import { StudentInfo } from './Client/Client.interfaces';
import Message from './Message/Message';
import Attachment from './Attachment/Attachment';
import Icon from './Icon/Icon';
export { Client, Message, Attachment, Icon, RequestException };
export default class StudentVue {
    static login(districtUrl: string, credentials: UserCredentials): Promise<[Client, StudentInfo]>;
    static findDistricts(zipCode: string): Promise<SchoolDistrict[]>;
}
