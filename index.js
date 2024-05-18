const Eris = require("eris");
const { distance, dimClr, replaceEmojis } = require("./utils");
const { config } = require("./manifest.json");

const client = Eris(`Bot ${config.bot.token}`, { intents: ["guildMessages"] });
const antiSpam = {};

client.connect();
client.on("ready", () => client.editStatus(config.bot.status, config.bot.activity));

mc.listen("onChat", (pl, message) => {
  const msg = replaceEmojis(message.trim(), config.emoji.list);
  const now = Date.now();
  const playerSpamTime = antiSpam[pl.realName];

  if (playerSpamTime && playerSpamTime > now) {
    const waitTime = ((playerSpamTime - now) / 1000).toFixed(1);
    pl.tell(`§cПодождите ещё ${waitTime} сек. перед тем как писать в чат!`);
    return false;
  }

  if (msg.startsWith(config.chat.prefix)) {
    const cleanMsg = msg.slice(config.chat.prefix.length);
    if (cleanMsg) {
      mc.broadcast(`§aG §7| §f${pl.realName} §${dimClr(pl.pos.dimid)}» §f${cleanMsg}`);
      client.createMessage(config.bot.channel, {
        embeds: [{ color: 0x55FFFF, description: `**${pl.realName} » ${cleanMsg}**` }]
      });

      (message.match(/@(\w+)/g) || []).map(mention => mention.slice(1)).forEach(name => {
        if (name === "here") {
          mc.runcmdEx(`playsound note.bell @a ~~~ 1 2 1`);
        } else {
          const mentionedPlayer = mc.getPlayer(name);
          if (mentionedPlayer) {
            mc.runcmdEx(`execute at "${mentionedPlayer.realName}" run playsound note.bell "${mentionedPlayer.realName}" ~~~ 1 2 1`);
          }
        }
      });

      log(`[Global] ${pl.realName} » ${cleanMsg}`);
    }
  } else {
    mc.getOnlinePlayers().forEach(lpl => {
      if (distance(pl, lpl) <= config.chat.radius) {
        lpl.tell(`§6L §7| §f${pl.realName} §${dimClr(pl.pos.dimid)}» §f${msg}`);
      }
    });
    log(`[Local] ${pl.realName} » ${msg}`);
  }

  antiSpam[pl.realName] = now + config.chat.cooldown * 1000;
  return false;
});

client.on("messageCreate", (ctx) => {
  if (!ctx.author.bot && ctx.channel.id === config.bot.channel) {
    mc.broadcast(`§9D §7| §f${ctx.author.username} §9» §f${ctx.content}`);
    log(`[Discord] ${ctx.author.username} » ${ctx.content}`);
  }
});

mc.listen("onPlayerCmd", (pl, cmd) => {
  const args = cmd.split(/\s+/);
  const command = args[0];
  const target = args[1];
  const message = args.slice(2).join(" ");

  if (command === "msg") {
    if (["@s", "@p", "@e", "@r"].includes(target)) {
      pl.tell("§cНеверный селектор.");
    } else if (target === "@a") {
      pl.tell(`§7[ §fВы §8» §fВсе§7 ] §f${message}`);
      mc.getOnlinePlayers().forEach(pl2 => {
        if (pl2.realName !== pl.realName) {
          pl2.tell(`§7[ §f${pl.realName} §8» §fВы§7 ] §f${message}`);
          mc.runcmdEx(`playsound mob.silverfish.kill "${pl2.realName}"`);
        }
      });
    } else {
      const recipient = mc.getPlayer(target);
      if (recipient) {
        pl.tell(`§7[ §fВы §8» §f${target}§7 ] §f${message}`);
        recipient.tell(`§7[ §f${pl.realName} §8» §fВы§7 ] §f${message}`);
        mc.runcmdEx(`playsound mob.silverfish.kill "${target}"`);
        log(`[PrivateMessages] [${pl.realName} » ${target}] ${message}`);
      } else {
        pl.tell(`§cИгрок ${target} не найден.`);
      }
    }
    return false;
  } else if (command === "tell" || command === "w") {
    pl.tell(`§cОтключено. Используйте "msg".`);
    return false;
  }
});

mc.listen("onPreJoin", (pl) => {
  client.createMessage(config.bot.channel, {
    embeds: [{ color: 0xFFFF55, description: `**${pl.realName} присоединился к игре!**` }]
  });
});

mc.listen("onLeft", (pl) => {
  client.createMessage(config.bot.channel, {
    embeds: [{ color: 0xFFFF55, description: `**${pl.realName} покинул игру!**` }]
  });
});

mc.listen("onPlayerDie", (pl, src) => {
  client.createMessage(config.bot.channel, {
    embeds: [{ color: 0xFF5555, description: `**${pl.realName} умер, убийца ${src ? src.name : "[ неизвестно ]"}!**` }]
  });
});
