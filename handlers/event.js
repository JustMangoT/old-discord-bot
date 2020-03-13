const { readdirSync } = require("fs");
const ascii = require("ascii-table");
    
let table = new ascii("Events");
table.setHeading("Event", "Load status");

module.exports = (bot) => {
    readdirSync("./events/").forEach(dir => {
        const events = readdirSync(`./events/${dir}/`).filter(file => file.endsWith(".js"));
        
        for (let file of events) {
            let event = require(`../events/${dir}/${file}`);
            let name = file.split(".")[0];

            if (name) {
                table.addRow(file, '✅');
                bot.on(name, event.bind(null, bot));
            } else {
                table.addRow(file, `❌  -> ERROR`);
            }
        }
    });
    console.log(table.toString());
};