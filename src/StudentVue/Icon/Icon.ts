export default class Icon {
  private path: string;
  private hostUrl: string;
  public constructor(path: string, hostUrl: string) {
    this.path = path;
    this.hostUrl = hostUrl;
  }

  public get uri(): string {
    return this.hostUrl + this.path;
  }
}
