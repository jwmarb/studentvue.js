import soap from '../../utils/soap/soap';
import { StudentInfo } from './Client.interfaces';

export default class Client extends soap.Client {
  constructor(username: string, password: string, district: string) {
    super(username, password, district);
  }

  public studentInfo(): Promise<unknown> {
    return new Promise(async (res, rej) => {
      try {
        const xmlObjectData = await super.processRequest({ methodName: 'StudentInfo', paramStr: { childIntId: 0 } });
        res(xmlObjectData);
      } catch (e) {
        rej(e);
      }
    });
  }
}
