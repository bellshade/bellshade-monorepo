const { MessageBuilder } = require("discord-webhook-node");
const hook = require("../helpers/hook");

const format = "DD MMMM YYYY HH:mm:ss UTC";

const onSuccessScheduler = (message, time, seconds) => {
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

const onErrorScheduler = (error, err) => {
  const stacktrace = `
\`\`\`
${err.stack}
\`\`\`
  `;

  const embed = new MessageBuilder()
    .setTitle("**[SCHEDULER]**")
    .addField("Status", "Error  :red_circle:")
    .addField("Error", error)
    .addField("Stacktrace", stacktrace)
    .setTimestamp(new Date());

  hook.send(embed);
};

module.exports = {
  onSuccessScheduler,
  onErrorScheduler,
};
