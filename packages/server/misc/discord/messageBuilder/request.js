const { MessageBuilder } = require("discord-webhook-node");
const { hook } = require("../../helpers");
const { MENTION_DISCORD_USER_ID, tmpPath } = require("../config");

const fs = require("fs");
const path = require("path");

const onError = async ({ stack, url, error, time }) => {
  const readmifyStack = `
\`\`\`
${stack}
\`\`\`
`;

  const errorFilename = `${url.replace(/\//g, "-")}_${time.getTime()}.json`;
  const filePath = path.join(tmpPath, errorFilename);

  const embedErrorInfo = new MessageBuilder()
    .setTitle("**[REQUEST]**")
    .addField("Status", "Error  :red_circle:")
    .addField("URL", `\`${url}\``)
    .addField("Stacktrace", readmifyStack)
    .addField("Error File", `\`${errorFilename}\``)
    .addField("Mention Maintainer", `<@${MENTION_DISCORD_USER_ID}>`)
    .setTimestamp(time);

  await fs.promises.writeFile(filePath, error);

  await hook.send(embedErrorInfo);
  await hook.sendFile(filePath);

  await fs.promises.unlink(filePath);
};

module.exports = { onError };
