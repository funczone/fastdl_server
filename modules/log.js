import { env } from "node:process";
import pino from "pino";
import { envFlags, startTime, relativePaths } from "./constants.js";

const level = env[envFlags.logLevel] || "trace";

const log = pino({
    level: level,
    transport: {
        targets: [
            {
                target: "pino/file",
                level: level,
                options: { destination: `${relativePaths.logs}/${startTime.toISODate()}_${startTime.toMillis()}.log` },
            },
            {
                target: "pino-pretty",
                level: level,
                options: {
                    ignore: "pid,hostname",
                },
            },
        ],
    },
});

export { log };
