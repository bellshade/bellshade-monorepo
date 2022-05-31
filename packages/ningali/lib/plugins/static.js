const fp = require("fastify-plugin");
const fastifyStatic = require("@fastify/static");

module.exports = fp((fastify, opts, done) => {
  fastify.requiredStatic.forEach((data, idx) => {
    fastify.register(fastifyStatic, {
      ...data,
      decorateReply: idx < 1,
    });
  });

  done();
});
