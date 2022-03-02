export default class Icon {
  public readonly uri: string;
  public constructor(path: string, hostUrl: string) {
    this.uri = hostUrl + path;
  }
}
