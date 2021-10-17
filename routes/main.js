const {
  getAllMembersInfo,
  getUserOrgValidContribution,
  getOrgContributors,
} = require("../github");

const routerContainer = (fastify, opts, done) => {
  const { GITHUB_CACHE_KEY, EXPIRY_TTL } = fastify.constant;
  const cache = fastify.cache;

  fastify.get("/", (req, reply) => {
    const dataCache = cache.get(GITHUB_CACHE_KEY.members);
    if (dataCache) return reply.send(dataCache);

    getAllMembersInfo().then((data) => {
      cache.set(GITHUB_CACHE_KEY.members, data, EXPIRY_TTL.members);
      reply.send(data);
    });
    // .catch(commonErrorHandler(reply));
  });

  fastify.get("/contributors", (req, reply) => {
    const dataCache = cache.get(GITHUB_CACHE_KEY.contributors);
    if (dataCache) return reply.send(dataCache);

    getOrgContributors().then((data) => {
      cache.set(GITHUB_CACHE_KEY.contributors, data, EXPIRY_TTL.contributors);
      reply.send(data);
    });
    // .catch(commonErrorHandler(reply));
  });

  done();
};

module.exports = routerContainer;
