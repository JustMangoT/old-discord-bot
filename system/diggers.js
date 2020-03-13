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
        return botConfig["Digger"]["Digger_" + this.getLevel(user)]["Max_Storage"];
    },
    getStatus(user) {
        return db.get(`${user.id}.diggerStatus`);
    },
    getStatusAsMessage(user) {
        if (db.get(`${user.id}.diggerStatus`)) return "Đang chạy";
        else return "Đang dừng";
    },
    getDurability(user) {
        return db.get(`${user.id}.diggerDurability`)
    },
    async getMaxDurability(user) {
        const botConfig = await config.getDefaultConfig();
        return botConfig["Digger"]["Digger_" + this.getLevel(user)]["Durability"];
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
    addDurability(user, amount) {
        if (manager.check(user, amount)) {
            db.add(`${user.id}.diggerDurability`, amount);
            return true;
        }
        return false;
    },
    removeDurability(user, amount) {
        if (manager.check(user, amount)) {
            db.add(`${user.id}.diggerDurability`, amount * -1);
            return true;
        }
        return false;
    },
    setDurability(user, amount) {
        if (manager.check(user, amount)) {
            db.set(`${user.id}.diggerDurability`, amount);
            return true;
        }
        return false;
    },
    async start(msg, user, delay) {
        const lang = await config.getLanguageConfig();
        if (!this.getStatus(user)) {
            this.setStatus(user, true);
            digging = setInterval(async () => {
                if (this.getDurability(user) === 0) {
                    await utils.sendMessage(msg, lang["Diggers"]["BREAK"]);
                    this.stop(user);
                    return false;
                }
                if (this.getStorage(user) >= await this.getMaxStorage(user)) {
                    await utils.sendMessage(msg, lang["Diggers"]["FULL_STORAGE"]);
                    this.stop(user);
                    return false;
                }
                this.addStorage(user, 1);
                this.removeDurability(user, 1);
            }, delay * 1000);
            return true;
        }
        await msg.reply(lang["Diggers"]["ALREADY_START"]);
        return false;
    },
    async stop(msg, user) {
        const lang = await config.getLanguageConfig();
        if (this.getStatus(user)) {
            this.setStatus(user, false);
            clearInterval(digging);
            return true;
        }
        await msg.reply(lang["Diggers"]["ALREADY_STOP"]);
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
            this.stop(user);
            this.addLevel(user, 1);
            return true;
        }
        return false;
    }
};