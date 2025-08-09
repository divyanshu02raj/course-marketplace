"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_os_1 = require("node:os");
const node_path_1 = require("node:path");
const node_url_1 = require("node:url");
const helper_js_1 = require("./helper.cjs");
const lambdafs_js_1 = require("./lambdafs.cjs");
const paths_cjs_js_1 = require("./paths.cjs.cjs");
const nodeMajorVersion = Number.parseInt(process.versions.node.split(".")[0] ?? "");
// Setup the lambda environment
if ((0, helper_js_1.isRunningInAmazonLinux2023)(nodeMajorVersion)) {
    (0, helper_js_1.setupLambdaEnvironment)((0, node_path_1.join)((0, node_os_1.tmpdir)(), "al2023", "lib"));
}
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Chromium {
    /**
     * Returns a list of additional Chromium flags recommended for serverless environments.
     * The canonical list of flags can be found on https://peter.sh/experiments/chromium-command-line-switches/.
     * Most of below can be found here: https://github.com/GoogleChrome/chrome-launcher/blob/main/docs/chrome-flags-for-tools.md
     */
    static get args() {
        const chromiumFlags = [
            "--ash-no-nudges", // Avoids blue bubble "user education" nudges (eg., "… give your browser a new look", Memory Saver)
            "--disable-domain-reliability", // Disables Domain Reliability Monitoring, which tracks whether the browser has difficulty contacting Google-owned sites and uploads reports to Google.
            "--disable-print-preview", // https://source.chromium.org/search?q=lang:cpp+symbol:kDisablePrintPreview&ss=chromium
            "--disk-cache-size=33554432", // https://source.chromium.org/search?q=lang:cpp+symbol:kDiskCacheSize&ss=chromium Forces the maximum disk space to be used by the disk cache, in bytes.
            "--no-default-browser-check", // Disable the default browser check, do not prompt to set it as such. (This is already set by Playwright, but not Puppeteer)
            "--no-pings", // Don't send hyperlink auditing pings
            "--single-process", // Runs the renderer and plugins in the same process as the browser. NOTES: Needs to be single-process to avoid `prctl(PR_SET_NO_NEW_PRIVS) failed` error
            "--font-render-hinting=none", // https://github.com/puppeteer/puppeteer/issues/2410#issuecomment-560573612
        ];
        const chromiumDisableFeatures = [
            "AudioServiceOutOfProcess",
            "IsolateOrigins",
            "site-per-process", // Disables OOPIF. https://www.chromium.org/Home/chromium-security/site-isolation
        ];
        const chromiumEnableFeatures = ["SharedArrayBuffer"];
        const graphicsFlags = [
            "--ignore-gpu-blocklist", // https://source.chromium.org/search?q=lang:cpp+symbol:kIgnoreGpuBlocklist&ss=chromium
            "--in-process-gpu", // Saves some memory by moving GPU process into a browser process thread
        ];
        // https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/swiftshader.md
        if (this.graphics) {
            graphicsFlags.push(
            // As the unsafe WebGL fallback, SwANGLE (ANGLE + SwiftShader Vulkan)
            "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader");
        }
        else {
            graphicsFlags.push("--disable-webgl");
        }
        const insecureFlags = [
            "--allow-running-insecure-content", // https://source.chromium.org/search?q=lang:cpp+symbol:kAllowRunningInsecureContent&ss=chromium
            "--disable-setuid-sandbox", // Lambda runs as root, so this is required to allow Chromium to run as root
            "--disable-site-isolation-trials", // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableSiteIsolation&ss=chromium
            "--disable-web-security", // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableWebSecurity&ss=chromium
        ];
        const headlessFlags = [
            "--headless='shell'", // We only support running chrome-headless-shell
            "--no-sandbox", // https://source.chromium.org/search?q=lang:cpp+symbol:kNoSandbox&ss=chromium
            "--no-zygote", // https://source.chromium.org/search?q=lang:cpp+symbol:kNoZygote&ss=chromium
        ];
        return [
            ...chromiumFlags,
            `--disable-features=${[...chromiumDisableFeatures].join(",")}`,
            `--enable-features=${[...chromiumEnableFeatures].join(",")}`,
            ...graphicsFlags,
            ...insecureFlags,
            ...headlessFlags,
        ];
    }
    /**
     * Returns whether the graphics stack is enabled or disabled
     * @returns boolean
     */
    static get graphics() {
        return this.graphicsMode;
    }
    /**
     * Sets whether the graphics stack is enabled or disabled.
     * @param true means the stack is enabled. WebGL will work.
     * @param false means that the stack is disabled. WebGL will not work.
     * @default true
     */
    static set setGraphicsMode(value) {
        if (typeof value !== "boolean") {
            throw new TypeError(`Graphics mode must be a boolean, you entered '${String(value)}'`);
        }
        this.graphicsMode = value;
    }
    /**
     * If true, the graphics stack and webgl is enabled,
     * If false, webgl will be disabled.
     * (If false, the swiftshader.tar.br file will also not extract)
     */
    static graphicsMode = true;
    /**
     * Inflates the included version of Chromium
     * @param input The location of the `bin` folder
     * @returns The path to the `chromium` binary
     */
    static async executablePath(input) {
        /**
         * If the `chromium` binary already exists in /tmp/chromium, return it.
         */
        if ((0, node_fs_1.existsSync)((0, node_path_1.join)((0, node_os_1.tmpdir)(), "chromium"))) {
            return (0, node_path_1.join)((0, node_os_1.tmpdir)(), "chromium");
        }
        /**
         * If input is a valid URL, download and extract the file. It will extract to /tmp/chromium-pack
         * and executablePath will be recursively called on that location, which will then extract
         * the brotli files to the correct locations
         */
        if (input && (0, helper_js_1.isValidUrl)(input)) {
            return this.executablePath(await (0, helper_js_1.downloadAndExtract)(input));
        }
        /**
         * If input is defined, use that as the location of the brotli files,
         * otherwise, the default location is ../../bin.
         * A custom location is needed for workflows that using custom packaging.
         */
        input ??= (0, paths_cjs_js_1.getBinPath)();
        /**
         * If the input directory doesn't exist, throw an error.
         */
        if (!(0, node_fs_1.existsSync)(input)) {
            throw new Error(`The input directory "${input}" does not exist. Please provide the location of the brotli files.`);
        }
        // Extract the required files
        const promises = [
            (0, lambdafs_js_1.inflate)((0, node_path_1.join)(input, "chromium.br")),
            (0, lambdafs_js_1.inflate)((0, node_path_1.join)(input, "fonts.tar.br")),
            (0, lambdafs_js_1.inflate)((0, node_path_1.join)(input, "swiftshader.tar.br")),
        ];
        if ((0, helper_js_1.isRunningInAmazonLinux2023)(nodeMajorVersion)) {
            promises.push((0, lambdafs_js_1.inflate)((0, node_path_1.join)(input, "al2023.tar.br")));
        }
        // Await all extractions
        const result = await Promise.all(promises);
        // Returns the first result of the promise, which is the location of the `chromium` binary
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return result.shift();
    }
    /**
     * Downloads or symlinks a custom font and returns its basename, patching the environment so that Chromium can find it.
     */
    static async font(input) {
        const fontsDir = process.env["FONTCONFIG_PATH"] ??
            (0, node_path_1.join)(process.env["HOME"] ?? (0, node_os_1.tmpdir)(), ".fonts");
        // Create fonts directory if it doesn't exist
        if (!(0, node_fs_1.existsSync)(fontsDir)) {
            (0, node_fs_1.mkdirSync)(fontsDir);
        }
        // Convert local path to file URL if needed
        if (!/^https?:\/\//i.test(input)) {
            input = `file://${input}`;
        }
        const url = new node_url_1.URL(input);
        const fontName = url.pathname.split("/").pop();
        if (!fontName) {
            throw new Error(`Invalid font name: ${url.pathname}`);
        }
        const outputPath = `${fontsDir}/${fontName}`;
        // Return font name if it already exists
        if ((0, node_fs_1.existsSync)(outputPath)) {
            return fontName;
        }
        // Handle local file
        if (url.protocol === "file:") {
            try {
                await (0, helper_js_1.createSymlink)(url.pathname, outputPath);
                return fontName;
            }
            catch (error) {
                throw new Error(`Failed to create symlink for font: ${JSON.stringify(error)}`);
            }
        }
        // Handle remote file
        else {
            try {
                await (0, helper_js_1.downloadFile)(input, outputPath);
                return fontName;
            }
            catch (error) {
                throw new Error(`Failed to download font: ${JSON.stringify(error)}`);
            }
        }
    }
}
module.exports = Chromium;
