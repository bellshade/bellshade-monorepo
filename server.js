const express = require("express");
const compression = require("compression");
const NodeCache = require("node-cache");
const cors = require("cors");

const { getAllMembersInfo } = require("./utils/github.api");
const { GITHUB_CACHE_KEY, EXPIRY_TTL } = require("./config/constant");
const PORT = process.env.PORT || 3000;

const app = express();
const bellshadeCache = new NodeCache();

app.use(compression());
app.use(
  cors({
    origin: [
      "https://bellshade.github.io",
      "http://localhost:3000",
      new RegExp("https://(n*).github.io"),
    ],
    method: "GET",
  })
);

app.get("/", (req, res) => {
  const dataCache = bellshadeCache.get(GITHUB_CACHE_KEY);

  if (dataCache) return res.json(dataCache);

  getAllMembersInfo()
    .then((data) => {
      bellshadeCache.set(GITHUB_CACHE_KEY, data, EXPIRY_TTL);
      res.json(data);
    })
    .catch((error) => res.status(error.status).json(error.response.data));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);

  getAllMembersInfo().then((data) =>
    bellshadeCache.set(GITHUB_CACHE_KEY, data, EXPIRY_TTL)
  );
});
