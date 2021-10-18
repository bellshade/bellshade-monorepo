const { getLeaderboard } = require("../github");
const { user, pull_requests } = require("../common/schema");

const contribution = {
  type: "array",
  items: {
    type: "object",
    properties: {
      user: { type: "object", properties: user },
      contributions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            contributions: { type: "number" },
            repo: { type: "string" },
          },
        },
      },
      contributions_count: { type: "number" },
    },
  },
};

const leaderboard = (cachePreHandler) => (fastify, opts, done) => {
  const cache = fastify.cache;
  const { GITHUB_CACHE_KEY, EXPIRY_TTL } = fastify.constant;

  const { PR, CONTRIB } = getLeaderboard(cache);

  fastify.get(
    "/pr",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                user: { type: "object", properties: user },
                pull_requests: {
                  type: "array",
                  items: { type: "object", properties: pull_requests },
                },
                prs_count: { type: "number" },
              },
            },
          },
        },
      },
      preHandler: cachePreHandler(GITHUB_CACHE_KEY.leaderboard.pr),
    },
    async (req, reply) => {
      const data = await PR();

      cache.set(GITHUB_CACHE_KEY.leaderboard.pr, data, EXPIRY_TTL.leaderboard);
      return data;
    }
  );

  fastify.get(
    "/contribution",
    {
      schema: {
        response: {
          200: contribution,
        },
      },
      preHandler: cachePreHandler(GITHUB_CACHE_KEY.leaderboard.contribution),
    },
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
