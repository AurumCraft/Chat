const { config } = require("./manifest.json");

function replaceEmojis(message) {
  const emojiDict = Object.fromEntries(config.emoji.list.map(emoji => [emoji.name, emoji.hex]));
  return message.replace(/:([a-zA-Z0-9_]+):/g, (match, p1) => {
    const hex = emojiDict[p1];
    return hex ? String.fromCharCode(parseInt(hex, 16)) : match;
  });
}
function distance(pl1, pl2) {
  return Math.sqrt(Math.pow(pl2.pos.x - pl1.pos.x, 2) + Math.pow(pl2.pos.z - pl1.pos.z, 2));
}
function dim_clr(dimid) {
  return ["a", "c", "d"][dimid];
}

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