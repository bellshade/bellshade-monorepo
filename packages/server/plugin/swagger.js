const fp = require("fastify-plugin");

module.exports = fp((fastify, opts, done) => {
  fastify
    .register(require("fastify-swagger"), require("../config/swagger"))
    .ready((err) => {
      if (err) throw err;
      fastify.swagger();
    });

  done();
});
