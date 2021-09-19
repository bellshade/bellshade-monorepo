if (process.env.NODE_ENV !== "production") require("dotenv").config();

const { Octokit } = require("@octokit/rest");

const githubApiWrapper = (auth) => {
  const octokit = new Octokit({ auth });

  return {
    getMembers: () =>
      octokit.orgs
        .listPublicMembers({ org: "bellshade" })
        .then(({ data }) => data),
    getUser: (username) =>
      octokit.users.getByUsername({ username }).then(({ data }) => data),
  };
};

module.exports = githubApiWrapper(process.env.GITHUB_TOKEN_API);
