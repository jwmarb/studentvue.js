class XMLFactory {
  private readonly xml: string;
  public constructor(xml: string) {
    this.xml = xml;
  }

  public encodeAttribute(attributeName: string, followingAttributeName: string) {
    const regexp = new RegExp(`${attributeName}=".*" ${followingAttributeName}`, 'g');
    const found = (this.xml.match(regexp) ?? [''])[0];
    const base64 = btoa(found.substring(attributeName.length + 2, found.length - followingAttributeName.length - 2));
    return new XMLFactory(this.xml.replace(regexp, `${attributeName}="${base64}" ${followingAttributeName}`));
  }

  public toString(): string {
    return this.xml;
  }
}

export default XMLFactory;
