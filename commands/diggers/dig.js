const Discord = require("discord.js");
const { stripIndents } = require("common-tags");

const eco = require("../../system/economies.js");
const digger = require("../../system/diggers.js");
const config = require("../../utils/config.js");
const utils = require("../../utils/utils.js");
/**
 * @author JustMango
 * Copyright by JustMangoStudio
 */
module.exports = {
    name: "digger",
    aliases: ["maydao", "dig"],
    description: "Digger Command",
    run: async (bot, msg, args) => {
        const botConfig = await config.getDefaultConfig();
        const lang = await config.getLanguageConfig();

        const delay = botConfig["Digger"]["Digger_" + digger.getLevel(msg.author)]["Money_Per_Time"];

        if (msg.deletable) msg.delete();

        if (args[0]) {
            if (args[0].toLowerCase() === "start") {
                if (await digger.start(msg, msg.author, delay))
                    utils.sendMessage(msg, lang["Diggers"]["START"]);
            } else if (args[0].toLowerCase() === "stop") {
                if (await digger.stop(msg, msg.author))
                    utils.sendMessage(msg, lang["Diggers"]["STOP"]);
            } else if (args[0].toLowerCase() === "collect") {
                let amount = digger.getStorage(msg.author);
                if (await digger.collect(msg.author))
                    return utils.sendMessage(msg, lang["Diggers"]["COLLECT"].replace("%amount%", amount));
                utils.sendMessage(msg, lang["Diggers"]["COLLECT_ZERO"]);
            } else if (args[0].toLowerCase() === "upgrade") {
                let nextLevel = digger.getLevel(msg.author) + 1;
                if (botConfig["Digger"]["Max_Level"] === digger.getLevel(msg.author))
                    return utils.sendMessage(msg, lang["Diggers"]["UPGRADE_MAX_LEVEL"]);
                if (botConfig["Digger"]["Digger_" + nextLevel]["Price"] > eco.get(msg.author))
                    return utils.sendMessage(msg, lang["Economies"]["Member"]["NOT_ENOUGH"]);
                if (await digger.upgrade(msg, msg.author))
                    utils.sendMessage(msg, lang["Diggers"]["UPGRADE_SUCCESS"]
                        .replace("%from%", botConfig["Digger"]["Digger_" + (nextLevel - 1)]["Name"])
                        .replace("%to%", botConfig["Digger"]["Digger_" + nextLevel]["Name"]));
            } else {
                utils.sendMessage(msg, lang["Generals"]["UNKNOWN_COMMAND"]);
            }
            return;
        }

        const info = new Discord.MessageEmbed()
            .setColor(botConfig["Colors"]["Yellow"])
            .setAuthor(`THÔNG TIN MÁY ĐÀO CỦA ${msg.author.tag.toUpperCase()}`, msg.author.avatarURL(), 'https://github.com/JustMangoT')
            .addField('Thông tin máy đào:', stripIndents`**- Tên máy:** ${botConfig["Digger"]["Digger_" + digger.getLevel(msg.author)]["Name"]}
                **- Mô tả:** ${botConfig["Digger"]["Digger_" + digger.getLevel(msg.author)]["Description"]} 
                **- Trạng thái:** ${digger.getStatusAsMessage(msg.author)}
                **- Độ bền:** ${digger.getDurability(msg.author)}/${await digger.getMaxDurability(msg.author)}`, false)
            .addField('Thông tin kho:', stripIndents`**- Kho:** ${digger.getStorage(msg.author)}/${await digger.getMaxStorage(msg.author)} MGC
                **- Đầy kho:** ${await digger.getPercentFull(msg.author)}%
                **- Thời gian đào 1MGC:** ${utils.formatTime(delay * 1000)}`, false)
            .setThumbnail('https://imgur.com/NXcph99.png')
            .setTimestamp()
            .setFooter(`JustMangoStudio`, bot.user.avatarURL());
        await msg.channel.send(info);
    }
};