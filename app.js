const { leaderboard, main } = require("./router");

const fastify = require("fastify")({
  logger: process.env.NODE_ENV !== "production",
});

// plugin
fastify.register(require("fastify-compression"));
fastify.register(require("fastify-cors"), require("./config/cors"));
fastify.register(require("./plugin/cacheAndConstant"));

const cachePreHandler = require("./common/cachePreHandler")(fastify);

// routing
fastify.register(main(cachePreHandler), { prefix: "/" });
fastify.register(leaderboard(cachePreHandler), { prefix: "/leaderboard" });

module.exports = fastify;
