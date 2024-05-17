const fs = require('fs');
const path = require('path');

function writeChatLog(chatType, name, message) {
  fs.appendFile(path.join("logs", `chat-${new Date().toISOString().split('T')[0]}.log`), `[${new Date().toISOString()}] [${["Global", "Local", "Discord"][chatType]}] ${name} » ${message}\n`, (e) => {});
}

function writePMLog(name, name2, message) {
  fs.appendFile(path.join("logs", `chat-${new Date().toISOString().split('T')[0]}.log`), `[${new Date().toISOString()}] [PrivateMessages] [${name} » ${name2}] ${message} \n`, (e) => {});
}

function replaceEmojis(message, emojis) {
  const emojiD = Object.fromEntries(emojis.map(emoji => [emoji.name, emoji.hex]));
  return message.replace(/:([a-zA-Z0-9_]+):/g, (match, p1) => {
    const hex = emojiD[p1];
    return hex ? String.fromCharCode(parseInt(hex, 16)) : match;
  });
}

function distance(pl1, pl2) {
  return Math.sqrt(Math.pow(pl2.pos.x - pl1.pos.x, 2) + Math.pow(pl2.pos.z - pl1.pos.z, 2));
}

function dimClr(dimid) {
  return ["a", "c", "d"][dimid];
}

module.exports = { replaceEmojis, distance, dimClr, writeChatLog, writePMLog }