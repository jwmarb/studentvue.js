import { Base64String } from '../../utils/types';
import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import soap from '../../utils/soap/soap';
import { AttachmentXMLObject } from './Attachment.xml';

export default class Attachment extends soap.Client {
  private _name: string;
  private _attachmentGu: string;

  public constructor(name: string, attachmentGu: string, session: LoginCredentials) {
    super(session);
    this._name = name;
    this._attachmentGu = attachmentGu;
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

  public get fileExtension(): string | undefined {
    return this._name.match(/(\.[^.]+)$/)[0];
  }

  public get attachmentGu(): string {
    return this._attachmentGu;
  }

  public get name(): string {
    return this._name;
  }
}
