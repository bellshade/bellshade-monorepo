const {
  createCanvas,
  getTextWidth,
  prevImg,
  nextImg,
  DEFAULT_FONT,
  GREY_RECT,
  GREEN_RECT,
  NAVIGATION_TYPES,
} = require("./config");
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

        if (!NAVIGATION_TYPES.includes(type))
          reply.code(400).send({
            message: `Parameter "badgeType" tidak valid, diharapkan ${NAVIGATION_TYPES.map(
              (e) => `"${e}"`
            ).join(" atau ")}.`,
          });

        if (text === null || text === undefined || text === "")
          reply
            .code(400)
            .send({ message: "Paramter text tidak boleh kosong !" });

        const key = GITHUB_CACHE_KEY.badge.navigation(type, text);
        const dataCache = fastify.cache.get(key);

        if (dataCache)
          reply.header("Content-Type", "image/png").send(dataCache);

        done();
      },
    },
    (req, reply) => {
      const text = req.query.text;
      const type = req.query.badgeType;

      const key = GITHUB_CACHE_KEY.badge.navigation(type, text);

      // Init canvas
      const greyRectWidth = getTextWidth(text);
      const canvas = createCanvas(greyRectWidth + 25, 37);
      const ctx = canvas.getContext("2d");

      switch (req.query.badgeType) {
        case "next":
          // Grey Rectangle
          ctx.fillStyle = GREY_RECT;
          ctx.fillRect(0, 0, greyRectWidth, 37);

          // Green Rectangle
          ctx.fillStyle = GREEN_RECT;
          ctx.fillRect(greyRectWidth - 10, 0, 37, 37);

          // fill text from query string
          ctx.font = DEFAULT_FONT;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, 10, canvas.height / 2 + 5);

          // Draw next image to canvas
          nextImg(ctx, (9.89 / 10) * greyRectWidth, canvas.height * (2 / 10));

          break;
        case "previous":
          // Grey Rectangle
          ctx.fillStyle = GREY_RECT;
          ctx.fillRect(37, 0, greyRectWidth, 37);

          // Green Rectangle
          ctx.fillStyle = GREEN_RECT;
          ctx.fillRect(0, 0, 37, 37);

          // fill text from query string
          ctx.font = DEFAULT_FONT;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, 47, canvas.height / 2 + 5);

          // Draw previous image to canvas
          prevImg(ctx, (1 / 32) * canvas.width, canvas.height * (2 / 10));

          break;
      }

      const buffer = canvas.toBuffer("image/png");
      reply.header("Content-Type", "image/png").send(buffer);

      fastify.cache.set(key, buffer, EXPIRY_TTL.badge);
    }
  );

  done();
};

module.exports = badge;
