export default class Icon {
  private path: string;
  private hostUrl: string;
  public constructor(path: string, hostUrl: string) {
    this.path = path;
    this.hostUrl = hostUrl;
  }

  public getURI(): string {
    return this.hostUrl + this.path;
  }
}
