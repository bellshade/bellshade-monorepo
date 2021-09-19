const express = require("express");
const compression = require("compression");
const NodeCache = require("node-cache");
const cors = require("cors");

const { getMembers, getUser } = require("./utils/github.api");
const { GITHUB_CACHE_KEY } = require("./config/constant");

const app = express();
const bellshadeCache = new NodeCache();

app.use(compression());
app.use(cors());

app.get("/", (req, res) => {
  const dataCache = bellshadeCache.get(GITHUB_CACHE_KEY);

  if (dataCache) return res.json(dataCache);

  getMembers()
    .then((data) => {
      const refetch = data.map((users) => getUser(users.login));

      return Promise.all(refetch);
    })
    .then((members) =>
      members.map((member) => ({
        login: member.login,
        avatar_url: member.avatar_url,
        html_url: member.html_url,
        name: member.name,
      }))
    )
    .then((data) => {
      bellshadeCache.set(GITHUB_CACHE_KEY, data, 3600 * 5);
      res.json(data);
    })
    .catch((error) => res.status(error.status).json(error.response.data));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
