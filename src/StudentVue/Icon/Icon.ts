export default class Icon {
  public readonly uri: string;

  /**
   *
   * @param path The URL path to the icon (e.g. /path/to/icon.png)
   * @param hostUrl The host url (e.g. https://schooldistrict.org/)
   */
  public constructor(path: string, hostUrl: string) {
    /**
     * The URI of the icon
     * @public
     * @readonly
     */
    this.uri = hostUrl + path;
  }
}
