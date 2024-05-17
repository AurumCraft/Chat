const Eris = require("eris");
const { distance, dimClr, replaceEmojis } = require("./utils");
const { config } = require("./manifest.json");

var client = Eris(`Bot ${config.bot.token}`, { intents: ["guildMessages"] });

mc.listen("onChat", (pl, message) => {
  let msg = replaceEmojis(message.trim(), config.emoji.list);
  if (msg.charAt() === config.chat.prefix) {
    msg = msg.replace(config.chat.prefix, "");
    if (msg.length !== 0) {
      mc.broadcast(`§aG §7| §f${pl.realName} §${dimClr(pl.pos.dimid)}» §f${msg}`);
      client.createMessage(config.bot.channel, { "embeds": { "color": 0x55FFFF, "description": `**${pl.realName} » ${msg}**` } });
      log(`[Chat/Global] ${pl.realName} » ${msg}`);
    }
  } else {
    mc.getOnlinePlayers().forEach((lpl) => distance(pl, lpl) <= config.chat.radius ? lpl.tell(`§6L §7| §f${pl.realName} §${dimClr(pl.pos.dimid)}» §f${msg}`) : false);
    log(`[Chat/Local] ${pl.realName} » ${msg}`);
  } return false;
});

mc.listen("onPreJoin", (pl) => client.createMessage(config.bot.channel, { "embeds": [{ "color": 0xFFFF55, "description": `**${pl.realName} присоединился к игре!**` }] }));
mc.listen("onLeft", (pl) => client.createMessage(config.bot.channel, { "embeds": [{ "color": 0xFFFF55, "description": `**${pl.realName} покинул игру!**` }] }));
mc.listen("onPlayerDie", (pl, src) => client.createMessage(config.bot.channel, { "embeds": [{ "color": 0xFFFF55, "description": `**${pl.realName} умер от: ${src == null ? "неизвестно" : src.name }!**` }] }));