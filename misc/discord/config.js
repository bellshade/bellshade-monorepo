const path = require("path");
const fs = require("fs");

const MENTION_DISCORD_USER_ID = process.env.MENTION_DISCORD_USER_ID;
const tmpPath = path.join(__dirname, "tmp");

// If not exist create the directory, if exist delete existing file
if (!fs.existsSync(tmpPath)) {
  fs.mkdirSync(tmpPath);
} else {
  fs.readdirSync(tmpPath)?.forEach((file) =>
    fs.unlinkSync(path.join(tmpPath, file))
  );
}

if (!MENTION_DISCORD_USER_ID)
  throw new Error("REQUIRED MENTION_DISCORD_USER_ID !");

module.exports = {
  MENTION_DISCORD_USER_ID,
  tmpPath,
};
