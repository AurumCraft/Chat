const Eris = require("eris");
const { distance, dimClr, replaceEmojis } = require("./utils");
const { config } = require("./manifest.json");

var client = Eris(`Bot ${config.bot.token}`, { intents: ["guildMessages"] });
var antiSpam = {}

client.connect();
client.on("ready", () => client.editStatus(config.bot.status, config.bot.activity));

mc.listen("onChat", (pl, message) => {
  let msg = replaceEmojis(message.trim(), config.emoji.list);
  if (pl.realName in antiSpam && antiSpam[pl.realName] > Date.now()) pl.tell(`§cПодождите ещё ${((antiSpam[pl.realName] - Date.now()) / 1000).toFixed(1)} сек перед тем как писать в чат!`);
  else {
    if (msg.charAt() === config.chat.prefix) {
      msg = msg.replace(config.chat.prefix, "");
      if (msg.length !== 0) {
        mc.broadcast(`§aG §7| §f${pl.realName} §${dimClr(pl.pos.dimid)}» §f${msg}`);
        client.createMessage(config.bot.channel, { "embeds": [{ "color": 0x55FFFF, "description": `**${pl.realName} » ${msg}**` }] });
        (message.match(/@(\w+)/g) || []).map(mention => mention.slice(1)).forEach((name) => {
          if (name !== "here") {
            let pl = mc.getPlayer(name);
            mc.runcmdEx(`execute at "${pl.realName}" run playsound note.bell "${pl.realName}" ~~~ 1 2 1`);
          } else mc.runcmdEx(`playsound note.bell @a ~~~ 1 2 1`);
        });
        log(`[Global] ${pl.realName} » ${msg}`);
      }
    } else {
      mc.getOnlinePlayers().forEach((lpl) => distance(pl, lpl) <= config.chat.radius ? lpl.tell(`§6L §7| §f${pl.realName} §${dimClr(pl.pos.dimid)}» §f${msg}`) : false);
      log(`[Local] ${pl.realName} » ${msg}`);
    } antiSpam[pl.realName] = Date.now() + config.chat.cooldown * 1000;
  } return false;
});

client.on("messageCreate", (ctx) => {
  if (!ctx.author.bot && ctx.channel.id == config.bot.channel) {
    mc.broadcast(`§9D §7| §f${ctx.author.username} §9» §f${ctx.content}`);
    log(`[Discord] ${ctx.author.username} » ${ctx.content}`);
  }
});

mc.listen("onPlayerCmd", (pl, cmd) => {
  cmd = cmd.split(/\s+/);
  if (cmd[0] == "msg") {
    let tr = mc.getPlayer(cmd[1]);
    pl.tell(`§7[ §fВы §8» §f${cmd[1]}§7 ] §f${cmd.slice(2).join(" ")}`);
    tr.tell(`§7[ §f${pl.realName} §8» §fВы§7 ] §f${cmd.slice(2).join(" ")}`);
    mc.runcmdEx(`playsound mob.silverfish.kill "${cmd[1]}"`);
    log(`[PrivateMessages] [${pl.realName} » ${cmd[1]}] ${cmd.slice(2).join(" ")}`);
    return false;
  } else if (cmd[0] == "tell" || cmd[0] == "w") {
    pl.tell(`§cОтключено. Используйте "msg".`);
    return false;
  }
});

mc.listen("onPreJoin", (pl) => client.createMessage(config.bot.channel, { "embeds": [{ "color": 0xFFFF55, "description": `**${pl.realName} присоединился к игре!**` }] }));
mc.listen("onLeft", (pl) => client.createMessage(config.bot.channel, { "embeds": [{ "color": 0xFFFF55, "description": `**${pl.realName} покинул игру!**` }] }));
mc.listen("onPlayerDie", (pl, src) => client.createMessage(config.bot.channel, { "embeds": [{ "color": 0xFF5555, "description": `**${pl.realName} умер, убийца ${src == null ? "[ неизвестно ]" : src.name}!**` }] }));