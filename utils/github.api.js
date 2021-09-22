if (process.env.NODE_ENV !== "production") require("dotenv").config();

const { Octokit } = require("@octokit/rest");

const githubApiWrapper = (auth) => {
  const octokit = new Octokit({ auth });

  const getMembers = () =>
    octokit.orgs
      .listPublicMembers({ org: "bellshade" })
      .then(({ data }) => data);
  const getUser = (username) =>
    octokit.users.getByUsername({ username }).then(({ data }) => data);

  const getAllMembersInfo = () =>
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
      );

  return {
    getMembers,
    getUser,
    getAllMembersInfo,
  };
};

module.exports = githubApiWrapper(process.env.GITHUB_TOKEN_API);
