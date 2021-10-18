const githubRegex = require("github-username-regex");

const {
  getAllMembersInfo,
  getUserOrgValidContribution,
  getOrgContributors,
} = require("../../github");
const { members, contributors, prCheck } = require("./opts");

const routerContainer = (cachePreHandler) => (fastify, opts, done) => {
  const { GITHUB_CACHE_KEY, EXPIRY_TTL } = fastify.constant;
  const cache = fastify.cache;

  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: members,
        },
      },
      preHandler: cachePreHandler(GITHUB_CACHE_KEY.members),
    },
    async (req, reply) => {
      const data = await getAllMembersInfo();

      cache.set(GITHUB_CACHE_KEY.members, data, EXPIRY_TTL.members);
      reply.send(data);
    }
  );

  fastify.get(
    "/contributors",
    {
      schema: {
        response: {
          200: contributors,
        },
      },
      preHandler: cachePreHandler(GITHUB_CACHE_KEY.contributors),
    },
    async (req, reply) => {
      const data = await getOrgContributors();

      cache.set(GITHUB_CACHE_KEY.contributors, data, EXPIRY_TTL.contributors);
      reply.send(data);
    }
  );

  fastify.get(
    "/pr_check/:username",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            username: {
              type: "string",
            },
          },
          required: ["username"],
        },
        response: {
          200: prCheck,
        },
      },
      preHandler: (req, reply, done) => {
        const username = req.params.username;

        if (!githubRegex.test(username))
          return reply.code(400).send({
            error: "Bad Request",
            message: "Username github yang diberikan tidak valid!",
          });

        const cacheKey = GITHUB_CACHE_KEY.prInfo(username);

        const dataCache = fastify.cache.get(cacheKey);
        if (dataCache) return reply.send(dataCache);

        done();
      },
    },
    async (req, reply) => {
      const username = req.params.username;
      const cacheKey = GITHUB_CACHE_KEY.prInfo(username);

      const data = await getUserOrgValidContribution(username);

      cache.set(cacheKey, data, EXPIRY_TTL.prInfo);
      return data;
    }
  );

  done();
};

module.exports = routerContainer;
