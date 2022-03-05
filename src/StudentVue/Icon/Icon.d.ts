export default class Icon {
    /**
     * The URI of the icon
     * @public
     * @readonly
     */
    readonly uri: string;
    /**
     *
     * @param path The URL path to the icon (e.g. /path/to/icon.png)
     * @param hostUrl The host url (e.g. https://schooldistrict.org/)
     */
    constructor(path: string, hostUrl: string);
}
