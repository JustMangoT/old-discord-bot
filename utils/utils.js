const config = require("./config.js");

module.exports = {
    getMember(message, toFind = '') {
        toFind = toFind.toLowerCase();
        let target = message.guild.members.cache.get(toFind);

        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
            });
        }
        if (!target) target = "null";
        return target;
    },
    formatDate(date) {
        return `[${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
    },
    sendMessageDelayDelete(msg, text, delay) {
        return msg.reply(text).then(m => m.delete({timeout: delay}));
    },
    sendMessage(msg, text) {
        return this.sendMessageDelayDelete(msg, text, 3000)
    },
    formatTime(ms) {
        const days = Math.floor(ms % (1000 * 60 * 60 * 24 * 24) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây`
    },
    formatNum(num) {
        return Number.parseInt(num).toFixed(0);
    }
};