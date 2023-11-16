import * as fs from "fs";
import { parse } from "path";

/**
 * Beneric class that represents a folder *or* a file.
 * While this technically isn't a proper representation of an Inode, it was the term that was closest to what I was looking for.  
 */
class Inode {
    /**
     * Constructs an Inode, and checks if it actually exists on the disc.
     * @param {string} path The path to the node. 
     */
    constructor(_path) {
        this._path = _path;
        this.parent = null;

        // Sanity check: see if it exists.
        try {
            fs.accessSync(this.path, fs.constants.F_OK);
        } catch(e) {
            throw new Error(`${this.path} does not exist.`);
        }
    }

    /**
     * Gets the name of the node.
     */
    get name() {
        return parse(this.path).name;
    }

    /**
     * Gets the **absolute** path to the node.
     */
    get path() {
        return this._path;
    }
}

/**
 * A File represents a file, and extends an Inode.
 */
class File extends Inode {
    /**
     * Constructs a File.
     * @param {string} path The path to the file. 
     */
    constructor(path) {
        super(path);
        this.type = Symbol("file"); // This is to determine what type of node it is in the templating engine.
    }

    /**
     * Gets the extension to the file.
     */
    get extension() {
        const split = this.path.split(".");
        return split.length == 1 ? null : split[split.length - 1];
    }
}

/**
 * A Directory represents a folder, and extends an Inode.
 */
class Directory extends Inode {
    /**
     * Constructs a Directory.
     * @param {string} path The path to the directory. 
     */
    constructor(path) {
        super(path);
        this.type = Symbol("directory");
        this.nodes = {};
        this._init();
    }

    /**
     * Searches through the directory depth-first and populates the tree.
     */
    async _init() {
        let files;
        try {
            files = await fs.promises.readdir(this.path, { withFileTypes: true });
        } catch(e) {
            throw new Error(`Could not enter the directory for some reason; ${e.message}`, e);
        }
        for (const file of files) {
            if (file.isDirectory()) {
                this.addNode(new Directory(file.path));
            } else if (file.isFile()) {
                this.addNode(new File(file.path));
            }
        }
    }


    /**
     * Tries to get the node of the array "path" provided.
     * @param {string[]} path 
     * @returns 
     */
    async getPath(path) {
        if (!path.length) {
            return this;
        } else {
            const el = path[0];
            path = path.slice(1, path.length);
            if (el in this.nodes) {
                if (this.nodes[el] instanceof Directory) {
                    return this.nodes[el].getPath(path);
                } else {
                    return this.nodes[el];
                }
            } else {
                return null;
            }
        }
    }

    /**
     * Adds a "node" (be that a file or another folder) to the folder. 
     * @param {string} path The path to the node.
     * @returns The Inode-derived class representing the node, or `undefined` if something went wrong.
     */
    addNode(node) {
        node.parent = this;
        this.nodes[node.name] = node;
        return node;
    }
}

export { File, Directory };
