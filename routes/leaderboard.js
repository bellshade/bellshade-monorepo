const { getLeaderboard } = require("../github");

const leaderboard = (cachePreHandler) => (fastify, opts, done) => {
  const { PR, CONTRIB } = getLeaderboard(fastify);
  const { GITHUB_CACHE_KEY, EXPIRY_TTL } = fastify.constant;
  const cache = fastify.cache;

  fastify.get("/pr", (req, reply) => {
    const dataCache = cache.get(GITHUB_CACHE_KEY.leaderboard.pr);
    if (dataCache) return reply.send(dataCache);

    PR().then((data) => {
      cache.set(GITHUB_CACHE_KEY.leaderboard.pr, data, EXPIRY_TTL.leaderboard);
      reply.send(data);
    });
    // .catch(commonErrorHandler(reply));
  });

  fastify.get("/contribution", (req, reply) => {
    const dataCache = cache.get(GITHUB_CACHE_KEY.leaderboard.contribution);
    if (dataCache) return reply.send(dataCache);

    CONTRIB().then((data) => {
      cache.set(
        GITHUB_CACHE_KEY.leaderboard.contribution,
        data,
        EXPIRY_TTL.leaderboard
      );
      reply.send(data);
    });
    // .catch(commonErrorHandler(reply));
  });

  done();
};

module.exports = leaderboard;
