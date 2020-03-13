const db = require("quick.db");

const manager = require("./manager.js");
const debug = require("../utils/debugger.js");
const utils = require("../utils/utils.js");

/**
 * @author JustMangoStudio
 * Developed by Just Mango
 */
module.exports = {
    get(user) {
        return db.get(`${user.id}.money`);
    },
    add(user, amount) {
        amount = utils.formatNum(amount);
        if (manager.check(user, amount)) {
            db.add(`${user.id}.money`, amount);
            return true;
        }
        return false;
    },
    remove(user, amount) {
        amount = utils.formatNum(amount);
        if (manager.check(user, amount)) {
            db.add(`${user.id}.money`, amount * -1);
            return true;
        }
        return false;
    },
    set(user, amount) {
        amount = utils.formatNum(amount);
        if (manager.check(user, amount)) {
            db.set(`${user.id}.money`, amount);
            return true;
        }
        return false;
    },
    reset(user) {
        if (manager.check(user, 0)) {
            db.set(`${user.id}.money`, 0);
            return true;
        }
        return false;
    },
    pay(fromUser, toUser, amount) {
        if (fromUser == null) return false;
        amount = utils.formatNum(amount);
        if (manager.check(toUser, amount)) {
            this.add(toUser, amount);
            this.remove(fromUser, amount);
            debug.logToFile("./resources/logs", "economies.txt", "INFO", `${fromUser.tag} pay ${amount} to ${toUser.tag}`);
            return true;
        }
        return false;
    }
};