import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { DateTime } from "luxon";

export const configTemplate = {
    apikey: randomBytes(16).toString("hex"), // security is my passion.
    port: 3000,
};

export const startTime = DateTime.now();

export const envFlags = {
    "dev": "dev",   /** Whether bomo is running in a development environment */
    "port": "port", /** The port used for the http server, defaults to 3000 */
    /**
     * Pino Logging level (trace, debug, info, warn, error, fatal, or silent)
     * @see https://getpino.io/#/docs/api?id=loggerlevel-string-gettersetter
     */
    "logLevel": "log_level",
};

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export const relativePaths = {
    root,
    data: path.join(root, "data/"),
    config: path.join(root, "data", "config.json"),
    serving: path.join(root, "data", "serving/"),
    logs: path.join(root, "logs/"),
};
