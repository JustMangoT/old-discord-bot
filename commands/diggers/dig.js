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

        const info = new Discord.MessageEmbed()
            .setColor(botConfig["Colors"]["Yellow"])
            .setAuthor(`THÔNG TIN MÁY ĐÀO CỦA ${msg.author.tag.toUpperCase()}`, msg.author.avatarURL(), 'https://github.com/JustMangoT')
            .addField('Thông tin máy đào:', stripIndents`**- Tên máy:** ${botConfig["Digger"]["Digger_" + digger.getLevel(msg.author)]["Name"]}
                **- Mô tả:** ${botConfig["Digger"]["Digger_" + digger.getLevel(msg.author)]["Description"]} 
                **- Trạng thái:** ${digger.getStatus(msg.author)}`, false)
            .addField('Thông tin kho:', stripIndents`**- Kho:** ${digger.getStorage(msg.author)}/${await digger.getMaxStorage(msg.author)} MGC
                **- Đầy kho:** ${await digger.getPercentFull(msg.author)}%
                **- Thời gian đào 1MGC:** ${utils.formatTime(delay * 1000)}`, false)
            .setThumbnail('https://imgur.com/NXcph99.png')
            .setTimestamp()
            .setFooter(`JustMangoStudio`, bot.user.avatarURL());
        await msg.channel.send(info);
    }
};