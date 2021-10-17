const fp = require("fastify-plugin");
const _init = require("../task/init");

module.exports = fp((fastify, opts, done) => {
  const init = _init(fastify);
  init.forEach((job) => fastify.scheduler.addSimpleIntervalJob(job));

  done();
});
