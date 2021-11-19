const fs = require("fs");
const path = require("path");

const poppins = path.dirname(require.resolve("@fontsource/poppins"));
const { registerFont, createCanvas, Image } = require("canvas");

const allRegularFont = path.join(poppins, "files/poppins-all-400-normal.woff");
registerFont(allRegularFont, { family: "Poppins" });

const DEFAULT_FONT = "18px Poppins";
const GREY_RECT = "#555555";
const GREEN_RECT = "#44cc11";

const NAVIGATION_TYPES = ["next", "previous"];

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
};
