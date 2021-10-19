const fp = require("fastify-plugin");
const _jobs = require("../task/jobs");

module.exports = fp((fastify, opts, done) => {
  const jobs = _init(_jobs);
  jobs.forEach((job) => fastify.scheduler.addSimpleIntervalJob(job));

  done();
});
