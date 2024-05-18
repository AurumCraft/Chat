function replaceEmojis(message, emojis) {
  const emojiDict = Object.fromEntries(emojis.map(emoji => [emoji.name, emoji.hex]));
  return message.replace(/:([a-zA-Z0-9_]+):/g, (match, emojiName) => {
    const hexCode = emojiDict[emojiName];
    return hexCode ? String.fromCharCode(parseInt(hexCode, 16)) : match;
  });
}

function distance(pl1, pl2) {
  const dx = pl2.pos.x - pl1.pos.x;
  const dz = pl2.pos.z - pl1.pos.z;
  return Math.sqrt(dx * dx + dz * dz);
}

function dimClr(dimid) {
  const colors = ["a", "c", "d"];
  return colors[dimid] || "f";
}

module.exports = { replaceEmojis, distance, dimClr };
