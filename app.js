const fastify = require("fastify")({
  logger: process.env.NODE_ENV !== "production" ? true : "info", // info only when prod
});

const { leaderboard, main } = require("./router");
const { fastifySchedulePlugin } = require("fastify-schedule");
const { cacheAndConstant, commonSchema, scheduler } = require("./plugin");

// plugin
fastify.register(require("fastify-compression"));
fastify.register(require("fastify-cors"), require("./config/cors"));
fastify.register(fastifySchedulePlugin);
fastify.register(cacheAndConstant);
fastify.register(commonSchema);
fastify.register(scheduler);

const cachePreHandler = require("./common/cachePreHandler")(fastify);

// routing
fastify.register(main(cachePreHandler), { prefix: "/" });
fastify.register(leaderboard(cachePreHandler), { prefix: "/leaderboard" });

module.exports = fastify;
