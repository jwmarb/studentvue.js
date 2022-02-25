import { Base64String } from '../../utils/types';
import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import soap from '../../utils/soap/soap';
export default class Attachment extends soap.Client {
    private _name;
    private _attachmentGu;
    constructor(name: string, attachmentGu: string, session: LoginCredentials);
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
    get(): Promise<Base64String>;
    get fileExtension(): string | null;
    get attachmentGu(): string;
    get name(): string;
}
