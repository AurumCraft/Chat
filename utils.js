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

module.exports = { replaceEmojis, distance, dimClr }