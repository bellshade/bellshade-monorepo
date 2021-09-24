const express = require("express");
const compression = require("compression");
const NodeCache = require("node-cache");
const cors = require("cors");

const { getAllMembersInfo } = require("./utils/github.api");
const { GITHUB_CACHE_KEY, EXPIRY_TTL } = require("./config/constant");
const corsOptions = require("./config/cors");

const PORT = process.env.PORT || 3000;

const app = express();
const bellshadeCache = new NodeCache();

app.use(compression());
app.use(cors(corsOptions));

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
