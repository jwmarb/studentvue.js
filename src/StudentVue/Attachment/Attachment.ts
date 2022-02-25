import { Base64String } from '../../utils/types';
import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import soap from '../../utils/soap/soap';
import { AttachmentXMLObject } from './Attachment.xml';

export default class Attachment extends soap.Client {
  public readonly name: string;
  public readonly attachmentGu: string;
  public readonly fileExtension: string | null;

  public constructor(name: string, attachmentGu: string, session: LoginCredentials) {
    super(session);
    this.name = name;
    this.attachmentGu = attachmentGu;
    this.fileExtension = (name.match(/(\.[^.]+)$/) ?? [null])[0];
  }

  /**
   * Fetches the attachment from synergy servers.
   * Unfortunately, the api does not offer a URL path to the file
   * @returns base64 string
   *
   * @example
   * ```js
   * const base64 = await someAttachment.get();
   * console.log(base64) // -> UEsDBBQABgAIAAAAIQCj77s...
   * ```
   */
  public get(): Promise<Base64String> {
    return new Promise<Base64String>(async (res, reject) => {
      try {
        const xmlObject: AttachmentXMLObject = await super.processRequest({
          methodName: 'SynergyMailGetAttachment',
          paramStr: { childIntId: 0, SmAttachmentGu: this.attachmentGu },
        });

        res(xmlObject.AttachmentXML[0].Base64Code[0]);
      } catch (e) {
        reject(e);
      }
    });
  }
}
