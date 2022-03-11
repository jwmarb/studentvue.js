/**
 * Use this class to mutate and manipulate XML before parsing it into an XML object
 */
class XMLFactory {
  private readonly xml: string;

  /**
   *
   * @param xml XML in a string
   */
  public constructor(xml: string) {
    /**
     * The XML you want to mutate before parsing into a javascript object
     * @type {string}
     */
    this.xml = xml;
  }

  /**
   * Mutate an attribute's value to encode it into a base64 so that `fast-xml-parser` does not have parsing errors.
   * @param attributeName The attribute that should have its value converted to a base64
   * @param followingAttributeName The attribute after the mutated attribute so that the location of `attributeName` can be identified through regular expressions
   * @returns {XMLFactory} Returns another instance of XMLFactory for method chaining
   * @description
   * The appropriate scenario to use this is when an XML attribute breaks `fast-xml-parser`. Such example would be this XML:
   * ```xml
   * <Assignment MeasureDescription="We did this lab together, so just turning it in gives full credit. To turn in, take a good picture of the lab in your lab notebook and upload it onto the Class Notebook page under the assignment in Teams. Then click "Turn In" on the assignment on Teams." HasDropBox="false">
   * ```
   * As you can see, `MeasureDescription` has non-escaped quotation marks around **Turn In**, therefore `fast-xml-parser` throws an error.
   * This method fixes this issue by replacing `MeasureDescription`'s value with an encoded base64 string. This is how we would call this method and return a string:
   * ```js
   * new XMLFactory(assignmentXML)
   *  .encodeAttribute("MeasureDescription", "HasDropBox")
   *  .toString();
   * ```
   * After encoding it to base64, `fast-xml-parser` will now work. The downside of this method is that `atob` must be called to get the actual value of the attribute.
   */
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
