const fs = require("fs");

const utils = require("./utils.js");

module.exports = {
    log(type, log) {
        const date = new Date();
        return console.log(`${utils.formatDate(date)} (${type}) ${log}`)
    },
    info(log) {
        return this.log("INFO", log);
    },
    warn(log) {
        return this.log("WARNING", log);
    },
    error(log) {
        return this.log("ERROR", log);
    },
    debug(log, variables, values) {
        return this.log("DEBUG", `${variables} : ${values} - ${log}`);
    },
    logToFile(path, file, type, log) {
        return fs.appendFileSync(`${path}/${file}`, this.log(type, log), 'utf8');
    },
};