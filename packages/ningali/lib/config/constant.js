const path = require("path");

const ROOT = path.dirname(require.main.filename);

// folder configuration
const assets = [
  {
    package: "prismjs",
    path: path.join(require.resolve("prismjs"), ".."),
  },
  {
    package: "bootstrap",
    path: path.join(require.resolve("bootstrap"), "../../../"),
  },
  {
    package: "github-markdown-css",
    path: path.join(require.resolve("github-markdown-css"), ".."),
  },
  {
    package: "@fortawesome/fontawesome-free",
    path: path.join(require.resolve("@fortawesome/fontawesome-free"), "../.."),
  },
];

const remappedAssets = assets.map((asset) => ({
  root: asset.path,
  prefix: `/assets/${asset.package}/`,
}));
const publicPath = {
  root: path.join(__dirname, "../public"),
  prefix: "/public/",
};

module.exports = {
  ROOT,
  requiredStatic: [...remappedAssets, publicPath],
};
