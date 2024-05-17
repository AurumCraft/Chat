const Eris = require("eris");
const { distance, dimClr, replaceEmojis } = require("./utils");
const { config } = require("./manifest.json");

var client = Eris(config.bot.token);

client.on("ready", () => {
  client.editStatus(config.bot.status, config.bot.activity);
});

mc.listen("onChat", (pl, message) => {
  let msg = replaceEmojis(message.trim());
  if (msg.charAt() === config.chat.prefix) {
    msg = msg.replace(config.chat.prefix, "");
    if (msg.length !== 0) {
      mc.broadcast(`§aG §7| §f${pl.realName} §${dim_clr(pl.pos.dimid)}» §f${msg}`);
      log(`[Chat/Global] ${pl.realName} » ${msg}`);
    }  
  } else {
    mc.getOnlinePlayers().forEach((lpl) => distance(pl, lpl) <= config.chat.radius?lpl.tell(`§6L §7| §f${pl.realName} §${dim_clr(pl.pos.dimid)}» §f${msg}`) : false);
    log(`[Chat/Local] ${pl.realName} » ${msg}`);
  } return false;
});