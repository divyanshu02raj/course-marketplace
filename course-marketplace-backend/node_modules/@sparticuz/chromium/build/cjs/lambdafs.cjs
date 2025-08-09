"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inflate = void 0;
const node_fs_1 = require("node:fs");
const node_os_1 = require("node:os");
const node_path_1 = require("node:path");
const node_zlib_1 = require("node:zlib");
const tar_fs_1 = require("tar-fs");
/**
 * Decompresses a (tarballed) Brotli or Gzip compressed file and returns the path to the decompressed file/folder.
 *
 * @param filePath Path of the file to decompress.
 */
const inflate = (filePath) => {
    // Determine the output path based on the file type
    const output = filePath.includes("swiftshader")
        ? (0, node_os_1.tmpdir)()
        : (0, node_path_1.join)((0, node_os_1.tmpdir)(), (0, node_path_1.basename)(filePath).replace(/\.(?:t(?:ar(?:\.(?:br|gz))?|br|gz)|br|gz)$/i, ""));
    return new Promise((resolve, reject) => {
        // Quick return if the file is already decompressed
        if (filePath.includes("swiftshader")) {
            if ((0, node_fs_1.existsSync)(`${output}/libGLESv2.so`)) {
                resolve(output);
                return;
            }
        }
        else if ((0, node_fs_1.existsSync)(output)) {
            resolve(output);
            return;
        }
        // Optimize chunk size based on file type - use smaller chunks for better memory usage
        // Brotli files tend to decompress to much larger sizes
        const isBrotli = /br$/i.test(filePath);
        const isGzip = /gz$/i.test(filePath);
        const isTar = /\.t(?:ar(?:\.(?:br|gz))?|br|gz)$/i.test(filePath);
        // Use a smaller highWaterMark for better memory efficiency
        // For most serverless environments, 4MB (2**22) is more memory-efficient than 8MB
        const highWaterMark = 2 ** 22;
        const source = (0, node_fs_1.createReadStream)(filePath, { highWaterMark });
        let target;
        // Setup error handlers first for both streams
        const handleError = (error) => {
            reject(error);
        };
        source.once("error", handleError);
        // Setup the appropriate target stream based on file type
        if (isTar) {
            target = (0, tar_fs_1.extract)(output);
            target.once("finish", () => {
                resolve(output);
            });
        }
        else {
            target = (0, node_fs_1.createWriteStream)(output, { mode: 0o700 });
            target.once("close", () => {
                resolve(output);
            });
        }
        target.once("error", handleError);
        // Pipe through the appropriate decompressor if needed
        if (isBrotli || isGzip) {
            // Use optimized chunk size for decompression
            // 2MB (2**21) is sufficient for most brotli/gzip files
            const decompressor = isBrotli
                ? (0, node_zlib_1.createBrotliDecompress)({ chunkSize: 2 ** 21 })
                : (0, node_zlib_1.createUnzip)({ chunkSize: 2 ** 21 });
            // Handle decompressor errors
            decompressor.once("error", handleError);
            // Chain the streams
            source.pipe(decompressor).pipe(target);
        }
        else {
            source.pipe(target);
        }
    });
};
exports.inflate = inflate;
