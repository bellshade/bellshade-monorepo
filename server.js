const githubRegex = require("github-username-regex");
const compression = require("compression");
const NodeCache = require("node-cache");
const express = require("express");
const cors = require("cors");

const {
  getAllMembersInfo,
  getUserOrgValidContribution,
  getOrgContributors,
} = require("./github");

const { leaderboard } = require("./routes");

const { GITHUB_CACHE_KEY, EXPIRY_TTL } = require("./config/constant");
const commonErrorHandler = require("./common/errorHandler");
const corsOptions = require("./config/cors");
const init = require("./task/init");

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

app.get("/contributors", (req, res) => {
  const dataCache = bellshadeCache.get(GITHUB_CACHE_KEY.contributors);
  if (dataCache) return res.json(dataCache);

  getOrgContributors()
    .then((data) => {
      bellshadeCache.set(
        GITHUB_CACHE_KEY.contributors,
        data,
        EXPIRY_TTL.contributors
      );
      res.json(data);
    })
    .catch(commonErrorHandler(res));
});

app.use("/leaderboard", leaderboard(bellshadeCache));

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

  // init(bellshadeCache);
});
