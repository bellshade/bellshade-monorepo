const { octokit } = require("../../helpers");

const hasNextPage = require("./hasNextPage");
const getNextPage = require("./getNextPage");

const owner = "bellshade";

const getMembers = () =>
  octokit.orgs
    .listPublicMembers({ org: owner, per_page: 100 })
    .then(({ data }) => data);

const getUser = (username) =>
  octokit.users.getByUsername({ username }).then(({ data }) => data);

const searchPRs = (query) =>
  new Promise((resolve, reject) => {
    (async () => {
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
    })();
  });

const getRepoContributors = (repo) =>
  octokit.repos
    .listContributors({
      owner,
      repo,
      per_page: 100,
    })
    .then(({ data }) => data);

const getOrgRepos = () =>
  octokit.repos
    .listForOrg({
      org: owner,
      sort: "created",
      direction: "asc",
      type: "public",
    })
    .then(({ data }) => data);

const getTree = (repo, tree_sha) =>
  octokit.git
    .getTree({
      owner,
      repo,
      tree_sha,
      recursive: true,
    })
    .then(({ data }) => data);

module.exports = {
  getMembers,
  getUser,
  getTree,
  searchPRs,
  getOrgRepos,
  getRepoContributors,
};
