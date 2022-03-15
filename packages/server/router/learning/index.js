const mimeTypes = require("mime-types");

const { reposPath } = require("../../misc/github/config");
const {
  constant: { GITHUB_CACHE_KEY, EXPIRY_TTL },
} = require("@bellshade/shared");
const { tree, errorData } = require("./opts");

const { github } = require("../../misc");
const repoNamesOnly = reposPath.map(({ repo }) => repo);

const key = GITHUB_CACHE_KEY.learning;

const learning = (fastify, opts, done) => {
  const getData = () => fastify.cache.get(key);
  const getLearningData = async () => {
    const dataCache = getData();

    if (!dataCache) {
      const data = await github.getStructureAndFilesContent();

      fastify.cache.set(key, data, EXPIRY_TTL.learning);
    }
  };

  fastify.get(
    "/guide",
    {
      schema: {
        description:
          "Panduan data untuk memudahkan static site generator untuk mendapatkan arahan mengambil file mana saja yang diperlukan.",
      },
    },
    (req, reply) => reply.send(reposPath)
  );

  fastify.get(
    "/tree/:repo",
    {
      schema: {
        description: `Mengambil pohon direktori dari repo ${repoNamesOnly.join(
          ", "
        )}. Data diperbarui tiap 5 hari sekali.`,
        params: {
          repo: { type: "string" },
        },
        required: ["repo"],
        response: {
          200: tree,
          400: errorData,
        },
      },
      preHandler: async (req, reply) => {
        const repo = req.params.repo;

        if (!repo)
          reply.code(400).send({
            message: 'Diperlukan parameter "repo"',
          });

        if (!repoNamesOnly.includes(repo))
          reply.code(400).send({
            message: `Parameter repo yang diberikan tidak valid, value harus berupa ${repoNamesOnly
              .map((repo) => `"${repo}"`)
              .join(", ")}.`,
          });

        await getLearningData();

        done();
      },
    },
    (req, reply) => {
      const dataRepo = getData().find(({ repo }) => repo === req.params.repo);
      const onlyPathAndType = dataRepo.data.map((data) => ({
        path: data.path,
        type: data.type,
      }));

      reply.send(onlyPathAndType);
    }
  );

  fastify.get(
    "/content/:repo",
    {
      schema: {
        description: `Mengambil konten file dari repo ${repoNamesOnly.join(
          ", "
        )} dengan path file yang spesifik. Data diperbarui tiap 5 hari sekali.`,
        querystring: {
          path: { type: "string" },
        },
        params: {
          repo: { type: "string" },
        },
        required: ["path", "repo"],
        response: {
          400: errorData,
          404: errorData,
        },
      },
      preHandler: async (req, reply) => {
        const repo = req.params.repo;
        const path = req.query.path;

        if (!repo || !path)
          reply.code(400).send({
            message: 'Diperlukan parameter "repo" dan query string "path"',
          });

        if (repo === "")
          reply
            .code(400)
            .send({ message: "Parameter repo tidak boleh kosong !" });

        if (path === "")
          reply
            .code(400)
            .send({ message: "Query string path tidak boleh kosong !" });

        if (!repoNamesOnly.includes(repo))
          reply.code(400).send({
            message: `Parameter repo yang diberikan tidak valid, value harus berupa ${repoNamesOnly
              .map((repo) => `"${repo}"`)
              .join(", ")}.`,
          });

        await getLearningData();

        done();
      },
    },
    (req, reply) => {
      const dataRepo = getData().find(({ repo }) => repo === req.params.repo);
      const content = dataRepo.data.find(
        (data) => data.type === "file" && data.path === req.query.path
      );

      if (!content) reply.code(404).send({ message: "File tidak ditemukan!" });

      const mime = mimeTypes.lookup(content.path);
      reply.header("Content-Type", mime).send(content.content);
    }
  );

  done();
};

module.exports = learning;
