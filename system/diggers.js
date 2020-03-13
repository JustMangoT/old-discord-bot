const db = require("quick.db");

const manager = require("./manager.js");
const config = require("../utils/config.js");
const eco  = require("./economies.js");
const utils = require("../utils/utils.js");

let digging;

module.exports = {
    getLevel(user) {
        return db.get(`${user.id}.diggerLevel`);
    },
    getStorage(user) {
        return db.get(`${user.id}.diggerStorage`);
    },
    async getMaxStorage(user) {
        const botConfig = await config.getDefaultConfig();
        return botConfig["Diggers"]["Digger_" + this.getLevel(user)]["Max_Storage"];
    },
    getStatus(user) {
        const status = db.get(`${user.id}.diggerStatus`);
        if (status) return "Đang chạy";
        else return "Đang dừng";
    },
    async getPercentFull(user) {
        return utils.formatNum((this.getStorage(user) * 100) / await this.getMaxStorage(user));
    },
    setStatus(user, b) {
        return db.set(`${user.id}.diggerStatus`, b);
    },
    addLevel(user, amount) {
        if (manager.check(user, amount)) {
            db.add(`${user.id}.diggerLevel`, amount);
            return true;
        }
        return false;
    },
    removeLevel(user, amount) {
        if (manager.check(user, amount)) {
            db.add(`${user.id}.diggerLevel`, amount * -1);
            return true;
        }
        return false;
    },
    setLevel(user, amount) {
        if (manager.check(user, amount)) {
            db.set(`${user.id}.diggerLevel`, amount);
            return true;
        }
        return false;
    },
    addStorage(user, amount) {
        if (manager.check(user, amount)) {
            db.add(`${user.id}.diggerStorage`, amount);
            return true;
        }
        return false;
    },
    removeStorage(user, amount) {
        if (manager.check(user, amount)) {
            db.add(`${user.id}.diggerStorage`, amount * -1);
            return true;
        }
        return false;
    },
    setStorage(user, amount) {
        if (manager.check(user, amount)) {
            db.set(`${user.id}.diggerStorage`, amount);
            return true;
        }
        return false;
    },
    async start(msg, user, delay) {
        const lang = await config.getLanguageConfig();
        if (!this.getStatus(user)) {
            this.setStatus(user, true);
            digging = setInterval(async () => {
                if (this.getStorage(user) >= await this.getMaxStorage(user)) {
                    this.setStatus(user, false);
                    await msg.reply(lang["Digger"]["FULL_STORAGE"]);
                    clearInterval(digging);
                    return false;
                }
                this.addStorage(user, 1);
            }, delay * 1000);
            return true;
        }
        return false;
    },
    stop(user) {
        if (this.getStatus(user)) {
            this.setStatus(user, false);
            clearInterval(digging);
            return true;
        }
        return false;
    },
    collect(user) {
        if (this.getStorage(user) !== 0) {
            eco.add(this.getStorage(user));
            this.setStorage(user, 0);
            return true;
        }
        return false;
    },
    async upgrade(user) {
        const botConfig = await config.getDefaultConfig();
        if (this.getLevel(user) < botConfig["Digger"]["Max_Level"]) {
            let nextLevel = this.getLevel(user) + 1;
            this.stop(user);
            this.addLevel(user, 1);
            return true;
        }
        return false;
    }
};