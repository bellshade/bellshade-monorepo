const { MessageBuilder } = require("discord-webhook-node");
const hook = require("../../helpers/hook");

const fs = require("fs");
const path = require("path");

const tmpPath = path.join(__dirname, "../tmp");

// If not exist create the directory, if exist delete existing file
if (!fs.existsSync(tmpPath)) {
  fs.mkdirSync(tmpPath);
} else {
  fs.readdirSync(tmpPath)?.forEach((file) =>
    fs.unlinkSync(path.join(tmpPath, file))
  );
}

const onError = async ({ stack, url, error, time }) => {
  const readmifyMessage = `
\`\`\`json
${error}
\`\`\`
  `;
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
    .setTimestamp(time);

  await fs.promises.writeFile(filePath, error);

  await hook.send(embedErrorInfo);
  await hook.sendFile(filePath);

  await fs.promises.unlink(filePath);
};

module.exports = { onError };
