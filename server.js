const express = require("express");
const compression = require("compression");
const NodeCache = require("node-cache");
const cors = require("cors");

const { getMembers, getUser } = require("./utils/github.api");

const app = express();
const bellshadeCache = new NodeCache();

app.use(compression());
app.use(cors());

app.get("/", (req, res) => {
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
    .then((data) => res.json(data))
    .catch((error) => {
      res.status(503).json({
        error,
        message: "Error while fetching member data github api",
      });
    });
});

app.listen(3000, () => console.log("Listening on port 3000"));
