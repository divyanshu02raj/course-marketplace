"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinPath = getBinPath;
const node_path_1 = require("node:path");
/**
 * Get the bin directory path for CommonJS modules
 */
function getBinPath() {
    // eslint-disable-next-line unicorn/prefer-module
    return (0, node_path_1.join)((0, node_path_1.dirname)(__filename), "..", "..", "bin");
}
