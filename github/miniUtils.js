const octokit = require("../helpers/octokit");

const hasNextPage = require("./hasNextPage");
const getNextPage = require("./getNextPage");

const getMembers = () =>
  octokit.orgs.listPublicMembers({ org: "bellshade" }).then(({ data }) => data);

const getUser = (username) =>
  octokit.users.getByUsername({ username }).then(({ data }) => data);

const getPR = ({ owner, repo, pull_number }) =>
  octokit.rest.pulls
    .get({
      owner,
      repo,
      pull_number,
    })
    .then(({ data }) => data);

const searchPRs = (query) =>
  new Promise(async (resolve) => {
    const prs = await octokit.search.issuesAndPullRequests({
      q: query,
      per_page: 100,
    });

    if (prs) {
      const prsData = prs.data.items;
      if (hasNextPage(prs)) {
        const data = await getNextPage(prs, prsData);
        resolve(data);
      }

      resolve(prsData);
    }
  });

const getOrgRepos = () =>
  octokit.repos
    .listForOrg({
      org: "bellshade",
    })
    .then(({ data }) => data.items);

module.exports = { getMembers, getUser, searchPRs, getPR, getOrgRepos };
