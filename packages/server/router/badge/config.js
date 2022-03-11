const fs = require("fs");
const path = require("path");

const { createCanvas, Image } = require("canvas");

const DEFAULT_FONT = "18px Poppins";
const GREY_RECT = "#555555";
const GREEN_RECT = "#44cc11";

const NAVIGATION_TYPES = ["next", "previous"];

const getImage = (pathToImage) => {
  const filePath = path.join(__dirname, pathToImage);

  return (ctx, sx, sy) => {
    const image = new Image();
    const binary = fs.readFileSync(filePath);

    image.onload = () => ctx.drawImage(image, sx, sy);
    image.src = binary;
  };
};

function getTextWidth(text) {
  const canvas = createCanvas();
  const ctx = canvas.getContext("2d");

  ctx.font = DEFAULT_FONT;

  const metrics = ctx.measureText(text);
  return metrics.width + 31;
}

module.exports = {
  createCanvas,
  getTextWidth,
  DEFAULT_FONT,
  GREY_RECT,
  GREEN_RECT,
  NAVIGATION_TYPES,
  nextImg: getImage("static/next.png"),
  prevImg: getImage("static/previous.png"),
};
