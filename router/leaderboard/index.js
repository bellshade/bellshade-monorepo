const { getLeaderboard } = require("../../misc").github;
const { contribution, pullRequests } = require("./opts");

const leaderboard = (cachePreHandler) => (fastify, opts, done) => {
  const cache = fastify.cache;
  const { GITHUB_CACHE_KEY, EXPIRY_TTL } = fastify.constant;

  const { PR, CONTRIB } = getLeaderboard(cache);

  fastify.get(
    "/pr",
    {
      schema: {
        description:
          "Leaderboard untuk Top 30 User Github yang memiliki PR terbanyak ke Github Bellshade.",
        response: {
          200: pullRequests,
        },
      },
      preHandler: cachePreHandler(GITHUB_CACHE_KEY.leaderboard.pr),
    },
    (req, reply) => {
      PR()
        .then((data) => {
          cache.set(
            GITHUB_CACHE_KEY.leaderboard.pr,
            data,
            EXPIRY_TTL.leaderboard
          );
          reply.send(data);
        })
        .catch(fastify.APIerrorHandler(req, reply));
    }
  );

  fastify.get(
    "/contribution",
    {
      schema: {
        description:
          "Leaderboard untuk Top 30 User Github yang memiliki kontribusi terbanyak ke Github Bellshade.",
        response: {
          200: contribution,
        },
      },
      preHandler: cachePreHandler(GITHUB_CACHE_KEY.leaderboard.contribution),
    },
    (req, reply) => {
      CONTRIB()
        .then((data) => {
          cache.set(
            GITHUB_CACHE_KEY.leaderboard.contribution,
            data,
            EXPIRY_TTL.leaderboard
          );
          reply.send(data);
        })
        .catch(fastify.APIerrorHandler(req, reply));
    }
  );

  done();
};

module.exports = leaderboard;
