const { getLeaderboard } = require("../github");

const PR = {
  type: "array",
  items: {
    type: "object",
    properties: {
      user: { ref: "UserSchema#" },
      pull_requests: {
        type: "array",
        items: { ref: "PRSchema#" },
      },
      prs_count: { type: "number" },
    },
  },
};

const contribution = {
  type: "array",
  items: {
    type: "object",
    properties: {
      user: { ref: "UserSchema#" },
      contributions: {
        type: "array",
        properties: {
          contributions: { type: "number" },
          repo: { type: "string" },
        },
      },
      contributions_count: { type: "number" },
    },
  },
};

const leaderboard = (cachePreHandler) => (fastify, opts, done) => {
  const { PR, CONTRIB } = getLeaderboard(fastify);
  const { GITHUB_CACHE_KEY, EXPIRY_TTL } = fastify.constant;
  const cache = fastify.cache;

  fastify.get(
    "/pr",
    {
      schema: {
        response: {
          200: PR,
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
