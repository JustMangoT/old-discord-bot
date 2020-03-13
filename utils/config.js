const yaml = require("yaml");
const fs = require("fs");

const debug = require("./debugger.js");

module.exports = {
    loadYaml(path, file) {
        return new Promise((resolve) => {
            try {
                resolve(yaml.parse(fs.readFileSync(`${path}/${file}.yml`, 'utf-8')));
            } catch (ex) {
                resolve({});
                debug.error("Cannot load " + file + ".yml file!" + ex);
            }
        });
    },
    async getDefaultConfig() {
        return await this.loadYaml("./resources/config/", "config");
    },
    async getLanguageConfig() {
        return await this.loadYaml("./resources/config/", "language");
    },
};