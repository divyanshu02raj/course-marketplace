/**
 * Creates a symlink to a file
 */
export declare const createSymlink: (source: string, target: string) => Promise<void>;
/**
 * Downloads a file from a URL
 */
export declare const downloadFile: (url: string, outputPath: string) => Promise<void>;
/**
 * Adds the proper folders to the environment
 * @param baseLibPath the path to this packages lib folder
 */
export declare const setupLambdaEnvironment: (baseLibPath: string) => void;
/**
 * Determines if the input is a valid URL
 * @param input the input to check
 * @returns boolean indicating if the input is a valid URL
 */
export declare const isValidUrl: (input: string) => boolean;
/**
 * Determines if the running instance is inside an Amazon Linux 2023 container,
 * AWS_EXECUTION_ENV is for native Lambda instances
 * AWS_LAMBDA_JS_RUNTIME is for netlify instances
 * CODEBUILD_BUILD_IMAGE is for CodeBuild instances
 * VERCEL is for Vercel Functions (Node 20 or later enables an AL2023-compatible environment).
 * @returns boolean indicating if the running instance is inside a Lambda container with nodejs20
 */
export declare const isRunningInAmazonLinux2023: (nodeMajorVersion: number) => boolean;
export declare const downloadAndExtract: (url: string) => Promise<string>;
