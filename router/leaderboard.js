const { getLeaderboard } = require("../github");

const leaderboard = (cachePreHandler) => (fastify, opts, done) => {
  const { PR, CONTRIB } = getLeaderboard(fastify);
  const { GITHUB_CACHE_KEY, EXPIRY_TTL } = fastify.constant;
  const cache = fastify.cache;

  fastify.get(
    "/pr",
    { preHandler: cachePreHandler(GITHUB_CACHE_KEY.leaderboard.pr) },
    async (req, reply) => {
      const data = await PR();

      cache.set(GITHUB_CACHE_KEY.leaderboard.pr, data, EXPIRY_TTL.leaderboard);
      return data;
    }
  );

  fastify.get(
    "/contribution",
    { preHandler: cachePreHandler(GITHUB_CACHE_KEY.leaderboard.contribution) },
    async (req, reply) => {
      const data = await CONTRIB();

      cache.set(
        GITHUB_CACHE_KEY.leaderboard.contribution,
        data,
        EXPIRY_TTL.leaderboard
      );

      return data;
    }
  );

  done();
};

module.exports = leaderboard;
