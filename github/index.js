const { bellshadeContributorQuery } = require("./query");
const { getMembers, getUser, searchPRs, getPR } = require("./miniUtils");

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
        url: { name: name ? name : login, html_url, avatar_url },
        pull_requests: pull_requests.length > 0 ? pull_requests : null,
        prs_count: pull_requests.length,
      }))
    );

module.exports = {
  getAllMembersInfo,
  getUserOrgValidContribution,
};
