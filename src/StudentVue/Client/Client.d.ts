import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import soap from '../../utils/soap/soap';
import { StudentInfo } from './Client.interfaces';
import Message from '../Message/Message';
export default class Client extends soap.Client {
    private hostUrl;
    constructor(credentials: LoginCredentials, hostUrl: string);
    messages(): Promise<Message[]>;
    studentInfo(): Promise<StudentInfo>;
}
