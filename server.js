const githubRegex = require("github-username-regex");
const compression = require("compression");
const NodeCache = require("node-cache");
const express = require("express");
const cors = require("cors");

const {
  getAllMembersInfo,
  getUserOrgValidContribution,
} = require("./utils/github.api");

const commonErrorHandler = (res) => (error) =>
  res.status(error.status).json(error.response.data);

const { GITHUB_CACHE_KEY, EXPIRY_TTL } = require("./config/constant");
const corsOptions = require("./config/cors");

const PORT = process.env.PORT || 3000;

const app = express();
const bellshadeCache = new NodeCache();

app.use(compression());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  const dataCache = bellshadeCache.get(GITHUB_CACHE_KEY.members);

  if (dataCache) return res.json(dataCache);

  getAllMembersInfo()
    .then((data) => {
      bellshadeCache.set(GITHUB_CACHE_KEY.members, data, EXPIRY_TTL.members);
      res.json(data);
    })
    .catch(commonErrorHandler(res));
});

app.get("/pr_check/:username", (req, res) => {
  const username = req.params.username;
  const cacheKey = GITHUB_CACHE_KEY.prInfo(username);

  if (!githubRegex.test(username))
    return res.status(400).json({
      error: true,
      message: "Username github yang diberikan tidak valid!",
    });

  const dataCache = bellshadeCache.get(cacheKey);
  if (dataCache) return res.json(dataCache);

  getUserOrgValidContribution(username)
    .then((data) => {
      bellshadeCache.set(cacheKey, data, EXPIRY_TTL.prInfo);
      res.json(data);
    })
    .catch(commonErrorHandler(res));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);

  getAllMembersInfo().then((data) =>
    bellshadeCache.set(GITHUB_CACHE_KEY.members, data, EXPIRY_TTL.members)
  );
});
