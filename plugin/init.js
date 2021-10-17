const fp = require("fastify-plugin");
const init = require("../task/init");

module.exports = fp((fastify, opts, done) => {
  init(fastify);

  done();
});
