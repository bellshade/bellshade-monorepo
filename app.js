const path = require("path");

const fastify = require("fastify")({
  logger: process.env.NODE_ENV !== "production" ? true : "info", // info only when prod
});

const { leaderboard, main, badge } = require("./router");

// plugin
fastify.register(require("fastify-autoload"), {
  dir: path.join(__dirname, "plugin"),
});

const cachePreHandler = require("./common/cachePreHandler")(fastify);

// routing
fastify.register(main(cachePreHandler));
fastify.register(leaderboard(cachePreHandler), { prefix: "/leaderboard" });
fastify.register(badge, {
  prefix: "/badge",
});

module.exports = fastify;
