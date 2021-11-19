const fs = require("fs");
const path = require("path");
const poppins = path.dirname(require.resolve("@fontsource/poppins"));
const { registerFont, createCanvas, loadImage, Image } = require("canvas");

const allRegularFont = path.join(poppins, "files/poppins-all-400-normal.woff");
registerFont(allRegularFont, { family: "Poppins" });

const font = "18px Poppins";
const greyRect = "#555555";
const greenRect = "#44cc11";

function getTextWidth(text) {
  const canvas = createCanvas();
  const ctx = canvas.getContext("2d");

  ctx.font = font;

  const metrics = ctx.measureText(text);
  return metrics.width;
}

const badge = (cachePreHandler) => (fastify, opts, done) => {
  fastify.get(
    "/next",
    {
      schema: {
        querystring: {
          text: { type: "string" },
        },
      },
    },
    (req, reply) => {
      const text = req.query.text;

      // Init canvas
      const greyRectWidth = getTextWidth(text) + 31;
      const canvas = createCanvas(greyRectWidth + 25, 37);
      const ctx = canvas.getContext("2d");

      // Grey Rectangle
      ctx.fillStyle = greyRect;
      ctx.fillRect(0, 0, greyRectWidth, 37);

      // Green Rectangle
      ctx.fillStyle = greenRect;
      ctx.fillRect(greyRectWidth - 10, 0, 37, 37);

      // fill text from query string
      ctx.font = font;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, 10, canvas.height / 2 + 5);

      // Draw '>' logo
      ctx.font = '45px "Poppins" bold';
      ctx.fillStyle = "#ffffff";
      ctx.fillText(">", (9.8 / 10) * greyRectWidth, canvas.height / 2 + 14);

      const stream = canvas.createPNGStream("image/png");

      reply.header("Content-Type", "image/png").send(stream);
    }
  );

  fastify.get(
    "/prev",
    {
      schema: {
        querystring: {
          text: { type: "string" },
        },
      },
    },
    (req, reply) => {
      const text = req.query.text;

      const greyRectWidth = getTextWidth(text) + 31;
      const canvas = createCanvas(greyRectWidth + 25, 37);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = greyRect;
      ctx.fillRect(37, 0, greyRectWidth, 37);

      ctx.fillStyle = greenRect;
      ctx.fillRect(0, 0, 37, 37);

      ctx.font = font;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, 47, canvas.height / 2 + 5);

      ctx.font = '45px "Poppins" bold';
      ctx.fillStyle = "#ffffff";
      ctx.fillText("<", (1 / 20) * canvas.width, canvas.height / 2 + 14);

      const stream = canvas.createPNGStream("image/png");

      reply.header("Content-Type", "image/png").send(stream);
    }
  );

  done();
};

module.exports = badge;
