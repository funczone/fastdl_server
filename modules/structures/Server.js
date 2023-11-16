//import { env } from "node:process";
import { join } from "node:path";
import { App } from "@tinyhttp/app";
import { Eta } from "eta";
import sirv from "sirv";
//import { milliparsec, urlencoded } from "milliparsec";
import { Directory } from "./Filesystem.js";
import { noMatchHandler, onError, requestLogger } from "../middleware.js";
import { log } from "../log.js";

class Server {
    constructor(config) {
        this.config = config;
        this.app = new App({
            settings: {
                networkExtensions: true
            },
            noMatchHandler: noMatchHandler,
            onError: onError,
        });

        // Index folder of served content.
        this.filesystem = new Directory(this.config.paths.serving, true);

        const eta = new Eta({ views: join(this.config.paths.root, "views") })
        this.app.engine("eta", eta.render);
        this.app.use(requestLogger);

        // The meat...
        this.app.use((req, res, next) => {
            let url = req.url;
            if (url.startsWith("/")) url = url.slice(1); 
            url = url.split("/").filter(x => x); // splti array, filter empty values
            
            const node = this.filesystem.getPath(url);
            if (!node || node instanceof File) {
                next();
            } else {
                res.render("files.eta", {
                    title: `fastdl.func.zone - ${url.join("/")}/`,
                    currentPath: `/${url.join("/")}/`,
                    node
                });
            }
        })

        // Static file server.
        this.app.use("/", sirv(this.config.paths.serving, {
            maxAge: 86400, // Cached for 24 hours. This is probably memory intensive...
        }));

        // This feels wrong...
        this.app.use("/assets/", sirv(join(this.config.paths.root, "public"), {
            maxAge: 86400, // Cached for 24 hours
        }));
    }

    /**
     * Shorthand for setting multiple routes at once with the same callback
     * @param {string} method
     * @param {string[]} paths
     * @param {function} callback
     */
    route(method, paths, callback) {
        if (!method) throw new TypeError("method cannot be falsy");
        if (!paths || !Array.isArray(paths)) throw new TypeError("paths must be an array");
        if (!callback) throw new TypeError("callback cannot be falsy");
        if (!paths.length) return;
        for (const path of paths) {
            this.app[method](path, callback);
        }
        return;
    }

    /**
     * Starts the service
     */
    start() {
        // Create http server and start listening
        this.server = this.app.listen(this.config.port, () => {
            log.info(`[READY] Web server listening on port ${this.port}`);
        });
    }
}

export { Server };