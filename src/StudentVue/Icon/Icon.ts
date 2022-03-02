export default class Icon {
  public readonly uri: string;
  public constructor(path: string, hostUrl: string) {
    /**
     * The URI of the icon
     * @public
     * @readonly
     * @type {string}
     */
    this.uri = hostUrl + path;
  }
}
