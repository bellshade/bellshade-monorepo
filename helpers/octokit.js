if (process.env.NODE_ENV !== "production") require("dotenv").config();

const { Octokit } = require("@octokit/rest");

const githubApiWrapper = (auth) => {
  if (!auth) throw new Error("GITHUB TOKEN REQUIRED!");

  return new Octokit({ auth });
};

module.exports = githubApiWrapper(process.env.GITHUB_TOKEN_API);
