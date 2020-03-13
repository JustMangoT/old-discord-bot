const Discord = require("discord.js");

const config = require("./utils/config.js");
const debug = require("./utils/debugger.js");

const bot = new Discord.Client({ disableMentions: "everyone", fetchAllMembers: true });

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

["command", "event"].forEach(handler => {
    require(`./handlers/${handler}`) (bot);
});

async function setup() {
    const botConfig = await config.getDefaultConfig();
    await bot.login(botConfig["Bot-Settings"]["Token"]);
}
setup().then(() => debug.info(" =+= BOT REGISTERED =+= "));