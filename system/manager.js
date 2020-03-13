const digger = require("./diggers.js");

const utils = require("../utils/utils.js");
const config = require("../utils/config.js");

module.exports = {
    check(user, amount) {
        if (user == null) return false;
        return !(amount < 0 || isNaN(amount));
    },
    placeHolder(msg, user, amount) {
        amount = utils.formatNum(amount);
        return msg.replace("%member%", user.user.tag).replace("%amount%", amount);
    },
};