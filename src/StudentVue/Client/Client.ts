import soap from '../../utils/soap/soap';
import { StudentInfoXMLObject } from '../StudentVue.xml';
import { AdditionalInfo, AdditionalInfoItem, StudentInfo } from './Client.interfaces';

export default class Client extends soap.Client {
  constructor(username: string, password: string, district: string) {
    super(username, password, district);
  }

  public studentInfo(): Promise<StudentInfo> {
    return new Promise<StudentInfo>(async (res, rej) => {
      try {
        const xmlObjectData: StudentInfoXMLObject = await super.processRequest({
          methodName: 'StudentInfo',
          paramStr: { childIntId: 0 },
        });

        res({
          student: {
            name: xmlObjectData.StudentInfo[0].FormattedName[0],
            lastName: xmlObjectData.StudentInfo[0].Address[0].LastNameGoesBy[0],
            nickname: xmlObjectData.StudentInfo[0].Address[0].NickName[0],
          },
          birthDate: xmlObjectData.StudentInfo[0].Address[0].BirthDate[0],
          track: xmlObjectData.StudentInfo[0].Address[0].Track[0],
          address: xmlObjectData.StudentInfo[0].Address[0].br[0],
          counselor: {
            name: xmlObjectData.StudentInfo[0].Address[0].CounselorName[0],
            email: xmlObjectData.StudentInfo[0].Address[0].CounselorEmail[0],
            staffGu: xmlObjectData.StudentInfo[0].Address[0].CounselorStaffGU[0],
          },
          currentSchool: xmlObjectData.StudentInfo[0].Address[0].CurrentSchool[0],
          dentist: {
            name: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Name'][0],
            phone: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Phone'][0],
            extn: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Extn'][0],
            office: xmlObjectData.StudentInfo[0].Address[0].Dentist[0]['@_Office'][0],
          },
          physician: {
            name: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Name'][0],
            phone: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Phone'][0],
            extn: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Extn'][0],
            hospital: xmlObjectData.StudentInfo[0].Address[0].Physician[0]['@_Hospital'][0],
          },
          email: xmlObjectData.StudentInfo[0].Address[0].EMail[0],
          emergencyContacts: xmlObjectData.StudentInfo[0].Address[0].EmergencyContacts[0].EmergencyContact.map(
            (contact) => ({
              name: contact['@_Name'][0],
              phone: {
                home: contact['@_HomePhone'][0],
                mobile: contact['@_MobilePhone'][0],
                other: contact['@_OtherPhone'][0],
                work: contact['@_WorkPhone'][0],
              },
              relationship: contact['@_Relationship'][0],
            })
          ),
          gender: xmlObjectData.StudentInfo[0].Gender[0],
          grade: xmlObjectData.StudentInfo[0].Grade[0],
          lockerInfoRecords: xmlObjectData.StudentInfo[0].LockerInfoRecords[0],
          homeLanguage: xmlObjectData.StudentInfo[0].Address[0].HomeLanguage[0],
          homeRoom: xmlObjectData.StudentInfo[0].Address[0].HomeRoom[0],
          homeRoomTeacher: {
            email: xmlObjectData.StudentInfo[0].Address[0].HomeRoomTchEMail[0],
            name: xmlObjectData.StudentInfo[0].Address[0].HomeRoomTch[0],
            staffGu: xmlObjectData.StudentInfo[0].Address[0].HomeRoomTchStaffGU[0],
          },
          additionalInfo: xmlObjectData.StudentInfo[0].Address[0].UserDefinedGroupBoxes[0].UserDefinedGroupBox.map(
            (definedBox) => ({
              id: definedBox['@_GroupBoxID'][0],
              type: definedBox['@_GroupBoxLabel'][0],
              vcId: definedBox['@_VCID'][0],
              items: definedBox.UserDefinedItems[0].UserDefinedItem.map((item) => ({
                source: {
                  element: item['@_SourceElement'][0],
                  object: item['@_SourceObject'][0],
                },
                vcId: item['@_VCID'][0],
                value: item['@_Value'][0],
                type: item['@_ItemType'][0],
              })) as AdditionalInfoItem[],
            })
          ) as AdditionalInfo[],
        } as StudentInfo);
      } catch (e) {
        rej(e);
      }
    });
  }
}
