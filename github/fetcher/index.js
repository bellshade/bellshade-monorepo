const octokit = require("../../helpers/octokit");

const hasNextPage = require("./hasNextPage");
const getNextPage = require("./getNextPage");

const getMembers = () =>
  octokit.orgs
    .listPublicMembers({ org: "bellshade", per_pae: 1000 })
    .then(({ data }) => data);

const getUser = (username) =>
  octokit.users.getByUsername({ username }).then(({ data }) => data);

const searchPRs = (query) =>
  new Promise(async (resolve, reject) => {
    try {
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
    } catch (error) {
      reject(error);
    }
  });

const getRepoContributors = (repo) =>
  octokit.repos
    .listContributors({
      owner: "bellshade",
      repo,
      per_page: 100,
    })
    .then(({ data }) => data);

const getOrgRepos = () =>
  octokit.repos
    .listForOrg({
      org: "bellshade",
      sort: "created",
      direction: "asc",
      type: "public",
    })
    .then(({ data }) => data);

module.exports = {
  getMembers,
  getUser,
  searchPRs,
  getOrgRepos,
  getRepoContributors,
};
