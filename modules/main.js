import * as fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from 'url';
import { Server } from "./structures/Server.js";
import { configTemplate, relativePaths } from "./constants.js";
import { log } from "./log.js";

// Initialize a config.json file in the data directory if tit doesn't exist.
const rootPath = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(rootPath, "data");
const configPath = join(dataPath, "config.json");

try {
    fs.accessSync(configPath, fs.constants.F_OK);
} catch(e) {
    log.warn("config.json does not exist! Generating it now...");
    fs.mkdirSync(dataPath, { recursive: true }); // probably unnecessary. creates data dir if it doesn't exist
    fs.appendFileSync(configPath, JSON.stringify(configTemplate));
}

// Create the compressed folder if it doesn't exist.
const servingPath = join(dataPath, "serving");
fs.mkdirSync(servingPath, { recursive: true });

const data = JSON.parse(fs.readFileSync(configPath));
data.paths = relativePaths;
const server = new Server(data);

server.start();
