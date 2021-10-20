const { MessageBuilder } = require("discord-webhook-node");

const commonTitleSheduler = new MessageBuilder().setTitle("**[SCHEDULER]**");

const onSuccessScheduler = () => {
  const embed = commonTitleSheduler;
};
