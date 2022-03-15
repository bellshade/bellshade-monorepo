const fp = require("fastify-plugin");
const NodeCache = require("node-cache");

const { constant } = require("@bellshade/shared");

module.exports = fp((fastify, opts, done) => {
  fastify.decorate("cache", new NodeCache());
  fastify.decorate("constant", constant);

  done();
});
