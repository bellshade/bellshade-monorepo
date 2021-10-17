const fastify = require("fastify")({
  logger: process.env.NODE_ENV !== "production",
});

const { leaderboard, main } = require("./router");
const { cacheAndConstant, commonSchema, init } = require("./plugin");

// plugin
fastify.register(require("fastify-compression"));
fastify.register(require("fastify-cors"), require("./config/cors"));
fastify.register(cacheAndConstant);
fastify.register(commonSchema);

const cachePreHandler = require("./common/cachePreHandler")(fastify);

// routing
fastify.register(main(cachePreHandler), { prefix: "/" });
fastify.register(leaderboard(cachePreHandler), { prefix: "/leaderboard" });

fastify.register(init);

module.exports = fastify;
