/**
 * Decompresses a (tarballed) Brotli or Gzip compressed file and returns the path to the decompressed file/folder.
 *
 * @param filePath Path of the file to decompress.
 */
export declare const inflate: (filePath: string) => Promise<string>;
