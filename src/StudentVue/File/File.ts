import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import soap from '../../utils/soap/soap';
import { Base64String } from '../../utils/types';

export default abstract class File<T> extends soap.Client {
  public readonly documentGu: string;
  private readonly methodName: string;

  public constructor(credentials: LoginCredentials, documentGu: string, methodName: string) {
    super(credentials);
    this.documentGu = documentGu;
    this.methodName = methodName;
  }

  /**
   * Parse the XML object to translate it into an ordinary object. This method must be written for every class that extends Document (which gets the file from synergy servers using a POST fetch request)
   * @param {unknown} xmlObject The XML Object passed after parsing
   * @protected
   * @returns {T} Returns a reformatted XML object to make it easier for code
   * @example
   * ```js
   * const xmlObject = await super.processRequest({...}); // { "@_Attribute": [{ "@_Nested": [{...}, {...}]}]}
   * parseXMLObject(xmlObject); // { attribute: { nested: [{...}, {...}] } }
   *
   * ```
   */
  protected abstract parseXMLObject(xmlObject: unknown): T;

  /**
   * Retrieve the file from synergy servers. After retrieving the xmlObject, this method calls parseXMLObject which must be defined to parse the xmlObject into a readable, typesafe object.
   * @public
   * @returns {Promise<T>} Returns a base64 object
   * @example
   * ```js
   * const base64 = await document.get(); // { attribute: { nested: {...} }, base64: "base64 code" }
   * ```
   */
  public get(): Promise<T> {
    return new Promise(async (res, rej) => {
      try {
        const base64Data: Record<string, unknown> = await super.processRequest({
          methodName: this.methodName,
          paramStr: { childIntId: 0, DocumentGU: this.documentGu },
        });
        res(this.parseXMLObject(base64Data));
      } catch (e) {
        rej(e);
      }
    });
  }
}
