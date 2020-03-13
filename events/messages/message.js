const db = require("quick.db");

const config = require("../../utils/config.js");
const utils = require("../../utils/utils.js");

module.exports = async (bot, msg) => {
    const cfg = await config.getDefaultConfig();
    //const blockedList = await rsManager.getConfig("blockedList");

    const remain = (db.get(`${msg.author.id}.muteTime`) + (1000*3600*24)) - Date.now();
    if (remain > 0) {
        setTimeout(() => {
            msg.member.roles.remove(cfg["Roles"]["Muted"]);
        }, remain);
        return botUtils.sendMessage(msg, `Thời gian còn lại bị cầm trò chuyện còn lại: ${await botUtils.formatTime(remain)}`);
    }

    if (db.get(`${msg.author.id}.warnTime`) >= 3) {
        db.set(`${msg.author.id}.warnTime`, 0);
        db.set(`${msg.author.id}.muteTime`, Date.now());
        botUtils.sendMessage(msg, "Bạn đã vượt quá số lần cảnh cáo! Bạn sẽ bị phạt câm lặng trong 24 giờ!");
        return msg.member.roles.add(cfg["Roles"]["Muted"]);
    }

    /*if (blockedList["Blocked-Invite-Link"]["Enable"] &&
        blockedList["Blocked-Invite-Link"]["Blacked_List"].includes(msg.content)) {
        db.add(`${msg.author.id}.warnTime`, 1);
        return botUtils.sendMessage(msg, cfg["Messages"]["Anti"]["ANTI_INVITE_LINK"]
            .replace("%warn_num%", db.get(`${msg.author.id}.warnTime`)));
    }*/

    /* WAIT FOR RELEASE
    if (msg.author.bot && msg.author.id != "680665562376044588" && 
        !cfg["Channels"].Bot.includes(msg.channel.id))  msg.delete();
    */

    if (msg.author.bot) return;

    // BOT COMMANDS REGISTER
    if (!msg.content.startsWith(cfg["Bot-Settings"]["Prefix"])) return;

    const args = msg.content.slice(cfg["Bot-Settings"]["Prefix"].length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = bot.commands.get(cmd);
    if (!command) command = bot.commands.get(bot.aliases.get(cmd));
    if (command) await command.run(bot, msg, args);
};