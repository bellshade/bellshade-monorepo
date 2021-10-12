if (process.env.NODE_ENV !== "production") require("dotenv").config();

const { Octokit } = require("@octokit/rest");
const miniUtils = require("./miniUtils");

const githubApiWrapper = (auth) => {
  const octokit = new Octokit({ auth });
  const { getMembers, getUser, getPublicEvents, getPR } = miniUtils(octokit);

  const getAllMembersInfo = () =>
    getMembers()
      .then((data) => Promise.all(data.map((users) => getUser(users.login))))
      .then((members) =>
        members.map((member) => ({
          login: member.login,
          avatar_url: member.avatar_url,
          html_url: member.html_url,
          name: member.name,
        }))
      );

  const getUserOrgValidContribution = (username) =>
    getPublicEvents(username)
      .then((events) => {
        const remap = events
          .filter(({ type }) => type === "PullRequestEvent")
          .filter(({ repo }) => repo.name.includes("bellshade"))
          .map((data) => ({
            owner: "bellshade",
            repo: data.repo.name.split("/")[1],
            pull_number: data.payload.pull_request.number,
          }));

        return Promise.all(remap.map(getPR));
      })
      .then((PR) =>
        PR.filter(({ merged }) => merged === true).map((data) => {
          return {
            html_url: data.html_url,
            number: data.number,
            title: data.title,
            created_at: data.created_at,
            merged_at: data.merged_at,
          };
        })
      )
      .then((pull_requests) =>
        getUser(username).then(({ login, avatar_url, html_url, name }) => ({
          url: { avatar_url, html_url, name: name ? name : login },
          pull_requests,
        }))
      );

  return {
    getAllMembersInfo,
    getUserOrgValidContribution,
  };
};

module.exports = githubApiWrapper(process.env.GITHUB_TOKEN_API);
