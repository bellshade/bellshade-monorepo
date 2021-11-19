const {
  createCanvas,
  getTextWidth,
  DEFAULT_FONT,
  GREY_RECT,
  GREEN_RECT,
  NAVIGATION_TYPES,
} = require("./config");

const badge = (fastify, opts, done) => {
  fastify.get(
    "/navigation",
    {
      schema: {
        querystring: {
          text: { type: "string" },
          badgeType: { type: "string" },
        },
        required: ["text", "badgeType"],
      },
      preHandler: (req, reply, done) => {
        const type = req.query.badgeType;

        if (!NAVIGATION_TYPES.includes(type))
          reply.code(400).send({
            message: `Parameter "badgeType" tidak valid, diharapkan ${NAVIGATION_TYPES.map(
              (e) => `"${e}"`
            ).join(" atau ")}.`,
          });

        done();
      },
    },
    (req, reply) => {
      const text = req.query.text;

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

          // Draw '>' logo
          ctx.font = '45px "Poppins" bold';
          ctx.fillStyle = "#ffffff";
          ctx.fillText(">", (9.8 / 10) * greyRectWidth, canvas.height / 2 + 14);
          break;

        case "previous":
          ctx.fillStyle = greyRect;
          ctx.fillRect(37, 0, greyRectWidth, 37);

          ctx.fillStyle = greenRect;
          ctx.fillRect(0, 0, 37, 37);

          ctx.font = DEFAULT_FONT;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, 47, canvas.height / 2 + 5);

          ctx.font = '45px "Poppins" bold';
          ctx.fillStyle = "#ffffff";
          ctx.fillText("<", (1 / 20) * canvas.width, canvas.height / 2 + 14);
          break;
      }

      const stream = canvas.createPNGStream("image/png");

      reply.header("Content-Type", "image/png").send(stream);
    }
  );

  done();
};

module.exports = badge;
