const fp = require("fastify-plugin");
const { fastifySchedulePlugin } = require("@fastify/schedule");

const { _jobs } = require("../misc");

module.exports = fp((fastify, opts, done) => {
  const jobs = _jobs(fastify);

  fastify
    .register(fastifySchedulePlugin)
    .after(() =>
      jobs.forEach((job) => fastify.scheduler.addSimpleIntervalJob(job))
    );

  done();
});
