declare class Chromium {
    /**
     * Returns a list of additional Chromium flags recommended for serverless environments.
     * The canonical list of flags can be found on https://peter.sh/experiments/chromium-command-line-switches/.
     * Most of below can be found here: https://github.com/GoogleChrome/chrome-launcher/blob/main/docs/chrome-flags-for-tools.md
     */
    static get args(): string[];
    /**
     * Returns whether the graphics stack is enabled or disabled
     * @returns boolean
     */
    static get graphics(): boolean;
    /**
     * Sets whether the graphics stack is enabled or disabled.
     * @param true means the stack is enabled. WebGL will work.
     * @param false means that the stack is disabled. WebGL will not work.
     * @default true
     */
    static set setGraphicsMode(value: boolean);
    /**
     * If true, the graphics stack and webgl is enabled,
     * If false, webgl will be disabled.
     * (If false, the swiftshader.tar.br file will also not extract)
     */
    private static graphicsMode;
    /**
     * Inflates the included version of Chromium
     * @param input The location of the `bin` folder
     * @returns The path to the `chromium` binary
     */
    static executablePath(input?: string): Promise<string>;
    /**
     * Downloads or symlinks a custom font and returns its basename, patching the environment so that Chromium can find it.
     */
    static font(input: string): Promise<string>;
}
export default Chromium;
