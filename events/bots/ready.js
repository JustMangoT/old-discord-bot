const db = require("quick.db");

const config = require("../../utils/config.js");
const debug = require("../../utils/debugger.js");
const digger = require("../../system/diggers.js");
const utils = require("../../utils/utils.js");
const eco = require("../../system/economies.js");

module.exports = async (bot) => {
    const botConfig = await config.getDefaultConfig();
    debug.info(`${bot.user.username} is now online in Just Mango Studio!`);

    let allUsers = bot.users.cache.array();
    for (let a = 0; a < allUsers.length; a++) {
        const diggerDurability = botConfig["Digger"]["Digger_1"]["Durability"];
        if (!db.has(allUsers[a].id))
            db.set(allUsers[a].id, { money: 0, diggerStatus: false, diggerLevel: 1, diggerStorage: 0, diggerDurability: diggerDurability, warnTime: 0, muteTime: 0 });
        if (db.get(`${allUsers[a].id}.warnTime`) > 0) {
            setInterval(() => {
                db.add(`${allUsers[a].id}.warnTime`, -1);
            }, 1000 * 3600 * 24);
        }
    }

    let a = 0;
    setInterval(async () => {
        let activity = botConfig["Bot-Settings"]["Status"]["List"][a]
            .replace("%users%", bot.users.cache.size);
        await bot.user.setActivity(activity, {type: botConfig["Bot-Settings"]["Status"]["Type"].toUpperCase()});
        a++;
        if (a >= botConfig["Bot-Settings"]["Status"]["List"].length) a = 0;
    }, (botConfig["Bot-Settings"]["Status"]["Interval"]) * 1000);
};