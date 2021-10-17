const PORT = process.env.PORT || 3000;
const { leaderboard, main } = require("./routes");

const fastify = require("fastify")({
  logger: process.env.NODE_ENV !== "production",
});

// plugin
fastify.register(require("fastify-compression"));
fastify.register(require("fastify-cors"), require("./config/cors"));
fastify.register(require("./plugin/cacheAndConstant"));

// routing
fastify.register(main, { prefix: "/" });
fastify.register(leaderboard, { prefix: "/leaderboard" });

const start = async () => {
  try {
    await fastify.listen(PORT, "0.0.0.0");
    console.log(`Listening on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
