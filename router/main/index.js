const githubRegex = require("github-username-regex");

const {
  getAllMembersInfo,
  getUserOrgValidContribution,
  getOrgContributors,
  getAllReposWithInfo,
} = require("../../misc").github;
const { members, repos, contributors, prCheck } = require("./opts");

const routerContainer = (cachePreHandler) => (fastify, opts, done) => {
  const { GITHUB_CACHE_KEY, EXPIRY_TTL } = fastify.constant;
  const cache = fastify.cache;

  fastify.get(
    "/",
    {
      schema: {
        description: "Daftar anggota Organisasi Github Bellshade yang Public.",
        response: {
          200: members,
        },
      },
      preHandler: cachePreHandler(GITHUB_CACHE_KEY.members),
    },
    (req, reply) => {
      getAllMembersInfo()
        .then((data) => {
          cache.set(GITHUB_CACHE_KEY.members, data, EXPIRY_TTL.members);
          reply.send(data);
        })
        .catch(fastify.APIerrorHandler(req, reply));
    }
  );

  fastify.get(
    "/repos",
    {
      schema: {
        description:
          "Daftar seluruh repositori publik yang ada di Organisasi Github Bellshade.",
        response: {
          200: repos,
        },
      },
      preHandler: cachePreHandler(GITHUB_CACHE_KEY.repos),
    },
    (req, reply) => {
      getAllReposWithInfo()
        .then((data) => {
          cache.set(GITHUB_CACHE_KEY.repos, data, EXPIRY_TTL.repos);
          reply.send(data);
        })
        .catch(fastify.APIerrorHandler(req, reply));
    }
  );

  fastify.get(
    "/contributors",
    {
      schema: {
        description:
          "Daftar seluruh kontributor yang sudah berkontribusi ke Organisasi Github Bellshade.",
        response: {
          200: contributors,
        },
      },
      preHandler: cachePreHandler(GITHUB_CACHE_KEY.contributors),
    },
    (req, reply) => {
      getOrgContributors()
        .then((data) => {
          cache.set(
            GITHUB_CACHE_KEY.contributors,
            data,
            EXPIRY_TTL.contributors
          );

          reply.send(data);
        })
        .catch(fastify.APIerrorHandler(req, reply));
    }
  );

  fastify.get(
    "/pr_check/:username",
    {
      schema: {
        description:
          "Endpoint yang digunakan untuk mengecek pull request yang sudah di merge ke bellshade. Diperlukan sebuah username github sebagai parameternya.",
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
    (req, reply) => {
      const username = req.params.username;
      const cacheKey = GITHUB_CACHE_KEY.prInfo(username);

      getUserOrgValidContribution(username)
        .then((data) => {
          cache.set(cacheKey, data, EXPIRY_TTL.prInfo);
          reply.send(data);
        })
        .catch((error) => {
          console.log(error);
          // github user not found
          if (error?.response?.status === 422) {
            reply.code(404).send({
              message: `Username github '${username}' tidak ditemukan!`,
              error: "Not Found",
              statusCode: 404,
            });
          } else {
            // other error
            fastify.APIerrorHandler(req, reply)(error);
          }
        });
    }
  );

  done();
};

module.exports = routerContainer;
