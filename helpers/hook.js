const { Webhook } = require("discord-webhook-node");

const initHook = (url) => {
  if (!url) throw new Error("REQUIRE DISCORD WEBHOOK URL!");

  const hook = new Webhook({
    url,
    throwErrors: false,
  });

  const IMAGE_URL =
    "https://avatars.githubusercontent.com/u/76999048?s=200&v=4";
  hook.setUsername("Bellshade API LOG");
  hook.setAvatar(IMAGE_URL);

  return hook;
};

module.exports = initHook(process.env.DISCORD_WEBHOOK_URL);
