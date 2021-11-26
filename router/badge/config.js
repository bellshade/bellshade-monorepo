const fs = require("fs");
const path = require("path");
const { makeBadge } = require("badge-maker");
const { DOMParser } = require("@xmldom/xmldom");

const NS = "http://www.w3.org/2000/svg";
const NAVIGATION_TYPES = ["next", "previous"];

const getImage = (pathToImage) => {
  const filePath = path.join(__dirname, pathToImage);

  const base64 = fs.readFileSync(filePath, "base64");

  return `data:image/png;base64,${base64}`;
};

const nextImg = getImage("static/next.png");
const prevImg = getImage("static/previous.png");

const drawer = (text, type = "next") => {
  if (!NAVIGATION_TYPES.includes(type)) throw new Error("Invalid type");

  const doc = new DOMParser().parseFromString(
    makeBadge({
      label: text,
      message: type === "next" ? ">" : "<",
      labelColor: "#555",
      color: "#4c1",
      style: "for-the-badge",
    }),
    "image/svg+xml"
  );

  const href = type === "next" ? nextImg : prevImg;
  const image = doc.createElementNS(NS, "image");
  image.setAttributeNS(NS, "href", href);
  image.setAttributeNS(NS, "width", "15");
  image.setAttributeNS(NS, "height", "15");

  const parentAttr = Object.entries(
    doc.documentElement.getElementsByTagNameNS(NS, "svg")._node.attributes
  )
    .filter((e) => !isNaN(e[0]))
    .map((e) => e[1])
    .map((e) => ({
      [e.name]: e.value,
    }))
    .reduce((curr, acc) => Object.assign(curr, acc));

  const [firstG, secG] = Object.entries(
    doc.documentElement.getElementsByTagNameNS(NS, "g")
  )
    .filter((e) => !isNaN(e[0]))
    .map((e) => e[1]);

  // Center image vertical
  image.setAttributeNS(NS, "y", (2 / 10) * parentAttr.height);

  // remove indicator placeholder text
  secG.removeChild(secG.getElementsByTagNameNS(NS, "text")[1]);

  switch (type) {
    case "next":
      image.setAttributeNS(NS, "x", (8.9 / 10) * parentAttr.width);

      secG.appendChild(image);

      break;
    case "previous":
      image.setAttributeNS(NS, "x", (1 / 22) * parentAttr.width);

      const [firstRectCloned, secRectCloned] = Object.entries(
        doc.documentElement.getElementsByTagNameNS(NS, "rect")
      )
        .filter((e) => !isNaN(e[0]))
        .map((e) => e[1].cloneNode());

      Object.entries(firstG.getElementsByTagNameNS(NS, "rect"))
        .filter((e) => !isNaN(e[0]))
        .forEach((e) => firstG.removeChild(e[1]));

      const { width: secRectClonedWidth } = Object.entries(
        secRectCloned.attributes
      )
        .filter((e) => !isNaN(e[0]))
        .map((e) => e[1])
        .map((e) => ({
          [e.name]: e.value,
        }))
        .reduce((curr, acc) => Object.assign(curr, acc));

      firstRectCloned.setAttributeNS(NS, "x", secRectClonedWidth);
      secRectCloned.setAttributeNS(NS, "x", "");

      firstG.appendChild(secRectCloned);
      firstG.appendChild(firstRectCloned);

      const labelText = secG.getElementsByTagNameNS(NS, "text")[0];

      secG.insertBefore(image, labelText);
      labelText.setAttributeNS(NS, "x", (11.5 / 20) * 10 * parentAttr.width);

      break;
  }

  return doc.toString();
};

module.exports = {
  NAVIGATION_TYPES,
  drawer,
};
