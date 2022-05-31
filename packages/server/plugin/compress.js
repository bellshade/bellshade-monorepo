const fp = require("fastify-plugin");

module.exports = fp((fastify, opts, done) => {
  fastify.register(require("@fastify/compress"));

  done();
});
