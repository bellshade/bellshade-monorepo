const path = require("path");

const fastify = require("fastify")({
  logger: process.env.NODE_ENV !== "production" ? true : "info", // info only when prod
});

const { leaderboard, main } = require("./router");
const { fastifySchedulePlugin } = require("fastify-schedule");

// plugin
fastify.register(require("fastify-compress"));
fastify.register(require("fastify-cors"), require("./config/cors"));
fastify.register(require("fastify-swagger"), require("./config/swagger"));
fastify.register(fastifySchedulePlugin);
fastify.register(require("fastify-autoload"), {
  dir: path.join(__dirname, "plugin"),
});

const cachePreHandler = require("./common/cachePreHandler")(fastify);

// routing
fastify.register(main(cachePreHandler), { prefix: "/" });
fastify.register(leaderboard(cachePreHandler), { prefix: "/leaderboard" });

module.exports = fastify;
