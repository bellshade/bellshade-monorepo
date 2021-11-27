const { NAVIGATION_TYPES, drawer } = require("./config");
const { GITHUB_CACHE_KEY, EXPIRY_TTL } = require("../../config/constant");

const badge = (fastify, opts, done) => {
  fastify.get(
    "/navigation",
    {
      schema: {
        description:
          'Membuat badge navigasi selanjutnya dan sebelumnya disertai dengan text. Menerima parameter query string text (bebas) dan badgeType, berupa "next" atau "previous"',
        querystring: {
          text: { type: "string" },
          badgeType: { type: "string" },
        },
        required: ["text", "badgeType"],
        response: {
          400: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
      preHandler: (req, reply, done) => {
        const type = req.query.badgeType;
        const text = req.query.text;

        if (!type || !text)
          reply.code(400).send({
            message: 'Diperlukan parameter "badgeType" dan "text"',
          });

        if (type === "")
          reply
            .code(400)
            .send({ message: "Parameter badgeType tidak boleh kosong !" });

        if (text === "")
          reply
            .code(400)
            .send({ message: "Parameter text tidak boleh kosong !" });

        if (!NAVIGATION_TYPES.includes(type))
          reply.code(400).send({
            message: `Parameter "badgeType" tidak valid, diharapkan ${NAVIGATION_TYPES.map(
              (e) => `"${e}"`
            ).join(" atau ")}.`,
          });

        const key = GITHUB_CACHE_KEY.badge.navigation(type, text);
        const dataCache = fastify.cache.get(key);

        if (dataCache)
          reply.header("Content-Type", "image/svg+xml").send(dataCache);

        done();
      },
    },
    (req, reply) => {
      const text = req.query.text;
      const type = req.query.badgeType;

      const key = GITHUB_CACHE_KEY.badge.navigation(type, text);

      const result = drawer(text, type);

      reply.header("Content-Type", "image/svg+xml").send(result);
      fastify.cache.set(key, result, EXPIRY_TTL.badge);
    }
  );

  done();
};

module.exports = badge;
