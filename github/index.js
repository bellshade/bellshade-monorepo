const blacklist = require("./blacklistedRepos");
const { bellshadeContributorQuery } = require("./query");
const {
  getMembers,
  getUser,
  searchPRs,
  getPR,
  getOrgRepos,
  getRepoContributors,
} = require("./miniUtils");

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
  // Search All merged PR entire bellshade github org
  searchPRs(bellshadeContributorQuery(username))
    .then((PRs) =>
      Promise.all(
        PRs.map((data) => {
          const splitted = data.repository_url.split("/");

          return getPR({
            repo: splitted[splitted.length - 1],
            pull_number: data.number,
            owner: "bellshade",
          }); // Get PR info
        })
      )
    )
    .then((PRs) =>
      PRs.map((pr) => ({
        title: pr.title,
        html_url: pr.html_url,
        number: pr.number,
        created_at: pr.created_at,
        merged_at: pr.merged_at,
      }))
    )
    .then((pull_requests) =>
      getUser(username).then(({ login, avatar_url, html_url, name }) => ({
        user: { name: name ? name : login, html_url, avatar_url },
        pull_requests: pull_requests.length > 0 ? pull_requests : null,
        prs_count: pull_requests.length,
      }))
    );

const getOrgContributors = () =>
  getOrgRepos() // Get all repo
    .then((data) =>
      // eliminate blacklisted repos
      data.map(({ name }) => name).filter((r) => !blacklist.includes(r))
    )
    .then((repos) =>
      Promise.all(
        repos.map(async (repo) => {
          const allContributors = await getRepoContributors(repo);

          return {
            repo,
            contributors: allContributors.map((data) => ({
              login: data.login,
              contributions: data.contributions,
            })),
          };
        })
      )
    )
    .then((contribs) =>
      Promise.all(
        contribs.map(async (contrib) => {
          const reftechUser = await Promise.all(
            contrib.contributors.map(({ login, contributions }) =>
              getUser(login).then(({ login, avatar_url, html_url, name }) => ({
                user: { name: name ? name : login, html_url, avatar_url },
                contributions,
              }))
            )
          );

          return {
            repo: contrib.repo,
            contributors: reftechUser,
          };
        })
      )
    );

module.exports = {
  getAllMembersInfo,
  getUserOrgValidContribution,
  getOrgContributors,
};
