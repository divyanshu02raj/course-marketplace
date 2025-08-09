"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadAndExtract = exports.isRunningInAmazonLinux2023 = exports.isValidUrl = exports.setupLambdaEnvironment = exports.downloadFile = exports.createSymlink = void 0;
const follow_redirects_1 = __importDefault(require("follow-redirects"));
const node_fs_1 = require("node:fs");
const node_os_1 = require("node:os");
const node_path_1 = require("node:path");
const tar_fs_1 = require("tar-fs");
/**
 * Creates a symlink to a file
 */
const createSymlink = (source, target) => {
    return new Promise((resolve, reject) => {
        (0, node_fs_1.access)(source, (error) => {
            if (error) {
                reject(error);
                return;
            }
            (0, node_fs_1.symlink)(source, target, (error) => {
                /* c8 ignore next */
                if (error) {
                    /* c8 ignore next 3 */
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    });
};
exports.createSymlink = createSymlink;
/**
 * Downloads a file from a URL
 */
const downloadFile = (url, outputPath) => {
    return new Promise((resolve, reject) => {
        const stream = (0, node_fs_1.createWriteStream)(outputPath);
        stream.once("error", reject);
        follow_redirects_1.default.https
            .get(url, (response) => {
            if (response.statusCode !== 200) {
                stream.close();
                reject(new Error(
                /* c8 ignore next 2 */
                `Unexpected status code: ${response.statusCode?.toFixed(0) ?? "UNK"}.`));
                return;
            }
            // Pipe directly to file rather than manually writing chunks
            // This is more efficient and uses less memory
            response.pipe(stream);
            // Listen for completion
            stream.once("finish", () => {
                stream.close();
                resolve();
            });
            // Handle response errors
            response.once("error", (error) => {
                /* c8 ignore next 2 */
                stream.close();
                reject(error);
            });
        })
            /* c8 ignore next 3 */
            .on("error", (error) => {
            stream.close();
            reject(error);
        });
    });
};
exports.downloadFile = downloadFile;
/**
 * Adds the proper folders to the environment
 * @param baseLibPath the path to this packages lib folder
 */
const setupLambdaEnvironment = (baseLibPath) => {
    // If the FONTCONFIG_PATH is not set, set it to /tmp/fonts
    process.env["FONTCONFIG_PATH"] ??= (0, node_path_1.join)((0, node_os_1.tmpdir)(), "fonts");
    // Set up Home folder if not already set
    process.env["HOME"] ??= (0, node_os_1.tmpdir)();
    // If LD_LIBRARY_PATH is undefined, set it to baseLibPath, otherwise, add it
    if (process.env["LD_LIBRARY_PATH"] === undefined) {
        process.env["LD_LIBRARY_PATH"] = baseLibPath;
    }
    else if (!process.env["LD_LIBRARY_PATH"].startsWith(baseLibPath)) {
        process.env["LD_LIBRARY_PATH"] = [
            baseLibPath,
            ...new Set(process.env["LD_LIBRARY_PATH"].split(":")),
        ].join(":");
    }
};
exports.setupLambdaEnvironment = setupLambdaEnvironment;
/**
 * Determines if the input is a valid URL
 * @param input the input to check
 * @returns boolean indicating if the input is a valid URL
 */
const isValidUrl = (input) => {
    try {
        return Boolean(new URL(input));
    }
    catch {
        return false;
    }
};
exports.isValidUrl = isValidUrl;
/**
 * Determines if the running instance is inside an Amazon Linux 2023 container,
 * AWS_EXECUTION_ENV is for native Lambda instances
 * AWS_LAMBDA_JS_RUNTIME is for netlify instances
 * CODEBUILD_BUILD_IMAGE is for CodeBuild instances
 * VERCEL is for Vercel Functions (Node 20 or later enables an AL2023-compatible environment).
 * @returns boolean indicating if the running instance is inside a Lambda container with nodejs20
 */
const isRunningInAmazonLinux2023 = (nodeMajorVersion) => {
    const awsExecEnv = process.env["AWS_EXECUTION_ENV"] ?? "";
    const awsLambdaJsRuntime = process.env["AWS_LAMBDA_JS_RUNTIME"] ?? "";
    const codebuildImage = process.env["CODEBUILD_BUILD_IMAGE"] ?? "";
    // Check for explicit version substrings, returns on first match
    if (awsExecEnv.includes("20.x") ||
        awsExecEnv.includes("22.x") ||
        awsLambdaJsRuntime.includes("20.x") ||
        awsLambdaJsRuntime.includes("22.x") ||
        codebuildImage.includes("nodejs20") ||
        codebuildImage.includes("nodejs22")) {
        return true;
    }
    // Vercel: Node 20+ is AL2023 compatible
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (process.env["VERCEL"] && nodeMajorVersion >= 20) {
        return true;
    }
    return false;
};
exports.isRunningInAmazonLinux2023 = isRunningInAmazonLinux2023;
const downloadAndExtract = async (url) => {
    const getOptions = new URL(url);
    // Increase the max body length to 60MB for larger files
    getOptions.maxBodyLength = 60 * 1024 * 1024;
    const destDir = (0, node_path_1.join)((0, node_os_1.tmpdir)(), "chromium-pack");
    return new Promise((resolve, reject) => {
        const extractObj = (0, tar_fs_1.extract)(destDir);
        // Setup error handlers for better cleanup
        /* c8 ignore next 5 */
        const cleanupOnError = (err) => {
            (0, node_fs_1.rm)(destDir, { force: true, recursive: true }, () => {
                reject(err);
            });
        };
        // Attach error handler to extract stream
        extractObj.once("error", cleanupOnError);
        // Handle extraction completion
        extractObj.once("finish", () => {
            resolve(destDir);
        });
        const req = follow_redirects_1.default.https.get(url, (response) => {
            /* c8 ignore next */
            if (response.statusCode !== 200) {
                /* c8 ignore next 9 */
                reject(new Error(`Unexpected status code: ${response.statusCode?.toFixed(0) ?? "UNK"}.`));
                return;
            }
            // Pipe the response directly to the extraction stream
            response.pipe(extractObj);
            // Handle response errors
            response.once("error", cleanupOnError);
        });
        // Handle request errors
        req.once("error", cleanupOnError);
        // Set a timeout to avoid hanging requests
        req.setTimeout(60 * 1000, () => {
            /* c8 ignore next 2 */
            req.destroy();
            cleanupOnError(new Error("Request timeout"));
        });
    });
};
exports.downloadAndExtract = downloadAndExtract;
