/**
 * The file of a report card
 */
export declare interface ReportCardFile {
  /**
   * The name of the file
   */
  name: string;
  /**
   * The document properties
   */
  document: {
    /**
     * The type of the document
     */
    type: string;
    /**
     * The name of the document
     */
    name: string;
  };
  /**
   * The base64 data of the file
   */
  base64: string;
}
