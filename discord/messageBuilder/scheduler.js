const { MessageBuilder } = require("discord-webhook-node");
const hook = require("../../helpers/hook");
const { MENTION_DISCORD_USER_ID, tmpPath } = require("../config");

const fs = require("fs");
const path = require("path");

const format = "DD MMMM YYYY HH:mm:ss UTC";

const onSuccess = (message, time, seconds) => {
  const scheduler = message
    .replace("[SCHEDULER]", "")
    .replace("[SUCCESS]", "")
    .trim();

  const embed = new MessageBuilder()
    .setTitle("**[SCHEDULER]**")
    .addField("Scheduler Name: ", scheduler)
    .addField("Status", "Success  :white_check_mark:")
    .addField("Fetched At", time.format(format))
    .addField("Next Fetch At", time.add(seconds, "s").format(format))
    .setTimestamp(new Date());

  hook.send(embed);
};

const onError = async (error, time) => {
  const stacktrace = `
\`\`\`
${error.stack}
\`\`\`
  `;

  const errorFilename = `scheduler_${time.getTime()}.json`;
  const filePath = path.join(tmpPath, errorFilename);

  const embed = new MessageBuilder()
    .setTitle("**[SCHEDULER]**")
    .addField("Status", "Error  :red_circle:")
    .addField("Stacktrace", stacktrace)
    .addField("Error File", `\`${errorFilename}\``)
    .addField("Mention Maintainer", `<@${MENTION_DISCORD_USER_ID}>`)
    .setTimestamp(time);

  await fs.promises.writeFile(
    filePath,
    JSON.stringify({ stack: error.stack, error }, null, 2)
  );

  await hook.send(embed);
  await hook.sendFile(filePath);

  await fs.promises.unlink(filePath);
};

module.exports = {
  onSuccess,
  onError,
};
