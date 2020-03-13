const Discord = require("discord.js");

const eco = require("../../system/economies.js");
const config = require("../../utils/config.js");
const utils = require("../../utils/utils.js");
const manager = require("../../system/manager.js");

const setQueue = new Map();
const payQueue = new Map();

/**
 * @author JustMango
 * Copyright by JustMangoStudio
 */
module.exports = {
    name: "balance",
    aliases: ["bal", "money", "eco", /*Custom aliases*/ "mangocoin"],
    description: "Show member money",
    run: async (bot, msg, args) => {
        const botConfig = await config.getDefaultConfig();
        const lang = await config.getLanguageConfig();
        const ecoLang = lang["Economies"];

        if (msg.deletable) msg.delete();

        const moneyInfo = new Discord.MessageEmbed()
            .setColor(botConfig["Colors"]["Yellow"])
            .setAuthor(`TÀI KHOẢN CỦA ${msg.author.tag}:`.toUpperCase(), msg.author.avatarURL())
            .addField(`» Trong người: `, `${eco.get(msg.author)} ${botConfig["Economies"]["Suffix"]}`, false)
            .addField(`» Trong ngân hàng:`, `(bank here) ${botConfig["Economies"]["Suffix"]}`, false)
            .setThumbnail('https://imgur.com/rL1vPdt.png')
            .setTimestamp()
            .setFooter(`JustMangoStudio`, bot.user.avatarURL());

        if (args[0]) {
            const member = utils.getMember(msg, args.slice(1).join(" "));
            let amount = args.slice(2).join(" ");

            if (args[0].toLowerCase() === "info" || args[0].toLowerCase() === "me") {
                await msg.channel.send(moneyInfo);
            } else if (args[0].toLowerCase() === "pay") {
                if (args[1]) {
                    if (args[1].toLowerCase() === "accept") {
                        // Check if author already in queue
                        if (payQueue.has(msg.author.id)) {
                            eco.set(payQueue.get(msg.author.id)["member"], payQueue.get(msg.author.id)["amount"]);
                            utils.sendMessage(msg, manager.placeHolder(ecoLang["Member"]["PAY_ACCEPT"],
                                payQueue.get(msg.author.id)["member"], payQueue.get(msg.author.id)["amount"]));
                            payQueue.get(msg.author.id)["member"].send(manager.placeHolder(lang["Member"]["PAY_RECEIVE"],
                                msg.author, payQueue.get(msg.author.id)["amount"]));
                            payQueue.delete(msg.author.id);
                        }
                        return utils.sendMessage(msg, ecoLang["Member"]["NO_PAY_QUEUE"]);
                    } else if (args[1].toLowerCase() === "deny") {
                        // Check if author already in queue
                        if (payQueue.has(msg.author.id)) {
                            utils.sendMessage(msg, manager.placeHolder(ecoLang["Member"]["PAY_DENY"],
                                payQueue.get(msg.author.id)["member"], payQueue.get(msg.author.id)["amount"]));
                            payQueue.delete(msg.author.id);
                        }
                        return utils.sendMessage(msg, ecoLang["Member"]["NO_PAY_QUEUE"]);
                    }
                }
                // Check args length
                if (args.length < 3)
                    return utils.sendMessage(msg, ecoLang["Help"]["PAY"]);

                // Check if author already in queue
                if (!payQueue.has(msg.author.id)) {
                    // Check member and amount
                    if (check(msg, member, amount, false)) {
                        payQueue.set(msg.author.id, { "member": member, "amount": amount });
                        return utils.sendMessage(msg, manager.placeHolder(ecoLang["Member"]["ADD_TO_PAY_QUEUE"],
                            member, amount));
                    }
                    // Return if already have queue
                }
                utils.sendMessage(msg, manager.placeHolder(ecoLang["Member"]["ALREADY_IN_PAY_QUEUE"],
                    setQueue.get(msg.author.id)["member"], setQueue.get(msg.author.id)["amount"]));
            }
            if (args[0].toLowerCase() === "add") {
                // Check args length
                if (args.length < 3)
                    return utils.sendMessage(msg, ecoLang["Help"]["ADD"]);
                // Check member and amount
                if (check(msg, member, amount, true)) {
                    if (await eco.add(member, amount))
                        return utils.sendMessage(msg, manager.placeHolder(ecoLang["Admin"]["ADD_SUCCESS"], member, amount));
                }
            } else if (args[0].toLowerCase() === "remove") {
                // Check args length
                if (args.length < 3)
                    return utils.sendMessage(msg, ecoLang["Help"]["REMOVE"]);
                // Check member and amount
                if (check(msg, member, amount, true)) {
                    if (await eco.remove(member, amount))
                        return utils.sendMessage(msg, manager.placeHolder(ecoLang["Admin"]["REMOVE_SUCCESS"], member, amount));
                }
            } else if (args[0].toLowerCase() === "set") {
                if (args[1]) {
                    if (args[1].toLowerCase() === "accept") {
                        // Check if author already in queue
                        if (setQueue.has(msg.author.id)) {
                            eco.set(setQueue.get(msg.author.id)["member"], setQueue.get(msg.author.id)["amount"]);
                            utils.sendMessage(msg, manager.placeHolder(ecoLang["Admin"]["QUEUE_ACCEPT"],
                                setQueue.get(msg.author.id)["member"], setQueue.get(msg.author.id)["amount"]));
                            setQueue.delete(msg.author.id);
                        }
                        return utils.sendMessage(msg, ecoLang["Admin"]["NO_QUEUE"]);
                    } else if (args[1].toLowerCase() === "deny") {
                        // Check if author already in queue
                        if (setQueue.has(msg.author.id)) {
                            utils.sendMessage(msg, manager.placeHolder(ecoLang["Admin"]["QUEUE_DENY"],
                                setQueue.get(msg.author.id)["member"], setQueue.get(msg.author.id)["amount"]));
                            setQueue.delete(msg.author.id);
                        }
                        return utils.sendMessage(msg, ecoLang["Admin"]["NO_QUEUE"]);
                    }
                }

                // Check args length
                if (args.length < 3)
                    return utils.sendMessage(msg, ecoLang["Help"]["SET"]);

                // Check if author already in queue
                if (!setQueue.has(msg.author.id)) {
                    // Check member and amount
                    if (check(msg, member, amount, true)) {
                        setQueue.set(msg.author.id, { "member": member, "amount": amount });
                        return utils.sendMessage(msg, manager.placeHolder(ecoLang["Admin"]["ADD_TO_SET_QUEUE"],
                            member, amount));
                    }
                    // Return if already have queue
                }
                utils.sendMessage(msg, manager.placeHolder(ecoLang["Admin"]["ALREADY_IN_SET_QUEUE"],
                    setQueue.get(msg.author.id)["member"], setQueue.get(msg.author.id)["amount"]));
            } else if (args[0].toLowerCase() === "reset") {
                // Check args length
                if (args.length < 2)
                    return utils.sendMessage(msg, lang["Economies"]["Help"]["RESET"]);
                // Check if author already in queue
                if (!setQueue.has(msg.author.id)) {
                    // Check member and amount
                    if (check(msg, member, 0, true)) {
                        setQueue.set(msg.author.id, { "member": member, "amount": 0 });
                        return utils.sendMessage(msg, manager.placeHolder(lang["Economies"]["Admin"]["ADD_TO_SET_QUEUE"],
                            member, 0));
                    }
                }
                // Return if already have queue
                utils.sendMessage(msg, manager.placeHolder(lang["Economies"]["Admin"]["ALREADY_IN_SET_QUEUE"],
                    setQueue.get(msg.author.id)["member"], setQueue.get(msg.author.id)["amount"]));
            } else {
                utils.sendMessage(msg, lang["Generals"]["UNKNOWN_COMMAND"])
            }
            return;
        }

        function check(msg, user, amount, permission) {
            if (permission) {
                if (!msg.member.roles.cache.has(botConfig["Roles"]["Founders"])) {
                    if (!msg.member.roles.cache.has(botConfig["Roles"]["Administrators"])) {
                        utils.sendMessage(msg, lang["Generals"]["NO_PERMISSION"]);
                        return false;
                    }
                }
            }
            if (user === "null") {
                utils.sendMessage(msg, lang["Members"]["NOT_FOUND"]);
                return false;
            }
            if (amount < 0) {
                utils.sendMessage(msg, lang["Economies"]["Member"]["BELOW_MINIMUM"]);
                return false;
            }
            if (isNaN(amount)) {
                utils.sendMessage(msg, lang["Generals"]["NOT_NUMBER"]);
                return false;
            }
            return true;
        }

        await msg.channel.send(moneyInfo);
    },
};