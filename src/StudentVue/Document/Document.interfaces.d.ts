/**
 * The file of a document
 */
export declare interface DocumentFile {
  /**
   * The file properties of the document
   */
  file: {
    /**
     * The name of the file
     */
    name: string;

    /**
     * The type of file
     */
    type: string;

    /**
     * The date the file was uploaded
     */
    date: Date;
  };

  /**
   * The category of the file
   */
  category: string;

  /**
   * The notes provided in the file
   */
  notes: string;

  /**
   * The base64 data of the file
   */
  base64: string;
}
