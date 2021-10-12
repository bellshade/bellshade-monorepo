if (process.env.NODE_ENV !== "production") require("dotenv").config();

const { Octokit } = require("@octokit/rest");
const miniUtils = require("./miniUtils");

const githubApiWrapper = (auth) => {
  const octokit = new Octokit({ auth });
  const { getMembers, getUser, getPublicEvents, getPR } = miniUtils(octokit);

  const getAllMembersInfo = () =>
    getMembers()
      .then((data) => Promise.all(data.map((users) => getUser(users.login)))) // re-get member data
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
          .filter(({ type }) => type === "PullRequestEvent") // Filter pull request event only
          .filter(({ repo }) => repo.name.includes("bellshade")) // Filter repo bellshade only
          .map((data) => ({
            // remap data
            owner: "bellshade",
            repo: data.repo.name.split("/")[1],
            pull_number: data.payload.pull_request.number,
          }));

        return Promise.all(remap.map(getPR));
      })
      .then((PR) =>
        PR.filter(({ merged }) => merged === true) // filter PR yang udah di merge
          .filter(({ user }) => user.login === username) // filter PR yang usernamenya sama dengan param
          .map((data) => ({
            number: data.number,
            title: data.title,
            html_url: data.html_url,
            created_at: data.created_at,
            merged_at: data.merged_at,
          }))
      )
      .then((PR) =>
        PR.filter(
          (v, i, a) => a.findIndex((t) => t.html_url === v.html_url) === i // remove duplicate
        )
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
