const fp = require("fastify-plugin");

module.exports = fp((fastify, opts, done) => {
  fastify.register(require("@fastify/cors"), require("../config/cors"));

  done();
});
