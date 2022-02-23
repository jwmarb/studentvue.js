import { SchoolDistrict, UserCredentials } from './StudentVue.interfaces';
import Client from './Client/Client';
import soap from '../utils/soap/soap';
import { DistrictListXMLObject } from './StudentVue.xml';

export default class StudentVue {
  public static login(districtUrl: string, credentials: UserCredentials): Promise<Client> {
    return new Promise(async (res) => {
      res(new Client(credentials.username, credentials.password));
    });
  }

  public static findDistricts(zipCode: string): Promise<SchoolDistrict[]> {
    return new Promise(async (res) => {
      const xmlObject: DistrictListXMLObject = await soap.Client.processAnonymousRequest(
        'https://support.edupoint.com/Service/HDInfoCommunication.asmx',
        {
          paramStr: {
            Key: '5E4B7859-B805-474B-A833-FDB15D205D40',
            MatchToDistrictZipCode: zipCode,
          },
        }
      );
      res(
        xmlObject.DistrictLists.DistrictInfos.DistrictInfo.map((district) => ({
          parentVueUrl: district['@_PvueURL'],
          address: district['@_Address'],
          id: district['@_DistrictID'],
          name: district['@_Name'],
        }))
      );
    });
  }
}
